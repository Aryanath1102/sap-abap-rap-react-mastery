import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';
import pg from 'pg';

export const userContext = new AsyncLocalStorage();
let pool;
let ready;
const schema = `
CREATE TABLE IF NOT EXISTS users (
 id TEXT PRIMARY KEY, username TEXT NOT NULL UNIQUE, email TEXT NOT NULL UNIQUE, name TEXT,
 password_hash TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('admin','student')),
 requested_role TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('pending_approval','approved','rejected','disabled'))
);
CREATE UNIQUE INDEX IF NOT EXISTS users_username_lower ON users (lower(username));
CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower ON users (lower(email));
CREATE TABLE IF NOT EXISTS sessions (
 id TEXT PRIMARY KEY, token_hash TEXT NOT NULL UNIQUE,
 user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
 expires_at BIGINT NOT NULL, login_time TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS user_data (user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE, data TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY, data TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS api_usage (date TEXT PRIMARY KEY, request_count INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS auth_attempts (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at BIGINT NOT NULL);
`;
export async function initDatabase(testPool) {
 if (testPool && process.env.NODE_ENV !== 'test') throw new Error('Database injection is test-only');
 if (!ready) ready = (async () => {
   if (testPool) pool = testPool;
   else {
     const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
     if (!connectionString) throw new Error('Connect PostgreSQL and configure POSTGRES_URL or DATABASE_URL');
     pool = new pg.Pool({connectionString, max:5, idleTimeoutMillis:10000, connectionTimeoutMillis:10000});
   }
   const client = await pool.connect();
   try {
     await client.query('BEGIN');
     // Serialize schema setup and administrator bootstrap across cold starts.
     await client.query('SELECT pg_advisory_xact_lock(7341021)');
     await client.query(schema);
     await client.query('COMMIT');
   } catch (e) { await client.query('ROLLBACK'); throw e; }
   finally { client.release(); }
 })().catch(e => { ready = null; throw e; });
 return ready;
}
function sql(text) { let i=0; return text.replace(/\?/g,()=>`$${++i}`); }
export async function getAll(text, params=[]) { return (await pool.query(sql(text),params)).rows; }
export async function getOne(text, params=[]) { return (await getAll(text,params))[0] || null; }
export async function runSql(text, params=[]) { return pool.query(sql(text),params); }
export async function transaction(fn) {
 const client=await pool.connect();
 try { await client.query('BEGIN'); const result=await fn({query:(text,params=[])=>client.query(sql(text),params)}); await client.query('COMMIT'); return result; }
 catch(e) { await client.query('ROLLBACK'); throw e; }
 finally { client.release(); }
}
export async function closeDatabase() { if(pool) await pool.end(); ready=null; pool=null; }
function userId() { const id=userContext.getStore(); if(!id) throw new Error('Authenticated user required'); return id; }
const initial = () => ({progress:{completed_days:[],solved_exercises:[],best_quiz_score:0,streak:0,active_theme:'light'},projects:{},submissions:[],quizzes:[],messages:[]});
async function state() { const row=await getOne('SELECT data FROM user_data WHERE user_id=?',[userId()]); return row ? JSON.parse(row.data) : initial(); }
async function mutate(fn) {
 const id=userId();
 return transaction(async db => {
   await db.query('INSERT INTO user_data VALUES (?,?) ON CONFLICT(user_id) DO NOTHING',[id,JSON.stringify(initial())]);
   const {rows}=await db.query('SELECT data FROM user_data WHERE user_id=? FOR UPDATE',[id]);
   const data=JSON.parse(rows[0].data), result=fn(data);
   await db.query('UPDATE user_data SET data=? WHERE user_id=?',[JSON.stringify(data),id]); return result;
 });
}
export async function getProgress() { return (await state()).progress; }
export async function updateProgress(data) { return mutate(s=>{for(const k of ['completed_days','solved_exercises','best_quiz_score','streak','active_theme']) if(data[k]!==undefined)s.progress[k]=data[k]; return s.progress;}); }
export async function resetProgress() { return mutate(s=>{const fresh=initial(); fresh.progress.active_theme=s.progress.active_theme; Object.assign(s,{...fresh,messages:s.messages}); return s.progress;}); }
export async function getProjectChecklists() { return (await state()).projects; }
export async function updateProjectStep(id,step,completed) { return mutate(s=>{const steps=new Set(s.projects[id]||[]); completed?steps.add(step):steps.delete(step);s.projects[id]=[...steps];return s.projects;}); }
export async function addSubmission({lessonId,assignmentId,userCode,status,architectFeedback}) { return mutate(s=>{s.submissions.unshift({id:randomUUID(),lesson_id:lessonId,user_code:userCode,status,architect_feedback:architectFeedback,submitted_at:new Date().toISOString()});if(status==='passed'&&!s.progress.solved_exercises.includes(lessonId))s.progress.solved_exercises.push(lessonId);if(status==='passed' && assignmentId){s.progress.solved_assignment_ids=[...new Set([...(s.progress.solved_assignment_ids||[]),`${lessonId}-${assignmentId}`])];}return s.submissions.filter(x=>x.lesson_id===lessonId);}); }
export async function getSubmissions(id) { return (await state()).submissions.filter(x=>!id||x.lesson_id===id); }
export async function recordQuizAttempt({score,total,answersJson}) { return mutate(s=>{s.quizzes.unshift({id:randomUUID(),score,total,answers_json:JSON.stringify(answersJson||{}),created_at:new Date().toISOString()});s.progress.best_quiz_score=Math.max(s.progress.best_quiz_score,score);return s.quizzes;}); }
export async function getQuizHistory() { return (await state()).quizzes; }
export async function getMentorMessages() { return (await state()).messages; }
export async function addMentorMessage({role,content}) { return mutate(s=>{s.messages.push({id:randomUUID(),role,content,created_at:new Date().toISOString()});return s.messages;}); }
export async function clearMentorMessages() { return mutate(s=>{s.messages=[];return [];}); }
export async function exportAllData() { const s=await state(); return {progress:s.progress,projectChecklists:s.projects,submissions:s.submissions,quizHistory:s.quizzes,mentorMessages:s.messages}; }
export async function checkAndIncrementApiUsage(limit=5000) {
 const date=new Date().toISOString().slice(0,10);
 const row=await getOne('INSERT INTO api_usage VALUES (?,1) ON CONFLICT(date) DO UPDATE SET request_count=api_usage.request_count+1 WHERE api_usage.request_count < ? RETURNING request_count',[date,limit]);
 return {allowed:!!row,count:row?.request_count??limit,limit};
}
export async function getApiUsage() { const date=new Date().toISOString().slice(0,10);return {date,count:(await getOne('SELECT request_count FROM api_usage WHERE date=?',[date]))?.request_count||0}; }
export async function checkAuthLimit(key) {
 const now=Date.now();
 const row=await getOne('INSERT INTO auth_attempts VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN auth_attempts.expires_at < ? THEN 1 ELSE auth_attempts.count+1 END, expires_at=CASE WHEN auth_attempts.expires_at < ? THEN EXCLUDED.expires_at ELSE auth_attempts.expires_at END RETURNING count',[key,now+60000,now,now]);
 return row.count<=20;
}
