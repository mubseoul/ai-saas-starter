import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/lib/auth-utils";
import { getUserSubscription, getUserUsage, getPromptHistory } from "@/lib/db-helpers";
import { PLANS } from "@/lib/constants";
import { Sparkles, Zap, Crown, Calendar, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const [subscription, usage, recentPrompts] = await Promise.all([
    getUserSubscription(user.id),
    getUserUsage(user.id),
    getPromptHistory(user.id, { take: 5 }),
  ]);

  const planDetails = PLANS[subscription.plan];
  const usageCount = usage?.requestCount || 0;
  const usageLimit = planDetails.maxRequests;
  const usagePercentage =
    usageLimit === -1 ? 0 : Math.round((usageCount / usageLimit) * 100);
  const remainingRequests = usageLimit === -1 ? "∞" : usageLimit - usageCount;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome back, {user.name?.split(" ")[0] || "there"}!
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s an overview of your AI usage and activity
          </p>
        </div>
        <Button asChild size="lg" className="w-full shadow-lg shadow-primary/20 sm:w-auto">
          <Link href="/ai-generator">
            <Sparkles className="mr-2 h-4 w-4" />
            New Generation
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* AI Requests Used */}
        <Card className="border-primary/10 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Requests Used</CardTitle>
            <Sparkles className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{usageCount}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
            <Progress value={usagePercentage} className="mt-3" />
          </CardContent>
        </Card>

        {/* Requests Remaining */}
        <Card className="border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{remainingRequests}</div>
            <p className="text-xs text-muted-foreground">
              {usageLimit === -1 ? "Unlimited" : `of ${usageLimit} requests`}
            </p>
          </CardContent>
        </Card>

        {/* Current Plan */}
        <Card className="border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
            <Crown className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{subscription.plan}</div>
              <Badge
                variant={subscription.plan === "PRO" ? "default" : "secondary"}
                className="text-[10px]"
              >
                {subscription.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {subscription.plan === "FREE" ? (
                <Link href="/billing" className="text-primary hover:underline">
                  Upgrade to Pro →
                </Link>
              ) : "currentPeriodEnd" in subscription && subscription.currentPeriodEnd ? (
                `Next billing: ${formatDate(subscription.currentPeriodEnd)}`
              ) : (
                "Active subscription"
              )}
            </p>
          </CardContent>
        </Card>

        {/* Total Generations */}
        <Card className="border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Generations</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {recentPrompts.length}
            </div>
            <p className="text-xs text-muted-foreground">
              all time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card className="border-primary/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Recent Prompts
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/history">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentPrompts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Sparkles className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-sm font-medium">No prompts yet</p>
                <p className="text-xs text-muted-foreground">
                  Create your first AI generation to get started
                </p>
                <Button asChild size="sm" className="mt-4">
                  <Link href="/ai-generator">Generate Now</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentPrompts.map((prompt) => (
                  <div
                    key={prompt.id}
                    className="flex items-start gap-4 rounded-lg border border-primary/5 bg-muted/30 p-4 transition-all hover:border-primary/20 hover:bg-muted/50"
                  >
                    <div className="flex-1 space-y-1">
                      <p className="line-clamp-2 text-sm font-medium">
                        {prompt.prompt}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-[10px]">
                          {prompt.model}
                        </Badge>
                        <span>•</span>
                        <span>{new Date(prompt.createdAt).toLocaleDateString()}</span>
                        {prompt.tokens && (
                          <>
                            <span>•</span>
                            <span>{prompt.tokens} tokens</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link
              href="/ai-generator"
              className="group flex items-start gap-4 rounded-lg border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-4 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Generate AI Content</h3>
                <p className="text-sm text-muted-foreground">
                  Create text with GPT-4 or Claude
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/history"
              className="group flex items-start gap-4 rounded-lg border border-primary/10 bg-muted/30 p-4 transition-all hover:border-primary/20 hover:bg-muted/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground">
                <Clock className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">View History</h3>
                <p className="text-sm text-muted-foreground">
                  Access all your past generations
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </Link>

            {subscription.plan === "FREE" && (
              <Link
                href="/billing"
                className="group flex items-start gap-4 rounded-lg border border-primary/10 bg-gradient-to-br from-yellow-500/5 to-transparent p-4 transition-all hover:border-yellow-500/30 hover:shadow-lg hover:shadow-yellow-500/5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-600">
                  <Crown className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Upgrade to Pro</h3>
                  <p className="text-sm text-muted-foreground">
                    Get 100x more requests + priority support
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
