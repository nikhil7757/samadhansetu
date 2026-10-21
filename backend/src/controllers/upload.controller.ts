import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { SECURE_UPLOAD_DIR } from '../middleware/upload.js';

export class UploadController {
  /**
   * Securely streams uploaded files.
   * Requires authentication, verifies path containment, and applies nosniff headers.
   */
  static async serveFile(req: Request, res: Response): Promise<void> {
    const rawFilename = String(req.params.filename);
    // Strip path traversal characters
    const safeFilename = path.basename(rawFilename);
    const filePath = path.join(SECURE_UPLOAD_DIR, safeFilename);

    // Enforce path containment
    if (!filePath.startsWith(SECURE_UPLOAD_DIR)) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    try {
      await fs.promises.access(filePath, fs.constants.R_OK);

      // Determine content type safely from extension
      const ext = path.extname(safeFilename).toLowerCase();
      const contentTypes: Record<string, string> = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.webp': 'image/webp',
        '.pdf': 'application/pdf',
      };

      const contentType = contentTypes[ext] || 'application/octet-stream';

      res.setHeader('Content-Type', contentType);
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Content-Disposition', 'inline');
      res.setHeader('Cache-Control', 'private, max-age=3600');

      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
    } catch {
      res.status(404).json({ error: 'File not found' });
    }
  }
}
