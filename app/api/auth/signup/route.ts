import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { sendWelcomeEmail } from "@/lib/email";
import { generateEmailVerificationToken } from "@/lib/tokens";
import { sendEmail } from "@/lib/email";

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = signupSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        subscription: {
          create: {
            plan: "FREE",
            status: "ACTIVE",
          },
        },
      },
    });

    // Send welcome email and verification email (async)
    sendWelcomeEmail(email, name).catch((error) => {
      console.error("Failed to send welcome email:", error);
    });

    generateEmailVerificationToken(email)
      .then((token) => {
        const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;
        return sendEmail({
          to: email,
          subject: "Verify Your Email - AI SaaS Starter",
          html: `
            <!DOCTYPE html>
            <html>
              <head><meta charset="utf-8"><style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px}.header{text-align:center;padding:20px 0;border-bottom:2px solid #330df2}.header h1{margin:0;color:#330df2}.content{padding:30px 0}.button{display:inline-block;padding:12px 30px;background-color:#330df2;color:white;text-decoration:none;border-radius:6px;margin:20px 0}.footer{text-align:center;padding:20px 0;border-top:1px solid #eee;color:#666;font-size:14px}</style></head>
              <body>
                <div class="header"><h1>Verify Your Email</h1></div>
                <div class="content">
                  <p>Hi ${name},</p>
                  <p>Please verify your email address by clicking the button below:</p>
                  <center><a href="${verifyUrl}" class="button">Verify Email</a></center>
                  <p style="font-size:14px;color:#666;">This link expires in 24 hours.</p>
                </div>
                <div class="footer"><p>AI SaaS Starter</p></div>
              </body>
            </html>
          `,
        });
      })
      .catch((error) => {
        console.error("Failed to send verification email:", error);
      });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
