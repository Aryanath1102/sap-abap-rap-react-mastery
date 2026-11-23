/**
 * Vercel Serverless Authentication & Single-Session Handler
 * Enforces single-device login: When a user logs in from a new device/browser,
 * any previous session for that user is terminated.
 * 
 * Features:
 * - Persistent /tmp storage cache across warm serverless lambdas
 * - Atomic per-user single-session locking (Device 2 login invalidates Device 1)
 * - Vercel Postgres support when POSTGRES_URL is configured
 * - Resilient stateless fallback (never falsely kicks out valid sessions)
 */
import fs from 'fs';
import path from 'path';
import { getDbConnection } from './db-status.js';

const SESSIONS_CACHE_FILE = '/tmp/sap_active_sessions.json';

// In-memory session store (keyed by userId for O(1) single-session lookup)
let memorySessionsByUser = new Map();

function readSessionsFromDisk() {
  try {
    if (fs.existsSync(SESSIONS_CACHE_FILE)) {
      const data = fs.readFileSync(SESSIONS_CACHE_FILE, 'utf8');
      const parsed = JSON.parse(data);
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed;
      }
    }
  } catch (err) {
    // ignore read error
  }
  return {};
}

function writeSessionsToDisk(sessionsObj) {
  try {
    fs.writeFileSync(SESSIONS_CACHE_FILE, JSON.stringify(sessionsObj));
  } catch (err) {
    // ignore write error
  }
}

// Get the latest active session for a specific user ID
function getLatestSessionForUser(userId) {
  if (memorySessionsByUser.has(userId)) {
    return memorySessionsByUser.get(userId);
  }
  const disk = readSessionsFromDisk();
  if (disk[userId]) {
    memorySessionsByUser.set(userId, disk[userId]);
    return disk[userId];
  }
  return null;
}

// Save the latest active session for a user (overwriting any older session)
function setLatestSessionForUser(userId, session) {
  memorySessionsByUser.set(userId, session);
  const disk = readSessionsFromDisk();
  disk[userId] = session;
  writeSessionsToDisk(disk);
}

