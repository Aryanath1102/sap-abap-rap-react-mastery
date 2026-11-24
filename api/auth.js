// Compatibility entry point: all APIs use the shared MongoDB application.
import handler from '../server/src/index.js';

export default function api(req, res) {
  return handler(req, res);
}
