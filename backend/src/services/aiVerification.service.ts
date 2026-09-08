/**
 * AI Verification Pipeline for SamadhanSetu (Backend Service)
 * Computes 0-100 authenticity score per complaint based on:
 * - Text coherence & specificity (20%)
 * - Duplicate similarity against existing complaints (20%)
 * - Geo-consistency against Jharkhand districts & blocks (20%)
 * - Submitter reputation & history (15%)
 * - Category-context keyword match (15%)
 * - Media/evidence presence (10%)
 */

export interface AIScoreResult {
  ai_score: number; // 0 - 100
  ai_flags: string[];
  status: 'auto_approved' | 'pending_officer' | 'auto_rejected';
  factors: {
    textCoherence: number;
    duplicateMatch: number;
    geoConsistency: number;
    submitterAccuracy: number;
    categoryMatch: number;
    mediaEvidence: number;
  };
  reason?: string;
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  roads: ['road', 'pothole', 'highway', 'bridge', 'culvert', 'asphalt', 'tar', 'street', 'crater', 'divider', 'footpath'],
  water: ['water', 'pipe', 'pipeline', 'leak', 'arsenic', 'fluoride', 'borewell', 'handpump', 'well', 'drinking', 'tap', 'tanker'],
  electricity: ['electric', 'power', 'transformer', 'wire', 'pole', 'blackout', 'voltage', 'current', 'meter', 'substation'],
  sanitation: ['drain', 'drainage', 'sewage', 'waste', 'garbage', 'sanitation', 'clog', 'overflow', 'trash', 'dump', 'manhole'],
  corruption: ['bribe', 'corruption', 'extortion', 'fund', 'misuse', 'tender', 'officer', 'ration', 'commission', 'delay', 'scam'],
  other: ['civic', 'issue', 'problem', 'repair', 'community', 'facility', 'infrastructure'],
};

const JHARKHAND_DISTRICTS_MAP: Record<string, string[]> = {
  'Ranchi': ['ranchi', 'kanke', 'ormanjhi', 'namkum', 'doranda', 'hehal', 'ratu', 'bundu', 'tamar', 'morabadi', 'harmu', 'bariatu', 'dhruwa', 'hatia', 'lalpur'],
  'Dhanbad': ['dhanbad', 'jharia', 'katras', 'baghmara', 'govindpur', 'nirsa', 'topchanchi', 'tundi', 'damodar', 'kendua', 'sindri', 'chirkunda'],
  'Bokaro': ['bokaro', 'chas', 'bermo', 'chandrapura', 'gomia', 'jaridih', 'petarwar', 'chandankiyari', 'dugda', 'tenughat'],
  'Deoghar': ['deoghar', 'sarwan', 'madhupur', 'karon', 'sarath', 'palojori', 'mohanpur', 'jasidih', 'rohini'],
  'East Singhbhum': ['jamshedpur', 'ghatsila', 'potka', 'chakulia', 'musabani', 'baharagora', 'dimna', 'telco', 'sakchi', 'bistupur', 'mango'],
  'West Singhbhum': ['chaibasa', 'chakradharpur', 'noamundi', 'jhinkpani', 'jagannathpur', 'manoharpur', 'kiriburu'],
  'Hazaribagh': ['hazaribagh', 'barhi', 'ichak', 'chauparan', 'barkagaon', 'bishnugarh', 'daru', 'katkamsandi'],
  'Giridih': ['giridih', 'dumri', 'bagodar', 'deori', 'bengabad', 'jamua', 'tisri', 'gawan', 'rajdhanwar'],
  'Ramgarh': ['ramgarh', 'patratu', 'gola', 'mandu', 'chittor', 'dulmi'],
  'Palamu': ['medininagar', 'daltonganj', 'lesliganj', 'chhatarpur', 'hariharganj', 'patan', 'manatu', 'chainpur'],
  'Gumla': ['gumla', 'chainpur', 'ghaghra', 'raidih', 'sisai', 'kamdara', 'basia', 'palkot', 'bishunpur'],
  'Garhwa': ['garhwa', 'nagar untari', 'bhawnathpur', 'majhaoan', 'ramna', 'kharoundhi', 'dhurki'],
  'Dumka': ['dumka', 'jama', 'jarmundi', 'ramgarh', 'shikaripara', 'ranishwar', 'masaliya'],
  'Jamtara': ['jamtara', 'karmatanr', 'narayanpur', 'kundhit', 'nala', 'fatehpur', 'mihijam'],
  'Godda': ['godda', 'mahagama', 'pathargama', 'porayahat', 'sundarpahari', 'boarijor', 'meharma'],
  'Sahebganj': ['sahebganj', 'rajmahal', 'borio', 'barharwa', 'taljhari', 'mandro', 'udhua'],
  'Pakur': ['pakur', 'hiranpur', 'littipara', 'pakuria', 'maheshpur'],
  'Koderma': ['koderma', 'jhumri telaiya', 'chandwara', 'satgawan', 'markacho', 'domchanch'],
  'Chatra': ['chatra', 'hunterganj', 'simaria', 'tandwa', 'pratappur', 'kunda', 'itarhori', 'giddhour'],
  'Latehar': ['latehar', 'chandwa', 'balumath', 'mahauadanr', 'barwadih', 'garu', 'manika'],
  'Lohardaga': ['lohardaga', 'kuru', 'bhandra', 'senha', 'kisko', 'peshrar'],
  'Simdega': ['simdega', 'kolebira', 'thethaitangar', 'jaldega', 'bolba', 'kurdeg', 'bano', 'kersai'],
  'Khunti': ['khunti', 'murhu', 'torpa', 'karra', 'raniya', 'arki'],
  'Saraikela Kharsawan': ['saraikela', 'kharsawan', 'adityapur', 'gamharia', 'chandil', 'nimdih', 'rajanagar', 'kuchai']
};

