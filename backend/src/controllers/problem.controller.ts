import { Request, Response } from 'express';
import { ProblemService } from '../services/problem.service.js';

export class ProblemController {
  static async create(req: Request, res: Response) {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    const problem = await ProblemService.create({
      ...req.body,
      submittedById: req.user!.userId,
      imageUrl,
    });
    res.status(201).json(problem);
  }

  static async list(req: Request, res: Response) {
    const { category, district, status, search, page, limit } = req.query as any;
    const result = await ProblemService.list({
      category,
      district,
      status,
      search,
      page: parseInt(page || '1', 10),
      limit: parseInt(limit || '12', 10),
    });
    res.json(result);
  }

  static async getById(req: Request, res: Response) {
    try {
      const problem = await ProblemService.getById(req.params.id as string);
      res.json(problem);
    } catch (err: any) {
      if (err.message === 'Problem not found') {
        res.status(404).json({ error: err.message });
        return;
      }
      throw err;
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const { newStatus, note } = req.body;
      const problem = await ProblemService.updateStatus(
        req.params.id as string,
        newStatus,
        req.user!.userId,
        note
      );
      res.json(problem);
    } catch (err: any) {
      if (err.message === 'Problem not found') {
        res.status(404).json({ error: err.message });
        return;
      }
      throw err;
    }
  }
}
