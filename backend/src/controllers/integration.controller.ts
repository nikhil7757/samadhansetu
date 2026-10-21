import { Request, Response, NextFunction } from 'express';
import { DpiitIntegrationService } from '../services/dpiitIntegration.service.js';
import { GemIntegrationService } from '../services/gemIntegration.service.js';

export class IntegrationController {
  public static verifyDpiit(req: Request, res: Response, next: NextFunction): void {
    try {
      const certificateNumber = String(req.params.certificateNumber);
      const result = DpiitIntegrationService.verifyCertificate(certificateNumber);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  public static exportToGem(req: Request, res: Response, next: NextFunction): void {
    try {
      const result = GemIntegrationService.exportToGemRunway(req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}
