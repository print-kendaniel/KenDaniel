import { InMemoryRateLimiter } from "@/lib/rate-limit/memory-limiter";
import { serverConfig } from "@/lib/config/server";

// Module-level singleton: survives across requests within one server
// process/instance. Swap InMemoryRateLimiter for a Redis-backed
// implementation when running more than one instance.
export const contactRateLimiter = new InMemoryRateLimiter(
  serverConfig.CONTACT_RATE_LIMIT_MAX,
  serverConfig.CONTACT_RATE_LIMIT_WINDOW_SECONDS * 1000,
);
