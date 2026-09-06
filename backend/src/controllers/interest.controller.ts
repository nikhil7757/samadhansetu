import { Request, Response } from 'express';
import { InterestService } from '../services/interest.service.js';

export class InterestController {
  static async expressInterest(req: Request, res: Response) {
    try {
      const interest = await InterestService.expressInterest(
        req.params.id,
        req.user!.userId,
        req.body.pitchMessage,
        req.user!.role
      );
      res.status(201).json(interest);
    } catch (err: any) {
      if (err.message.includes('already expressed') || err.message.includes('Cannot express')) {
        res.status(400).json({ error: err.message });
        return;
      }
      if (err.message === 'Problem not found') {
        res.status(404).json({ error: err.message });
        return;
      }
      throw err;
    }
  }

  static async listForProblem(req: Request, res: Response) {
    const interests = await InterestService.listForProblem(req.params.id);
    res.json(interests);
  }
}
