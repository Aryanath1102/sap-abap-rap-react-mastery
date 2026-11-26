import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync, sign as cryptoSign } from 'node:crypto';
import {
  DEFAULT_GOOGLE_CLIENT_ID,
  clearGoogleJwksCache,
  verifyGoogleIdToken
} from '../src/googleAuth.js';

const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const publicJwk = {
  ...publicKey.export({ format: 'jwk' }),
  kid: 'test-kid-1',
  use: 'sig',
  alg: 'RS256'
};

function createSignedJwt(payloadOverrides = {}, { signingKey = privateKey, kid = 'test-kid-1' } = {}) {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT', kid })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      iss: 'https://accounts.google.com',
      aud: DEFAULT_GOOGLE_CLIENT_ID,
      sub: 'google-sub-12345',
      email: 'Dev.User@Example.com',
      email_verified: true,
      name: 'Dev User',
      iat: now - 10,
      exp: now + 3600,
      ...payloadOverrides
    })
  ).toString('base64url');
  const signature = cryptoSign('RSA-SHA256', Buffer.from(`${header}.${payload}`), signingKey).toString('base64url');
  return `${header}.${payload}.${signature}`;
}

function fakeJwksFetch() {
  return async () =>
    new Response(JSON.stringify({ keys: [publicJwk] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'cache-control': 'public, max-age=300' }
    });
}

test('verifyGoogleIdToken verifies valid RS256 Google token and normalizes email', async () => {
  clearGoogleJwksCache();
  const token = createSignedJwt();
  const profile = await verifyGoogleIdToken(token, { fetchImpl: fakeJwksFetch() });
  assert.deepEqual(profile, {
    sub: 'google-sub-12345',
    email: 'dev.user@example.com',
    name: 'Dev User',
    picture: ''
  });
});

test('verifyGoogleIdToken rejects wrong audience, expired token, unverified email, and tampered signature', async () => {
  clearGoogleJwksCache();
  await assert.rejects(
    verifyGoogleIdToken(createSignedJwt({ aud: 'other-client.apps.googleusercontent.com' }), {
      fetchImpl: fakeJwksFetch()
    }),
    /audience mismatch/
  );

  await assert.rejects(
    verifyGoogleIdToken(createSignedJwt({ exp: Math.floor(Date.now() / 1000) - 60 }), {
      fetchImpl: fakeJwksFetch()
    }),
    /expired/
  );

  await assert.rejects(
    verifyGoogleIdToken(createSignedJwt({ email_verified: false }), {
      fetchImpl: fakeJwksFetch()
    }),
    /Verified Google email/
  );

  const valid = createSignedJwt();
  const tampered = `${valid.slice(0, -4)}AAAA`;
  await assert.rejects(
    verifyGoogleIdToken(tampered, { fetchImpl: fakeJwksFetch() }),
    /signature/
  );
});
