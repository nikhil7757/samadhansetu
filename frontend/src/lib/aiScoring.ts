/**
 * SamadhanSetu Client-Side AI Scoring & Evaluation Pipeline
 * Deterministic, explainable, and appealable rule engines.
 */

export interface ChallengeQualityInput {
  title: string;
  desiredOutcome: string;
  successMetrics?: string[] | string;
  budgetMin?: number;
  budgetMax?: number;
  pilotDurationMonths?: number;
  dataSensitivity?: string;
  ipPreference?: string;
}

export interface ChallengeQualityResult {
  score: number; // 0-100
  outcomeScore: number; // 0-35
  kpiScore: number; // 0-30
  realismScore: number; // 0-20
  complianceScore: number; // 0-15
  isReadyForPublication: boolean; // score >= 70
  flags: string[];
  suggestions: string[];
}

export function evaluateChallengeQuality(input: ChallengeQualityInput): ChallengeQualityResult {
  const {
    title = '',
    desiredOutcome = '',
    successMetrics,
    budgetMin = 0,
    budgetMax = 0,
    pilotDurationMonths = 0,
    dataSensitivity,
    ipPreference,
  } = input;

  const flags: string[] = [];
  const suggestions: string[] = [];

  const PRESCRIPTIVE = ['oracle', 'cisco', 'sap', 'react', 'python', 'angular', 'aws', 'azure', 'buy 10 computers', 'specific brand'];
  const OUTCOME = ['reduce', 'improve', 'increase', 'detect', 'automate', 'eliminate', 'optimize', 'prevent', 'accuracy', 'turnaround', 'efficiency', 'yield', 'save', 'enhance', 'monitoring'];
  const METRIC = ['%', 'percent', 'hour', 'minute', 'day', 'accuracy', 'latency', 'rate', 'cost', 'reduction', 'speed', 'threshold', 'ppm', 'kpi', 'sla'];

  // 1. Outcome vs Prescriptive (Max 35)
  let outcomeScore = 0;
  const text = `${title} ${desiredOutcome}`.toLowerCase();

  let prescriptiveHits = 0;
  for (const term of PRESCRIPTIVE) {
    if (text.includes(term)) {
      prescriptiveHits++;
      flags.push(`prescriptive_term_flagged: "${term}"`);
    }
  }

  if (prescriptiveHits === 0) {
    outcomeScore += 15;
    flags.push('outcome_neutral_language_verified');
  } else {
    outcomeScore += Math.max(0, 15 - prescriptiveHits * 5);
    suggestions.push('Avoid naming specific proprietary brands or architectures. State the operational need.');
  }

  let outcomeVerbs = 0;
  for (const v of OUTCOME) {
    if (text.includes(v)) outcomeVerbs++;
  }
  outcomeScore += Math.min(20, outcomeVerbs * 5);
  if (outcomeVerbs >= 2) {
    flags.push('strong_outcome_verbs_present');
  } else {
    suggestions.push('Frame problem with measurable action verbs (e.g., "reduce latency", "improve early detection").');
  }

  // 2. Measurable KPIs (Max 30)
  let kpiScore = 0;
  let kpiList: string[] = [];
  if (Array.isArray(successMetrics)) {
    kpiList = successMetrics;
  } else if (typeof successMetrics === 'string') {
    kpiList = successMetrics.split(',').map((s) => s.trim()).filter(Boolean);
  }

  if (kpiList.length === 0) {
    flags.push('missing_measurable_kpis');
    suggestions.push('Define at least 2 measurable KPIs with numeric thresholds or percentages.');
  } else {
    kpiScore += Math.min(15, kpiList.length * 5);
    let quantifiedCount = 0;
    for (const kpi of kpiList) {
      const lower = kpi.toLowerCase();
      if (METRIC.some((m) => lower.includes(m)) || /\d+/.test(kpi)) {
        quantifiedCount++;
      }
    }
    kpiScore += Math.min(15, quantifiedCount * 5);
    if (quantifiedCount >= 2) {
      flags.push('quantified_kpis_verified');
    } else {
      suggestions.push('Include target numbers, percentages, or turnaround times in your KPIs.');
    }
  }

  // 3. Realism (Max 20)
  let realismScore = 0;
  if (budgetMin > 0 && budgetMax >= budgetMin) {
    if (budgetMin >= 3 && budgetMax <= 50) {
      realismScore += 10;
      flags.push('budget_in_sandbox_pilot_range');
    } else {
      realismScore += 5;
      suggestions.push('Sandbox pilot grants are recommended between ₹5L and ₹50L.');
    }
  } else {
    suggestions.push('Specify minimum and maximum budget ranges in ₹ Lakhs.');
  }

  if (pilotDurationMonths >= 3 && pilotDurationMonths <= 12) {
    realismScore += 10;
    flags.push('pilot_duration_realistic');
  } else {
    realismScore += 5;
    suggestions.push('Recommended sandbox duration is 3 to 9 months.');
  }

  // 4. Compliance & IP (Max 15)
  let complianceScore = 0;
  if (dataSensitivity) {
    complianceScore += 7;
    flags.push(`data_classification_set: ${dataSensitivity}`);
  } else {
    suggestions.push('Select a data sensitivity classification (e.g., INTERNAL or CONFIDENTIAL).');
  }

  if (ipPreference) {
    complianceScore += 8;
    flags.push(`ip_preference_set: ${ipPreference}`);
  } else {
    suggestions.push('Specify IP ownership terms (Startup-Owned with Government license recommended).');
  }

  const score = Math.min(100, outcomeScore + kpiScore + realismScore + complianceScore);

  return {
    score,
    outcomeScore,
    kpiScore,
    realismScore,
    complianceScore,
    isReadyForPublication: score >= 70,
    flags,
    suggestions,
  };
}

