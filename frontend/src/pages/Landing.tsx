import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Search,
  Award,
  Building2,
  Rocket,
  FileText,
  Activity,
  ExternalLink,
  Radio,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StateSeal } from '@/components/shared/StateSeal';
import { AnimatedStatCounter } from '@/components/shared/AnimatedStatCounter';
import { cn } from '@/lib/utils';

// Real Maharashtra Telemetry Data across major regional innovation hubs
const MAHARASHTRA_DISTRICT_HUBS = [
  {
    id: 'pune',
    name: 'Pune',
    marathi: 'पुणे',
    hindi: 'पुणे',
    tag: 'Western Maharashtra MedTech & AI Hub',
    tagMr: 'पश्चिम महाराष्ट्र मेडटेक व एआय केंद्र',
    tagHi: 'पश्चिम महाराष्ट्र मेडटेक एवं एआई हब',
    activeChallenges: 24,
    pilotsRunning: 8,
    avgTurnaround: '42 Days',
    avgTurnaroundMr: '42 दिवस',
    avgTurnaroundHi: '42 दिन',
    scaledRate: '83.3%',
    primaryFocus: 'Rural Tele-ICU, Smart Mobility, Drone Deliveries, Agritech',
    primaryFocusMr: 'ग्रामीण टेली-आयसीयू, स्मार्ट मोबिलिटी, ड्रोन वितरण, ॲग्रीटेक',
    primaryFocusHi: 'ग्रामीण टेली-आईसीयू, स्मार्ट मोबिलिटी, ड्रोन डिलीवरी, एग्रीटेक',
    nodalSecretary: 'Dr. Snehal Deshmukh (Health Directorate)',
    nodalSecretaryMr: 'डॉ. स्नेहल देशमुख (आरोग्य संचालनालय)',
    nodalSecretaryHi: 'डॉ. स्नेहल देशमुख (स्वास्थ्य निदेशालय)',
    sampleRef: 'SS-2026-001043',
  },
  {
    id: 'nashik',
    name: 'Nashik',
    marathi: 'नाशिक',
    hindi: 'नासिक',
    tag: 'Agritech & Perishable Supply Chain',
    tagMr: 'ॲग्रीटेक व नाशवंत पुरवठा साखळी',
    tagHi: 'एग्रीटेक एवं शीघ्रनाशी आपूर्ति श्रृंखला',
    activeChallenges: 18,
    pilotsRunning: 6,
    avgTurnaround: '48 Days',
    avgTurnaroundMr: '48 दिवस',
    avgTurnaroundHi: '48 दिन',
    scaledRate: '75.0%',
    primaryFocus: 'Crop Pest Edge AI, Post-Harvest Cold Chain, Micro-Irrigation',
    primaryFocusMr: 'पिक कीड एज-एआय, कापणीनंतर कोल्ड चेन, सूक्ष्म सिंचन',
    primaryFocusHi: 'फसल कीट एज-एआई, फसल कटाई बाद कोल्ड चेन, सूक्ष्म सिंचाई',
    nodalSecretary: 'Nitin Pawar (Joint Director Agriculture)',
    nodalSecretaryMr: 'नितीन पवार (सहसंचालक कृषी)',
    nodalSecretaryHi: 'नितिन पवार (संयुक्त निदेशक कृषि)',
    sampleRef: 'SS-2026-001042',
  },
  {
    id: 'nagpur',
    name: 'Nagpur',
    marathi: 'नागपूर',
    hindi: 'नागपुर',
    tag: 'Vidarbha Logistics & Urban Smart City',
    tagMr: 'विदर्भ लॉजिस्टिक व अर्बन स्मार्ट सिटी',
    tagHi: 'विदर्भ लॉजिस्टिक्स एवं अर्बन स्मार्ट सिटी',
    activeChallenges: 21,
    pilotsRunning: 7,
    avgTurnaround: '39 Days',
    avgTurnaroundMr: '39 दिवस',
    avgTurnaroundHi: '39 दिन',
    scaledRate: '77.8%',
    primaryFocus: 'Adaptive Traffic Lights, Drone Forest Surveillance, Water Grid',
    primaryFocusMr: 'अनुकूल वाहतूक दिवे, ड्रोन वन देखरेख, पाणी ग्रीड',
    primaryFocusHi: 'अनुकूली ट्रैफिक लाइट, ड्रोन वन निगरानी, जल ग्रिड',
    nodalSecretary: 'Executive Engineer, Nagpur Municipal Corp',
    nodalSecretaryMr: 'कार्यकारी अभियंता, नागपूर महानगरपालिका',
    nodalSecretaryHi: 'कार्यपालक अभियंता, नागपुर नगर निगम',
    sampleRef: 'SS-2026-001045',
  },
  {
    id: 'mumbai_suburban',
    name: 'Mumbai Suburban',
    marathi: 'मुंबई उपनगर',
    hindi: 'मुंबई उपनगर',
    tag: 'GovTech, Health AI & Urban Infrastructure',
    tagMr: 'गव्हटेक, आरोग्य एआय व नागरी पायाभूत सुविधा',
    tagHi: 'गवटेक, स्वास्थ्य एआई एवं शहरी बुनियादी ढांचा',
    activeChallenges: 32,
    pilotsRunning: 11,
    avgTurnaround: '36 Days',
    avgTurnaroundMr: '36 दिवस',
    avgTurnaroundHi: '36 दिन',
    scaledRate: '88.5%',
    primaryFocus: 'Civic Sensor Telemetry, Slum Sanitation AI, Coastal Protection',
    primaryFocusMr: 'नागरी सेन्सर टेलीमेट्री, झोपडपट्टी स्वच्छता एआय, किनारी संरक्षण',
    primaryFocusHi: 'नागरिक सेंसर टेलीमेट्री, मलिन बस्ती स्वच्छता एआई, तटीय सुरक्षा',
    nodalSecretary: 'Director of Innovation (MSInS HQ)',
    nodalSecretaryMr: 'नाविन्यता संचालक (MSInS मुख्यालय)',
    nodalSecretaryHi: 'नवाचार निदेशक (MSInS मुख्यालय)',
    sampleRef: 'SS-2026-001046',
  },
  {
    id: 'chhatrapati_sambhajinagar',
    name: 'Chhatrapati Sambhajinagar',
    marathi: 'छत्रपती संभाजीनगर',
    hindi: 'छत्रपति संभाजीनगर',
    tag: 'Marathwada Clean Energy & Drought Resilience',
    tagMr: 'मराठवाडा स्वच्छ ऊर्जा व दुष्काळ प्रतिकार',
    tagHi: 'मराठवाड़ा स्वच्छ ऊर्जा एवं सूखा प्रतिरोधक क्षमता',
    activeChallenges: 14,
    pilotsRunning: 4,
    avgTurnaround: '51 Days',
    avgTurnaroundMr: '51 दिवस',
    avgTurnaroundHi: '51 दिन',
    scaledRate: '71.4%',
    primaryFocus: 'Decentralized Solar Cold Storage, Water Filtration, EV Fleets',
    primaryFocusMr: 'विकेंद्रित सौर शीतगृह, जल शुद्धीकरण, ईव्ही फ्लीट',
    primaryFocusHi: 'विकेंद्रीकृत सौर कोल्ड स्टोरेज, जल शोधन, ईवी बेड़े',
    nodalSecretary: 'District Development Officer',
    nodalSecretaryMr: 'जिल्हा विकास अधिकारी',
    nodalSecretaryHi: 'जिला विकास अधिकारी',
    sampleRef: 'SS-2026-001044',
  },
  {
    id: 'thane',
    name: 'Thane',
    marathi: 'ठाणे',
    hindi: 'ठाणे',
    tag: 'Urban-Tribal Convergence & Environmental Tech',
    tagMr: 'शहरी-आदिवासी समन्वय व पर्यावरण तंत्रज्ञान',
    tagHi: 'शहरी-जनजातीय समन्वय एवं पर्यावरण तकनीक',
    activeChallenges: 16,
    pilotsRunning: 5,
    avgTurnaround: '44 Days',
    avgTurnaroundMr: '44 दिवस',
    avgTurnaroundHi: '44 दिन',
    scaledRate: '73.3%',
    primaryFocus: 'Lake Water Quality Monitoring, Decentralized Waste-to-Energy',
    primaryFocusMr: 'तलाव पाणी गुणवत्ता देखरेख, विकेंद्रित कचरा ते ऊर्जा',
    primaryFocusHi: 'झील जल गुणवत्ता निगरानी, विकेंद्रीकृत कचरे से ऊर्जा',
    nodalSecretary: 'Chief Environmental Officer (TMC)',
    nodalSecretaryMr: 'मुख्य पर्यावरण अधिकारी (ठाणे मनपा)',
    nodalSecretaryHi: 'मुख्य पर्यावरण अधिकारी (टीएमसी)',
    sampleRef: 'SS-2026-001047',
  },
];

