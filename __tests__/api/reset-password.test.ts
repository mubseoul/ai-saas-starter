/**
 * @jest-environment node
 */

import { POST } from '@/app/api/auth/reset-password/route';

jest.mock('@/lib/db', () => ({
  prisma: {
    user: { update: jest.fn() },
  },
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('new-hashed-password'),
}));

jest.mock('@/lib/tokens', () => ({
  consumePasswordResetToken: jest.fn(),
}));

jest.mock('@/lib/rate-limit', () => ({
  authRateLimiter: {
    check: jest.fn().mockResolvedValue({ success: true, remaining: 9, reset: Date.now() + 60000 }),
  },
  getClientIdentifier: jest.fn().mockReturnValue('test-client'),
}));

const { consumePasswordResetToken } = require('@/lib/tokens');
const { prisma } = require('@/lib/db');

describe('POST /api/auth/reset-password', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should reset password with valid token', async () => {
    consumePasswordResetToken.mockResolvedValue({ email: 'test@example.com', token: 'valid-token' });
    prisma.user.update.mockResolvedValue({});

    const req = new Request('http://localhost:3000/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: 'valid-token', password: 'newpassword123' }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(prisma.user.update).toHaveBeenCalled();
  });

  it('should return 400 for invalid token', async () => {
    consumePasswordResetToken.mockResolvedValue(null);

    const req = new Request('http://localhost:3000/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: 'invalid', password: 'newpassword123' }),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
  });

  it('should return 400 for short password', async () => {
    const req = new Request('http://localhost:3000/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: 'valid', password: '12' }),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
  });
});
