import { cn } from '@/lib/utils';

describe('Utils', () => {
  describe('cn (className merger)', () => {
    it('should merge class names correctly', () => {
      const result = cn('px-2 py-1', 'px-3');
      expect(result).toContain('px-3');
      expect(result).toContain('py-1');
    });

    it('should handle conditional classes', () => {
      const isActive = true;
      const result = cn('base-class', isActive && 'active-class');
      expect(result).toContain('base-class');
      expect(result).toContain('active-class');
    });

    it('should filter out falsy values', () => {
      const result = cn('base', false, null, undefined, 'valid');
      expect(result).toContain('base');
      expect(result).toContain('valid');
      expect(result).not.toContain('false');
      expect(result).not.toContain('null');
    });
  });
});
