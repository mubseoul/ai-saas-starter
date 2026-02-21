"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Sparkles,
  History,
  CreditCard,
  Settings,
  Crown,
  Shield,
  Menu,
  X,
} from "lucide-react";

interface SidebarProps {
  userPlan?: "FREE" | "PRO" | "ENTERPRISE";
  userRole?: "USER" | "ADMIN";
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "AI Generator", href: "/ai-generator", icon: Sparkles },
  { name: "History", href: "/history", icon: History },
  { name: "Billing", href: "/billing", icon: CreditCard },
  { name: "Settings", href: "/settings", icon: Settings },
];

const adminNavigation = [
  { name: "Admin", href: "/admin", icon: Shield },
];

export function Sidebar({ userPlan = "FREE", userRole = "USER" }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const allNavigation = userRole === "ADMIN"
    ? [...navigation, ...adminNavigation]
    : navigation;

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 p-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-indigo-600 shadow-lg shadow-primary/20">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight">AI Starter</h1>
          {userRole === "ADMIN" ? (
            <Badge className="mt-0.5 bg-destructive/10 text-destructive hover:bg-destructive/20">
              ADMIN
            </Badge>
          ) : userPlan === "PRO" ? (
            <Badge className="mt-0.5 bg-primary/10 text-primary hover:bg-primary/20">
              {userPlan} PLAN
            </Badge>
          ) : null}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-4">
        {allNavigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Upgrade Section */}
      {userPlan === "FREE" && (
        <div className="p-4">
          <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/20 to-indigo-600/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Crown className="h-4 w-4 text-primary" />
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Upgrade to Pro
              </p>
            </div>
            <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
              Unlock unlimited generations and priority support.
            </p>
            <Button
              asChild
              className="w-full shadow-lg shadow-primary/20"
              size="sm"
            >
              <Link href="/billing">Upgrade Now</Link>
            </Button>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? "Close sidebar" : "Open sidebar"}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-primary/10 bg-background/95 backdrop-blur-xl transition-transform lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
        role="navigation"
        aria-label="Dashboard navigation"
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className="hidden w-64 flex-col border-r border-primary/10 bg-background/50 backdrop-blur-xl lg:flex"
        role="navigation"
        aria-label="Dashboard navigation"
      >
        {sidebarContent}
      </aside>
    </>
  );
}
