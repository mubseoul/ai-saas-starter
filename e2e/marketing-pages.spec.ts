import { test, expect } from '@playwright/test';

test.describe('Marketing Pages', () => {
  test('should load about page', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByText(/about/i).first()).toBeVisible();
  });

  test('should load pricing page with plans', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByText(/free/i).first()).toBeVisible();
    await expect(page.getByText(/pro/i).first()).toBeVisible();
  });

  test('should load terms page', async ({ page }) => {
    await page.goto('/terms');
    await expect(page.getByText(/terms of service/i).first()).toBeVisible();
  });

  test('should load privacy page', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page.getByText(/privacy policy/i).first()).toBeVisible();
  });

  test('should load contact page', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByText(/contact/i).first()).toBeVisible();
  });

  test('should have responsive design on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.getByText(/Build Your AI SaaS/i)).toBeVisible();
  });

  test('should display footer on all pages', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/All rights reserved/i)).toBeVisible();
  });

  test('landing page should have 404 handling', async ({ page }) => {
    const response = await page.goto('/nonexistent-page');
    await expect(page.getByText(/not found|404/i).first()).toBeVisible();
  });
});
