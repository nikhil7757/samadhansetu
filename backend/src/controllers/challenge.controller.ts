import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { ChallengeQualityService } from '../services/challengeQuality.service.js';

let challengeCounter = 1045;

export class ChallengeController {
  public static async evaluateQuality(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = ChallengeQualityService.evaluate(req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  public static async listChallenges(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sector, district, status, search } = req.query;

      const where: any = {};
      if (sector && sector !== 'ALL') {
        where.sector = sector;
      }
      if (district && district !== 'ALL') {
        where.district = district;
      }
      if (status && status !== 'ALL') {
        where.status = status;
      }
      if (search && typeof search === 'string') {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { desiredOutcome: { contains: search, mode: 'insensitive' } },
          { department: { contains: search, mode: 'insensitive' } },
        ];
      }

      let challenges: any[] = [];
      try {
        challenges = await (prisma as any).challenge.findMany({
          where,
          include: {
            createdBy: { select: { id: true, name: true, organizationName: true, department: true } },
            _count: { select: { proposals: true, pilots: true } },
          },
          orderBy: { createdAt: 'desc' },
        });
      } catch (dbErr) {
        console.warn('Database query failed or table not migrated yet, serving in-memory/fallback');
        challenges = [];
      }

      res.json({ challenges });
    } catch (err) {
      next(err);
    }
  }

  public static async getChallengeById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      let challenge: any = null;

      try {
        challenge = await (prisma as any).challenge.findUnique({
          where: { id },
          include: {
            createdBy: { select: { id: true, name: true, organizationName: true, department: true } },
            proposals: {
              include: {
                startup: { select: { id: true, name: true } },
                startupProfile: true,
                evaluations: true,
              },
            },
            pilots: {
              include: {
                milestones: true,
                validationReport: true,
                scaleUpDecision: true,
              },
            },
          },
        });
      } catch (dbErr) {
        console.warn('Database query error on getChallengeById:', dbErr);
      }

      if (!challenge) {
        res.status(404).json({ error: 'Challenge docket not found' });
        return;
      }

      res.json({ challenge });
    } catch (err) {
      next(err);
    }
  }

  public static async createChallenge(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        title,
        department,
        district,
        sector,
        desiredOutcome,
        successMetrics = [],
        budgetMin = 5.0,
        budgetMax = 25.0,
        pilotDurationMonths = 6,
        dataSensitivity = 'INTERNAL',
        ipPreference = 'STARTUP_OWNED',
      } = req.body;

      // Evaluate Quality Score
      const quality = ChallengeQualityService.evaluate({
        title,
        desiredOutcome,
        successMetrics,
        budgetMin,
        budgetMax,
        pilotDurationMonths,
        dataSensitivity,
        ipPreference,
      });

      const year = new Date().getFullYear();
      challengeCounter++;
      const id = `NS-${year}-${String(challengeCounter).padStart(6, '0')}`;

      const userId = req.user?.userId || 'demo-dept-user';

      let created: any = {
        id,
        title,
        department: department || 'Department of Innovation',
        district: district || 'Pune',
        sector: sector || 'OTHER',
        desiredOutcome,
        successMetrics,
        budgetMin: Number(budgetMin),
        budgetMax: Number(budgetMax),
        pilotDurationMonths: Number(pilotDurationMonths),
        dataSensitivity,
        ipPreference,
        status: quality.score >= 70 ? 'PENDING_APPROVAL' : 'DRAFTED',
        aiQualityScore: quality.score,
        aiQualityFlags: quality.flags,
        aiSuggestions: quality.suggestions,
        createdById: userId,
        createdAt: new Date().toISOString(),
      };

      try {
        created = await (prisma as any).challenge.create({
          data: {
            id,
            title,
            department: department || 'Department of Innovation',
            district: district || 'Pune',
            sector: sector || 'OTHER',
            desiredOutcome,
            successMetrics,
            budgetMin: Number(budgetMin),
            budgetMax: Number(budgetMax),
            pilotDurationMonths: Number(pilotDurationMonths),
            dataSensitivity,
            ipPreference,
            status: quality.score >= 70 ? 'PENDING_APPROVAL' : 'DRAFTED',
            aiQualityScore: quality.score,
            aiQualityFlags: quality.flags,
            aiSuggestions: quality.suggestions,
            createdById: userId,
          },
        });

        // Record initial status history
        await (prisma as any).statusHistory.create({
          data: {
            entityType: 'CHALLENGE',
            entityId: id,
            oldStatus: 'NONE',
            newStatus: created.status,
            actor: req.user?.name || 'Department Officer',
            action: 'CHALLENGE_CREATED',
            note: `Challenge formulated with AI Quality Score of ${quality.score}/100. Ready for MSInS review.`,
          },
        });
      } catch (dbErr) {
        console.warn('Database write bypassed, returning in-memory created challenge:', dbErr);
      }

      res.status(201).json({ challenge: created, qualityResult: quality });
    } catch (err) {
      next(err);
    }
  }

  public static async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status, note } = req.body;

      if (!status || !note) {
        res.status(400).json({ error: 'Status and mandatory explanatory note are required' });
        return;
      }

      let updated: any = null;
      try {
        const existing = await (prisma as any).challenge.findUnique({ where: { id } });
        if (!existing) {
          res.status(404).json({ error: 'Challenge not found' });
          return;
        }

        updated = await (prisma as any).challenge.update({
          where: { id },
          data: { status },
        });

        await (prisma as any).statusHistory.create({
          data: {
            entityType: 'CHALLENGE',
            entityId: id,
            oldStatus: existing.status,
            newStatus: status,
            actor: req.user?.name || 'MSInS Administrator',
            action: 'STATUS_TRANSITION',
            note,
          },
        });
      } catch (dbErr) {
        console.warn('Database write fallback for challenge updateStatus:', dbErr);
        updated = { id, status, note };
      }

      res.json({ success: true, challenge: updated });
    } catch (err) {
      next(err);
    }
  }
}
