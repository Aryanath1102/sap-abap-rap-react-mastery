/**
 * Vercel Serverless Authentication & Concurrent Session Handler
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

  const { action } = req.query;

  try {
    const db = await getDbConnection();

    // 1. GET ALL ACTIVE SESSIONS
    if (req.method === 'GET') {
      if (db.type === 'vercel-postgres') {
        const { rows } = await db.pool.query('SELECT * FROM sap_sessions ORDER BY login_time DESC');
        return res.status(200).json(rows);
      }
      return res.status(200).json(inMemorySessions);
    }

    // 2. LOGIN (CONCURRENT SESSION CREATION)
    if (req.method === 'POST') {
      const { usernameOrEmail, role = 'student', activeTrack = 'rap' } = req.body || {};
      const username = (usernameOrEmail || 'developer').trim().toLowerCase();
      const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      const name = username.charAt(0).toUpperCase() + username.slice(1);
      const userRole = username.includes('admin') || role === 'admin' ? 'admin' : 'student';

      const newSession = {
        sessionId,
        userId: `usr_${username}`,
        username,
        email: username.includes('@') ? username : `${username}@sap-mastery.io`,
        role: userRole,
        name,
        activeTrack,
        device: req.headers['user-agent']?.includes('Windows') ? 'Windows Desktop' : 'Web Browser',
        ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1',
        loginTime: new Date().toISOString(),
        lastHeartbeat: new Date().toISOString()
      };

      if (db.type === 'vercel-postgres') {
        await db.pool.query(`
          INSERT INTO sap_sessions (session_id, user_id, username, role, active_track, device, ip, login_time, last_heartbeat)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [newSession.sessionId, newSession.userId, newSession.username, newSession.role, newSession.activeTrack, newSession.device, newSession.ip, newSession.loginTime, newSession.lastHeartbeat]);
      } else {
        inMemorySessions = [newSession, ...inMemorySessions.filter(s => s.sessionId !== sessionId)];
      }

      return res.status(200).json(newSession);
    }

    // 3. LOGOUT / KICK SESSION
    if (req.method === 'DELETE') {
      const { sessionId } = req.body || {};
      if (db.type === 'vercel-postgres') {
        await db.pool.query('DELETE FROM sap_sessions WHERE session_id = $1', [sessionId]);
      } else {
        inMemorySessions = inMemorySessions.filter(s => s.sessionId !== sessionId);
      }
      return res.status(200).json({ success: true, terminatedSessionId: sessionId });
    }

    res.status(405).json({ error: 'Method Not Allowed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
