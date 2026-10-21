/**
 * Challenge Quality Scoring Engine
 * Evaluates outcome-based formulation, measurable KPIs, budget/timeline realism, and legal IP/data completeness.
 * Addresses the core SIH 26136 gap: "departments struggle to write outcome-based problem statements".
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

export class ChallengeQualityService {
  // Words that indicate solution-prescriptiveness rather than outcome-based thinking
  private static PRESCRIPTIVE_TERMS = [
    'oracle', 'cisco', 'sap', 'react', 'python', 'angular', 'aws', 'azure',
    'buy 10 computers', 'purchase specific model', 'install brand x',
    'hire 5 developers', 'use proprietary software', 'specific vendor',
  ];

  // Words that indicate outcome-based orientation
  private static OUTCOME_KEYWORDS = [
    'reduce', 'improve', 'increase', 'detect', 'automate', 'eliminate',
    'optimize', 'prevent', 'accuracy', 'turnaround', 'efficiency', 'yield',
    'save', 'enhance', 'monitoring', 'streamline', 'mitigate',
  ];

  // Metric and measurement indicators
  private static METRIC_KEYWORDS = [
    '%', 'percent', 'hour', 'minute', 'day', 'accuracy', 'latency', 'rate',
    'cost', 'reduction', 'speed', 'threshold', 'benchmark', 'ppm', 'kwh',
    'liters', 'farmers', 'patients', 'kpi', 'sla',
  ];

  public static evaluate(input: ChallengeQualityInput): ChallengeQualityResult {
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

    // 1. Outcome-Based vs Prescriptive Score (Max 35)
    let outcomeScore = 0;
    const combinedText = `${title} ${desiredOutcome}`.toLowerCase();

    // Check for prescriptive terms (penalty)
    let prescriptiveCount = 0;
    for (const term of this.PRESCRIPTIVE_TERMS) {
      if (combinedText.includes(term)) {
        prescriptiveCount++;
        flags.push(`prescriptive_term_detected: "${term}"`);
      }
    }

    if (prescriptiveCount === 0) {
      outcomeScore += 15;
      flags.push('outcome_neutral_language_verified');
    } else {
      outcomeScore += Math.max(0, 15 - prescriptiveCount * 5);
      suggestions.push('Avoid naming specific brands or proprietary architectures. State the functional need instead.');
    }

    // Check for outcome-oriented action verbs
    let outcomeVerbsFound = 0;
    for (const verb of this.OUTCOME_KEYWORDS) {
      if (combinedText.includes(verb)) {
        outcomeVerbsFound++;
      }
    }
    const outcomeVerbScore = Math.min(20, outcomeVerbsFound * 5);
    outcomeScore += outcomeVerbScore;

    if (outcomeVerbsFound >= 2) {
      flags.push('strong_outcome_verbs_present');
    } else {
      suggestions.push('Frame the challenge with quantifiable action verbs (e.g. "reduce turnaround time", "improve early detection").');
    }

    // 2. Measurable KPIs & Success Metrics (Max 30)
    let kpiScore = 0;
    let kpiList: string[] = [];
    if (Array.isArray(successMetrics)) {
      kpiList = successMetrics;
    } else if (typeof successMetrics === 'string') {
      kpiList = successMetrics.split(',').map((s) => s.trim()).filter(Boolean);
    }

    if (kpiList.length === 0) {
      flags.push('missing_measurable_kpis');
      suggestions.push('Define at least 2 measurable KPIs (e.g., "95% accuracy in 2 hours", "30% reduction in water loss").');
    } else {
      kpiScore += Math.min(15, kpiList.length * 5);

      // Check if metrics contain quantitative indicators
      let quantifiedCount = 0;
      for (const kpi of kpiList) {
        const lowerKpi = kpi.toLowerCase();
        if (this.METRIC_KEYWORDS.some((kw) => lowerKpi.includes(kw)) || /\d+/.test(kpi)) {
          quantifiedCount++;
        }
      }
      kpiScore += Math.min(15, quantifiedCount * 5);

      if (quantifiedCount >= 2) {
        flags.push('quantified_kpis_verified');
      } else {
        suggestions.push('Add specific target percentages or numeric thresholds to your success metrics.');
      }
    }

    // 3. Budget & Timeline Realism (Max 20)
    let realismScore = 0;
    // Pilot grants typically range between ₹5L and ₹50L
    if (budgetMin > 0 && budgetMax >= budgetMin) {
      if (budgetMin >= 3 && budgetMax <= 50) {
        realismScore += 10;
        flags.push('budget_in_sandbox_pilot_range');
      } else if (budgetMax > 50) {
        realismScore += 5;
        suggestions.push('Sandbox pilot grants are recommended between ₹5L–₹50L. Larger amounts should be partitioned into phases.');
      } else {
        realismScore += 5;
        suggestions.push('Grant budget may be too low for viable technology pilots.');
      }
    } else {
      suggestions.push('Specify a clear minimum and maximum grant budget range.');
    }

    // Pilot duration typically 3 to 12 months
    if (pilotDurationMonths >= 3 && pilotDurationMonths <= 12) {
      realismScore += 10;
      flags.push('pilot_duration_realistic');
    } else if (pilotDurationMonths > 12) {
      realismScore += 5;
      suggestions.push('Sandbox pilots exceeding 12 months face high departmental turnover. Recommend 6 months.');
    } else {
      suggestions.push('Specify a pilot duration between 3 to 9 months for agile testing.');
    }

    // 4. Legal Compliance & IP/Data Completeness (Max 15)
    let complianceScore = 0;
    if (dataSensitivity) {
      complianceScore += 7;
      flags.push(`data_classification_set: ${dataSensitivity}`);
    } else {
      suggestions.push('Specify data sensitivity (PUBLIC, INTERNAL, CONFIDENTIAL, RESTRICTED) for data protection compliance.');
    }

    if (ipPreference) {
      complianceScore += 8;
      flags.push(`ip_terms_specified: ${ipPreference}`);
    } else {
      suggestions.push('Select an IP model (Startup-Owned with Govt License is recommended to encourage startup participation).');
    }

    const totalScore = Math.min(100, outcomeScore + kpiScore + realismScore + complianceScore);
    const isReadyForPublication = totalScore >= 70;

    return {
      score: totalScore,
      outcomeScore,
      kpiScore,
      realismScore,
      complianceScore,
      isReadyForPublication,
      flags,
      suggestions,
    };
  }
}
