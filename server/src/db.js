import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';
import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = process.env.SQLITE_PATH || path.join(__dirname, '..', 'database.sqlite');

let db = null;

// Persist the in-memory SQLite database to database.sqlite
function persist() {
  if (!db) return;
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_FILE + '.tmp', buffer);
    fs.renameSync(DB_FILE + '.tmp', DB_FILE);
  } catch (err) {
    throw new Error('Failed to persist SQLite database', { cause: err });
  }
}

export async function initDatabase() {
  if (db) return db;

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_FILE)) {
    try {
      const fileBuffer = fs.readFileSync(DB_FILE);
      db = new SQL.Database(fileBuffer);
    } catch (err) {
      console.warn('Could not read existing database.sqlite, creating fresh database:', err);
      db = new SQL.Database();
    }
  } else {
    db = new SQL.Database();
  }

  db.run('CREATE TABLE IF NOT EXISTS user_data (user_id TEXT PRIMARY KEY, data TEXT NOT NULL)');
  // Auto-initialize schema
  db.run(`
    CREATE TABLE IF NOT EXISTS user_progress (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      completed_days TEXT DEFAULT '[]',
      solved_exercises TEXT DEFAULT '[]',
      best_quiz_score INTEGER DEFAULT 0,
      streak INTEGER DEFAULT 1,
      active_theme TEXT DEFAULT 'light',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS project_checklists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id TEXT NOT NULL,
      step_index INTEGER NOT NULL,
      completed INTEGER DEFAULT 0,
      UNIQUE(project_id, step_index)
    );

    CREATE TABLE IF NOT EXISTS assignment_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lesson_id TEXT NOT NULL,
      user_code TEXT NOT NULL,
      status TEXT NOT NULL,
      architect_feedback TEXT,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      score INTEGER NOT NULL,
      total INTEGER NOT NULL,
      answers_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS mentor_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed default user progress row if not present
  const existingProg = db.exec('SELECT id FROM user_progress WHERE id = 1');
  if (!existingProg.length || !existingProg[0].values.length) {
    db.run(`
      INSERT INTO user_progress (id, completed_days, solved_exercises, best_quiz_score, streak, active_theme, updated_at)
      VALUES (1, '[]', '[]', 0, 0, 'light', datetime('now'))
    `);
  }

  // Seed initial mentor message if empty
  const existingMessages = db.exec('SELECT id FROM mentor_messages LIMIT 1');
  if (!existingMessages.length || !existingMessages[0].values.length) {
    db.run(`
      INSERT INTO mentor_messages (role, content, created_at)
      VALUES ('assistant', 'Welcome to the **SAP Modern ABAP, RAP & React Studio**! I am your Senior SAP Technical Architect & Clean Core Advisor. Paste your ABAP, CDS View Entities, RAP Behavior Definitions (BDEF), EML, or React OData V4 code for instant static compliance analysis, or ask any technical architecture question.', datetime('now'))
    `);
  }

  persist();
  return db;
}

// Helper: Convert sql.js exec result to array of plain objects
function rowsToObjects(res) {
  if (!res || !res.length) return [];
  const { columns, values } = res[0];
  return values.map(row => {
    const obj = {};
    columns.forEach((col, idx) => {
      obj[col] = row[idx];
    });
    return obj;
  });
}

// Helper: Single row query
export function getOne(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  let res = null;
  if (stmt.step()) {
    res = stmt.getAsObject();
  }
  stmt.free();
  return res;
}

// Helper: Multi-row query
export function getAll(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

// Helper: Run statement with persistence
export function runSql(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.run(params);
  stmt.free();
  persist();
}

// =========================================================================
// DATA ACCESS FUNCTIONS
// =========================================================================

export const userContext = new AsyncLocalStorage();
function userId() { const id = userContext.getStore(); if (!id) throw new Error('Authenticated user required'); return id; }
function state() {
  const row = getOne('SELECT data FROM user_data WHERE user_id=?', [userId()]);
  return row ? JSON.parse(row.data) : { progress: {completed_days:[], solved_exercises:[], best_quiz_score:0, streak:0, active_theme:'light'}, projects:{}, submissions:[], quizzes:[], messages:[] };
}
function save(s) { runSql('INSERT INTO user_data VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET data=excluded.data', [userId(), JSON.stringify(s)]); }
export function getProgress() { return state().progress; }
export function updateProgress(data) { const s=state(); for (const k of ['completed_days','solved_exercises','best_quiz_score','streak','active_theme']) if (data[k] !== undefined) s.progress[k]=data[k]; save(s); return s.progress; }
export function resetProgress() { const s=state(); s.progress={completed_days:[],solved_exercises:[],best_quiz_score:0,streak:0,active_theme:s.progress.active_theme}; s.projects={}; s.submissions=[]; s.quizzes=[]; save(s); return s.progress; }
export function getProjectChecklists() { return state().projects; }
export function updateProjectStep(id, step, completed) { const s=state(); const steps=new Set(s.projects[id] || []); completed ? steps.add(step) : steps.delete(step); s.projects[id]=[...steps]; save(s); return s.projects; }
export function addSubmission({lessonId,userCode,status,architectFeedback}) { const s=state(); s.submissions.unshift({id:randomUUID(),lesson_id:lessonId,user_code:userCode,status,architect_feedback:architectFeedback,submitted_at:new Date().toISOString()}); if(status==='passed' && !s.progress.solved_exercises.includes(lessonId)) s.progress.solved_exercises.push(lessonId); save(s); return getSubmissions(lessonId); }
export function getSubmissions(id) { return state().submissions.filter(s=>!id || s.lesson_id===id); }
export function recordQuizAttempt({score,total,answersJson}) { const s=state(); s.quizzes.unshift({id:randomUUID(),score,total,answers_json:JSON.stringify(answersJson),created_at:new Date().toISOString()}); s.progress.best_quiz_score=Math.max(s.progress.best_quiz_score,score); save(s); return s.quizzes; }
export function getQuizHistory() { return state().quizzes; }
export function getMentorMessages() { return state().messages; }
export function addMentorMessage({role,content}) { const s=state(); s.messages.push({id:randomUUID(),role,content,created_at:new Date().toISOString()}); save(s); return s.messages; }
export function clearMentorMessages() { const s=state(); s.messages=[]; save(s); return []; }
export function exportAllData() { return {progress:getProgress(),projectChecklists:getProjectChecklists(),submissions:getSubmissions(),quizHistory:getQuizHistory(),mentorMessages:getMentorMessages()}; }

// Track and enforce daily rate limits for AI calls
export function checkAndIncrementApiUsage(dailyLimit = 5000) {
  if (!db) return { allowed: true, count: 0, limit: dailyLimit, remaining: dailyLimit };
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  // Ensure table exists
  db.run(`
    CREATE TABLE IF NOT EXISTS api_usage (
      date TEXT PRIMARY KEY,
      request_count INTEGER DEFAULT 0
    );
  `);

  const row = getOne('SELECT request_count FROM api_usage WHERE date = ?', [today]);
  const currentCount = row ? Number(row.request_count) : 0;

  if (currentCount >= dailyLimit) {
    return { allowed: false, count: currentCount, limit: dailyLimit, remaining: 0 };
  }

  const newCount = currentCount + 1;
  if (row) {
    runSql('UPDATE api_usage SET request_count = ? WHERE date = ?', [newCount, today]);
  } else {
    runSql('INSERT INTO api_usage (date, request_count) VALUES (?, ?)', [today, newCount]);
  }

  return { allowed: true, count: newCount, limit: dailyLimit, remaining: dailyLimit - newCount };
}

export function getApiUsage() {
  const today = new Date().toISOString().slice(0, 10);
  if (!db) return { count: 0, date: today };
  try {
    const row = getOne('SELECT request_count FROM api_usage WHERE date = ?', [today]);
    return { count: row ? Number(row.request_count) : 0, date: today };
  } catch {
    return { count: 0, date: today };
  }
}
