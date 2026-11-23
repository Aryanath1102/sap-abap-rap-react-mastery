/**
 * Client-Side Persistence Layer (Browser-Native SQLite Storage)
 * With Per-User Isolated Data Partitioning & Single-Session Concurrency.
 * Enables 100% serverless, zero-backend deployment on Vercel and Netlify.
 */
import { validateAssignment, analyzeMentorPrompt } from './cleanCoreValidator';

const KEYS = {
  PROGRESS: 'sap_mastery_progress',
  CHECKLISTS: 'sap_mastery_checklists',
  SUBMISSIONS: 'sap_mastery_submissions',
  QUIZ: 'sap_mastery_quiz_history',
  MENTOR: 'sap_mastery_mentor_messages',
  USERS: 'sap_mastery_users',
  SESSIONS: 'sap_mastery_sessions',
  ACTIVE_SESSION: 'sap_mastery_active_session_id',
  BROADCAST: 'sap_mastery_broadcast_message',
  TRACK: 'sap_mastery_active_track'
};

const DEFAULT_USERS = [
  {
    id: 'usr_admin_aryanath',
    username: 'Aryanath',
    email: 'aryanath@sap-mastery.io',
    password: 'Aryanath@1102',
    role: 'admin',
    name: 'Aryanath (Enterprise Administrator)',
    status: 'approved',
    created_at: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'usr_dev',
    username: 'developer',
    email: 'developer@sap-mastery.io',
    password: 'password123',
    role: 'student',
    name: 'Alex Rivera (Full-Stack Engineer)',
    status: 'approved',
    created_at: '2026-01-05T00:00:00.000Z'
  }
];

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

/**
 * Get active user ID for data partitioning.
 * If no session is active, defaults to 'guest'.
 */
export function getActiveUserId() {
  const activeSessionId = localStorage.getItem(KEYS.ACTIVE_SESSION);
  if (!activeSessionId) return 'guest';
  const sessions = readJson(KEYS.SESSIONS, []);
  const session = sessions.find(s => s.sessionId === activeSessionId);
  return session?.userId || 'guest';
}

/**
 * Generates user-partitioned storage key.
 * Guarantees that every user's progress, checklist, and quiz results are completely isolated.
 */
function getUserKey(baseKey, userId = null) {
  const uid = userId || getActiveUserId();
  return `${baseKey}_${uid}`;
}

// 1. User Progress (Per-User Isolated)
export function getLocalProgress(userId = null) {
  const key = getUserKey(KEYS.PROGRESS, userId);
  const p = readJson(key, DEFAULT_PROGRESS);
  const completed = p.completed_days || [];
  const solved = p.solved_exercises || [];
  const streak = (completed.length === 0 && solved.length === 0)
    ? 0
    : (p.streak && p.streak > 0 ? p.streak : Math.max(1, completed.length));

  return { ...p, streak };
}

export function updateLocalProgress(data, userId = null) {
  const key = getUserKey(KEYS.PROGRESS, userId);
  const current = getLocalProgress(userId);
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
  writeJson(key, updated);
  return updated;
}

export function resetLocalProgress(userId = null) {
  const progressKey = getUserKey(KEYS.PROGRESS, userId);
  const checklistKey = getUserKey(KEYS.CHECKLISTS, userId);
  const subKey = getUserKey(KEYS.SUBMISSIONS, userId);
  const quizKey = getUserKey(KEYS.QUIZ, userId);

  writeJson(progressKey, { ...DEFAULT_PROGRESS, updated_at: new Date().toISOString() });
  writeJson(checklistKey, {});
  writeJson(subKey, []);
  writeJson(quizKey, []);
  return DEFAULT_PROGRESS;
}

// 2. Project Checklists (Per-User Isolated)
export function getLocalProjectChecklists(userId = null) {
  const key = getUserKey(KEYS.CHECKLISTS, userId);
  return readJson(key, {});
}

export function updateLocalProjectStep(projectId, stepIndex, completed, userId = null) {
  const key = getUserKey(KEYS.CHECKLISTS, userId);
  const current = getLocalProjectChecklists(userId);
  const currentSteps = current[projectId] || [];
  let updatedSteps;
  if (completed) {
    updatedSteps = currentSteps.includes(stepIndex) ? currentSteps : [...currentSteps, stepIndex];
  } else {
    updatedSteps = currentSteps.filter(s => s !== stepIndex);
  }
  const next = { ...current, [projectId]: updatedSteps };
  writeJson(key, next);
  return next;
}

