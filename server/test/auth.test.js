import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

test('SQLite authentication and user isolation', async () => {
 const dir=await mkdtemp(join(tmpdir(),'sap-auth-'));
 process.env.SQLITE_PATH=join(dir,'test.sqlite');
 process.env.ADMIN_USERNAME='admin'; process.env.ADMIN_PASSWORD='Test-admin-password-123';
 const db=await import('../src/db.js'); const auth=await import('../src/auth.js');
 await db.initDatabase(); auth.initAuth();
 const app=express(); app.use(express.json()); auth.mountAuth(app);
 app.use('/api',auth.requireAuth,(req,res,next)=>db.userContext.run(req.user.id,next));
 app.get('/api/data',(req,res)=>res.json(db.exportAllData()));
 app.post('/api/data',(req,res)=> { db.updateProgress({completed_days:[1]}); db.addMentorMessage({role:'user',content:'private'}); db.recordQuizAttempt({score:1,total:1}); db.updateProjectStep('project',1,true); db.addSubmission({lessonId:'one',userCode:'private',status:'passed',architectFeedback:{}}); res.json({ok:true}); });
 const server=app.listen(0); await new Promise(r=>server.once('listening',r));
 const base=`http://127.0.0.1:${server.address().port}`;
 async function call(path,method='GET',body,cookie) { const r=await fetch(base+'/api'+path,{method,headers:{...(body?{'Content-Type':'application/json'}:{}),...(cookie?{cookie}:{})},body:body?JSON.stringify(body):undefined}); return {status:r.status,body:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]}; }
 try {
  assert.equal((await call('/data')).status,401);
  for(const username of ['alice','bobby']) assert.equal((await call('/auth/register','POST',{username,email:username+'@test.com',password:'Strong-password-123',role:'admin'})).status,201);
  assert.equal((await call('/auth/login','POST',{usernameOrEmail:'alice',password:'wrong'})).status,401);
  assert.equal((await call('/auth/login','POST',{usernameOrEmail:'alice',password:'Strong-password-123'})).status,403);
  const admin=await call('/auth/login','POST',{usernameOrEmail:'admin',password:process.env.ADMIN_PASSWORD}); assert.equal(admin.status,200);
  const users=(await call('/admin/users','GET',undefined,admin.cookie)).body;
  assert.ok(users.every(u=>!u.password_hash));
  for(const u of users.filter(u=>u.username!=='admin')) { assert.equal(u.role,'student'); assert.equal((await call('/admin/users/'+u.id,'PATCH',{status:'approved'},admin.cookie)).status,200); }
  const a=await call('/auth/login','POST',{usernameOrEmail:'alice',password:'Strong-password-123'});
  const b=await call('/auth/login','POST',{usernameOrEmail:'bobby',password:'Strong-password-123'});
  assert.equal((await call('/admin/users','GET',undefined,a.cookie)).status,403);
  assert.equal((await call('/admin/users/'+b.body.userId,'PATCH',{role:'admin'},a.cookie)).status,403);
  assert.equal((await call('/data','POST',{},a.cookie)).status,200);
  const isolated=(await call('/data','GET',undefined,b.cookie)).body;
  assert.deepEqual(isolated.progress.completed_days,[]); assert.deepEqual(isolated.mentorMessages,[]); assert.deepEqual(isolated.submissions,[]); assert.deepEqual(isolated.quizHistory,[]); assert.deepEqual(isolated.projectChecklists,{});
  const renewed=await call('/auth/login','POST',{usernameOrEmail:'alice',password:'Strong-password-123'});
  assert.equal((await call('/auth/session','GET',undefined,a.cookie)).status,401);
  assert.equal((await call('/auth/logout','POST',{},renewed.cookie)).status,200);
  assert.equal((await call('/data','GET',undefined,renewed.cookie)).status,401);
  db.runSql('UPDATE sessions SET expires_at=0 WHERE id=?',[b.body.sessionId]);
  assert.equal((await call('/data','GET',undefined,b.cookie)).status,401);
  assert.equal((await call('/auth/session','GET',undefined,'sap_session=fake')).status,401);
 } finally { await new Promise(r=>server.close(r)); await rm(dir,{recursive:true,force:true}); }
});
