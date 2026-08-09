export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export interface RateLimiter {
  check(key: string): RateLimitResult;
}

interface Bucket {
  count: number;
  resetAt: number;
}

/**
 * In-memory fixed-window limiter. Good enough for a single-instance
 * deployment; swap `InMemoryRateLimiter` for a Redis-backed implementation
 * of the same `RateLimiter` interface (e.g. Upstash) when scaling beyond
 * one server instance — call sites only depend on `RateLimiter`.
 */
export class InMemoryRateLimiter implements RateLimiter {
  private buckets = new Map<string, Bucket>();

  constructor(
    private readonly max: number,
    private readonly windowMs: number,
  ) {}

  check(key: string): RateLimitResult {
    const now = Date.now();
    const bucket = this.buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      const resetAt = now + this.windowMs;
      this.buckets.set(key, { count: 1, resetAt });
      return { allowed: true, remaining: this.max - 1, resetAt };
    }

    if (bucket.count >= this.max) {
      return { allowed: false, remaining: 0, resetAt: bucket.resetAt };
    }

    bucket.count += 1;
    return { allowed: true, remaining: this.max - bucket.count, resetAt: bucket.resetAt };
  }
}
