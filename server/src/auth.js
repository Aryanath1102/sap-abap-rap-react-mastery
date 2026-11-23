import { randomBytes, randomUUID, scryptSync, timingSafeEqual, createHash } from 'node:crypto';
import { getOne, getAll, runSql } from './db.js';
const digest = value => createHash('sha256').update(value).digest('hex');
const hashPassword = password => { const salt = randomBytes(16).toString('hex'); return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`; };
function matches(password, stored) { const [salt, hash] = stored.split(':'); return timingSafeEqual(Buffer.from(hash, 'hex'), scryptSync(password, salt, 64)); }
const publicUser = u => ({ id: u.id, userId: u.id, username: u.username, email: u.email, name: u.name, role: u.role, requestedRole: u.requested_role, status: u.status });
export function initAuth() {
  runSql('CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY, data TEXT NOT NULL)');
  runSql(`CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, username TEXT UNIQUE COLLATE NOCASE, email TEXT UNIQUE COLLATE NOCASE, name TEXT, password_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'student', requested_role TEXT NOT NULL DEFAULT 'student', status TEXT NOT NULL DEFAULT 'pending_approval')`);
  runSql(`CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, token_hash TEXT UNIQUE NOT NULL, user_id TEXT UNIQUE NOT NULL, expires_at INTEGER NOT NULL, login_time TEXT NOT NULL)`);
  if (!getOne('SELECT id FROM users WHERE role = ?', ['admin']) && process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD) {
    if (process.env.ADMIN_PASSWORD.length < 12) throw new Error('ADMIN_PASSWORD must have at least 12 characters');
    runSql('INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [randomUUID(), process.env.ADMIN_USERNAME.toLowerCase(), process.env.ADMIN_EMAIL || `${process.env.ADMIN_USERNAME}@localhost`, 'Administrator', hashPassword(process.env.ADMIN_PASSWORD), 'admin', 'admin', 'approved']);
  }
}
function cookie(res, token, age) { res.cookie('sap_session', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: age }); }
export function requireAuth(req, res, next) {
  const token = (req.headers.cookie || '').split(';').map(v => v.trim()).find(v => v.startsWith('sap_session='))?.slice(12);
  const session = token && getOne('SELECT s.id AS sessionId, s.expires_at, s.login_time, u.* FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=?', [digest(token)]);
  if (!session || session.expires_at <= Date.now() || session.status !== 'approved') return res.status(401).json({ error: 'Please sign in again.' });
  req.user = session; next();
}
const admin = (req, res, next) => req.user.role === 'admin' ? next() : res.status(403).json({ error: 'Administrator access required.' });
export function mountAuth(app) {
  // Browser mutations must originate from our UI. JSON-only requests also prevent form CSRF.
  app.use('/api', (req, res, next) => {
    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      const allowed = process.env.APP_ORIGIN || 'http://localhost:5173';
      if (req.headers.origin && req.headers.origin !== allowed) return res.status(403).json({ error: 'Untrusted origin' });
      if (!req.is('application/json')) return res.status(415).json({ error: 'JSON required' });
    }
    next();
  });
  const attempts = new Map();
  app.use('/api/auth', (req, res, next) => {
    if (req.method !== 'POST') return next();
    const key = req.ip; const entry = attempts.get(key);
    if (!entry || entry.until < Date.now()) attempts.set(key, { count: 1, until: Date.now() + 60000 });
    else if (++entry.count > 20) return res.status(429).json({ error: 'Too many attempts. Try again in a minute.' });
    next();
  });
  app.get('/api/broadcast', (req,res) => res.json(getOne('SELECT data FROM settings WHERE id=1') ? JSON.parse(getOne('SELECT data FROM settings WHERE id=1').data) : {active:false,message:''}));
  app.post('/api/auth/register', (req, res) => {
    const { username, email, password, name = '', role } = req.body;
    if (typeof username !== 'string' || !/^[a-zA-Z0-9_.-]{3,64}$/.test(username) || typeof email !== 'string' || !email.includes('@') || typeof password !== 'string' || password.length < 12 || password.length > 256) return res.status(400).json({ error: 'Provide a username, email, and password of 12–256 characters.' });
    if (getOne('SELECT id FROM users WHERE username=? OR email=?', [username, email])) return res.status(409).json({ error: 'Username or email already registered.' });
    runSql('INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [randomUUID(), username.toLowerCase(), email.toLowerCase(), String(name).slice(0,128), hashPassword(password), 'student', role === 'admin' ? 'admin' : 'student', 'pending_approval']);
    res.status(201).json({ pendingApproval: true });
  });
  app.post('/api/auth/login', (req, res) => {
    const { usernameOrEmail, password } = req.body;
    if (typeof usernameOrEmail !== 'string' || typeof password !== 'string' || password.length > 256) return res.status(400).json({ error: 'Credentials required.' });
    const u = getOne('SELECT * FROM users WHERE username=? OR email=?', [usernameOrEmail, usernameOrEmail]);
    if (!u || !matches(password, u.password_hash)) return res.status(401).json({ error: 'Incorrect username or password.' });
    if (u.status !== 'approved') return res.status(403).json({ error: `Account ${u.status}. Administrator approval is required.` });
    const token = randomBytes(32).toString('hex'), id = randomUUID(), age = 8 * 60 * 60 * 1000;
    runSql('INSERT INTO sessions VALUES (?, ?, ?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET id=excluded.id, token_hash=excluded.token_hash, expires_at=excluded.expires_at, login_time=excluded.login_time', [id, digest(token), u.id, Date.now() + age, new Date().toISOString()]);
    cookie(res, token, age); res.json({ ...publicUser(u), sessionId: id });
  });
  app.get('/api/auth/session', requireAuth, (req, res) => res.json({ ...publicUser(req.user), sessionId: req.user.sessionId }));
  app.post('/api/auth/logout', requireAuth, (req, res) => { runSql('DELETE FROM sessions WHERE id=?', [req.user.sessionId]); cookie(res, '', 0); res.json({ success: true }); });
  app.use('/api/admin', requireAuth, admin);
  app.get('/api/admin/database', (req,res) => res.json({storageType:'SQLite', connected:true}));
  app.put('/api/admin/broadcast', (req,res) => { const data={active:true,message:String(req.body.message || '').slice(0,2000)}; runSql('INSERT INTO settings VALUES (1,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data',[JSON.stringify(data)]); res.json(data); });
  app.get('/api/admin/users', (req, res) => res.json(getAll('SELECT * FROM users').map(publicUser)));
  app.patch('/api/admin/users/:id', (req, res) => {
    const u = getOne('SELECT * FROM users WHERE id=?', [req.params.id]);
    if (!u) return res.status(404).json({ error: 'User not found' });
    const status = req.body.status ?? u.status, role = req.body.role ?? u.role;
    if (!['approved','pending_approval','rejected','disabled'].includes(status) || !['admin','student'].includes(role)) return res.status(400).json({ error: 'Invalid status or role' });
    if (u.id === req.user.id && (role !== 'admin' || status !== 'approved')) return res.status(400).json({ error: 'Cannot revoke your own administrator access' });
    runSql('UPDATE users SET status=?, role=? WHERE id=?', [status, role, u.id]);
    runSql('DELETE FROM sessions WHERE user_id=?', [u.id]); res.json({ success: true });
  });
  app.delete('/api/admin/users/:id', (req, res) => {
    if (req.params.id === req.user.id) return res.status(400).json({ error: 'Cannot delete yourself' });
    runSql('DELETE FROM sessions WHERE user_id=?', [req.params.id]); runSql('DELETE FROM user_data WHERE user_id=?', [req.params.id]); runSql('DELETE FROM users WHERE id=?', [req.params.id]); res.json({ success: true });
  });
  app.get('/api/admin/sessions', (req, res) => res.json(getAll('SELECT s.id AS sessionId, u.username, u.role, s.login_time AS loginTime FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.expires_at>?', [Date.now()])));
  app.delete('/api/admin/sessions/:id', (req, res) => { runSql('DELETE FROM sessions WHERE id=?', [req.params.id]); res.json({ success: true }); });
}
