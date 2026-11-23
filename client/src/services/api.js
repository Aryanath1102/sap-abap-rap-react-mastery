async function request(path, method = 'GET', body) {
  const res = await fetch(`/api${path}`, { method, credentials: 'same-origin', headers: body === undefined ? {} : {'Content-Type':'application/json'}, body: body === undefined ? undefined : JSON.stringify(body) });
  const data = await res.json();
  if (!res.ok) { const error = new Error(data.error || 'Request failed'); error.status = res.status; throw error; }
  return data;
}
export const fetchProgress = () => request('/progress');
export const updateProgress = data => request('/progress','PUT',data);
export const resetProgress = () => request('/progress/reset','POST',{});
export const fetchProjectChecklists = () => request('/projects');
export const updateProjectStep = (id,stepIndex,completed) => request(`/projects/${encodeURIComponent(id)}/steps`,'PUT',{stepIndex,completed});
export const submitAssignment = (lessonId,userCode) => request('/assignments/submit','POST',{lessonId,userCode});
export const fetchSubmissions = id => request(`/assignments/${encodeURIComponent(id)}`);
export const fetchMentorMessages = () => request('/mentor/messages');
export const sendMentorMessage = content => request('/mentor/chat','POST',{content});
export const clearMentorChat = () => request('/mentor/messages','DELETE',{});
export const recordQuizAttempt = (score,total,answersJson={}) => request('/quiz/attempt','POST',{score,total,answersJson});
export const fetchQuizHistory = () => request('/quiz/history');
export const getExportUrl = () => '/api/export';
export async function fetchCurrentSession() { try { return await request('/auth/session'); } catch(e) { if(e.status===401) return null; throw e; } }
export const login = credentials => request('/auth/login','POST',credentials);
export const logout = () => request('/auth/logout','POST',{});
export const register = data => request('/auth/register','POST',data);
export const registerUser = register;
export const fetchActiveSessions = () => request('/admin/sessions');
export const fetchAllUsers = () => request('/admin/users');
export const fetchPendingUsers = async () => (await fetchAllUsers()).filter(u=>u.status==='pending_approval');
export const approveRegistration = (id, role = 'student') => request(`/admin/users/${encodeURIComponent(id)}`,'PATCH',{status:'approved',role});
export const rejectRegistration = id => request(`/admin/users/${encodeURIComponent(id)}`,'PATCH',{status:'rejected'});
export const deleteUserAccount = id => request(`/admin/users/${encodeURIComponent(id)}`,'DELETE',{});
export const promoteUser = (id,role) => request(`/admin/users/${encodeURIComponent(id)}`,'PATCH',{role});
export const kickSession = id => request(`/admin/sessions/${encodeURIComponent(id)}`,'DELETE',{});
export const switchSession = async () => { throw new Error('Sign out and sign in to switch accounts.'); };
export const fetchBroadcast = () => request('/broadcast');
export const updateBroadcast = message => request('/admin/broadcast','PUT',{message});
export const fetchVercelDbDiagnostics = () => request('/admin/database');
