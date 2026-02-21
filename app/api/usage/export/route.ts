import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(_req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const usageRecords = await prisma.usage.findMany({
      where: { userId: session.user.id },
      orderBy: [{ year: "desc" }, { month: "desc" }],
    });

    const headers = ["Month", "Year", "Request Count", "Reset At"];
    const csvRows = [
      headers.join(","),
      ...usageRecords.map((record) =>
        [
          record.month,
          record.year,
          record.requestCount,
          record.resetAt.toISOString(),
        ].join(",")
      ),
    ];

    return new NextResponse(csvRows.join("\n"), {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="usage-report-${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    console.error("Export usage error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
