import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * Get the current session on the server
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

/**
 * Get the current session (alias for getCurrentUser)
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Check if the current user is authenticated
 */
export async function isAuthenticated() {
  const session = await getServerSession(authOptions);
  return !!session?.user;
}

/**
 * Check if the current user is an admin
 */
export async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "ADMIN";
}

/**
 * Get full user data from database
 */
export async function getUserFromDb(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      subscription: true,
    },
  });
}

/**
 * Require authentication - throws error if not authenticated
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

/**
 * Require admin - throws error if not admin
 */
export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("Forbidden: Admin access required");
  }
  return user;
}
