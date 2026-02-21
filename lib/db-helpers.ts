import { prisma } from "@/lib/db";
import { SubscriptionPlan } from "@prisma/client";
import { PLANS } from "./constants";

/**
 * Get user's current usage for the current month
 */
export async function getUserUsage(userId: string) {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  const year = now.getFullYear();

  const usage = await prisma.usage.findUnique({
    where: {
      userId_month_year: {
        userId,
        month,
        year,
      },
    },
  });

  return usage;
}

/**
 * Increment user's usage count
 */
export async function incrementUsage(userId: string) {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const resetAt = new Date(year, month, 1); // First day of next month

  const usage = await prisma.usage.upsert({
    where: {
      userId_month_year: {
        userId,
        month,
        year,
      },
    },
    update: {
      requestCount: {
        increment: 1,
      },
    },
    create: {
      userId,
      month,
      year,
      requestCount: 1,
      resetAt,
    },
  });

  return usage;
}

/**
 * Check if user has exceeded their monthly limit
 */
export async function hasExceededLimit(userId: string): Promise<boolean> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  const plan = subscription?.plan || "FREE";
  const maxRequests = PLANS[plan].maxRequests;

  // Unlimited for enterprise
  if (maxRequests === -1) return false;

  const usage = await getUserUsage(userId);
  const currentUsage = usage?.requestCount || 0;

  return currentUsage >= maxRequests;
}

/**
 * Check usage limits and increment if allowed
 * Returns true if generation is allowed, false if limit exceeded
 */
export async function checkAndIncrementUsage(userId: string): Promise<boolean> {
  const hasExceeded = await hasExceededLimit(userId);

  if (hasExceeded) {
    return false;
  }

  await incrementUsage(userId);
  return true;
}

/**
 * Get user's subscription with plan details
 */
export async function getUserSubscription(userId: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (!subscription) {
    return {
      plan: "FREE" as SubscriptionPlan,
      status: "ACTIVE",
      isActive: true,
      isPro: false,
      maxRequests: PLANS.FREE.maxRequests,
    };
  }

  const planDetails = PLANS[subscription.plan];
  const isActive = subscription.status === "ACTIVE";
  const isPro = subscription.plan === "PRO";

  return {
    ...subscription,
    isActive,
    isPro,
    maxRequests: planDetails.maxRequests,
  };
}

/**
 * Create or update user subscription
 */
export async function upsertSubscription(
  userId: string,
  data: {
    plan?: SubscriptionPlan;
    status?: "ACTIVE" | "CANCELED" | "PAST_DUE" | "INCOMPLETE" | "TRIALING";
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    stripePriceId?: string;
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
  }
) {
  return await prisma.subscription.upsert({
    where: { userId },
    update: data as any,
    create: {
      userId,
      ...data,
    } as any,
  });
}

/**
 * Get user's prompt history with pagination
 */
export async function getPromptHistory(
  userId: string,
  options: {
    skip?: number;
    take?: number;
    model?: string;
  } = {}
) {
  const { skip = 0, take = 10, model } = options;

  return await prisma.promptHistory.findMany({
    where: {
      userId,
      ...(model && { model: model as any }),
    },
    orderBy: {
      createdAt: "desc",
    },
    skip,
    take,
  });
}

/**
 * Create prompt history entry
 */
export async function createPromptHistory(data: {
  userId: string;
  prompt: string;
  response: string;
  model: string;
  tokens?: number;
  cost?: number;
}) {
  return await prisma.promptHistory.create({
    data: {
      ...data,
      model: data.model as any,
    },
  });
}

/**
 * Reset monthly usage for all users (for cron job)
 */
export async function resetMonthlyUsage() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  // Delete old usage records
  await prisma.usage.deleteMany({
    where: {
      OR: [{ year: { lt: year } }, { AND: [{ year }, { month: { lt: month } }] }],
    },
  });

  return { success: true, month, year };
}

/**
 * Get admin statistics
 */
export async function getAdminStats() {
  const [totalUsers, activeSubscriptions, totalRequests, recentUsers] =
    await Promise.all([
      prisma.user.count(),
      prisma.subscription.count({
        where: {
          plan: { not: "FREE" },
          status: "ACTIVE",
        },
      }),
      prisma.promptHistory.count(),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      }),
    ]);

  return {
    totalUsers,
    activeSubscriptions,
    totalRequests,
    recentUsers,
  };
}

/**
 * Search users (admin only)
 */
export async function searchUsers(
  query: string,
  options: { skip?: number; take?: number } = {}
) {
  const { skip = 0, take = 10 } = options;

  return await prisma.user.findMany({
    where: {
      OR: [
        { email: { contains: query, mode: "insensitive" } },
        { name: { contains: query, mode: "insensitive" } },
      ],
    },
    include: {
      subscription: true,
      _count: {
        select: {
          promptHistory: true,
        },
      },
    },
    skip,
    take,
  });
}
