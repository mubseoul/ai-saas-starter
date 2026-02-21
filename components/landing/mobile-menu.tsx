"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {isOpen && (
        <div className="fixed inset-x-0 top-16 z-50 border-b bg-background/95 backdrop-blur md:hidden">
          <nav className="container flex flex-col gap-1 py-4" aria-label="Mobile navigation">
            <Link
              href="#features"
              className="rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
              onClick={() => setIsOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
              onClick={() => setIsOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="/pricing"
              className="rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/login"
              className="rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
              onClick={() => setIsOpen(false)}
            >
              Sign In
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
