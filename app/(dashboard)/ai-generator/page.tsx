"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Copy, RotateCw, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

const AI_MODELS = [
  { id: "GPT_4", name: "GPT-4", description: "Most capable, best for complex tasks" },
  { id: "GPT_3_5_TURBO", name: "GPT-3.5 Turbo", description: "Fast and efficient" },
  { id: "CLAUDE_SONNET", name: "Claude Sonnet", description: "Balanced performance" },
  { id: "CLAUDE_HAIKU", name: "Claude Haiku", description: "Fastest, most affordable" },
];

const EXAMPLE_PROMPTS = [
  "Write a blog post about AI and the future of work",
  "Generate a product description for smart headphones",
  "Create an email announcing a new feature",
  "Write a social media caption for a travel photo",
];

export default function AIGeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("GPT_4");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tokens, setTokens] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsLoading(true);
    setResponse("");
    setTokens(null);

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          model: selectedModel,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to generate");
        return;
      }

      setResponse(data.response);
      setTokens(data.tokens);
      toast.success("Generated successfully!");
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    toast.success("Copied to clipboard!");
  };

  const handleClear = () => {
    setPrompt("");
    setResponse("");
    setTokens(null);
  };

  const handleUseExample = (example: string) => {
    setPrompt(example);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">AI Text Generator</h1>
        <p className="text-muted-foreground">
          Generate content using OpenAI and Claude models
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Model Selection */}
          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle className="text-base">Select AI Model</CardTitle>
              <CardDescription>Choose the model that best fits your needs</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {AI_MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-all ${
                    selectedModel === model.id
                      ? "border-primary bg-primary/5"
                      : "border-primary/10 hover:border-primary/30 hover:bg-muted/50"
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{model.name}</p>
                      {selectedModel === model.id && (
                        <Badge variant="default" className="text-[10px]">
                          Selected
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{model.description}</p>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Prompt Input */}
          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle className="text-base">Your Prompt</CardTitle>
              <CardDescription>Describe what you want to generate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="Enter your prompt here..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[200px] resize-none"
                  maxLength={2000}
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{prompt.length} / 2000 characters</span>
                </div>
              </div>

              {/* Example Prompts */}
              <div className="space-y-2">
                <Label className="text-xs">Example Prompts</Label>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_PROMPTS.map((example, i) => (
                    <button
                      key={i}
                      onClick={() => handleUseExample(example)}
                      className="rounded-md bg-muted px-2.5 py-1.5 text-xs transition-colors hover:bg-muted/80"
                    >
                      {example.slice(0, 30)}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={handleGenerate}
                  disabled={isLoading || !prompt.trim()}
                  className="flex-1 shadow-lg shadow-primary/20"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleClear}>
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          <Card className="border-primary/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Generated Response</CardTitle>
                {response && (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopy}
                      className="h-8"
                    >
                      <Copy className="mr-2 h-3 w-3" />
                      Copy
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleGenerate}
                      className="h-8"
                      disabled={isLoading}
                    >
                      <RotateCw className="mr-2 h-3 w-3" />
                      Regenerate
                    </Button>
                  </div>
                )}
              </div>
              <CardDescription>
                {response ? "Your AI-generated content" : "Your response will appear here"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex min-h-[200px] flex-col items-center justify-center space-y-4 sm:min-h-[400px]">
                  <div className="relative">
                    <Sparkles className="h-12 w-12 animate-pulse text-primary" />
                    <div className="absolute inset-0 animate-ping">
                      <Sparkles className="h-12 w-12 text-primary/50" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Generating your content...
                  </p>
                </div>
              ) : response ? (
                <div className="space-y-4">
                  <div className="min-h-[200px] rounded-lg border border-primary/10 bg-muted/30 p-4 sm:min-h-[400px]">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {response}
                    </p>
                  </div>
                  {tokens && (
                    <div className="flex flex-col gap-2 rounded-lg border border-primary/10 bg-primary/5 p-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {selectedModel}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {tokens} tokens used
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8">
                        <Save className="mr-2 h-3 w-3" />
                        Save to History
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex min-h-[200px] flex-col items-center justify-center space-y-4 text-center sm:min-h-[400px]">
                  <Sparkles className="h-12 w-12 text-muted-foreground/50" />
                  <div>
                    <p className="font-medium">No content generated yet</p>
                    <p className="text-sm text-muted-foreground">
                      Enter a prompt and click Generate to get started
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
