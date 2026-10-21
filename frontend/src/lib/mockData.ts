/**
 * SamadhanSetu Mock Data & Demo Accounts
 * Government of Maharashtra — Maharashtra State Innovation Society (MSInS)
 * SIH 2026 Problem Statement ID 26136
 */

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: 'DEPARTMENT_USER' | 'STARTUP' | 'INNOVATION_SOCIETY_ADMIN' | 'EVALUATOR' | 'VALIDATOR' | 'CITIZEN' | 'UNIVERSITY' | 'INDUSTRY' | 'ADMIN';
  organizationName?: string;
  department?: string;
  district: string;
  preferredLanguage: string;
}

export const MOCK_USERS: Record<string, MockUser> = {
  // Primary SamadhanSetu Roles
  'admin@samadhansetu.maharashtra.gov.in': {
    id: 'u-admin',
    name: 'Dr. Rahul Shinde (CEO, MSInS)',
    email: 'admin@samadhansetu.maharashtra.gov.in',
    role: 'INNOVATION_SOCIETY_ADMIN',
    organizationName: 'Maharashtra State Innovation Society (MSInS)',
    department: 'Dept. of Skills, Employment, Entrepreneurship & Innovation',
    district: 'Mumbai City',
    preferredLanguage: 'mr',
  },
  'admin@navsetu.maharashtra.gov.in': {
    id: 'u-admin',
    name: 'Dr. Rahul Shinde (CEO, MSInS)',
    email: 'admin@samadhansetu.maharashtra.gov.in',
    role: 'INNOVATION_SOCIETY_ADMIN',
    organizationName: 'Maharashtra State Innovation Society (MSInS)',
    department: 'Dept. of Skills, Employment, Entrepreneurship & Innovation',
    district: 'Mumbai City',
    preferredLanguage: 'mr',
  },
  'health.dept@maharashtra.gov.in': {
    id: 'u-health',
    name: 'Dr. Snehal Deshmukh (Director, Health Services)',
    email: 'health.dept@maharashtra.gov.in',
    role: 'DEPARTMENT_USER',
    organizationName: 'Public Health Department, Govt. of Maharashtra',
    department: 'Public Health Department',
    district: 'Pune',
    preferredLanguage: 'en',
  },
  'agri.dept@maharashtra.gov.in': {
    id: 'u-agri',
    name: 'Nitin Pawar (Joint Director, Agriculture)',
    email: 'agri.dept@maharashtra.gov.in',
    role: 'DEPARTMENT_USER',
    organizationName: 'Department of Agriculture, Govt. of Maharashtra',
    department: 'Department of Agriculture',
    district: 'Nashik',
    preferredLanguage: 'mr',
  },
  'founder@agriai.in': {
    id: 'u-agriai',
    name: 'Tanvi Joshi (AgriScan Edge AI)',
    email: 'founder@agriai.in',
    role: 'STARTUP',
    organizationName: 'AgriScan Technologies Pvt Ltd (DPIIT-MH-2023-88192)',
    district: 'Pune',
    preferredLanguage: 'en',
  },
  'contact@medpulse.in': {
    id: 'u-medpulse',
    name: 'Aditya Kulkarni (MedPulse Tele-ICU)',
    email: 'contact@medpulse.in',
    role: 'STARTUP',
    organizationName: 'MedPulse Diagnostics Pvt Ltd (DPIIT-MH-2022-44102)',
    district: 'Mumbai Suburban',
    preferredLanguage: 'en',
  },
  'evaluator.iitb@samadhansetu.gov.in': {
    id: 'u-evaluator',
    name: 'Prof. Jayant Joshi (Expert Evaluator)',
    email: 'evaluator.iitb@samadhansetu.gov.in',
    role: 'EVALUATOR',
    organizationName: 'IIT Bombay — CTARA Rural Tech Panel',
    district: 'Mumbai Suburban',
    preferredLanguage: 'en',
  },
  'validator.vjti@samadhansetu.gov.in': {
    id: 'u-validator',
    name: 'Dr. Rekha Kulkarni (Third-Party Validator)',
    email: 'validator.vjti@samadhansetu.gov.in',
    role: 'VALIDATOR',
    organizationName: 'VJTI Independent Quality Audit Bureau',
    district: 'Mumbai City',
    preferredLanguage: 'en',
  },
  'evaluator.iitb@navsetu.gov.in': {
    id: 'u-evaluator',
    name: 'Prof. Jayant Joshi (Expert Evaluator)',
    email: 'evaluator.iitb@samadhansetu.gov.in',
    role: 'EVALUATOR',
    organizationName: 'IIT Bombay — CTARA Rural Tech Panel',
    district: 'Mumbai Suburban',
    preferredLanguage: 'en',
  },
  'validator.vjti@navsetu.gov.in': {
    id: 'u-validator',
    name: 'Dr. Rekha Kulkarni (Third-Party Validator)',
    email: 'validator.vjti@samadhansetu.gov.in',
    role: 'VALIDATOR',
    organizationName: 'VJTI Independent Quality Audit Bureau',
    district: 'Mumbai City',
    preferredLanguage: 'en',
  },

  // Backward compatibility demo credentials
  'admin@samadhansetu.gov.in': {
    id: 'u-admin-legacy',
    name: 'Dr. Rahul Shinde (CEO, MSInS)',
    email: 'admin@samadhansetu.gov.in',
    role: 'INNOVATION_SOCIETY_ADMIN',
    organizationName: 'Maharashtra State Innovation Society (MSInS)',
    district: 'Mumbai City',
    preferredLanguage: 'en',
  },
  'priya.kumar@gmail.com': {
    id: 'u-dept-legacy',
    name: 'Dr. Snehal Deshmukh (Public Health Dept)',
    email: 'priya.kumar@gmail.com',
    role: 'DEPARTMENT_USER',
    organizationName: 'Public Health Department, Pune',
    district: 'Pune',
    preferredLanguage: 'en',
  },
  'iit.ism.team@gmail.com': {
    id: 'u-startup-legacy',
    name: 'Tanvi Joshi (AgriScan Edge AI)',
    email: 'iit.ism.team@gmail.com',
    role: 'STARTUP',
    organizationName: 'AgriScan Technologies Pvt Ltd (DPIIT Recognized)',
    district: 'Pune',
    preferredLanguage: 'en',
  },
  'health.dept@samadhansetu.gov.in': {
    id: 'u-health-ss',
    name: 'Dr. Snehal Deshmukh (Health Dept)',
    email: 'health.dept@samadhansetu.gov.in',
    role: 'DEPARTMENT_USER',
    organizationName: 'Public Health Department, Maharashtra',
    department: 'Public Health Department',
    district: 'Pune',
    preferredLanguage: 'en',
  },
};

