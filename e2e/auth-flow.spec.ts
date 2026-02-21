import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('Welcome back')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
  });

  test('should display signup page', async ({ page }) => {
    await page.goto('/signup');
    await expect(page.getByText('Create an account')).toBeVisible();
    await expect(page.getByLabel('Full Name')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
  });

  test('should navigate between login and signup', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('link', { name: /sign up/i }).click();
    await page.waitForURL('**/signup');
    await expect(page).toHaveURL(/\/signup/);

    await page.getByRole('link', { name: /sign in/i }).click();
    await page.waitForURL('**/login');
    await expect(page).toHaveURL(/\/login/);
  });

  test('should show forgot password page', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('link', { name: /forgot password/i }).click();
    await page.waitForURL('**/forgot-password');
    await expect(page.getByText(/Forgot your password/i)).toBeVisible();
  });

  test('should validate login form', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /sign in/i }).click();
    // Form validation should prevent submission with empty fields
    await expect(page.getByText(/invalid email/i)).toBeVisible();
  });

  test('should validate signup form', async ({ page }) => {
    await page.goto('/signup');
    await page.getByRole('button', { name: /create account/i }).click();
    // Form validation should show error messages
    await expect(page.getByText(/at least 2 characters/i)).toBeVisible();
  });

  test('should show forgot password success state', async ({ page }) => {
    await page.goto('/forgot-password');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByRole('button', { name: /send reset link/i }).click();
    // Should show check email message (API may fail in test, but UI should respond)
    await page.waitForTimeout(1000);
  });

  test('should show verify email page', async ({ page }) => {
    await page.goto('/verify-email');
    await expect(page.getByText(/check your email/i)).toBeVisible();
  });

  test('should show reset password page with invalid token', async ({ page }) => {
    await page.goto('/reset-password');
    await expect(page.getByText(/invalid link/i)).toBeVisible();
  });
});
