import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should load the landing page', async ({ page }) => {
    await page.goto('/');

    // Check for main heading
    await expect(page.getByText(/Build Your AI SaaS/i)).toBeVisible();
  });

  test('should have navigation links', async ({ page }) => {
    await page.goto('/');

    // Check navigation
    await expect(page.getByRole('link', { name: /features/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /pricing/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible();
  });

  test('should navigate to pricing page', async ({ page }) => {
    await page.goto('/');

    // Click pricing link
    await page.getByRole('link', { name: /^pricing$/i }).first().click();

    // Wait for navigation
    await page.waitForURL('**/pricing');

    // Verify we're on pricing page
    await expect(page).toHaveURL(/\/pricing/);
  });

  test('should have CTA buttons', async ({ page }) => {
    await page.goto('/');

    // Check for Get Started button
    const ctaButton = page.getByRole('link', { name: /get started/i }).first();
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toHaveAttribute('href', '/signup');
  });

  test('should display feature cards', async ({ page }) => {
    await page.goto('/');

    // Scroll to features section
    await page.locator('#features').scrollIntoViewIfNeeded();

    // Check for feature cards
    await expect(page.getByText(/AI Integration/i)).toBeVisible();
    await expect(page.getByText(/Authentication/i)).toBeVisible();
    await expect(page.getByText(/Stripe Payments/i)).toBeVisible();
  });

  test('should display FAQ section', async ({ page }) => {
    await page.goto('/');

    // Scroll to FAQ
    await page.getByText(/Frequently Asked Questions/i).scrollIntoViewIfNeeded();

    // Check for FAQ content
    await expect(page.getByText(/What AI models are supported/i)).toBeVisible();
    await expect(page.getByText(/Is the code open source/i)).toBeVisible();
  });
});