export const MOCK_PROBLEMS = [
  {
    id: 'SS-2026-001042',
    title: 'Edge AI Early Crop Pest & Infestation Warning for Smallholder Cotton Farmers',
    description: 'Detect Pink Bollworm and Spodoptera infestations at larval stage without continuous 4G connectivity, reducing farmer pesticide expenditure by at least 35%.',
    category: 'AGRICULTURE',
    district: 'Nashik',
    urgency: 'HIGH' as const,
    status: 'IN_PROGRESS',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    submittedBy: {
      id: 'u-agri',
      name: 'Nitin Pawar (Joint Director, Agriculture)',
      district: 'Nashik',
      role: 'DEPARTMENT_USER',
      organizationName: 'Department of Agriculture, Govt. of Maharashtra',
      email: 'agri.dept@maharashtra.gov.in',
    },
    _count: { interests: 4, comments: 8 },
  },
  {
    id: 'SS-2026-001043',
    title: 'Rural Tele-ICU Bed Monitoring & Predictive Sepsis Early-Warning Network',
    description: 'Continuous multi-parameter vital signs streaming from 10 rural sub-district hospitals to Pune Medical College ICU hub, providing 4-hour advance warning of septic deterioration.',
    category: 'HEALTHCARE',
    district: 'Pune',
    urgency: 'HIGH' as const,
    status: 'PILOTED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    submittedBy: {
      id: 'u-health',
      name: 'Dr. Snehal Deshmukh',
      district: 'Pune',
      role: 'DEPARTMENT_USER',
      organizationName: 'Public Health Department',
      email: 'health.dept@maharashtra.gov.in',
    },
    _count: { interests: 6, comments: 11 },
  },
  {
    id: 'SS-2026-001044',
    title: 'Decentralized Solar-Powered Cold Storage Pods for Perishable Agri-Produce',
    description: 'Zero-grid refrigeration maintaining 4°C to 12°C for 5 metric tonnes of perishable produce per village cluster, reducing distress sales by 40%.',
    category: 'WATER_SANITATION',
    district: 'Chhatrapati Sambhajinagar',
    urgency: 'MEDIUM' as const,
    status: 'OPEN',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(),
    submittedBy: {
      id: 'u-admin',
      name: 'Dr. Rahul Shinde (CEO, MSInS)',
      district: 'Mumbai City',
      role: 'INNOVATION_SOCIETY_ADMIN',
      organizationName: 'MSInS',
      email: 'admin@samadhansetu.maharashtra.gov.in',
    },
    _count: { interests: 3, comments: 4 },
  },
  {
    id: 'SS-2026-001045',
    title: 'AI Video Analytics for Urban Bottleneck Detection & Adaptive Traffic Light Control',
    description: 'Dynamically modulate green signal phases based on live vehicle density at 12 major intersections, reducing peak-hour commuter transit delay by 25%.',
    category: 'INFRASTRUCTURE',
    district: 'Nagpur',
    urgency: 'HIGH' as const,
    status: 'TEAM_FORMED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 24).toISOString(),
    submittedBy: {
      id: 'u-urban',
      name: 'Executive Engineer, Nagpur Municipal Corp',
      district: 'Nagpur',
      role: 'DEPARTMENT_USER',
      organizationName: 'Urban Development Department',
      email: 'nagpur.urban@maharashtra.gov.in',
    },
    _count: { interests: 5, comments: 7 },
  },
];

