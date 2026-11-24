import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';
import { MongoClient } from 'mongodb';

export const userContext = new AsyncLocalStorage();
let client;
let database;
let ready;
export async function initDatabase() {
 if (!ready) ready=(async()=>{
  const uri=process.env.MONGODB_URI;
  if (!uri) throw new Error('Configure MONGODB_URI for MongoDB Atlas');
  client=new MongoClient(uri,{maxPoolSize:5,minPoolSize:0,serverSelectionTimeoutMS:10000});
  await client.connect();
  database=client.db(process.env.MONGODB_DB || 'sap_mastery');
  await Promise.all([
   collection('users').createIndex({username:1},{unique:true}),
   collection('users').createIndex({email:1},{unique:true}),
   collection('sessions').createIndex({tokenHash:1},{unique:true}),
   collection('sessions').createIndex({sessionId:1},{unique:true}),
   collection('sessions').createIndex({expiresAt:1},{expireAfterSeconds:0}),
   collection('auth_attempts').createIndex({expiresAt:1},{expireAfterSeconds:0})
  ]);
  await database.command({ping:1});
 })().catch(async e=>{await client?.close();client=null;database=null;ready=null;throw e;});
 return ready;
}
export function collection(name) { if(!database)throw new Error('Database not initialized');return database.collection(name); }
export async function databaseHealthy() { await database.command({ping:1});return true; }
export async function transaction(fn) {
 const session=client.startSession();
 try {return await session.withTransaction(()=>fn(session));}
 finally {await session.endSession();}
}
export async function closeDatabase() {await client?.close();ready=null;database=null;client=null;}
function userId() {const id=userContext.getStore();if(!id)throw new Error('Authenticated user required');return id;}
const initial=()=>({progress:{completed_days:[],solved_exercises:[],best_quiz_score:0,streak:0,active_theme:'light'},projects:{},submissions:[],quizzes:[],messages:[]});
async function state() {return (await collection('user_data').findOne({_id:userId()}))?.data || initial();}
async function mutate(fn) {
 const id=userId();
 try {await collection('user_data').updateOne({_id:id},{$setOnInsert:{data:initial()}},{upsert:true});}
 catch(e){if(e.code!==11000)throw e;}
 return transaction(async session=>{
  const user=await collection('users').findOne({_id:id,status:'approved'},{session});
  if(!user)throw new Error('Active user required');
  const row=await collection('user_data').findOne({_id:id},{session});
  const result=fn(row.data);
  await collection('user_data').updateOne({_id:id},{$set:{data:row.data}},{session});
  return result;
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
 try {await collection('api_usage').updateOne({_id:date},{$setOnInsert:{count:0}},{upsert:true});}catch(e){if(e.code!==11000)throw e;}
 const row=await collection('api_usage').findOneAndUpdate({_id:date,count:{$lt:limit}},{$inc:{count:1}},{returnDocument:'after'});
 return {allowed:!!row,count:row?.count??limit,limit};
}
export async function getApiUsage() {const date=new Date().toISOString().slice(0,10);return {date,count:(await collection('api_usage').findOne({_id:date}))?.count||0};}
export async function checkAuthLimit(key) {
 const bucket=Math.floor(Date.now()/60000),id=`${key}:${bucket}`;
 const row=await collection('auth_attempts').findOneAndUpdate({_id:id},{$inc:{count:1},$setOnInsert:{expiresAt:new Date((bucket+2)*60000)}},{upsert:true,returnDocument:'after'});
 return row.count<=20;
}