// Active Maharashtra Pilots for the Field HUD Reel
const FIELD_REEL_PILOTS = [
  {
    id: 'SS-2026-001043',
    stage: 'STAGE 08 // PILOT RUNNING',
    stageMr: 'टप्पा ०८ // पायलट सुरू',
    stageHi: 'चरण ०८ // पायलट प्रगति पर',
    district: 'PUNE & SATARA',
    districtMr: 'पुणे व सातारा',
    districtHi: 'पुणे एवं सतारा',
    sector: 'HEALTHCARE / MEDTECH',
    title: 'Rural Tele-ICU & Predictive Sepsis Warning Network',
    titleMr: 'ग्रामीण टेली-आयसीयू व सेप्सिस पूर्वसूचना नेटवर्क',
    titleHi: 'ग्रामीण टेली-आईसीयू एवं सेप्सिस पूर्व-चेतावनी नेटवर्क',
    department: 'Public Health Department',
    departmentMr: 'सार्वजनिक आरोग्य विभाग',
    departmentHi: 'सार्वजनिक स्वास्थ्य विभाग',
    startup: 'MedPulse Diagnostics Pvt Ltd (DPIIT-MH-2022-44102)',
    metricLabel: 'CLINICAL SENSITIVITY',
    metricLabelMr: 'क्लिनिकल अचूकता',
    metricLabelHi: 'क्लिनिकल सटीकता',
    metricValue: '91.8%',
    budget: '₹24.5L',
    turnaround: '38 Days Elapsed',
    turnaroundMr: '38 दिवस पूर्ण',
    turnaroundHi: '38 दिन पूर्ण',
    scalePathway: 'GFR Rule 194 Direct Scale',
    scalePathwayMr: 'GFR नियम 194 थेट विस्तार',
    scalePathwayHi: 'GFR नियम 194 प्रत्यक्ष विस्तार',
    codePattern: 'M-ICU-MESH-V2',
  },
  {
    id: 'SS-2026-001042',
    stage: 'STAGE 09 // VALIDATION AUDIT',
    stageMr: 'टप्पा ०९ // स्वतंत्र पडताळणी',
    stageHi: 'चरण ०९ // स्वतंत्र सत्यापन ऑडिट',
    district: 'NASHIK (NIPHAD)',
    districtMr: 'नाशिक (निफाड)',
    districtHi: 'नासिक (निफाड़)',
    sector: 'AGRITECH / EDGE AI',
    title: 'Computer Vision & Edge-AI Early Crop Pest Detection',
    titleMr: 'संगणकीय दृष्टी व एज-एआय द्वारे पीक कीड ओळख',
    titleHi: 'कंप्यूटर विज़न एवं एज-एआई फसल कीट पहचान',
    department: 'Department of Agriculture',
    departmentMr: 'कृषी विभाग',
    departmentHi: 'कृषि विभाग',
    startup: 'KisanDrishti Technologies (DPIIT-MH-2023-88310)',
    metricLabel: 'PEST PRECISION',
    metricLabelMr: 'कीड शोध अचूकता',
    metricLabelHi: 'कीट पहचान सटीकता',
    metricValue: '94.2%',
    budget: '₹16.5L',
    turnaround: '42 Days Elapsed',
    turnaroundMr: '42 दिवस पूर्ण',
    turnaroundHi: '42 दिन पूर्ण',
    scalePathway: 'GeM Custom Bid Scale-Up',
    scalePathwayMr: 'GeM कस्टम बोली विस्तार',
    scalePathwayHi: 'GeM कस्टम बिड स्केल-अप',
    codePattern: 'AGRI-VISION-40HA',
  },
  {
    id: 'SS-2026-001045',
    stage: 'STAGE 10 // ESCROW DISBURSEMENT',
    stageMr: 'टप्पा १० // एस्क्रो अनुदान वाटप',
    stageHi: 'चरण १० // एस्क्रो संवितरण',
    district: 'NAGPUR & WARDHA',
    districtMr: 'नागपूर व वर्धा',
    districtHi: 'नागपुर एवं वर्धा',
    sector: 'WATER SUPPLY & IOT',
    title: 'IoT Real-Time Chlorine Residual Monitoring Grid',
    titleMr: 'आयओटी द्वारे रिअल-टाइम क्लोरीन अवशिष्ट देखरेख ग्रीड',
    titleHi: 'आईओटी रीयल-टाइम क्लोरीन अवशिष्ट निगरानी ग्रिड',
    department: 'Water Supply & Sanitation Dept',
    departmentMr: 'पाणीपुरवठा व स्वच्छता विभाग',
    departmentHi: 'जल आपूर्ति एवं स्वच्छता विभाग',
    startup: 'JalShakti Sensors LLP (DPIIT-MH-2021-12093)',
    metricLabel: 'SENSOR UPTIME',
    metricLabelMr: 'सेन्सर उपलब्धता',
    metricLabelHi: 'सेंसर अपटाइम',
    metricValue: '99.4%',
    budget: '₹18.0L',
    turnaround: '31 Days Elapsed',
    turnaroundMr: '31 दिवस पूर्ण',
    turnaroundHi: '31 दिन पूर्ण',
    scalePathway: 'Jal Jeevan Framework Order',
    scalePathwayMr: 'जल जीवन फ्रेमवर्क आदेश',
    scalePathwayHi: 'जल जीवन फ्रेमवर्क आदेश',
    codePattern: 'WATER-MESH-25NODE',
  },
  {
    id: 'SS-2026-001046',
    stage: 'STAGE 06 // SANDBOX DESIGN',
    stageMr: 'टप्पा ०६ // सँडबॉक्स रचना',
    stageHi: 'चरण ०६ // सैंडबॉक्स डिजाइन',
    district: 'MUMBAI SUBURBAN',
    districtMr: 'मुंबई उपनगर',
    districtHi: 'मुंबई उपनगर',
    sector: 'GOVTECH / SANITATION',
    title: 'Slum Sanitation Drainage Silt Telemetry & Early Overflow AI',
    titleMr: 'झोपडपट्टी गटार गाळ टेलीमेट्री व ओव्हरफ्लो एआय',
    titleHi: 'मलिन बस्ती ड्रेनेज गाद टेलीमेट्री एवं ओवरफ्लो एआई',
    department: 'Urban Development & BMC',
    departmentMr: 'नगर विकास विभाग व मनपा',
    departmentHi: 'नगर विकास विभाग एवं बीएमसी',
    startup: 'UrbanDrain Tech (DPIIT-MH-2024-91280)',
    metricLabel: 'OVERFLOW PREVENTION',
    metricLabelMr: 'ओव्हरफ्लो प्रतिबंध',
    metricLabelHi: 'ओवरफ्लो रोकथाम',
    metricValue: '87.5%',
    budget: '₹32.0L',
    turnaround: '14 Days Elapsed',
    turnaroundMr: '14 दिवस पूर्ण',
    turnaroundHi: '14 दिन पूर्ण',
    scalePathway: 'Tripartite Sandbox Gate',
    scalePathwayMr: 'त्रिपक्षीय सँडबॉक्स गेट',
    scalePathwayHi: 'त्रिपक्षीय सैंडबॉक्स गेट',
    codePattern: 'BMC-SILT-DRAIN-01',
  },
];

