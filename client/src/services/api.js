/**
 * Client API Service Layer (Hybrid Dual-Mode: REST Server + In-Browser SQLite Engine)
 * Automatically connects to Express + SQLite backend in local development,
 * and gracefully falls back to browser-native storage on Vercel/Netlify static deployments.
 */
import {
  getLocalProgress,
  updateLocalProgress,
  resetLocalProgress,
  getLocalProjectChecklists,
  updateLocalProjectStep,
  submitLocalAssignment,
  getLocalSubmissions,
  recordLocalQuizAttempt,
  getLocalQuizHistory,
  getLocalMentorMessages,
  sendLocalMentorChat,
  clearLocalMentorMessages,
  generateLocalExportUrl,
  getAllUsers,
  registerUser,
  getActiveSessions,
  getCurrentSession,
  loginUser,
  logoutSession,
  switchActiveSession,
  adminKickSession,
  updateUserRole,
  getBroadcastAnnouncement,
  setBroadcastAnnouncement,
  getVercelDbDiagnostics
} from './localDatabase';

const API_BASE = '/api';

// Helper with timeout to probe backend availability
async function fetchWithTimeout(url, options = {}, timeoutMs = 2500) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

// 1. User Progress
export async function fetchProgress() {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/progress`);
    if (res.ok) return await res.json();
  } catch {
    // Backend offline / static deployment: use browser SQLite
  }
  return getLocalProgress();
}

export async function updateProgress(data) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/progress`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) return await res.json();
  } catch {
    // Fallback to local
  }
  return updateLocalProgress(data);
}

export async function resetProgress() {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/progress/reset`, { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      return data.progress;
    }
  } catch {
    // Fallback to local
  }
  return resetLocalProgress();
}

// 2. Project Checklists
export async function fetchProjectChecklists() {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/projects`);
    if (res.ok) return await res.json();
  } catch {
    // Fallback to local
  }
  return getLocalProjectChecklists();
}

export async function updateProjectStep(projectId, stepIndex, completed) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/projects/${projectId}/steps`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stepIndex, completed })
    });
    if (res.ok) return await res.json();
  } catch {
    // Fallback to local
  }
  return updateLocalProjectStep(projectId, stepIndex, completed);
}

// 3. Assignment Submissions & Static Code Validation
export async function submitAssignment(lessonId, userCode) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/assignments/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId, userCode })
    });
    if (res.ok) return await res.json();
  } catch {
    // Fallback to local
  }
  return submitLocalAssignment(lessonId, userCode);
}

export async function fetchSubmissions(lessonId) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/assignments/${lessonId}`);
    if (res.ok) return await res.json();
  } catch {
    // Fallback to local
  }
  return getLocalSubmissions(lessonId);
}

// 4. AI Mentor Chat
export async function fetchMentorMessages() {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/mentor/messages`);
    if (res.ok) return await res.json();
  } catch {
    // Fallback to local
  }
  return getLocalMentorMessages();
}

export async function sendMentorMessage(content, apiKey = '') {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/mentor/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, apiKey })
    });
    if (res.ok) return await res.json();
  } catch {
    // Fallback to local
  }
  return sendLocalMentorChat(content);
}

export async function clearMentorChat() {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/mentor/messages`, { method: 'DELETE' });
    if (res.ok) return await res.json();
  } catch {
    // Fallback to local
  }
  return clearLocalMentorMessages();
}

// 5. Quiz Attempts
export async function recordQuizAttempt(score, total, answersJson = {}) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/quiz/attempt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score, total, answersJson })
    });
    if (res.ok) return await res.json();
  } catch {
    // Fallback to local
  }
  return recordLocalQuizAttempt(score, total, answersJson);
}

export async function fetchQuizHistory() {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/quiz/history`);
    if (res.ok) return await res.json();
  } catch {
    // Fallback to local
  }
  return getLocalQuizHistory();
}

// 6. Data Export URL
export function getExportUrl() {
  try {
    return generateLocalExportUrl();
  } catch {
    return `${API_BASE}/export`;
  }
}

// 7. Concurrent Authentication & Session APIs
export async function fetchCurrentSession() {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/auth/session`);
    if (res.ok) return await res.json();
  } catch {
    // Local fallback
  }
  return getCurrentSession();
}

export async function fetchActiveSessions() {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/auth/sessions`);
    if (res.ok) return await res.json();
  } catch {
    // Local fallback
  }
  return getActiveSessions();
}

export async function login(credentials) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (res.ok) return await res.json();
  } catch {
    // Local fallback
  }
  return loginUser(credentials);
}

export async function logout(sessionId) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId })
    });
    if (res.ok) return await res.json();
  } catch {
    // Local fallback
  }
  return logoutSession(sessionId);
}

export async function switchSession(sessionId) {
  return switchActiveSession(sessionId);
}

export function register(userData) {
  return registerUser(userData);
}

export { registerUser };

export async function kickSession(sessionId) {
  return adminKickSession(sessionId);
}

export async function fetchAllUsers() {
  return getAllUsers();
}

export async function promoteUser(userId, newRole) {
  return updateUserRole(userId, newRole);
}

export async function fetchBroadcast() {
  return getBroadcastAnnouncement();
}

export async function updateBroadcast(msg) {
  return setBroadcastAnnouncement(msg);
}

export async function fetchVercelDbDiagnostics() {
  return getVercelDbDiagnostics();
}
