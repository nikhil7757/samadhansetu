import type { IncomingMessage, ServerResponse } from 'http';
import app from '../backend/src/index.js';

export default function handler(req: IncomingMessage, res: ServerResponse) {
  return app(req, res);
}
