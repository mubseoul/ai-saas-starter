import { prisma } from "@/lib/db";
import { nanoid } from "nanoid";

const PASSWORD_RESET_EXPIRY = 60 * 60 * 1000; // 1 hour
const EMAIL_VERIFY_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

export async function generatePasswordResetToken(email: string) {
  const token = nanoid(48);
  const expires = new Date(Date.now() + PASSWORD_RESET_EXPIRY);

  // Delete any existing tokens for this email
  await prisma.verificationToken.deleteMany({
    where: { identifier: `password-reset:${email}` },
  });

  await prisma.verificationToken.create({
    data: {
      identifier: `password-reset:${email}`,
      token,
      expires,
    },
  });

  return token;
}

export async function validatePasswordResetToken(token: string) {
  const record = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!record) return null;
  if (!record.identifier.startsWith("password-reset:")) return null;
  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token } });
    return null;
  }

  const email = record.identifier.replace("password-reset:", "");
  return { email, token };
}

export async function consumePasswordResetToken(token: string) {
  const result = await validatePasswordResetToken(token);
  if (!result) return null;

  await prisma.verificationToken.delete({ where: { token } });
  return result;
}

export async function generateEmailVerificationToken(email: string) {
  const token = nanoid(48);
  const expires = new Date(Date.now() + EMAIL_VERIFY_EXPIRY);

  await prisma.verificationToken.deleteMany({
    where: { identifier: `email-verify:${email}` },
  });

  await prisma.verificationToken.create({
    data: {
      identifier: `email-verify:${email}`,
      token,
      expires,
    },
  });

  return token;
}

export async function consumeEmailVerificationToken(token: string) {
  const record = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!record) return null;
  if (!record.identifier.startsWith("email-verify:")) return null;
  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token } });
    return null;
  }

  const email = record.identifier.replace("email-verify:", "");
  await prisma.verificationToken.delete({ where: { token } });
  return { email };
}
