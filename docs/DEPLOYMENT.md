# Deployment Guide

This guide covers deploying the AI SaaS Starter Kit to production.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Deploy to Vercel](#deploy-to-vercel)
- [Deploy to Railway](#deploy-to-railway)
- [Stripe Webhook Setup](#stripe-webhook-setup)
- [Post-Deployment](#post-deployment)

## Prerequisites

Before deploying, ensure you have:

- A PostgreSQL database (Neon, Supabase, Railway, etc.)
- OpenAI API key
- Anthropic API key
- Stripe account with API keys
- Google OAuth credentials (optional)
- A Vercel or Railway account

## Environment Variables

Create a production `.env` file with all required variables:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# NextAuth
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OpenAI
OPENAI_API_KEY="sk-your-openai-api-key"

# Anthropic (Claude)
ANTHROPIC_API_KEY="sk-ant-your-anthropic-api-key"

# Stripe
STRIPE_SECRET_KEY="sk_live_your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"

# Stripe Price IDs (server-side)
STRIPE_PRO_MONTHLY_PRICE_ID="price_your-pro-price-id"
STRIPE_ENTERPRISE_PRICE_ID="price_your-enterprise-price-id"

# Stripe Price IDs (client-side - public)
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID="price_your-pro-price-id"
NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID="price_your-enterprise-price-id"
```

## Database Setup

### Option 1: Neon (Recommended)

1. Create a free account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Add to `DATABASE_URL` environment variable

### Option 2: Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Navigate to Settings → Database
3. Copy the connection string (Transaction mode)
4. Add to `DATABASE_URL` environment variable

### Option 3: Railway

1. Create a PostgreSQL database in Railway
2. Copy the `DATABASE_URL` from the database variables
3. Add to your environment variables

### Run Migrations

After setting up your database:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed with test data
npx prisma db seed
```

## Deploy to Vercel

### 1. Prepare Repository

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
git remote add origin your-repo-url
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (or your project root)
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

5. Add all environment variables from the list above

6. Click "Deploy"

### 3. Configure Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` environment variable to your domain

## Deploy to Railway

### 1. Install Railway CLI

```bash
npm install -g @railway/cli
```

### 2. Login and Initialize

```bash
railway login
railway init
```

### 3. Add PostgreSQL Service

```bash
railway add -s postgres
```

### 4. Deploy

```bash
railway up
```

### 5. Configure Environment Variables

```bash
# Set each variable
railway variables set NEXTAUTH_URL=https://your-app.railway.app
railway variables set NEXTAUTH_SECRET=your-secret
# ... add all other variables
```

### 6. Link Domain (Optional)

```bash
railway domain
```

## Stripe Webhook Setup

After deploying, configure Stripe webhooks:

### 1. Add Webhook Endpoint in Stripe Dashboard

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Enter your webhook URL: `https://your-domain.com/api/stripe/webhook`

### 2. Select Events to Listen To

Add these events:
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

### 3. Get Webhook Signing Secret

1. Click on your new webhook endpoint
2. Copy the "Signing secret"
3. Add to `STRIPE_WEBHOOK_SECRET` environment variable
4. Redeploy your application

## Post-Deployment

### 1. Verify Deployment

- [ ] Application loads correctly
- [ ] Authentication works (email/password and Google OAuth)
- [ ] AI generation works with all models
- [ ] Stripe checkout and payments work
- [ ] Webhook events are being received
- [ ] Admin dashboard is accessible

### 2. Create Admin Account

```bash
# Connect to your production database
npx prisma studio

# Or use SQL:
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

### 3. Test Critical Flows

1. **Sign up flow**
   - Create new account
   - Verify email authentication

2. **AI generation**
   - Test each AI model
   - Verify usage tracking
   - Check prompt history

3. **Subscription flow**
   - Test Pro plan upgrade
   - Verify Stripe checkout
   - Check webhook processing
   - Test customer portal

4. **Settings**
   - Update profile
   - Change password
   - Test account deletion

5. **Admin dashboard**
   - View system stats
   - Search users
   - Verify analytics

### 4. Monitor and Maintain

- Set up error tracking (Sentry, LogRocket, etc.)
- Monitor Vercel/Railway logs
- Check Stripe webhook logs regularly
- Monitor database usage and performance
- Set up uptime monitoring

## Troubleshooting

### Build Errors

**Issue:** Prisma client not generated
```bash
# Solution: Add to package.json scripts
"postinstall": "prisma generate"
```

**Issue:** Environment variables not found
- Verify all variables are set in deployment platform
- Check for typos in variable names
- Restart the deployment after adding variables

### Database Connection Issues

**Issue:** SSL connection required
```bash
# Add to DATABASE_URL
?sslmode=require
```

**Issue:** Connection pooling
```bash
# Use Prisma Data Proxy for better connection management
# Or increase connection limits in your database provider
```

### Webhook Issues

**Issue:** Webhooks not being received
1. Check webhook URL is correct
2. Verify webhook signing secret
3. Check Stripe webhook logs
4. Ensure `/api/stripe/webhook` is accessible

**Issue:** Signature verification failed
- Make sure `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
- Verify webhook endpoint URL is exactly as configured

## Performance Optimization

### 1. Database

- Add database indexes for frequently queried fields
- Use connection pooling (PgBouncer)
- Enable query caching where appropriate

### 2. Application

- Enable Next.js caching
- Use static generation where possible
- Optimize images with Next.js Image component
- Implement lazy loading

### 3. Monitoring

- Set up performance monitoring (Vercel Analytics)
- Monitor API response times
- Track database query performance
- Set up alerts for errors

## Security Checklist

- [ ] All environment variables are set securely
- [ ] API keys are not exposed to client
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] SQL injection protection (Prisma handles this)
- [ ] XSS protection in place
- [ ] CSRF tokens configured
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Dependencies are up to date

## Support

For deployment issues:
1. Check logs in your deployment platform
2. Review Stripe webhook logs
3. Check database connection logs
4. Review the troubleshooting section above
5. Open an issue on GitHub
