import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { nanoid } from "nanoid";
import { z } from "zod";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const keys = await prisma.apiKey.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        name: true,
        key: true,
        lastUsed: true,
        createdAt: true,
        expiresAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Mask API keys (only show last 8 chars)
    const maskedKeys = keys.map((k) => ({
      ...k,
      key: `sk-...${k.key.slice(-8)}`,
    }));

    return NextResponse.json({ keys: maskedKeys });
  } catch (error) {
    console.error("Get API keys error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

const createSchema = z.object({
  name: z.string().min(1).max(64),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name } = createSchema.parse(body);

    const existingCount = await prisma.apiKey.count({
      where: { userId: session.user.id },
    });

    if (existingCount >= 5) {
      return NextResponse.json(
        { error: "Maximum 5 API keys allowed" },
        { status: 400 }
      );
    }

    const rawKey = `sk-${nanoid(48)}`;

    const apiKey = await prisma.apiKey.create({
      data: {
        userId: session.user.id,
        name,
        key: rawKey,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      },
    });

    // Return the full key only on creation
    return NextResponse.json({
      key: {
        id: apiKey.id,
        name: apiKey.name,
        key: rawKey,
        createdAt: apiKey.createdAt,
        expiresAt: apiKey.expiresAt,
      },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    console.error("Create API key error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const keyId = searchParams.get("id");

    if (!keyId) {
      return NextResponse.json({ error: "Key ID required" }, { status: 400 });
    }

    const key = await prisma.apiKey.findFirst({
      where: { id: keyId, userId: session.user.id },
    });

    if (!key) {
      return NextResponse.json({ error: "Key not found" }, { status: 404 });
    }

    await prisma.apiKey.delete({ where: { id: keyId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete API key error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
