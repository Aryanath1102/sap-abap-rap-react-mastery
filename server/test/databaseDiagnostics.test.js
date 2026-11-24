import test from 'node:test';
import assert from 'node:assert/strict';
import { databaseDiagnostics } from '../src/databaseDiagnostics.js';

test('MongoDB diagnostics retain nested TLS errors while removing credentials', () => {
  const uri = 'mongodb+srv://test-user:private%40password@cluster.example/test';
  const tls = Object.assign(new Error('TLS handshake failed private@password'), { code: 'ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR' });
  const error = Object.assign(new Error(`Failed ${uri}`), {
    name: 'MongoServerSelectionError',
    reason: { type: 'ReplicaSetNoPrimary', servers: new Map([['host', {
      address: 'cluster.example:27017', type: 'Unknown',
      error: Object.assign(new Error('connect failed'), { cause: tls })
    }]]) }
  });
  const result = JSON.stringify(databaseDiagnostics(error, { MONGODB_URI: uri, ADMIN_PASSWORD: 'admin-secret' }));
  assert.match(result, /ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR/);
  assert.match(result, /ReplicaSetNoPrimary/);
  assert.match(result, /cluster.example:27017/);
  for (const value of [uri, 'test-user', 'private%40password', 'private@password', 'admin-secret']) {
    assert.equal(result.includes(value), false);
  }
});

test('Missing URI and errors without topology are handled safely', () => {
  const result = databaseDiagnostics(new Error('Configure MONGODB_URI'), {});
  assert.equal(result.uriConfigured, false);
  assert.deepEqual(result.servers, []);
});
