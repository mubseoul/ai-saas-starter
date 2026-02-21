import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Crown, Zap } from "lucide-react";
import { MobileMenu } from "@/components/landing/mobile-menu";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for trying out AI generation",
    icon: Sparkles,
    badge: null,
    features: [
      "10 AI requests per month",
      "Access to all AI models",
      "Email authentication",
      "Basic dashboard",
      "Community support",
      "Save generation history",
    ],
    cta: "Get Started",
    href: "/signup",
    variant: "outline" as const,
  },
  {
    name: "Pro",
    price: "$29",
    description: "Best for professionals and businesses",
    icon: Crown,
    badge: "Most Popular",
    features: [
      "1,000 AI requests per month",
      "Priority AI processing",
      "All Free features",
      "Advanced analytics",
      "Priority support",
      "Custom branding",
      "Export to multiple formats",
      "Early access to new features",
    ],
    cta: "Start Free Trial",
    href: "/signup",
    variant: "default" as const,
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For teams with advanced needs",
    icon: Zap,
    badge: null,
    features: [
      "Unlimited AI requests",
      "Dedicated account manager",
      "All Pro features",
      "Custom integrations",
      "SLA guarantee",
      "Advanced security",
      "Team collaboration",
      "Custom AI training",
    ],
    cta: "Contact Sales",
    href: "/contact",
    variant: "outline" as const,
  },
];

export const metadata = {
  title: "Pricing - AI SaaS Starter",
  description: "Choose the perfect plan for your needs",
};

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold sm:text-2xl">AI SaaS</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Home
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-primary"
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
          <div className="flex items-center gap-3 md:hidden">
            <Button asChild size="sm">
              <Link href="/signup">Get Started</Link>
            </Button>
            <MobileMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Header Section */}
        <section className="container py-12 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              Simple, Transparent Pricing
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Start free, upgrade when you need more. No hidden fees.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="container pb-20">
          <div className="grid gap-8 lg:grid-cols-3">
            {plans.map((plan) => {
              const Icon = plan.icon;
              return (
                <Card
                  key={plan.name}
                  className={`relative flex flex-col border-primary/10 ${
                    plan.popular
                      ? "border-primary shadow-lg shadow-primary/10"
                      : ""
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary px-3 py-1">
                        {plan.badge}
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.price !== "Custom" && (
                        <span className="text-muted-foreground">/month</span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col">
                    <ul className="mb-8 flex-1 space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                          <span className="text-sm text-muted-foreground">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      asChild
                      variant={plan.variant}
                      size="lg"
                      className={`w-full ${
                        plan.popular ? "shadow-lg shadow-primary/20" : ""
                      }`}
                    >
                      <Link href={plan.href}>{plan.cta}</Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="border-t bg-muted/50 py-20">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-12 text-center text-3xl font-bold">
                Frequently Asked Questions
              </h2>
              <div className="space-y-8">
                <div>
                  <h3 className="mb-2 text-lg font-semibold">
                    Can I change plans anytime?
                  </h3>
                  <p className="text-muted-foreground">
                    Yes! You can upgrade or downgrade your plan at any time.
                    Changes take effect immediately.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold">
                    What happens if I exceed my limit?
                  </h3>
                  <p className="text-muted-foreground">
                    You&apos;ll be notified when you approach your limit. You can
                    upgrade to a higher plan or wait until your limit resets
                    next month.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold">
                    Do you offer refunds?
                  </h3>
                  <p className="text-muted-foreground">
                    Yes, we offer a 14-day money-back guarantee on all paid
                    plans. No questions asked.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold">
                    What payment methods do you accept?
                  </h3>
                  <p className="text-muted-foreground">
                    We accept all major credit cards through Stripe. Enterprise
                    customers can also pay via invoice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container flex flex-col items-center gap-2 py-4 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <p>© 2026 AI SaaS Starter. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
