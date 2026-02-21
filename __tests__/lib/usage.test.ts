import { getPlanLimit } from '@/lib/usage';
import { PLANS } from '@/lib/constants';

describe('Usage Utilities', () => {
  describe('getPlanLimit', () => {
    it('should return correct limit for FREE plan', () => {
      const limit = getPlanLimit('FREE');
      expect(limit).toBe(PLANS.FREE.maxRequests);
      expect(limit).toBe(10);
    });

    it('should return correct limit for PRO plan', () => {
      const limit = getPlanLimit('PRO');
      expect(limit).toBe(PLANS.PRO.maxRequests);
      expect(limit).toBe(1000);
    });

    it('should return -1 (unlimited) for ENTERPRISE plan', () => {
      const limit = getPlanLimit('ENTERPRISE');
      expect(limit).toBe(-1);
    });

    it('should default to FREE limit for unknown plans', () => {
      const limit = getPlanLimit('UNKNOWN' as any);
      expect(limit).toBe(PLANS.FREE.maxRequests);
    });
  });
});
