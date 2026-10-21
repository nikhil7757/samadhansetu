/**
 * SamadhanSetu Master Store & Client State Management
 * Deep client-side repository for Challenges, Proposals, Pilots, Milestones, Payments, and Templates.
 */

import { useState, useEffect, useCallback } from 'react';
import api from './api';
import { evaluateChallengeQuality, screenStartupEligibility, calculateStartupChallengeMatch } from './aiScoring';
import { STANDARD_TEMPLATES, type StandardTemplate } from './templatesData';

export interface Challenge {
  id: string; // SS-YYYY-NNNNNN (or legacy NS-YYYY-NNNNNN)
  title: string;
  department: string;
  district: string;
  sector: string;
  desiredOutcome: string;
  successMetrics: string[];
  budgetMin: number;
  budgetMax: number;
  pilotDurationMonths: number;
  dataSensitivity: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED';
  ipPreference: 'STARTUP_OWNED' | 'JOINT_IP' | 'GOVT_EXCLUSIVE_LICENSE';
  status:
    | 'DRAFTED'
    | 'PENDING_APPROVAL'
    | 'APPROVED_PUBLISHED'
    | 'STARTUP_DISCOVERY'
    | 'ELIGIBILITY_SCREENING'
    | 'EXPERT_EVALUATION'
    | 'PILOT_DESIGN'
    | 'CONTRACT_SIGNED'
    | 'PILOT_RUNNING'
    | 'INDEPENDENT_VALIDATION'
    | 'PAYMENT_RELEASED'
    | 'SCALE_UP_DECISION'
    | 'REJECTED'
    | 'COMPLETED';
  aiQualityScore: number;
  aiQualityFlags: string[];
  aiSuggestions: string[];
  createdById: string;
  createdAt: string;
}

export interface Milestone {
  id: string;
  milestoneNumber: number;
  title: string;
  deliverable: string;
  dueDate: string;
  paymentAmount: number; // In ₹ Lakhs
  status: 'PENDING' | 'SUBMITTED' | 'VALIDATED' | 'PAID';
  submissionUrl?: string;
  submissionNotes?: string;
  submittedAt?: string;
  validatedAt?: string;
  approvedAt?: string;
  paidAt?: string;
  daysSinceApproval: number;
  paymentRef?: string;
}

export interface ValidationReport {
  id: string;
  validatorName: string;
  kpiAchievementScore: number;
  methodology: string;
  findings: string;
  recommendation: 'SCALE' | 'EXTEND' | 'STOP';
  reportUrl?: string;
  submittedAt: string;
}

export interface ScaleUpDecision {
  decision: 'SCALE' | 'EXTEND' | 'STOP';
  procurementPathway: 'DIRECT_PILOT_AWARD' | 'LIMITED_TENDER' | 'GEM_LISTING' | 'DISCONTINUE';
  rationale: string;
  decidedBy: string;
  decidedAt: string;
}

export interface Pilot {
  id: string; // Reference matches or links to challenge
  challengeId: string;
  challengeTitle: string;
  department: string;
  district: string;
  startupName: string;
  dpiitNumber: string;
  agreementRef: string;
  startDate: string;
  endDate: string;
  sandboxScope: string;
  kpis: Array<{ kpi: string; achieved?: string }>;
  totalBudget: number;
  disbursedBudget: number;
  currentStage: string;
  stageNumber: number; // 1 to 11
  status: 'DESIGN' | 'CONTRACT_SIGNED' | 'RUNNING' | 'VALIDATING' | 'PAYMENT_RELEASED' | 'COMPLETED' | 'STOPPED';
  milestones: Milestone[];
  validationReport?: ValidationReport;
  scaleUpDecision?: ScaleUpDecision;
  history: Array<{
    stage: string;
    actor: string;
    timestamp: string;
    note: string;
  }>;
}

