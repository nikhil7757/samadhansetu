/**
 * Standard Innovation Procurement Template Library (Client Side)
 * Government of Maharashtra — Maharashtra State Innovation Society (MSInS)
 * Standardizes legal, technical, and commercial agreements for public startup procurement.
 */

export interface StandardTemplate {
  id: string;
  type: string;
  title: string;
  version: string;
  category: string;
  summary: string;
  content: string;
}

export const STANDARD_TEMPLATES: StandardTemplate[] = [
  {
    id: 'tpl-outcome-statement',
    type: 'PROBLEM_STATEMENT',
    title: 'Outcome-Based Problem Statement Formulation Template',
    version: 'v2.1',
    category: 'Intake & Discovery',
    summary: 'Standard template for government departments to define civic challenges by measurable outcomes and KPIs rather than proprietary hardware/software specifications.',
    content: `# Outcome-Based Problem Statement Template
**Department / Directorate**: [Insert Department Name, e.g., Public Health Department]
**Issuing Authority**: [Designation of Nodal Officer]
**Target District(s)**: [Select from Maharashtra 36 Districts]

---

### 1. The Operational Bottleneck
*Describe the operational or civic failure without prescribing technology brands.*
- **Current Baseline**: [e.g., 68% of smallholder farmers report crop pest damage after visual symptoms appear, causing 35% crop loss.]
- **Affected Beneficiaries**: [e.g., Over 45,000 cotton farmers in Vidarbha / Marathwada clusters.]
- **Existing Stopgap Measures**: [e.g., Manual field inspection by taluka agriculture extension officers every 14 days.]

---

### 2. Desired Measurable Outcomes (The "What", Not "How")
- **Target Metric 1**: [e.g., 40% reduction in pesticide expenditure through early micro-infestation alerts.]
- **Target Metric 2**: [e.g., Detection lead-time of at least 48 hours prior to visible leaf necrosis.]
- **Target Metric 3**: [e.g., Field solution operational without reliable 4G connectivity (offline edge processing).]

---

### 3. Sandbox Pilot Constraints
- **Pilot Duration**: 6 Months (inclusive of monsoon season field test).
- **Target Cohort**: 500 farmer plots across 5 designated cluster talukas.
- **Estimated Pilot Grant**: ₹15.00 Lakhs (inclusive of equipment, cloud, and field validation costs).
- **Data Protection & Privacy**: Level 2 (Internal Agronomic & Geo-coordinates, no sensitive biometric data).
- **Intellectual Property**: Startup retains core proprietary algorithms; Government receives perpetual non-exclusive deployment license for departmental use.
`,
  },
  {
    id: 'tpl-evaluation-matrix',
    type: 'EVALUATION_MATRIX',
    title: 'Multi-Criteria Expert Evaluation & Scoring Matrix',
    version: 'v1.4',
    category: 'Evaluation & Screening',
    summary: 'Weighted 100-point scoring matrix used by MSInS expert panels to objectively evaluate startup proposals, eliminating arbitrary discretion.',
    content: `# Proposal Evaluation & Scoring Matrix
**Challenge Ref**: [NS-YYYY-NNNNNN]
**Evaluator Name & Panel**: [Panel Member Name & Department]

| Criterion | Max Score | Evaluation Focus | Recommended Weight |
| :--- | :---: | :--- | :---: |
| **1. Innovation & Novelty** | 20 | Uniqueness of technical solution, departure from incumbent legacy tech, patent status or proprietary algorithms. | 20% |
| **2. Technical Feasibility & Methodology** | 20 | Soundness of engineering approach, TRL verification (TRL 5+), edge/offline resilience, integration readiness with govt systems. | 20% |
| **3. Team Competence & Capability** | 20 | Domain expertise, prior prototype deployments, academic/engineering background, startup team composition. | 20% |
| **4. Cost Competitiveness & Value for Money** | 15 | Realism of pilot budget breakdown, post-pilot scaling unit economics, departmental cost savings. | 15% |
| **5. Data Security & Cyber Compliance** | 10 | Adherence to CERT-In guidelines, data residency in India, encryption standards (AES-256), role-based access. | 10% |
| **6. Scalability & Replication Potential** | 15 | Feasibility of statewide rollout across Maharashtra's 36 districts, minimal dependency on bespoke hardware. | 15% |
| **Total Weighted Score** | **100** | **Minimum Threshold for Sandbox Pilot Award: 75/100** | **100%** |
`,
  },
  {
    id: 'tpl-pilot-agreement',
    type: 'PILOT_AGREEMENT',
    title: 'Standard Tripartite Sandbox Pilot Agreement',
    version: 'v3.0',
    category: 'Contracting & Legal',
    summary: 'Statutory pilot testing agreement between Department, Startup, and MSInS with clear milestone gates, escrow payments, and non-liability sandbox protections.',
    content: `# Tripartite Sandbox Pilot Agreement
**Agreement Reference**: [AGR-MSINS-YYYY-NNN]

**BETWEEN**:
1. **The Governor of Maharashtra**, acting through the [Department Name], Government of Maharashtra (hereinafter "Department");
2. **Maharashtra State Innovation Society** (hereinafter "MSInS / Sandbox Facilitator");
3. **[Startup Legal Entity Name]**, incorporated under the Companies Act, 2013 and holding DPIIT Certificate [DPIIT-MH-XXXX-XXXX] (hereinafter "Startup").

---

### Article 1: Sandbox Scope & Milestones
1.1 The Startup agrees to deploy its innovative prototype within the designated test sandbox for a period of [X] months.
1.2 The total pilot grant of ₹[Amount] Lakhs shall be disbursed strictly in accordance with verified milestone completion:
- **Milestone 1 (20%)**: Sandbox architecture blueprint & sandbox integration sign-off.
- **Milestone 2 (40%)**: Live field deployment, sensor integration, and mid-term operational telemetry.
- **Milestone 3 (40%)**: Final independent validation certification and pilot outcome report.

---

### Article 2: Timely Payment Assurance & SLA
2.1 Upon independent validation of each milestone deliverable, the Department shall approve the payment voucher within **7 business days**.
2.2 If the voucher is not processed within 14 calendar days of validator certification, the NavSetu automated escalation engine shall notify the Principal Secretary and MSInS Chief Executive Officer.

---

### Article 3: Sandbox Safe Harbour
3.1 The pilot is conducted in an experimental sandbox environment. No liquidated damages or performance penalties shall attach to technological failure, provided the Startup adhered in good faith to test protocols.
`,
  },
  {
    id: 'tpl-ip-data-clauses',
    type: 'IP_DATA_CLAUSES',
    title: 'Intellectual Property & Government Data Protection Clauses',
    version: 'v2.0',
    category: 'Contracting & Legal',
    summary: 'Balanced IP clauses guaranteeing that startups retain background and foreground IP, while the government receives a perpetual, royalty-free license for public welfare deployment.',
    content: `# Intellectual Property & Data Ownership Clauses

### Clause 1: Background Intellectual Property
1.1 Each party shall remain the sole and exclusive owner of its Background IP developed prior to or independently of this Sandbox Pilot Agreement.
1.2 The Startup's underlying proprietary algorithms, model weights, trade secrets, and software codebase shall remain the exclusive property of the Startup.

### Clause 2: Foreground IP & Government License
2.1 All new patentable inventions or domain customizations created exclusively by the Startup during the pilot shall belong to the Startup.
2.2 The Startup hereby grants to the Government of Maharashtra a **perpetual, irrevocable, non-exclusive, royalty-free, worldwide license** to use, execute, display, and operate the resulting technology across all state departments, municipal corporations, and zilla parishads.

### Clause 3: Government Data Sovereignty & Protection
3.1 All citizen data, departmental records, spatial datasets, and operational telemetry generated during the pilot remain the sovereign property of the Government of Maharashtra.
3.2 The Startup shall not commercialize, sell, transfer, or store government data outside the sovereign boundaries of India (data localization compliance).
`,
  },
  {
    id: 'tpl-cybersecurity',
    type: 'CYBERSECURITY',
    title: 'Cybersecurity & Information Security Baseline Requirements',
    version: 'v1.2',
    category: 'Technical Compliance',
    summary: 'Mandatory technical security baseline for software, cloud architecture, APIs, and edge devices deployed in government sandbox pilots.',
    content: `# Cybersecurity & Information Security Baseline

### 1. Data Encryption Standards
- **Data in Transit**: Mandatory TLS 1.3 encryption across all public and inter-service endpoints.
- **Data at Rest**: AES-256 encryption for all database volumes, object storage, and disk partitions storing citizen or department data.

### 2. Authentication & Access Governance
- Role-Based Access Control (RBAC) with least privilege principle.
- Multi-Factor Authentication (MFA) required for all administrative access.
- Temporary sandbox API keys must have automated 90-day key rotation.

### 3. Vulnerability Assessment & Penetration Testing (VAPT)
- The startup must furnish a VAPT clearance certificate from a CERT-In empanelled auditing agency prior to connecting to live government databases.
- Automated daily dependency scanning for known CVE vulnerabilities.
`,
  },
  {
    id: 'tpl-risk-register',
    type: 'RISK_REGISTER',
    title: 'Sandbox Pilot Risk Management Register',
    version: 'v1.1',
    category: 'Pilot Execution',
    summary: 'Comprehensive risk management template identifying technical, operational, legal, and adoption risks with proactive mitigations.',
    content: `# Pilot Risk Register & Mitigation Matrix

| Risk ID | Risk Category | Potential Failure Mode | Likelihood | Impact | Mitigation Strategy | Risk Owner |
| :--- | :--- | :--- | :---: | :---: | :--- | :--- |
| **R-01** | Connectivity | 4G network dropouts in remote tribal talukas causing telemetry loss. | High | Medium | Implement local SQLite offline buffer with store-and-forward edge syncing upon reconnection. | Startup CTO |
| **R-02** | Departmental | Frequent transfer of nodal officer stalling pilot approvals. | Medium | High | Tripartite oversight via MSInS institutional champion; automated SLA escalation. | MSInS Admin |
| **R-03** | Data Privacy | Accidental leakage of farmer or patient identifiers. | Low | Critical | Field pseudonymization; strip PII before cloud ingestion; localized hashing. | Security Officer |
| **R-04** | Adoption | Resistance by ground field staff to change legacy manual processes. | High | Medium | Joint weekly co-design workshops; gamified mobile UI in Marathi; field incentives. | Department Head |
`,
  },
  {
    id: 'tpl-procurement-guide',
    type: 'PROCUREMENT_GUIDE',
    title: 'Public Procurement Scaling Pathways Guide for Successful Pilots',
    version: 'v2.0',
    category: 'Scaling & Procurement',
    summary: 'Step-by-step statutory procurement guide detailing how departments can transition validated pilots into public contracts via Direct Award (GFR 194), Limited Tender, or GeM Startup Runway.',
    content: `# Public Procurement Scaling Pathways Guide

### Pathway 1: Direct Pilot Scale-Up Award (GFR 2017 Rule 194 / Single-Source R&D)
- **Applicability**: When the startup pilot has been validated by an independent third party as a unique proprietary technological outcome delivering proven cost savings (>25%) or unreplicable efficacy.
- **Statutory Authority**: G.O. / Resolution of Department of Finance, Government of Maharashtra (Innovation Procurement Exemption).
- **Maximum Ceiling**: Up to ₹1.00 Crore for direct expansion to adjacent talukas.

### Pathway 2: GeM (Government e-Marketplace) Startup Runway Listing
- **Applicability**: Recommended for commercial software products, SaaS solutions, and modular IoT equipment.
- **Mechanism**: NavSetu provides a 1-click verified dossier export directly to the GeM Startup Runway portal.
- **Benefit**: Any state department can directly purchase the certified product off GeM without issuing a separate tender, up to threshold limits under Rule 149 GFR.

### Pathway 3: Limited Competitive Swiss-Challenge Tender
- **Applicability**: Large-scale statewide rollouts (> ₹1.00 Crore).
- **Mechanism**: The pilot startup's validated technical specification forms the base tender. The startup retains the first right of refusal to match the lowest bid (Swiss Challenge model).
`,
  },
];
