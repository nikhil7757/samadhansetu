import { Request, Response, NextFunction } from 'express';
import { TemplatesService } from '../services/templates.service.js';

export class TemplateController {
  public static getAll(_req: Request, res: Response, next: NextFunction): void {
    try {
      const templates = TemplatesService.getAll();
      res.json({ templates });
    } catch (err) {
      next(err);
    }
  }

  public static getById(req: Request, res: Response, next: NextFunction): void {
    try {
      const id = String(req.params.id);
      const template = TemplatesService.getById(id);
      if (!template) {
        res.status(404).json({ error: 'Template not found' });
        return;
      }
      res.json({ template });
    } catch (err) {
      next(err);
    }
  }
}
