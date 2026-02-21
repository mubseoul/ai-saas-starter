import { PrismaClient, UserRole, SubscriptionPlan, AIModel } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data (optional - comment out if you want to preserve data)
  console.log("🗑️  Clearing existing data...");
  await prisma.promptHistory.deleteMany();
  await prisma.usage.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.apiKey.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Hash password for test users
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Create Admin User
  console.log("👤 Creating admin user...");
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: UserRole.ADMIN,
      emailVerified: new Date(),
      subscription: {
        create: {
          plan: SubscriptionPlan.PRO,
          status: "ACTIVE",
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(
            new Date().setMonth(new Date().getMonth() + 1)
          ),
        },
      },
    },
  });

  // Create Pro User
  console.log("👤 Creating pro user...");
  const proUser = await prisma.user.create({
    data: {
      name: "Pro User",
      email: "pro@example.com",
      password: hashedPassword,
      role: UserRole.USER,
      emailVerified: new Date(),
      subscription: {
        create: {
          plan: SubscriptionPlan.PRO,
          status: "ACTIVE",
          stripeCustomerId: "cus_test_pro_user",
          stripeSubscriptionId: "sub_test_pro_user",
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(
            new Date().setMonth(new Date().getMonth() + 1)
          ),
        },
      },
    },
  });

  // Create Free Users
  console.log("👤 Creating free users...");
  const freeUser1 = await prisma.user.create({
    data: {
      name: "Free User",
      email: "free@example.com",
      password: hashedPassword,
      role: UserRole.USER,
      emailVerified: new Date(),
      subscription: {
        create: {
          plan: SubscriptionPlan.FREE,
          status: "ACTIVE",
        },
      },
    },
  });

  const freeUser2 = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
      password: hashedPassword,
      role: UserRole.USER,
      emailVerified: new Date(),
      subscription: {
        create: {
          plan: SubscriptionPlan.FREE,
          status: "ACTIVE",
        },
      },
    },
  });

  // Create Usage Records
  console.log("📊 Creating usage records...");
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const resetAt = new Date(year, month, 1);

  await prisma.usage.createMany({
    data: [
      {
        userId: admin.id,
        month,
        year,
        requestCount: 150,
        resetAt,
      },
      {
        userId: proUser.id,
        month,
        year,
        requestCount: 47,
        resetAt,
      },
      {
        userId: freeUser1.id,
        month,
        year,
        requestCount: 8,
        resetAt,
      },
      {
        userId: freeUser2.id,
        month,
        year,
        requestCount: 3,
        resetAt,
      },
    ],
  });

  // Create Prompt History
  console.log("💬 Creating prompt history...");
  await prisma.promptHistory.createMany({
    data: [
      {
        userId: admin.id,
        prompt: "Write a short poem about AI",
        response:
          "In circuits deep and code so bright,\nAI awakens to the light,\nLearning, growing, day by day,\nHelping humans find their way.",
        model: AIModel.GPT_4,
        tokens: 150,
        cost: 0.0045,
      },
      {
        userId: proUser.id,
        prompt: "Explain quantum computing in simple terms",
        response:
          "Quantum computing uses the principles of quantum mechanics to process information in fundamentally different ways than classical computers. Instead of bits that are either 0 or 1, quantum computers use qubits that can be in multiple states simultaneously (superposition), allowing them to solve certain complex problems much faster.",
        model: AIModel.CLAUDE_SONNET,
        tokens: 280,
        cost: 0.00084,
      },
      {
        userId: proUser.id,
        prompt: "Generate a product description for smart headphones",
        response:
          "Introducing the SoundWave Pro: Premium wireless headphones featuring active noise cancellation, 30-hour battery life, and crystal-clear audio quality. With ergonomic design and touch controls, experience music like never before. Perfect for work, travel, or relaxation.",
        model: AIModel.GPT_3_5_TURBO,
        tokens: 220,
        cost: 0.00044,
      },
      {
        userId: freeUser1.id,
        prompt: "Write a tagline for a coffee shop",
        response:
          "Brew Your Day Better - Where Every Cup Tells a Story",
        model: AIModel.CLAUDE_HAIKU,
        tokens: 80,
        cost: 0.00002,
      },
      {
        userId: freeUser2.id,
        prompt: "Give me 3 blog post ideas about productivity",
        response:
          "1. The 5 AM Club: How Early Rising Transforms Your Productivity\n2. Digital Minimalism: Declutter Your Digital Life for Better Focus\n3. The Pomodoro Technique Reimagined: Modern Time Management Strategies",
        model: AIModel.GPT_4,
        tokens: 195,
        cost: 0.00585,
      },
    ],
  });

  // Create API Keys (for admin and pro user)
  console.log("🔑 Creating API keys...");
  await prisma.apiKey.createMany({
    data: [
      {
        userId: admin.id,
        name: "Production Key",
        key: "sk_live_admin_" + Math.random().toString(36).substring(7),
        lastUsed: new Date(),
      },
      {
        userId: proUser.id,
        name: "Development Key",
        key: "sk_test_pro_" + Math.random().toString(36).substring(7),
      },
    ],
  });

  console.log("✅ Database seeded successfully!");
  console.log("\n📝 Test Accounts:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Admin:");
  console.log("  Email: admin@example.com");
  console.log("  Password: password123");
  console.log("\nPro User:");
  console.log("  Email: pro@example.com");
  console.log("  Password: password123");
  console.log("\nFree User:");
  console.log("  Email: free@example.com");
  console.log("  Password: password123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