export interface StartupEligibilityInput {
  dpiitNumber?: string;
  dpiitVerified?: boolean;
  annualTurnoverLakhs?: number;
  yearsInOperation?: number;
  sector: string;
  techReadinessLevel?: number;
  priorGovtExperience?: boolean;
  challengeSector: string;
  isBlacklisted?: boolean;
}

export interface EligibilityResult {
  status: 'PASS' | 'NEEDS_REVIEW' | 'FAIL';
  score: number;
  turnoverRelaxationApplied: boolean;
  experienceRelaxationApplied: boolean;
  dpiitValid: boolean;
  sectorFit: boolean;
  trlAdequate: boolean;
  reasons: string[];
  flags: string[];
  appealable: boolean;
  appealGuidance?: string;
}

export function screenStartupEligibility(input: StartupEligibilityInput): EligibilityResult {
  const {
    dpiitNumber = '',
    dpiitVerified = false,
    annualTurnoverLakhs = 0,
    yearsInOperation = 1,
    sector = 'OTHER',
    techReadinessLevel = 5,
    priorGovtExperience = false,
    challengeSector = 'OTHER',
    isBlacklisted = false,
  } = input;

  const reasons: string[] = [];
  const flags: string[] = [];
  let score = 100;

  if (isBlacklisted) {
    return {
      status: 'FAIL',
      score: 0,
      turnoverRelaxationApplied: false,
      experienceRelaxationApplied: false,
      dpiitValid: false,
      sectorFit: false,
      trlAdequate: false,
      reasons: ['Entity is debarred or blacklisted by government procurement authorities.'],
      flags: ['integrity_blacklisted'],
      appealable: true,
      appealGuidance: 'Submit clearance documentation via formal MSInS appeal docket.',
    };
  }

  const isDpiit = dpiitVerified || /^DPIIT-[A-Z]{2}-\d{4}-\d+$/i.test(dpiitNumber) || dpiitNumber.length >= 8;
  let turnoverRelaxationApplied = false;
  let experienceRelaxationApplied = false;

  if (isDpiit) {
    turnoverRelaxationApplied = true;
    experienceRelaxationApplied = true;
    flags.push('dpiit_recognition_active');
    flags.push('gfr_rule_170_turnover_exempted');
    flags.push('gfr_rule_173_experience_exempted');
    reasons.push('DPIIT Recognition verified: Prior turnover and experience criteria waived.');
  } else {
    score -= 25;
    flags.push('dpiit_not_verified');
    reasons.push('Startup does not hold verified DPIIT recognition. Mandatory exemptions cannot be auto-applied.');
    if (annualTurnoverLakhs < 10) score -= 15;
    if (yearsInOperation < 2 && !priorGovtExperience) score -= 10;
  }

  const isSectorFit = sector.toUpperCase() === challengeSector.toUpperCase() || sector === 'OTHER' || challengeSector === 'OTHER';
  if (isSectorFit) {
    flags.push('sector_alignment_matched');
    reasons.push(`Sector alignment verified: ${challengeSector}.`);
  } else {
    score -= 20;
    flags.push('cross_domain_review_required');
    reasons.push(`Startup sector (${sector}) differs from Challenge sector (${challengeSector}). Manual review required.`);
  }

  const isTrlAdequate = techReadinessLevel >= 4;
  if (isTrlAdequate) {
    flags.push(`trl_${techReadinessLevel}_adequate`);
  } else {
    score -= 25;
    flags.push(`trl_${techReadinessLevel}_below_sandbox_threshold`);
    reasons.push(`TRL ${techReadinessLevel} is below sandbox minimum (TRL 4).`);
  }

  let status: 'PASS' | 'NEEDS_REVIEW' | 'FAIL' = 'PASS';
  if (score >= 75 && isDpiit && isTrlAdequate) {
    status = 'PASS';
  } else if (score >= 45) {
    status = 'NEEDS_REVIEW';
  } else {
    status = 'FAIL';
  }

  return {
    status,
    score: Math.max(0, score),
    turnoverRelaxationApplied,
    experienceRelaxationApplied,
    dpiitValid: isDpiit,
    sectorFit: isSectorFit,
    trlAdequate: isTrlAdequate,
    reasons,
    flags,
    appealable: true,
    appealGuidance: status !== 'PASS' ? 'You may appeal this screening with supporting documentation for MSInS review.' : undefined,
  };
}

export function calculateStartupChallengeMatch(startup: any, challenge: any) {
  let sectorScore = startup.sector?.toUpperCase() === challenge.sector?.toUpperCase() ? 30 : 15;
  let keywordScore = 20;
  let trlScore = (startup.techReadinessLevel || 6) >= 6 ? 20 : 10;
  let geoScore = startup.district?.toLowerCase() === challenge.district?.toLowerCase() ? 15 : 10;
  let expScore = 15;

  const total = Math.min(100, sectorScore + keywordScore + trlScore + geoScore + expScore);
  return {
    score: total,
    breakdown: { sectorScore, keywordScore, trlScore, geoScore, expScore },
    rationale: `Compatibility ${total}/100: ${sectorScore === 30 ? 'Direct sector match' : 'Adjacent domain'}, TRL-${startup.techReadinessLevel || 6} readiness, and ${geoScore === 15 ? 'target district presence' : 'Maharashtra statewide presence'}.`,
  };
}
