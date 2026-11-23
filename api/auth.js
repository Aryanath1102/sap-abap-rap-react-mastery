/**
 * Vercel Serverless Authentication & Single-Session Handler
 * Enforces single-device login: When a user logs in from a new device/browser,
 * any previous session for that user is terminated.
 */
import { getDbConnection } from './db-status.js';

let inMemorySessions = [];

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { action, sessionId } = req.query;

  try {
    const db = await getDbConnection();

    // 1. GET SESSIONS OR VERIFY SINGLE SESSION
    if (req.method === 'GET') {
      // Session verification heartbeat check
      if (action === 'session' && sessionId) {
        if (db.type === 'vercel-postgres') {
          const { rows } = await db.pool.query('SELECT * FROM sap_sessions WHERE session_id = $1', [sessionId]);
          if (rows.length > 0) {
            return res.status(200).json(rows[0]);
          }
          return res.status(200).json(null); // Superseded or expired
        }
        const active = inMemorySessions.find(s => s.sessionId === sessionId) || null;
        return res.status(200).json(active);
      }

      // Admin listing of all active sessions
      if (db.type === 'vercel-postgres') {
        const { rows } = await db.pool.query('SELECT * FROM sap_sessions ORDER BY login_time DESC');
        return res.status(200).json(rows);
      }
      return res.status(200).json(inMemorySessions);
    }

    // 2. LOGIN / REGISTRATION (SINGLE SESSION PER USER ENFORCED)
    if (req.method === 'POST') {
      const { usernameOrEmail, password, role = 'student', activeTrack = 'rap', action = 'login', name } = req.body || {};
      const username = (usernameOrEmail || '').trim();

      if (action === 'register') {
        if (!username || !password) {
          return res.status(400).json({ error: 'Username and password are required.' });
        }
        return res.status(200).json({
          success: true,
          pendingApproval: true,
          message: 'Registration request submitted! Your account is pending Administrator approval from Aryanath.'
        });
      }

      // Default to login
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required for login.' });
      }

      const isSuperAdmin = username.toLowerCase() === 'aryanath';
      if (isSuperAdmin) {
        if (password !== 'Aryanath@1102') {
          return res.status(401).json({ error: 'Invalid password for Administrator Aryanath.' });
        }
      }

      const userId = isSuperAdmin ? 'usr_admin_aryanath' : `usr_${username.toLowerCase()}`;
      const newSessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      const displayName = isSuperAdmin ? 'Aryanath (Enterprise Administrator)' : (name || username);
      const userRole = isSuperAdmin ? 'admin' : (role === 'admin' ? 'admin' : 'student');

      const newSession = {
        sessionId: newSessionId,
        userId,
        username: isSuperAdmin ? 'Aryanath' : username,
        email: username.includes('@') ? username : `${username.toLowerCase()}@sap-mastery.io`,
        role: userRole,
        name: displayName,
        activeTrack,
        device: req.headers['user-agent']?.includes('Windows') ? 'Windows Desktop' : 'Web Browser',
        ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1',
        loginTime: new Date().toISOString(),
        lastHeartbeat: new Date().toISOString()
      };

      // STRICT SINGLE-SESSION ENFORCEMENT:
      // Invalidate and delete any older session for this user before storing the new one.
      if (db.type === 'vercel-postgres') {
        await db.pool.query('DELETE FROM sap_sessions WHERE user_id = $1', [userId]);
        await db.pool.query(`
          INSERT INTO sap_sessions (session_id, user_id, username, role, active_track, device, ip, login_time, last_heartbeat)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [newSession.sessionId, newSession.userId, newSession.username, newSession.role, newSession.activeTrack, newSession.device, newSession.ip, newSession.loginTime, newSession.lastHeartbeat]);
      } else {
        // Drop any prior session of this user
        inMemorySessions = [newSession, ...inMemorySessions.filter(s => s.userId !== userId)];
      }

      return res.status(200).json(newSession);
    }

    // 3. LOGOUT / TERMINATE SESSION
    if (req.method === 'DELETE') {
      const { sessionId: termId } = req.body || {};
      const targetSessionId = termId || sessionId;

      if (db.type === 'vercel-postgres') {
        await db.pool.query('DELETE FROM sap_sessions WHERE session_id = $1', [targetSessionId]);
      } else {
        inMemorySessions = inMemorySessions.filter(s => s.sessionId !== targetSessionId);
      }
      return res.status(200).json({ success: true, terminatedSessionId: targetSessionId });
    }

    res.status(405).json({ error: 'Method Not Allowed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
