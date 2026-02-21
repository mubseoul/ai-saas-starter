"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

export function DeleteAccountButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    const confirmed = confirm(
      "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted."
    );

    if (!confirmed) return;

    const doubleConfirmed = confirm(
      'Please confirm again. Type "DELETE" in the next prompt to continue.'
    );

    if (!doubleConfirmed) return;

    const finalConfirmation = prompt('Type "DELETE" to confirm account deletion:');

    if (finalConfirmation !== "DELETE") {
      toast.error("Account deletion cancelled");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to delete account");
        return;
      }

      toast.success("Account deleted successfully");

      // Sign out and redirect to home
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Account deletion error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="destructive"
      onClick={handleDelete}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Deleting...
        </>
      ) : (
        "Delete Account"
      )}
    </Button>
  );
}
