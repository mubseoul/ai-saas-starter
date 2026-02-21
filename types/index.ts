import { User, Subscription, Usage, PromptHistory } from "@prisma/client";

// Re-export Prisma types
export type {
  User,
  Account,
  Session,
  VerificationToken,
  Subscription,
  Usage,
  PromptHistory,
  ApiKey,
  UserRole,
  SubscriptionPlan,
  SubscriptionStatus,
  AIModel,
} from "@prisma/client";

// Extended types with relations
export type UserWithSubscription = User & {
  subscription: Subscription | null;
};

export type UserWithUsage = User & {
  subscription: Subscription | null;
  usage: Usage[];
};

export type SubscriptionWithUser = Subscription & {
  user: User;
};

export type PromptWithUser = PromptHistory & {
  user: User;
};

// API Response types
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

// Form types
export type LoginFormData = {
  email: string;
  password: string;
};

export type SignupFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type AIGenerateRequest = {
  prompt: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
};

export type AIGenerateResponse = {
  response: string;
  tokens?: number;
  cost?: number;
  model: string;
};

// Usage stats type
export type UsageStats = {
  current: number;
  limit: number;
  percentage: number;
  resetDate: Date;
};

// Admin stats type
export type AdminStats = {
  totalUsers: number;
  activeSubscriptions: number;
  totalRequests: number;
  revenue?: number;
  recentUsers: Partial<User>[];
};
