import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { generateSEO } from "@/lib/seo";
import {
  ArrowLeft,
  Code,
  Zap,
  Shield,
  Users,
  Heart,
  Rocket,
} from "lucide-react";

export const metadata = generateSEO({
  title: "About",
  description:
    "Learn about AI SaaS Starter Kit - the open-source boilerplate helping developers launch AI products faster.",
});

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Hero */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
              About AI SaaS Starter
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Built by developers, for developers. Our mission is to help you
              ship AI products faster by providing a production-ready foundation.
            </p>
          </div>

          {/* Mission */}
          <section className="mb-16">
            <div className="mb-8 rounded-lg bg-gradient-to-r from-primary/10 to-purple-600/10 p-8">
              <h2 className="mb-4 text-2xl font-bold">Our Mission</h2>
              <p className="text-lg text-muted-foreground">
                To empower developers and entrepreneurs to build AI-powered SaaS
                products without spending weeks on boilerplate code. We believe
                you should focus on your unique value proposition, not
                reinventing authentication, payments, and user management.
              </p>
            </div>
          </section>

          {/* Values */}
          <section className="mb-16">
            <h2 className="mb-8 text-center text-3xl font-bold">Our Values</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Open Source</h3>
                <p className="text-muted-foreground">
                  100% open source with MIT license. Use it for any project,
                  commercial or personal.
                </p>
              </Card>

              <Card className="p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Developer First</h3>
                <p className="text-muted-foreground">
                  Built with the latest technologies and best practices. Clean
                  code, excellent documentation.
                </p>
              </Card>

              <Card className="p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Production Ready</h3>
                <p className="text-muted-foreground">
                  Enterprise-grade security, performance optimizations, and error
                  handling out of the box.
                </p>
              </Card>

              <Card className="p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Community Driven</h3>
                <p className="text-muted-foreground">
                  Built with community feedback and contributions. Your input
                  shapes the roadmap.
                </p>
              </Card>

              <Card className="p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Free Forever</h3>
                <p className="text-muted-foreground">
                  The starter kit will always be free and open source. No hidden
                  costs or paywalls.
                </p>
              </Card>

              <Card className="p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Rocket className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Ship Faster</h3>
                <p className="text-muted-foreground">
                  Focus on your unique features. We handle the foundation so you
                  can launch in days, not months.
                </p>
              </Card>
            </div>
          </section>

          {/* Story */}
          <section className="mb-16">
            <h2 className="mb-8 text-center text-3xl font-bold">Our Story</h2>
            <Card className="p-8">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p>
                  AI SaaS Starter was born from frustration. After building
                  multiple SaaS products from scratch, we realized we were
                  spending 60-70% of our time on the same boilerplate features:
                  authentication, user management, subscriptions, and payments.
                </p>
                <p>
                  We decided to build the starter kit we wished existed -
                  something that handles all the boring stuff perfectly, so
                  developers can focus on their unique AI features and business
                  logic.
                </p>
                <p>
                  What started as an internal tool is now used by hundreds of
                  developers to launch their AI products. We&apos;re committed to
                  keeping it open source and continuously improving it based on
                  community feedback.
                </p>
              </div>
            </Card>
          </section>

          {/* Tech Stack */}
          <section className="mb-16">
            <h2 className="mb-8 text-center text-3xl font-bold">
              Technology Stack
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-semibold">Frontend</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Next.js 14 (App Router)</li>
                  <li>• React 18</li>
                  <li>• TypeScript</li>
                  <li>• Tailwind CSS</li>
                  <li>• Radix UI</li>
                </ul>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-semibold">Backend</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Next.js API Routes</li>
                  <li>• PostgreSQL</li>
                  <li>• Prisma ORM</li>
                  <li>• NextAuth.js</li>
                </ul>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-semibold">AI & Payments</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• OpenAI API</li>
                  <li>• Anthropic Claude</li>
                  <li>• Stripe</li>
                </ul>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-semibold">Infrastructure</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Vercel (hosting)</li>
                  <li>• Vercel Analytics</li>
                  <li>• Resend (email)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <div className="rounded-lg bg-muted/50 p-8">
              <h2 className="mb-4 text-2xl font-bold">Ready to Build?</h2>
              <p className="mb-6 text-muted-foreground">
                Join developers who are shipping AI products faster with our
                starter kit.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button asChild size="lg">
                  <Link href="/signup">Get Started Free</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on GitHub
                  </a>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
