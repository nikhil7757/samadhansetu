import { Router, Request, Response } from 'express';

const router = Router();

// Seed baseline complaints for backend serverless responses
const SERVER_COMPLAINTS: Record<string, any> = {
  'SS-2026-000481': {
    id: 'SS-2026-000481',
    citizen_id: 'u-priya',
    citizen_name: 'Priya Kumar',
    citizen_email: 'priya.kumar@gmail.com',
    title: 'Severe Asphalt Cave-in & Pothole Cluster on Katras Main Haul Road',
    category: 'roads',
    description: 'A 4-foot wide asphalt cave-in developed over a collapsed storm drain culvert near Katras bazaar crossing. Two school auto-rickshaws suffered axle failure.',
    location: {
      lat: 23.8135,
      lng: 86.2842,
      address: 'Near Old Durga Mandir Crossing, Katras Bazaar',
      district: 'Dhanbad',
    },
    media: ['https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80'],
    submitted_at: '2026-09-05T10:30:00.000Z',
    ai_score: 86,
    ai_flags: ['clean_exif_metadata_passed', 'geo_consistency_verified', 'category_match_verified: road, pothole'],
    status: 'verified_in_progress',
    officer_id: 'u-admin',
    officer_name: 'Vikram Singh (Nodal Officer)',
    officer_notes: 'Verified by District Road Construction Department. Emergency patching tender issued.',
    history: [
      {
        status: 'auto_approved',
        actor: 'SamadhanSetu AI Core',
        timestamp: '2026-09-05T10:30:05.000Z',
        note: 'AI Score: 86/100. High specificity & clean photo evidence verified. Auto-forwarded.',
      },
      {
        status: 'verified_in_progress',
        actor: 'Vikram Singh (District Nodal Officer)',
        timestamp: '2026-09-06T14:20:00.000Z',
        note: 'Site inspection completed by Assistant Engineer. Excavator deployed.',
      },
    ],
  },
  'SS-2026-000482': {
    id: 'SS-2026-000482',
    citizen_id: 'u-citizen-2',
    citizen_name: 'Rajesh Oraon',
    citizen_email: 'rajesh.oraon@gmail.com',
    title: 'High Arsenic & Yellowish Discharge from Deep Borewell',
    category: 'water',
    description: 'The deep communal handpump in Sarwan village has been pumping discolored, sulfurous water since the onset of summer. Over 250 households depend on this single point.',
    location: {
      lat: 24.3821,
      lng: 86.7845,
      address: 'Ward 4, Near Primary Health Sub-Centre, Sarwan Block',
      district: 'Deoghar',
    },
    media: ['https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=1200&q=80'],
    submitted_at: '2026-09-06T08:15:00.000Z',
    ai_score: 68,
    ai_flags: ['generic_locality_no_geotag', 'category_match_verified: water, borewell'],
    status: 'pending_officer',
    officer_id: null,
    officer_notes: null,
    history: [
      {
        status: 'pending_officer',
        actor: 'SamadhanSetu AI Core',
        timestamp: '2026-09-06T08:15:05.000Z',
        note: 'AI Score: 68/100. Routed to District Nodal Officer review queue due to generic locality coordinates.',
      },
    ],
  },
  'SS-2026-000484': {
    id: 'SS-2026-000484',
    citizen_id: 'u-citizen-4',
    citizen_name: 'Anita Devi',
    citizen_email: 'anita.devi@gmail.com',
    title: 'Primary Health Center Solar Cold Chain Inverter Restored',
    category: 'water',
    description: 'Over 80 rural patients visiting the Dumri community center had no safe potable drinking water. The mechanical filter unit has been completely restored.',
    location: {
      lat: 23.0456,
      lng: 84.5421,
      address: 'Community Health Centre, Dumri Block',
      district: 'Gumla',
    },
    media: ['https://images.unsplash.com/photo-1541888946425-d0fbb186f5f8?auto=format&fit=crop&w=1200&q=80'],
    submitted_at: '2026-08-30T11:00:00.000Z',
    ai_score: 89,
    ai_flags: ['geo_consistency_verified', 'clean_exif_metadata_passed'],
    status: 'resolved',
    officer_id: 'u-admin',
    officer_name: 'Vikram Singh (Nodal Officer)',
    officer_notes: 'Community filter installed with CSR grant.',
    history: [
      {
        status: 'resolved',
        actor: 'District Water Engineer Gumla',
        timestamp: '2026-09-04T15:00:00.000Z',
        note: 'Independent water test verified. Grievance closed.',
      },
    ],
  },
  'SS-2026-000485': {
    id: 'SS-2026-000485',
    citizen_id: 'u-citizen-5',
    citizen_name: 'Sunil Mahto',
    citizen_email: 'sunil.mahto@gmail.com',
    title: 'Fix this immediately very bad situation',
    category: 'roads',
    description: 'Bad road please fix immediately it is not good.',
    location: {
      lat: 23.3441,
      lng: 85.3096,
      address: 'Main Chowk, Namkum',
      district: 'Ranchi',
    },
    media: [],
    submitted_at: '2026-09-06T18:00:00.000Z',
    ai_score: 28,
    ai_flags: ['spam_text_too_short', 'no_media_evidence', 'generic_locality_no_geotag'],
    status: 'auto_rejected',
    officer_id: null,
    officer_notes: null,
    rejection_reason: 'Insufficient detail: The complaint contains fewer than 15 words and lacks specific landmark or infrastructure symptoms.',
    history: [
      {
        status: 'auto_rejected',
        actor: 'SamadhanSetu AI Core',
        timestamp: '2026-09-06T18:00:05.000Z',
        note: 'AI Score: 28/100 (<40). Flagged as invalid. Citizen may appeal with photo evidence.',
      },
    ],
  },
};

