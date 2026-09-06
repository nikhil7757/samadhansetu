import { Request, Response } from 'express';
import { AdminService } from '../services/admin.service.js';

export class AdminController {
  static async getPending(_req: Request, res: Response) {
    const problems = await AdminService.getPendingProblems();
    res.json(problems);
  }

  static async approve(req: Request, res: Response) {
    try {
      const problem = await AdminService.approveProblem(req.params.id as string, req.user!.userId, req.body.note);
      res.json(problem);
    } catch (err: any) {
      if (err.message === 'Problem not found') {
        res.status(404).json({ error: err.message });
        return;
      }
      if (err.message === 'Problem is not pending approval') {
        res.status(400).json({ error: err.message });
        return;
      }
      throw err;
    }
  }

  static async reject(req: Request, res: Response) {
    try {
      const { note } = req.body;
      if (!note) {
        res.status(400).json({ error: 'Rejection reason is required' });
        return;
      }
      const problem = await AdminService.rejectProblem(req.params.id as string, req.user!.userId, note);
      res.json(problem);
    } catch (err: any) {
      if (err.message === 'Problem not found') {
        res.status(404).json({ error: err.message });
        return;
      }
      if (err.message === 'Problem is not pending approval') {
        res.status(400).json({ error: err.message });
        return;
      }
      throw err;
    }
  }

  static async createMatch(req: Request, res: Response) {
    try {
      const { problemId, userIds } = req.body;
      if (!problemId || !userIds || !Array.isArray(userIds) || userIds.length === 0) {
        res.status(400).json({ error: 'problemId and userIds[] are required' });
        return;
      }
      const team = await AdminService.createMatch(problemId, userIds, req.user!.userId);
      res.status(201).json(team);
    } catch (err: any) {
      if (err.message === 'Problem not found') {
        res.status(404).json({ error: err.message });
        return;
      }
      throw err;
    }
  }

  static async getAllMatches(_req: Request, res: Response) {
    const matches = await AdminService.getAllMatches();
    res.json(matches);
  }
}
