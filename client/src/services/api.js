/**
 * Client API Service Layer connecting React to Node.js / Express + SQLite backend
 */

const API_BASE = '/api';

export async function fetchProgress() {
  const res = await fetch(`${API_BASE}/progress`);
  if (!res.ok) throw new Error(`Failed to load progress: HTTP ${res.status}`);
  return res.json();
}

export async function updateProgress(data) {
  const res = await fetch(`${API_BASE}/progress`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Failed to update progress: HTTP ${res.status}`);
  return res.json();
}

export async function resetProgress() {
  const res = await fetch(`${API_BASE}/progress/reset`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error(`Failed to reset progress: HTTP ${res.status}`);
  return res.json();
}

export async function fetchProjectChecklists() {
  const res = await fetch(`${API_BASE}/projects`);
  if (!res.ok) throw new Error(`Failed to load project checklists: HTTP ${res.status}`);
  return res.json();
}

export async function updateProjectStep(projectId, stepIndex, completed) {
  const res = await fetch(`${API_BASE}/projects/${projectId}/steps`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stepIndex, completed })
  });
  if (!res.ok) throw new Error(`Failed to update project checklist: HTTP ${res.status}`);
  return res.json();
}

export async function submitAssignment(lessonId, userCode) {
  const res = await fetch(`${API_BASE}/assignments/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lessonId, userCode })
  });
  if (!res.ok) throw new Error(`Submission failed: HTTP ${res.status}`);
  return res.json();
}

export async function fetchSubmissions(lessonId) {
  const res = await fetch(`${API_BASE}/assignments/${lessonId}`);
  if (!res.ok) throw new Error(`Failed to fetch submissions: HTTP ${res.status}`);
  return res.json();
}

export async function fetchMentorMessages() {
  const res = await fetch(`${API_BASE}/mentor/messages`);
  if (!res.ok) throw new Error(`Failed to fetch mentor messages: HTTP ${res.status}`);
  return res.json();
}

export async function sendMentorMessage(content, apiKey = '') {
  const res = await fetch(`${API_BASE}/mentor/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, apiKey })
  });
  if (!res.ok) throw new Error(`Mentor chat failed: HTTP ${res.status}`);
  return res.json();
}

export async function clearMentorChat() {
  const res = await fetch(`${API_BASE}/mentor/messages`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error(`Failed to clear chat: HTTP ${res.status}`);
  return res.json();
}

export async function recordQuizAttempt(score, total, answersJson = {}) {
  const res = await fetch(`${API_BASE}/quiz/attempt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ score, total, answersJson })
  });
  if (!res.ok) throw new Error(`Failed to record quiz: HTTP ${res.status}`);
  return res.json();
}

export async function fetchQuizHistory() {
  const res = await fetch(`${API_BASE}/quiz/history`);
  if (!res.ok) throw new Error(`Failed to fetch quiz history: HTTP ${res.status}`);
  return res.json();
}

export function getExportUrl() {
  return `${API_BASE}/export`;
}
