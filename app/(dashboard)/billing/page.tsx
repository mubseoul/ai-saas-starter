import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getCurrentUser } from "@/lib/auth-utils";
import { getUserSubscription, getUserUsage } from "@/lib/db-helpers";
import { PLANS } from "@/lib/constants";
import { Check, Crown, Sparkles, Zap, CreditCard, Calendar, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { UpgradeButton } from "@/components/billing/upgrade-button";
import { ManageSubscriptionButton } from "@/components/billing/manage-subscription-button";

const PLAN_FEATURES = {
  FREE: [
    "10 AI requests per month",
    "Access to all AI models",
    "Email authentication",
    "Basic dashboard",
    "Community support",
    "Save generation history",
  ],
  PRO: [
    "1,000 AI requests per month",
    "Priority AI processing",
    "All Free features",
    "Advanced analytics",
    "Priority support",
    "Custom branding",
    "Export to multiple formats",
    "Early access to new features",
  ],
  ENTERPRISE: [
    "Unlimited AI requests",
    "Dedicated account manager",
    "All Pro features",
    "Custom integrations",
    "SLA guarantee",
    "Advanced security",
    "Team collaboration",
    "Custom AI training",
  ],
};

const PLAN_ICONS = {
  FREE: Sparkles,
  PRO: Crown,
  ENTERPRISE: Zap,
};

export default async function BillingPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const [subscription, usage] = await Promise.all([
    getUserSubscription(user.id),
    getUserUsage(user.id),
  ]);

  const currentPlan = subscription.plan;
  const usageCount = usage?.requestCount || 0;
  const usageLimit = subscription.maxRequests;
  const usagePercentage = usageLimit === -1 ? 0 : Math.round((usageCount / usageLimit) * 100);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Billing & Subscription</h1>
        <p className="text-muted-foreground">
          Manage your subscription and billing information
        </p>
      </div>

      {/* Current Plan Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Plan Card */}
        <Card className="border-primary/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Current Plan</CardTitle>
              <Badge variant={currentPlan === "PRO" ? "default" : currentPlan === "ENTERPRISE" ? "success" : "secondary"}>
                {currentPlan}
              </Badge>
            </div>
            <CardDescription>Your active subscription</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Monthly price</span>
              <span className="text-2xl font-bold">
                {PLANS[currentPlan].price === null
                  ? "Custom"
                  : `$${PLANS[currentPlan].price / 100}`}
              </span>
            </div>
            {currentPlan !== "FREE" && "currentPeriodEnd" in subscription && subscription.currentPeriodEnd && (
              <div className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Next billing date
                </div>
                <span className="font-medium">
                  {formatDate(subscription.currentPeriodEnd)}
                </span>
              </div>
            )}
            {currentPlan !== "FREE" && (
              <ManageSubscriptionButton />
            )}
          </CardContent>
        </Card>

        {/* Usage Card */}
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle className="text-base">Usage This Month</CardTitle>
            <CardDescription>AI requests used</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold">{usageCount.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">
                  / {usageLimit === -1 ? "Unlimited" : usageLimit.toLocaleString()}
                </span>
              </div>
              {usageLimit !== -1 && (
                <Progress value={usagePercentage} className="h-2" />
              )}
            </div>
            <div className="flex items-center justify-between border-t pt-4">
              <span className="text-sm text-muted-foreground">Resets on</span>
              <span className="font-medium">
                {usage?.resetAt ? formatDate(usage.resetAt) : "N/A"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Plans */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Available Plans</h2>
        <div className="grid gap-6 lg:grid-cols-3">
          {(["FREE", "PRO", "ENTERPRISE"] as const).map((plan) => {
            const Icon = PLAN_ICONS[plan];
            const isCurrentPlan = plan === currentPlan;
            const planDetails = PLANS[plan];

            return (
              <Card
                key={plan}
                className={`relative flex flex-col border-primary/10 ${
                  plan === "PRO"
                    ? "border-primary shadow-lg shadow-primary/10"
                    : ""
                } ${isCurrentPlan ? "ring-2 ring-primary" : ""}`}
              >
                {plan === "PRO" && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary px-3 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                {isCurrentPlan && (
                  <div className="absolute -top-4 right-4">
                    <Badge variant="success" className="px-3 py-1">
                      Current Plan
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{plan}</CardTitle>
                  <CardDescription>
                    {plan === "FREE" && "Perfect for trying out AI generation"}
                    {plan === "PRO" && "Best for professionals and businesses"}
                    {plan === "ENTERPRISE" && "For teams with advanced needs"}
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      {planDetails.price === null
                        ? "Custom"
                        : planDetails.price === 0
                        ? "$0"
                        : `$${planDetails.price / 100}`}
                    </span>
                    {planDetails.price !== null && planDetails.price !== 0 && (
                      <span className="text-muted-foreground">/month</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <ul className="mb-8 flex-1 space-y-3">
                    {PLAN_FEATURES[plan].map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <span className="text-sm text-muted-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {isCurrentPlan ? (
                    <Button variant="outline" size="lg" className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : plan === "ENTERPRISE" ? (
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full"
                      asChild
                    >
                      <a href="mailto:sales@example.com">
                        Contact Sales
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  ) : plan === "PRO" ? (
                    <UpgradeButton plan="PRO" />
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Payment Method (if applicable) */}
      {currentPlan !== "FREE" && (
        <Card className="border-primary/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Payment Method</CardTitle>
                <CardDescription>Manage your payment methods</CardDescription>
              </div>
              <CreditCard className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Payment methods are managed through Stripe&apos;s secure customer portal.
            </p>
            <ManageSubscriptionButton variant="outline" />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
