# Testing Guide

Guide for testing the AI SaaS Starter Kit.

## Testing Strategy

The project uses a combination of:
- **Manual testing** for core flows
- **Unit tests** (optional, can be added with Jest/Vitest)
- **E2E tests** (optional, can be added with Playwright)
- **API testing** for critical endpoints

## Manual Testing Checklist

### Authentication Flow

- [ ] **Sign Up**
  - Email/password registration works
  - Google OAuth registration works
  - Duplicate email shows error
  - Weak password shows error
  - User is redirected to dashboard after signup

- [ ] **Sign In**
  - Email/password login works
  - Google OAuth login works
  - Invalid credentials show error
  - Remember me functionality works
  - Redirects to previous page after login

- [ ] **Password Reset**
  - Forgot password flow works
  - Reset email is sent (if configured)
  - Password can be reset successfully

- [ ] **Sign Out**
  - User is signed out successfully
  - Session is cleared
  - Redirects to home page

### AI Generation

- [ ] **Models**
  - GPT-4 generates responses
  - GPT-3.5 Turbo generates responses
  - Claude Sonnet generates responses
  - Claude Haiku generates responses

- [ ] **Usage Limits**
  - Free tier (10 requests/month) enforced
  - Pro tier (1000 requests/month) enforced
  - Enterprise tier (unlimited) works
  - Error shown when limit reached

- [ ] **Prompt History**
  - Generations are saved to history
  - History page displays all generations
  - Copy button works
  - Regenerate button works

### Subscription & Billing

- [ ] **Stripe Checkout**
  - Pro plan checkout works
  - Redirects to Stripe checkout page
  - Returns to billing page after success
  - Cancellation works

- [ ] **Webhooks**
  - `checkout.session.completed` updates subscription
  - `customer.subscription.updated` updates plan
  - `customer.subscription.deleted` downgrades to free
  - `invoice.payment_succeeded` activates subscription
  - `invoice.payment_failed` marks as past due

- [ ] **Customer Portal**
  - Portal link works
  - Can update payment method
  - Can cancel subscription
  - Can reactivate subscription

### Settings

- [ ] **Profile**
  - Name can be updated
  - Email can be updated
  - Duplicate email shows error
  - Changes are saved

- [ ] **Password**
  - Current password is verified
  - New password is saved
  - Weak password shows error
  - Password mismatch shows error

- [ ] **Account Deletion**
  - Requires confirmation
  - Deletes all user data
  - Signs user out
  - Can't login with deleted account

### Admin Dashboard

- [ ] **Access Control**
  - Only admin users can access
  - Regular users are redirected
  - Admin badge shows in sidebar

- [ ] **Statistics**
  - Total users displayed correctly
  - Active subscriptions count correct
  - Total requests count correct
  - Revenue calculation correct

- [ ] **User Management**
  - Search works by email
  - Search works by name
  - User details displayed correctly
  - Plan and status badges correct

## API Testing

### Using cURL

#### Test AI Generation

```bash
# Get session token first (login via browser)
curl -X POST https://your-domain.com/api/ai/generate \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "prompt": "Write a haiku about coding",
    "model": "GPT_4"
  }'
```

#### Test Stripe Checkout

```bash
curl -X POST https://your-domain.com/api/stripe/checkout \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "priceId": "price_xxx"
  }'
```

#### Test Admin User Search

```bash
curl https://your-domain.com/api/admin/users?q=user@example.com \
  -H "Cookie: next-auth.session-token=ADMIN_SESSION_TOKEN"
```

### Using Postman/Insomnia

1. Import endpoints
2. Set up authentication
3. Test all API routes
4. Save as collection for regression testing

## Adding Automated Tests

### Option 1: Vitest + React Testing Library (Unit Tests)

#### 1. Install Dependencies

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

#### 2. Configure Vitest

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
```

#### 3. Create Setup File

`tests/setup.ts`:

```typescript
import '@testing-library/jest-dom';
```

#### 4. Write Tests

`components/__tests__/button.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';
import { describe, it, expect } from 'vitest';

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByText('Delete');
    expect(button).toHaveClass('bg-destructive');
  });
});
```

#### 5. Add Script

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui"
  }
}
```

### Option 2: Playwright (E2E Tests)

#### 1. Install Playwright

```bash
npm init playwright@latest
```

#### 2. Configure Playwright

`playwright.config.ts`:

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
  },
  webServer: {
    command: 'npm run dev',
    port: 3000,
  },
});
```

#### 3. Write E2E Tests

`e2e/auth.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test('user can sign up', async ({ page }) => {
  await page.goto('/signup');

  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.fill('input[name="name"]', 'Test User');

  await page.click('button[type="submit"]');

  await expect(page).toHaveURL('/dashboard');
});

test('user can generate AI content', async ({ page }) => {
  // Login first
  await page.goto('/login');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  // Navigate to AI generator
  await page.goto('/ai-generator');

  // Fill prompt
  await page.fill('textarea[name="prompt"]', 'Write a test prompt');

  // Select model
  await page.click('button:has-text("GPT-4")');

  // Generate
  await page.click('button:has-text("Generate")');

  // Wait for response
  await expect(page.locator('text=Generated successfully')).toBeVisible();
});
```

#### 4. Run Tests

```bash
npm run test:e2e
```

## Performance Testing

### Load Testing with k6

```javascript
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  const res = http.get('https://your-domain.com');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}
```

## Test Data

### Seed Test Accounts

```bash
npm run db:seed
```

Test accounts created:
- `admin@example.com` / `password123` (Admin)
- `pro@example.com` / `password123` (Pro user)
- `free@example.com` / `password123` (Free user)

### Stripe Test Cards

Use Stripe test cards for testing:
- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **3D Secure:** `4000 0025 0000 3155`

Any future expiry date and any 3-digit CVC.

## Continuous Integration

### GitHub Actions Example

`.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run type check
        run: npx tsc --noEmit

      - name: Build
        run: npm run build

      # Optional: Run tests
      # - name: Run tests
      #   run: npm test
```

## Test Coverage

If using Vitest:

```bash
npm test -- --coverage
```

Aim for:
- **Utilities:** 80%+ coverage
- **Components:** 70%+ coverage
- **API Routes:** 60%+ coverage

## Monitoring in Production

- Set up error tracking (Sentry)
- Monitor API response times
- Track failed requests
- Set up uptime monitoring
- Monitor Stripe webhook delivery

## Best Practices

1. **Test critical paths first** - Authentication, payments, AI generation
2. **Use realistic test data** - Don't use "test" everywhere
3. **Clean up test data** - Delete after tests complete
4. **Mock external APIs** in unit tests
5. **Use real APIs** in E2E tests with test mode
6. **Run tests before deploying**
7. **Monitor tests in CI/CD**
8. **Keep tests fast** - Under 10 seconds for unit tests
9. **Write descriptive test names**
10. **Don't test implementation details**

## Resources

- [Vitest Documentation](https://vitest.dev)
- [Playwright Documentation](https://playwright.dev)
- [Testing Library](https://testing-library.com)
- [Stripe Testing](https://stripe.com/docs/testing)
