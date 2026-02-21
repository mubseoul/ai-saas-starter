import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format") || "csv";

    const history = await prisma.promptHistory.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    if (format === "json") {
      return new NextResponse(JSON.stringify(history, null, 2), {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="prompt-history-${Date.now()}.json"`,
        },
      });
    }

    // CSV format
    const headers = ["ID", "Prompt", "Response", "Model", "Tokens", "Cost (USD)", "Created At"];
    const csvRows = [
      headers.join(","),
      ...history.map((item) =>
        [
          item.id,
          `"${item.prompt.replace(/"/g, '""')}"`,
          `"${item.response.replace(/"/g, '""')}"`,
          item.model,
          item.tokens || "",
          item.cost ? (item.cost / 100).toFixed(4) : "",
          item.createdAt.toISOString(),
        ].join(",")
      ),
    ];

    return new NextResponse(csvRows.join("\n"), {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="prompt-history-${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    console.error("Export history error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
