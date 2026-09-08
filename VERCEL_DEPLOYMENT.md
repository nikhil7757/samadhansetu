# Deploying SamadhanSetu to Vercel

This repository is pre-configured with `vercel.json`, root serverless functions in `/api`, and Vite output in `/frontend/dist`.

You have two simple ways to deploy to Vercel:
- **Option 1: Unified Full-Stack Deployment (Recommended)** — Hosts both the React frontend and the Express API in a single Vercel project.
- **Option 2: Standalone Frontend on Vercel** — Connects to a backend hosted on Render, Railway, or VPS.

---

## 🗄️ Step 1: Set Up Cloud PostgreSQL Database (Free)

Vercel serverless functions connect to a cloud PostgreSQL database:

1. **Option A (Recommended — Neon / Vercel Postgres)**:
   - Go to [neon.tech](https://neon.tech) and create a free PostgreSQL database.
   - Copy the connection string (`postgresql://username:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require`).
2. **Option B (Supabase)**:
   - Go to [supabase.com](https://supabase.com) and create a free project.
   - Under **Project Settings → Database**, copy the **URI** connection string.

---

## 🚀 Step 2: Deploy via Vercel Dashboard (GitHub)

1. **Initialize Git & Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: SamadhanSetu for SIH 2026"
   git branch -M main
   # Create a repo on github.com and link it:
   git remote add origin https://github.com/<your-username>/samadhansetu.git
   git push -u origin main
   ```

2. **Import into Vercel**:
   - Log in to [vercel.com](https://vercel.com).
   - Click **Add New... → Project**.
   - Select your `samadhansetu` GitHub repository.
   - **Framework Preset**: Other / Vite
   - **Root Directory**: Leave as `./` (project root).

3. **Configure Environment Variables** in Vercel:
   Add these two variables in the Vercel project configuration:
   - `DATABASE_URL`: Your cloud PostgreSQL connection string (from Neon or Supabase).
   - `JWT_SECRET`: A secure random string (e.g. `jharkhand-samadhansetu-prod-secret-2026`).

4. **Deploy**:
   - Click **Deploy**.
   - Vercel will run `vercel-build` (`node build.js`), generate Prisma client engines, compile the React SPA into `frontend/dist`, and mount the Express API under `/api/*`.

---

## ⚡ Step 3: Run Database Migrations & Seed (One-time)

To push the Prisma schema and seed demo data to your live cloud database:

```bash
cd backend
# Set DATABASE_URL in backend/.env to your cloud database URL:
# DATABASE_URL="postgresql://...your-neon-url..."
npx prisma migrate dev --name init
npx prisma db seed
```

Once seeded, all 18 demo problems and 9 accounts (Nodal Admin, Citizens, Solvers from IIT ISM & BIT Mesra, Industry CSR) will be live!

---

## 🛠️ Alternative: Deploy via Vercel CLI

If you have Node.js and Vercel CLI installed:

```bash
# Login to Vercel
npx vercel login

# Link and deploy
npx vercel

# Deploy to production with environment variables
npx vercel --prod
```