export const MOCK_PENDING_PROBLEMS = [
  {
    id: 'NS-PEND-101',
    title: 'Precision Drip Irrigation Automated Valve Controllers for Solapur Pomegranate Orchards',
    description: 'Autonomous low-power IoT flow regulator valves to counter severe water table depletion in water-stressed arid talukas of Solapur.',
    category: 'AGRICULTURE',
    district: 'Solapur',
    urgency: 'HIGH' as const,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    submittedBy: { id: 'u-solapur-agri', name: 'R. K. Patil', email: 'solapur.agri@maharashtra.gov.in', district: 'Solapur' },
  },
  {
    id: 'NS-PEND-102',
    title: 'Automated Real-Time Water Quality & Turbidity Monitoring for Wardha River Basin',
    description: 'Continuous chemical pollutant sensor telemetry with automated alert triggers for local municipal water intake filtration stations.',
    category: 'WATER_SANITATION',
    district: 'Wardha',
    urgency: 'HIGH' as const,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    submittedBy: { id: 'u-wardha-water', name: 'S. B. Shinde', email: 'wardha.water@maharashtra.gov.in', district: 'Wardha' },
  },
  {
    id: 'NS-PEND-103',
    title: 'Cold Storage Micro-Hubs for Nagpur Orange Aggregators and Farmer Producer Organizations',
    description: 'Distributed phase-change solar thermal chillers maintaining 3-5°C at APMC mandis to prevent seasonal crop distress sales.',
    category: 'AGRICULTURE',
    district: 'Nagpur',
    urgency: 'MEDIUM' as const,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    submittedBy: { id: 'u-nagpur-fpo', name: 'V. M. Deshmukh', email: 'nagpur.mandi@maharashtra.gov.in', district: 'Nagpur' },
  },
];

