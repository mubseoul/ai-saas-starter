import { generatePasswordResetToken, validatePasswordResetToken, generateEmailVerificationToken } from '@/lib/tokens';

// Mock Prisma
const mockFindUnique = jest.fn();
const mockDeleteMany = jest.fn();
const mockCreate = jest.fn();
const mockDelete = jest.fn();

jest.mock('@/lib/db', () => ({
  prisma: {
    verificationToken: {
      findUnique: (...args: any[]) => mockFindUnique(...args),
      deleteMany: (...args: any[]) => mockDeleteMany(...args),
      create: (...args: any[]) => mockCreate(...args),
      delete: (...args: any[]) => mockDelete(...args),
    },
  },
}));

describe('Token Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generatePasswordResetToken', () => {
    it('should generate a token and store it in the database', async () => {
      mockDeleteMany.mockResolvedValue({ count: 0 });
      mockCreate.mockResolvedValue({ token: 'test-token', identifier: 'password-reset:test@example.com' });

      const token = await generatePasswordResetToken('test@example.com');

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(10);
      expect(mockDeleteMany).toHaveBeenCalledWith({
        where: { identifier: 'password-reset:test@example.com' },
      });
      expect(mockCreate).toHaveBeenCalled();
    });
  });

  describe('validatePasswordResetToken', () => {
    it('should return null for non-existent token', async () => {
      mockFindUnique.mockResolvedValue(null);

      const result = await validatePasswordResetToken('invalid-token');
      expect(result).toBeNull();
    });

    it('should return null for expired token', async () => {
      mockFindUnique.mockResolvedValue({
        token: 'expired-token',
        identifier: 'password-reset:test@example.com',
        expires: new Date(Date.now() - 1000),
      });
      mockDelete.mockResolvedValue({});

      const result = await validatePasswordResetToken('expired-token');
      expect(result).toBeNull();
    });

    it('should return email for valid token', async () => {
      mockFindUnique.mockResolvedValue({
        token: 'valid-token',
        identifier: 'password-reset:test@example.com',
        expires: new Date(Date.now() + 60000),
      });

      const result = await validatePasswordResetToken('valid-token');
      expect(result).toEqual({ email: 'test@example.com', token: 'valid-token' });
    });
  });

  describe('generateEmailVerificationToken', () => {
    it('should generate a verification token', async () => {
      mockDeleteMany.mockResolvedValue({ count: 0 });
      mockCreate.mockResolvedValue({ token: 'verify-token' });

      const token = await generateEmailVerificationToken('test@example.com');

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(mockCreate).toHaveBeenCalled();
    });
  });
});
