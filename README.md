# Jewellery Billing

A fast, mobile-first gold/jewellery billing web app for Indian shop owners. Generate a bill in under 30 seconds.

## Features

- **Billing Calculator** — real-time price breakdown (gold price, making charges, GST, total)
- **Invoice Generation** — PDF download + WhatsApp share
- **Gold Rate Settings** — save 22K/24K rates, auto-fills in billing screen
- **Invoice History** — searchable list, click to view full invoice
- **Offline Support** — works without internet; syncs to Supabase when back online

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Supabase (PostgreSQL)
- Dexie.js (IndexedDB for offline)
- jsPDF (PDF generation)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the Supabase SQL Editor
3. Copy your project URL and anon key

### 3. Configure environment

```bash
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/billing`.

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set env vars in Vercel dashboard:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Or connect your GitHub repo to Vercel for automatic deploys.

## Works Without Supabase

If `.env.local` is not configured, the app runs fully offline using IndexedDB. Invoices are stored locally and sync to Supabase once credentials are added.

## Project Structure

```
src/
├── app/          # Next.js pages (billing, history, settings, invoice/[id])
├── components/   # UI components (billing, invoice, settings, layout, ui)
├── hooks/        # React hooks (calculator, invoices, settings, PDF, WhatsApp)
├── lib/          # Core logic (billing formulas, Dexie DB, Supabase, PDF, sync)
└── types/        # TypeScript interfaces
supabase/
└── schema.sql    # Database schema
```

Made with ❤️ by Nayan Roy
