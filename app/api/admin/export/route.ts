import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "users";

    if (type === "users") {
      const users = await prisma.user.findMany({
        include: {
          subscription: { select: { plan: true, status: true } },
          _count: { select: { promptHistory: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      const headers = ["ID", "Name", "Email", "Role", "Plan", "Status", "Generations", "Created At"];
      const csvRows = [
        headers.join(","),
        ...users.map((u) =>
          [
            u.id,
            `"${(u.name || "").replace(/"/g, '""')}"`,
            u.email,
            u.role,
            u.subscription?.plan || "FREE",
            u.subscription?.status || "ACTIVE",
            u._count.promptHistory,
            u.createdAt.toISOString(),
          ].join(",")
        ),
      ];

      return new NextResponse(csvRows.join("\n"), {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="users-export-${Date.now()}.csv"`,
        },
      });
    }

    if (type === "analytics") {
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();

      const usageData = await prisma.usage.findMany({
        where: { month, year },
        include: {
          user: { select: { name: true, email: true } },
        },
        orderBy: { requestCount: "desc" },
      });

      const headers = ["User", "Email", "Requests", "Month", "Year"];
      const csvRows = [
        headers.join(","),
        ...usageData.map((u) =>
          [
            `"${(u.user.name || "").replace(/"/g, '""')}"`,
            u.user.email,
            u.requestCount,
            u.month,
            u.year,
          ].join(",")
        ),
      ];

      return new NextResponse(csvRows.join("\n"), {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="analytics-export-${Date.now()}.csv"`,
        },
      });
    }

    return NextResponse.json({ error: "Invalid export type" }, { status: 400 });
  } catch (error) {
    console.error("Admin export error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
