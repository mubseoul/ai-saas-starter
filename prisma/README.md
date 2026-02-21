# Database Setup Guide

This directory contains the Prisma schema and database utilities for the AI SaaS Starter project.

## Database Models

### User Management
- **User** - User accounts with email/password or OAuth
- **Account** - OAuth account connections (NextAuth)
- **Session** - User sessions (NextAuth)
- **VerificationToken** - Email verification tokens (NextAuth)

### Subscription & Billing
- **Subscription** - User subscription plans and Stripe data
  - Plans: FREE, PRO, ENTERPRISE
  - Status: ACTIVE, CANCELED, PAST_DUE, INCOMPLETE, TRIALING

### AI Features
- **PromptHistory** - AI generation history with prompts, responses, and costs
- **Usage** - Monthly usage tracking per user

### Future Features
- **ApiKey** - API keys for programmatic access

## Setup Instructions

### 1. Database Configuration

Create a PostgreSQL database and add the connection string to `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ai_saas_db"
```

### 2. Generate Prisma Client

```bash
npm run db:generate
```

### 3. Push Schema to Database

For development (no migrations):
```bash
npm run db:push
```

For production (with migrations):
```bash
npx prisma migrate dev --name init
```

### 4. Seed Database (Optional)

Populate with sample data:
```bash
npm run db:seed
```

This creates test accounts:
- **Admin**: admin@example.com / password123
- **Pro User**: pro@example.com / password123
- **Free User**: free@example.com / password123

### 5. Open Prisma Studio

Visual database browser:
```bash
npm run db:studio
```

## Database Utilities

### Usage Functions

```typescript
import { getUserUsage, incrementUsage, hasExceededLimit } from "@/lib/db-helpers";

// Get current month's usage
const usage = await getUserUsage(userId);

// Increment usage count
await incrementUsage(userId);

// Check if limit exceeded
const exceeded = await hasExceededLimit(userId);
```

### Subscription Functions

```typescript
import { getUserSubscription, upsertSubscription } from "@/lib/db-helpers";

// Get subscription with details
const sub = await getUserSubscription(userId);
console.log(sub.plan, sub.maxRequests, sub.isPro);

// Update subscription
await upsertSubscription(userId, {
  plan: "PRO",
  status: "ACTIVE",
  stripeCustomerId: "cus_xxx",
});
```

### Prompt History Functions

```typescript
import { getPromptHistory, createPromptHistory } from "@/lib/db-helpers";

// Get history with pagination
const history = await getPromptHistory(userId, {
  skip: 0,
  take: 10,
  model: "GPT_4",
});

// Save new prompt
await createPromptHistory({
  userId,
  prompt: "Generate a...",
  response: "Here is...",
  model: "GPT_4",
  tokens: 150,
  cost: 0.0045,
});
```

## Plan Limits

Configured in `lib/constants.ts`:

| Plan | Monthly Requests | Price |
|------|------------------|-------|
| FREE | 10 | $0 |
| PRO | 1,000 | $29 |
| ENTERPRISE | Unlimited | Custom |

## Migrations

### Create a new migration

```bash
npx prisma migrate dev --name your_migration_name
```

### Apply migrations in production

```bash
npx prisma migrate deploy
```

### Reset database (⚠️ deletes all data)

```bash
npx prisma migrate reset
```

## Troubleshooting

### Prisma Client not generated
```bash
npm run db:generate
```

### Database connection issues
- Check DATABASE_URL in .env
- Ensure PostgreSQL is running
- Verify credentials and database exists

### Schema changes not reflecting
```bash
npm run db:generate
npm run db:push
```

## Production Deployment

### Database Hosting Options

- [Vercel Postgres](https://vercel.com/storage/postgres) - Serverless PostgreSQL
- [Supabase](https://supabase.com) - Open source Postgres with Auth
- [Neon](https://neon.tech) - Serverless Postgres
- [Railway](https://railway.app) - Simple database hosting

### Environment Variables

Set these in your production environment:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..." # For migrations (some providers)
```

### Running Migrations

```bash
npx prisma migrate deploy
```

## Useful Commands

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:push` | Push schema changes |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed database |
| `npx prisma migrate dev` | Create migration |
| `npx prisma migrate deploy` | Apply migrations |
| `npx prisma db pull` | Introspect existing database |
| `npx prisma format` | Format schema file |

## Learn More

- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth with Prisma](https://next-auth.js.org/adapters/prisma)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
