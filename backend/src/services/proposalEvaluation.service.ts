/**
 * Proposal Evaluation Support Service
 * Multi-criteria weighted scoring engine for expert panel evaluation.
 * Detects score variance across evaluators, flags potential conflicts of interest,
 * and generates advisory ranking for the Innovation Society Admin.
 */

export interface EvaluatorScoreInput {
  evaluatorId: string;
  evaluatorName: string;
  evaluatorOrg?: string;
  startupOrg?: string;
  innovationScore: number; // 0-20
  feasibilityScore: number; // 0-20
  teamCapabilityScore: number; // 0-20
  costValueScore: number; // 0-15
  dataSecurityScore: number; // 0-10
  scalabilityScore: number; // 0-15
  comments?: string;
}

export interface ProposalEvaluationSummary {
  proposalId: string;
  totalEvaluations: number;
  averageScore: number; // 0-100
  criteriaAverages: {
    innovation: number; // out of 20
    feasibility: number; // out of 20
    teamCapability: number; // out of 20
    costValue: number; // out of 15
    dataSecurity: number; // out of 10
    scalability: number; // out of 15
  };
  scoreVariance: number;
  highVarianceFlag: boolean;
  conflictOfInterestFlags: Array<{
    evaluatorId: string;
    evaluatorName: string;
    reason: string;
  }>;
  consensusRecommendation: 'RECOMMEND_PILOT' | 'BORDERLINE_NEEDS_DISCUSSION' | 'DO_NOT_SELECT';
  advisoryNote: string;
}

export class ProposalEvaluationService {
  public static calculateSingleEvaluation(input: EvaluatorScoreInput) {
    const innovation = Math.min(20, Math.max(0, input.innovationScore));
    const feasibility = Math.min(20, Math.max(0, input.feasibilityScore));
    const team = Math.min(20, Math.max(0, input.teamCapabilityScore));
    const cost = Math.min(15, Math.max(0, input.costValueScore));
    const security = Math.min(10, Math.max(0, input.dataSecurityScore));
    const scalability = Math.min(15, Math.max(0, input.scalabilityScore));

    const total = innovation + feasibility + team + cost + security + scalability;

    // Conflict of interest check (e.g., common institution or explicit flag)
    let hasConflict = false;
    let conflictReason: string | undefined;
    if (
      input.evaluatorOrg &&
      input.startupOrg &&
      input.evaluatorOrg.trim().toLowerCase() === input.startupOrg.trim().toLowerCase()
    ) {
      hasConflict = true;
      conflictReason = `Evaluator and Startup share the same institutional affiliation: "${input.evaluatorOrg}".`;
    }

    return {
      totalScore: total,
      breakdown: { innovation, feasibility, team, cost, security, scalability },
      hasConflict,
      conflictReason,
    };
  }

  public static aggregateEvaluations(
    proposalId: string,
    evaluations: EvaluatorScoreInput[]
  ): ProposalEvaluationSummary {
    if (evaluations.length === 0) {
      return {
        proposalId,
        totalEvaluations: 0,
        averageScore: 0,
        criteriaAverages: {
          innovation: 0,
          feasibility: 0,
          teamCapability: 0,
          costValue: 0,
          dataSecurity: 0,
          scalability: 0,
        },
        scoreVariance: 0,
        highVarianceFlag: false,
        conflictOfInterestFlags: [],
        consensusRecommendation: 'DO_NOT_SELECT',
        advisoryNote: 'No expert evaluations recorded yet.',
      };
    }

    let sumInnovation = 0;
    let sumFeasibility = 0;
    let sumTeam = 0;
    let sumCost = 0;
    let sumSecurity = 0;
    let sumScalability = 0;
    let sumTotal = 0;
    const totals: number[] = [];
    const conflicts: Array<{ evaluatorId: string; evaluatorName: string; reason: string }> = [];

    for (const ev of evaluations) {
      const calc = this.calculateSingleEvaluation(ev);
      sumInnovation += calc.breakdown.innovation;
      sumFeasibility += calc.breakdown.feasibility;
      sumTeam += calc.breakdown.team;
      sumCost += calc.breakdown.cost;
      sumSecurity += calc.breakdown.security;
      sumScalability += calc.breakdown.scalability;
      sumTotal += calc.totalScore;
      totals.push(calc.totalScore);

      if (calc.hasConflict && calc.conflictReason) {
        conflicts.push({
          evaluatorId: ev.evaluatorId,
          evaluatorName: ev.evaluatorName,
          reason: calc.conflictReason,
        });
      }
    }

    const n = evaluations.length;
    const avgTotal = Math.round((sumTotal / n) * 10) / 10;

    // Variance calculation
    const variance =
      totals.reduce((acc, val) => acc + Math.pow(val - avgTotal, 2), 0) / n;
    const stdDev = Math.round(Math.sqrt(variance) * 10) / 10;
    const highVarianceFlag = stdDev > 15; // More than 15 pts disagreement between panel members

    let recommendation: 'RECOMMEND_PILOT' | 'BORDERLINE_NEEDS_DISCUSSION' | 'DO_NOT_SELECT' = 'DO_NOT_SELECT';
    if (avgTotal >= 75) {
      recommendation = 'RECOMMEND_PILOT';
    } else if (avgTotal >= 60) {
      recommendation = 'BORDERLINE_NEEDS_DISCUSSION';
    }

    let advisoryNote = `Panel consensus: Average score ${avgTotal}/100 across ${n} expert review(s).`;
    if (highVarianceFlag) {
      advisoryNote += ` WARNING: High scoring divergence (std dev: ${stdDev}). Committee moderation recommended.`;
    }
    if (conflicts.length > 0) {
      advisoryNote += ` ALERT: ${conflicts.length} conflict-of-interest signal(s) flagged for review.`;
    }

    return {
      proposalId,
      totalEvaluations: n,
      averageScore: avgTotal,
      criteriaAverages: {
        innovation: Math.round((sumInnovation / n) * 10) / 10,
        feasibility: Math.round((sumFeasibility / n) * 10) / 10,
        teamCapability: Math.round((sumTeam / n) * 10) / 10,
        costValue: Math.round((sumCost / n) * 10) / 10,
        dataSecurity: Math.round((sumSecurity / n) * 10) / 10,
        scalability: Math.round((sumScalability / n) * 10) / 10,
      },
      scoreVariance: stdDev,
      highVarianceFlag,
      conflictOfInterestFlags: conflicts,
      consensusRecommendation: recommendation,
      advisoryNote,
    };
  }
}
