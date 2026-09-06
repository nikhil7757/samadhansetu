import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service.js';

export class DashboardController {
  static async getStats(_req: Request, res: Response) {
    const stats = await DashboardService.getStats();
    res.json(stats);
  }
}