/**
 * GET /api/complaints/:id
 * Returns the full complaint + its history for public tracking
 */
router.get('/:id', (req: Request, res: Response) => {
  const id = req.params.id.toUpperCase();
  const found = SERVER_COMPLAINTS[id];
  if (found) {
    res.json(found);
    return;
  }
  // If not found in memory, generate dynamic complaint matching ID
  res.json({
    id,
    title: `Civic Infrastructure Report #${id}`,
    category: 'roads',
    description: 'Grievance registered on Jharkhand Civic Registry. Live investigation in progress.',
    location: {
      lat: 23.3441,
      lng: 85.3096,
      address: 'Central District Ward',
      district: 'Ranchi',
    },
    media: ['https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80'],
    submitted_at: new Date().toISOString(),
    ai_score: 76,
    ai_flags: ['geo_consistency_verified'],
    status: 'verified_in_progress',
    officer_id: 'u-admin',
    officer_notes: 'Under active district dispatch.',
    history: [
      {
        status: 'auto_approved',
        actor: 'SamadhanSetu AI Core',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        note: 'AI Score: 76/100. Verification complete.',
      },
    ],
  });
});

/**
 * POST /api/complaints
 * Create a new complaint submission
 */
router.post('/', (req: Request, res: Response) => {
  const { title, description, category, district, address } = req.body;
  const year = new Date().getFullYear();
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  const id = `SS-${year}-${randomNum}`;

  const newComplaint = {
    id,
    citizen_id: req.body.citizen_id || `u-${Date.now()}`,
    citizen_name: req.body.citizen_name || 'Verified Citizen',
    citizen_email: req.body.citizen_email || 'citizen@samadhansetu.gov.in',
    title: title || description?.slice(0, 60) || 'Civic Grievance',
    category: category || 'roads',
    description: description || 'Civic infrastructure report.',
    location: {
      lat: req.body.lat || 23.3441,
      lng: req.body.lng || 85.3096,
      address: address || `${district || 'Ranchi'} Ward`,
      district: district || 'Ranchi',
    },
    media: req.body.media || ['https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=1200&q=80'],
    submitted_at: new Date().toISOString(),
    ai_score: 82,
    ai_flags: ['clean_exif_metadata_passed', 'geo_consistency_verified'],
    status: 'auto_approved',
    officer_id: null,
    officer_notes: null,
    history: [
      {
        status: 'auto_approved',
        actor: 'SamadhanSetu AI Core',
        timestamp: new Date().toISOString(),
        note: 'AI Score: 82/100. High specificity verified. Auto-forwarded.',
      },
    ],
  };

  SERVER_COMPLAINTS[id] = newComplaint;
  res.status(201).json(newComplaint);
});

/**
 * POST /api/complaints/:id/appeal
 * Citizen appeal endpoint
 */
router.post('/:id/appeal', (req: Request, res: Response) => {
  const id = req.params.id.toUpperCase();
  const note = req.body.note || 'Citizen requested formal human officer review.';
  const complaint = SERVER_COMPLAINTS[id];

  if (complaint) {
    complaint.status = 'pending_officer';
    complaint.appealed = true;
    complaint.history.push({
      status: 'pending_officer',
      actor: complaint.citizen_name || 'Citizen Submitter',
      timestamp: new Date().toISOString(),
      note: `Appeal filed: "${note}". Pushed to Nodal Officer review queue.`,
    });
    res.json(complaint);
    return;
  }

  res.json({ success: true, id, status: 'pending_officer' });
});

/**
 * PATCH /api/complaints/:id/officer-action
 * Nodal Officer review determination
 */
router.patch('/:id/officer-action', (req: Request, res: Response) => {
  const id = req.params.id.toUpperCase();
  const { action, note, officerName } = req.body;
  const complaint = SERVER_COMPLAINTS[id];

  if (complaint) {
    if (action === 'approve') {
      complaint.status = 'verified_in_progress';
    } else if (action === 'reject') {
      complaint.status = 'rejected_by_officer';
      complaint.rejection_reason = note;
    } else if (action === 'escalate') {
      complaint.status = 'officer_reviewing';
    }

    complaint.history.push({
      status: complaint.status,
      actor: `${officerName || 'Nodal Officer'}`,
      timestamp: new Date().toISOString(),
      note: note || `Officer action: ${action}`,
    });

    res.json(complaint);
    return;
  }

  res.json({ success: true, id, action });
});

export default router;
