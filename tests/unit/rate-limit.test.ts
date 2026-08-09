import { describe, expect, it, vi } from "vitest";
import { InMemoryRateLimiter } from "@/lib/rate-limit/memory-limiter";

describe("InMemoryRateLimiter", () => {
  it("allows requests up to the max within the window", () => {
    const limiter = new InMemoryRateLimiter(3, 10_000);

    expect(limiter.check("ip-a").allowed).toBe(true);
    expect(limiter.check("ip-a").allowed).toBe(true);
    expect(limiter.check("ip-a").allowed).toBe(true);
  });

  it("blocks requests once the max is exceeded", () => {
    const limiter = new InMemoryRateLimiter(2, 10_000);

    expect(limiter.check("ip-b").allowed).toBe(true);
    expect(limiter.check("ip-b").allowed).toBe(true);
    const third = limiter.check("ip-b");
    expect(third.allowed).toBe(false);
    expect(third.remaining).toBe(0);
  });

  it("tracks separate keys independently", () => {
    const limiter = new InMemoryRateLimiter(1, 10_000);

    expect(limiter.check("ip-c").allowed).toBe(true);
    expect(limiter.check("ip-d").allowed).toBe(true);
    expect(limiter.check("ip-c").allowed).toBe(false);
  });

  it("resets the count after the window elapses", () => {
    vi.useFakeTimers();
    const limiter = new InMemoryRateLimiter(1, 1_000);

    expect(limiter.check("ip-e").allowed).toBe(true);
    expect(limiter.check("ip-e").allowed).toBe(false);

    vi.advanceTimersByTime(1_001);
    expect(limiter.check("ip-e").allowed).toBe(true);

    vi.useRealTimers();
  });
});
