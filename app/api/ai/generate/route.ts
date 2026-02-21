import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { checkAndIncrementUsage, createPromptHistory } from "@/lib/db-helpers";
import { rateLimit } from "@/lib/rate-limit";
import { logAIGeneration } from "@/lib/audit-log";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

// Lazy-load AI clients to avoid build-time initialization
function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
  });
}

function getAnthropicClient() {
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || "",
  });
}

// Model configurations
const MODEL_CONFIG = {
  GPT_4: {
    provider: "openai",
    model: "gpt-4-turbo-preview",
    maxTokens: 4096,
  },
  GPT_3_5_TURBO: {
    provider: "openai",
    model: "gpt-3.5-turbo",
    maxTokens: 4096,
  },
  CLAUDE_SONNET: {
    provider: "anthropic",
    model: "claude-3-5-sonnet-20241022",
    maxTokens: 4096,
  },
  CLAUDE_HAIKU: {
    provider: "anthropic",
    model: "claude-3-5-haiku-20241022",
    maxTokens: 4096,
  },
} as const;

type ModelType = keyof typeof MODEL_CONFIG;

interface GenerateRequest {
  prompt: string;
  model: ModelType;
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting - 20 requests per minute per user
    const rateLimitResult = await rateLimit(req, { limit: 20 });
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "Too many requests. Please try again later.",
          retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000)
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": "20",
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": new Date(rateLimitResult.reset).toISOString(),
          }
        }
      );
    }

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse request body
    const body: GenerateRequest = await req.json();
    const { prompt, model } = body;

    // Validate input
    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    if (!model || !MODEL_CONFIG[model]) {
      return NextResponse.json(
        { error: "Invalid model selected" },
        { status: 400 }
      );
    }

    // Check usage limits
    const canGenerate = await checkAndIncrementUsage(session.user.id);
    if (!canGenerate) {
      return NextResponse.json(
        { error: "Usage limit reached. Please upgrade your plan." },
        { status: 429 }
      );
    }

    // Get model configuration
    const config = MODEL_CONFIG[model];

    let response: string;
    let tokensUsed: number;

    // Generate response based on provider
    if (config.provider === "openai") {
      const openai = getOpenAIClient();
      const completion = await openai.chat.completions.create({
        model: config.model,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: config.maxTokens,
        temperature: 0.7,
      });

      response = completion.choices[0]?.message?.content || "";
      tokensUsed = completion.usage?.total_tokens || 0;
    } else {
      // Anthropic (Claude)
      const anthropic = getAnthropicClient();
      const message = await anthropic.messages.create({
        model: config.model,
        max_tokens: config.maxTokens,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const content = message.content[0];
      response = content.type === "text" ? content.text : "";
      tokensUsed = message.usage.input_tokens + message.usage.output_tokens;
    }

    // Save to history
    await createPromptHistory({
      userId: session.user.id,
      prompt: prompt.trim(),
      response,
      model,
      tokens: tokensUsed,
    });

    // Log successful generation
    logAIGeneration(session.user.id, true, {
      model,
      tokens: tokensUsed,
      promptLength: prompt.length,
      responseLength: response.length,
    });

    // Return success response
    return NextResponse.json({
      response,
      tokens: tokensUsed,
      model,
    });
  } catch (error: any) {
    console.error("AI Generation Error:", error);

    // Log failed generation
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      logAIGeneration(session.user.id, false, {
        errorType: error?.name,
        errorStatus: error?.status,
      }, error?.message);
    }

    // Handle specific API errors
    if (error?.status === 429) {
      return NextResponse.json(
        { error: "AI service rate limit reached. Please try again later." },
        { status: 429 }
      );
    }

    if (error?.status === 401) {
      return NextResponse.json(
        { error: "Invalid API key. Please check your configuration." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate response. Please try again." },
      { status: 500 }
    );
  }
}
