import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { AIModel } from "@prisma/client";
import { AI_MODELS } from "./constants";

// Initialize AI clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface AIGenerateOptions {
  prompt: string;
  model: AIModel;
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
}

export interface AIGenerateResponse {
  response: string;
  tokens: number;
  model: AIModel;
  cost: number; // in USD cents
}

/**
 * Generate AI response using the specified model
 */
export async function generateAIResponse(
  options: AIGenerateOptions
): Promise<AIGenerateResponse> {
  const { prompt, model, maxTokens, temperature = 0.7 } = options;

  const modelConfig = AI_MODELS[model];

  if (!modelConfig) {
    throw new Error(`Unsupported AI model: ${model}`);
  }

  const effectiveMaxTokens = maxTokens || modelConfig.maxTokens;

  // Route to appropriate provider
  if (modelConfig.provider === "openai") {
    return generateOpenAIResponse(prompt, model, effectiveMaxTokens, temperature);
  } else if (modelConfig.provider === "anthropic") {
    return generateAnthropicResponse(prompt, model, effectiveMaxTokens, temperature);
  } else {
    throw new Error(`Unsupported provider: ${modelConfig.provider}`);
  }
}

/**
 * Generate response using OpenAI
 */
async function generateOpenAIResponse(
  prompt: string,
  model: AIModel,
  maxTokens: number,
  temperature: number
): Promise<AIGenerateResponse> {
  const modelName = model === "GPT_4" ? "gpt-4" : "gpt-3.5-turbo";

  const completion = await openai.chat.completions.create({
    model: modelName,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    max_tokens: maxTokens,
    temperature,
  });

  const response = completion.choices[0]?.message?.content || "";
  const tokens = completion.usage?.total_tokens || 0;

  // Calculate cost
  const modelConfig = AI_MODELS[model];
  const cost = (tokens / 1000) * modelConfig.costPer1kTokens * 100; // Convert to cents

  return {
    response,
    tokens,
    model,
    cost,
  };
}

/**
 * Generate response using Anthropic Claude
 */
async function generateAnthropicResponse(
  prompt: string,
  model: AIModel,
  maxTokens: number,
  temperature: number
): Promise<AIGenerateResponse> {
  const modelName =
    model === "CLAUDE_SONNET" ? "claude-3-5-sonnet-20241022" : "claude-3-5-haiku-20241022";

  const message = await anthropic.messages.create({
    model: modelName,
    max_tokens: maxTokens,
    temperature,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const response = message.content[0]?.type === "text" ? message.content[0].text : "";
  const tokens = message.usage.input_tokens + message.usage.output_tokens;

  // Calculate cost
  const modelConfig = AI_MODELS[model];
  const cost = (tokens / 1000) * modelConfig.costPer1kTokens * 100; // Convert to cents

  return {
    response,
    tokens,
    model,
    cost,
  };
}

/**
 * Stream AI response (for future use)
 */
export async function* streamAIResponse(
  options: AIGenerateOptions
): AsyncGenerator<string, void, unknown> {
  const { prompt, model, maxTokens, temperature = 0.7 } = options;

  const modelConfig = AI_MODELS[model];

  if (!modelConfig) {
    throw new Error(`Unsupported AI model: ${model}`);
  }

  const effectiveMaxTokens = maxTokens || modelConfig.maxTokens;

  if (modelConfig.provider === "openai") {
    yield* streamOpenAIResponse(prompt, model, effectiveMaxTokens, temperature);
  } else if (modelConfig.provider === "anthropic") {
    yield* streamAnthropicResponse(prompt, model, effectiveMaxTokens, temperature);
  } else {
    throw new Error(`Unsupported provider: ${modelConfig.provider}`);
  }
}

/**
 * Stream OpenAI response
 */
async function* streamOpenAIResponse(
  prompt: string,
  model: AIModel,
  maxTokens: number,
  temperature: number
): AsyncGenerator<string, void, unknown> {
  const modelName = model === "GPT_4" ? "gpt-4" : "gpt-3.5-turbo";

  const stream = await openai.chat.completions.create({
    model: modelName,
    messages: [{ role: "user", content: prompt }],
    max_tokens: maxTokens,
    temperature,
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      yield content;
    }
  }
}

/**
 * Stream Anthropic response
 */
async function* streamAnthropicResponse(
  prompt: string,
  model: AIModel,
  maxTokens: number,
  temperature: number
): AsyncGenerator<string, void, unknown> {
  const modelName =
    model === "CLAUDE_SONNET" ? "claude-3-5-sonnet-20241022" : "claude-3-5-haiku-20241022";

  const stream = await anthropic.messages.stream({
    model: modelName,
    max_tokens: maxTokens,
    temperature,
    messages: [{ role: "user", content: prompt }],
  });

  for await (const chunk of stream) {
    if (
      chunk.type === "content_block_delta" &&
      chunk.delta.type === "text_delta"
    ) {
      yield chunk.delta.text;
    }
  }
}

/**
 * Validate AI model availability
 */
export function isAIModelAvailable(model: AIModel): boolean {
  const modelConfig = AI_MODELS[model];
  if (!modelConfig) return false;

  if (modelConfig.provider === "openai") {
    return !!process.env.OPENAI_API_KEY;
  } else if (modelConfig.provider === "anthropic") {
    return !!process.env.ANTHROPIC_API_KEY;
  }

  return false;
}

/**
 * Get available AI models
 */
export function getAvailableAIModels(): AIModel[] {
  return Object.keys(AI_MODELS).filter((model) =>
    isAIModelAvailable(model as AIModel)
  ) as AIModel[];
}
