"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-muted px-4">
      <div className="mx-auto max-w-md text-center" role="alert">
        <h1 className="mb-4 text-7xl font-bold text-primary sm:text-9xl">404</h1>

        <h2 className="mb-2 text-3xl font-bold tracking-tight">
          Page Not Found
        </h2>

        <p className="mb-8 text-muted-foreground">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" aria-hidden="true" />
              Go Home
            </Link>
          </Button>

          <Button variant="outline" size="lg" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            Go Back
          </Button>
        </div>

        <div className="mt-12 text-sm text-muted-foreground">
          <p>Need help? <Link href="/contact" className="text-primary hover:underline">Contact our support team</Link>.</p>
        </div>
      </div>
    </div>
  );
}
