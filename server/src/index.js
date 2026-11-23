import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
  initDatabase,
  getProgress,
  updateProgress,
  resetProgress,
  getProjectChecklists,
  updateProjectStep,
  addSubmission,
  getSubmissions,
  recordQuizAttempt,
  getQuizHistory,
  getMentorMessages,
  addMentorMessage,
  clearMentorMessages,
  checkAndIncrementApiUsage,
  getApiUsage,
  exportAllData
} from './db.js';
import { validateAssignment, analyzeMentorPrompt } from './cleanCoreValidator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from server/.env or root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

// Sleep helper for retry backoff
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to call Generative Language API with model cascade + retry
async function callGenerativeLanguageApi(model, apiKey, content) {
  const systemInstruction = 'You are a Principal SAP Technical Architect and Clean Core Lead. You teach Modern ABAP (7.50+ / 7.57+ / ABAP Cloud), CDS View Entities (7.55+), SAP RAP (strict ( 2 )), OData V4, and React UI integration. NEVER teach or allow classic ABAP (no WRITE, no FORM/PERFORM, no HEADER LINE, no OCCURS 0, no unreleased tables like BUT000/MARA). Format answers with Level 1 (Layman terms & real-world analogy) followed by Level 2 (SAP Technical specifications, internal mechanics, and Clean Core vs On-Premise distinctions).';

  // Model cascade: Gemma 4 26B primary → Gemini Flash fallback
  const modelCascade = [
    { name: 'gemma-4-26b-a4b-it', retries: 2, label: 'Gemma 4 26B' },
    { name: 'gemma-4-26b-it', retries: 1, label: 'Gemma 4 26B' },
    { name: 'gemini-2.0-flash', retries: 2, label: 'Gemini 2.0 Flash' },
    { name: 'gemini-1.5-flash', retries: 1, label: 'Gemini 1.5 Flash' }
  ];

  let lastError = null;

  for (const modelDef of modelCascade) {
    for (let attempt = 0; attempt <= modelDef.retries; attempt++) {
      try {
        if (attempt > 0) {
          await sleep(1000 * Math.pow(2, attempt - 1));
        }

        const payload = {
          contents: [{
            role: 'user',
            parts: [{
              text: `[SYSTEM INSTRUCTION]\n${systemInstruction}\n\n[USER QUESTION]\n${content}`
            }]
          }]
        };

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelDef.name)}:generateContent`;

        const reqHeaders = {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        };

        let response = await fetch(url, {
          method: 'POST',
          headers: reqHeaders,
          body: JSON.stringify(payload)
        });

        let data = await response.json();

        if (data.error) {
          const msg = data.error.message || '';
          lastError = new Error(msg || `API error (${data.error.code})`);
          // Retryable: high demand / overloaded / 503
          if (msg.includes('high demand') || msg.includes('overloaded') || data.error.code === 503) {
            console.warn(`[AI] ${modelDef.name} attempt ${attempt + 1}: ${msg} — retrying...`);
            continue;
          }
          // Not found / deprecated → skip to next model
          if (msg.includes('not found') || msg.includes('404') || msg.includes('no longer available') || msg.includes('not supported')) {
            console.warn(`[AI] ${modelDef.name}: not available, trying next model...`);
            break;
          }
          throw lastError;
        }

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          console.log(`[AI] Success with ${modelDef.label} (${modelDef.name})`);
          return { text, model: modelDef.label };
        }
        throw new Error('No candidate content received from model API');
      } catch (err) {
        lastError = err;
        if (err.message && (err.message.includes('not found') || err.message.includes('404') || err.message.includes('is not supported') || err.message.includes('no longer available'))) {
          break; // skip to next model
        }
        // For other errors on last retry attempt, continue to next model
        if (attempt >= modelDef.retries) break;
      }
    }
  }

  throw lastError || new Error('All AI models are temporarily unavailable');
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'SAP Modern ABAP, RAP & React Studio API', timestamp: new Date() });
});

// 1. User Progress Endpoints
app.get('/api/progress', (req, res) => {
  try {
    const progress = getProgress();
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/progress', (req, res) => {
  try {
    const updated = updateProgress(req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/progress/reset', (req, res) => {
  try {
    const reset = resetProgress();
    res.json({ message: 'Progress reset successfully', progress: reset });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Project Checklists Endpoints
app.get('/api/projects', (req, res) => {
  try {
    const checklists = getProjectChecklists();
    res.json(checklists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/projects/:id/steps', (req, res) => {
  try {
    const { id } = req.params;
    const { stepIndex, completed } = req.body;
    if (stepIndex === undefined) {
      return res.status(400).json({ error: 'stepIndex is required' });
    }
    const updated = updateProjectStep(id, Number(stepIndex), Boolean(completed));
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Assignment Submissions & Static Code Validation
app.post('/api/assignments/submit', (req, res) => {
  try {
    const { lessonId, userCode } = req.body;
    if (!lessonId || userCode === undefined) {
      return res.status(400).json({ error: 'lessonId and userCode are required' });
    }

    // Run automated Clean Core / Modern ABAP static analyzer
    const validation = validateAssignment(lessonId, userCode);

    // Save to SQLite
    const history = addSubmission({
      lessonId,
      userCode,
      status: validation.status,
      architectFeedback: validation
    });

    res.json({
      validation,
      history
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/assignments/:lessonId', (req, res) => {
  try {
    const { lessonId } = req.params;
    const submissions = getSubmissions(lessonId);
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. AI Mentor Chat & Clean Core Reviewer
app.get('/api/mentor/messages', (req, res) => {
  try {
    const messages = getMentorMessages();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/mentor/messages', (req, res) => {
  try {
    const cleared = clearMentorMessages();
    res.json(cleared);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/mentor/chat', async (req, res) => {
  try {
    const { content, apiKey } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    // 1. Record user message
    addMentorMessage({ role: 'user', content });

    let botResponse = '';
    const geminiKey = apiKey || process.env.GEMINI_API_KEY;

    // 2. Proxy to AI model cascade with daily rate limiting (5,000/day)
    if (geminiKey) {
      const dailyLimit = parseInt(process.env.DAILY_RATE_LIMIT || '5000', 10);
      const usage = checkAndIncrementApiUsage(dailyLimit);

      if (!usage.allowed) {
        console.warn(`Daily API rate limit of ${dailyLimit} requests reached (${usage.count}/${dailyLimit}).`);
        botResponse = `*Notice: Daily API rate limit (${dailyLimit} requests/day) reached. Seamlessly switched to built-in SAP Architect Engine:*\n\n` + analyzeMentorPrompt(content);
      } else {
        try {
          const result = await callGenerativeLanguageApi('gemma-4-26b-a4b-it', geminiKey, content);
          botResponse = result.text;
          if (result.model !== 'Gemma 4 26B') {
            botResponse = `*[Powered by ${result.model} — Gemma 4 26B was temporarily unavailable]*\n\n` + botResponse;
          }
        } catch (apiError) {
          console.warn('AI proxy error, falling back to built-in Clean Core analyzer:', apiError.message);
          botResponse = `*Notice: All live AI models are temporarily at capacity. Using built-in SAP Architect Engine:*\n\n` + analyzeMentorPrompt(content);
        }
      }
    } else {
      // Use built-in Clean Core & RAP static code analyzer
      botResponse = analyzeMentorPrompt(content);
    }

    // 3. Record bot message
    const updatedMessages = addMentorMessage({ role: 'assistant', content: botResponse });
    res.json(updatedMessages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Usage endpoint for rate limiting status
app.get('/api/mentor/usage', (req, res) => {
  try {
    const dailyLimit = parseInt(process.env.DAILY_RATE_LIMIT || '5000', 10);
    const usage = getApiUsage();
    res.json({
      date: usage.date,
      count: usage.count,
      limit: dailyLimit,
      remaining: Math.max(0, dailyLimit - usage.count),
      model: 'gemma-4-26b-a4b-it (cascade: gemini-2.0-flash fallback)'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Quiz Attempts & History
app.post('/api/quiz/attempt', (req, res) => {
  try {
    const { score, total, answersJson } = req.body;
    if (score === undefined || total === undefined) {
      return res.status(400).json({ error: 'score and total are required' });
    }
    const history = recordQuizAttempt({ score: Number(score), total: Number(total), answersJson });
    res.json({ history, progress: getProgress() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/quiz/history', (req, res) => {
  try {
    const history = getQuizHistory();
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Full Data Export
app.get('/api/export', (req, res) => {
  try {
    const exportData = exportAllData();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="sap-rap-react-mastery-progress.json"');
    res.json(exportData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve Client Static Build if available
const clientDistPath = path.join(__dirname, '..', '..', 'client', 'dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Boot the SQLite database and start the server
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 SAP Modern ABAP, RAP & React Studio API running on http://localhost:${PORT}`);
    console.log(`📂 SQLite database initialized: ${path.join(__dirname, '..', 'database.sqlite')}`);
    console.log(`🤖 AI Model cascade: Gemma 4 26B → Gemini 2.0 Flash → Gemini 1.5 Flash → Built-in Engine`);
  });
}).catch(err => {
  console.error('Fatal: Could not initialize database:', err);
  process.exit(1);
});
