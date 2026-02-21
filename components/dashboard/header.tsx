"use client";

import { usePathname } from "next/navigation";
import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";

interface DashboardHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const pathname = usePathname();

  const getPageName = () => {
    const segments = pathname.split("/").filter(Boolean);
    return segments[segments.length - 1] || "dashboard";
  };

  const pageName = getPageName();
  const pageTitle = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  const getUserInitials = () => {
    if (user.name) {
      return user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user.email?.charAt(0).toUpperCase() || "U";
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-primary/10 bg-background/30 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-3 pl-10 text-sm font-medium lg:pl-0">
        <span className="hidden text-muted-foreground transition-colors hover:text-primary sm:inline">
          Home
        </span>
        <span className="hidden text-muted-foreground sm:inline">/</span>
        <span className="text-foreground">{pageTitle}</span>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 sm:gap-6">
        {/* Search */}
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search prompts..."
            className="w-64 bg-muted/50 pl-10 pr-12"
          />
          <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 opacity-50">
            <kbd className="rounded border border-muted-foreground/30 px-1 text-[10px] font-bold">
              ⌘
            </kbd>
            <kbd className="rounded border border-muted-foreground/30 px-1 text-[10px] font-bold">
              K
            </kbd>
          </div>
        </div>

        {/* Notifications */}
        <div className="flex items-center gap-2 border-l border-primary/10 pl-3 sm:gap-4 sm:pl-6">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive border-2 border-background"></span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 rounded-lg transition-all hover:bg-muted">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.image || undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href="/settings">Settings</a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/billing">Billing</a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
