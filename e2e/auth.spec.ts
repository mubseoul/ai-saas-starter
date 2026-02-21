import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should navigate to login page', async ({ page }) => {
    await page.goto('/login');

    // Check for login form
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.goto('/signup');

    // Check for signup form
    await expect(page.getByRole('heading', { name: /sign up/i })).toBeVisible();
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });

  test('should show validation errors for empty login form', async ({ page }) => {
    await page.goto('/login');

    // Try to submit empty form
    await page.getByRole('button', { name: /sign in/i }).click();

    // Check for validation messages (this depends on your validation implementation)
    // Adjust selectors based on your actual error handling
    await expect(page.locator('text=/required/i').first()).toBeVisible();
  });

  test('should have Google OAuth button', async ({ page }) => {
    await page.goto('/login');

    // Check for Google sign in button
    await expect(page.getByRole('button', { name: /google/i })).toBeVisible();
  });

  test('should navigate between login and signup', async ({ page }) => {
    await page.goto('/login');

    // Click link to signup
    await page.getByRole('link', { name: /sign up/i }).click();

    // Verify on signup page
    await expect(page).toHaveURL(/\/signup/);

    // Navigate back to login
    await page.getByRole('link', { name: /sign in/i }).click();

    // Verify back on login
    await expect(page).toHaveURL(/\/login/);
  });

  test('should have forgot password link', async ({ page }) => {
    await page.goto('/login');

    // Check for forgot password link
    await expect(page.getByRole('link', { name: /forgot.*password/i })).toBeVisible();
  });
});
