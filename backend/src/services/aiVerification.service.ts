/**
 * AI Verification Pipeline for SamadhanSetu (Backend Service)
 * Computes 0-100 authenticity score per complaint based on:
 * - Text coherence & specificity (20%)
 * - Duplicate similarity against existing complaints (20%)
 * - Geo-consistency against Maharashtra districts & blocks (20%)
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

const MAHARASHTRA_DISTRICTS_MAP: Record<string, string[]> = {
  'Pune': ['pune', 'shivajinagar', 'kothrud', 'hadapsar', 'pimpri', 'chinchwad', 'baramati', 'talegaon', 'hinjawadi', 'wakad', 'viman nagar', 'kharadi', 'daund', 'shirur', 'indapur'],
  'Mumbai City': ['mumbai', 'nariman point', 'colaba', 'dadar', 'byculla', 'worli', 'fort', 'marine drive', 'girgaon', 'malabar hill', 'crawford market'],
  'Mumbai Suburban': ['andheri', 'bandra', 'borivali', 'malad', 'ghatkopar', 'kurla', 'powai', 'kandivali', 'goregaon', 'vile parle', 'santacruz', 'chembur', 'mulund', 'dahisar'],
  'Nagpur': ['nagpur', 'dharampeth', 'sitabuldi', 'itwari', 'hingna', 'kamptee', 'koradi', 'wadi', 'butibori', 'umred', 'katol', 'ramtek', 'narkhed'],
  'Nashik': ['nashik', 'panchavati', 'satpur', 'deolali', 'malegaon', 'sinnar', 'trimbak', 'niphad', 'yeola', 'kalwan', 'chandwad', 'dindori', 'satana'],
  'Chhatrapati Sambhajinagar': ['chhatrapati sambhajinagar', 'aurangabad', 'cidco', 'waluj', 'shendra', 'paithan', 'gangapur', 'vaijapur', 'kannad', 'sillod', 'soegaon'],
  'Thane': ['thane', 'kalyan', 'dombivli', 'ulhasnagar', 'bhiwandi', 'mira bhayandar', 'ambernath', 'badlapur', 'mumbra', 'kalwa', 'diva'],
  'Solapur': ['solapur', 'barshi', 'pandharpur', 'mohol', 'akkalkot', 'sangola', 'karmala', 'mangalore', 'madha', 'malshiras'],
  'Kolhapur': ['kolhapur', 'ichalkaranji', 'jaysingpur', 'panhala', 'gadhinglaj', 'kagal', 'hatkanangale', 'radhanagari', 'shahuwadi', 'ajra', 'chandgad'],
  'Amravati': ['amravati', 'badnera', 'achalpur', 'chandur', 'morshi', 'warud', 'daryapur', 'anjangaon', 'chikhaldara', 'dhamangaon'],
  'Nanded': ['nanded', 'mudkhed', 'kinwat', 'degloor', 'kandhar', 'biloli', 'hadgaon', 'mukhed', 'dharmabad'],
  'Jalgaon': ['jalgaon', 'bhusawal', 'amalner', 'chalisgaon', 'chopda', 'pachora', 'jamner', 'erandol', 'yawal'],
  'Ahmednagar': ['ahmednagar', 'shirdi', 'kopargaon', 'sangamner', 'rahuri', 'shrirampur', 'nevasa', 'shevgaon', 'pathardi', 'parner'],
  'Satara': ['satara', 'karad', 'wai', 'phaltan', 'koregaon', 'mahabaleshwar', 'panchgani', 'shirwal', 'patani'],
  'Sangli': ['sangli', 'miraj', 'kupwad', 'islampur', 'vita', 'tasgaon', 'ashta', 'jat', 'palus', 'kavathe mahankal'],
  'Akola': ['akola', 'akot', 'balapur', 'murtizapur', 'barshitakli', 'telhara', 'patur'],
  'Latur': ['latur', 'udgir', 'ausa', 'nilanga', 'ahmadpur', 'chakur', 'renapur', 'shirur anantpal'],
  'Dhule': ['dhule', 'shirpur', 'sakri', 'sindkheda'],
  'Raigad': ['alibag', 'panvel', 'karjat', 'khopoli', 'roha', 'mahad', 'uran', 'mangaon', 'pen'],
  'Ratnagiri': ['ratnagiri', 'chiplun', 'khed', 'dapoli', 'rajapur', 'guhagar', 'lanja', 'sangameshwar'],
  'Sindhudurg': ['orros', 'kankavli', 'sawantwadi', 'malvan', 'kudal', 'vengurla', 'devgad', 'dodamarg'],
  'Palghar': ['palghar', 'vasai', 'virar', 'dahanu', 'boisar', 'talasari', 'jawhar', 'mokhada', 'wada'],
  'Beed': ['beed', 'parli', 'ambajogai', 'georai', 'majlegaon', 'ashti', 'kaij', 'patoda'],
  'Bhandara': ['bhandara', 'tumsar', 'pauni', 'sakoli', 'lakhani', 'mohadi', 'lakhandur'],
  'Buldhana': ['buldhana', 'khamgaon', 'shegaon', 'malkapur', 'chikhli', 'mehkar', 'nandura', 'jalgaon jamod'],
  'Chandrapur': ['chandrapur', 'ballarpur', 'warora', 'bhadravati', 'rajura', 'mul', 'chimur', 'nagbhid'],
  'Dharashiv': ['dharashiv', 'osmanabad', 'tuljapur', 'omerga', 'kallam', 'bhoom', 'paranda', 'washi'],
  'Gadchiroli': ['gadchiroli', 'aheri', 'armori', 'chamorshi', 'dhanora', 'kurkheda', 'sironcha'],
  'Gondia': ['gondia', 'tiroda', 'goregaon', 'arjoni morgaon', 'amgaon', 'salekasa', 'sadak arjuni'],
  'Hingoli': ['hingoli', 'basmath', 'kalamnuri', 'sengaon', 'aundha nagnath'],
  'Jalna': ['jalna', 'partur', 'ambad', 'bhokardan', 'jafrabad', 'ghansawangi', 'mantha', 'badnapur'],
  'Nandurbar': ['nandurbar', 'shahada', 'navapur', 'taloda', 'akkalkuwa', 'dhadgaon'],
  'Parbhani': ['parbhani', 'gangakhed', 'jintur', 'selu', 'manwath', 'pathri', 'sonpeth', 'purna'],
  'Wardha': ['wardha', 'hinganghat', 'arvi', 'deoli', 'seloo', 'karanja', 'samudrapur', 'ashti'],
  'Washim': ['washim', 'karanja', 'risod', 'malegaon', 'mangrulpir', 'manora'],
  'Yavatmal': ['yavatmal', 'pusad', 'wani', 'digras', 'darwha', 'pandharkawada', 'umerkhed', 'ghatanji']
};

const JHARKHAND_DISTRICTS_MAP = MAHARASHTRA_DISTRICTS_MAP;

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
    const districtKeywords = MAHARASHTRA_DISTRICTS_MAP[district] || [district.toLowerCase()];
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
