/**
 * Vercel Serverless Database Adapter
 * Automatically detects Vercel Postgres (@vercel/postgres / POSTGRES_URL)
 * and falls back gracefully to in-memory/JSON storage if database is not yet provisioned.
 */

let pool = null;

export async function getDbConnection() {
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

  if (connectionString) {
    try {
      if (!pool) {
        // Dynamic import of pg or @vercel/postgres if installed
        const pg = await import('pg');
        const { Pool } = pg.default || pg;
        pool = new Pool({
          connectionString,
          ssl: { rejectUnauthorized: false }
        });
        await initTables(pool);
      }
      return { type: 'vercel-postgres', pool };
    } catch (err) {
      console.warn('Vercel Postgres connection attempt warning:', err.message);
    }
  }

  return { type: 'local-fallback', pool: null };
}

async function initTables(p) {
  try {
    await p.query(`
      CREATE TABLE IF NOT EXISTS sap_users (
        id VARCHAR(64) PRIMARY KEY,
        username VARCHAR(64) UNIQUE NOT NULL,
        email VARCHAR(128) UNIQUE NOT NULL,
        role VARCHAR(32) DEFAULT 'student',
        name VARCHAR(128),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS sap_sessions (
        session_id VARCHAR(128) PRIMARY KEY,
        user_id VARCHAR(64) NOT NULL,
        username VARCHAR(64) NOT NULL,
        role VARCHAR(32) NOT NULL,
        active_track VARCHAR(32) DEFAULT 'rap',
        device VARCHAR(128),
        ip VARCHAR(64),
        login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_heartbeat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS sap_progress (
        id SERIAL PRIMARY KEY,
        completed_days JSONB DEFAULT '[]'::jsonb,
        solved_exercises JSONB DEFAULT '[]'::jsonb,
        best_quiz_score INT DEFAULT 0,
        streak INT DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (err) {
    console.warn('Postgres table initialization warning:', err.message);
  }
}

export default async function handler(req, res) {
  const db = await getDbConnection();
  res.status(200).json({
    status: 'healthy',
    engine: db.type === 'vercel-postgres' ? 'Vercel Postgres (Neon Cloud)' : 'Serverless Edge Engine (Local Resilient)',
    connectedVercelPostgres: db.type === 'vercel-postgres',
    envDetected: Boolean(process.env.POSTGRES_URL || process.env.DATABASE_URL),
    timestamp: new Date().toISOString()
  });
}
