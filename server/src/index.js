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
  exportAllData
} from './db.js';
import { validateAssignment, analyzeMentorPrompt } from './cleanCoreValidator.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

    // 2. If Gemini API key is provided, proxy to Gemini API with strict SAP Architect system instructions
    if (geminiKey) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(geminiKey)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: {
              parts: [{
                text: 'You are a Principal SAP Technical Architect and Clean Core Lead. You teach Modern ABAP (7.50+ / 7.57+ / ABAP Cloud), CDS View Entities (7.55+), SAP RAP (strict ( 2 )), OData V4, and React UI integration. NEVER teach or allow classic ABAP (no WRITE, no FORM/PERFORM, no HEADER LINE, no OCCURS 0, no unreleased tables like BUT000/MARA). Format answers with Level 1 (Layman terms & real-world analogy) followed by Level 2 (SAP Technical specifications, internal mechanics, and Clean Core vs On-Premise distinctions).'
              }]
            },
            contents: [{ role: 'user', parts: [{ text: content }] }]
          })
        });

        const geminiData = await response.json();
        botResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!botResponse) {
          throw new Error('No candidate content received from Gemini API');
        }
      } catch (geminiError) {
        console.warn('Gemini proxy error, falling back to built-in Clean Core analyzer:', geminiError.message);
        botResponse = `*Notice: Live Gemini API proxy failed (${geminiError.message}). Seamlessly switched to built-in SAP Architect Engine:*\n\n` + analyzeMentorPrompt(content);
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
  });
}).catch(err => {
  console.error('Fatal: Could not initialize database:', err);
  process.exit(1);
});
