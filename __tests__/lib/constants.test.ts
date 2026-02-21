import { PLANS, AI_MODELS, APP_CONFIG } from '@/lib/constants';

describe('Constants', () => {
  describe('PLANS', () => {
    it('should have all required plan tiers', () => {
      expect(PLANS).toHaveProperty('FREE');
      expect(PLANS).toHaveProperty('PRO');
      expect(PLANS).toHaveProperty('ENTERPRISE');
    });

    it('should have correct FREE plan limits', () => {
      expect(PLANS.FREE.maxRequests).toBe(10);
      expect(PLANS.FREE.price).toBe(0);
    });

    it('should have correct PRO plan limits', () => {
      expect(PLANS.PRO.maxRequests).toBe(1000);
      expect(PLANS.PRO.price).toBe(2900); // $29.00 in cents
    });

    it('should have ENTERPRISE plan as unlimited', () => {
      expect(PLANS.ENTERPRISE.maxRequests).toBe(-1); // -1 represents unlimited
    });
  });

  describe('AI_MODELS', () => {
    it('should have all AI model configurations', () => {
      expect(AI_MODELS).toHaveProperty('GPT_4');
      expect(AI_MODELS).toHaveProperty('GPT_3_5_TURBO');
      expect(AI_MODELS).toHaveProperty('CLAUDE_SONNET');
      expect(AI_MODELS).toHaveProperty('CLAUDE_HAIKU');
    });

    it('should have correct provider assignments', () => {
      expect(AI_MODELS.GPT_4.provider).toBe('openai');
      expect(AI_MODELS.GPT_3_5_TURBO.provider).toBe('openai');
      expect(AI_MODELS.CLAUDE_SONNET.provider).toBe('anthropic');
      expect(AI_MODELS.CLAUDE_HAIKU.provider).toBe('anthropic');
    });

    it('should have cost configurations', () => {
      expect(AI_MODELS.GPT_4.costPer1kTokens).toBeGreaterThan(0);
      expect(AI_MODELS.CLAUDE_HAIKU.costPer1kTokens).toBeGreaterThan(0);
    });
  });

  describe('APP_CONFIG', () => {
    it('should have app configuration', () => {
      expect(APP_CONFIG).toHaveProperty('name');
      expect(APP_CONFIG).toHaveProperty('url');
      expect(APP_CONFIG).toHaveProperty('description');
    });

    it('should have prompt limits', () => {
      expect(APP_CONFIG.maxPromptLength).toBeGreaterThan(0);
      expect(APP_CONFIG.maxResponseLength).toBeGreaterThan(0);
    });
  });
});