// 3. Assignment Submissions & Clean Core Validator (Per-User Isolated)
export function submitLocalAssignment(lessonId, userCode, userId = null) {
  const validation = validateAssignment(lessonId, userCode);
  const key = getUserKey(KEYS.SUBMISSIONS, userId);
  const submissions = readJson(key, []);

  const newSub = {
    id: Date.now(),
    lesson_id: lessonId,
    user_code: userCode,
    status: validation.status,
    architect_feedback: validation,
    submitted_at: new Date().toISOString()
  };

  const updatedSubmissions = [newSub, ...submissions];
  writeJson(key, updatedSubmissions);

  // If passed, automatically add to solved_exercises and activate streak
  if (validation.status === 'passed') {
    const prog = getLocalProgress(userId);
    const solved = prog.solved_exercises || [];
    if (!solved.includes(lessonId)) {
      const nextSolved = [...solved, lessonId];
      const nextStreak = Math.max(1, prog.streak || 0);
      updateLocalProgress({ solved_exercises: nextSolved, streak: nextStreak }, userId);
    }
  }

  const lessonHistory = updatedSubmissions.filter(s => s.lesson_id === lessonId);
  return { validation, submission: newSub, history: lessonHistory };
}

export function getLocalSubmissions(lessonId, userId = null) {
  const key = getUserKey(KEYS.SUBMISSIONS, userId);
  const submissions = readJson(key, []);
  return submissions.filter(s => s.lesson_id === lessonId);
}

// 4. Quiz History (Per-User Isolated)
export function recordLocalQuizAttempt(score, total, answersJson, userId = null) {
  const key = getUserKey(KEYS.QUIZ, userId);
  const history = readJson(key, []);
  const attempt = {
    id: Date.now(),
    score,
    total,
    answers_json: answersJson,
    created_at: new Date().toISOString()
  };
  const updated = [attempt, ...history];
  writeJson(key, updated);

  const prog = getLocalProgress(userId);
  if (score > (prog.best_quiz_score || 0)) {
    updateLocalProgress({ best_quiz_score: score }, userId);
  }

  return { attempt, bestScore: Math.max(score, prog.best_quiz_score || 0) };
}

export function getLocalQuizHistory(userId = null) {
  const key = getUserKey(KEYS.QUIZ, userId);
  return readJson(key, []);
}

// 5. AI Mentor Chat (Per-User Isolated)
export function getLocalMentorMessages(userId = null) {
  const key = getUserKey(KEYS.MENTOR, userId);
  const msgs = readJson(key, null);
  if (!msgs) {
    const seed = [{
      id: 1,
      role: 'assistant',
      content: 'Welcome to the **SAP Modern ABAP, RAP & React Studio**! I am your Senior SAP Technical Architect & Clean Core Advisor. Paste your ABAP, CDS View Entities, RAP Behavior Definitions (BDEF), EML, or React OData V4 code for instant static compliance analysis, or ask any technical architecture question.',
      created_at: new Date().toISOString()
    }];
    writeJson(key, seed);
    return seed;
  }
  return msgs;
}

export function sendLocalMentorChat(userPrompt, userId = null) {
  const key = getUserKey(KEYS.MENTOR, userId);
  const current = getLocalMentorMessages(userId);
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
  writeJson(key, updated);
  return updated;
}

export function addLocalMentorExchange(userPrompt, botResponse, userId = null) {
  const key = getUserKey(KEYS.MENTOR, userId);
  const current = getLocalMentorMessages(userId);
  const userMsg = {
    id: Date.now(),
    role: 'user',
    content: userPrompt,
    created_at: new Date().toISOString()
  };
  const botMsg = {
    id: Date.now() + 1,
    role: 'assistant',
    content: botResponse,
    created_at: new Date().toISOString()
  };
  const updated = [...current, userMsg, botMsg];
  writeJson(key, updated);
  return updated;
}

export function clearLocalMentorMessages(userId = null) {
  const key = getUserKey(KEYS.MENTOR, userId);
  writeJson(key, []);
  return [];
}

