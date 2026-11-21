import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, '..', 'database.sqlite');

let db = null;

// Persist the in-memory SQLite database to database.sqlite
function persist() {
  if (!db) return;
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_FILE, buffer);
  } catch (err) {
    console.error('Failed to persist SQLite database:', err);
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

export function getProgress() {
  const row = getOne('SELECT * FROM user_progress WHERE id = 1');
  if (!row) {
    return {
      completed_days: [],
      solved_exercises: [],
      best_quiz_score: 0,
      streak: 0,
      active_theme: 'light',
      updated_at: new Date().toISOString()
    };
  }
  const completed_days = JSON.parse(row.completed_days || '[]');
  const solved_exercises = JSON.parse(row.solved_exercises || '[]');
  
  // Calculate appropriate streak: if the user hasn't completed any days or exercises, streak is strictly 0
  let calculatedStreak = 0;
  if (completed_days.length > 0 || solved_exercises.length > 0) {
    calculatedStreak = row.streak && row.streak > 0 ? row.streak : Math.max(1, completed_days.length);
  }

  return {
    completed_days,
    solved_exercises,
    best_quiz_score: row.best_quiz_score || 0,
    streak: calculatedStreak,
    active_theme: row.active_theme || 'light',
    updated_at: row.updated_at
  };
}

export function updateProgress(data) {
  const current = getProgress();
  const completed_days = JSON.stringify(data.completed_days !== undefined ? data.completed_days : current.completed_days);
  const solved_exercises = JSON.stringify(data.solved_exercises !== undefined ? data.solved_exercises : current.solved_exercises);
  const best_quiz_score = data.best_quiz_score !== undefined ? data.best_quiz_score : current.best_quiz_score;
  const streak = data.streak !== undefined ? data.streak : current.streak;
  const active_theme = data.active_theme !== undefined ? data.active_theme : current.active_theme;

  runSql(`
    UPDATE user_progress
    SET completed_days = ?,
        solved_exercises = ?,
        best_quiz_score = ?,
        streak = ?,
        active_theme = ?,
        updated_at = datetime('now')
    WHERE id = 1
  `, [completed_days, solved_exercises, best_quiz_score, streak, active_theme]);

  return getProgress();
}

export function resetProgress() {
  runSql(`
    UPDATE user_progress
    SET completed_days = '[]',
        solved_exercises = '[]',
        best_quiz_score = 0,
        streak = 1,
        updated_at = datetime('now')
    WHERE id = 1
  `);
  runSql('DELETE FROM project_checklists');
  runSql('DELETE FROM assignment_submissions');
  runSql('DELETE FROM quiz_attempts');
  return getProgress();
}

export function getProjectChecklists() {
  const rows = getAll('SELECT project_id, step_index, completed FROM project_checklists WHERE completed = 1');
  // Group into { [project_id]: [step_index, ...] }
  const result = {};
  for (const r of rows) {
    if (!result[r.project_id]) result[r.project_id] = [];
    result[r.project_id].push(r.step_index);
  }
  return result;
}

export function updateProjectStep(projectId, stepIndex, completed) {
  runSql(`
    INSERT INTO project_checklists (project_id, step_index, completed)
    VALUES (?, ?, ?)
    ON CONFLICT(project_id, step_index) DO UPDATE SET completed = ?
  `, [projectId, stepIndex, completed ? 1 : 0, completed ? 1 : 0]);

  return getProjectChecklists();
}

export function addSubmission({ lessonId, userCode, status, architectFeedback }) {
  runSql(`
    INSERT INTO assignment_submissions (lesson_id, user_code, status, architect_feedback, submitted_at)
    VALUES (?, ?, ?, ?, datetime('now'))
  `, [lessonId, userCode, status, JSON.stringify(architectFeedback)]);

  // If status is passed/solved, also ensure it's marked in user_progress
  if (status === 'passed') {
    const prog = getProgress();
    if (!prog.solved_exercises.includes(lessonId)) {
      prog.solved_exercises.push(lessonId);
      updateProgress({ solved_exercises: prog.solved_exercises });
    }
  }

  return getSubmissions(lessonId);
}

export function getSubmissions(lessonId) {
  const rows = lessonId
    ? getAll('SELECT * FROM assignment_submissions WHERE lesson_id = ? ORDER BY submitted_at DESC', [lessonId])
    : getAll('SELECT * FROM assignment_submissions ORDER BY submitted_at DESC');

  return rows.map(r => ({
    ...r,
    architect_feedback: r.architect_feedback ? JSON.parse(r.architect_feedback) : null
  }));
}

export function recordQuizAttempt({ score, total, answersJson }) {
  runSql(`
    INSERT INTO quiz_attempts (score, total, answers_json, created_at)
    VALUES (?, ?, ?, datetime('now'))
  `, [score, total, JSON.stringify(answersJson || {})]);

  const prog = getProgress();
  if (score > prog.best_quiz_score) {
    updateProgress({ best_quiz_score: score });
  }

  return getQuizHistory();
}

export function getQuizHistory() {
  return getAll('SELECT * FROM quiz_attempts ORDER BY created_at DESC LIMIT 20');
}

export function getMentorMessages() {
  return getAll('SELECT id, role, content, created_at FROM mentor_messages ORDER BY created_at ASC');
}

export function addMentorMessage({ role, content }) {
  runSql(`
    INSERT INTO mentor_messages (role, content, created_at)
    VALUES (?, ?, datetime('now'))
  `, [role, content]);

  return getMentorMessages();
}

export function clearMentorMessages() {
  runSql('DELETE FROM mentor_messages');
  // Re-add default welcome
  runSql(`
    INSERT INTO mentor_messages (role, content, created_at)
    VALUES ('assistant', 'Chat history cleared. I am ready to review your Modern ABAP / RAP code or answer your architectural questions!', datetime('now'))
  `);
  return getMentorMessages();
}

export function exportAllData() {
  return {
    exportDate: new Date().toISOString(),
    version: '1.0.0',
    progress: getProgress(),
    projectChecklists: getProjectChecklists(),
    submissions: getSubmissions(),
    quizHistory: getQuizHistory(),
    mentorMessages: getMentorMessages()
  };
}

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
