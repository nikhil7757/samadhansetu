# NavSetu — नवसेतु

> **Startup-Friendly Public Procurement Platform for the Government of Maharashtra**  
> Maharashtra State Innovation Society (MSInS) • Department of Skills, Employment, Entrepreneurship & Innovation  
> **Smart India Hackathon 2026 • Problem Statement ID 26136**

---

## Overview

**NavSetu** establishes a transparent, competitive, and legally compliant innovation-procurement pathway enabling Maharashtra government departments across all 36 districts to identify societal challenges, discover eligible DPIIT-recognized startups, structure controlled sandbox pilots, release timely milestone payments, and scale verified technologies into statewide public procurement.

### Key Pillars of SIH Problem Statement ID 26136

1. **Outcome-Based Challenge Formulation**: AI Challenge Quality Scorer (0–100) guides departments to specify measurable outcomes and KPIs rather than prescriptive specifications.
2. **Startup Discovery & GFR Relaxation**: Automated eligibility engine applies GFR Rule 170/173 exemptions (waiving prior turnover and experience criteria for recognized startups) with mandatory appeal pathways.
3. **Multi-Expert Weighted Evaluation**: Independent expert panel scoring across innovation, feasibility, team, cost, cybersecurity, and scalability with conflict-of-interest declarations.
4. **Controlled Sandbox Pilots**: Structured tripartite agreements, ring-fenced testing, data protection, and IP safe-harbor clauses.
5. **Milestone Contracts & Timely Payments**: Financial escrow tranches with an automated SLA turnaround timer ("days since approval") flagging delayed government disbursements.
6. **Independent Third-Party Validation**: Certified audit institutions (e.g., VJTI, IIT Bombay) certify KPI achievements.
7. **Statutory Scale-Up Pathways**: Direct Pilot Award under GFR Rule 194, Limited Innovation Tender, and 1-click dossier export to **GeM Startup Runway** under GFR Rule 149.

---

## 11-Stage Statutory Procurement Lifecycle

```
[1. Challenge Drafted] ──► [2. Approved & Published] ──► [3. Startup Discovery]
                                                                  │
[6. Pilot Design] ◄── [5. Expert Evaluation] ◄── [4. Eligibility Screening]
       │
[7. Contract Signed] ──► [8. Pilot Running] ──► [9. Independent Validation]
                                                          │
[Scale Statewide] ◄── [11. Scale-Up Decision] ◄── [10. Payment Released]
```

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, TypeScript, Tailwind CSS v4, shadcn/ui, React Router v7, i18next, Recharts, Lucide Icons |
| **Backend** | Express v5, TypeScript, Prisma v6, PostgreSQL 17, Zod Validation, Helmet, Magic-Byte Inspector |
| **Authentication** | Real Firebase Authentication (Client SDK + Admin SDK), Session Cookies, TOTP Multi-Factor Authentication |
| **Localization** | Trilingual: English (`en.json`), Hindi (`hi.json`), Marathi (`mr.json`) |
| **Infrastructure** | Docker Compose (PostgreSQL), Zero-Dependency Production Build Pipeline (`build.js`) |

---

## Quick Start Guide

### Prerequisites
- **Node.js** 20+ (LTS)
- **Docker** & **Docker Compose** (for PostgreSQL)
- **npm** 9+

### 1. Start PostgreSQL Database
```bash
docker-compose up -d
```

### 2. Setup & Start Backend
```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev       # Run Prisma database migrations
npx prisma db seed           # Seed Maharashtra departments, startups, pilots & milestones
npm run dev                  # Starts on http://localhost:3001
```

### 3. Setup & Start Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev                  # Starts on http://localhost:5173
```

### 4. Build for Production (Zero-Dependency Pipeline)
```bash
# From repository root:
node build.js
```
The build pipeline compiles Prisma, builds the Vite production bundle, synchronizes static entry points, and verifies build integrity in ~12 seconds.

---

## Standard Procurement Templates Library

NavSetu provides 7 pre-approved, downloadable and editable government procurement templates accessible on `/templates`:
1. **Outcome-Based Problem Statement Template**
2. **Weighted Evaluation & Scoring Matrix**
3. **Tripartite Sandbox Pilot Agreement**
4. **Data Protection & IP Allocation Clauses**
5. **Cybersecurity & CERT-In Compliance Checklist**
6. **Innovation Pilot Risk Register**
7. **Statutory Scale-Up & GeM Procurement Pathway Guide**

---

## Role-Based Access Control

| Role | Responsibility | Platform Scope |
| :--- | :--- | :--- |
| `DEPARTMENT_USER` | Government Department Officer | Formulates challenges, manages pilots, approves deliverable vouchers |
| `STARTUP` | DPIIT-Recognized Startup Founder | Browses open challenges, submits proposals, executes milestones |
| `INNOVATION_SOCIETY_ADMIN` | MSInS State Administrator | Approves challenges, assigns evaluators, oversees statewide scaling |
| `EVALUATOR` | Technical / Academic Expert (IIT/VJTI) | Scores proposals using multi-criterion weighted matrix |
| `VALIDATOR` | Third-Party Quality Auditor | Validates field KPI achievements and issues certification reports |

---

## Security Hardening Highlights

- **Real Firebase Authentication**: Zero mock bypasses or hardcoded passwords.
- **Session Cookie Architecture**: 5-day `httpOnly`, `Secure`, `SameSite=Lax` session cookies with `checkRevoked: true`.
- **Token In-Memory Persistence**: Zero auth tokens stored in `localStorage` or `sessionStorage`.
- **Multi-Factor Authentication (TOTP)**: Mandatory enrollment for `INNOVATION_SOCIETY_ADMIN` via `/mfa/enroll`.
- **BOLA / IDOR Protection**: Strict database ownership checks on challenges, proposals, pilots, and payments.
- **Defensive Safeguards**: Strict Helmet CSP, double-submit anti-CSRF cookies, SSRF private IP blocker, binary magic-byte upload validation.

---

## Demo Integrations

To ensure transparency during jury evaluation, external government adapters are clearly labeled as **Demo Integrations**:
- **DPIIT Recognition Verification**: Automated validation of startup registration credentials against simulated DPIIT registry.
- **GeM Startup Runway Export**: Interactive docket modal generating official JSON handoff payloads under GFR Rule 149.

---

## License

Built for **Smart India Hackathon 2026** (Government of Maharashtra & MSInS). All rights reserved.
