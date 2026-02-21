"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Key, Plus, Copy, Trash2 } from "lucide-react";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  lastUsed: string | null;
  createdAt: string;
  expiresAt: string | null;
}

export function ApiKeyManager() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchKeys();
  }, []);

  async function fetchKeys() {
    try {
      const response = await fetch("/api/keys");
      const data = await response.json();
      setKeys(data.keys || []);
    } catch {
      toast.error("Failed to load API keys");
    } finally {
      setIsLoading(false);
    }
  }

  async function createKey() {
    if (!newKeyName.trim()) {
      toast.error("Please enter a key name");
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to create key");
        return;
      }

      setNewlyCreatedKey(data.key.key);
      setNewKeyName("");
      setShowForm(false);
      toast.success("API key created! Copy it now — it won't be shown again.");
      fetchKeys();
    } catch {
      toast.error("Failed to create API key");
    } finally {
      setIsCreating(false);
    }
  }

  async function deleteKey(id: string) {
    try {
      const response = await fetch(`/api/keys?id=${id}`, { method: "DELETE" });
      if (!response.ok) {
        toast.error("Failed to delete key");
        return;
      }
      toast.success("API key deleted");
      setKeys(keys.filter((k) => k.id !== id));
    } catch {
      toast.error("Failed to delete key");
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {newlyCreatedKey && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
          <p className="mb-2 text-sm font-medium text-green-800 dark:text-green-200">
            Your new API key (copy it now — it won&apos;t be shown again):
          </p>
          <div className="flex items-center gap-2">
            <code className="min-w-0 flex-1 overflow-x-auto rounded bg-white p-2 text-xs dark:bg-black">
              {newlyCreatedKey}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(newlyCreatedKey)}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2"
            onClick={() => setNewlyCreatedKey(null)}
          >
            Dismiss
          </Button>
        </div>
      )}

      {keys.length === 0 && !showForm ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <Key className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            No API keys yet. Create one to access the API programmatically.
          </p>
          <Button className="mt-4" size="sm" onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-3 w-3" />
            Create API Key
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {keys.map((key) => (
              <div
                key={key.id}
                className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{key.name}</span>
                    <Badge variant="secondary" className="text-[10px] font-mono">
                      {key.key}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Created {new Date(key.createdAt).toLocaleDateString()}
                    {key.lastUsed &&
                      ` · Last used ${new Date(key.lastUsed).toLocaleDateString()}`}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-fit shrink-0 text-destructive hover:text-destructive"
                  onClick={() => deleteKey(key.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {!showForm && keys.length < 5 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowForm(true)}
            >
              <Plus className="mr-2 h-3 w-3" />
              Create API Key
            </Button>
          )}
        </>
      )}

      {showForm && (
        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="key-name">Key Name</Label>
              <Input
                id="key-name"
                placeholder="e.g., Production, Development"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                disabled={isCreating}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={createKey} disabled={isCreating} size="sm">
                {isCreating ? "Creating..." : "Create Key"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
