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
    email?: string;
  };
  _count: {
    interests: number;
    comments: number;
  };
}

export const MOCK_USERS: Record<string, any> = {
  'admin@samadhansetu.gov.in': {
    id: 'u-admin',
    name: 'Vikram Singh (Nodal Admin)',
    email: 'admin@samadhansetu.gov.in',
    role: 'ADMIN',
    organizationName: 'Department of Higher & Technical Education, Govt. of Jharkhand',
    district: 'Ranchi',
    preferredLanguage: 'en',
  },
  'priya.kumar@gmail.com': {
    id: 'u-priya',
    name: 'Priya Kumar',
    email: 'priya.kumar@gmail.com',
    role: 'CITIZEN',
    district: 'Dhanbad',
    preferredLanguage: 'en',
  },
  'iit.ism.team@gmail.com': {
    id: 'u-iit',
    name: 'Prof. Anirudh Sen (IIT ISM Team)',
    email: 'iit.ism.team@gmail.com',
    role: 'UNIVERSITY',
    organizationName: 'IIT (ISM) Dhanbad — Dept. of Environmental Engineering',
    district: 'Dhanbad',
    preferredLanguage: 'en',
  },
  'tata.steel.csr@gmail.com': {
    id: 'u-tata',
    name: 'Siddharth Roy (Tata Steel CSR)',
    email: 'tata.steel.csr@gmail.com',
    role: 'INDUSTRY',
    organizationName: 'Tata Steel Rural Development Society (TSRDS)',
    district: 'East Singhbhum',
    preferredLanguage: 'en',
  },
};

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
    submittedBy: { id: 'u1', name: 'Rajesh Oraon', district: 'Deoghar', role: 'CITIZEN', email: 'rajesh.oraon@gmail.com' },
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
    submittedBy: { id: 'u2', name: 'Anita Devi', district: 'Gumla', role: 'CITIZEN', email: 'anita.devi@gmail.com' },
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
    submittedBy: { id: 'u3', name: 'Priya Kumar', district: 'Dhanbad', role: 'CITIZEN', email: 'priya.kumar@gmail.com' },
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
  },
];

export const MOCK_PENDING_PROBLEMS = [
  {
    id: 'pend-1',
    title: 'Seasonal Drying of Subarnarekha River Irrigation Canal in Namkum',
    description: 'Sediment buildup and breach of canal wall in Namkum block has halted water flow to over 400 hectares of paddy fields. Farmers are requesting engineered desiltation and check-dam repair.',
    category: 'AGRICULTURE',
    district: 'Ranchi',
    urgency: 'HIGH',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    submittedBy: { id: 'up-1', name: 'Alok Tirkey', email: 'alok.tirkey@gmail.com', district: 'Ranchi' },
  },
  {
    id: 'pend-2',
    title: 'Severe Arsenic Leaching in Tube Wells of Chandankiyari Panchayat',
    description: 'Preliminary kit testing indicates arsenic above permissible thresholds in 8 public school hand pumps. Lab verification and filtration deployment required immediately.',
    category: 'WATER_SANITATION',
    district: 'Bokaro',
    urgency: 'HIGH',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    submittedBy: { id: 'up-2', name: 'Meena Kumari', email: 'meena.k@gmail.com', district: 'Bokaro' },
  },
  {
    id: 'pend-3',
    title: 'Lack of Cold Storage for Mahua Flower Processing in Tribal Cooperatives',
    description: 'Over 12 quintals of harvested Mahua flowers ferment prematurely in traditional mud storehouses in Daltonganj, causing heavy income loss to forest gathering families.',
    category: 'SKILL_DEVELOPMENT',
    district: 'Palamu',
    urgency: 'MEDIUM',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    submittedBy: { id: 'up-3', name: 'Sanjay Chero', email: 'sanjay.chero@gmail.com', district: 'Palamu' },
  },
];

export const MOCK_MATCHES = [
  {
    id: 'team-1',
    formedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    problem: {
      id: 'prob-1',
      title: 'High Arsenic & Fluoride Contamination in Deep Groundwater Wells',
      status: 'IN_PROGRESS',
      category: 'WATER_SANITATION',
      district: 'Deoghar',
    },
    members: [
      { id: 'm1', user: { id: 'u1', name: 'Rajesh Oraon', role: 'CITIZEN', organizationName: 'Citizen Submitter' } },
      { id: 'm2', user: { id: 'u-iit', name: 'Prof. Anirudh Sen', role: 'UNIVERSITY', organizationName: 'IIT (ISM) Dhanbad' } },
      { id: 'm3', user: { id: 'u-tata', name: 'Siddharth Roy', role: 'INDUSTRY', organizationName: 'Tata Steel CSR' } },
    ],
    notes: [
      {
        id: 'n1',
        content: 'Tata Steel CSR has authorized ₹8.5 Lakhs milestone funding for 5 community-scale filtration units in Sarwan block.',
        authorName: 'Siddharth Roy (Tata Steel CSR)',
        authorId: 'u-tata',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      },
      {
        id: 'n2',
        content: 'Lab testing at IIT ISM confirms that activated alumina columns reduce fluoride from 3.6 mg/L to 0.8 mg/L safely under WHO limits.',
        authorName: 'Prof. Anirudh Sen (IIT ISM)',
        authorId: 'u-iit',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      },
    ],
  },
  {
    id: 'team-2',
    formedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    problem: {
      id: 'prob-2',
      title: 'Severe Post-Harvest Tomato Spoilage in Unrefrigerated Farm Clusters',
      status: 'TEAM_FORMED',
      category: 'AGRICULTURE',
      district: 'Gumla',
    },
    members: [
      { id: 'm4', user: { id: 'u2', name: 'Anita Devi', role: 'CITIZEN', organizationName: 'Citizen Submitter' } },
      { id: 'm5', user: { id: 'u-bit', name: 'BIT Mesra Innovation Cell', role: 'UNIVERSITY', organizationName: 'BIT Mesra Ranchi' } },
      { id: 'm6', user: { id: 'u-usha', name: 'Usha Martin CSR', role: 'INDUSTRY', organizationName: 'Usha Martin Foundation' } },
    ],
    notes: [
      {
        id: 'n3',
        content: 'Zero-energy evaporative cooling chamber design drafted by BIT Mesra mechanical engineering students.',
        authorName: 'BIT Mesra Innovation Cell',
        authorId: 'u-bit',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
    ],
  },
];

export const MOCK_NOTIFICATIONS = [
  {
    id: 'notif-1',
    message: 'IIT (ISM) Dhanbad submitted an engineering solution proposal for your challenge in Deoghar.',
    link: '/problems/prob-1',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'notif-2',
    message: 'Nodal Officer approved your challenge: "Heavy Metal Runoff from Abandoned Coal Washeries".',
    link: '/problems/prob-3',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: 'notif-3',
    message: 'You have been paired into an active collaboration team with Tata Steel CSR.',
    link: '/teams/team-1',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 'notif-4',
    message: 'Lifecycle milestone updated: "Maternal Vaccine Cold-Chain" reached Piloted in Field stage.',
    link: '/problems/prob-4',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];
