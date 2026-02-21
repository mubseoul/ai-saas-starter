import { test, expect } from '@playwright/test';

test.describe('Pricing Page', () => {
  test('should display pricing tiers', async ({ page }) => {
    await page.goto('/pricing');

    // Check for all pricing tiers
    await expect(page.getByText(/^Free$/i)).toBeVisible();
    await expect(page.getByText(/^Pro$/i)).toBeVisible();
    await expect(page.getByText(/^Enterprise$/i)).toBeVisible();
  });

  test('should display pricing amounts', async ({ page }) => {
    await page.goto('/pricing');

    // Check for pricing
    await expect(page.getByText(/\$0/i)).toBeVisible(); // Free tier
    await expect(page.getByText(/\$29/i)).toBeVisible(); // Pro tier
  });

  test('should have signup/upgrade buttons', async ({ page }) => {
    await page.goto('/pricing');

    // Get all CTA buttons (there should be one for each plan)
    const buttons = page.getByRole('link', { name: /get started|upgrade|contact/i });

    // Should have at least 3 buttons (one per plan)
    await expect(buttons).toHaveCount(3, { timeout: 5000 });
  });

  test('should display plan features', async ({ page }) => {
    await page.goto('/pricing');

    // Check for key features
    await expect(page.getByText(/10 AI requests/i)).toBeVisible(); // Free plan
    await expect(page.getByText(/1,000 AI requests/i)).toBeVisible(); // Pro plan
    await expect(page.getByText(/Unlimited.*requests/i)).toBeVisible(); // Enterprise
  });

  test('should navigate to signup when clicking plan button', async ({ page }) => {
    await page.goto('/pricing');

    // Click on a Get Started button (Free tier)
    const freeButton = page.getByRole('link', { name: /get started/i }).first();
    await freeButton.click();

    // Should navigate to signup
    await page.waitForURL('**/signup');
    await expect(page).toHaveURL(/\/signup/);
  });
});
