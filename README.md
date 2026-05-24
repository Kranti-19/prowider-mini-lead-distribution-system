# Prowider Mini Lead Distribution System

A full-stack lead distribution platform built using Next.js, PostgreSQL, and Prisma.

## Live Demo

(https://prowider-mini-lead-distribution-sys-ochre.vercel.app/)

---

# Features

- Customer service request form
- Automatic provider lead assignment
- Fair round-robin allocation
- Mandatory provider assignment rules
- Monthly provider quota tracking
- Duplicate lead prevention
- Real-time dashboard updates
- Webhook idempotency handling
- Concurrency testing tools
- PostgreSQL database persistence

---

# Tech Stack

- Next.js
- TypeScript
- PostgreSQL
- Prisma ORM
- Tailwind CSS
- Vercel
- Neon PostgreSQL

---

# Routes

## Public Routes

### `/`
Homepage

### `/request-service`
Customer lead submission form

### `/dashboard`
Provider dashboard with live updates

### `/test-tools`
Testing utilities

---

# API Routes

### `POST /api/leads/create`
Create lead and distribute providers

### `GET /api/dashboard`
Fetch provider dashboard data

### `POST /api/test/reset-quota`
Reset provider quotas

### `POST /api/test/webhook`
Webhook simulation with idempotency

### `POST /api/test/generate-leads`
Generate concurrent leads

---

# Allocation Logic

## Mandatory Rules

- Service 1 → Provider 1 always assigned
- Service 2 → Provider 5 always assigned
- Service 3 → Provider 1 and Provider 4 always assigned

## Fair Distribution

Remaining providers are assigned using persistent round-robin allocation.

Allocation state is stored in the database to ensure:
- fairness over time
- persistence after restart
- no repeated favoritism

---

# Concurrency Handling

Lead creation uses Prisma database transactions to ensure:
- atomic operations
- assignment consistency
- quota correctness

---

# Webhook Idempotency

Webhook events are stored using unique event IDs.

Repeated webhook calls with the same event ID do not duplicate effects.

---

# Setup Instructions

```bash
npm install
```

Create `.env`

```env
DATABASE_URL=your_database_url
```

Run migrations:

```bash
npx prisma migrate dev
```

Seed database:

```bash
npx tsx prisma/seed.ts
```

Start server:

```bash
npm run dev
```