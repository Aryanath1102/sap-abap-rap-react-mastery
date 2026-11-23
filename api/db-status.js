// Compatibility entry point: all APIs use the shared PostgreSQL application.
import handler from '../server/src/index.js';

export default function api(req, res) {
  return handler(req, res);
}
