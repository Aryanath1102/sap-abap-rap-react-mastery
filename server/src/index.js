import { databaseDiagnostics } from './databaseDiagnostics.js';
import { initAuth, mountAuth, requireAuth } from './auth.js';
import { userContext, databaseHealthy } from './db.js';
import express from 'express';
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
import { MODEL_CASCADE, CASCADE_SUMMARY, callGenerativeLanguageApi } from './aiMentor.js';

export { MODEL_CASCADE, callGenerativeLanguageApi };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from server/.env or root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

export const app = express();
if (process.env.VERCEL) app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;


app.use(express.json({ limit: '5mb' }));

// Health Check
app.get('/api/health', async (req, res) => {
  res.json({ status: 'ok', database: 'mongodb', revision: process.env.VERCEL_GIT_COMMIT_SHA || 'local', service: 'SAP Modern ABAP, RAP & React Studio API', timestamp: new Date() });
});

mountAuth(app);
app.use('/api', requireAuth, (req,res,next) => userContext.run(req.user.id, next));

app.get('/api/db-status', async (req,res) => { await databaseHealthy(); res.json({connected:true,engine:'MongoDB Atlas'}); });

// 1. User Progress Endpoints
app.get('/api/progress', async (req, res) => {
  try {
    const progress = await getProgress();
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/progress', async (req, res) => {
  try {
    const updated = await updateProgress(req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/progress/reset', async (req, res) => {
  try {
    const reset = await resetProgress();
    res.json({ message: 'Progress reset successfully', progress: reset });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Project Checklists Endpoints
app.get('/api/projects', async (req, res) => {
  try {
    const checklists = await getProjectChecklists();
    res.json(checklists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/projects/:id/steps', async (req, res) => {
  try {
    const { id } = req.params;
    const { stepIndex, completed } = req.body;
    if (stepIndex === undefined) {
      return res.status(400).json({ error: 'stepIndex is required' });
    }
    const updated = await updateProjectStep(id, Number(stepIndex), Boolean(completed));
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Assignment Submissions & Static Code Validation
app.post('/api/assignments/submit', async (req, res) => {
  try {
    const { lessonId, userCode, assignmentId } = req.body;
    if (!lessonId || userCode === undefined) {
      return res.status(400).json({ error: 'lessonId and userCode are required' });
    }

    // Run automated Clean Core / Modern ABAP static analyzer
    const validation = validateAssignment(lessonId, userCode);

    // Save to MongoDB Atlas
    const history = await addSubmission({
      lessonId,
      assignmentId,
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

app.get('/api/assignments/:lessonId', async (req, res) => {
  try {
    const { lessonId } = req.params;
    const submissions = await getSubmissions(lessonId);
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. AI Mentor Chat & Clean Core Reviewer
app.get('/api/mentor/messages', async (req, res) => {
  try {
    const messages = await getMentorMessages();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/mentor/messages', async (req, res) => {
  try {
    const cleared = await clearMentorMessages();
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
    await addMentorMessage({ role: 'user', content });

    let botResponse = '';
    const geminiKey = apiKey || process.env.GEMINI_API_KEY;

    // 2. Proxy to AI model cascade with daily rate limiting (5,000/day)
    if (geminiKey) {
      const dailyLimit = parseInt(process.env.DAILY_RATE_LIMIT || '5000', 10);
      const usage = await checkAndIncrementApiUsage(dailyLimit);

      if (!usage.allowed) {
        console.warn(`Daily API rate limit of ${dailyLimit} requests reached (${usage.count}/${dailyLimit}).`);
        botResponse = `*Notice: Daily API rate limit (${dailyLimit} requests/day) reached. Seamlessly switched to built-in SAP Architect Engine:*\n\n` + analyzeMentorPrompt(content);
      } else {
        try {
          const result = await callGenerativeLanguageApi(geminiKey, content);
          botResponse = result.text;
          if (result.tier !== 'primary') {
            botResponse = `*[Powered by ${result.model} — Gemma 4 31B and 26B were temporarily unavailable]*\n\n` + botResponse;
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
    const updatedMessages = await addMentorMessage({ role: 'assistant', content: botResponse });
    res.json(updatedMessages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Usage endpoint for rate limiting status
app.get('/api/mentor/usage', async (req, res) => {
  try {
    const dailyLimit = parseInt(process.env.DAILY_RATE_LIMIT || '5000', 10);
    const usage = await getApiUsage();
    res.json({
      date: usage.date,
      count: usage.count,
      limit: dailyLimit,
      remaining: Math.max(0, dailyLimit - usage.count),
      model: CASCADE_SUMMARY,
      liveApiConfigured: Boolean(process.env.GEMINI_API_KEY)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Quiz Attempts & History
app.post('/api/quiz/attempt', async (req, res) => {
  try {
    const { score, total, answersJson } = req.body;
    if (score === undefined || total === undefined) {
      return res.status(400).json({ error: 'score and total are required' });
    }
    const history = await recordQuizAttempt({ score: Number(score), total: Number(total), answersJson });
    res.json({ history, progress: await getProgress() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/quiz/history', async (req, res) => {
  try {
    const history = await getQuizHistory();
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Full Data Export
app.get('/api/export', async (req, res) => {
  try {
    const exportData = await exportAllData();
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
  app.get('/{*path}', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.use((err,req,res,next) => {
  if (res.headersSent) return next(err);
  console.error('API request failed:', err.code || err.name);
  res.status(err.code === 11000 ? 409 : 503).json({error:err.code === 11000 ? 'Account already exists.' : 'Service temporarily unavailable.'});
});
let ready;
export function initialize() {
 if (!ready) ready=initDatabase().then(initAuth).catch(e=>{ready=null;throw e;});
 return ready;
}
export default async function handler(req,res) {
 try { await initialize(); return app(req,res); }
 catch(e) { console.error('Database initialization failed:',JSON.stringify(databaseDiagnostics(e))); return res.status(503).json({error:'Database unavailable. Check the Vercel database configuration.'}); }
}
if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
 initialize().then(()=>app.listen(PORT,()=>console.log(`API running on port ${PORT} with MongoDB Atlas`))).catch(e=>{console.error(e.message);process.exitCode=1;});
}
