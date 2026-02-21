# AI SaaS Starter Kit

A production-ready Next.js 14 SaaS starter kit with built-in authentication, AI integration (OpenAI & Claude), subscription management, and more.

## Features

- ✅ **Next.js 14 App Router** - Modern React framework with server components
- ✅ **TypeScript** - Full type safety throughout the application
- ✅ **Authentication** - NextAuth with Google OAuth and email/password
- ✅ **AI Integration** - OpenAI (GPT-4, GPT-3.5 Turbo) and Anthropic (Claude)
- ✅ **Database** - Prisma ORM with PostgreSQL
- ✅ **Subscription Plans** - Free, Pro, and Enterprise tiers with usage limits
- ✅ **Usage Tracking** - Monthly request tracking and limit enforcement
- ✅ **Stripe Payments** - Checkout, webhooks, and customer portal
- ✅ **Billing Management** - Subscription management and payment methods
- ✅ **Settings Page** - Profile editing, password change, account deletion
- ✅ **Admin Dashboard** - User management, analytics, system overview
- ✅ **Email System** - Welcome emails, payment notifications, usage alerts (Resend)
- ✅ **Modern UI** - Tailwind CSS with custom design system
- ✅ **Dashboard** - User dashboard with stats and prompt history

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- OpenAI API key (for GPT models)
- Anthropic API key (for Claude models)
- Stripe account with API keys
- Google OAuth credentials (optional)

### Installation

1. **Clone and install dependencies:**

```bash
cd ai-saas-starter
npm install
```

2. **Set up environment variables:**

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
- `OPENAI_API_KEY` - Your OpenAI API key
- `ANTHROPIC_API_KEY` - Your Anthropic API key
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Your Stripe webhook signing secret
- `STRIPE_PRO_MONTHLY_PRICE_ID` - Stripe Price ID for Pro plan
- `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID` - Same as above (public)
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - For Google OAuth (optional)

3. **Set up the database:**

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with test data (optional)
npm run db:seed
```

4. **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## Project Structure

```
ai-saas-starter/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   ├── signup/
│   │   └── forgot-password/
│   ├── (dashboard)/         # Protected dashboard pages
│   │   ├── dashboard/       # Dashboard home
│   │   ├── ai-generator/    # AI text generation
│   │   ├── history/         # Prompt history
│   │   ├── billing/         # Subscription management
│   │   └── settings/        # User settings
│   ├── (marketing)/         # Public pages
│   │   └── pricing/
│   └── api/
│       ├── auth/            # NextAuth routes
│       └── ai/generate/     # AI generation endpoint
├── components/
│   ├── ui/                  # Reusable UI components
│   ├── auth/                # Auth-specific components
│   └── dashboard/           # Dashboard components
├── lib/
│   ├── auth.ts              # NextAuth configuration
│   ├── db.ts                # Prisma client
│   ├── db-helpers.ts        # Database helper functions
│   └── constants.ts         # Plan limits and configs
└── prisma/
    └── schema.prisma        # Database schema
```

## Database Schema

- **User** - User accounts with role-based access
- **Account** - OAuth account linking
- **Session** - User sessions
- **Subscription** - User subscription plans (Free, Pro, Enterprise)
- **Usage** - Monthly usage tracking per user
- **PromptHistory** - AI generation history
- **ApiKey** - User API keys (optional)

## Subscription Plans

| Plan       | Price  | Monthly Requests | Features                    |
|------------|--------|------------------|-----------------------------|
| Free       | $0     | 10               | Basic features              |
| Pro        | $29    | 1,000            | Priority processing, analytics |
| Enterprise | Custom | Unlimited        | Custom integrations, SLA    |

## API Routes

### POST /api/ai/generate

Generate AI content using OpenAI or Claude models.

**Request:**
```json
{
  "prompt": "Write a blog post about AI",
  "model": "GPT_4" // or "GPT_3_5_TURBO", "CLAUDE_SONNET", "CLAUDE_HAIKU"
}
```

**Response:**
```json
{
  "response": "Generated content...",
  "tokens": 150,
  "model": "GPT_4"
}
```

**Features:**
- Automatic usage limit checking
- Token counting and tracking
- Saves to prompt history
- Error handling for rate limits and API errors

### POST /api/stripe/checkout

Create a Stripe checkout session for subscription purchase.

**Request:**
```json
{
  "priceId": "price_xxx" // Stripe Price ID
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/..." // Redirect URL
}
```

### POST /api/stripe/portal

Create a Stripe customer portal session for managing subscriptions.

**Response:**
```json
{
  "url": "https://billing.stripe.com/..." // Redirect URL
}
```

### POST /api/stripe/webhook

Webhook endpoint for Stripe events. Handles:
- `checkout.session.completed` - New subscription
- `customer.subscription.updated` - Subscription changes
- `customer.subscription.deleted` - Cancellations
- `invoice.payment_succeeded` - Successful payments
- `invoice.payment_failed` - Failed payments

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with test data

### Test Accounts (after seeding)

- **Admin:** admin@example.com / password123
- **Pro User:** pro@example.com / password123
- **Free User:** free@example.com / password123

## Development Roadmap

- ✅ **Phase 1-4: Foundation** - COMPLETED (Project setup, database, auth, UI)
- ✅ **Phase 5: AI Integration** - COMPLETED (OpenAI & Claude APIs)
- ✅ **Phase 6: Stripe Integration** - COMPLETED (Payments & subscriptions)
- ✅ **Phase 7: Additional Features** - COMPLETED (Settings, admin dashboard)
- ✅ **Phase 8: Testing & Deployment** - COMPLETED (Documentation & deployment guides)
- ✅ **Phase 9: Email System** - COMPLETED (Welcome, payment, usage alert emails)

**🎉 All 9 phases complete! The starter kit is production-ready.**

## Documentation

- [Deployment Guide](./docs/DEPLOYMENT.md) - Deploy to Vercel or Railway
- [Database Guide](./docs/DATABASE.md) - Database setup and migrations
- [Testing Guide](./docs/TESTING.md) - Testing strategies and tools
- [Email Guide](./docs/EMAIL.md) - Email system configuration

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL + Prisma
- **Authentication:** NextAuth.js
- **AI:** OpenAI API, Anthropic API
- **Payments:** Stripe (coming soon)
- **UI:** Tailwind CSS, Radix UI
- **Icons:** Lucide React

## License

MIT License - feel free to use this starter for your own projects!

## Support

For issues and questions, please open an issue on GitHub.
