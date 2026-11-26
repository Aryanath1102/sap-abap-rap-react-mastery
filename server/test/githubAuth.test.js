import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_GITHUB_CLIENT_ID, exchangeGithubCodeForProfile } from '../src/githubAuth.js';

test('exchangeGithubCodeForProfile exchanges code and resolves primary verified email', async () => {
  const fakeFetch = async (url) => {
    if (url.includes('login/oauth/access_token')) {
      return new Response(JSON.stringify({ access_token: 'gho_test_token' }), { status: 200 });
    }
    if (url.endsWith('/user')) {
      return new Response(JSON.stringify({ id: 987654, login: 'Aryanath1102', name: 'Arya Nath' }), { status: 200 });
    }
    if (url.endsWith('/user/emails')) {
      return new Response(
        JSON.stringify([
          { email: 'alt@example.com', primary: false, verified: true },
          { email: 'Nath.Arya2000@gmail.com', primary: true, verified: true }
        ]),
        { status: 200 }
      );
    }
    throw new Error(`Unexpected URL: ${url}`);
  };

  const profile = await exchangeGithubCodeForProfile({
    code: 'sample-code',
    redirectUri: 'https://sap-abap-rap-react-mastery.vercel.app',
    clientId: DEFAULT_GITHUB_CLIENT_ID,
    clientSecret: 'test-secret',
    fetchImpl: fakeFetch
  });

  assert.deepEqual(profile, {
    id: '987654',
    login: 'aryanath1102',
    email: 'nath.arya2000@gmail.com',
    name: 'Arya Nath'
  });
});

test('exchangeGithubCodeForProfile falls back to GitHub noreply email and fails when secret missing or code invalid', async () => {
  await assert.rejects(
    exchangeGithubCodeForProfile({ code: 'abc', clientSecret: '' }),
    /GITHUB_CLIENT_SECRET/
  );

  const noreplyFetch = async (url) => {
    if (url.includes('login/oauth/access_token')) {
      return new Response(JSON.stringify({ access_token: 'gho_token' }), { status: 200 });
    }
    if (url.endsWith('/user')) {
      return new Response(JSON.stringify({ id: 42, login: 'OctoDev' }), { status: 200 });
    }
    return new Response(JSON.stringify([]), { status: 200 });
  };

  const profile = await exchangeGithubCodeForProfile({
    code: 'valid-code',
    clientSecret: 'secret',
    fetchImpl: noreplyFetch
  });
  assert.equal(profile.email, 'octodev@users.noreply.github.com');

  const errorFetch = async () =>
    new Response(JSON.stringify({ error: 'bad_verification_code', error_description: 'The code passed is incorrect.' }), { status: 200 });

  await assert.rejects(
    exchangeGithubCodeForProfile({ code: 'bad', clientSecret: 'secret', fetchImpl: errorFetch }),
    /incorrect/
  );
});
