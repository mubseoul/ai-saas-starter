import { hasAIProviders, hasStripe, hasEmail, hasGoogleOAuth } from '@/lib/env-validation';

describe('Environment Validation', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('hasAIProviders', () => {
    it('should return true when OpenAI key is set', () => {
      process.env.OPENAI_API_KEY = 'sk-test';
      expect(hasAIProviders()).toBe(true);
    });

    it('should return true when Anthropic key is set', () => {
      process.env.ANTHROPIC_API_KEY = 'sk-ant-test';
      expect(hasAIProviders()).toBe(true);
    });

    it('should return false when no AI keys are set', () => {
      delete process.env.OPENAI_API_KEY;
      delete process.env.ANTHROPIC_API_KEY;
      expect(hasAIProviders()).toBe(false);
    });
  });

  describe('hasStripe', () => {
    it('should return true when all Stripe vars are set', () => {
      process.env.STRIPE_SECRET_KEY = 'sk_test';
      process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test';
      process.env.STRIPE_PRO_MONTHLY_PRICE_ID = 'price_test';
      expect(hasStripe()).toBe(true);
    });

    it('should return false when Stripe vars are missing', () => {
      delete process.env.STRIPE_SECRET_KEY;
      expect(hasStripe()).toBe(false);
    });
  });

  describe('hasEmail', () => {
    it('should return true when email vars are set', () => {
      process.env.RESEND_API_KEY = 're_test';
      process.env.EMAIL_FROM = 'test@example.com';
      expect(hasEmail()).toBe(true);
    });

    it('should return false when email vars are missing', () => {
      delete process.env.RESEND_API_KEY;
      expect(hasEmail()).toBe(false);
    });
  });

  describe('hasGoogleOAuth', () => {
    it('should return true when Google vars are set', () => {
      process.env.GOOGLE_CLIENT_ID = 'client-id';
      process.env.GOOGLE_CLIENT_SECRET = 'client-secret';
      expect(hasGoogleOAuth()).toBe(true);
    });

    it('should return false when Google vars are missing', () => {
      delete process.env.GOOGLE_CLIENT_ID;
      expect(hasGoogleOAuth()).toBe(false);
    });
  });
});