export class AIVerificationService {
  static evaluateComplaint(params: {
    title: string;
    description: string;
    category: string;
    district: string;
    address?: string;
    media?: string[];
    existingComplaints?: Array<{ title: string; description: string; district: string; category: string }>;
    submitterHistory?: { total: number; approved: number };
  }): AIScoreResult {
    const {
      title,
      description,
      category,
      district,
      address = '',
      media = [],
      existingComplaints = [],
      submitterHistory,
    } = params;

    const combinedText = `${title} ${description} ${address}`.toLowerCase();
    const flags: string[] = [];

    // 1. Text Coherence & Specificity (20%)
    let textScore = 45;
    const wordCount = description.trim().split(/\s+/).length;
    if (wordCount >= 18) {
      textScore += 25;
      flags.push('high_specificity_text');
    } else if (wordCount >= 8) {
      textScore += 10;
    } else {
      textScore -= 20;
      flags.push('spam_text_too_short');
    }

    if (/\d+/.test(combinedText)) {
      textScore += 15; // Numeric specificity: dimensions, ward numbers, days
      flags.push('quantitative_metrics_present');
    }
    textScore = Math.min(100, Math.max(0, textScore));

    // 2. Duplicate Detection / Uniqueness (20%)
    let duplicateScore = 100;
    const cleanDesc = description.toLowerCase().replace(/[^a-z0-9 ]/g, '');
    const words = new Set(cleanDesc.split(/\s+/).filter((w) => w.length > 4));

    for (const other of existingComplaints) {
      if (other.district.toLowerCase() === district.toLowerCase() && other.category === category) {
        const otherClean = `${other.title} ${other.description}`.toLowerCase().replace(/[^a-z0-9 ]/g, '');
        const otherWords = otherClean.split(/\s+/).filter((w) => w.length > 4);
        let overlap = 0;
        for (const w of otherWords) {
          if (words.has(w)) overlap++;
        }
        const similarity = words.size > 0 ? (overlap / words.size) * 100 : 0;
        if (similarity > 65) {
          duplicateScore = 20;
          flags.push('duplicate_cluster_detected');
          break;
        } else if (similarity > 40) {
          duplicateScore = Math.min(duplicateScore, 55);
          flags.push('potential_duplicate_nearby');
        }
      }
    }
    if (duplicateScore >= 80) {
      flags.push('novel_issue_no_duplicate');
    }

    // 3. Geo-Consistency (20%)
    let geoScore = 50;
    const districtKeywords = JHARKHAND_DISTRICTS_MAP[district] || [district.toLowerCase()];
    const hasLocalMatch = districtKeywords.some((k) => combinedText.includes(k));
    if (hasLocalMatch) {
      geoScore = 95;
      flags.push('geo_consistency_verified');
    } else {
      geoScore = 40;
      flags.push('generic_locality_no_geotag');
    }

    // 4. Submitter History / Reputation (15%)
    let submitterScore = 85;
    if (submitterHistory && submitterHistory.total > 0) {
      const approvalRate = submitterHistory.approved / submitterHistory.total;
      submitterScore = Math.round(approvalRate * 100);
      if (approvalRate >= 0.8) {
        flags.push('high_trust_submitter_reputation');
      } else if (approvalRate < 0.4) {
        flags.push('low_trust_submitter_history');
      }
    } else {
      flags.push('verified_citizen_baseline');
    }

    // 5. Category Keyword Match (15%)
    let categoryScore = 45;
    const catKeys = CATEGORY_KEYWORDS[category.toLowerCase()] || [];
    const matchCount = catKeys.filter((k) => combinedText.includes(k)).length;
    if (matchCount >= 2) {
      categoryScore = 95;
      flags.push(`category_match_verified: ${category}`);
    } else if (matchCount === 1) {
      categoryScore = 75;
    } else {
      categoryScore = 30;
      flags.push('category_mismatch_flag');
    }

    // 6. Media / Evidence Presence (10%)
    let mediaScore = 40;
    if (media && media.length > 0) {
      mediaScore = 95;
      flags.push('photographic_evidence_attached');
    } else {
      mediaScore = 25;
      flags.push('no_media_evidence');
    }

    // Weighted composite score (0-100)
    const composite = Math.round(
      textScore * 0.20 +
      duplicateScore * 0.20 +
      geoScore * 0.20 +
      submitterScore * 0.15 +
      categoryScore * 0.15 +
      mediaScore * 0.10
    );

    const finalScore = Math.min(100, Math.max(10, composite));

    let status: 'auto_approved' | 'pending_officer' | 'auto_rejected';
    let reason: string | undefined;

    if (finalScore >= 80) {
      status = 'auto_approved';
    } else if (finalScore >= 40) {
      status = 'pending_officer';
      reason = 'Moderate AI score (40-79). Routed to District Nodal Officer for physical verification.';
    } else {
      status = 'auto_rejected';
      reason = 'AI Score under 40: Insufficient detail, potential duplicate, or missing locality landmarks. Citizen may appeal with photographic evidence.';
    }

    return {
      ai_score: finalScore,
      ai_flags: flags,
      status,
      factors: {
        textCoherence: textScore,
        duplicateMatch: duplicateScore,
        geoConsistency: geoScore,
        submitterAccuracy: submitterScore,
        categoryMatch: categoryScore,
        mediaEvidence: mediaScore,
      },
      reason,
    };
  }
}
