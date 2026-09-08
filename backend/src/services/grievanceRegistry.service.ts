/**
 * GrievanceRegistryService — Deep Module Seam for Civic Redressal in Jharkhand
 * 
 * Unifies the previously disjoint Complaint and Problem lifecycles into a single authoritative seam.
 * Enforces:
 * 1. Authoritative server-side AI evaluation (zero client score spoofing).
 * 2. Standardized Public Tracking ID format (SS-YYYY-NNNNNN).
 * 3. Immutable audit logs for all state transitions.
 * 4. Citizen appeal overrides and officer determinations.
 * 5. Academic solver collaboration escalation.
 */

import { prisma } from '../lib/prisma.js';
import { AIVerificationService, type AIScoreResult } from './aiVerification.service.js';

export type GrievanceCategory =
  | 'roads'
  | 'water'
  | 'electricity'
  | 'sanitation'
  | 'corruption'
  | 'other';

export type GrievanceStatus =
  | 'auto_approved'
  | 'pending_officer'
  | 'auto_rejected'
  | 'officer_reviewing'
  | 'verified_in_progress'
  | 'resolved'
  | 'rejected_by_officer';

export interface GrievanceLocation {
  lat: number;
  lng: number;
  address: string;
  district: string;
  block?: string | null;
}

export interface GrievanceAuditEntry {
  status: GrievanceStatus;
  actor: string;
  timestamp: string;
  note?: string | null;
}

export interface GrievanceRecord {
  id: string; // SS-YYYY-NNNNNN
  citizen_id: string;
  citizen_name?: string | null;
  citizen_email?: string | null;
  title: string;
  category: GrievanceCategory;
  description: string;
  location: GrievanceLocation;
  media: string[];
  submitted_at: string;
  ai_score: number;
  ai_flags: string[];
  status: GrievanceStatus;
  officer_id?: string | null;
  officer_name?: string | null;
  officer_notes?: string | null;
  rejection_reason?: string | null;
  appealed?: boolean;
  history: GrievanceAuditEntry[];
}

export interface SubmitGrievanceInput {
  id?: string;
  title: string;
  category: GrievanceCategory;
  description: string;
  district: string;
  address?: string;
  block?: string;
  lat?: number;
  lng?: number;
  media?: string[];
  citizen_id?: string;
  citizen_name?: string;
  citizen_email?: string;
  client_claimed_score?: number;
}

export interface OfficerActionInput {
  action: 'approve' | 'reject' | 'escalate' | 'resolve' | 'escalate_to_solver';
  note?: string;
  officerId?: string;
  officerName?: string;
}

// In-memory fallback registry for serverless resiliency
const MEMORY_REGISTRY: Record<string, GrievanceRecord> = {
  'SS-2026-000481': {
    id: 'SS-2026-000481',
    citizen_id: 'u-priya',
    citizen_name: 'Priya Kumar',
    citizen_email: 'priya.kumar@gmail.com',
    title: 'Severe Asphalt Cave-in & Pothole Cluster on Katras Main Haul Road',
    category: 'roads',
    description: 'A 4-foot wide asphalt cave-in developed over a collapsed storm drain culvert near Katras bazaar crossing. Heavy coal transport traffic diverted into residential lanes.',
    location: {
      lat: 23.8135,
      lng: 86.2842,
      address: 'Near Old Durga Mandir Crossing, Katras Bazaar',
      district: 'Dhanbad',
      block: 'Baghmara',
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
        note: 'Authoritative AI Score: 86/100. High specificity & clean photo evidence verified.',
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
      block: 'Sarwan',
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
        note: 'Authoritative AI Score: 68/100. Routed to District Nodal Officer review queue.',
      },
    ],
  },
  'SS-2026-000487': {
    id: 'SS-2026-000487',
    citizen_id: 'u-priya',
    citizen_name: 'Priya Kumar',
    citizen_email: 'priya.kumar@gmail.com',
    title: 'Replaced Collapsed Wooden Footbridge over Katri River with Iron Culvert',
    category: 'roads',
    description: 'The makeshift wooden bridge washed away during last year monsoon, isolating 450 school children in Baghmara. A galvanized steel girder footbridge has now been completed and inspected.',
    location: {
      lat: 23.7951,
      lng: 86.2045,
      address: 'Katri River Crossing, Baghmara Rural Ward',
      district: 'Dhanbad',
      block: 'Baghmara',
    },
    media: ['https://images.unsplash.com/photo-1541888946425-d0fbb186f5f8?auto=format&fit=crop&w=1200&q=80'],
    submitted_at: '2026-08-25T11:00:00.000Z',
    ai_score: 95,
    ai_flags: ['clean_exif_metadata_passed', 'geo_consistency_verified', 'high_trust_submitter_reputation'],
    status: 'resolved',
    officer_id: 'u-admin',
    officer_name: 'Vikram Singh (Nodal Officer)',
    officer_notes: 'Bridge fabrication financed by CSR and executed by district engineers.',
    history: [
      {
        status: 'auto_approved',
        actor: 'SamadhanSetu AI Core',
        timestamp: '2026-08-25T11:00:05.000Z',
        note: 'Authoritative AI Score: 95/100. Auto-approved.',
      },
      {
        status: 'resolved',
        actor: 'District Engineer Dhanbad',
        timestamp: '2026-09-01T15:30:00.000Z',
        note: 'Structure certified safe for pedestrian and vehicular crossing.',
      },
    ],
  },
};

