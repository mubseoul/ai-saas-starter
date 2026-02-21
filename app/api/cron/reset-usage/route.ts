import { NextResponse } from "next/server";
import { resetMonthlyUsage } from "@/lib/db-helpers";

/**
 * Vercel Cron Job endpoint for monthly usage reset.
 * Configure in vercel.json with: "crons": [{ "path": "/api/cron/reset-usage", "schedule": "0 0 1 * *" }]
 */
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");

    // In production, verify the request comes from Vercel Cron
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await resetMonthlyUsage();

    return NextResponse.json({
      success: true,
      message: `Usage reset complete for ${result.month}/${result.year}`,
    });
  } catch (error) {
    console.error("Cron reset-usage error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
