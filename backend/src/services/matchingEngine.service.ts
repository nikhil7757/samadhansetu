/**
 * Startup–Challenge Match Scoring Engine
 * Computes deterministic multi-factor compatibility between Startup Capabilities and Department Challenges.
 * Used to recommend relevant challenges to startups and high-fit startups to departments.
 */

export interface StartupProfileMatchData {
  companyName: string;
  sector: string;
  coreKeywords: string[];
  techReadinessLevel: number; // 1-9
  district: string;
  pastPilotsCount?: number;
}

export interface ChallengeMatchData {
  title: string;
  desiredOutcome: string;
  sector: string;
  district: string;
  successMetrics?: string[];
}

export interface MatchScoreResult {
  score: number; // 0-100
  sectorScore: number; // 0-30
  keywordScore: number; // 0-30
  readinessScore: number; // 0-20
  geoScore: number; // 0-10
  experienceScore: number; // 0-10
  matchedKeywords: string[];
  rationale: string;
}

export class MatchingEngineService {
  public static calculateMatch(
    startup: StartupProfileMatchData,
    challenge: ChallengeMatchData
  ): MatchScoreResult {
    // 1. Sector Alignment (30 pts)
    let sectorScore = 0;
    const startupSector = startup.sector.toUpperCase();
    const challengeSector = challenge.sector.toUpperCase();

    if (startupSector === challengeSector) {
      sectorScore = 30;
    } else if (startupSector === 'OTHER' || challengeSector === 'OTHER') {
      sectorScore = 15;
    } else {
      // Check for related sectors
      const relatedMap: Record<string, string[]> = {
        HEALTHCARE: ['OTHER', 'CYBERSECURITY'],
        AGRICULTURE: ['WATER_SANITATION', 'CLEAN_ENERGY'],
        URBAN_GOVERNANCE: ['LOGISTICS_INFRA', 'CYBERSECURITY', 'WATER_SANITATION'],
        WATER_SANITATION: ['AGRICULTURE', 'URBAN_GOVERNANCE'],
        CLEAN_ENERGY: ['URBAN_GOVERNANCE', 'LOGISTICS_INFRA'],
        CYBERSECURITY: ['URBAN_GOVERNANCE', 'EDUCATION_SKILLS'],
      };
      if (relatedMap[challengeSector]?.includes(startupSector)) {
        sectorScore = 20;
      } else {
        sectorScore = 5;
      }
    }

    // 2. Keyword & Tech Alignment (30 pts)
    let keywordScore = 0;
    const challengeText = `${challenge.title} ${challenge.desiredOutcome} ${(challenge.successMetrics || []).join(' ')}`.toLowerCase();
    const matchedKeywords: string[] = [];

    const startupKws = startup.coreKeywords.map((k) => k.toLowerCase().trim()).filter(Boolean);
    for (const kw of startupKws) {
      if (challengeText.includes(kw) || kw.split(' ').some((part) => part.length > 3 && challengeText.includes(part))) {
        matchedKeywords.push(kw);
      }
    }

    if (matchedKeywords.length >= 3) {
      keywordScore = 30;
    } else if (matchedKeywords.length === 2) {
      keywordScore = 22;
    } else if (matchedKeywords.length === 1) {
      keywordScore = 14;
    } else {
      keywordScore = 6;
    }

    // 3. Tech Readiness Level (20 pts)
    // Sandbox pilots ideal for TRL 6-8 (prototype system verified in operational environment)
    let readinessScore = 0;
    const trl = startup.techReadinessLevel || 5;
    if (trl >= 6 && trl <= 8) {
      readinessScore = 20;
    } else if (trl === 5) {
      readinessScore = 16;
    } else if (trl >= 9) {
      readinessScore = 18; // Overqualified for exploratory sandbox, but high certainty
    } else if (trl === 4) {
      readinessScore = 10;
    } else {
      readinessScore = 4;
    }

    // 4. Geographic Alignment (10 pts)
    let geoScore = 5; // Default for within Maharashtra
    if (startup.district.toLowerCase() === challenge.district.toLowerCase()) {
      geoScore = 10; // Same district field presence
    } else if (['pune', 'mumbai suburban', 'nagpur', 'nashik'].includes(startup.district.toLowerCase())) {
      geoScore = 8; // Major Maharashtra innovation hub presence
    }

    // 5. Past Pilot Track Record (10 pts)
    let experienceScore = 0;
    const pastCount = startup.pastPilotsCount || 0;
    if (pastCount >= 3) {
      experienceScore = 10;
    } else if (pastCount >= 1) {
      experienceScore = 7;
    } else {
      experienceScore = 4; // Startup friendly: first-time pilots still get base points
    }

    const totalScore = Math.min(100, sectorScore + keywordScore + readinessScore + geoScore + experienceScore);

    const rationale = `Compatibility Score ${totalScore}/100: ${
      sectorScore === 30 ? 'Direct sector match' : 'Adjacent domain match'
    } (${startup.sector} → ${challenge.sector}), ${matchedKeywords.length} core technical capability matches (${matchedKeywords.join(', ') || 'general tech'}), TRL-${trl} readiness, and ${
      geoScore === 10 ? 'local district presence' : 'statewide deployment presence'
    }.`;

    return {
      score: totalScore,
      sectorScore,
      keywordScore,
      readinessScore,
      geoScore,
      experienceScore,
      matchedKeywords,
      rationale,
    };
  }
}