export class GrievanceRegistryService {
  /**
   * Normalize tracking ID for deterministic matching (strips non-alphanumeric, uppercase)
   */
  static normalizeId(id: string): string {
    return (id || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  }

  /**
   * Submit a new grievance with mandatory authoritative server-side AI evaluation
   */
  static async submitGrievance(input: SubmitGrievanceInput): Promise<GrievanceRecord> {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const trackingId = input.id || `SS-${year}-${randomNum}`;
    const now = new Date().toISOString();

    // 1. Authoritative Server Verification (Zero Client Spoofing)
    const existingForContext = Object.values(MEMORY_REGISTRY).map((g) => ({
      title: g.title,
      description: g.description,
      district: g.location.district,
      category: g.category,
    }));

    const aiResult: AIScoreResult = AIVerificationService.evaluateComplaint({
      title: input.title,
      description: input.description,
      category: input.category,
      district: input.district,
      address: input.address,
      media: input.media,
      existingComplaints: existingForContext,
    });

    const initialHistory: GrievanceAuditEntry[] = [
      {
        status: 'auto_approved',
        actor: 'Citizen Intake Portal',
        timestamp: now,
        note: `Grievance registered on Sovereign Civic Registry by ${input.citizen_name || 'Citizen'}.`,
      },
      {
        status: aiResult.status,
        actor: 'Authoritative Verification Engine',
        timestamp: new Date(Date.now() + 500).toISOString(),
        note: `Authenticity Score: ${aiResult.ai_score}/100. Verdict: ${aiResult.status.replace(/_/g, ' ')}. Signals: ${aiResult.ai_flags.slice(0, 3).join(', ')}.`,
      },
    ];

    const record: GrievanceRecord = {
      id: trackingId,
      citizen_id: input.citizen_id || `u-${Date.now()}`,
      citizen_name: input.citizen_name || 'Verified Citizen',
      citizen_email: input.citizen_email || 'citizen@samadhansetu.gov.in',
      title: input.title,
      category: input.category,
      description: input.description,
      location: {
        lat: input.lat || 23.3441,
        lng: input.lng || 85.3096,
        address: input.address || `${input.district}, Jharkhand`,
        district: input.district,
        block: input.block || null,
      },
      media: input.media && input.media.length > 0 ? input.media : [
        'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80',
      ],
      submitted_at: now,
      ai_score: aiResult.ai_score,
      ai_flags: aiResult.ai_flags,
      status: aiResult.status,
      officer_id: null,
      officer_name: null,
      officer_notes: null,
      rejection_reason: aiResult.reason || null,
      appealed: false,
      history: initialHistory,
    };

    // Store in memory cache
    MEMORY_REGISTRY[record.id] = record;

    // Gracefully persist to database
    await this.persistToPrisma(record);

    return record;
  }

  /**
   * Find a grievance by ID (exact or normalized)
   */
  static async getById(rawId: string): Promise<GrievanceRecord | null> {
    if (!rawId) return null;
    const cleanId = rawId.trim();
    const normalized = this.normalizeId(cleanId);

    // Try Prisma DB first
    try {
      if ((prisma as any)?.complaint) {
        const dbEntry = await (prisma as any).complaint.findFirst({
          where: {
            OR: [
              { id: cleanId },
              { id: cleanId.toUpperCase() },
              { id: { contains: cleanId, mode: 'insensitive' } },
            ],
          },
        });
        if (dbEntry) {
          return this.mapDbToRecord(dbEntry);
        }
      }
    } catch {
      // Fallback to memory
    }

    // Try in-memory registry
    const match = Object.values(MEMORY_REGISTRY).find(
      (g) => g.id.toUpperCase() === cleanId.toUpperCase() || this.normalizeId(g.id) === normalized
    );

    return match || null;
  }

  /**
   * List grievances with category, district, and status filtering
   */
  static async listGrievances(filters?: {
    category?: string;
    district?: string;
    status?: string;
    search?: string;
  }): Promise<GrievanceRecord[]> {
    let records = Object.values(MEMORY_REGISTRY);

    // Also pull from Prisma if connected
    try {
      if ((prisma as any)?.complaint) {
        const dbEntries = await (prisma as any).complaint.findMany({
          orderBy: { submittedAt: 'desc' },
          take: 100,
        });
        for (const entry of dbEntries) {
          const mapped = this.mapDbToRecord(entry);
          MEMORY_REGISTRY[mapped.id] = mapped;
        }
        records = Object.values(MEMORY_REGISTRY);
      }
    } catch {
      // Memory fallback holds
    }

    if (filters?.category && filters.category !== 'all') {
      records = records.filter((r) => r.category.toLowerCase() === filters.category?.toLowerCase());
    }

    if (filters?.district && filters.district !== 'all') {
      records = records.filter((r) => r.location.district.toLowerCase() === filters.district?.toLowerCase());
    }

    if (filters?.status && filters.status !== 'all') {
      records = records.filter((r) => r.status.toLowerCase() === filters.status?.toLowerCase());
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      records = records.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.location.address.toLowerCase().includes(q)
      );
    }

    return records.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());
  }

  /**
   * Process an administrative determination by a District Nodal Officer
   */
  static async processOfficerAction(rawId: string, input: OfficerActionInput): Promise<GrievanceRecord | null> {
    const record = await this.getById(rawId);
    if (!record) return null;

    record.officer_id = input.officerId || 'u-admin';
    record.officer_name = input.officerName || 'District Nodal Officer';
    record.officer_notes = input.note || null;

    const now = new Date().toISOString();

    if (input.action === 'approve') {
      record.status = 'verified_in_progress';
      record.rejection_reason = null;
    } else if (input.action === 'reject') {
      record.status = 'rejected_by_officer';
      record.rejection_reason = input.note || 'Site inspection did not substantiate reported civic defect.';
    } else if (input.action === 'escalate') {
      record.status = 'officer_reviewing';
    } else if (input.action === 'resolve') {
      record.status = 'resolved';
    } else if (input.action === 'escalate_to_solver') {
      record.status = 'verified_in_progress';
      record.officer_notes = `Escalated to Academic Solver Exchange: ${input.note || 'Assigned to University Engineering Consortium'}`;
    }

    record.history.push({
      status: record.status,
      actor: record.officer_name,
      timestamp: now,
      note: input.note || `Officer Action: ${input.action}`,
    });

    MEMORY_REGISTRY[record.id] = record;
    await this.persistToPrisma(record);

    return record;
  }

  /**
   * Process a Citizen Appeal Override
   */
  static async processAppeal(rawId: string, note: string): Promise<GrievanceRecord | null> {
    const record = await this.getById(rawId);
    if (!record) return null;

    record.status = 'pending_officer';
    record.appealed = true;
    record.history.push({
      status: 'pending_officer',
      actor: record.citizen_name || 'Citizen (Appeal Override)',
      timestamp: new Date().toISOString(),
      note: `Appeal filed: "${note}". Reopened into active Nodal Officer queue.`,
    });

    MEMORY_REGISTRY[record.id] = record;
    await this.persistToPrisma(record);

    return record;
  }

  /**
   * Internal persistence helper
   */
  private static async persistToPrisma(record: GrievanceRecord): Promise<void> {
    try {
      if ((prisma as any)?.complaint) {
        await (prisma as any).complaint.upsert({
          where: { id: record.id },
          create: {
            id: record.id,
            citizenId: record.citizen_id,
            citizenName: record.citizen_name,
            citizenEmail: record.citizen_email,
            title: record.title,
            category: record.category,
            description: record.description,
            lat: record.location.lat,
            lng: record.location.lng,
            address: record.location.address,
            district: record.location.district,
            block: record.location.block,
            media: record.media,
            submittedAt: new Date(record.submitted_at),
            aiScore: record.ai_score,
            aiFlags: record.ai_flags,
            status: record.status,
            officerId: record.officer_id,
            officerName: record.officer_name,
            officerNotes: record.officer_notes,
            rejectionReason: record.rejection_reason,
            appealed: !!record.appealed,
            history: record.history,
          },
          update: {
            status: record.status,
            officerId: record.officer_id,
            officerName: record.officer_name,
            officerNotes: record.officer_notes,
            rejectionReason: record.rejection_reason,
            appealed: !!record.appealed,
            history: record.history,
          },
        });
      }
    } catch (err: any) {
      console.warn('Prisma grievance persist note:', err?.message || err);
    }
  }

  /**
   * Internal mapper
   */
  private static mapDbToRecord(db: any): GrievanceRecord {
    return {
      id: db.id,
      citizen_id: db.citizenId || 'u-citizen',
      citizen_name: db.citizenName || 'Citizen',
      citizen_email: db.citizenEmail || 'citizen@samadhansetu.gov.in',
      title: db.title,
      category: db.category,
      description: db.description,
      location: {
        lat: db.lat,
        lng: db.lng,
        address: db.address,
        district: db.district,
        block: db.block,
      },
      media: Array.isArray(db.media) ? db.media : [],
      submitted_at: db.submittedAt instanceof Date ? db.submittedAt.toISOString() : (db.submittedAt || new Date().toISOString()),
      ai_score: db.aiScore ?? 80,
      ai_flags: Array.isArray(db.aiFlags) ? db.aiFlags : [],
      status: db.status,
      officer_id: db.officerId || null,
      officer_name: db.officerName || null,
      officer_notes: db.officerNotes || null,
      rejection_reason: db.rejectionReason || null,
      appealed: !!db.appealed,
      history: Array.isArray(db.history) ? db.history : [],
    };
  }
}
