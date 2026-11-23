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
  addLocalMentorExchange,
  clearLocalMentorMessages,
  generateLocalExportUrl,
  getAllUsers,
  registerUser,
  getPendingUsers,
  approveUser,
  rejectUser,
  deleteUser,
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

import { analyzeMentorPrompt } from './cleanCoreValidator';

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

export async function callGoogleGenerativeApiDirect(content, apiKey) {
  const key = apiKey || localStorage.getItem('sap_mentor_gemini_key') || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) || '';
  if (!key) {
    throw new Error('API key is missing.');
  }

  // Daily client-side rate limit enforcement (5,000 queries / day)
  const today = new Date().toISOString().slice(0, 10);
  let dailyUsage = { date: today, count: 0 };
  try {
    const raw = localStorage.getItem('sap_daily_gemma_usage');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.date === today) dailyUsage = parsed;
    }
  } catch {
    // reset
  }

  const DAILY_LIMIT = 5000;
  if (dailyUsage.count >= DAILY_LIMIT) {
    throw new Error(`Daily rate limit of ${DAILY_LIMIT} queries reached for today (${today}). Resets at 00:00 UTC.`);
  }

  const systemInstruction = 'You are a Principal SAP Technical Architect and Clean Core Lead. You teach Modern ABAP (7.50+ / 7.57+ / ABAP Cloud), CDS View Entities (7.55+), SAP RAP (strict ( 2 )), OData V4, and React UI integration. NEVER teach or allow classic ABAP (no WRITE, no FORM/PERFORM, no HEADER LINE, no OCCURS 0, no unreleased tables like BUT000/MARA). Format answers with Level 1 (Layman terms & real-world analogy) followed by Level 2 (SAP Technical specifications, internal mechanics, and Clean Core vs On-Premise distinctions).';

  // Strictly use Gemma 4 31B only
  const models = ['gemma-4-31b-it', 'gemma-4-31b'];
  let botText = '';
  let lastErr = null;

  for (const m of models) {
    try {
      const payload = {
        contents: [{
          role: 'user',
          parts: [{ text: `[SYSTEM INSTRUCTION]\n${systemInstruction}\n\n[USER QUESTION]\n${content}` }]
        }]
      };

      // For Google Auth keys (starting with AQ.), pass in x-goog-api-key header and NOT in ?key= URL param
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(m)}:generateContent`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': key
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        botText = data.candidates[0].content.parts[0].text;
        dailyUsage.count++;
        try {
          localStorage.setItem('sap_daily_gemma_usage', JSON.stringify(dailyUsage));
        } catch {
          // ignore
        }
        break;
      }
      if (data.error) {
        lastErr = new Error(data.error.message || `API Error ${data.error.code}`);
        if (data.error.code === 404 || data.error.message?.includes('not found')) continue;
      }
    } catch (e) {
      lastErr = e;
    }
  }

  if (!botText) {
    throw lastErr || new Error('No candidate content received from Gemma 4 31B');
  }

  return addLocalMentorExchange(content, botText);
}

export async function sendMentorMessage(content, apiKey = '') {
  const effectiveKey = (apiKey && apiKey.trim()) || localStorage.getItem('sap_mentor_gemini_key') || '';

  // Strategy 1: Try the Vercel serverless proxy with a generous 30s timeout for AI response
  try {
    const res = await fetchWithTimeout(`${API_BASE}/mentor/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, apiKey: effectiveKey })
    }, 30000);  // 30 seconds for AI calls
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
      if (data?.response) {
        return addLocalMentorExchange(content, data.response);
      }
      if (data?.messages) return data.messages;
    }
  } catch (err) {
    console.warn('Backend proxy unavailable:', err.message);
  }

  // Strategy 2: Call Google Generative Language API directly from browser
  if (effectiveKey) {
    try {
      return await callGoogleGenerativeApiDirect(content, effectiveKey);
    } catch (apiErr) {
      console.warn('Direct Google AI call failed:', apiErr.message);
      const notice = `*Notice: Live AI Model proxy failed (${apiErr.message}). Seamlessly switched to built-in SAP Architect Engine:*\n\n` + analyzeMentorPrompt(content);
      return addLocalMentorExchange(content, notice);
    }
  }

  // Strategy 3: Offline static Clean Core analyzer
  const localRes = sendLocalMentorChat(content);
  return Array.isArray(localRes) ? localRes : (localRes.messages || []);
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
  const local = getCurrentSession();
  if (!local) return null;

  try {
    const res = await fetchWithTimeout(`${API_BASE}/auth?action=session&sessionId=${encodeURIComponent(local.sessionId)}`);
    if (res.ok) {
      const data = await res.json();
      if (!data) {
        // Session was superseded or terminated on another device
        logoutSession(local.sessionId);
        return null;
      }
      return data;
    }
  } catch {
    // Local fallback
  }
  return local;
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

export async function fetchPendingUsers() {
  return getPendingUsers();
}

export async function approveRegistration(userId) {
  return approveUser(userId);
}

export async function rejectRegistration(userId) {
  return rejectUser(userId);
}

export async function deleteUserAccount(userId) {
  return deleteUser(userId);
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
