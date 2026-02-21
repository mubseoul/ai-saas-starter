// Subscription Plans and Limits
export const PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    maxRequests: 10,
    features: [
      "10 AI requests per month",
      "Email authentication",
      "Basic dashboard",
      "Community support",
      "All core features",
    ],
  },
  PRO: {
    name: "Pro",
    price: 2900, // in cents ($29.00)
    maxRequests: 1000,
    features: [
      "1,000 AI requests per month",
      "Priority support",
      "Advanced analytics",
      "Custom branding",
      "Early access to features",
      "Everything in Free",
    ],
  },
  ENTERPRISE: {
    name: "Enterprise",
    price: null, // Custom pricing
    maxRequests: -1, // Unlimited
    features: [
      "Unlimited requests",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantee",
      "Everything in Pro",
    ],
  },
} as const;

// AI Model Configuration
export const AI_MODELS = {
  GPT_4: {
    name: "GPT-4",
    provider: "openai",
    maxTokens: 8192,
    costPer1kTokens: 0.03, // in USD
  },
  GPT_3_5_TURBO: {
    name: "GPT-3.5 Turbo",
    provider: "openai",
    maxTokens: 4096,
    costPer1kTokens: 0.002,
  },
  CLAUDE_SONNET: {
    name: "Claude Sonnet",
    provider: "anthropic",
    maxTokens: 4096,
    costPer1kTokens: 0.003,
  },
  CLAUDE_HAIKU: {
    name: "Claude Haiku",
    provider: "anthropic",
    maxTokens: 4096,
    costPer1kTokens: 0.00025,
  },
} as const;

// User Roles
export const USER_ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;

// Subscription Status
export const SUBSCRIPTION_STATUS = {
  ACTIVE: "ACTIVE",
  CANCELED: "CANCELED",
  PAST_DUE: "PAST_DUE",
  INCOMPLETE: "INCOMPLETE",
  TRIALING: "TRIALING",
} as const;

// App Configuration
export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "AI SaaS Starter",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  description:
    "Production-ready AI SaaS starter kit with authentication, payments, and AI integration",
  maxPromptLength: 2000,
  maxResponseLength: 4000,
} as const;

// API Rate Limits (requests per minute)
export const RATE_LIMITS = {
  FREE: 5,
  PRO: 30,
  ENTERPRISE: 100,
  ANONYMOUS: 3,
} as const;
