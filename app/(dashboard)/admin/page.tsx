import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth-utils";
import { getAdminStats } from "@/lib/db-helpers";
import { Badge } from "@/components/ui/badge";
import { Users, CreditCard, Sparkles, TrendingUp } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { UserManagementTable } from "@/components/admin/user-management-table";
import { AnalyticsCharts } from "@/components/admin/analytics-charts";

export default async function AdminPage() {
  const user = await getCurrentUser();

  // Check if user is admin
  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const stats = await getAdminStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            System overview and user management
          </p>
        </div>
        <Badge variant="default">Admin</Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <Card className="border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registered accounts
            </p>
          </CardContent>
        </Card>

        {/* Active Subscriptions */}
        <Card className="border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              Paying customers
            </p>
          </CardContent>
        </Card>

        {/* Total Requests */}
        <Card className="border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total AI Requests</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalRequests.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              All time generations
            </p>
          </CardContent>
        </Card>

        {/* Revenue (Calculated) */}
        <Card className="border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${(stats.activeSubscriptions * 29).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Estimated MRR
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Users */}
      <Card className="border-primary/10">
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
          <CardDescription>
            Latest user registrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentUsers.map((recentUser) => (
              <div
                key={recentUser.id}
                className="flex flex-col gap-1 border-b pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{recentUser.name || "No name"}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {recentUser.email}
                  </p>
                </div>
                <div className="shrink-0 sm:text-right">
                  <p className="text-sm font-medium">
                    {formatDate(recentUser.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analytics & Charts */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Analytics</h2>
        <AnalyticsCharts />
      </div>

      {/* User Management */}
      <Card className="border-primary/10">
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Search and manage users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserManagementTable />
        </CardContent>
      </Card>
    </div>
  );
}