const RECENT_SCALED_PILOTS = [
  {
    id: 'SS-2026-001043',
    title: 'Rural Tele-ICU & Predictive Sepsis Early-Warning Network',
    titleMr: 'ग्रामीण टेली-आयसीयू व सेप्सिस पूर्वसूचना नेटवर्क',
    titleHi: 'ग्रामीण टेली-आईसीयू एवं सेप्सिस पूर्व-चेतावनी नेटवर्क',
    department: 'Public Health Department',
    departmentMr: 'सार्वजनिक आरोग्य विभाग',
    departmentHi: 'सार्वजनिक स्वास्थ्य विभाग',
    district: 'Pune & Satara',
    districtMr: 'पुणे व सातारा',
    districtHi: 'पुणे एवं सतारा',
    startup: 'MedPulse Diagnostics Pvt Ltd (DPIIT-MH-2022-44102)',
    pilotScope: '10 rural sub-district hospitals tested for 6 months.',
    validatedOutcome: '91.8% sepsis sensitivity, 28.4% reduction in transfer mortality.',
    validatedOutcomeMr: '९१.८% सेप्सिस अचूकता, रुग्ण स्थानांतरण मृत्यूमध्ये २८.४% घट.',
    validatedOutcomeHi: '९१.८% सेप्सिस संवेदनशीलता, स्थानांतरण मृत्यु दर में २८.४% कमी।',
    scalePathway: 'Direct Pilot Award (GFR Rule 194)',
    scalePathwayMr: 'थेट पायलट खरेदी आदेश (GFR नियम १९४)',
    scalePathwayHi: 'प्रत्यक्ष पायलट खरीद आदेश (GFR नियम १९४)',
    budgetLakhs: 24.5,
  },
  {
    id: 'SS-2026-001042',
    title: 'Computer Vision & Edge-AI Early Crop Pest Detection in Vineyards',
    titleMr: 'द्राक्षबागांमध्ये संगणकीय दृष्टी व एज-एआय द्वारे कीड ओळख',
    titleHi: 'अंगूर के बागानों में कंप्यूटर विज़न एवं एज-एआई द्वारा कीट पहचान',
    department: 'Department of Agriculture',
    departmentMr: 'कृषी विभाग',
    departmentHi: 'कृषि विभाग',
    district: 'Nashik',
    districtMr: 'नाशिक',
    districtHi: 'नासिक',
    startup: 'KisanDrishti Technologies (DPIIT-MH-2023-88310)',
    pilotScope: '40 hectares across Niphad taluka farmer collectives.',
    validatedOutcome: '94.2% detection precision, 38% reduction in chemical spray volume.',
    validatedOutcomeMr: '९४.२% कीड शोध अचूकता, रासायनिक फवारणीत ३८% घट.',
    validatedOutcomeHi: '९४.२% पहचान सटीकता, रासायनिक छिड़काव में ३८% कमी।',
    scalePathway: 'GeM Custom Bid Scale-Up',
    scalePathwayMr: 'GeM कस्टम बिड थेट विस्तार',
    scalePathwayHi: 'GeM कस्टम बिड स्केल-अप',
    budgetLakhs: 16.5,
  },
  {
    id: 'SS-2026-001045',
    title: 'IoT Real-Time Chlorine Residual Monitoring in Rural Piped Water Schemes',
    titleMr: 'ग्रामीण नळ पाणी योजनांमध्ये आयओटी रिअल-टाइम क्लोरीन देखरेख',
    titleHi: 'ग्रामीण नल जल योजनाओं में आईओटी रीयल-टाइम क्लोरीन निगरानी',
    department: 'Water Supply and Sanitation Department',
    departmentMr: 'पाणीपुरवठा व स्वच्छता विभाग',
    departmentHi: 'जल आपूर्ति एवं स्वच्छता विभाग',
    district: 'Nagpur & Wardha',
    districtMr: 'नागपूर व वर्धा',
    districtHi: 'नागपुर एवं वर्धा',
    startup: 'JalShakti Sensors LLP (DPIIT-MH-2021-12093)',
    pilotScope: '25 gram panchayat overhead reservoir nodes.',
    validatedOutcome: '99.4% uptime, zero bacterial water contamination incidents over 90 days.',
    validatedOutcomeMr: '९९.४% उपलब्धता, ९० दिवसांत शून्य जिवाणू दूषितीकरण.',
    validatedOutcomeHi: '९९.४% अपटाइम, ९० दिनों में शून्य जीवाणु संदूषण की घटनाएं।',
    scalePathway: 'Statewide Framework Order (Jal Jeevan Mission)',
    scalePathwayMr: 'राज्यव्यापी फ्रेमवर्क आदेश (जल जीवन मिशन)',
    scalePathwayHi: 'राज्यव्यापी फ्रेमवर्क आदेश (जल जीवन मिशन)',
    budgetLakhs: 18.0,
  },
];

const STATUTORY_STEPS = [
  { step: '01', title: 'Problem Formulation', desc: 'Department formulates outcome-based need with quantifiable KPIs & IP preference.' },
  { step: '02', title: 'Quality Approval', desc: 'MSInS validates Challenge Quality Score (0–100) and releases challenge to gazette.' },
  { step: '03', title: 'Startup Discovery', desc: 'Startups browse open marketplace with automated AI match compatibility scoring.' },
  { step: '04', title: 'Eligibility Screening', desc: 'Rule engine applies statutory turnover & experience waivers for DPIIT startups.' },
  { step: '05', title: 'Expert Evaluation', desc: 'Independent panel scores proposals across 5 weighted statutory benchmarks.' },
  { step: '06', title: 'Sandbox Pilot Design', desc: 'Controlled sandbox testbed, telemetry protocols, and milestone gates structured.' },
  { step: '07', title: 'Tripartite Contract', desc: 'Tripartite sandbox agreement locked with IP safeguards and non-liability terms.' },
  { step: '08', title: 'Pilot Running', desc: 'Startup deploys field tech in live environment with real-time telemetry.' },
  { step: '09', title: 'Validation Audit', desc: 'Third-party auditor (e.g. VJTI/COEP) independently tests and certifies KPIs.' },
  { step: '10', title: 'Escrow Payment', desc: 'Milestone grant released with automated turnaround tracking clock.' },
  { step: '11', title: 'Scale-up Decision', desc: 'Statutory verdict: Direct Award (GFR 194), GeM Listing, or limited tender.' },
];

const STATUTORY_STEPS_MR = [
  { step: '01', title: 'आव्हान मसुदा', desc: 'विभाग परिणाम-आधारित गरज, मोजता येण्याजोगे केपीआय आणि आयपी प्राधान्यांसह मसुदा तयार करतो.' },
  { step: '02', title: 'गुणवत्ता मंजुरी', desc: 'MSInS आव्हान गुणवत्ता स्कोअर (०-१००) तपासून आव्हान अधिकृत राजपत्रात प्रसिद्ध करते.' },
  { step: '03', title: 'स्टार्टअप शोध', desc: 'स्टार्टअप्स स्वयंचलित एआय मॅच गुणांसह खुली आव्हाने शोधतात.' },
  { step: '04', title: 'पात्रता छाननी', desc: 'नियम इंजिन DPIIT स्टार्टअप्ससाठी वैधानिक उलाढाल व अनुभव अटी शिथिल करते.' },
  { step: '05', title: 'तज्ज्ञ मूल्यांकन', desc: 'स्वतंत्र समिती ५ भारित वैधानिक निकषांवर प्रस्तावांचे वस्तुनिष्ठ गुणदान करते.' },
  { step: '06', title: 'सँडबॉक्स रचना', desc: 'नियंत्रित सँडबॉक्स चाचणी, टेलीमेट्री प्रोटोकॉल आणि देयक टप्पे निश्चित केले जातात.' },
  { step: '07', title: 'त्रिपक्षीय करार', desc: 'बौद्धिक संपदा (IP) सुरक्षेसह प्रमाणित त्रिपक्षीय सँडबॉक्स करार अंतिम होतो.' },
  { step: '08', title: 'पायलट सुरू', desc: 'स्टार्टअप प्रत्यक्ष क्षेत्रात तंत्रज्ञान तैनात करतो; थेट टेलीमेट्री देखरेख सुरू.' },
  { step: '09', title: 'स्वतंत्र पडताळणी', desc: 'तिसऱ्या पक्षाचा तपासनीस (VJTI/COEP) निकालांचे निष्पक्ष प्रमाणीकरण करतो.' },
  { step: '10', title: 'एस्क्रो देयक वाटप', desc: 'स्वयंचलित विलंब ट्रॅकिंग टाइमरसह माइलस्टोन निधी ७ दिवसांत वितरित.' },
  { step: '11', title: 'स्केल-अप निर्णय', desc: 'वैधानिक निकाल: थेट खरेदी (GFR १९४), GeM सूची, किंवा मर्यादित निविदा.' },
];

