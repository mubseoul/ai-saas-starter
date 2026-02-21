import { apiRateLimiter, authRateLimiter, getClientIdentifier } from '@/lib/rate-limit';

describe('Rate Limiting', () => {
  describe('apiRateLimiter', () => {
    it('should allow requests within limit', async () => {
      const result = await apiRateLimiter.check('test-api-1', 5);
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(4);
    });

    it('should block requests exceeding limit', async () => {
      const identifier = 'test-api-exceed';
      for (let i = 0; i < 3; i++) {
        await apiRateLimiter.check(identifier, 3);
      }
      const result = await apiRateLimiter.check(identifier, 3);
      expect(result.success).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should track remaining requests correctly', async () => {
      const identifier = 'test-api-remaining';
      const r1 = await apiRateLimiter.check(identifier, 5);
      expect(r1.remaining).toBe(4);

      const r2 = await apiRateLimiter.check(identifier, 5);
      expect(r2.remaining).toBe(3);
    });
  });

  describe('authRateLimiter', () => {
    it('should allow requests within limit', async () => {
      const result = await authRateLimiter.check('test-auth-1', 5);
      expect(result.success).toBe(true);
    });
  });

  describe('getClientIdentifier', () => {
    it('should extract identifier from request headers', () => {
      const req = new Request('http://localhost:3000', {
        headers: {
          'x-forwarded-for': '192.168.1.1',
          'user-agent': 'test-agent',
        },
      });

      const id = getClientIdentifier(req);
      expect(id).toContain('192.168.1.1');
    });

    it('should handle missing headers gracefully', () => {
      const req = new Request('http://localhost:3000');
      const id = getClientIdentifier(req);
      expect(id).toBeDefined();
      expect(typeof id).toBe('string');
    });
  });
});
