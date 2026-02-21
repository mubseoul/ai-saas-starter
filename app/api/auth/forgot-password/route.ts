import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendEmail } from "@/lib/email";
import { authRateLimiter, getClientIdentifier } from "@/lib/rate-limit";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const limiter = await authRateLimiter.check(getClientIdentifier(req), 5);
    if (!limiter.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email } = schema.parse(body);

    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success to prevent email enumeration
    if (!user || !user.password) {
      return NextResponse.json({ success: true });
    }

    const token = await generatePasswordResetToken(email);
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    await sendEmail({
      to: email,
      subject: "Reset Your Password - AI SaaS Starter",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #330df2; }
              .header h1 { margin: 0; color: #330df2; }
              .content { padding: 30px 0; }
              .button { display: inline-block; padding: 12px 30px; background-color: #330df2; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
              .footer { text-align: center; padding: 20px 0; border-top: 1px solid #eee; color: #666; font-size: 14px; }
              .warning { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0; border-radius: 4px; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="header"><h1>Password Reset</h1></div>
            <div class="content">
              <p>Hi ${user.name || "there"},</p>
              <p>We received a request to reset your password. Click the button below to choose a new password:</p>
              <center><a href="${resetUrl}" class="button">Reset Password</a></center>
              <div class="warning">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</div>
              <p>Or copy and paste this URL into your browser:</p>
              <p style="word-break: break-all; font-size: 14px; color: #666;">${resetUrl}</p>
            </div>
            <div class="footer"><p>AI SaaS Starter</p></div>
          </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
