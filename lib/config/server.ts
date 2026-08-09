import "server-only";
import { z } from "zod";

const serverEnvSchema = z.object({
  FIREBASE_PROJECT_ID: z.string().min(1),
  FIREBASE_CLIENT_EMAIL: z.email(),
  FIREBASE_PRIVATE_KEY: z.string().min(1),
  ADMIN_UIDS: z
    .string()
    .min(1)
    .transform((value) => value.split(",").map((uid) => uid.trim()).filter(Boolean)),
  SESSION_COOKIE_NAME: z.string().min(1).default("__session"),
  SESSION_COOKIE_MAX_AGE_SECONDS: z.coerce.number().int().positive().default(60 * 60 * 24 * 5),
  CONTACT_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(5),
  CONTACT_RATE_LIMIT_WINDOW_SECONDS: z.coerce.number().int().positive().default(60 * 10),
  IP_HASH_SECRET: z.string().min(16),
  SENTRY_DSN: z.string().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

function loadServerConfig() {
  const parsed = serverEnvSchema.safeParse({
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
    ADMIN_UIDS: process.env.ADMIN_UIDS,
    SESSION_COOKIE_NAME: process.env.SESSION_COOKIE_NAME,
    SESSION_COOKIE_MAX_AGE_SECONDS: process.env.SESSION_COOKIE_MAX_AGE_SECONDS,
    CONTACT_RATE_LIMIT_MAX: process.env.CONTACT_RATE_LIMIT_MAX,
    CONTACT_RATE_LIMIT_WINDOW_SECONDS: process.env.CONTACT_RATE_LIMIT_WINDOW_SECONDS,
    IP_HASH_SECRET: process.env.IP_HASH_SECRET,
    SENTRY_DSN: process.env.SENTRY_DSN,
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!parsed.success) {
    throw new Error(
      `Invalid server environment variables:\n${z.prettifyError(parsed.error)}`,
    );
  }

  return parsed.data;
}

export const serverConfig = loadServerConfig();
