import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    // User growth (last 6 months)
    const userGrowth = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const count = await prisma.user.count({
        where: { createdAt: { gte: date, lt: nextDate } },
      });
      userGrowth.push({
        month: date.toLocaleString("default", { month: "short" }),
        year: date.getFullYear(),
        count,
      });
    }

    // Usage by month (last 6 months)
    const usageByMonth = await prisma.usage.groupBy({
      by: ["month", "year"],
      _sum: { requestCount: true },
      where: {
        OR: Array.from({ length: 6 }, (_, i) => {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          return { month: d.getMonth() + 1, year: d.getFullYear() };
        }),
      },
      orderBy: [{ year: "asc" }, { month: "asc" }],
    });

    // Plan distribution
    const planDistribution = await prisma.subscription.groupBy({
      by: ["plan"],
      _count: { plan: true },
      where: { status: "ACTIVE" },
    });

    // Conversion rate
    const totalUsers = await prisma.user.count();
    const paidUsers = await prisma.subscription.count({
      where: { plan: { not: "FREE" }, status: "ACTIVE" },
    });
    const conversionRate = totalUsers > 0 ? ((paidUsers / totalUsers) * 100).toFixed(1) : "0";

    // Top users this month
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const topUsers = await prisma.usage.findMany({
      where: { month: currentMonth, year: currentYear },
      orderBy: { requestCount: "desc" },
      take: 10,
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    // Revenue estimate (based on active paid subscriptions)
    const proCount = await prisma.subscription.count({
      where: { plan: "PRO", status: "ACTIVE" },
    });

    return NextResponse.json({
      userGrowth,
      usageByMonth: usageByMonth.map((u) => ({
        month: new Date(u.year, u.month - 1).toLocaleString("default", { month: "short" }),
        year: u.year,
        requests: u._sum.requestCount || 0,
      })),
      planDistribution: planDistribution.map((p) => ({
        plan: p.plan,
        count: p._count.plan,
      })),
      conversionRate: parseFloat(conversionRate),
      topUsers: topUsers.map((u) => ({
        name: u.user.name || u.user.email,
        email: u.user.email,
        requests: u.requestCount,
      })),
      revenue: {
        mrr: proCount * 29,
        proSubscribers: proCount,
      },
    });
  } catch (error) {
    console.error("Admin analytics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
