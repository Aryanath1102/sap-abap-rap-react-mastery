import test from 'node:test';
import assert from 'node:assert/strict';
test('PostgreSQL authentication, production routes and user isolation', async () => {
 process.env.NODE_ENV='test';
 process.env.ADMIN_USERNAME='admin'; process.env.ADMIN_PASSWORD='Test-admin-password-123';
 const { PGlite }=await import('@electric-sql/pglite');
 const engine=new PGlite();
 // PGlite is real PostgreSQL in WASM, with one connection. Serialize leases for tests.
 let tail=Promise.resolve();
 async function lease() { let unlock;const previous=tail;tail=new Promise(r=>unlock=r);await previous;return unlock; }
 const query=async(text,params=[])=>text.includes('CREATE TABLE') ? (await engine.exec(text),{rows:[]}) : engine.query(text,params);
 const pool={connect:async()=>{const release=await lease();return {query,release};},query:async(text,params)=>{const release=await lease();try{return await query(text,params);}finally{release();}},end:()=>engine.close()};
 const db=await import('../src/db.js'); const auth=await import('../src/auth.js');
 await db.initDatabase(pool); await auth.initAuth();
 const {app}=await import('../src/index.js');
 const server=app.listen(0); await new Promise(r=>server.once('listening',r));
 const base=`http://127.0.0.1:${server.address().port}`;
 async function call(path,method='GET',body,cookie) { const r=await fetch(base+'/api'+path,{method,headers:{...(body?{'Content-Type':'application/json'}:{}),...(cookie?{cookie}:{})},body:body?JSON.stringify(body):undefined}); return {status:r.status,body:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]}; }
 try {
  assert.equal((await call('/export')).status,401);
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
  assert.equal((await call('/progress','PUT',{completed_days:[1]},a.cookie)).status,200);
  assert.equal((await call('/mentor/chat','POST',{content:'Explain RAP'},a.cookie)).status,200);
  assert.equal((await call('/quiz/attempt','POST',{score:1,total:1},a.cookie)).status,200);
  assert.equal((await call('/projects/demo/steps','PUT',{stepIndex:1,completed:true},a.cookie)).status,200);
  assert.equal((await call('/assignments/submit','POST',{lessonId:'one',userCode:'private'},a.cookie)).status,200);
  const own=(await call('/export','GET',undefined,a.cookie)).body;
  assert.equal(own.submissions.length,1);assert.equal(own.quizHistory.length,1);assert.equal(own.mentorMessages.length,2);
  assert.deepEqual(own.progress.completed_days,[1]);assert.deepEqual(own.projectChecklists.demo,[1]);
  assert.ok(await db.getOne('SELECT data FROM user_data WHERE user_id=?',[a.body.userId]));
  const isolated=(await call('/export','GET',undefined,b.cookie)).body;
  assert.deepEqual(isolated.progress.completed_days,[]); assert.deepEqual(isolated.mentorMessages,[]); assert.deepEqual(isolated.submissions,[]); assert.deepEqual(isolated.quizHistory,[]); assert.deepEqual(isolated.projectChecklists,{});
  const renewed=await call('/auth/login','POST',{usernameOrEmail:'alice',password:'Strong-password-123'});
  assert.equal((await call('/auth/session','GET',undefined,a.cookie)).status,401);
  assert.equal((await call('/auth/logout','POST',{},renewed.cookie)).status,200);
  assert.equal((await call('/export','GET',undefined,renewed.cookie)).status,401);
  await db.runSql('UPDATE sessions SET expires_at=0 WHERE id=?',[b.body.sessionId]);
  assert.equal((await call('/export','GET',undefined,b.cookie)).status,401);
  assert.equal((await call('/auth/session','GET',undefined,'sap_session=fake')).status,401);
  const fresh=await call('/auth/login','POST',{usernameOrEmail:'alice',password:'Strong-password-123'});
  await Promise.all([call('/projects/concurrent/steps','PUT',{stepIndex:1,completed:true},fresh.cookie),call('/projects/concurrent/steps','PUT',{stepIndex:2,completed:true},fresh.cookie)]);
  assert.deepEqual((await call('/projects','GET',undefined,fresh.cookie)).body.concurrent.sort(),[1,2]);
  await call('/admin/broadcast','PUT',{message:'Shared announcement'},admin.cookie);
  assert.equal((await call('/broadcast')).body.message,'Shared announcement');
  await call('/admin/users/'+fresh.body.userId,'PATCH',{status:'disabled'},admin.cookie);
  assert.equal((await call('/progress','GET',undefined,fresh.cookie)).status,401);
  assert.equal((await call('/admin/database','GET',undefined,admin.cookie)).body.connected,true);
  for(let i=0;i<20;i++)assert.equal(await db.checkAuthLimit('test-limit'),true);
  assert.equal(await db.checkAuthLimit('test-limit'),false);
  const csrf=await fetch(base+'/api/admin/broadcast',{method:'PUT',headers:{'Content-Type':'application/json',origin:'https://untrusted.invalid',cookie:admin.cookie},body:JSON.stringify({message:'no'})});
  assert.equal(csrf.status,403);
 } finally { await new Promise(r=>server.close(r)); await db.closeDatabase(); }
});

test('Missing PostgreSQL configuration fails closed', async()=>{
 delete process.env.POSTGRES_URL;delete process.env.DATABASE_URL;
 const {initDatabase}=await import('../src/db.js');
 await assert.rejects(initDatabase(), /POSTGRES_URL/);
});
