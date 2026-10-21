import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { config } from '../config.js';

// Secure uploads directory outside the public web root
export const SECURE_UPLOAD_DIR = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.resolve(process.cwd(), 'secure_uploads');

try {
  if (!fs.existsSync(SECURE_UPLOAD_DIR)) {
    fs.mkdirSync(SECURE_UPLOAD_DIR, { recursive: true });
  }
} catch (err) {
  console.warn('Could not initialize secure upload directory:', err);
}

// Use memory storage so we can inspect magic bytes before writing to disk
const memoryStorage = multer.memoryStorage();

const MIME_ALLOWLIST = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (MIME_ALLOWLIST.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and PDF documents are allowed.'));
  }
};

export const upload = multer({
  storage: memoryStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max
    files: 1,                  // Enforce single file count
  },
});

/**
 * Validates magic bytes (file signature) to prevent extension/MIME spoofing.
 */
function verifyMagicBytes(buffer: Buffer): { isValid: boolean; extension: string; mime: string } {
  if (buffer.length < 12) {
    return { isValid: false, extension: '', mime: '' };
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { isValid: true, extension: '.jpg', mime: 'image/jpeg' };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { isValid: true, extension: '.png', mime: 'image/png' };
  }

  // WebP: RIFF ... WEBP
  const isRiff = buffer.toString('ascii', 0, 4) === 'RIFF';
  const isWebp = buffer.toString('ascii', 8, 12) === 'WEBP';
  if (isRiff && isWebp) {
    return { isValid: true, extension: '.webp', mime: 'image/webp' };
  }

  // PDF: %PDF (25 50 44 46)
  if (
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46
  ) {
    return { isValid: true, extension: '.pdf', mime: 'application/pdf' };
  }

  return { isValid: false, extension: '', mime: '' };
}

/**
 * Middleware that inspects magic bytes, sanitizes the filename, and persists the validated file.
 */
export async function enforceMagicBytesAndSave(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (!req.file) {
    return next();
  }

  const { buffer, originalname } = req.file;
  const signature = verifyMagicBytes(buffer);

  if (!signature.isValid) {
    res.status(400).json({
      error: 'File signature mismatch: the file contents do not match its declared extension.',
    });
    return;
  }

  // Generate cryptographically random filename, stripping all original path characters
  const randomId = crypto.randomUUID();
  const safeFilename = `${randomId}${signature.extension}`;
  const targetPath = path.join(SECURE_UPLOAD_DIR, safeFilename);

  // Prevent path traversal
  if (!targetPath.startsWith(SECURE_UPLOAD_DIR)) {
    res.status(400).json({ error: 'Illegal path characters in file upload' });
    return;
  }

  try {
    await fs.promises.writeFile(targetPath, buffer);
    // Overwrite req.file properties with safe values
    req.file.filename = safeFilename;
    req.file.path = targetPath;
    req.file.mimetype = signature.mime;
    next();
  } catch (err: any) {
    console.error('Failed to save validated upload:', err);
    res.status(500).json({ error: 'Failed to process file upload securely' });
  }
}