export const MOCK_MATCHES = [
  {
    id: 'team-1',
    formedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    problem: {
      id: 'SS-2026-001042',
      title: 'Edge AI Early Crop Pest & Infestation Warning for Smallholder Cotton Farmers',
      status: 'IN_PROGRESS',
      category: 'AGRICULTURE',
      district: 'Nashik',
    },
    members: [
      { id: 'm1', user: { id: 'u-agri', name: 'Nitin Pawar', role: 'DEPARTMENT_USER', organizationName: 'Department of Agriculture' } },
      { id: 'm2', user: { id: 'u-agriai', name: 'Tanvi Joshi (AgriScan Edge AI)', role: 'STARTUP', organizationName: 'AgriScan Technologies Pvt Ltd' } },
      { id: 'm3', user: { id: 'u-evaluator', name: 'Prof. Jayant Joshi', role: 'EVALUATOR', organizationName: 'IIT Bombay — CTARA Panel' } },
      { id: 'm4', user: { id: 'u-validator', name: 'Dr. Rekha Kulkarni', role: 'VALIDATOR', organizationName: 'VJTI Quality Audit Bureau' } },
    ],
    notes: [
      {
        id: 'n1',
        content: 'MSInS Innovation Sandbox approved ₹12.5 Lakhs milestone-based pilot deployment across 3 talukas in Nashik.',
        authorName: 'Dr. Rahul Shinde (CEO, MSInS)',
        authorId: 'u-admin',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      },
      {
        id: 'n2',
        content: 'Milestone 1 deliverable submitted: offline edge pest image inference model verified with 94.2% precision on local cotton pests.',
        authorName: 'Tanvi Joshi (AgriScan Technologies)',
        authorId: 'u-agriai',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      },
    ],
  },
  {
    id: 'team-2',
    formedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    problem: {
      id: 'SS-2026-001043',
      title: 'Rural Tele-ICU Bed Monitoring & Predictive Sepsis Early-Warning Network',
      status: 'PILOTED',
      category: 'HEALTHCARE',
      district: 'Pune',
    },
    members: [
      { id: 'm5', user: { id: 'u-health', name: 'Dr. Snehal Deshmukh', role: 'DEPARTMENT_USER', organizationName: 'Public Health Department' } },
      { id: 'm6', user: { id: 'u-medpulse', name: 'Aditya Kulkarni (MedPulse Tele-ICU)', role: 'STARTUP', organizationName: 'MedPulse Diagnostics Pvt Ltd' } },
      { id: 'm7', user: { id: 'u-validator', name: 'Dr. Rekha Kulkarni', role: 'VALIDATOR', organizationName: 'VJTI Quality Audit Bureau' } },
    ],
    notes: [
      {
        id: 'n3',
        content: 'Pilot deployment across 10 rural sub-district hospitals verified with zero clinical downtime over 90 days.',
        authorName: 'Dr. Rekha Kulkarni (Quality Validator)',
        authorId: 'u-validator',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
    ],
  },
];

export const MOCK_NOTIFICATIONS = [
  {
    id: 'notif-1',
    message: 'AgriScan Technologies submitted Milestone 1 deliverables for edge pest detection in Nashik.',
    link: '/track/SS-2026-001042',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'notif-2',
    message: 'MSInS State Admin approved challenge: "Rural Tele-ICU Bed Monitoring Network".',
    link: '/track/SS-2026-001043',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: 'notif-3',
    message: 'Third-Party Quality Validator approved milestone deliverable; ₹4,00,000 disbursement released.',
    link: '/track/SS-2026-001042',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 'notif-4',
    message: 'GeM Startup Runway procurement docket generated for successful Tele-ICU scale-up.',
    link: '/track/SS-2026-001043',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];

