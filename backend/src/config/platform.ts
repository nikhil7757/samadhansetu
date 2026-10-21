/**
 * SamadhanSetu Platform Centralized Configuration — Backend
 * Government of Maharashtra — Maharashtra State Innovation Society (MSInS)
 * SIH 2026 Problem Statement ID 26136
 */

export const PLATFORM_CONFIG = {
  name: 'SamadhanSetu',
  fullName: 'SamadhanSetu — Innovation Procurement Platform',
  tagline: 'Startup-Friendly Public Procurement & Scaling Pathway',
  orgName: 'Maharashtra State Innovation Society (MSInS)',
  deptName: 'Department of Skills, Employment, Entrepreneurship and Innovation',
  state: 'Maharashtra',
  problemStatementId: 'ID 26136',
  refPrefix: 'SS',
  totalDistricts: 36,
  roles: {
    DEPARTMENT_USER: 'DEPARTMENT_USER',
    STARTUP: 'STARTUP',
    INNOVATION_SOCIETY_ADMIN: 'INNOVATION_SOCIETY_ADMIN',
    EVALUATOR: 'EVALUATOR',
    VALIDATOR: 'VALIDATOR',
  },
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
