import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth-utils";
import { getPromptHistory } from "@/lib/db-helpers";
import { Clock, Sparkles, Download } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function HistoryPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const history = await getPromptHistory(user.id, { take: 50 });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Prompt History</h1>
          <p className="text-muted-foreground">
            View and manage your AI generation history
          </p>
        </div>
        <div className="flex gap-2">
          <a href="/api/history/export?format=csv" download>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              CSV
            </Button>
          </a>
          <a href="/api/history/export?format=json" download>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              JSON
            </Button>
          </a>
        </div>
      </div>

      {/* History List */}
      {history.length === 0 ? (
        <Card className="border-primary/10">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Clock className="h-16 w-16 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No history yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your AI generations will appear here
            </p>
            <Button asChild className="mt-6">
              <a href="/ai-generator">
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Your First Prompt
              </a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <Card key={item.id} className="border-primary/10 transition-all hover:border-primary/20">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="text-[10px]">
                        {item.model}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(item.createdAt)}
                      </span>
                      {item.tokens && (
                        <>
                          <span className="hidden text-xs text-muted-foreground sm:inline">·</span>
                          <span className="text-xs text-muted-foreground">
                            {item.tokens} tokens
                          </span>
                        </>
                      )}
                      {item.cost && (
                        <>
                          <span className="hidden text-xs text-muted-foreground sm:inline">·</span>
                          <span className="text-xs text-muted-foreground">
                            ${(item.cost / 100).toFixed(4)}
                          </span>
                        </>
                      )}
                    </div>
                    <CardTitle className="text-base font-semibold">
                      {item.prompt.length > 120
                        ? item.prompt.slice(0, 120) + "..."
                        : item.prompt}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-primary/10 bg-muted/30 p-4">
                  <p className="text-sm leading-relaxed text-muted-foreground line-clamp-4">
                    {item.response}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-end">
                  <Button variant="ghost" size="sm" asChild>
                    <a href={`/ai-generator?prompt=${encodeURIComponent(item.prompt)}`}>
                      <Sparkles className="mr-2 h-3 w-3" />
                      Re-use Prompt
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