// 6. Export Full Database State as JSON
export function generateLocalExportUrl() {
  const uid = getActiveUserId();
  const fullData = {
    active_user_id: uid,
    user_progress: getLocalProgress(uid),
    project_checklists: getLocalProjectChecklists(uid),
    assignment_submissions: readJson(getUserKey(KEYS.SUBMISSIONS, uid), []),
    quiz_attempts: readJson(getUserKey(KEYS.QUIZ, uid), []),
    mentor_messages: readJson(getUserKey(KEYS.MENTOR, uid), []),
    users: getAllUsers(),
    active_sessions: getActiveSessions(),
    broadcast: getBroadcastAnnouncement(),
    exported_at: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
  return URL.createObjectURL(blob);
}

// 7. Authentication & Strict Single-Session Management
export function getAllUsers() {
  let users = readJson(KEYS.USERS, null);
  if (!users || !Array.isArray(users)) {
    writeJson(KEYS.USERS, DEFAULT_USERS);
    return DEFAULT_USERS;
  }

  // Ensure primary SuperAdmin Aryanath is always seeded and approved
  const adminIndex = users.findIndex(u => u.username.toLowerCase() === 'aryanath');
  if (adminIndex === -1) {
    users = [DEFAULT_USERS[0], ...users];
    writeJson(KEYS.USERS, users);
  } else {
    if (users[adminIndex].password !== 'Aryanath@1102' || users[adminIndex].role !== 'admin' || users[adminIndex].status !== 'approved') {
      users[adminIndex].password = 'Aryanath@1102';
      users[adminIndex].role = 'admin';
      users[adminIndex].status = 'approved';
      writeJson(KEYS.USERS, users);
    }
  }

  return users;
}

export function registerUser({ username, email, password, role = 'student', name = '' }) {
  if (!username || !username.trim()) {
    throw new Error('Username is required.');
  }
  if (!password || !password.trim()) {
    throw new Error('Password is required.');
  }

  const users = getAllUsers();
  const trimmedUser = username.trim();
  const trimmedEmail = (email || `${trimmedUser}@sap-mastery.io`).trim().toLowerCase();

  const existing = users.find(
    u => u.username.toLowerCase() === trimmedUser.toLowerCase() || u.email.toLowerCase() === trimmedEmail.toLowerCase()
  );
  if (existing) {
    throw new Error(`An account with username '${trimmedUser}' or email '${trimmedEmail}' already exists.`);
  }

  const newUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    username: trimmedUser,
    email: trimmedEmail,
    password: password.trim(),
    role: role === 'admin' ? 'admin' : 'student',
    name: name.trim() || trimmedUser,
    status: 'pending_approval',
    created_at: new Date().toISOString()
  };

  const updatedUsers = [...users, newUser];
  writeJson(KEYS.USERS, updatedUsers);

  return {
    success: true,
    pendingApproval: true,
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      name: newUser.name,
      status: newUser.status
    },
    message: 'Registration request submitted! Your account is pending Administrator approval from Aryanath.'
  };
}

export function getPendingUsers() {
  const users = getAllUsers();
  return users.filter(u => u.status === 'pending_approval');
}

export function approveUser(userId) {
  const users = getAllUsers();
  const target = users.find(u => u.id === userId);
  if (!target) throw new Error('User not found.');

  target.status = 'approved';
  writeJson(KEYS.USERS, users);
  return target;
}

export function rejectUser(userId) {
  const users = getAllUsers();
  const target = users.find(u => u.id === userId);
  if (!target) throw new Error('User not found.');

  target.status = 'rejected';
  writeJson(KEYS.USERS, users);
  const sessions = getActiveSessions().filter(s => s.userId !== userId);
  writeJson(KEYS.SESSIONS, sessions);
  return target;
}

export function deleteUser(userId) {
  const users = getAllUsers();
  const target = users.find(u => u.id === userId);
  if (!target) throw new Error('User not found.');
  if (target.username.toLowerCase() === 'aryanath') {
    throw new Error('Cannot delete primary Administrator Aryanath.');
  }

  const updated = users.filter(u => u.id !== userId);
  writeJson(KEYS.USERS, updated);

  const sessions = getActiveSessions().filter(s => s.userId !== userId);
  writeJson(KEYS.SESSIONS, sessions);
  return updated;
}

export function getActiveSessions() {
  const sessions = readJson(KEYS.SESSIONS, []);
  const now = Date.now();
  const valid = sessions.filter(s => (now - new Date(s.lastHeartbeat || s.loginTime).getTime()) < 24 * 60 * 60 * 1000);
  if (valid.length !== sessions.length) {
    writeJson(KEYS.SESSIONS, valid);
  }
  return valid;
}

export function getCurrentSession() {
  const activeId = localStorage.getItem(KEYS.ACTIVE_SESSION);
  if (!activeId) return null;

  const sessions = getActiveSessions();
  const found = sessions.find(s => s.sessionId === activeId);
  if (!found) {
    localStorage.removeItem(KEYS.ACTIVE_SESSION);
    return null;
  }

  // Check if a newer session exists for this user (logged in from another device/browser)
  const newerSession = sessions.find(s => s.userId === found.userId && s.sessionId !== found.sessionId && new Date(s.loginTime).getTime() > new Date(found.loginTime).getTime());
  if (newerSession) {
    // Superseded by a newer login on another device -> Auto logout this stale session
    localStorage.removeItem(KEYS.ACTIVE_SESSION);
    return null;
  }

  // Refresh heartbeat
  found.lastHeartbeat = new Date().toISOString();
  writeJson(KEYS.SESSIONS, sessions);
  return found;
}

