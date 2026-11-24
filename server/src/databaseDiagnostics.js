// Log only bounded, sanitized connection details, never the connection URI.
export function databaseDiagnostics(error, env = process.env) {
  const secrets = Object.entries(env)
    .filter(([key, value]) => /PASSWORD|SECRET|TOKEN|API_KEY|URI|URL/.test(key) && value)
    .map(([, value]) => String(value));
  try {
    const uri = new URL(env.MONGODB_URI);
    for (const value of [uri.username, uri.password]) {
      if (value) secrets.push(value, decodeURIComponent(value));
    }
  } catch { /* A malformed URI is itself a diagnostic condition. */ }
  const clean = value => {
    let text = String(value ?? '');
    for (const secret of secrets.sort((a, b) => b.length - a.length)) {
      text = text.split(secret).join('[redacted]');
    }
    return text.replace(/mongodb(?:\+srv)?:\/\/\S+/gi, '[redacted MongoDB URI]').slice(0, 1200);
  };
  const describe = (err, depth = 0) => err && ({
    name: clean(err.name), code: clean(err.code), message: clean(err.message),
    ...(err.cause && depth < 3 ? { cause: describe(err.cause, depth + 1) } : {})
  });
  return {
    node: process.version,
    uriConfigured: Boolean(env.MONGODB_URI),
    error: describe(error),
    topology: clean(error?.reason?.type),
    servers: [...(error?.reason?.servers?.values?.() || [])].slice(0, 5).map(server => ({
      address: clean(server.address), type: clean(server.type), error: describe(server.error)
    }))
  };
}
