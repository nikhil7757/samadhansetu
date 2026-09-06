export interface MockProblem {
  id: string;
  title: string;
  description: string;
  category: string;
  district: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
  status: string;
  createdAt: string;
  submittedBy: {
    id: string;
    name: string;
    district: string;
    organizationName?: string;
    role: string;
  };
  _count: {
    interests: number;
    comments: number;
  };
}

export const MOCK_PROBLEMS: MockProblem[] = [
  {
    id: 'prob-1',
    title: 'High Arsenic & Fluoride Contamination in Deep Groundwater Wells',
    description: 'Multiple deep borewells in Deoghar and Jamtara districts show fluoride levels exceeding 3.5 mg/L (WHO limit: 1.5 mg/L) and detectable arsenic traces. Over 18,000 rural residents in Sarwan block rely on these wells, resulting in endemic dental and skeletal fluorosis among school-age children.',
    category: 'WATER_SANITATION',
    district: 'Deoghar',
    urgency: 'HIGH',
    status: 'IN_PROGRESS',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    submittedBy: { id: 'u1', name: 'Rajesh Oraon', district: 'Deoghar', role: 'CITIZEN' },
    _count: { interests: 4, comments: 8 },
  },
  {
    id: 'prob-2',
    title: 'Severe Post-Harvest Tomato Spoilage in Unrefrigerated Farm Clusters',
    description: 'Farmers in Gumla produce bumper yields of local tomatoes during peak winter harvest, but lack localized cold chain infrastructure. More than 35% of harvested produce rots during transit to Ranchi markets, forcing distress sales at under ₹2/kg.',
    category: 'AGRICULTURE',
    district: 'Gumla',
    urgency: 'HIGH',
    status: 'TEAM_FORMED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    submittedBy: { id: 'u2', name: 'Anita Devi', district: 'Gumla', role: 'CITIZEN' },
    _count: { interests: 3, comments: 5 },
  },
  {
    id: 'prob-3',
    title: 'Heavy Metal Runoff from Abandoned Coal Washeries into Damodar Tributaries',
    description: 'Abandoned coal overburden dumps and defunct washery ponds near Dhanbad leach acidic coal runoff and suspended particulate into Katri river. Turbidity levels spike after monsoon rains, impacting drinking water filtration facilities downstream.',
    category: 'ENVIRONMENT',
    district: 'Dhanbad',
    urgency: 'HIGH',
    status: 'IN_PROGRESS',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(),
    submittedBy: { id: 'u3', name: 'Priya Kumar', district: 'Dhanbad', role: 'CITIZEN' },
    _count: { interests: 5, comments: 12 },
  },
  {
    id: 'prob-4',
    title: 'Lack of Cold-Chain Storage for Maternal Vaccines in Remote Anganwadi Centers',
    description: 'Intermittent electricity outages in rural Khunti cause temperature excursions in ice-lined refrigerators storing pentavalent and hepatitis vaccines, risking vaccine efficacy across 42 remote sub-centers.',
    category: 'HEALTHCARE',
    district: 'Khunti',
    urgency: 'HIGH',
    status: 'PILOTED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(),
    submittedBy: { id: 'u4', name: 'Sunil Munda', district: 'Khunti', role: 'CITIZEN' },
    _count: { interests: 2, comments: 7 },
  },
  {
    id: 'prob-5',
    title: 'Low Solar Micro-Grid Uptime in Off-Grid Forest Habitations',
    description: 'Decentralized solar mini-grids installed in Latehar forest villages suffer frequent inverter breakdowns due to seasonal lightning surges and lack of trained local maintenance personnel.',
    category: 'INFRASTRUCTURE',
    district: 'Latehar',
    urgency: 'MEDIUM',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    submittedBy: { id: 'u5', name: 'Birsa Kujur', district: 'Latehar', role: 'CITIZEN' },
    _count: { interests: 2, comments: 3 },
  },
  {
    id: 'prob-6',
    title: 'Digital Literacy & Vernacular Learning Gaps in Primary Tribal Schools',
    description: 'Primary school students in rural West Singhbhum face high drop-out rates when transitioning from regional Ho and Mundari dialects to standard state curricula in Hindi and English.',
    category: 'EDUCATION',
    district: 'West Singhbhum',
    urgency: 'MEDIUM',
    status: 'SOLVED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40).toISOString(),
    submittedBy: { id: 'u6', name: 'Mangal Singh', district: 'West Singhbhum', role: 'CITIZEN' },
    _count: { interests: 4, comments: 9 },
  },
  {
    id: 'prob-7',
    title: 'Moringa & Minor Forest Produce Processing Equipment Deficit',
    description: 'Tribal self-help women groups in Saraikela collect wild moringa, mahua, and lac in large quantities but rely on manual pounding, reducing value-addition margins by over 60%.',
    category: 'SKILL_DEVELOPMENT',
    district: 'Saraikela Kharsawan',
    urgency: 'MEDIUM',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    submittedBy: { id: 'u7', name: 'Champa Soren', district: 'Saraikela Kharsawan', role: 'CITIZEN' },
    _count: { interests: 3, comments: 4 },
  },
  {
    id: 'prob-8',
    title: 'Sub-Surface Peat Fires in Subsidence Zones of Jharia Coalfield',
    description: 'Continuous underground coal seam smoldering produces carbon monoxide fissures and road subsidence across several residential colonies near Jharia town, requiring real-time thermal monitoring.',
    category: 'ENVIRONMENT',
    district: 'Dhanbad',
    urgency: 'HIGH',
    status: 'TEAM_FORMED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    submittedBy: { id: 'u8', name: 'Arun Mahto', district: 'Dhanbad', role: 'CITIZEN' },
    _count: { interests: 4, comments: 11 },
  }
];
