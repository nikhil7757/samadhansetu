import { Request, Response } from 'express';
import { CommentService } from '../services/comment.service.js';

export class CommentController {
  static async list(req: Request, res: Response) {
    const page = parseInt(req.query.page as string || '1', 10);
    const limit = parseInt(req.query.limit as string || '20', 10);
    const result = await CommentService.list(req.params.id, page, limit);
    res.json(result);
  }

  static async create(req: Request, res: Response) {
    try {
      const comment = await CommentService.create(
        req.params.id,
        req.user!.userId,
        req.body.commentText
      );
      res.status(201).json(comment);
    } catch (err: any) {
      if (err.message === 'Problem not found') {
        res.status(404).json({ error: err.message });
        return;
      }
      throw err;
    }
  }
}
