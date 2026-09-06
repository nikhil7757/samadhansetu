import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  console.error('Error:', err.message);

  if (err.message === 'Only JPEG, PNG, and WebP images are allowed') {
    res.status(400).json({ error: err.message });
    return;
  }

  if (err.name === 'MulterError') {
    const multerErr = err as any;
    if (multerErr.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({ error: 'File size exceeds 5 MB limit' });
      return;
    }
    res.status(400).json({ error: multerErr.message });
    return;
  }

  res.status(500).json({ error: 'Internal server error' });
}
