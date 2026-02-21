import { db } from "./db";
import { PLANS } from "./constants";
import { SubscriptionPlan } from "@prisma/client";

/**
 * Get current month and year
 */
function getCurrentMonthYear(): { month: number; year: number } {
  const now = new Date();
  return {
    month: now.getMonth() + 1, // 1-12
    year: now.getFullYear(),
  };
}

/**
 * Get usage for current month
 */
export async function getCurrentUsage(userId: string) {
  const { month, year } = getCurrentMonthYear();

  let usage = await db.usage.findUnique({
    where: {
      userId_month_year: {
        userId,
        month,
        year,
      },
    },
  });

  // Create usage record if doesn't exist
  if (!usage) {
    const resetAt = new Date();
    resetAt.setMonth(resetAt.getMonth() + 1);
    resetAt.setDate(1);
    resetAt.setHours(0, 0, 0, 0);

    usage = await db.usage.create({
      data: {
        userId,
        month,
        year,
        requestCount: 0,
        resetAt,
      },
    });
  }

  return usage;
}

/**
 * Increment usage count
 */
export async function incrementUsage(userId: string): Promise<number> {
  const { month, year } = getCurrentMonthYear();

  // Get or create usage record
  let usage = await getCurrentUsage(userId);

  // Increment count
  usage = await db.usage.update({
    where: { id: usage.id },
    data: {
      requestCount: {
        increment: 1,
      },
    },
  });

  return usage.requestCount;
}

/**
 * Check if user has exceeded their limit
 */
export async function hasExceededLimit(userId: string): Promise<boolean> {
  const usage = await getCurrentUsage(userId);
  const limit = await getUserLimit(userId);

  // -1 means unlimited
  if (limit === -1) return false;

  return usage.requestCount >= limit;
}

/**
 * Get remaining requests for user
 */
export async function getRemainingRequests(userId: string): Promise<number> {
  const usage = await getCurrentUsage(userId);
  const limit = await getUserLimit(userId);

  // -1 means unlimited
  if (limit === -1) return -1;

  const remaining = limit - usage.requestCount;
  return Math.max(0, remaining);
}

/**
 * Get user's request limit based on their plan
 */
export async function getUserLimit(userId: string): Promise<number> {
  const subscription = await db.subscription.findUnique({
    where: { userId },
    select: { plan: true },
  });

  const plan = subscription?.plan || "FREE";
  return getPlanLimit(plan);
}

/**
 * Get request limit for a specific plan
 */
export function getPlanLimit(plan: SubscriptionPlan): number {
  switch (plan) {
    case "FREE":
      return PLANS.FREE.maxRequests;
    case "PRO":
      return PLANS.PRO.maxRequests;
    case "ENTERPRISE":
      return PLANS.ENTERPRISE.maxRequests;
    default:
      return PLANS.FREE.maxRequests;
  }
}

/**
 * Get usage percentage
 */
export async function getUsagePercentage(userId: string): Promise<number> {
  const usage = await getCurrentUsage(userId);
  const limit = await getUserLimit(userId);

  // -1 means unlimited
  if (limit === -1) return 0;

  const percentage = (usage.requestCount / limit) * 100;
  return Math.min(100, Math.round(percentage));
}

/**
 * Check if user needs a usage warning (90% threshold)
 */
export async function shouldSendUsageWarning(userId: string): Promise<boolean> {
  const percentage = await getUsagePercentage(userId);
  return percentage >= 90;
}

/**
 * Reset usage for a specific user (manual reset)
 */
export async function resetUserUsage(userId: string): Promise<void> {
  const { month, year } = getCurrentMonthYear();

  await db.usage.upsert({
    where: {
      userId_month_year: {
        userId,
        month,
        year,
      },
    },
    create: {
      userId,
      month,
      year,
      requestCount: 0,
      resetAt: getNextResetDate(),
    },
    update: {
      requestCount: 0,
      resetAt: getNextResetDate(),
    },
  });
}

/**
 * Reset all users' usage (for cron job on 1st of month)
 */
export async function resetAllUsage(): Promise<number> {
  const { month, year } = getCurrentMonthYear();
  const resetAt = getNextResetDate();

  // Archive old usage by doing nothing - they stay in the database
  // Create new usage records for all users
  const users = await db.user.findMany({
    select: { id: true },
  });

  let resetCount = 0;

  for (const user of users) {
    await db.usage.upsert({
      where: {
        userId_month_year: {
          userId: user.id,
          month,
          year,
        },
      },
      create: {
        userId: user.id,
        month,
        year,
        requestCount: 0,
        resetAt,
      },
      update: {
        requestCount: 0,
        resetAt,
      },
    });
    resetCount++;
  }

  return resetCount;
}

/**
 * Get next reset date (1st of next month)
 */
function getNextResetDate(): Date {
  const resetAt = new Date();
  resetAt.setMonth(resetAt.getMonth() + 1);
  resetAt.setDate(1);
  resetAt.setHours(0, 0, 0, 0);
  return resetAt;
}

/**
 * Get usage history for a user
 */
export async function getUsageHistory(
  userId: string,
  limit: number = 12
): Promise<
  Array<{
    month: number;
    year: number;
    requestCount: number;
    limit: number;
  }>
> {
  const usageRecords = await db.usage.findMany({
    where: { userId },
    orderBy: [{ year: "desc" }, { month: "desc" }],
    take: limit,
  });

  const subscription = await db.subscription.findUnique({
    where: { userId },
    select: { plan: true },
  });

  const plan = subscription?.plan || "FREE";
  const planLimit = getPlanLimit(plan);

  return usageRecords.map((record) => ({
    month: record.month,
    year: record.year,
    requestCount: record.requestCount,
    limit: planLimit,
  }));
}

/**
 * Get total requests across all users
 */
export async function getTotalRequests(): Promise<number> {
  const result = await db.usage.aggregate({
    _sum: {
      requestCount: true,
    },
  });

  return result._sum.requestCount || 0;
}

/**
 * Get usage stats for admin dashboard
 */
export async function getUsageStats() {
  const { month, year } = getCurrentMonthYear();

  const currentMonthUsage = await db.usage.aggregate({
    where: { month, year },
    _sum: {
      requestCount: true,
    },
    _count: {
      userId: true,
    },
  });

  const totalRequests = await getTotalRequests();

  const topUsers = await db.usage.findMany({
    where: { month, year },
    orderBy: { requestCount: "desc" },
    take: 10,
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return {
    currentMonth: {
      requests: currentMonthUsage._sum.requestCount || 0,
      activeUsers: currentMonthUsage._count.userId || 0,
    },
    totalRequests,
    topUsers: topUsers.map((u) => ({
      userName: u.user.name || u.user.email,
      email: u.user.email,
      requests: u.requestCount,
    })),
  };
}

/**
 * Check if usage needs reset (for cron job check)
 */
export async function needsReset(): Promise<boolean> {
  const now = new Date();
  const isFirstOfMonth = now.getDate() === 1;
  const hour = now.getHours();

  // Reset at midnight on the 1st of the month
  return isFirstOfMonth && hour === 0;
}
