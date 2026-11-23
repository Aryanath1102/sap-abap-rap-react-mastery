import { randomBytes, randomUUID, scryptSync, timingSafeEqual, createHash } from 'node:crypto';
import { getOne, getAll, runSql, transaction, checkAuthLimit } from './db.js';
const digest = value => createHash('sha256').update(value).digest('hex');
const hashPassword = password => { const salt = randomBytes(16).toString('hex'); return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`; };
function matches(password, stored) { const [salt, hash] = stored.split(':'); return timingSafeEqual(Buffer.from(hash, 'hex'), scryptSync(password, salt, 64)); }
const publicUser = u => ({ id: u.id, userId: u.id, username: u.username, email: u.email, name: u.name, role: u.role, requestedRole: u.requested_role, status: u.status });
export async function initAuth() {
 if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) return;
 if (process.env.ADMIN_PASSWORD.length < 12) throw new Error('ADMIN_PASSWORD must have at least 12 characters');
 await transaction(async db => {
  await db.query('SELECT pg_advisory_xact_lock(7341022)');
  const {rows}=await db.query("SELECT id FROM users WHERE role='admin'");
  if (!rows.length) await db.query('INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [randomUUID(), process.env.ADMIN_USERNAME.toLowerCase(), (process.env.ADMIN_EMAIL || `${process.env.ADMIN_USERNAME}@localhost`).toLowerCase(), 'Administrator', hashPassword(process.env.ADMIN_PASSWORD), 'admin', 'admin', 'approved']);
 });
}
function cookie(res, token, age) { res.cookie('sap_session', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: age }); }
export async function requireAuth(req, res, next) {
  const token = (req.headers.cookie || '').split(';').map(v => v.trim()).find(v => v.startsWith('sap_session='))?.slice(12);
  const session = token && (await getOne('SELECT s.id AS "sessionId", s.expires_at, s.login_time, u.* FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=?', [digest(token)]));
  if (!session || session.expires_at <= Date.now() || session.status !== 'approved') return res.status(401).json({ error: 'Please sign in again.' });
  req.user = session; next();
}
const admin = async (req, res, next) => req.user.role === 'admin' ? next() : res.status(403).json({ error: 'Administrator access required.' });
export function mountAuth(app) {
  // Browser mutations must originate from our UI. JSON-only requests also prevent form CSRF.
  app.use('/api', async (req, res, next) => {
    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      const allowed = process.env.APP_ORIGIN || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5173');
      if (req.headers.origin && req.headers.origin !== allowed) return res.status(403).json({ error: 'Untrusted origin' });
      if (!req.is('application/json')) return res.status(415).json({ error: 'JSON required' });
    }
    next();
  });
  app.use('/api/auth', async (req,res,next) => {
    if (req.method === 'POST' && !await checkAuthLimit(digest(req.ip || 'unknown'))) return res.status(429).json({error:'Too many attempts. Try again in a minute.'});
    next();
  });
  app.get('/api/broadcast', async (req,res) => res.json((await getOne('SELECT data FROM settings WHERE id=1')) ? JSON.parse((await getOne('SELECT data FROM settings WHERE id=1')).data) : {active:false,message:''}));
  app.post('/api/auth/register', async (req, res) => {
    const { username, email, password, name = '', role } = req.body;
    if (typeof username !== 'string' || !/^[a-zA-Z0-9_.-]{3,64}$/.test(username) || typeof email !== 'string' || !email.includes('@') || typeof password !== 'string' || password.length < 12 || password.length > 256) return res.status(400).json({ error: 'Provide a username, email, and password of 12–256 characters.' });
    if ((await getOne('SELECT id FROM users WHERE username=? OR email=?', [username.toLowerCase(), email.toLowerCase()]))) return res.status(409).json({ error: 'Username or email already registered.' });
    (await runSql('INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [randomUUID(), username.toLowerCase(), email.toLowerCase(), String(name).slice(0,128), hashPassword(password), 'student', role === 'admin' ? 'admin' : 'student', 'pending_approval']));
    res.status(201).json({ pendingApproval: true });
  });
  app.post('/api/auth/login', async (req, res) => {
    const { usernameOrEmail, password } = req.body;
    if (typeof usernameOrEmail !== 'string' || typeof password !== 'string' || password.length > 256) return res.status(400).json({ error: 'Credentials required.' });
    const u = (await getOne('SELECT * FROM users WHERE username=? OR email=?', [usernameOrEmail.toLowerCase(), usernameOrEmail.toLowerCase()]));
    if (!u || !matches(password, u.password_hash)) return res.status(401).json({ error: 'Incorrect username or password.' });
    if (u.status !== 'approved') return res.status(403).json({ error: `Account ${u.status}. Administrator approval is required.` });
    const token = randomBytes(32).toString('hex'), id = randomUUID(), age = 8 * 60 * 60 * 1000;
    (await runSql('INSERT INTO sessions VALUES (?, ?, ?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET id=excluded.id, token_hash=excluded.token_hash, expires_at=excluded.expires_at, login_time=excluded.login_time', [id, digest(token), u.id, Date.now() + age, new Date().toISOString()]));
    cookie(res, token, age); res.json({ ...publicUser(u), sessionId: id });
  });
  app.get('/api/auth/session', requireAuth, async (req, res) => res.json({ ...publicUser(req.user), sessionId: req.user.sessionId }));
  app.post('/api/auth/logout', requireAuth, async (req, res) => { (await runSql('DELETE FROM sessions WHERE id=?', [req.user.sessionId])); cookie(res, '', 0); res.json({ success: true }); });
  app.use('/api/admin', requireAuth, admin);
  app.get('/api/admin/database', async (req,res) => res.json({storageType:'Vercel PostgreSQL', connected:!!(await getOne('SELECT 1 AS ok'))}));
  app.put('/api/admin/broadcast', async (req,res) => { const data={active:true,message:String(req.body.message || '').slice(0,2000)}; (await runSql('INSERT INTO settings VALUES (1,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data',[JSON.stringify(data)])); res.json(data); });
  app.get('/api/admin/users', async (req, res) => res.json((await getAll('SELECT * FROM users')).map(publicUser)));
  app.patch('/api/admin/users/:id', async (req, res) => {
    const u = (await getOne('SELECT * FROM users WHERE id=?', [req.params.id]));
    if (!u) return res.status(404).json({ error: 'User not found' });
    const status = req.body.status ?? u.status, role = req.body.role ?? u.role;
    if (!['approved','pending_approval','rejected','disabled'].includes(status) || !['admin','student'].includes(role)) return res.status(400).json({ error: 'Invalid status or role' });
    if (u.id === req.user.id && (role !== 'admin' || status !== 'approved')) return res.status(400).json({ error: 'Cannot revoke your own administrator access' });
    await transaction(async db => {
      await db.query('UPDATE users SET status=?, role=? WHERE id=?', [status, role, u.id]);
      await db.query('DELETE FROM sessions WHERE user_id=?', [u.id]);
    }); res.json({ success: true });
  });
  app.delete('/api/admin/users/:id', async (req, res) => {
    if (req.params.id === req.user.id) return res.status(400).json({ error: 'Cannot delete yourself' });
    await runSql('DELETE FROM users WHERE id=?', [req.params.id]); res.json({ success: true });
  });
  app.get('/api/admin/sessions', async (req, res) => res.json((await getAll('SELECT s.id AS "sessionId", u.username, u.role, s.login_time AS "loginTime" FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.expires_at>?', [Date.now()]))));
  app.delete('/api/admin/sessions/:id', async (req, res) => { (await runSql('DELETE FROM sessions WHERE id=?', [req.params.id])); res.json({ success: true }); });
}