const STATUTORY_STEPS_HI = [
  { step: '01', title: 'चुनौती प्रारूपण', desc: 'विभाग परिणाम-आधारित आवश्यकता, मापने योग्य केपीआई और आईपी प्राथमिकताओं के साथ प्रारूप बनाता है।' },
  { step: '02', title: 'गुणवत्ता स्वीकृति', desc: 'MSInS गुणवत्ता स्कोर (०-१००) की पुष्टि कर चुनौती को राजपत्र में जारी करता है।' },
  { step: '03', title: 'स्टार्टअप खोज', desc: 'स्टार्टअप स्वचालित एआई मिलान अनुशंसाओं के साथ खुली चुनौतियाँ ब्राउज़ करते हैं।' },
  { step: '04', title: 'पात्रता स्क्रीनिंग', desc: 'नियम इंजन DPIIT स्टार्टअप्स के लिए वैधानिक टर्नओवर और अनुभव में छूट लागू करता है।' },
  { step: '05', title: 'विशेषज्ञ मूल्यांकन', desc: 'स्वतंत्र पैनल ५ भारित वैधानिक बेंचमार्क पर प्रस्तावों का वस्तुनिष्ठ स्कोर करता है।' },
  { step: '06', title: 'सैंडबॉक्स डिजाइन', desc: 'नियंत्रित सैंडबॉक्स टेस्टबेड, टेलीमेट्री प्रोटोकॉल और माइलस्टोन भुगतान तय होते हैं।' },
  { step: '07', title: 'त्रिपक्षीय अनुबंध', desc: 'आईपी सुरक्षा और गैर-देयता शर्तों के साथ मानकीकृत त्रिपक्षीय समझौता लॉक होता है।' },
  { step: '08', title: 'पायलट प्रगति पर', desc: 'स्टार्टअप वास्तविक वातावरण में तकनीक तैनात करता है; रीयल-टाइम टेलीमेट्री ट्रैकिंग।' },
  { step: '09', title: 'स्वतंत्र सत्यापन', desc: 'तृतीय-पक्ष परीक्षक (VJTI/COEP) केपीआई परिणामों को निष्पक्ष रूप से प्रमाणित करता है।' },
  { step: '10', title: 'एस्क्रो भुगतान', desc: 'स्वचालित विलंब ट्रैकिंग घड़ी के साथ माइलस्टोन अनुदान ७ दिनों में जारी।' },
  { step: '11', title: 'स्केल-अप निर्णय', desc: 'वैधानिक निर्णय: प्रत्यक्ष खरीद (GFR १९४), GeM लिस्टिंग, या सीमित निविदा।' },
];

const REEL_SLIDE_DURATION = 6000; // ms

