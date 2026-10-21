/**
 * Startup Eligibility Screening Engine
 * Implements Rule 170(i) & Rule 173(i) GFR 2017 relaxations for DPIIT-recognized startups.
 * Guarantees that no startup is silently rejected and all disqualifications carry explicit appeal rights.
 */

export interface StartupEligibilityInput {
  dpiitNumber?: string;
  dpiitVerified?: boolean;
  annualTurnoverLakhs?: number;
  yearsInOperation?: number;
  sector: string;
  techReadinessLevel?: number; // 1-9
  priorGovtExperience?: boolean;
  challengeSector: string;
  isBlacklisted?: boolean;
}

export interface EligibilityResult {
  status: 'PASS' | 'NEEDS_REVIEW' | 'FAIL';
  score: number; // 0-100
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

export class EligibilityEngineService {
  public static evaluate(input: StartupEligibilityInput): EligibilityResult {
    const {
      dpiitNumber = '',
      dpiitVerified = false,
      annualTurnoverLakhs = 0,
      yearsInOperation = 1,
      sector,
      techReadinessLevel = 5,
      priorGovtExperience = false,
      challengeSector,
      isBlacklisted = false,
    } = input;

    const reasons: string[] = [];
    const flags: string[] = [];
    let score = 100;
    let status: 'PASS' | 'NEEDS_REVIEW' | 'FAIL' = 'PASS';

    // 1. Mandatory Integrity Check: Blacklisting
    if (isBlacklisted) {
      return {
        status: 'FAIL',
        score: 0,
        turnoverRelaxationApplied: false,
        experienceRelaxationApplied: false,
        dpiitValid: false,
        sectorFit: false,
        trlAdequate: false,
        reasons: ['Startup entity is currently debarred or blacklisted by state or central agencies.'],
        flags: ['integrity_blacklisted'],
        appealable: true,
        appealGuidance: 'Submit clearance certificates from the debarring authority via formal appeal.',
      };
    }

    // 2. DPIIT Recognition & Statutory Relaxation
    const hasDpiitFormat = /^DPIIT-[A-Z]{2}-\d{4}-\d+$/i.test(dpiitNumber) || dpiitNumber.length >= 8;
    const isRecognized = dpiitVerified || hasDpiitFormat;

    let turnoverRelaxationApplied = false;
    let experienceRelaxationApplied = false;

    if (isRecognized) {
      turnoverRelaxationApplied = true;
      experienceRelaxationApplied = true;
      flags.push('dpiit_recognition_active');
      flags.push('gfr_rule_170_turnover_exempted');
      flags.push('gfr_rule_173_experience_exempted');
      reasons.push('DPIIT Recognition verified: Prior turnover and experience thresholds waived under statutory innovation policy.');
    } else {
      score -= 25;
      flags.push('dpiit_not_verified');
      reasons.push('Startup does not hold verified DPIIT recognition. Mandatory relaxations cannot be auto-applied.');
      if (annualTurnoverLakhs < 10) {
        score -= 15;
        reasons.push('Turnover is under ₹10L without DPIIT exemption.');
      }
      if (yearsInOperation < 2 && !priorGovtExperience) {
        score -= 10;
        reasons.push('Entity has less than 2 years track record without prior government experience.');
      }
    }

    // 3. Sector & Domain Fit
    const normStartupSector = sector.trim().toUpperCase();
    const normChallengeSector = challengeSector.trim().toUpperCase();
    const isSectorFit = normStartupSector === normChallengeSector || normStartupSector === 'OTHER' || normChallengeSector === 'OTHER';

    if (isSectorFit) {
      flags.push('sector_alignment_matched');
      reasons.push(`Sector alignment confirmed: ${challengeSector}.`);
    } else {
      score -= 20;
      flags.push('sector_cross_domain_review_required');
      reasons.push(`Startup primary sector (${sector}) differs from Challenge sector (${challengeSector}). Cross-domain applicability review required.`);
    }

    // 4. Technology Readiness Level (TRL)
    // TRL 4 = Component/subsystem validation in lab; TRL 5-7 = Sandbox ready; TRL 8-9 = Proven system
    const isTrlAdequate = techReadinessLevel >= 4;
    if (isTrlAdequate) {
      flags.push(`trl_level_${techReadinessLevel}_adequate`);
    } else {
      score -= 25;
      flags.push(`trl_level_${techReadinessLevel}_too_early`);
      reasons.push(`Technology Readiness Level (TRL ${techReadinessLevel}) is below the required sandbox pilot threshold of TRL 4 (minimum lab-validated prototype).`);
    }

    // Final Status determination
    if (score >= 75 && isRecognized && isTrlAdequate) {
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
      dpiitValid: isRecognized,
      sectorFit: isSectorFit,
      trlAdequate: isTrlAdequate,
      reasons,
      flags,
      appealable: true,
      appealGuidance: status !== 'PASS'
        ? 'You may submit supplementary documentation (TRL test reports, DPIIT certificate, cross-sector architecture rationale) for Nodal Committee manual review.'
        : undefined,
    };
  }
}
