import { InMemoryRateLimiter } from "@/lib/rate-limit/memory-limiter";

// Guards session minting, not Firebase's own password check — Firebase Auth
// already throttles repeated bad-password attempts on its end. This limits
// how many times one IP can call the session endpoint at all, so a leaked or
// replayed ID token can't be hammered against it.
export const authRateLimiter = new InMemoryRateLimiter(10, 15 * 60 * 1000);