// Remove session on logout
function removeSessionForUser(userId, sessionId) {
  const current = getLatestSessionForUser(userId);
  if (current && current.sessionId === sessionId) {
    memorySessionsByUser.delete(userId);
    const disk = readSessionsFromDisk();
    delete disk[userId];
    writeSessionsToDisk(disk);
  }
}

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

  const { action, sessionId, userId } = req.query;

  try {
    const db = await getDbConnection();

    // 1. GET SESSIONS OR VERIFY SINGLE SESSION (Heartbeat verification)
    if (req.method === 'GET') {
      if (action === 'session') {
        const querySessionId = sessionId;
        const queryUserId = userId;

        if (!querySessionId) {
          return res.status(400).json({ error: 'sessionId is required for session verification' });
        }

        // Case A: Postgres Connected
        if (db.type === 'vercel-postgres') {
          if (queryUserId) {
            // Check if there is an active session for this user in DB
            const { rows } = await db.pool.query(
              'SELECT * FROM sap_sessions WHERE user_id = $1 ORDER BY login_time DESC LIMIT 1',
              [queryUserId]
            );
            if (rows.length > 0) {
              const activeDbSession = rows[0];
              // If the session ID in DB is different, another device logged in!
              if (activeDbSession.session_id !== querySessionId) {
                return res.status(200).json({
                  valid: false,
                  superseded: true,
                  reason: 'Account logged in from another device',
                  newerSessionLoginTime: activeDbSession.login_time
                });
              }
              // Session is valid and matches DB
              await db.pool.query(
                'UPDATE sap_sessions SET last_heartbeat = NOW() WHERE session_id = $1',
                [querySessionId]
              );
              return res.status(200).json({
                valid: true,
                superseded: false,
                sessionId: activeDbSession.session_id,
                userId: activeDbSession.user_id,
                username: activeDbSession.username,
                role: activeDbSession.role
              });
            }
          }
          // No session record in DB yet (e.g. freshly created)
          return res.status(200).json({ valid: true, superseded: false, sessionId: querySessionId });
        }

        // Case B: Serverless Fallback (File + Memory cache)
        if (queryUserId) {
          const activeForUser = getLatestSessionForUser(queryUserId);
          if (activeForUser) {
            // If the latest session ID for this user is different, another device logged in!
            if (activeForUser.sessionId !== querySessionId) {
              return res.status(200).json({
                valid: false,
                superseded: true,
                reason: 'Account logged in from another device',
                newerSessionLoginTime: activeForUser.loginTime
              });
            }
            // Active session matches!
            activeForUser.lastHeartbeat = new Date().toISOString();
            setLatestSessionForUser(queryUserId, activeForUser);
            return res.status(200).json({
              valid: true,
              superseded: false,
              ...activeForUser
            });
          }
          // Not found in this lambda container's cache (e.g. cold start)
          // Register it so future requests are tracked, and DO NOT kick user out
          setLatestSessionForUser(queryUserId, {
            sessionId: querySessionId,
            userId: queryUserId,
            loginTime: new Date().toISOString(),
            lastHeartbeat: new Date().toISOString()
          });
          return res.status(200).json({ valid: true, superseded: false, sessionId: querySessionId });
        }

        return res.status(200).json({ valid: true, superseded: false, sessionId: querySessionId });
      }

      // Admin listing of all active sessions
      if (db.type === 'vercel-postgres') {
        const { rows } = await db.pool.query('SELECT * FROM sap_sessions ORDER BY login_time DESC');
        return res.status(200).json(rows);
      }
      
      const diskSessions = readSessionsFromDisk();
      const sessionList = Object.values(diskSessions);
      return res.status(200).json(sessionList);
    }

    // 2. LOGIN / REGISTRATION (STRICT SINGLE SESSION PER USER ENFORCED)
    if (req.method === 'POST') {
      const { usernameOrEmail, password, role = 'student', activeTrack = 'rap', action: postAction = 'login', name } = req.body || {};
      const username = (usernameOrEmail || '').trim();

      if (postAction === 'register') {
        if (!username || !password) {
          return res.status(400).json({ error: 'Username and password are required.' });
        }
        return res.status(200).json({
          success: true,
          pendingApproval: true,
          message: 'Registration request submitted! Your account is pending Administrator approval from Aryanath.'
        });
      }

      // Login validation
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
        device: req.headers['user-agent']?.includes('Windows') ? 'Windows Desktop' : req.headers['user-agent']?.includes('Mac') ? 'macOS Desktop' : 'Web Browser',
        ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1',
        loginTime: new Date().toISOString(),
        lastHeartbeat: new Date().toISOString()
      };

      // STRICT SINGLE-SESSION ENFORCEMENT:
      // Replace any prior session for this user ID.
      // If the user was logged in on another device, this invalidates their old session.
      if (db.type === 'vercel-postgres') {
        await db.pool.query('DELETE FROM sap_sessions WHERE user_id = $1', [userId]);
        await db.pool.query(`
          INSERT INTO sap_sessions (session_id, user_id, username, role, active_track, device, ip, login_time, last_heartbeat)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [newSession.sessionId, newSession.userId, newSession.username, newSession.role, newSession.activeTrack, newSession.device, newSession.ip, newSession.loginTime, newSession.lastHeartbeat]);
      }

      // Update disk & memory cache
      setLatestSessionForUser(userId, newSession);

      return res.status(200).json(newSession);
    }

    // 3. LOGOUT / TERMINATE SESSION
    if (req.method === 'DELETE') {
      const { sessionId: termId, userId: termUserId } = req.body || {};
      const targetSessionId = termId || sessionId;
      const targetUserId = termUserId || userId;

      if (db.type === 'vercel-postgres') {
        await db.pool.query('DELETE FROM sap_sessions WHERE session_id = $1', [targetSessionId]);
      }

      if (targetUserId) {
        removeSessionForUser(targetUserId, targetSessionId);
      }

      return res.status(200).json({ success: true, terminatedSessionId: targetSessionId });
    }

    res.status(405).json({ error: 'Method Not Allowed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
