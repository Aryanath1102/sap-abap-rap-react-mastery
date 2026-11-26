import { createPublicKey, verify as cryptoVerify } from 'node:crypto';

export const DEFAULT_GOOGLE_CLIENT_ID =
  '1051503220828-nqa80v2c9cpboi5i6tq6p5hvhniog25v.apps.googleusercontent.com';

const GOOGLE_JWKS_URL = 'https://www.googleapis.com/oauth2/v3/certs';
const VALID_ISSUERS = new Set(['https://accounts.google.com', 'accounts.google.com']);

let cachedJwks = null;
let cachedUntil = 0;

function decodeBase64UrlJson(segment) {
  const json = Buffer.from(segment, 'base64url').toString('utf8');
  return JSON.parse(json);
}

function parseCacheMaxAge(cacheControl) {
  const match = /max-age=(\d+)/i.exec(cacheControl || '');
  return match ? Number(match[1]) : 300;
}

async function getGoogleJwk(kid, { fetchImpl = fetch, forceRefresh = false } = {}) {
  const now = Date.now();
  if (!forceRefresh && cachedJwks && now < cachedUntil) {
    const hit = cachedJwks.find((k) => k.kid === kid);
    if (hit) return hit;
  }

  const res = await fetchImpl(GOOGLE_JWKS_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch Google JWKS (${res.status})`);
  }
  const body = await res.json();
  const keys = Array.isArray(body?.keys) ? body.keys : [];
  cachedJwks = keys;
  const maxAgeSec = parseCacheMaxAge(res.headers?.get?.('cache-control'));
  cachedUntil = Date.now() + maxAgeSec * 1000;

  return keys.find((k) => k.kid === kid) || null;
}

export function clearGoogleJwksCache() {
  cachedJwks = null;
  cachedUntil = 0;
}

/**
 * Cryptographically verifies a Google Sign-In ID token (JWT) against Google's JWKS.
 */
export async function verifyGoogleIdToken(
  idToken,
  {
    clientId = process.env.GOOGLE_CLIENT_ID || DEFAULT_GOOGLE_CLIENT_ID,
    fetchImpl = fetch,
    nowSeconds = Math.floor(Date.now() / 1000)
  } = {}
) {
  if (typeof idToken !== 'string' || !idToken.trim()) {
    throw new Error('Missing Google credential token');
  }

  const parts = idToken.trim().split('.');
  if (parts.length !== 3 || parts.some((p) => !p)) {
    throw new Error('Malformed Google credential token');
  }

  const [headerB64, payloadB64, signatureB64] = parts;
  let header;
  let payload;
  try {
    header = decodeBase64UrlJson(headerB64);
    payload = decodeBase64UrlJson(payloadB64);
  } catch {
    throw new Error('Invalid Google credential encoding');
  }

  if (header?.alg !== 'RS256' || typeof header?.kid !== 'string' || !header.kid) {
    throw new Error('Unsupported Google token signature algorithm');
  }

  if (payload?.aud !== clientId) {
    throw new Error('Google token audience mismatch');
  }
  if (!VALID_ISSUERS.has(payload?.iss)) {
    throw new Error('Invalid Google token issuer');
  }
  if (typeof payload?.exp !== 'number' || payload.exp <= nowSeconds) {
    throw new Error('Google credential expired');
  }
  if (payload?.email_verified !== true || typeof payload?.email !== 'string' || !payload.email.includes('@')) {
    throw new Error('Verified Google email is required');
  }
  if (typeof payload?.sub !== 'string' || !payload.sub) {
    throw new Error('Invalid Google subject');
  }

  let jwk = await getGoogleJwk(header.kid, { fetchImpl });
  if (!jwk) {
    jwk = await getGoogleJwk(header.kid, { fetchImpl, forceRefresh: true });
  }
  if (!jwk) {
    throw new Error('Google signing key not found');
  }

  const publicKey = createPublicKey({ key: jwk, format: 'jwk' });
  const verified = cryptoVerify(
    'RSA-SHA256',
    Buffer.from(`${headerB64}.${payloadB64}`),
    publicKey,
    Buffer.from(signatureB64, 'base64url')
  );
  if (!verified) {
    throw new Error('Invalid Google token signature');
  }

  return {
    sub: payload.sub,
    email: payload.email.toLowerCase(),
    name: String(payload.name || payload.email.split('@')[0]).slice(0, 128),
    picture: typeof payload.picture === 'string' ? payload.picture : ''
  };
}
