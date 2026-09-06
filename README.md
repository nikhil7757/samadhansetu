# SamadhanSetu — समाधान सेतु

> A digital platform to crowdsource societal challenges and facilitate collaborative problem-solving through universities and industry partnerships. Built for Smart India Hackathon 2026 (SIH26043, Government of Jharkhand).

## Prerequisites

- **Node.js** 20+ (LTS recommended)
- **Docker** & **Docker Compose** (for PostgreSQL)
- **npm** 9+

## Quick Start

### 1. Start PostgreSQL

```bash
docker-compose up -d
```

This starts PostgreSQL 17 on port `5432` with:
- User: `samadhansetu`
- Password: `samadhansetu_dev`
- Database: `samadhansetu`

### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env        # Uses defaults — no edits needed for local dev
npx prisma migrate dev       # Run database migrations
npx prisma db seed           # Load demo data (users, problems, teams)
npm run dev                  # Starts on http://localhost:3001
```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev                  # Starts on http://localhost:5173
```

### 4. Open the App

Visit **http://localhost:5173** in your browser.

## Demo Accounts

| Email | Password | Role |
|---|---|---|
| `admin@samadhansetu.gov.in` | `Test@1234` | Admin (Govt Nodal Officer) |
| `priya.kumar@gmail.com` | `Test@1234` | Citizen |
| `rajesh.oraon@gmail.com` | `Test@1234` | Citizen |
| `anita.devi@gmail.com` | `Test@1234` | Citizen |
| `iit.ism.team@gmail.com` | `Test@1234` | University |
| `bit.mesra.cell@gmail.com` | `Test@1234` | University |
| `cnlu.legal@gmail.com` | `Test@1234` | University |
| `tata.steel.csr@gmail.com` | `Test@1234` | Industry |
| `usha.martin@gmail.com` | `Test@1234` | Industry |

## Project Structure

```
sih/
├── docker-compose.yml       # PostgreSQL container
├── backend/                 # Express + TypeScript + Prisma
│   ├── prisma/              # Schema, migrations, seed
│   └── src/
│       ├── routes/          # Route definitions
│       ├── controllers/     # Request handling
│       ├── services/        # Business logic + Prisma queries
│       ├── middleware/       # Auth, validation, rate limiting
│       ├── validators/      # Zod schemas
│       └── lib/             # Prisma client, JWT helpers
└── frontend/                # React + Vite + TypeScript
    └── src/
        ├── pages/           # Route pages (lazy-loaded)
        ├── components/      # UI components
        ├── lib/             # API client, auth context
        ├── hooks/           # Custom React hooks
        └── locales/         # en.json / hi.json translations
```

## Tech Stack

- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS v4, shadcn/ui, React Router v7, i18next, Recharts
- **Backend:** Express v5, TypeScript, Prisma v6, PostgreSQL 17, JWT auth, Zod validation
- **Infrastructure:** Docker Compose

## License

Built for Smart India Hackathon 2026. All rights reserved.