export interface Proposal {
  id: string;
  challengeId: string;
  startupId: string;
  startupName: string;
  dpiitNumber: string;
  approach: string;
  techDescription: string;
  proposedCost: number;
  proposedTimelineWeeks: number;
  aiMatchScore: number;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'SELECTED_FOR_PILOT' | 'REJECTED';
  evaluations: Array<{
    evaluatorName: string;
    totalScore: number;
    conflictFlag: boolean;
    comments: string;
  }>;
  createdAt: string;
}

const STORAGE_KEY = 'samadhansetu_state_v1';
const LEGACY_STORAGE_KEY = 'navsetu_state_v1';

// Initial realistic Maharashtra seed dataset
export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'SS-2026-001042',
    title: 'Edge AI Early Crop Pest & Infestation Warning for Smallholder Cotton Farmers',
    department: 'Department of Agriculture',
    district: 'Nashik',
    sector: 'AGRICULTURE',
    desiredOutcome: 'Detect Pink Bollworm and Spodoptera infestations at larval stage without continuous 4G connectivity, reducing farmer pesticide expenditure by at least 35%.',
    successMetrics: [
      'Diagnostic accuracy > 93% on edge vision nodes',
      'Field alert turnaround < 18 hours via SMS',
      'Pesticide spend reduction > 30%',
      'Offline store-and-forward syncing resilience',
    ],
    budgetMin: 12.0,
    budgetMax: 20.0,
    pilotDurationMonths: 6,
    dataSensitivity: 'INTERNAL',
    ipPreference: 'STARTUP_OWNED',
    status: 'PILOT_RUNNING',
    aiQualityScore: 92,
    aiQualityFlags: ['outcome_neutral_language_verified', 'quantified_kpis_verified', 'budget_in_sandbox_pilot_range'],
    aiSuggestions: ['Include local farmer training workshop in sandbox scope.'],
    createdById: 'u-agri-dept',
    createdAt: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'SS-2026-001043',
    title: 'Rural Tele-ICU Bed Monitoring & Predictive Sepsis Early-Warning Network',
    department: 'Public Health Department',
    district: 'Pune',
    sector: 'HEALTHCARE',
    desiredOutcome: 'Continuous multi-parameter vital signs streaming from 10 rural sub-district hospitals to Pune Medical College ICU hub, providing 4-hour advance warning of septic deterioration.',
    successMetrics: [
      'Sepsis early warning sensitivity > 89%',
      'Tele-triage physician response time < 8 minutes',
      'ICU transfer mortality reduction > 25%',
    ],
    budgetMin: 15.0,
    budgetMax: 25.0,
    pilotDurationMonths: 6,
    dataSensitivity: 'CONFIDENTIAL',
    ipPreference: 'STARTUP_OWNED',
    status: 'SCALE_UP_DECISION',
    aiQualityScore: 96,
    aiQualityFlags: ['outcome_neutral_language_verified', 'quantified_kpis_verified', 'budget_in_sandbox_pilot_range'],
    aiSuggestions: ['Ensure CERT-In VAPT audit compliance prior to deployment.'],
    createdById: 'u-health-dept',
    createdAt: new Date(Date.now() - 250 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'SS-2026-001044',
    title: 'Decentralized Solar-Powered Cold Storage Pods for Perishable Agri-Produce',
    department: 'Dept. of Skills, Employment, Entrepreneurship & Innovation',
    district: 'Chhatrapati Sambhajinagar',
    sector: 'CLEAN_ENERGY',
    desiredOutcome: 'Zero-grid refrigeration maintaining 4°C to 12°C for 5 metric tonnes of tomatoes and onions, curbing distress sales by 40%.',
    successMetrics: [
      '72-hour thermal backup without grid electricity',
      'Post-harvest spoilage rate < 5%',
      'Farmer realized price increase > 30%',
    ],
    budgetMin: 18.0,
    budgetMax: 30.0,
    pilotDurationMonths: 9,
    dataSensitivity: 'PUBLIC',
    ipPreference: 'JOINT_IP',
    status: 'APPROVED_PUBLISHED',
    aiQualityScore: 88,
    aiQualityFlags: ['outcome_neutral_language_verified', 'quantified_kpis_verified'],
    aiSuggestions: ['Consider farmer cluster co-operative operational handover plan.'],
    createdById: 'u-msins-dept',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'SS-2026-001045',
    title: 'AI Video Analytics for Urban Bottleneck Detection & Adaptive Traffic Light Control',
    department: 'Urban Development Department',
    district: 'Nagpur',
    sector: 'URBAN_GOVERNANCE',
    desiredOutcome: 'Dynamically modulate green signal phases based on live vehicle density at 12 major intersections, reducing peak-hour commuter transit delay by 25%.',
    successMetrics: [
      'Traffic queue length reduction > 22%',
      'Emergency vehicle pre-emption green corridor < 30s',
      'Hardware uptime > 99.5% in extreme weather',
    ],
    budgetMin: 20.0,
    budgetMax: 35.0,
    pilotDurationMonths: 6,
    dataSensitivity: 'INTERNAL',
    ipPreference: 'STARTUP_OWNED',
    status: 'EXPERT_EVALUATION',
    aiQualityScore: 91,
    aiQualityFlags: ['outcome_neutral_language_verified', 'quantified_kpis_verified'],
    aiSuggestions: ['Ensure non-capture of pedestrian facial biometric data for privacy compliance.'],
    createdById: 'u-urban-dept',
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const INITIAL_PILOTS: Pilot[] = [
  {
    id: 'SS-2026-001042',
    challengeId: 'SS-2026-001042',
    challengeTitle: 'Edge AI Early Crop Pest & Infestation Warning for Smallholder Cotton Farmers',
    department: 'Department of Agriculture',
    district: 'Nashik',
    startupName: 'AgriScan Technologies Pvt Ltd',
    dpiitNumber: 'DPIIT-MH-2023-88192',
    agreementRef: 'AGR-MSINS-2026-089',
    startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    sandboxScope: '500 smallholder farmer cotton fields across 3 talukas in Nashik district with 40 solar edge sensor nodes.',
    kpis: [
      { kpi: 'Pest identification accuracy > 93%', achieved: '94.2% verified' },
      { kpi: 'Alert dispatch < 18h', achieved: '11.4h average' },
      { kpi: 'Pesticide cost reduction > 30%', achieved: '34.8% measured' },
    ],
    totalBudget: 16.5,
    disbursedBudget: 6.6,
    currentStage: 'Pilot Running',
    stageNumber: 8,
    status: 'RUNNING',
    milestones: [
      {
        id: 'ms-1042-1',
        milestoneNumber: 1,
        title: 'Sensor Hardware Deployment & Baseline Agronomy Calibration',
        deliverable: 'Installation of 40 solar camera nodes across 3 talukas and initial telemetry report.',
        dueDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        paymentAmount: 6.6,
        status: 'PAID',
        submissionUrl: 'https://storage.samadhansetu.gov.in/milestones/ms1-nashik.pdf',
        submittedAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
        validatedAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
        approvedAt: new Date(Date.now() - 48 * 24 * 60 * 60 * 1000).toISOString(),
        paidAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        daysSinceApproval: 3,
        paymentRef: 'TREASURY-MH-2026-98124',
      },
      {
        id: 'ms-1042-2',
        milestoneNumber: 2,
        title: 'Mid-Term Larval Infestation Telemetry & Farmer Notification',
        deliverable: 'Live dataset of 12,000 pest diagnostic scans and verified 32% pesticide expenditure reduction.',
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        paymentAmount: 6.6,
        status: 'SUBMITTED',
        submissionUrl: 'https://storage.samadhansetu.gov.in/milestones/ms2-midterm.pdf',
        submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        daysSinceApproval: 3,
      },
      {
        id: 'ms-1042-3',
        milestoneNumber: 3,
        title: 'Final Independent Validation & Scale-Up Dossier',
        deliverable: 'Comprehensive third-party audit report and GeM cataloging package.',
        dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        paymentAmount: 3.3,
        status: 'PENDING',
        daysSinceApproval: 0,
      },
    ],
    history: [
      { stage: 'Challenge Drafted', actor: 'Department of Agriculture', timestamp: '95d ago', note: 'Challenge posted with 92/100 outcome quality score.' },
      { stage: 'Approved & Published', actor: 'MSInS State Admin', timestamp: '92d ago', note: 'Published for open startup discovery.' },
      { stage: 'Startup Discovery', actor: 'AgriScan Technologies', timestamp: '88d ago', note: 'AI match score: 94/100.' },
      { stage: 'Eligibility Screening', actor: 'DPIIT Rule Engine', timestamp: '85d ago', note: 'PASSED with Rule 170 turnover/experience exemption.' },
      { stage: 'Expert Evaluation', actor: 'CTARA IIT Bombay Panel', timestamp: '75d ago', note: 'Expert score 92/100. Recommended for pilot.' },
      { stage: 'Pilot Design', actor: 'Joint Working Group', timestamp: '70d ago', note: 'Sandbox scope and ₹16.5L grant finalized.' },
      { stage: 'Contract Signed', actor: 'MSInS & AgriScan', timestamp: '65d ago', note: 'Agreement AGR-MSINS-2026-089 signed.' },
      { stage: 'Pilot Running', actor: 'Field Sensor Squad', timestamp: '60d ago', note: 'Milestone 1 completed and ₹6.6L paid in 3 days.' },
    ],
  },
  {
    id: 'SS-2026-001043',
    challengeId: 'SS-2026-001043',
    challengeTitle: 'Rural Tele-ICU Bed Monitoring & Predictive Sepsis Early-Warning Network',
    department: 'Public Health Department',
    district: 'Pune',
    startupName: 'MedPulse Diagnostics Pvt Ltd',
    dpiitNumber: 'DPIIT-MH-2022-44102',
    agreementRef: 'AGR-MSINS-2025-041',
    startDate: new Date(Date.now() - 240 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    sandboxScope: '10 rural sub-district hospitals in Pune and Satara districts.',
    kpis: [
      { kpi: 'Sepsis sensitivity > 89%', achieved: '91.8% verified' },
      { kpi: 'Response time < 8 min', achieved: '5.2 min certified' },
      { kpi: 'Mortality reduction > 25%', achieved: '28.4% clinical signoff' },
    ],
    totalBudget: 22.0,
    disbursedBudget: 22.0,
    currentStage: 'Scale-up Decision (Scale)',
    stageNumber: 11,
    status: 'COMPLETED',
    milestones: [
      {
        id: 'ms-1043-1',
        milestoneNumber: 1,
        title: 'ICU Telemetry Gateway Deployment',
        deliverable: '10 hospital edge gateways connected to Pune ICU command center.',
        dueDate: '2025-08-01',
        paymentAmount: 8.8,
        status: 'PAID',
        paidAt: '2025-08-08',
        daysSinceApproval: 4,
        paymentRef: 'TREASURY-MH-2025-41002',
      },
      {
        id: 'ms-1043-2',
        milestoneNumber: 2,
        title: 'Mid-Term 600 Patient Cohort Validation',
        deliverable: 'Continuous vital monitoring logs and early sepsis detection clinical logs.',
        dueDate: '2025-11-01',
        paymentAmount: 8.8,
        status: 'PAID',
        paidAt: '2025-11-06',
        daysSinceApproval: 5,
        paymentRef: 'TREASURY-MH-2025-58912',
      },
      {
        id: 'ms-1043-3',
        milestoneNumber: 3,
        title: 'Final Third-Party Clinical Audit & Scale-Up Dossier',
        deliverable: 'VJTI Quality Audit sign-off and GeM integration docket.',
        dueDate: '2026-02-01',
        paymentAmount: 4.4,
        status: 'PAID',
        paidAt: '2026-02-05',
        daysSinceApproval: 4,
        paymentRef: 'TREASURY-MH-2026-11029',
      },
    ],
    validationReport: {
      id: 'val-1043',
      validatorName: 'Dr. Rekha Kulkarni (VJTI Quality Audit Bureau)',
      kpiAchievementScore: 96,
      methodology: 'Multi-hospital observation across 1,420 admissions over 6 months; certified 91.8% early warning sensitivity with zero data security breaches.',
      findings: 'The MedPulse Tele-ICU intervention consistently outperformed baseline clinical outcomes, preventing an estimated 42 critical septic deteriorations.',
      recommendation: 'SCALE',
      reportUrl: 'https://storage.samadhansetu.gov.in/validation/vjti-tele-icu-cert.pdf',
      submittedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
    scaleUpDecision: {
      decision: 'SCALE',
      procurementPathway: 'DIRECT_PILOT_AWARD',
      rationale: 'Validated under MSInS Sandbox with 96% KPI compliance and 28.4% mortality reduction. Direct procurement awarded under GFR Rule 194 to expand to 50 additional sub-district hospitals in Western Maharashtra.',
      decidedBy: 'MSInS Governing Committee',
      decidedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    history: [
      { stage: 'Challenge Drafted', actor: 'Public Health Department', timestamp: '250d ago', note: 'Formulated with 96/100 quality score.' },
      { stage: 'Approved & Published', actor: 'MSInS Admin', timestamp: '245d ago', note: 'Challenge published.' },
      { stage: 'Pilot Running', actor: 'MedPulse AI', timestamp: '240d ago', note: '10 hospitals onboarded.' },
      { stage: 'Independent Validation', actor: 'Dr. Rekha Kulkarni (VJTI)', timestamp: '20d ago', note: 'Validation score: 96/100. Recommend SCALE.' },
      { stage: 'Payment Released', actor: 'Health Dept Finance', timestamp: '15d ago', note: 'Final milestone grant released in 4 days.' },
      { stage: 'Scale-up Decision', actor: 'MSInS Governing Committee', timestamp: '10d ago', note: 'Direct Procurement Awarded under Rule 194.' },
    ],
  },
];

// Helper to get stored state
export function getStoredNavSetuData(): { challenges: Challenge[]; pilots: Pilot[] } {
  if (typeof localStorage === 'undefined') {
    return { challenges: INITIAL_CHALLENGES, pilots: INITIAL_PILOTS };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) {
      saveNavSetuData({ challenges: INITIAL_CHALLENGES, pilots: INITIAL_PILOTS });
      return { challenges: INITIAL_CHALLENGES, pilots: INITIAL_PILOTS };
    }
    const parsed = JSON.parse(raw);
    return {
      challenges: Array.isArray(parsed.challenges) && parsed.challenges.length > 0 ? parsed.challenges : INITIAL_CHALLENGES,
      pilots: Array.isArray(parsed.pilots) && parsed.pilots.length > 0 ? parsed.pilots : INITIAL_PILOTS,
    };
  } catch (err) {
    console.error('Error loading NavSetu store, resetting to initial baseline:', err);
    return { challenges: INITIAL_CHALLENGES, pilots: INITIAL_PILOTS };
  }
}

export function saveNavSetuData(data: { challenges: Challenge[]; pilots: Pilot[] }) {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving NavSetu store:', e);
  }
}

export const getStoredSamadhanSetuData = getStoredNavSetuData;
export const saveSamadhanSetuData = saveNavSetuData;

// React hooks
export function useNavSetu() {
  const [data, setData] = useState(() => getStoredNavSetuData());

  const refresh = useCallback(async () => {
    try {
      const res = await api.get('/challenges');
      if (res.data?.challenges && Array.isArray(res.data.challenges) && res.data.challenges.length > 0) {
        // Merge with local state
        const local = getStoredNavSetuData();
        const map = new Map<string, Challenge>();
        local.challenges.forEach((c) => map.set(c.id, c));
        res.data.challenges.forEach((c: Challenge) => map.set(c.id, c));
        const mergedChallenges = Array.from(map.values());
        saveNavSetuData({ challenges: mergedChallenges, pilots: local.pilots });
        setData({ challenges: mergedChallenges, pilots: local.pilots });
        return;
      }
    } catch (_) {
      // Offline fallback
    }
    setData(getStoredNavSetuData());
  }, []);

  const addChallenge = useCallback(
    async (challengeInput: any) => {
      const quality = evaluateChallengeQuality(challengeInput);
      const year = new Date().getFullYear();
      const count = data.challenges.length + 1045;
      const id = `SS-${year}-${String(count).padStart(6, '0')}`;

      const newChallenge: Challenge = {
        id,
        title: challengeInput.title,
        department: challengeInput.department || 'Public Department',
        district: challengeInput.district || 'Pune',
        sector: challengeInput.sector || 'OTHER',
        desiredOutcome: challengeInput.desiredOutcome,
        successMetrics: Array.isArray(challengeInput.successMetrics)
          ? challengeInput.successMetrics
          : typeof challengeInput.successMetrics === 'string'
          ? challengeInput.successMetrics.split(',').map((s: string) => s.trim())
          : [],
        budgetMin: Number(challengeInput.budgetMin || 5),
        budgetMax: Number(challengeInput.budgetMax || 25),
        pilotDurationMonths: Number(challengeInput.pilotDurationMonths || 6),
        dataSensitivity: challengeInput.dataSensitivity || 'INTERNAL',
        ipPreference: challengeInput.ipPreference || 'STARTUP_OWNED',
        status: quality.score >= 70 ? 'PENDING_APPROVAL' : 'DRAFTED',
        aiQualityScore: quality.score,
        aiQualityFlags: quality.flags,
        aiSuggestions: quality.suggestions,
        createdById: 'current-user',
        createdAt: new Date().toISOString(),
      };

      const updatedChallenges = [newChallenge, ...data.challenges];
      saveNavSetuData({ challenges: updatedChallenges, pilots: data.pilots });
      setData({ challenges: updatedChallenges, pilots: data.pilots });

      // Try background POST
      try {
        await api.post('/challenges', challengeInput);
      } catch (_) {}

      return { challenge: newChallenge, quality };
    },
    [data]
  );

  const approveChallenge = useCallback(
    async (id: string, note = 'Approved by MSInS Administrator.') => {
      const updated = data.challenges.map((c) =>
        c.id === id ? { ...c, status: 'APPROVED_PUBLISHED' as const } : c
      );
      saveNavSetuData({ challenges: updated, pilots: data.pilots });
      setData({ challenges: updated, pilots: data.pilots });
      try {
        await api.patch(`/challenges/${id}/status`, { status: 'APPROVED_PUBLISHED', note });
      } catch (_) {}
    },
    [data]
  );

  const submitMilestoneDeliverable = useCallback(
    (pilotId: string, milestoneNumber: number, deliverableUrl: string, notes: string) => {
      const updatedPilots = data.pilots.map((p) => {
        if (p.id !== pilotId) return p;
        const updatedMs = p.milestones.map((m) => {
          if (m.milestoneNumber !== milestoneNumber) return m;
          return {
            ...m,
            status: 'SUBMITTED' as const,
            submissionUrl: deliverableUrl,
            submissionNotes: notes,
            submittedAt: new Date().toISOString(),
            daysSinceApproval: 0,
          };
        });
        const updatedHistory = [
          ...p.history,
          {
            stage: 'Deliverable Submitted',
            actor: p.startupName,
            timestamp: 'Just now',
            note: `Milestone ${milestoneNumber} files submitted for independent verification.`,
          },
        ];
        return { ...p, milestones: updatedMs, history: updatedHistory };
      });

      saveNavSetuData({ challenges: data.challenges, pilots: updatedPilots });
      setData({ challenges: data.challenges, pilots: updatedPilots });
    },
    [data]
  );

  const validateMilestone = useCallback(
    (pilotId: string, milestoneNumber: number, notes = 'Outcome criteria certified.') => {
      const updatedPilots = data.pilots.map((p) => {
        if (p.id !== pilotId) return p;
        const updatedMs = p.milestones.map((m) => {
          if (m.milestoneNumber !== milestoneNumber) return m;
          return {
            ...m,
            status: 'VALIDATED' as const,
            validatedAt: new Date().toISOString(),
            approvedAt: new Date().toISOString(),
            daysSinceApproval: 1,
          };
        });
        const updatedHistory = [
          ...p.history,
          {
            stage: 'Independent Validation',
            actor: 'Independent Validator',
            timestamp: 'Just now',
            note: `Milestone ${milestoneNumber} certified: ${notes}`,
          },
        ];
        return { ...p, milestones: updatedMs, history: updatedHistory };
      });

      saveNavSetuData({ challenges: data.challenges, pilots: updatedPilots });
      setData({ challenges: data.challenges, pilots: updatedPilots });
    },
    [data]
  );

  const releaseMilestonePayment = useCallback(
    (pilotId: string, milestoneNumber: number) => {
      const payRef = `TREASURY-MH-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const updatedPilots = data.pilots.map((p) => {
        if (p.id !== pilotId) return p;
        let amount = 0;
        const updatedMs = p.milestones.map((m) => {
          if (m.milestoneNumber !== milestoneNumber) return m;
          amount = m.paymentAmount;
          return {
            ...m,
            status: 'PAID' as const,
            paidAt: new Date().toISOString(),
            paymentRef: payRef,
          };
        });
        const updatedHistory = [
          ...p.history,
          {
            stage: 'Payment Released',
            actor: 'Department Finance Desk',
            timestamp: 'Just now',
            note: `Milestone ${milestoneNumber} grant of ₹${amount}L released. Reference: ${payRef}.`,
          },
        ];
        return {
          ...p,
          disbursedBudget: p.disbursedBudget + amount,
          milestones: updatedMs,
          history: updatedHistory,
        };
      });

      saveNavSetuData({ challenges: data.challenges, pilots: updatedPilots });
      setData({ challenges: data.challenges, pilots: updatedPilots });
    },
    [data]
  );

  const recordScaleUpDecision = useCallback(
    (
      pilotId: string,
      decision: 'SCALE' | 'EXTEND' | 'STOP',
      procurementPathway: 'DIRECT_PILOT_AWARD' | 'LIMITED_TENDER' | 'GEM_LISTING' | 'DISCONTINUE',
      rationale: string
    ) => {
      const updatedPilots = data.pilots.map((p) => {
        if (p.id !== pilotId) return p;
        const scaleRecord: ScaleUpDecision = {
          decision,
          procurementPathway,
          rationale,
          decidedBy: 'MSInS Governing Committee',
          decidedAt: new Date().toISOString(),
        };
        const updatedHistory = [
          ...p.history,
          {
            stage: 'Scale-up Decision',
            actor: 'MSInS Governing Committee',
            timestamp: 'Just now',
            note: `Verdict: ${decision} via ${procurementPathway}. ${rationale}`,
          },
        ];
        return {
          ...p,
          currentStage: decision === 'SCALE' ? 'Scale-up Decision (Scale)' : decision === 'EXTEND' ? 'Pilot Extended' : 'Pilot Stopped',
          status: (decision === 'SCALE' ? 'COMPLETED' : decision === 'EXTEND' ? 'RUNNING' : 'STOPPED') as any,
          scaleUpDecision: scaleRecord,
          history: updatedHistory,
        };
      });

      saveNavSetuData({ challenges: data.challenges, pilots: updatedPilots });
      setData({ challenges: data.challenges, pilots: updatedPilots });
    },
    [data]
  );

  return {
    challenges: data.challenges,
    pilots: data.pilots,
    refresh,
    addChallenge,
    approveChallenge,
    submitMilestoneDeliverable,
    validateMilestone,
    releaseMilestonePayment,
    recordScaleUpDecision,
  };
}

export const useSamadhanSetu = useNavSetu;

