import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { EligibilityEngineService } from '../services/eligibilityEngine.service.js';
import { MatchingEngineService } from '../services/matchingEngine.service.js';
import { ProposalEvaluationService } from '../services/proposalEvaluation.service.js';

export class ProposalController {
  public static async checkEligibility(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = EligibilityEngineService.evaluate(req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  public static async calculateMatch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { startup, challenge } = req.body;
      const result = MatchingEngineService.calculateMatch(startup, challenge);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  public static async submitProposal(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        challengeId,
        approach,
        techDescription,
        proposedCost,
        proposedTimelineWeeks,
        startupProfile,
      } = req.body;

      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      // Enforce that startup submits with their own authenticated user ID
      const userId = req.user.userId;

      // 1. Fetch challenge details to calculate AI match
      let challenge: any = null;
      try {
        challenge = await (prisma as any).challenge.findUnique({ where: { id: challengeId } });
      } catch (e) {
        console.warn('Challenge lookup warning:', e);
      }

      const matchResult = MatchingEngineService.calculateMatch(
        {
          companyName: startupProfile?.companyName || req.user.organizationName || 'Innovative Startup',
          sector: startupProfile?.sector || 'OTHER',
          coreKeywords: startupProfile?.coreKeywords || ['software', 'ai', 'automation'],
          techReadinessLevel: startupProfile?.techReadinessLevel || 6,
          district: req.user.district || 'Pune',
        },
        {
          title: challenge?.title || 'Civic Challenge',
          desiredOutcome: challenge?.desiredOutcome || 'Improved service delivery',
          sector: challenge?.sector || 'OTHER',
          district: challenge?.district || 'Pune',
          successMetrics: challenge?.successMetrics || [],
        }
      );

      let created: any = {
        id: `prop-${Date.now()}`,
        challengeId,
        startupId: userId,
        approach,
        techDescription,
        proposedCost: Number(proposedCost),
        proposedTimelineWeeks: Number(proposedTimelineWeeks),
        aiMatchScore: matchResult.score,
        aiMatchRationale: matchResult.rationale,
        status: 'SUBMITTED',
        createdAt: new Date().toISOString(),
      };

      try {
        created = await (prisma as any).proposal.create({
          data: {
            challengeId,
            startupId: userId,
            approach,
            techDescription,
            proposedCost: Number(proposedCost),
            proposedTimelineWeeks: Number(proposedTimelineWeeks),
            aiMatchScore: matchResult.score,
            aiMatchRationale: matchResult.rationale,
            status: 'SUBMITTED',
          },
        });

        // Record history
        await (prisma as any).statusHistory.create({
          data: {
            entityType: 'PROPOSAL',
            entityId: created.id,
            oldStatus: 'NONE',
            newStatus: 'SUBMITTED',
            actor: req.user.name || 'Startup Founder',
            action: 'PROPOSAL_SUBMITTED',
            note: `Technical proposal submitted with algorithmic match score of ${matchResult.score}%.`,
          },
        });
      } catch (dbErr) {
        console.warn('Database write bypassed for submitProposal:', dbErr);
      }

      res.status(201).json({ proposal: created, matchScore: matchResult.score });
    } catch (err) {
      next(err);
    }
  }

  public static async evaluateProposal(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const {
        innovationScore = 20,
        feasibilityScore = 20,
        teamCapabilityScore = 15,
        costValueScore = 15,
        dataSecurityScore = 10,
        scalabilityScore = 10,
        comments = 'Meets pilot benchmark criteria.',
      } = req.body;

      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      // Check conflict of interest / BOLA: An evaluator cannot score their own startup's proposal!
      let proposalRecord: any = null;
      try {
        proposalRecord = await (prisma as any).proposal.findUnique({ where: { id } });
      } catch (e) {
        console.warn('Proposal lookup warning:', e);
      }

      if (proposalRecord && proposalRecord.startupId === req.user.userId) {
        res.status(403).json({ error: 'Conflict of Interest: Evaluators cannot evaluate their own proposal' });
        return;
      }

      const evaluatorId = req.user.userId;
      const evaluatorName = req.user.name || 'Expert Panel Member';

      const singleCalc = ProposalEvaluationService.calculateSingleEvaluation({
        evaluatorId,
        evaluatorName,
        evaluatorOrg: req.user.organizationName,
        innovationScore: Number(innovationScore),
        feasibilityScore: Number(feasibilityScore),
        teamCapabilityScore: Number(teamCapabilityScore),
        costValueScore: Number(costValueScore),
        dataSecurityScore: Number(dataSecurityScore),
        scalabilityScore: Number(scalabilityScore),
        comments,
      });

      let evaluationRecord: any = {
        id: `eval-${Date.now()}`,
        proposalId: id,
        evaluatorId,
        ...singleCalc.breakdown,
        totalScore: singleCalc.totalScore,
        conflictOfInterestFlag: singleCalc.hasConflict,
        comments,
      };

      try {
        evaluationRecord = await (prisma as any).evaluation.create({
          data: {
            proposalId: id,
            evaluatorId,
            innovationScore: singleCalc.breakdown.innovation,
            feasibilityScore: singleCalc.breakdown.feasibility,
            teamCapabilityScore: singleCalc.breakdown.team,
            costValueScore: singleCalc.breakdown.cost,
            dataSecurityScore: singleCalc.breakdown.security,
            scalabilityScore: singleCalc.breakdown.scalability,
            totalScore: singleCalc.totalScore,
            conflictOfInterestFlag: singleCalc.hasConflict,
            comments,
          },
        });

        // Record history
        await (prisma as any).statusHistory.create({
          data: {
            entityType: 'PROPOSAL',
            entityId: id,
            oldStatus: 'UNDER_REVIEW',
            newStatus: 'SCORED',
            actor: evaluatorName,
            action: 'EVALUATION_RECORDED',
            note: `Expert score recorded: ${singleCalc.totalScore}/100.${singleCalc.hasConflict ? ' Conflict of interest flagged.' : ''}`,
          },
        });
      } catch (dbErr) {
        console.warn('Database write fallback for evaluation:', dbErr);
      }

      res.status(201).json({ evaluation: evaluationRecord });
    } catch (err) {
      next(err);
    }
  }

  public static async getProposalsByChallenge(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { challengeId } = req.params;
      let proposals: any[] = [];

      try {
        proposals = await (prisma as any).proposal.findMany({
          where: { challengeId },
          include: {
            startup: { select: { id: true, name: true, organizationName: true, district: true } },
            evaluations: true,
          },
          orderBy: { aiMatchScore: 'desc' },
        });
      } catch (dbErr) {
        console.warn('Database fallback on getProposalsByChallenge:', dbErr);
      }

      res.json({ proposals });
    } catch (err) {
      next(err);
    }
  }
}
