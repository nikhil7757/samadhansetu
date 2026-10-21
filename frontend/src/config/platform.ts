/**
 * SamadhanSetu Platform Centralized Configuration
 * Government of Maharashtra — Maharashtra State Innovation Society (MSInS)
 * SIH 2026 Problem Statement ID 26136
 */

export const PLATFORM_CONFIG = {
  name: 'SamadhanSetu',
  fullName: 'SamadhanSetu — Innovation Procurement Platform',
  tagline: 'Bridging Public Need to Startup Innovation',
  subtitle: 'A transparent, competitive, and legally compliant innovation-procurement mechanism for government departments to identify, pilot, procure, and scale startup solutions.',
  orgName: 'Maharashtra State Innovation Society (MSInS)',
  deptName: 'Department of Skills, Employment, Entrepreneurship and Innovation',
  state: 'Maharashtra',
  stateInMarathi: 'महाराष्ट्र शासन',
  problemStatementId: 'ID 26136',
  category: 'Software',
  theme: 'Miscellaneous',
  refPrefix: 'SS',
  sampleRefId: 'SS-2026-001042',
  totalDistricts: 36,
  nodalAdminRole: 'INNOVATION_SOCIETY_ADMIN',
  departmentRole: 'DEPARTMENT_USER',
  startupRole: 'STARTUP',
  evaluatorRole: 'EVALUATOR',
  validatorRole: 'VALIDATOR',
} as const;

export const MAHARASHTRA_DISTRICTS = [
  'Ahmednagar',
  'Akola',
  'Amravati',
  'Beed',
  'Bhandara',
  'Buldhana',
  'Chandrapur',
  'Chhatrapati Sambhajinagar',
  'Dharashiv',
  'Dhule',
  'Gadchiroli',
  'Gondia',
  'Hingoli',
  'Jalgaon',
  'Jalna',
  'Kolhapur',
  'Latur',
  'Mumbai City',
  'Mumbai Suburban',
  'Nagpur',
  'Nanded',
  'Nandurbar',
  'Nashik',
  'Palghar',
  'Parbhani',
  'Pune',
  'Raigad',
  'Ratnagiri',
  'Sangli',
  'Satara',
  'Sindhudurg',
  'Solapur',
  'Thane',
  'Wardha',
  'Washim',
  'Yavatmal',
] as const;

export type MaharashtraDistrict = (typeof MAHARASHTRA_DISTRICTS)[number];

export const INNOVATION_SECTORS = [
  { value: 'HEALTHCARE', labelKey: 'sectors.healthcare', label: 'Healthcare & MedTech' },
  { value: 'AGRICULTURE', labelKey: 'sectors.agriculture', label: 'Agritech & Food Processing' },
  { value: 'URBAN_GOVERNANCE', labelKey: 'sectors.urbanGovernance', label: 'Urban Governance & Smart Cities' },
  { value: 'WATER_SANITATION', labelKey: 'sectors.waterSanitation', label: 'Water Resource & Sanitation' },
  { value: 'CLEAN_ENERGY', labelKey: 'sectors.cleanEnergy', label: 'Clean Energy & E-Mobility' },
  { value: 'EDUCATION_SKILLS', labelKey: 'sectors.educationSkills', label: 'Education & Skill Development' },
  { value: 'CYBERSECURITY', labelKey: 'sectors.cybersecurity', label: 'Cybersecurity & GovTech AI' },
  { value: 'LOGISTICS_INFRA', labelKey: 'sectors.logisticsInfra', label: 'Logistics & Rural Infrastructure' },
  { value: 'OTHER', labelKey: 'sectors.other', label: 'Other Innovations' },
] as const;
