/**
 * Rate limiting utility using in-memory store
 * For production, consider using Redis or Upstash
 */

interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval: number; // Max number of unique tokens per interval
}

interface TokenBucket {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private tokens: Map<string, TokenBucket> = new Map();
  private interval: number;

  constructor(config: RateLimitConfig) {
    this.interval = config.interval;

    // Clean up old entries every minute
    setInterval(() => {
      const now = Date.now();
      for (const [key, value] of this.tokens.entries()) {
        if (now > value.resetTime) {
          this.tokens.delete(key);
        }
      }
    }, 60000);
  }

  async check(identifier: string, limit: number): Promise<{ success: boolean; remaining: number; reset: number }> {
    const now = Date.now();
    const token = this.tokens.get(identifier);

    if (!token || now > token.resetTime) {
      // Create new token bucket
      this.tokens.set(identifier, {
        count: 1,
        resetTime: now + this.interval,
      });

      return {
        success: true,
        remaining: limit - 1,
        reset: now + this.interval,
      };
    }

    // Check if limit exceeded
    if (token.count >= limit) {
      return {
        success: false,
        remaining: 0,
        reset: token.resetTime,
      };
    }

    // Increment count
    token.count++;
    this.tokens.set(identifier, token);

    return {
      success: true,
      remaining: limit - token.count,
      reset: token.resetTime,
    };
  }

  async reset(identifier: string): Promise<void> {
    this.tokens.delete(identifier);
  }
}

// Rate limiter instances
export const apiRateLimiter = new RateLimiter({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

export const authRateLimiter = new RateLimiter({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 500,
});

export const strictRateLimiter = new RateLimiter({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 100,
});

/**
 * Get client identifier from request
 */
export function getClientIdentifier(req: Request): string {
  // Try to get IP from headers (works with proxies like Vercel)
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : "unknown";

  // Combine with user agent for better uniqueness
  const userAgent = req.headers.get("user-agent") || "unknown";

  return `${ip}-${userAgent.slice(0, 50)}`;
}

/**
 * Rate limit API routes
 */
export async function rateLimit(
  req: Request,
  options: { limit: number; limiter?: RateLimiter } = { limit: 10 }
): Promise<{ success: boolean; remaining: number; reset: number }> {
  const identifier = getClientIdentifier(req);
  const limiter = options.limiter || apiRateLimiter;

  return await limiter.check(identifier, options.limit);
}
