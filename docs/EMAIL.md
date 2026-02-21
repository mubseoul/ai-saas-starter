# Email System Guide

Documentation for the email system using Resend.

## Overview

The AI SaaS Starter Kit includes an email system for:
- Welcome emails on signup
- Payment success notifications
- Payment failure alerts
- Usage limit warnings (can be implemented)

## Setup

### 1. Create Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email

### 2. Get API Key

1. Navigate to API Keys in the dashboard
2. Create a new API key
3. Copy the key (starts with `re_`)

### 3. Configure Environment Variables

Add to your `.env` file:

```bash
RESEND_API_KEY="re_your_api_key_here"
EMAIL_FROM="noreply@yourdomain.com"
```

### 4. Verify Domain (Production)

For production, verify your sending domain:

1. Go to Domains in Resend dashboard
2. Add your domain
3. Add the DNS records to your domain provider
4. Wait for verification (usually 5-10 minutes)

## Email Templates

### Welcome Email

Sent when a new user signs up.

**Triggers:** User registration via `/api/auth/signup`

**Variables:**
- `name` - User's name
- `email` - User's email

**Function:** `sendWelcomeEmail(email, name)`

### Payment Success Email

Sent when a payment is successfully processed.

**Triggers:** Stripe webhook `invoice.payment_succeeded`

**Variables:**
- `name` - User's name
- `email` - User's email
- `plan` - Subscription plan name
- `amount` - Payment amount in cents

**Function:** `sendPaymentSuccessEmail(email, name, plan, amount)`

### Payment Failed Email

Sent when a payment fails.

**Triggers:** Stripe webhook `invoice.payment_failed`

**Variables:**
- `name` - User's name
- `email` - User's email
- `plan` - Subscription plan name

**Function:** `sendPaymentFailedEmail(email, name, plan)`

### Usage Limit Warning

Sent when user approaches their usage limit.

**Triggers:** Manual (can be automated with a cron job)

**Variables:**
- `name` - User's name
- `email` - User's email
- `usagePercent` - Usage percentage
- `currentUsage` - Current request count
- `limit` - Request limit

**Function:** `sendUsageLimitWarning(email, name, usagePercent, currentUsage, limit)`

## Usage

### Sending Emails

All email functions are in `lib/email.ts`:

```typescript
import { sendWelcomeEmail } from '@/lib/email';

// Send welcome email
await sendWelcomeEmail('user@example.com', 'John Doe');
```

### Error Handling

Emails are sent asynchronously and don't block the main flow:

```typescript
// Don't wait for email
sendWelcomeEmail(email, name).catch((error) => {
  console.error('Failed to send email:', error);
});
```

### Testing Emails

During development, Resend will send emails to verified email addresses only.

**Test with:**
1. Your verified Resend email
2. Resend's test mode
3. Email testing tools like Mailtrap

## Customization

### Modify Email Templates

Edit `lib/email.ts` to customize email content:

```typescript
export async function sendWelcomeEmail(email: string, name: string) {
  const html = `
    <!DOCTYPE html>
    <html>
      <!-- Your custom HTML here -->
    </html>
  `;

  return sendEmail({ to: email, subject: '...', html });
}
```

### Add New Email Templates

1. Create new function in `lib/email.ts`
2. Define HTML template
3. Call `sendEmail()` with parameters
4. Use the function where needed

Example:

```typescript
export async function sendPasswordResetEmail(
  email: string,
  resetToken: string
) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

  const html = `
    <p>Click the link below to reset your password:</p>
    <a href="${resetUrl}">Reset Password</a>
  `;

  return sendEmail({
    to: email,
    subject: 'Reset Your Password',
    html,
  });
}
```

## Automated Usage Alerts

To automatically send usage limit warnings, create a cron job:

### 1. Create API Route

`app/api/cron/usage-alerts/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendUsageLimitWarning } from '@/lib/email';
import { PLANS } from '@/lib/constants';

export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  // Get all users with usage > 80%
  const usages = await prisma.usage.findMany({
    where: {
      month,
      year,
    },
    include: {
      user: {
        include: {
          subscription: true,
        },
      },
    },
  });

  let sent = 0;

  for (const usage of usages) {
    const plan = usage.user.subscription?.plan || 'FREE';
    const limit = PLANS[plan].maxRequests;

    if (limit === -1) continue; // Skip unlimited

    const usagePercent = Math.round((usage.requestCount / limit) * 100);

    // Send alert if >80% usage
    if (usagePercent >= 80 && usage.user.email) {
      await sendUsageLimitWarning(
        usage.user.email,
        usage.user.name || 'User',
        usagePercent,
        usage.requestCount,
        limit
      );
      sent++;
    }
  }

  return NextResponse.json({ sent });
}
```

### 2. Set Up Cron Job

**Vercel:**

Create `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/usage-alerts",
      "schedule": "0 10 * * *"
    }
  ]
}
```

**Manual/Other platforms:**

Use a service like:
- [cron-job.org](https://cron-job.org)
- [EasyCron](https://www.easycron.com)
- GitHub Actions

## Best Practices

1. **Don't wait for emails** - Send asynchronously
2. **Handle failures gracefully** - Log errors, don't crash
3. **Use templates** - Keep HTML in separate functions
4. **Test thoroughly** - Use test mode in development
5. **Monitor delivery** - Check Resend logs
6. **Respect limits** - Resend has rate limits (100/day free tier)
7. **Verify domains** - Use verified domains in production
8. **Include unsubscribe** - Add unsubscribe links (optional for transactional)
9. **Mobile responsive** - Test emails on mobile devices
10. **Plain text fallback** - Include text version

## Troubleshooting

### Emails Not Sending

**Check:**
1. API key is correct in `.env`
2. Email address is verified (development)
3. Domain is verified (production)
4. Resend logs for errors
5. Check spam folder

### Domain Verification Issues

1. Wait 10-15 minutes after adding DNS records
2. Verify DNS records are correct
3. Check TTL settings (lower is better)
4. Use DNS checker tools

### Rate Limits

Free tier limits:
- 100 emails/day
- 3,000 emails/month

Upgrade to Pro for higher limits.

## Monitoring

### Resend Dashboard

Monitor:
- Email delivery status
- Open rates
- Click rates
- Bounce rates
- Spam reports

### Logging

All email functions log to console:

```typescript
console.log("Email sent successfully:", data);
console.error("Email sending failed:", error);
```

## Cost

**Free Tier:**
- 3,000 emails/month
- 100 emails/day
- Email delivery
- Analytics

**Pro ($20/month):**
- 50,000 emails/month
- Custom domains
- Advanced analytics
- Priority support

See [resend.com/pricing](https://resend.com/pricing) for details.

## Security

1. **API key security** - Never expose in client code
2. **Email validation** - Validate email addresses
3. **Rate limiting** - Prevent abuse
4. **Spam prevention** - Follow email best practices
5. **DMARC/SPF/DKIM** - Configure for verified domains

## Resources

- [Resend Documentation](https://resend.com/docs)
- [Resend React Email](https://react.email) - Build emails with React
- [MJML](https://mjml.io) - Responsive email framework
- [Litmus](https://www.litmus.com) - Email testing
