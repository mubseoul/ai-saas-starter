/**
 * @jest-environment node
 */

import { POST } from '@/app/api/auth/forgot-password/route';

jest.mock('@/lib/db', () => ({
  prisma: {
    user: { findUnique: jest.fn() },
  },
}));

jest.mock('@/lib/tokens', () => ({
  generatePasswordResetToken: jest.fn().mockResolvedValue('reset-token-123'),
}));

jest.mock('@/lib/email', () => ({
  sendEmail: jest.fn().mockResolvedValue({ success: true }),
}));

jest.mock('@/lib/rate-limit', () => ({
  authRateLimiter: {
    check: jest.fn().mockResolvedValue({ success: true, remaining: 4, reset: Date.now() + 60000 }),
  },
  getClientIdentifier: jest.fn().mockReturnValue('test-client'),
}));

const { prisma } = require('@/lib/db');

describe('POST /api/auth/forgot-password', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return success even if user does not exist (prevent enumeration)', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    const req = new Request('http://localhost:3000/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nonexistent@example.com' }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('should send reset email for existing user', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test',
      password: 'hashed',
    });

    const { sendEmail } = require('@/lib/email');

    const req = new Request('http://localhost:3000/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' }),
    });

    const response = await POST(req);
    expect(response.status).toBe(200);
    expect(sendEmail).toHaveBeenCalled();
  });

  it('should return 400 for invalid email', async () => {
    const req = new Request('http://localhost:3000/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'not-email' }),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
  });
});
