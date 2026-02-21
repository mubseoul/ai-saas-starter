import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function DELETE(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Delete all user data in a transaction
    await prisma.$transaction([
      // Delete prompt history
      prisma.promptHistory.deleteMany({
        where: { userId: session.user.id },
      }),
      // Delete usage records
      prisma.usage.deleteMany({
        where: { userId: session.user.id },
      }),
      // Delete subscription
      prisma.subscription.deleteMany({
        where: { userId: session.user.id },
      }),
      // Delete sessions
      prisma.session.deleteMany({
        where: { userId: session.user.id },
      }),
      // Delete accounts (OAuth)
      prisma.account.deleteMany({
        where: { userId: session.user.id },
      }),
      // Finally, delete the user
      prisma.user.delete({
        where: { id: session.user.id },
      }),
    ]);

    return NextResponse.json({
      message: "Account deleted successfully",
    });
  } catch (error: any) {
    console.error("Account deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
