"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, Users, BarChart3, PieChart } from "lucide-react";
import { toast } from "sonner";

interface Analytics {
  userGrowth: Array<{ month: string; year: number; count: number }>;
  usageByMonth: Array<{ month: string; year: number; requests: number }>;
  planDistribution: Array<{ plan: string; count: number }>;
  conversionRate: number;
  topUsers: Array<{ name: string; email: string; requests: number }>;
  revenue: { mrr: number; proSubscribers: number };
}

export function AnalyticsCharts() {
  const [data, setData] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch("/api/admin/analytics");
        const result = await response.json();
        setData(result);
      } catch {
        toast.error("Failed to load analytics");
      } finally {
        setIsLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  async function handleExport(type: string) {
    try {
      const response = await fetch(`/api/admin/export?type=${type}`);
      if (!response.ok) throw new Error("Export failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${type}-export.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Export downloaded");
    } catch {
      toast.error("Export failed");
    }
  }

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-primary/10">
            <CardContent className="pt-6">
              <div className="h-48 animate-pulse rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data) return null;

  const maxGrowth = Math.max(...data.userGrowth.map((d) => d.count), 1);
  const maxUsage = Math.max(...data.usageByMonth.map((d) => d.requests), 1);
  const totalPlanUsers = data.planDistribution.reduce((sum, d) => sum + d.count, 0) || 1;

  const planColors: Record<string, string> = {
    FREE: "bg-gray-400",
    PRO: "bg-primary",
    ENTERPRISE: "bg-yellow-500",
  };

  return (
    <div className="space-y-6">
      {/* Export Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => handleExport("users")}>
          <Download className="mr-2 h-4 w-4" />
          Export Users
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleExport("analytics")}>
          <Download className="mr-2 h-4 w-4" />
          Export Analytics
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* User Growth Chart */}
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4 text-primary" />
              User Growth (6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2" style={{ height: 160 }}>
              {data.userGrowth.map((item, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-xs font-medium">{item.count}</span>
                  <div
                    className="w-full rounded-t bg-primary/80 transition-all"
                    style={{
                      height: `${Math.max((item.count / maxGrowth) * 120, 4)}px`,
                    }}
                  />
                  <span className="text-[10px] text-muted-foreground">{item.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Usage by Month */}
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4 text-primary" />
              AI Requests (6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2" style={{ height: 160 }}>
              {data.usageByMonth.map((item, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-xs font-medium">{item.requests}</span>
                  <div
                    className="w-full rounded-t bg-green-500/80 transition-all"
                    style={{
                      height: `${Math.max((item.requests / maxUsage) * 120, 4)}px`,
                    }}
                  />
                  <span className="text-[10px] text-muted-foreground">{item.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Plan Distribution */}
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <PieChart className="h-4 w-4 text-primary" />
              Plan Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.planDistribution.map((item) => (
                <div key={item.plan} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.plan}</span>
                    <span className="text-muted-foreground">
                      {item.count} ({((item.count / totalPlanUsers) * 100).toFixed(0)}%)
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${planColors[item.plan] || "bg-primary"}`}
                      style={{ width: `${(item.count / totalPlanUsers) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conversion & Revenue */}
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-primary" />
              Conversion & Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-4 text-center">
                <p className="text-2xl font-bold text-primary">{data.conversionRate}%</p>
                <p className="text-xs text-muted-foreground">Free → Paid</p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <p className="text-2xl font-bold text-green-600">
                  ${data.revenue.mrr.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Monthly Revenue</p>
              </div>
              <div className="col-span-2 rounded-lg border p-4 text-center">
                <p className="text-2xl font-bold">{data.revenue.proSubscribers}</p>
                <p className="text-xs text-muted-foreground">Pro Subscribers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Users */}
      {data.topUsers.length > 0 && (
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle>Top Users This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.topUsers.map((user, i) => (
                <div
                  key={user.email}
                  className="flex flex-col gap-2 border-b pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="w-fit shrink-0">{user.requests} requests</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
