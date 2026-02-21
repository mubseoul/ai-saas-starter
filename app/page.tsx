import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { pageMetadata } from "@/lib/seo";
import { MobileMenu } from "@/components/landing/mobile-menu";
import {
  Code,
  CreditCard,
  Users,
  Check,
  ArrowRight,
  Brain,
  Lock,
  TrendingUp,
} from "lucide-react";

export const metadata = pageMetadata.home;

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Skip to main content - accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to main content
      </a>

      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" role="banner">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xl font-bold sm:text-2xl" aria-label="AI SaaS Starter - Home">AI SaaS Starter</Link>
          </div>
          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
            <Link
              href="#features"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              How It Works
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Pricing
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Sign In
            </Link>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </nav>
          {/* Mobile nav */}
          <div className="flex items-center gap-3 md:hidden">
            <Button asChild size="sm">
              <Link href="/signup">Get Started</Link>
            </Button>
            <MobileMenu />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main id="main-content" className="flex-1" role="main">
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
          <div className="container flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-8 py-20 text-center">
            <div className="mx-auto max-w-3xl space-y-6">
              <Badge variant="outline" className="mb-4">
                🚀 Open Source • Production Ready • MIT License
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
                Build Your AI SaaS in{" "}
                <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                  Hours, Not Weeks
                </span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
                Production-ready Next.js 14 starter with authentication, AI
                integration, payments, and everything you need to launch your AI
                product.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button size="lg" asChild className="group">
                  <Link href="/signup">
                    Start Building Free
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#features">View Features</Link>
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 gap-8 text-center md:grid-cols-4">
              <div>
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Components</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">23</div>
                <div className="text-sm text-muted-foreground">Pages</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">TypeScript</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">4</div>
                <div className="text-sm text-muted-foreground">AI Models</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container py-20">
          <div className="mx-auto max-w-6xl space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Everything You Need to Launch
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Stop reinventing the wheel. Focus on your unique AI features.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="p-6 transition-all hover:shadow-lg">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">AI Integration</h3>
                <p className="text-muted-foreground">
                  Pre-integrated with OpenAI (GPT-4, GPT-3.5) and Anthropic
                  (Claude). Switch models with a single click.
                </p>
              </Card>

              <Card className="p-6 transition-all hover:shadow-lg">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Authentication</h3>
                <p className="text-muted-foreground">
                  NextAuth with Google OAuth and email/password. Secure,
                  scalable, and ready to use.
                </p>
              </Card>

              <Card className="p-6 transition-all hover:shadow-lg">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  Stripe Payments
                </h3>
                <p className="text-muted-foreground">
                  Complete subscription management with checkout, webhooks, and
                  customer portal built-in.
                </p>
              </Card>

              <Card className="p-6 transition-all hover:shadow-lg">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Usage Tracking</h3>
                <p className="text-muted-foreground">
                  Automatic usage tracking with monthly limits. Enforce plan
                  restrictions effortlessly.
                </p>
              </Card>

              <Card className="p-6 transition-all hover:shadow-lg">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Admin Dashboard</h3>
                <p className="text-muted-foreground">
                  Manage users, view analytics, and monitor your business with a
                  powerful admin panel.
                </p>
              </Card>

              <Card className="p-6 transition-all hover:shadow-lg">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Modern Stack</h3>
                <p className="text-muted-foreground">
                  Next.js 14, TypeScript, Tailwind CSS, Prisma, and more. Best
                  practices out of the box.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="bg-muted/50 py-20">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Get Started in 3 Steps
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                From zero to deployed in minutes
              </p>
            </div>

            <div className="mt-16 grid gap-12 md:grid-cols-3">
              <div className="relative text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  1
                </div>
                <h3 className="mb-2 text-xl font-semibold">Clone & Install</h3>
                <p className="text-muted-foreground">
                  Clone the repository, run npm install, and configure your
                  environment variables.
                </p>
              </div>

              <div className="relative text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  2
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  Customize & Build
                </h3>
                <p className="text-muted-foreground">
                  Add your branding, customize features, and build your unique AI
                  capabilities.
                </p>
              </div>

              <div className="relative text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  3
                </div>
                <h3 className="mb-2 text-xl font-semibold">Deploy & Scale</h3>
                <p className="text-muted-foreground">
                  Deploy to Vercel with one click and scale to thousands of users
                  effortlessly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof / Testimonials */}
        <section className="container py-20">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Trusted by Developers
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Join developers shipping AI products faster
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <Card className="p-6">
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500">
                      ★
                    </span>
                  ))}
                </div>
                <p className="mb-4 text-muted-foreground">
                  &quot;Saved me weeks of development. The authentication and
                  payment integration alone is worth it.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10" />
                  <div>
                    <div className="font-semibold">Sarah Johnson</div>
                    <div className="text-sm text-muted-foreground">
                      Indie Hacker
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500">
                      ★
                    </span>
                  ))}
                </div>
                <p className="mb-4 text-muted-foreground">
                  &quot;Clean code, excellent documentation, and production-ready.
                  Exactly what I needed for my AI startup.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10" />
                  <div>
                    <div className="font-semibold">Michael Chen</div>
                    <div className="text-sm text-muted-foreground">
                      Startup Founder
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500">
                      ★
                    </span>
                  ))}
                </div>
                <p className="mb-4 text-muted-foreground">
                  &quot;The admin dashboard and usage tracking saved me countless
                  hours. Best SaaS starter I&apos;ve used.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10" />
                  <div>
                    <div className="font-semibold">Emily Rodriguez</div>
                    <div className="text-sm text-muted-foreground">
                      Full-Stack Developer
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Preview */}
        <section className="bg-muted/50 py-20">
          <div className="container mx-auto max-w-6xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Start free and scale as you grow
            </p>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <Card className="p-8 text-left">
                <h3 className="mb-2 text-2xl font-bold">Free</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="mb-6 space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="mt-1 h-4 w-4 text-primary" />
                    <span>10 AI requests/month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-1 h-4 w-4 text-primary" />
                    <span>All AI models</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-1 h-4 w-4 text-primary" />
                    <span>Basic support</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/signup">Get Started</Link>
                </Button>
              </Card>

              <Card className="border-primary p-8 text-left shadow-lg">
                <Badge className="mb-2">Most Popular</Badge>
                <h3 className="mb-2 text-2xl font-bold">Pro</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">$29</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="mb-6 space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="mt-1 h-4 w-4 text-primary" />
                    <span>1,000 AI requests/month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-1 h-4 w-4 text-primary" />
                    <span>Priority processing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-1 h-4 w-4 text-primary" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-1 h-4 w-4 text-primary" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Button className="w-full" asChild>
                  <Link href="/signup">Start Free Trial</Link>
                </Button>
              </Card>

              <Card className="p-8 text-left">
                <h3 className="mb-2 text-2xl font-bold">Enterprise</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">Custom</span>
                </div>
                <ul className="mb-6 space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="mt-1 h-4 w-4 text-primary" />
                    <span>Unlimited AI requests</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-1 h-4 w-4 text-primary" />
                    <span>Custom integrations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-1 h-4 w-4 text-primary" />
                    <span>Dedicated support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-1 h-4 w-4 text-primary" />
                    <span>SLA guarantee</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/pricing">Contact Sales</Link>
                </Button>
              </Card>
            </div>

            <div className="mt-8">
              <Link
                href="/pricing"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                View full pricing details
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container py-20">
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Everything you need to know
              </p>
            </div>

            <div className="mt-12 space-y-6">
              <Card className="p-6">
                <h3 className="mb-2 text-lg font-semibold">
                  What AI models are supported?
                </h3>
                <p className="text-muted-foreground">
                  We support OpenAI&apos;s GPT-4 and GPT-3.5 Turbo, as well as
                  Anthropic&apos;s Claude Sonnet and Haiku models. You can easily
                  switch between them or add new providers.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="mb-2 text-lg font-semibold">
                  Is the code open source?
                </h3>
                <p className="text-muted-foreground">
                  Yes! This is a completely open-source starter kit with an MIT
                  license. You can use it for any project, commercial or personal.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="mb-2 text-lg font-semibold">
                  Do I need to know how to code?
                </h3>
                <p className="text-muted-foreground">
                  Yes, this is a developer-focused starter kit. You&apos;ll need
                  knowledge of Next.js, React, and TypeScript to customize and
                  deploy it effectively.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="mb-2 text-lg font-semibold">
                  What about deployment?
                </h3>
                <p className="text-muted-foreground">
                  The starter is optimized for Vercel deployment but works with any
                  hosting platform that supports Next.js. Full deployment guides are
                  included in the documentation.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="mb-2 text-lg font-semibold">
                  Can I get support?
                </h3>
                <p className="text-muted-foreground">
                  Yes! We provide community support through GitHub issues. Pro and
                  Enterprise users get priority email support and dedicated help.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-gradient-to-r from-primary to-purple-600 py-20 text-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Ready to Build Your AI SaaS?
            </h2>
            <p className="mt-4 text-lg text-white/90">
              Join developers who are shipping AI products faster with our starter
              kit.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="group"
              >
                <Link href="/signup">
                  Start Building Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-transparent text-white border-white hover:bg-white/10">
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-white/80">
              No credit card required • 10 free requests to get started
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50" role="contentinfo">
        <div className="container py-12">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-lg font-semibold">AI SaaS Starter</h3>
              <p className="text-sm text-muted-foreground">
                Production-ready Next.js starter for building AI-powered SaaS
                products.
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="hover:text-foreground">
                    How It Works
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/docs" className="hover:text-foreground">
                    Documentation
                  </Link>
                </li>
                <li>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <Link href="/support" className="hover:text-foreground">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/terms" className="hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>© 2026 AI SaaS Starter. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