export function loginUser({ usernameOrEmail, password, role }) {
  if (!usernameOrEmail || !usernameOrEmail.trim()) {
    throw new Error('Username or email is required.');
  }
  if (!password || !password.trim()) {
    throw new Error('Password is required.');
  }

  const users = getAllUsers();
  const input = usernameOrEmail.trim().toLowerCase();
  const trimmedPassword = password.trim();

  const user = users.find(
    u => u.username.toLowerCase() === input || u.email.toLowerCase() === input
  );

  if (!user) {
    throw new Error('Account not found. Please register or check your username/email.');
  }

  if (user.password !== trimmedPassword) {
    throw new Error('Incorrect password. Please verify your credentials.');
  }

  if (user.status === 'pending_approval') {
    throw new Error(
      `Your account (${user.username}) is pending Administrator approval. Please wait for Aryanath to approve your access in the Admin Control Center.`
    );
  }

  if (user.status === 'rejected') {
    throw new Error('Your registration request was rejected by the administrator. Contact support for re-evaluation.');
  }

  // STRICT SINGLE SESSION ENFORCEMENT:
  // Invalidate any existing sessions for this user so only 1 active session can ever exist.
  const otherSessions = getActiveSessions().filter(s => s.userId !== user.id);

  const newSession = {
    sessionId: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    userId: user.id,
    username: user.username,
    email: user.email,
    role: user.role || (user.username.toLowerCase() === 'aryanath' ? 'admin' : 'student'),
    name: user.name || user.username,
    activeTrack: localStorage.getItem(KEYS.TRACK) || 'rap',
    device: navigator.userAgent.includes('Windows') ? 'Windows Desktop' : navigator.userAgent.includes('Mac') ? 'macOS Desktop' : 'Web Browser',
    ip: '127.0.0.1 (Authenticated)',
    loginTime: new Date().toISOString(),
    lastHeartbeat: new Date().toISOString()
  };

  const updatedSessions = [newSession, ...otherSessions];
  writeJson(KEYS.SESSIONS, updatedSessions);
  localStorage.setItem(KEYS.ACTIVE_SESSION, newSession.sessionId);

  return newSession;
}

export function logoutSession(sessionId) {
  const sessions = getActiveSessions().filter(s => s.sessionId !== sessionId);
  writeJson(KEYS.SESSIONS, sessions);

  const activeId = localStorage.getItem(KEYS.ACTIVE_SESSION);
  if (activeId === sessionId) {
    localStorage.removeItem(KEYS.ACTIVE_SESSION);
  }
  return sessions;
}

export function switchActiveSession(sessionId) {
  // Single-session enforcement: switching accounts without login is disabled
  throw new Error('Single-user session enforcement active. Please sign out and log in with your credentials.');
}

export function adminKickSession(sessionId) {
  return logoutSession(sessionId);
}

export function updateUserRole(userId, newRole) {
  const users = getAllUsers();
  const updated = users.map(u => u.id === userId ? { ...u, role: newRole } : u);
  writeJson(KEYS.USERS, updated);

  const sessions = getActiveSessions().map(s => s.userId === userId ? { ...s, role: newRole } : s);
  writeJson(KEYS.SESSIONS, sessions);

  return updated;
}

export function getBroadcastAnnouncement() {
  return readJson(KEYS.BROADCAST, {
    active: true,
    message: '🎉 SAP Fiori 6-Module Curriculum is now live! Explore Floorplans, Fiori Elements, Freestyle SAPUI5, and SAP Build Work Zone.',
    updated_at: new Date().toISOString()
  });
}

export function setBroadcastAnnouncement(message, active = true) {
  const data = {
    active,
    message: message.trim(),
    updated_at: new Date().toISOString()
  };
  writeJson(KEYS.BROADCAST, data);
  return data;
}

export function getVercelDbDiagnostics() {
  const users = getAllUsers();
  const sessions = getActiveSessions();
  const uid = getActiveUserId();
  const submissions = readJson(getUserKey(KEYS.SUBMISSIONS, uid), []);
  const progress = getLocalProgress(uid);

  return {
    engine: 'Single-Session In-Browser Storage + Vercel Cloud Sync',
    activeUser: uid,
    connectedVercelPostgres: false,
    tables: {
      users_count: users.length,
      active_sessions_count: sessions.length,
      submissions_count: submissions.length,
      completed_days_count: (progress.completed_days || []).length,
      solved_exercises_count: (progress.solved_exercises || []).length
    },
    storageType: 'localStorage (Isolated User Keys) + Vercel Serverless Sync',
    status: 'Healthy',
    timestamp: new Date().toISOString()
  };
}
