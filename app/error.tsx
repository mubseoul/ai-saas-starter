"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service (e.g., Sentry)
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-muted px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>

        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          Something Went Wrong
        </h1>

        <p className="mb-2 text-muted-foreground">
          We&apos;re sorry, but something unexpected happened. Our team has been notified and we&apos;re working to fix the issue.
        </p>

        {process.env.NODE_ENV === "development" && (
          <div className="my-6 rounded-lg bg-muted p-4 text-left">
            <p className="mb-2 text-sm font-semibold">Error Details:</p>
            <p className="text-xs text-muted-foreground font-mono">
              {error.message}
            </p>
            {error.digest && (
              <p className="mt-2 text-xs text-muted-foreground">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset} size="lg">
            <RotateCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>

          <Button asChild variant="outline" size="lg">
            <a href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </a>
          </Button>
        </div>

        <div className="mt-12 text-sm text-muted-foreground">
          <p>
            If this problem persists, please contact our support team with error
            code: {error.digest || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
