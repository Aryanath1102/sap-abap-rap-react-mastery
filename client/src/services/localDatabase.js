/**
 * Client-Side Persistence Layer (Browser-Native SQLite Storage)
 * Enables 100% serverless, zero-backend deployment on Vercel and Netlify.
 * Persists user state in the browser with full Clean Core verification.
 */
import { validateAssignment, analyzeMentorPrompt } from './cleanCoreValidator';

const KEYS = {
  PROGRESS: 'sap_mastery_progress',
  CHECKLISTS: 'sap_mastery_checklists',
  SUBMISSIONS: 'sap_mastery_submissions',
  QUIZ: 'sap_mastery_quiz_history',
  MENTOR: 'sap_mastery_mentor_messages'
};

const DEFAULT_PROGRESS = {
  completed_days: [],
  solved_exercises: [],
  best_quiz_score: 0,
  streak: 0,
  active_theme: 'dark',
  updated_at: new Date().toISOString()
};

function readJson(key, defaultVal) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch (err) {
    console.warn(`Error reading ${key} from storage:`, err);
    return defaultVal;
  }
}

function writeJson(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.warn(`Error writing ${key} to storage:`, err);
  }
}

// 1. User Progress
export function getLocalProgress() {
  const p = readJson(KEYS.PROGRESS, DEFAULT_PROGRESS);
  const completed = p.completed_days || [];
  const solved = p.solved_exercises || [];
  const streak = (completed.length === 0 && solved.length === 0)
    ? 0
    : (p.streak && p.streak > 0 ? p.streak : Math.max(1, completed.length));

  return { ...p, streak };
}

export function updateLocalProgress(data) {
  const current = getLocalProgress();
  const completed = data.completed_days !== undefined ? data.completed_days : current.completed_days;
  const solved = data.solved_exercises !== undefined ? data.solved_exercises : current.solved_exercises;
  const streak = (completed.length === 0 && solved.length === 0)
    ? 0
    : (data.streak !== undefined ? data.streak : current.streak);

  const updated = {
    ...current,
    ...data,
    completed_days: completed,
    solved_exercises: solved,
    streak,
    updated_at: new Date().toISOString()
  };
  writeJson(KEYS.PROGRESS, updated);
  return updated;
}

export function resetLocalProgress() {
  writeJson(KEYS.PROGRESS, { ...DEFAULT_PROGRESS, updated_at: new Date().toISOString() });
  writeJson(KEYS.CHECKLISTS, {});
  writeJson(KEYS.SUBMISSIONS, []);
  writeJson(KEYS.QUIZ, []);
  return DEFAULT_PROGRESS;
}

// 2. Project Checklists
export function getLocalProjectChecklists() {
  return readJson(KEYS.CHECKLISTS, {});
}

export function updateLocalProjectStep(projectId, stepIndex, completed) {
  const current = getLocalProjectChecklists();
  const currentSteps = current[projectId] || [];
  let updatedSteps;
  if (completed) {
    updatedSteps = currentSteps.includes(stepIndex) ? currentSteps : [...currentSteps, stepIndex];
  } else {
    updatedSteps = currentSteps.filter(s => s !== stepIndex);
  }
  const next = { ...current, [projectId]: updatedSteps };
  writeJson(KEYS.CHECKLISTS, next);
  return next;
}

// 3. Assignment Submissions & Clean Core Validator
export function submitLocalAssignment(lessonId, userCode) {
  const validation = validateAssignment(lessonId, userCode);
  const submissions = readJson(KEYS.SUBMISSIONS, []);

  const newSub = {
    id: Date.now(),
    lesson_id: lessonId,
    user_code: userCode,
    status: validation.status,
    architect_feedback: validation,
    submitted_at: new Date().toISOString()
  };

  const updatedSubmissions = [newSub, ...submissions];
  writeJson(KEYS.SUBMISSIONS, updatedSubmissions);

  // If passed, automatically add to solved_exercises and activate streak
  if (validation.status === 'passed') {
    const prog = getLocalProgress();
    const solved = prog.solved_exercises || [];
    if (!solved.includes(lessonId)) {
      const nextSolved = [...solved, lessonId];
      const nextStreak = Math.max(1, prog.streak || 0);
      updateLocalProgress({ solved_exercises: nextSolved, streak: nextStreak });
    }
  }

  const lessonHistory = updatedSubmissions.filter(s => s.lesson_id === lessonId);
  return { validation, submission: newSub, history: lessonHistory };
}

export function getLocalSubmissions(lessonId) {
  const submissions = readJson(KEYS.SUBMISSIONS, []);
  return submissions.filter(s => s.lesson_id === lessonId);
}

// 4. Quiz History
export function recordLocalQuizAttempt(score, total, answersJson) {
  const history = readJson(KEYS.QUIZ, []);
  const attempt = {
    id: Date.now(),
    score,
    total,
    answers_json: answersJson,
    created_at: new Date().toISOString()
  };
  const updated = [attempt, ...history];
  writeJson(KEYS.QUIZ, updated);

  const prog = getLocalProgress();
  if (score > (prog.best_quiz_score || 0)) {
    updateLocalProgress({ best_quiz_score: score });
  }

  return { attempt, bestScore: Math.max(score, prog.best_quiz_score || 0) };
}

export function getLocalQuizHistory() {
  return readJson(KEYS.QUIZ, []);
}

// 5. AI Mentor Chat
export function getLocalMentorMessages() {
  const msgs = readJson(KEYS.MENTOR, null);
  if (!msgs) {
    const seed = [{
      id: 1,
      role: 'assistant',
      content: 'Welcome to the **SAP Modern ABAP, RAP & React Studio**! I am your Senior SAP Technical Architect & Clean Core Advisor. Paste your ABAP, CDS View Entities, RAP Behavior Definitions (BDEF), EML, or React OData V4 code for instant static compliance analysis, or ask any technical architecture question.',
      created_at: new Date().toISOString()
    }];
    writeJson(KEYS.MENTOR, seed);
    return seed;
  }
  return msgs;
}

export function sendLocalMentorChat(userPrompt) {
  const current = getLocalMentorMessages();
  const userMsg = {
    id: Date.now(),
    role: 'user',
    content: userPrompt,
    created_at: new Date().toISOString()
  };

  const responseContent = analyzeMentorPrompt(userPrompt);
  const botMsg = {
    id: Date.now() + 1,
    role: 'assistant',
    content: responseContent,
    created_at: new Date().toISOString()
  };

  const updated = [...current, userMsg, botMsg];
  writeJson(KEYS.MENTOR, updated);
  return { response: responseContent, messages: updated };
}

export function clearLocalMentorMessages() {
  writeJson(KEYS.MENTOR, []);
  return [];
}

// 6. Export Full Database State as JSON
export function generateLocalExportUrl() {
  const fullData = {
    user_progress: getLocalProgress(),
    project_checklists: getLocalProjectChecklists(),
    assignment_submissions: readJson(KEYS.SUBMISSIONS, []),
    quiz_attempts: readJson(KEYS.QUIZ, []),
    mentor_messages: readJson(KEYS.MENTOR, []),
    exported_at: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
  return URL.createObjectURL(blob);
}
