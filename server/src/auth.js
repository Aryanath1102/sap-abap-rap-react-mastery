import { randomBytes, randomUUID, scryptSync, timingSafeEqual, createHash } from 'node:crypto';
import { collection, databaseHealthy, transaction, checkAuthLimit } from './db.js';
import { DEFAULT_GOOGLE_CLIENT_ID, verifyGoogleIdToken } from './googleAuth.js';
import { DEFAULT_GITHUB_CLIENT_ID, exchangeGithubCodeForProfile } from './githubAuth.js';
const digest=value=>createHash('sha256').update(value).digest('hex');
const hashPassword=password=>{const salt=randomBytes(16).toString('hex');return `${salt}:${scryptSync(password,salt,64).toString('hex')}`;};
function matches(password,stored) {const [salt,hash]=stored.split(':');return timingSafeEqual(Buffer.from(hash,'hex'),scryptSync(password,salt,64));}
const publicUser=u=>({id:u._id,userId:u._id,username:u.username,email:u.email,name:u.name,role:u.role,requestedRole:u.requested_role,status:u.status});
async function issueSession(res,user) {
 const token=randomBytes(32).toString('hex'),id=randomUUID(),age=8*60*60*1000;
 await collection('sessions').updateOne({_id:user._id},{$set:{sessionId:id,tokenHash:digest(token),expiresAt:new Date(Date.now()+age),loginTime:new Date().toISOString(),authVersion:user.authVersion||0}},{upsert:true});
 cookie(res,token,age);return {...publicUser(user),sessionId:id};
}
async function completeOAuthLogin(res,{provider,providerField,providerId,email,name,preferredUsername}) {
 let user=await collection('users').findOne({$or:[{[providerField]:providerId},{email}]});
 if(!user) {
  const raw=(preferredUsername||email.split('@')[0]).toLowerCase().replace(/[^a-z0-9_.-]/g,'').slice(0,48)||'sap_user';
  const normalizedBase=raw.length>=3?raw:`${raw}_sap`;
  const exists=await collection('users').findOne({username:normalizedBase});
  const username=exists?`${normalizedBase.slice(0,55)}_${randomBytes(3).toString('hex')}`:normalizedBase;
  user={_id:randomUUID(),username,email,name,password_hash:null,[providerField]:providerId,authProvider:provider,role:'student',requested_role:'student',status:'approved',authVersion:0};
  await collection('users').insertOne(user);
 } else {
  if(['rejected','disabled'].includes(user.status))return res.status(403).json({error:`Account ${user.status}. Administrator approval is required.`});
  const updates={};
  if(!user[providerField])updates[providerField]=providerId;
  if(user.status==='pending_approval'){updates.status='approved';user.status='approved';}
  if(Object.keys(updates).length>0)await collection('users').updateOne({_id:user._id},{$set:updates});
 }
 return res.json(await issueSession(res,user));
}
export async function initAuth() {
 if(!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD)return;
 if(await collection('users').findOne({role:'admin'}))return;
 if(process.env.ADMIN_PASSWORD.length<12)throw new Error('ADMIN_PASSWORD must have at least 12 characters');
 const user={username:process.env.ADMIN_USERNAME.toLowerCase(),email:(process.env.ADMIN_EMAIL||`${process.env.ADMIN_USERNAME}@localhost`).toLowerCase(),name:'Administrator',password_hash:hashPassword(process.env.ADMIN_PASSWORD),role:'admin',requested_role:'admin',status:'approved',authVersion:0};
 // A fixed bootstrap identity prevents concurrent cold starts creating multiple administrators.
 try {await collection('users').updateOne({_id:'bootstrap_admin'},{$setOnInsert:user},{upsert:true});}
 catch(e){if(e.code!==11000 || !await collection('users').findOne({_id:'bootstrap_admin'}))throw e;}
}
function cookie(res,token,age) {res.cookie('sap_session',token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:age});}
export async function requireAuth(req,res,next) {
 const token=(req.headers.cookie||'').split(';').map(v=>v.trim()).find(v=>v.startsWith('sap_session='))?.slice(12);
 const session=token&&await collection('sessions').findOne({tokenHash:digest(token),expiresAt:{$gt:new Date()}});
 const user=session&&await collection('users').findOne({_id:session._id,status:'approved'});
 if(!user || (user.authVersion||0)!==session.authVersion)return res.status(401).json({error:'Please sign in again.'});
 req.user={...user,id:user._id,sessionId:session.sessionId};next();
}
const admin=(req,res,next)=>req.user.role==='admin'?next():res.status(403).json({error:'Administrator access required.'});
export function mountAuth(app) {
 app.use('/api',(req,res,next)=>{
  if(!['GET','HEAD','OPTIONS'].includes(req.method)) {
   const allowed=process.env.APP_ORIGIN||`${req.protocol}://${req.get('host')}`;
   if(req.headers.origin&&req.headers.origin!==allowed)return res.status(403).json({error:'Untrusted origin'});
   if(!req.is('application/json'))return res.status(415).json({error:'JSON required'});
  }
  next();
 });
 app.use('/api/auth',async(req,res,next)=>{
  if(req.method==='POST'&&!await checkAuthLimit(digest(req.ip||'unknown')))return res.status(429).json({error:'Too many attempts. Try again in a minute.'});next();
 });
 app.get('/api/broadcast',async(req,res)=>res.json((await collection('settings').findOne({_id:'broadcast'}))?.data||{active:false,message:''}));
 app.get('/api/auth/config',(req,res)=>res.json({
  googleClientId:process.env.GOOGLE_CLIENT_ID||DEFAULT_GOOGLE_CLIENT_ID,
  githubClientId:process.env.GITHUB_CLIENT_ID||DEFAULT_GITHUB_CLIENT_ID
 }));
 app.post('/api/auth/register',async(req,res)=>{
  const {username,email,password,name='',role}=req.body;
  if(typeof username!=='string'||!/^[a-zA-Z0-9_.-]{3,64}$/.test(username)||typeof email!=='string'||!email.includes('@')||typeof password!=='string'||password.length<12||password.length>256)return res.status(400).json({error:'Provide a username, email, and password of 12–256 characters.'});
  await collection('users').insertOne({_id:randomUUID(),username:username.toLowerCase(),email:email.toLowerCase(),name:String(name).slice(0,128),password_hash:hashPassword(password),role:'student',requested_role:role==='admin'?'admin':'student',status:'pending_approval',authVersion:0});
  res.status(201).json({pendingApproval:true});
 });
 app.post('/api/auth/login',async(req,res)=>{
  const {usernameOrEmail,password}=req.body;
  if(typeof usernameOrEmail!=='string'||typeof password!=='string'||password.length>256)return res.status(400).json({error:'Credentials required.'});
  const input=usernameOrEmail.toLowerCase();
  const user=await collection('users').findOne({$or:[{username:input},{email:input}]});
  if(!user||!user.password_hash||!matches(password,user.password_hash))return res.status(401).json({error:'Incorrect username or password.'});
  if(user.status!=='approved')return res.status(403).json({error:`Account ${user.status}. Administrator approval is required.`});
  res.json(await issueSession(res,user));
 });
 app.post('/api/auth/google',async(req,res)=>{
  const {credential}=req.body||{};
  if(typeof credential!=='string'||!credential.trim())return res.status(400).json({error:'Google credential token is required.'});
  let profile;
  try {profile=await verifyGoogleIdToken(credential);}
  catch(err) {return res.status(401).json({error:err.message||'Google sign-in verification failed.'});}
  return completeOAuthLogin(res,{provider:'google',providerField:'googleSub',providerId:profile.sub,email:profile.email,name:profile.name});
 });
 app.post('/api/auth/github',async(req,res)=>{
  const {code,redirectUri}=req.body||{};
  if(typeof code!=='string'||!code.trim())return res.status(400).json({error:'GitHub authorization code is required.'});
  const allowedOrigin=process.env.APP_ORIGIN||req.headers.origin||`${req.protocol}://${req.get('host')}`;
  if(redirectUri&&typeof redirectUri==='string'&&!redirectUri.startsWith(allowedOrigin))return res.status(400).json({error:'Invalid GitHub redirect URI.'});
  let profile;
  try {profile=await exchangeGithubCodeForProfile({code,redirectUri});}
  catch(err) {return res.status(err.statusCode||401).json({error:err.message||'GitHub sign-in verification failed.'});}
  return completeOAuthLogin(res,{provider:'github',providerField:'githubId',providerId:profile.id,email:profile.email,name:profile.name,preferredUsername:profile.login});
 });
 app.get('/api/auth/session',requireAuth,(req,res)=>res.json({...publicUser(req.user),sessionId:req.user.sessionId}));
 app.post('/api/auth/logout',requireAuth,async(req,res)=>{await collection('sessions').deleteOne({sessionId:req.user.sessionId});cookie(res,'',0);res.json({success:true});});
 app.use('/api/admin',requireAuth,admin);
 app.get('/api/admin/database',async(req,res)=>res.json({storageType:'MongoDB Atlas',connected:await databaseHealthy()}));
 app.put('/api/admin/broadcast',async(req,res)=>{const data={active:true,message:String(req.body.message||'').slice(0,2000)};await collection('settings').updateOne({_id:'broadcast'},{$set:{data}},{upsert:true});res.json(data);});
 app.get('/api/admin/users',async(req,res)=>res.json((await collection('users').find({}).toArray()).map(publicUser)));
 app.patch('/api/admin/users/:id',async(req,res)=>{
  const user=await collection('users').findOne({_id:req.params.id});
  if(!user)return res.status(404).json({error:'User not found'});
  const status=req.body.status??user.status,role=req.body.role??user.role;
  if(!['approved','pending_approval','rejected','disabled'].includes(status)||!['admin','student'].includes(role))return res.status(400).json({error:'Invalid status or role'});
  if(user._id===req.user.id&&(role!=='admin'||status!=='approved'))return res.status(400).json({error:'Cannot revoke your own administrator access'});
  await transaction(async session=>{
   await collection('users').updateOne({_id:user._id},{$set:{status,role},$inc:{authVersion:1}},{session});
   await collection('sessions').deleteOne({_id:user._id},{session});
  });res.json({success:true});
 });
 app.delete('/api/admin/users/:id',async(req,res)=>{
  if(req.params.id===req.user.id)return res.status(400).json({error:'Cannot delete yourself'});
  await transaction(async session=>{
   await collection('users').deleteOne({_id:req.params.id},{session});
   await collection('sessions').deleteOne({_id:req.params.id},{session});
   await collection('user_data').deleteOne({_id:req.params.id},{session});
  });res.json({success:true});
 });
 app.get('/api/admin/sessions',async(req,res)=>{
  const sessions=await collection('sessions').find({expiresAt:{$gt:new Date()}}).toArray();
  const result=[];
  for(const session of sessions){const user=await collection('users').findOne({_id:session._id,status:'approved'});if(user&&(user.authVersion||0)===session.authVersion)result.push({sessionId:session.sessionId,username:user.username,role:user.role,loginTime:session.loginTime});}
  res.json(result);
 });
 app.delete('/api/admin/sessions/:id',async(req,res)=>{await collection('sessions').deleteOne({sessionId:req.params.id});res.json({success:true});});
}
