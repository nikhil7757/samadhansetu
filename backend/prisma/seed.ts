import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { STANDARD_TEMPLATES } from '../src/services/templates.service.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding NavSetu Maharashtra Innovation Procurement Database...');

  // Safe table cleanup if tables exist
  try {
    await (prisma as any).scaleUpDecision?.deleteMany();
    await (prisma as any).validationReport?.deleteMany();
    await (prisma as any).payment?.deleteMany();
    await (prisma as any).milestone?.deleteMany();
    await (prisma as any).pilot?.deleteMany();
    await (prisma as any).evaluation?.deleteMany();
    await (prisma as any).eligibilityCheck?.deleteMany();
    await (prisma as any).proposal?.deleteMany();
    await (prisma as any).challenge?.deleteMany();
    await (prisma as any).startupProfile?.deleteMany();
    await (prisma as any).templateDocument?.deleteMany();
    await (prisma as any).statusHistory?.deleteMany();
    await (prisma as any).notification?.deleteMany();
    await (prisma as any).comment?.deleteMany();
    await (prisma as any).interest?.deleteMany();
    await (prisma as any).problem?.deleteMany();
    await (prisma as any).user?.deleteMany();
  } catch (cleanErr) {
    console.warn('Cleanup skipped for unmigrated models:', cleanErr);
  }

  const passwordHash = await bcrypt.hash('Test@1234', 12);

  // 1. Create Core Users
  const msinsAdmin = await prisma.user.create({
    data: {
      name: 'Dr. Rahul Shinde (CEO, MSInS)',
      email: 'admin@navsetu.maharashtra.gov.in',
      passwordHash,
      role: 'INNOVATION_SOCIETY_ADMIN' as any,
      organizationName: 'Maharashtra State Innovation Society (MSInS)',
      department: 'Dept. of Skills, Employment, Entrepreneurship & Innovation',
      district: 'Mumbai City',
      preferredLanguage: 'mr',
    },
  });

  const deptOfficer1 = await prisma.user.create({
    data: {
      name: 'Dr. Snehal Deshmukh (Director, Health Services)',
      email: 'health.dept@maharashtra.gov.in',
      passwordHash,
      role: 'DEPARTMENT_USER' as any,
      organizationName: 'Public Health Department, Govt. of Maharashtra',
      department: 'Public Health Department',
      district: 'Pune',
      preferredLanguage: 'en',
    },
  });

  const deptOfficer2 = await prisma.user.create({
    data: {
      name: 'Nitin Pawar (Joint Director, Agriculture)',
      email: 'agri.dept@maharashtra.gov.in',
      passwordHash,
      role: 'DEPARTMENT_USER' as any,
      organizationName: 'Department of Agriculture, Govt. of Maharashtra',
      department: 'Department of Agriculture',
      district: 'Nashik',
      preferredLanguage: 'mr',
    },
  });

  const startupUser1 = await prisma.user.create({
    data: {
      name: 'Tanvi Joshi (AgriScan Edge)',
      email: 'founder@agriai.in',
      passwordHash,
      role: 'STARTUP' as any,
      organizationName: 'AgriScan Technologies Pvt Ltd',
      district: 'Pune',
      preferredLanguage: 'en',
    },
  });

  const startupUser2 = await prisma.user.create({
    data: {
      name: 'Aditya Kulkarni (MedPulse AI)',
      email: 'contact@medpulse.in',
      passwordHash,
      role: 'STARTUP' as any,
      organizationName: 'MedPulse Diagnostics Pvt Ltd',
      district: 'Mumbai Suburban',
      preferredLanguage: 'en',
    },
  });

  const evaluator1 = await prisma.user.create({
    data: {
      name: 'Prof. Jayant Joshi (Expert Evaluator)',
      email: 'evaluator.iitb@navsetu.gov.in',
      passwordHash,
      role: 'EVALUATOR' as any,
      organizationName: 'IIT Bombay — Centre for Technology Alternatives for Rural Areas (CTARA)',
      district: 'Mumbai Suburban',
      preferredLanguage: 'en',
    },
  });

  const validator1 = await prisma.user.create({
    data: {
      name: 'Dr. Rekha Kulkarni (Third-Party Validator)',
      email: 'validator.vjti@navsetu.gov.in',
      passwordHash,
      role: 'VALIDATOR' as any,
      organizationName: 'Veermata Jijabai Technological Institute (VJTI) Quality Audit Bureau',
      district: 'Mumbai City',
      preferredLanguage: 'en',
    },
  });

  // 2. Create Startup Profiles
  try {
    const profile1 = await (prisma as any).startupProfile.create({
      data: {
        userId: startupUser1.id,
        companyName: 'AgriScan Technologies Pvt Ltd',
        dpiitNumber: 'DPIIT-MH-2023-88192',
        dpiitVerified: true,
        sector: 'AGRICULTURE',
        foundingYear: 2022,
        annualTurnover: 28.5,
        teamSize: 12,
        priorGovtExperience: false,
        techReadinessLevel: 7,
        coreKeywords: ['edge ai', 'computer vision', 'pest detection', 'iot sensors', 'agronomy'],
        pastPilots: [
          { name: 'Baramati Grape Cluster Pest Warning', outcome: '38% pesticide reduction' },
        ],
      },
    });

    const profile2 = await (prisma as any).startupProfile.create({
      data: {
        userId: startupUser2.id,
        companyName: 'MedPulse Diagnostics Pvt Ltd',
        dpiitNumber: 'DPIIT-MH-2022-44102',
        dpiitVerified: true,
        sector: 'HEALTHCARE',
        foundingYear: 2021,
        annualTurnover: 42.0,
        teamSize: 18,
        priorGovtExperience: true,
        techReadinessLevel: 8,
        coreKeywords: ['tele-icu', 'remote vitals monitoring', 'cardiology ai', 'rural healthcare'],
        pastPilots: [
          { name: 'Sub-District Hospital Tele-ICU Pilot', outcome: '94% timely intervention' },
        ],
      },
    });

    // 3. Create Seed Challenges
    const ch1 = await (prisma as any).challenge.create({
      data: {
        id: 'NS-2026-001042',
        title: 'Edge AI-Driven Early Crop Pest & Disease Diagnostic Network for Cotton Smallholders',
        department: 'Department of Agriculture',
        district: 'Nashik',
        sector: 'AGRICULTURE',
        desiredOutcome: 'Detect Pink Bollworm and Spodoptera infestations at larval stage (within 24 hours of emergence) without continuous 4G connectivity, reducing farmer pesticide expenditure by at least 35%.',
        successMetrics: [
          'Diagnostic accuracy > 93% on edge devices',
          'Field alert turnaround < 18 hours',
          'Pesticide spend reduction > 30%',
          'Zero data loss in intermittent connectivity',
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
        createdById: deptOfficer2.id,
      },
    });

    const ch2 = await (prisma as any).challenge.create({
      data: {
        id: 'NS-2026-001043',
        title: 'Remote ICU Bed Tele-Monitoring and Automated Sepsis Early-Warning for Rural Hospitals',
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
        createdById: deptOfficer1.id,
      },
    });

    const ch3 = await (prisma as any).challenge.create({
      data: {
        id: 'NS-2026-001044',
        title: 'Decentralized Solar-Powered Cold Storage Pods for Onion and Tomato Farmers',
        department: 'Department of Skills, Employment, Entrepreneurship & Innovation',
        district: 'Chhatrapati Sambhajinagar',
        sector: 'CLEAN_ENERGY',
        desiredOutcome: 'Zero-grid refrigeration maintaining 4°C to 12°C for 5 metric tonnes of perishable produce per village cluster, reducing post-harvest distress sales by 40%.',
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
        createdById: deptOfficer2.id,
      },
    });

    // 4. Create Proposal & Pilot for ch1
    const prop1 = await (prisma as any).proposal.create({
      data: {
        challengeId: ch1.id,
        startupId: startupUser1.id,
        startupProfileId: profile1.id,
        approach: 'Deploy low-cost edge vision cameras mounted on solar poles with on-device INT8 quantized YOLOv8 models fine-tuned on Maharashtra crop pest datasets.',
        techDescription: 'Offline-first edge inference running on Raspberry Pi CM4 + Coral TPU accelerator. Daily batched SMS/LoRa alerts to village Krishi Mitras.',
        proposedCost: 16.5,
        proposedTimelineWeeks: 24,
        aiMatchScore: 94,
        aiMatchRationale: 'High alignment: AgriScan has tested edge vision models in Baramati, operates in Pune/Nashik, and matches 4 core technical keywords.',
        status: 'SELECTED_FOR_PILOT',
      },
    });

    // Evaluation for prop1
    await (prisma as any).evaluation.create({
      data: {
        proposalId: prop1.id,
        evaluatorId: evaluator1.id,
        innovationScore: 19,
        feasibilityScore: 18,
        teamCapabilityScore: 18,
        costValueScore: 14,
        dataSecurityScore: 9,
        scalabilityScore: 14,
        totalScore: 92,
        conflictOfInterestFlag: false,
        comments: 'Exceptional edge AI approach with clear understanding of rural Maharashtra connectivity limitations. Recommended for sandbox deployment.',
      },
    });

    // Pilot for ch1
    const pilot1 = await (prisma as any).pilot.create({
      data: {
        challengeId: ch1.id,
        proposalId: prop1.id,
        startupId: profile1.id,
        department: 'Department of Agriculture',
        district: 'Nashik',
        sandboxScope: '500 smallholder farmer cotton fields across 3 talukas in Nashik district with 40 solar edge sensor nodes.',
        agreementRef: 'AGR-MSINS-2026-089',
        startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        kpis: [
          { kpi: 'Pest identification accuracy > 93%', achieved: '94.2%' },
          { kpi: 'Alert dispatch < 18h', achieved: '11.4h' },
        ],
        totalBudget: 16.5,
        disbursedBudget: 6.6,
        currentStage: 'Pilot Running',
        status: 'RUNNING',
      },
    });

    // Milestones for pilot1
    const m1 = await (prisma as any).milestone.create({
      data: {
        pilotId: pilot1.id,
        milestoneNumber: 1,
        title: 'Sandbox Architecture & Sensor Deployment',
        deliverable: 'Installation of 40 solar camera nodes and baseline agronomy calibration report.',
        dueDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        paymentAmount: 6.6,
        status: 'PAID',
        submissionUrl: 'https://storage.navsetu.gov.in/milestones/ms-1-nashik.pdf',
        submittedAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000),
        validatedAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000),
        approvedAt: new Date(Date.now() - 48 * 24 * 60 * 60 * 1000),
        paidAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        daysSinceApproval: 3,
      },
    });

    await (prisma as any).payment.create({
      data: {
        milestoneId: m1.id,
        pilotId: pilot1.id,
        amount: 6.6,
        invoiceRef: 'INV-MSINS-2026-001',
        status: 'RELEASED',
        paymentRef: 'TREASURY-MH-2026-98124',
        releasedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        daysSinceApproval: 3,
      },
    });

    const m2 = await (prisma as any).milestone.create({
      data: {
        pilotId: pilot1.id,
        milestoneNumber: 2,
        title: 'Mid-Term Larval Infestation Telemetry & Farmer Adoption',
        deliverable: 'Live dataset of 12,000 pest diagnostic scans and verified 32% pesticide expenditure reduction.',
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        paymentAmount: 6.6,
        status: 'SUBMITTED',
        submissionUrl: 'https://storage.navsetu.gov.in/milestones/ms-2-midterm.pdf',
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    });

    const m3 = await (prisma as any).milestone.create({
      data: {
        pilotId: pilot1.id,
        milestoneNumber: 3,
        title: 'Final Independent Validation & Scale-Up Dossier',
        deliverable: 'Comprehensive third-party audit report and GeM cataloging package.',
        dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        paymentAmount: 3.3,
        status: 'PENDING',
      },
    });

    // Pilot 2 (for ch2: Scaled pilot showcase)
    const prop2 = await (prisma as any).proposal.create({
      data: {
        challengeId: ch2.id,
        startupId: startupUser2.id,
        startupProfileId: profile2.id,
        approach: 'Deploy MedPulse AI gateway connecting multi-vendor vital sign monitors to central cloud ICU dashboard.',
        techDescription: 'FHIR/HL7 compliant edge router with offline predictive sepsis scoring.',
        proposedCost: 22.0,
        proposedTimelineWeeks: 26,
        aiMatchScore: 97,
        status: 'SELECTED_FOR_PILOT',
      },
    });

    const pilot2 = await (prisma as any).pilot.create({
      data: {
        challengeId: ch2.id,
        proposalId: prop2.id,
        startupId: profile2.id,
        department: 'Public Health Department',
        district: 'Pune',
        sandboxScope: '10 rural sub-district hospitals in Pune and Satara districts.',
        agreementRef: 'AGR-MSINS-2025-041',
        startDate: new Date(Date.now() - 240 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        kpis: [
          { kpi: 'Sepsis sensitivity > 89%', achieved: '91.8%' },
          { kpi: 'Response time < 8 min', achieved: '5.2 min' },
          { kpi: 'Mortality reduction > 25%', achieved: '28.4%' },
        ],
        totalBudget: 22.0,
        disbursedBudget: 22.0,
        currentStage: 'Scale-up Decision (Scale)',
        status: 'COMPLETED',
      },
    });

    // Validation Report for pilot2
    await (prisma as any).validationReport.create({
      data: {
        pilotId: pilot2.id,
        validatorId: validator1.id,
        validatorName: 'Dr. Rekha Kulkarni (VJTI Quality Audit)',
        kpiAchievementScore: 96,
        methodology: 'Multi-hospital clinical observation, patient outcome audit of 1,420 admissions over 6 months, and network security penetration testing.',
        findings: 'The MedPulse Tele-ICU intervention consistently outperformed baseline clinical metrics, preventing an estimated 42 critical septic deteriorations. Zero cybersecurity or PII leakage incidents recorded.',
        recommendation: 'SCALE',
        reportUrl: 'https://storage.navsetu.gov.in/validation/vjti-tele-icu-cert.pdf',
        submittedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      },
    });

    // Scale Up Decision for pilot2
    await (prisma as any).scaleUpDecision.create({
      data: {
        pilotId: pilot2.id,
        decision: 'SCALE',
        procurementPathway: 'DIRECT_PILOT_AWARD',
        rationale: 'Validated under MSInS Sandbox with 96% KPI compliance and 28.4% mortality reduction. Direct procurement awarded under GFR Rule 194 to expand to 50 additional sub-district hospitals in Western Maharashtra.',
        decidedById: msinsAdmin.id,
        decidedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
    });

    // 5. Seed Standard Templates
    for (const tpl of STANDARD_TEMPLATES) {
      await (prisma as any).templateDocument.create({
        data: {
          id: tpl.id,
          type: tpl.type,
          title: tpl.title,
          version: tpl.version,
          description: tpl.summary,
          content: tpl.content,
        },
      });
    }

    // 6. Seed Status History
    await (prisma as any).statusHistory.createMany({
      data: [
        {
          entityType: 'CHALLENGE',
          entityId: ch1.id,
          oldStatus: 'DRAFTED',
          newStatus: 'APPROVED_PUBLISHED',
          actor: 'Dr. Rahul Shinde (CEO, MSInS)',
          action: 'CHALLENGE_APPROVED',
          note: 'Challenge validated with 92/100 outcome quality score and approved for startup discovery.',
        },
        {
          entityType: 'PILOT',
          entityId: pilot1.id,
          oldStatus: 'DESIGN',
          newStatus: 'CONTRACT_SIGNED',
          actor: 'Nitin Pawar (Joint Director, Agriculture)',
          action: 'CONTRACT_EXECUTED',
          note: 'Tripartite agreement signed. Escrow funding locked.',
        },
        {
          entityType: 'PILOT',
          entityId: pilot2.id,
          oldStatus: 'INDEPENDENT_VALIDATION',
          newStatus: 'SCALE_UP_DECISION',
          actor: 'MSInS Governing Committee',
          action: 'SCALE_UP_AWARDED',
          note: 'Unanimous decision to scale MedPulse Tele-ICU statewide via Direct Award Pathway (GFR 194).',
        },
      ],
    });
  } catch (err) {
    console.error('Error seeding NavSetu data:', err);
  }

  console.log('✅ NavSetu Maharashtra Innovation Procurement seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