export default function Landing() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [trackQuery, setTrackQuery] = useState('');
  const [selectedHub, setSelectedHub] = useState(MAHARASHTRA_DISTRICT_HUBS[0]);

  // Safe normalized language code
  const currentLang = (i18n.language || (typeof localStorage !== 'undefined' ? localStorage.getItem('lang') : 'en') || 'en').slice(0, 2);
  const isMr = currentLang === 'mr';
  const isHi = currentLang === 'hi';

  // Field Reel HUD State: 6-second interval (zero React state thrashing / zero lag)
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIdx((prev) => (prev + 1) % FIELD_REEL_PILOTS.length);
    }, REEL_SLIDE_DURATION);

    return () => clearInterval(timer);
  }, []);

  const activePilot = FIELD_REEL_PILOTS[currentSlideIdx];

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = trackQuery.trim();
    if (!query) return;
    navigate(`/track/${encodeURIComponent(query)}`);
  };

  // Localized Headline Strings
  const headline = useMemo(() => {
    if (isMr) {
      return {
        line1: 'नागरिक गरजेपासून.',
        line2: 'सँडबॉक्स चाचणीपर्यंत.',
        line3: 'राज्यव्यापी विस्तार.',
      };
    }
    if (isHi) {
      return {
        line1: 'नागरिक जरूरत से.',
        line2: 'सैंडबॉक्स पायलट तक.',
        line3: 'राज्यव्यापी विस्तार.',
      };
    }
    return {
      line1: 'FROM CIVIC NEED.',
      line2: 'TO SANDBOX PILOT.',
      line3: 'STATEWIDE SCALE.',
    };
  }, [isMr, isHi]);

  // Localized 11-step array
  const stepsList = useMemo(() => {
    if (isMr) return STATUTORY_STEPS_MR;
    if (isHi) return STATUTORY_STEPS_HI;
    return STATUTORY_STEPS;
  }, [isMr, isHi]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* ========================================================
          1. HERO SECTION (Field-Grade Editorial Aesthetic)
          Modeled after Kabadiwala Connect HeroReel:
          - Saffron leading rule & monospace civic kicker
          - Fluid display headline with outlined text-stroke
          - Field-grade telemetry HUD with corner brackets
          ======================================================== */}
      <section className="relative overflow-hidden pt-8 pb-14 lg:pt-14 lg:pb-20 border-b border-border">
        {/* Ambient atmospheric glow contained within boundary */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center min-w-0">
            {/* Left Column (7 cols): Editorial Typography & Direct Action */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6 min-w-0">
              {/* Civic Kicker with Saffron Rule */}
              <div className="flex items-center gap-3">
                <span className="w-8 h-0.5 bg-accent shrink-0" />
                <span className="font-mono text-xs text-accent uppercase tracking-widest font-bold truncate">
                  {isMr
                    ? 'महाराष्ट्र शासन // SIH २०२६ समस्या ID २६१३६'
                    : isHi
                    ? 'महाराष्ट्र शासन // SIH २०२६ समस्या ID २६१३६'
                    : 'GOVERNMENT OF MAHARASHTRA // SIH 2026 ID 26136'}
                </span>
              </div>

              {/* Bold Fluid Display Headline */}
              <div className="space-y-1 select-none font-display">
                <h1 className="fluid-headline uppercase tracking-tight text-foreground">
                  {headline.line1}
                </h1>
                <div className="fluid-headline uppercase tracking-tight text-stroke">
                  {headline.line2}
                </div>
                <div className="fluid-headline uppercase tracking-tight text-accent">
                  {headline.line3}
                </div>
              </div>

              {/* Marathi/Devanagari Subtitle & Problem Statement Grounding */}
              <div className="p-3 rounded-lg bg-card/80 border border-border text-xs font-mono text-muted-foreground flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 truncate">
                  <StateSeal size="xs" />
                  <span className="font-devanagari font-bold text-foreground">
                    {isMr || isHi ? 'समाधानसेतू' : 'SamadhanSetu'}
                  </span>
                  <span className="text-border">|</span>
                  <span className="truncate">
                    {isMr || isHi
                      ? 'महाराष्ट्र राज्य नाविन्यता समाज (MSInS)'
                      : 'Maharashtra State Innovation Society (MSInS)'}
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold text-accent px-2 py-0.5 rounded bg-accent/15 border border-accent/30 shrink-0 font-mono">
                  DPIIT WAIVER GFR 170
                </span>
              </div>

              {/* Editorial Description */}
              <p className="text-sm sm:text-base text-muted-foreground font-body leading-relaxed max-w-2xl">
                {isMr
                  ? 'महाराष्ट्रातील ३६ जिल्ह्यांतील शासकीय विभागांना परिणाम-आधारित समस्या मांडणे, DPIIT-मान्यताप्राप्त स्टार्टअप्स शोधणे, नियंत्रित सँडबॉक्स पायलट चालवणे, ७ दिवसांत निधी वितरित करणे आणि प्रमाणित तंत्रज्ञानाचा संपूर्ण राज्यात विस्तार करणे शक्य करणारी पारदर्शक, स्पर्धात्मक व कायदेशीर प्रणाली.'
                  : isHi
                  ? 'महाराष्ट्र के ३६ जिलों में सरकारी विभागों को परिणाम-आधारित समस्या विवरण तैयार करने, DPIIT-मान्यता प्राप्त स्टार्टअप खोजने, सुरक्षित सैंडबॉक्स पायलट संचालित करने, ७ दिनों में माइलस्टोन भुगतान जारी करने और GFR नियम १९४ के तहत प्रमाणित तकनीकों को बड़े पैमाने पर लागू करने में सक्षम बनाना।'
                  : 'A transparent, competitive, legally compliant innovation-procurement pathway enabling Maharashtra\'s 36 district departments to formulate outcome-based needs, pilot novel startup technologies in safe-harbour sandboxes, disburse milestone payments in 7 days, and scale validated solutions directly under GFR Rule 194.'}
              </p>

              {/* Primary Action Buttons (Minimum 48px touch target) */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <Link to="/report" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto min-h-[48px] px-6 py-3 bg-accent hover:bg-accent-hover text-accent-foreground font-heading text-sm font-bold uppercase tracking-wider rounded-sm glow-saffron active:scale-95 transition-all cursor-pointer shadow-md gap-2"
                  >
                    <Building2 className="h-4 w-4" />
                    <span>
                      {isMr
                        ? 'विभागीय आव्हान नोंदवा'
                        : isHi
                        ? 'विभागीय चुनौती दर्ज करें'
                        : 'Post Department Challenge'}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <Link to="/problems" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto min-h-[48px] px-5 py-3 bg-card border-border hover:border-accent text-foreground font-mono text-xs uppercase tracking-wider rounded-sm hover:bg-secondary/50 transition cursor-pointer gap-2"
                  >
                    <Rocket className="h-4 w-4 text-accent" />
                    <span>
                      {isMr
                        ? 'आव्हाने शोधा (स्टार्टअप्स)'
                        : isHi
                        ? 'चुनौतियाँ खोजें (स्टार्टअप्स)'
                        : 'Explore Open Challenges'}
                    </span>
                  </Button>
                </Link>

                <Link to="/templates" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="ghost"
                    className="w-full sm:w-auto min-h-[48px] px-4 py-3 text-muted-foreground hover:text-foreground font-mono text-xs uppercase tracking-wider gap-1.5 cursor-pointer"
                  >
                    <FileText className="h-4 w-4 text-accent" />
                    <span>
                      {isMr
                        ? 'प्रमाणित कायदेशीर नमुने'
                        : isHi
                        ? 'मानक कानूनी प्रारूप'
                        : 'Standard Legal Templates'}
                    </span>
                  </Button>
                </Link>
              </div>

              {/* Statutory Trust Assurance Badges */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono text-muted-foreground pt-1 border-t border-border/60">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>
                    {isMr
                      ? 'उलाढाल शिथिलता (GFR 170/173)'
                      : isHi
                      ? 'टर्नओवर छूट (GFR 170/173)'
                      : 'ZERO TURNOVER WAIVER (GFR 170/173)'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-accent" />
                  <span>
                    {isMr ? '७-दिवसीय एस्क्रो हमी' : isHi ? '७-दिवसीय एस्क्रो गारंटी' : '7-DAY ESCROW SLA'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-primary" />
                  <span>
                    {isMr
                      ? 'GFR १९४ थेट खरेदी विस्तार'
                      : isHi
                      ? 'GFR १९४ प्रत्यक्ष खरीद विस्तार'
                      : 'GFR 194 DIRECT SCALE-UP'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column (5 cols): Real-Time Pilot Telemetry HUD (Field Grade) */}
            <div className="lg:col-span-5 min-w-0">
              <div className="relative rounded-sm border-2 border-border bg-card shadow-2xl corner-brackets overflow-hidden">
                {/* HUD Top Bar */}
                <div className="p-3.5 bg-secondary/80 border-b border-border flex items-center justify-between text-xs font-mono">
                  <div className="inline-flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-card border border-border text-accent font-bold text-[10px] tracking-wider">
                      <Radio className="h-3 w-3 animate-pulse text-accent" />
                      <span>{isMr ? 'थेट टेलीमेट्री' : isHi ? 'लाइव टेलीमेट्री' : 'LIVE TELEMETRY'}</span>
                    </span>
                    <span className="text-[10px] font-bold text-foreground truncate max-w-[130px] sm:max-w-[180px]">
                      {isMr ? activePilot.districtMr : isHi ? activePilot.districtHi : activePilot.district}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-accent bg-card px-2 py-0.5 border border-border rounded-xs">
                    0{currentSlideIdx + 1} / 0{FIELD_REEL_PILOTS.length}
                  </span>
                </div>

                {/* HUD Active Dossier Body */}
                <div className="p-5 space-y-4 relative">
                  <div className="scanline absolute inset-0 opacity-40 pointer-events-none" />

                  {/* Stage Pill */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded bg-accent/15 text-accent border border-accent/30">
                      {isMr ? activePilot.stageMr : isHi ? activePilot.stageHi : activePilot.stage}
                    </span>
                    <span className="font-mono text-xs font-black text-foreground">
                      REF: {activePilot.id}
                    </span>
                  </div>

                  {/* Title & Department */}
                  <div>
                    <h3 className="font-heading font-black text-base sm:text-lg text-foreground uppercase tracking-tight line-clamp-2">
                      {isMr ? activePilot.titleMr : isHi ? activePilot.titleHi : activePilot.title}
                    </h3>
                    <p className="font-mono text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                      <Building2 className="h-3 w-3 text-accent shrink-0" />
                      <span className="truncate">
                        {isMr ? activePilot.departmentMr : isHi ? activePilot.departmentHi : activePilot.department}
                      </span>
                    </p>
                  </div>

                  {/* Startup Info Tag */}
                  <div className="p-2.5 rounded bg-secondary/50 border border-border/80 font-mono text-[11px] space-y-1">
                    <div className="text-muted-foreground uppercase text-[10px] font-bold">
                      {isMr ? 'करारबद्ध स्टार्टअप:' : isHi ? 'अनुबंधित स्टार्टअप:' : 'Contracted Startup:'}
                    </div>
                    <div className="text-foreground font-semibold truncate">{activePilot.startup}</div>
                  </div>

                  {/* Telemetry Metric Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded bg-card border border-border space-y-1">
                      <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground font-bold">
                        {isMr ? activePilot.metricLabelMr : isHi ? activePilot.metricLabelHi : activePilot.metricLabel}
                      </div>
                      <div className="font-display text-2xl font-black text-emerald-500 tracking-tight">
                        {activePilot.metricValue}
                      </div>
                      <div className="font-mono text-[10px] text-muted-foreground">
                        {isMr ? 'VJTI ऑडिटद्वारे प्रमाणित' : isHi ? 'VJTI ऑडिट द्वारा प्रमाणित' : 'Certified by VJTI Audit'}
                      </div>
                    </div>

                    <div className="p-3 rounded bg-card border border-border space-y-1">
                      <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground font-bold">
                        {isMr ? 'एस्क्रो पायलट अनुदान' : isHi ? 'एस्क्रो पायलट अनुदान' : 'ESCROW PILOT GRANT'}
                      </div>
                      <div className="font-display text-2xl font-black text-accent tracking-tight">
                        {activePilot.budget}
                      </div>
                      <div className="font-mono text-[10px] text-muted-foreground">
                        {isMr ? activePilot.turnaroundMr : isHi ? activePilot.turnaroundHi : activePilot.turnaround}
                      </div>
                    </div>
                  </div>

                  {/* Scale Pathway Tag */}
                  <div className="flex items-center justify-between text-xs font-mono pt-1">
                    <span className="text-muted-foreground text-[10px]">
                      {isMr ? 'स्केल-अप निकाल:' : isHi ? 'स्केल-अप निर्णय:' : 'SCALE-UP VERDICT:'}
                    </span>
                    <span className="text-emerald-500 font-bold text-[11px]">
                      {isMr ? activePilot.scalePathwayMr : isHi ? activePilot.scalePathwayHi : activePilot.scalePathway}
                    </span>
                  </div>
                </div>

                {/* HUD Bottom Bar with Hardware-Accelerated Progress Line */}
                <div className="p-3 bg-secondary/90 border-t border-border space-y-2">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-[10px] text-muted-foreground uppercase">
                      {isMr ? 'टेलीमेट्री मेश: ' : isHi ? 'टेलीमेट्री मेश: ' : 'TELEMETRY MESH: '}
                      {activePilot.codePattern}
                    </span>
                    <Link
                      to={`/track/${activePilot.id}`}
                      className="text-[11px] font-bold text-accent hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isMr ? 'डॉकेट तपासा' : isHi ? 'डॉसियर देखें' : 'INSPECT DOSSIER'}</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>

                  {/* Progress Line with pure CSS GPU Keyframe */}
                  <div className="w-full h-1 bg-border rounded-full overflow-hidden">
                    <div
                      key={currentSlideIdx}
                      className="h-full bg-accent animate-progress-strip"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. PROVEN IMPACT STATS STRIP (2x2 Mobile, 4 Cols Desktop)
          With corner-brackets, count-up numbers & statutory units
          ======================================================== */}
      <section className="py-10 sm:py-14 bg-secondary/20 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Marker */}
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <span className="w-8 h-0.5 bg-accent" />
            <span className="font-mono text-xs text-accent tracking-widest uppercase font-bold">
              {isMr
                ? '०१ // राज्यव्यापी सँडबॉक्स उपलब्धी व टेलीमेट्री'
                : isHi
                ? '०१ // राज्यव्यापी सैंडबॉक्स उपलब्धियां एवं टेलीमेट्री'
                : '01 // STATEWIDE SANDBOX GAINS & TELEMETRY'}
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 min-w-0">
            {/* Stat 1 */}
            <div className="relative p-5 sm:p-6 bg-card border border-border corner-brackets space-y-2">
              <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground uppercase font-bold">
                <span>{isMr ? 'नाविन्यता कक्ष' : isHi ? 'नवाचार डेस्क' : 'INNOVATION DESKS'}</span>
                <span className="text-emerald-500 font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  100% ONLINE
                </span>
              </div>
              <div className="font-display text-3xl sm:text-4xl text-foreground font-black tracking-tight">
                <AnimatedStatCounter value={36} suffix={isMr ? ' जिल्हे' : isHi ? ' जिले' : ' DISTRICTS'} />
              </div>
              <p className="font-mono text-xs text-muted-foreground">
                {isMr
                  ? 'महाराष्ट्रातील सर्व ३६ जिल्ह्यांत सक्रिय कक्ष'
                  : isHi
                  ? 'महाराष्ट्र के सभी ३६ जिलों में सक्रिय सेल'
                  : 'Active Department Innovation Cells Across Maharashtra'}
              </p>
            </div>

            {/* Stat 2 */}
            <div className="relative p-5 sm:p-6 bg-card border border-border corner-brackets space-y-2">
              <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground uppercase font-bold">
                <span>{isMr ? 'वितरित एस्क्रो निधी' : isHi ? 'संवितरित एस्क्रो अनुदान' : 'PILOT ESCROW DISBURSED'}</span>
                <span className="text-accent font-bold px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20">
                  {isMr || isHi ? 'शून्य विलंब' : 'ZERO DELAY'}
                </span>
              </div>
              <div className="font-display text-3xl sm:text-4xl text-foreground font-black tracking-tight">
                {isMr ? '₹४.२ कोटी' : isHi ? '₹४.२ करोड़' : '₹4.2 CRORE'}
              </div>
              <p className="font-mono text-xs text-muted-foreground">
                {isMr
                  ? 'DPIIT स्टार्टअप्सना वितरित केलेले थेट अनुदान'
                  : isHi
                  ? 'DPIIT स्टार्टअप्स को संवितरित प्रत्यक्ष अनुदान'
                  : 'Direct Milestone Grants Released to DPIIT Startups'}
              </p>
            </div>

            {/* Stat 3 */}
            <div className="relative p-5 sm:p-6 bg-card border border-border corner-brackets space-y-2">
              <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground uppercase font-bold">
                <span>{isMr ? 'सरासरी पायलट कालावधी' : isHi ? 'औसत पायलट अवधि' : 'AVG PILOT DURATION'}</span>
                <span className="text-primary font-bold px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20">
                  GFR SLA
                </span>
              </div>
              <div className="font-display text-3xl sm:text-4xl text-foreground font-black tracking-tight">
                <AnimatedStatCounter value={42} suffix={isMr ? ' दिवस' : isHi ? ' दिन' : ' DAYS'} />
              </div>
              <p className="font-mono text-xs text-muted-foreground">
                {isMr
                  ? 'सँडबॉक्स चाचणी ते वैधानिक तपासणी (लक्ष्य: ४५ दिवस)'
                  : isHi
                  ? 'सैंडबॉक्स परीक्षण से वैधानिक ऑडिट (लक्ष्य: ४५ दिन)'
                  : 'Sandbox Testing to Statutory Audit (Target: 45 Days)'}
              </p>
            </div>

            {/* Stat 4 */}
            <div className="relative p-5 sm:p-6 bg-card border border-border corner-brackets space-y-2">
              <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground uppercase font-bold">
                <span>{isMr ? 'स्केल-अप यश दर' : isHi ? 'स्केल-अप सफलता दर' : 'SCALE-UP SUCCESS'}</span>
                <span className="text-emerald-500 font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  GFR 194
                </span>
              </div>
              <div className="font-display text-3xl sm:text-4xl text-foreground font-black tracking-tight">
                81.4%
              </div>
              <p className="font-mono text-xs text-muted-foreground">
                {isMr
                  ? 'थेट खरेदी किंवा GeM मध्ये अपग्रेड झालेले पायलट'
                  : isHi
                  ? 'विभागीय खरीद या GeM में अपग्रेड हुए पायलट'
                  : 'Pilots Transitioned to Direct Procurement or GeM'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. DOCKET TRACKER LOOKUP BAR (Monospace Field Bar)
          ======================================================== */}
      <section className="py-8 bg-card border-b border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-0.5 bg-accent" />
            <span className="font-mono text-xs text-accent tracking-widest uppercase font-bold">
              {isMr
                ? '०२ // पायलट डॉकेट तपासणी'
                : isHi
                ? '०२ // पायलट डॉसियर निरीक्षण'
                : '02 // PILOT DOCKET INSPECTION'}
            </span>
          </div>

          <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                value={trackQuery}
                onChange={(e) => setTrackQuery(e.target.value)}
                placeholder={
                  isMr
                    ? 'कोणतेही आव्हान किंवा पायलट संदर्भ कोड शोधा (उदा. SS-2026-001043)...'
                    : isHi
                    ? 'कोई भी चुनौती या पायलट संदर्भ कोड खोजें (उदा. SS-2026-001043)...'
                    : 'Track any pilot or challenge (e.g. SS-2026-001043 or SS-2026-001042)...'
                }
                className="pl-10 h-12 text-xs sm:text-sm bg-secondary/50 border-border font-mono rounded-sm focus-visible:ring-accent"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto h-12 px-6 font-bold cursor-pointer bg-primary text-white hover:bg-primary-hover rounded-sm uppercase font-heading text-xs tracking-wider"
            >
              <span>{isMr ? 'डॉकेट तपासा' : isHi ? 'डॉसियर देखें' : 'Inspect Docket'}</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </form>

          {/* Quick-select chips */}
          <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted-foreground font-mono text-[11px] uppercase font-bold">
              {isMr ? 'त्वरित पायलट:' : isHi ? 'त्वरित पायलट:' : 'Quick Pilots:'}
            </span>
            {FIELD_REEL_PILOTS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => navigate(`/track/${p.id}`)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-secondary border border-border text-[11px] font-mono text-foreground hover:border-accent hover:text-accent transition-colors cursor-pointer"
              >
                <Activity className="h-3 w-3 text-accent" />
                <span>{p.id}</span>
                <span className="text-muted-foreground truncate max-w-[120px]">
                  ({isMr ? p.districtMr : isHi ? p.districtHi : p.district})
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          4. DUAL GATEWAY ARCHITECTURE CARDS
          Demand Side (Government) vs Supply Side (Startups)
          ======================================================== */}
      <section className="py-14 sm:py-20 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-0.5 bg-accent" />
            <span className="font-mono text-xs text-accent tracking-widest uppercase font-bold">
              {isMr
                ? '०३ // दुहेरी प्रवेशद्वार संरचना'
                : isHi
                ? '०३ // दोहरे प्रवेश द्वार की संरचना'
                : '03 // DUAL GATEWAY ARCHITECTURE'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="font-display text-3xl sm:text-5xl text-foreground uppercase tracking-tight">
                {isMr
                  ? 'सार्वजनिक क्षेत्रातील नाविन्यतेचे दोन प्रवेशद्वार'
                  : isHi
                  ? 'सार्वजनिक क्षेत्र के नवाचार के दो प्रवेश द्वार'
                  : 'TWO GATEWAYS TO PUBLIC INNOVATION'}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-2xl font-body">
                {isMr
                  ? 'उपाय शोधणारे शासकीय विभाग आणि प्रत्यक्ष अंमलबजावणीस सज्ज स्टार्टअप्स यांच्यासाठी विशेष कार्यप्रणाली.'
                  : isHi
                  ? 'समाधान चाहने वाले विभागों और तैनात करने के लिए तैयार स्टार्टअप्स के लिए उद्देश्य-निर्मित वर्कफ़्लो।'
                  : 'Purpose-built workflows for government departments seeking outcome-driven technologies and innovative startups ready to deploy in real public infrastructure.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
            {/* Department Gateway (Solid Dense Working Surface) */}
            <div className="relative rounded-sm bg-card border-2 border-border p-6 sm:p-8 flex flex-col justify-between corner-brackets hover:border-accent/60 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-wider text-accent bg-accent/15 px-2.5 py-1 rounded-xs border border-accent/30 font-mono">
                    {isMr ? 'मागणी बाजू // शासकीय खरेदीदार' : isHi ? 'मांग पक्ष // सरकारी क्रेता' : 'DEMAND SIDE // GOVERNMENT BUYER'}
                  </span>
                  <Building2 className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-heading text-xl sm:text-2xl font-black text-foreground uppercase tracking-tight">
                  {isMr ? 'शासकीय विभागांसाठी' : isHi ? 'सरकारी विभागों के लिए' : 'For Government Departments'}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed font-body">
                  {isMr
                    ? 'प्रमाणित कायदेशीर नमुन्यांसह परिणाम-आधारित आव्हाने तयार करा, तज्ज्ञ समितीद्वारे प्रस्तावांचे मूल्यांकन करा आणि सुरक्षित सँडबॉक्स पायलट राबवा.'
                    : isHi
                    ? 'पूर्व-परीक्षित कानूनी प्रारूपों के साथ परिणाम-आधारित चुनौतियाँ तैयार करें, विशेषज्ञ पैनलों के साथ समाधानों का मूल्यांकन करें और जोखिम-प्रबंधित सैंडबॉक्स पायलट चलाएँ।'
                    : 'Formulate outcome-based challenges with pre-vetted legal templates, evaluate innovative solutions with expert panels, and run risk-managed sandbox pilots.'}
                </p>

                <ul className="mt-6 space-y-3 text-xs text-foreground/90 font-mono">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      {isMr
                        ? 'तयार परिणाम-आधारित समस्या व त्रिपक्षीय पायलट नमुने'
                        : isHi
                        ? 'पूर्व-निर्मित समस्या विवरण व त्रिपक्षीय पायलट प्रारूप'
                        : 'Pre-built outcome statements & tripartite legal pilot templates'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      {isMr
                        ? 'प्रकाशनपूर्व स्वयंचलित आव्हान गुणवत्ता स्कोअरिंग (०–१००)'
                        : isHi
                        ? 'प्रकाशन से पहले स्वचालित चुनौती गुणवत्ता स्कोरिंग (०–१००)'
                        : 'Automated Challenge Quality scoring (0–100) before publication'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      {isMr
                        ? '१०,०००+ DPIIT मान्यताप्राप्त स्टार्टअप्सशी थेट जोडणी'
                        : isHi
                        ? '१०,०००+ DPIIT मान्यता प्राप्त स्टार्टअप्स तक सीधी पहुंच'
                        : 'Direct access to 10,000+ DPIIT-recognized startups'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      {isMr
                        ? '७-दिवसीय एस्क्रो देयक हमीसह टप्पानिहाय करार'
                        : isHi
                        ? '७-दिवसीय एस्क्रो भुगतान गारंटी के साथ माइलस्टोन अनुबंध'
                        : 'Milestone-based contracting with 7-day escrow release safeguards'}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <Link to="/report">
                  <Button className="w-full min-h-[46px] font-bold text-xs uppercase tracking-wider bg-accent hover:bg-accent-hover text-accent-foreground cursor-pointer rounded-sm">
                    <span>
                      {isMr ? 'विभागीय आव्हान नोंदवा' : isHi ? 'विभागीय चुनौती दर्ज करें' : 'Post a Department Challenge'}
                    </span>
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Startup Gateway (Solid Dense Working Surface) */}
            <div className="relative rounded-sm bg-card border-2 border-border p-6 sm:p-8 flex flex-col justify-between corner-brackets hover:border-primary/60 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-xs border border-primary/20 font-mono">
                    {isMr ? 'पुरवठा बाजू // स्टार्टअप उपायकर्ता' : isHi ? 'आपूर्ति पक्ष // नवोन्मेषी स्टार्टअप' : 'SUPPLY SIDE // STARTUP SOLVER'}
                  </span>
                  <Rocket className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading text-xl sm:text-2xl font-black text-foreground uppercase tracking-tight">
                  {isMr ? 'नाविन्यपूर्ण स्टार्टअप्ससाठी' : isHi ? 'नवोन्मेषी स्टार्टअप्स के लिए' : 'For Innovative Startups'}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed font-body">
                  {isMr
                    ? 'DPIIT शिथिलतेमुळे उलाढाल/अनुभव अटींची अडचण नाही; थेट शासकीय पायलट मिळवा, खात्रीशीर देयके मिळवा आणि संपूर्ण राज्यात विस्तार करा.'
                    : isHi
                    ? 'DPIIT छूट नियमों के साथ टर्नओवर/अनुभव बाधाओं को पार करें, सरकारी पायलटों के लिए बोली लगाएं, गारंटीकृत भुगतान प्राप्त करें और राज्य भर में विस्तार करें।'
                    : 'Overcome turnover and experience barriers with statutory DPIIT relaxation rules, bid for structured government pilots, receive guaranteed milestone escrow payments, and scale statewide.'}
                </p>

                <ul className="mt-6 space-y-3 text-xs text-foreground/90 font-mono">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      {isMr
                        ? 'GFR १७०/१७३ अन्वये पूर्व उलाढाल/अनुभव दंड नाही'
                        : isHi
                        ? 'GFR १७०/१७३ के तहत पूर्व टर्नओवर/अनुभव की कोई अनिवार्यता नहीं'
                        : 'Zero prior turnover/experience penalty under GFR Rule 170/173'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      {isMr
                        ? 'वस्तुनिष्ठ, ५-मितीय बहु-तज्ज्ञ भारित मूल्यांकन'
                        : isHi
                        ? 'वस्तुनिष्ठ, ५-आयामी बहु-विशेषज्ञ भारित स्कोरिंग'
                        : 'Objective, multi-expert weighted scoring matrix (5 dimensions)'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      {isMr
                        ? 'सुरक्षित बौद्धिक संपदा (IP) व सँडबॉक्स संरक्षण अटी'
                        : isHi
                        ? 'सुरक्षित बौद्धिक संपदा (IP) एवं सैंडबॉक्स संरक्षण शर्तें'
                        : 'Protected intellectual property & sandbox safe-harbour clauses'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      {isMr
                        ? 'GFR १९४ थेट खरेदी किंवा GeM स्टार्टअप रनवे थेट विस्तार'
                        : isHi
                        ? 'GFR १९४ प्रत्यक्ष खरीद या GeM स्टार्टअप रनवे सीधा विस्तार'
                        : 'Fast-track GFR 194 direct scale or GeM Startup Runway export'}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <Link to="/problems">
                  <Button className="w-full min-h-[46px] font-bold text-xs uppercase tracking-wider cursor-pointer bg-primary hover:bg-primary-hover text-white rounded-sm">
                    <span>
                      {isMr ? 'आव्हाने शोधा' : isHi ? 'चुनौतियाँ देखें' : 'Explore Open Challenges'}
                    </span>
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. THE 11-STAGE STATUTORY PROCUREMENT PATHWAY
          ======================================================== */}
      <section className="py-14 sm:py-20 bg-secondary/20 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-0.5 bg-accent" />
            <span className="font-mono text-xs text-accent tracking-widest uppercase font-bold">
              {isMr
                ? '०४ // वैधानिक नाविन्यता जीवनचक्र'
                : isHi
                ? '०४ // वैधानिक नवाचार जीवनचक्र'
                : '04 // STATUTORY INNOVATION LIFECYCLE'}
            </span>
          </div>

          <div className="max-w-3xl mb-10">
            <h2 className="font-display text-3xl sm:text-5xl text-foreground uppercase tracking-tight">
              {isMr
                ? '११-टप्प्यांची वैधानिक खरेदी प्रक्रिया'
                : isHi
                ? '११-चरणीय वैधानिक अधिप्राप्ति मार्ग'
                : '11-STAGE STATUTORY PROCUREMENT PATHWAY'}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 font-body">
              {isMr
                ? 'समस्या मांडणीपासून ते पुनर्खरेदी निविदेविना राज्यव्यापी खरेदी कंत्राटापर्यंतचा पारदर्शक आणि कायदेशीर मार्ग.'
                : isHi
                ? 'प्रारंभिक समस्या निर्धारण से लेकर बिना दोबारा निविदा के राज्यव्यापी खरीद तक एक कानूनी रूप से सुदृढ़, पारदर्शी मार्ग।'
                : 'A legally compliant, audit-transparent route from initial problem framing to statewide procurement without repeat public bidding.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {stepsList.map((st) => (
              <div
                key={st.step}
                className="relative rounded-sm bg-card border border-border p-4.5 hover:border-accent/50 hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-black text-accent px-1.5 py-0.5 rounded-xs bg-accent/15 border border-accent/25">
                      {isMr ? `टप्पा ${st.step}` : isHi ? `चरण ${st.step}` : `STAGE ${st.step}`}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-foreground font-heading uppercase">{st.title}</h4>
                  <p className="text-[11px] text-muted-foreground mt-1.5 leading-snug font-body">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          6. 36-DISTRICT FIELD TELEMETRY HUBS
          ======================================================== */}
      <section className="py-14 sm:py-20 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-0.5 bg-accent" />
            <span className="font-mono text-xs text-accent tracking-widest uppercase font-bold">
              {isMr
                ? '०५ // राज्यव्यापी रडार'
                : isHi
                ? '०५ // राज्यव्यापी रडार'
                : '05 // STATEWIDE FIELD RADAR'}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="font-display text-3xl sm:text-5xl text-foreground uppercase tracking-tight">
                {isMr
                  ? '३६ जिल्हा नाविन्यता कक्ष'
                  : isHi
                  ? '३६ जिला नवाचार डेस्क'
                  : '36 DISTRICT INNOVATION DESKS'}
              </h2>
              <p className="text-xs text-muted-foreground mt-1 font-body">
                {isMr
                  ? 'महाराष्ट्रातील थेट पायलट टेलीमेट्री, सरासरी कालावधी आणि यश दर.'
                  : isHi
                  ? 'महाराष्ट्र भर में लाइव पायलट टेलीमेट्री, टर्नअराउंड मेट्रिक्स और स्केल-अप दरें।'
                  : 'Live pilot telemetry, turnaround metrics, and scale-up graduation rates across Maharashtra.'}
              </p>
            </div>
            <Link to="/dashboard/analytics">
              <Button variant="outline" size="sm" className="text-xs font-mono uppercase tracking-wider font-bold gap-1.5 cursor-pointer border-border hover:border-accent">
                <span>{isMr ? 'संपूर्ण विश्लेषण पहा' : isHi ? 'पूर्ण एनालिटिक्स देखें' : 'View Full Telemetry Analytics'}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          {/* District selector pills */}
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none">
            {MAHARASHTRA_DISTRICT_HUBS.map((hub) => (
              <button
                key={hub.id}
                type="button"
                onClick={() => setSelectedHub(hub)}
                className={cn(
                  'px-3.5 py-2 rounded-xs text-xs font-mono uppercase tracking-wider font-semibold whitespace-nowrap transition-all cursor-pointer border flex items-center gap-2',
                  selectedHub.id === hub.id
                    ? 'bg-accent text-accent-foreground border-accent font-bold shadow-xs'
                    : 'bg-card text-muted-foreground hover:text-foreground border-border'
                )}
              >
                <span>{hub.name}</span>
                <span className="text-[11px] font-devanagari opacity-90">({hub.marathi})</span>
              </button>
            ))}
          </div>

          {/* Selected District Telemetry Card (Solid Dense Surface with Corner Brackets) */}
          <div className="rounded-sm bg-card p-6 sm:p-8 mt-4 border-2 border-border corner-brackets">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="text-xl sm:text-2xl font-black text-foreground font-heading uppercase">
                    {selectedHub.name} ({selectedHub.marathi})
                  </h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-xs bg-primary/10 text-primary font-bold border border-primary/20 font-mono">
                    {isMr ? selectedHub.tagMr : isHi ? selectedHub.tagHi : selectedHub.tag}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-mono">
                  {isMr ? 'नोडल अधिकारी: ' : isHi ? 'नोडल अधिकारी: ' : 'NODAL AUTHORITY: '}
                  <strong className="text-foreground">
                    {isMr ? selectedHub.nodalSecretaryMr : isHi ? selectedHub.nodalSecretaryHi : selectedHub.nodalSecretary}
                  </strong>
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div>
                  <div className="text-[10px] uppercase font-bold text-muted-foreground font-mono">
                    {isMr ? 'सक्रिय आव्हाने' : isHi ? 'सक्रिय चुनौतियाँ' : 'ACTIVE CHALLENGES'}
                  </div>
                  <div className="text-2xl sm:text-3xl font-black font-display text-foreground tabular-nums">
                    <AnimatedStatCounter value={selectedHub.activeChallenges} />
                  </div>
                </div>
                <div className="h-8 w-[1px] bg-border" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-muted-foreground font-mono">
                    {isMr ? 'सक्रिय पायलट' : isHi ? 'सक्रिय पायलट' : 'PILOTS RUNNING'}
                  </div>
                  <div className="text-2xl sm:text-3xl font-black font-display text-accent tabular-nums">
                    <AnimatedStatCounter value={selectedHub.pilotsRunning} />
                  </div>
                </div>
                <div className="h-8 w-[1px] bg-border" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-muted-foreground font-mono">
                    {isMr ? 'स्केल-अप दर' : isHi ? 'स्केल-अप दर' : 'SCALE-UP RATE'}
                  </div>
                  <div className="text-2xl sm:text-3xl font-black font-display text-emerald-500 tabular-nums">
                    {selectedHub.scaledRate}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 text-xs font-mono">
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
                  {isMr ? 'प्रमुख क्षेत्राचे लक्ष' : isHi ? 'प्रमुख क्षेत्रीय ध्यान' : 'PRIMARY SECTORAL FOCUS'}
                </span>
                <p className="text-foreground font-medium leading-relaxed font-body text-xs">
                  {isMr ? selectedHub.primaryFocusMr : isHi ? selectedHub.primaryFocusHi : selectedHub.primaryFocus}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
                  {isMr ? 'सरासरी सँडबॉक्स कालावधी' : isHi ? 'औसत सैंडबॉक्स अवधि' : 'AVERAGE SANDBOX PILOT TURNAROUND'}
                </span>
                <p className="text-foreground font-bold text-sm">
                  {isMr ? selectedHub.avgTurnaroundMr : isHi ? selectedHub.avgTurnaroundHi : selectedHub.avgTurnaround}{' '}
                  <span className="text-muted-foreground font-normal">
                    {isMr ? '(वैधानिक लक्ष्य: ४५ दिवस)' : isHi ? '(वैधानिक लक्ष्य: ४५ दिन)' : '(Statutory Target: 45 Days)'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          7. RECENT SCALED PILOTS SHOWCASE (Field Evidence)
          ======================================================== */}
      <section className="py-14 sm:py-20 bg-secondary/15">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-0.5 bg-accent" />
            <span className="font-mono text-xs text-accent tracking-widest uppercase font-bold">
              {isMr
                ? '०६ // यशस्वी पुरावे'
                : isHi
                ? '०६ // सफल प्रमाण'
                : '06 // GRADUATED FIELD EVIDENCE'}
            </span>
          </div>

          <div className="text-left max-w-2xl mb-10">
            <h2 className="font-display text-3xl sm:text-5xl text-foreground uppercase tracking-tight">
              {isMr
                ? 'महाराष्ट्रात नुकतेच यशस्वी झालेले पायलट'
                : isHi
                ? 'महाराष्ट्र में हाल ही में स्केल किए गए नवाचार'
                : 'RECENT SCALED PILOTS IN MAHARASHTRA'}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 font-body">
              {isMr
                ? 'सँडबॉक्स चाचणी यशस्वीरीत्या पूर्ण करून राज्य सार्वजनिक खरेदी आदेशांमध्ये अपग्रेड झालेले तंत्रज्ञान उपाय.'
                : isHi
                ? 'स्टार्टअप्स जिन्होंने सैंडबॉक्स परीक्षण को सफलतापूर्वक पूरा कर राज्य सार्वजनिक खरीद आदेशों में अपग्रेड किया है।'
                : 'Startups that successfully graduated through sandbox testing into statewide public procurement orders.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {RECENT_SCALED_PILOTS.map((pilot) => (
              <div
                key={pilot.id}
                className="rounded-sm bg-card border border-border p-5 flex flex-col justify-between corner-brackets hover:border-accent/60 transition-all space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-xs border border-primary/20">
                      {pilot.id}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-accent">₹{pilot.budgetLakhs}L</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-foreground font-heading uppercase line-clamp-2">
                    {isMr ? pilot.titleMr : isHi ? pilot.titleHi : pilot.title}
                  </h4>
                  <div className="text-[11px] text-muted-foreground font-mono">
                    {isMr ? pilot.departmentMr : isHi ? pilot.departmentHi : pilot.department} •{' '}
                    <strong className="text-foreground">{isMr ? pilot.districtMr : isHi ? pilot.districtHi : pilot.district}</strong>
                  </div>
                  <div className="p-3 rounded bg-secondary text-[11px] text-foreground font-mono leading-relaxed border border-border/80">
                    <div className="text-[9px] uppercase font-bold text-muted-foreground mb-0.5">
                      {isMr ? 'प्रमाणित निकाल:' : isHi ? 'प्रमाणित परिणाम:' : 'VALIDATED OUTCOME:'}
                    </div>
                    {isMr ? pilot.validatedOutcomeMr : isHi ? pilot.validatedOutcomeHi : pilot.validatedOutcome}
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-500 font-mono">
                    {isMr ? pilot.scalePathwayMr : isHi ? pilot.scalePathwayHi : pilot.scalePathway}
                  </span>
                  <Link
                    to={`/track/${pilot.id}`}
                    className="text-xs font-mono uppercase font-bold text-accent hover:underline flex items-center gap-1"
                  >
                    <span>{isMr ? 'तपासा' : isHi ? 'देखें' : 'INSPECT'}</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
