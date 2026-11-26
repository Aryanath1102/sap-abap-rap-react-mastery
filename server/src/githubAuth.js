export const DEFAULT_GITHUB_CLIENT_ID = 'Ov23liMXxLfXuNchEyuL';

const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const GITHUB_USER_URL = 'https://api.github.com/user';
const GITHUB_EMAILS_URL = 'https://api.github.com/user/emails';

/**
 * Exchanges a GitHub OAuth authorization code for an access token and fetches
 * the authenticated user's profile and verified email.
 */
export async function exchangeGithubCodeForProfile({
  code,
  redirectUri,
  clientId = process.env.GITHUB_CLIENT_ID || DEFAULT_GITHUB_CLIENT_ID,
  clientSecret = process.env.GITHUB_CLIENT_SECRET,
  fetchImpl = fetch
} = {}) {
  if (typeof code !== 'string' || !code.trim()) {
    throw new Error('GitHub authorization code is required.');
  }
  if (!clientSecret) {
    const err = new Error('GitHub OAuth is not configured on the server (missing GITHUB_CLIENT_SECRET).');
    err.statusCode = 503;
    throw err;
  }

  const tokenRes = await fetchImpl(GITHUB_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code: code.trim(),
      ...(redirectUri ? { redirect_uri: redirectUri } : {})
    })
  });

  const tokenData = await tokenRes.json().catch(() => ({}));
  if (!tokenRes.ok || tokenData.error || !tokenData.access_token) {
    throw new Error(tokenData.error_description || tokenData.error || 'GitHub OAuth token exchange failed.');
  }

  const ghHeaders = {
    Authorization: `Bearer ${tokenData.access_token}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'sap-abap-rap-react-mastery'
  };

  const [userRes, emailsRes] = await Promise.all([
    fetchImpl(GITHUB_USER_URL, { headers: ghHeaders }),
    fetchImpl(GITHUB_EMAILS_URL, { headers: ghHeaders })
  ]);

  if (!userRes.ok) {
    throw new Error('Failed to fetch GitHub user profile.');
  }

  const userData = await userRes.json();
  if (!userData?.id || !userData?.login) {
    throw new Error('Incomplete GitHub user profile.');
  }

  let resolvedEmail = '';
  if (emailsRes.ok) {
    const emails = await emailsRes.json().catch(() => []);
    if (Array.isArray(emails)) {
      const preferred =
        emails.find((e) => e?.primary && e?.verified && e?.email) ||
        emails.find((e) => e?.verified && e?.email) ||
        emails.find((e) => e?.email);
      if (preferred?.email) {
        resolvedEmail = String(preferred.email).toLowerCase();
      }
    }
  }

  if (!resolvedEmail && typeof userData.email === 'string' && userData.email.includes('@')) {
    resolvedEmail = userData.email.toLowerCase();
  }
  if (!resolvedEmail) {
    resolvedEmail = `${String(userData.login).toLowerCase()}@users.noreply.github.com`;
  }

  return {
    id: String(userData.id),
    login: String(userData.login).toLowerCase(),
    email: resolvedEmail,
    name: String(userData.name || userData.login).slice(0, 128)
  };
}
