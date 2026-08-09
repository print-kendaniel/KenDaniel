import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validation/contact.schema";
import { createMessage } from "@/lib/firebase/firestore";
import { contactRateLimiter } from "@/lib/rate-limit/contact-limiter";
import { getRequestIp, hashIp } from "@/lib/ip";
import { looksLikeSpam } from "@/lib/spam";
import { ApiError, apiErrorBody, captureError } from "@/lib/errors";
import { logger, newRequestId } from "@/lib/logging/logger";
import { corsPreflightResponse, withCors } from "@/lib/cors";

async function handlePost(request: Request): Promise<NextResponse> {
  const requestId = newRequestId();
  const ip = getRequestIp(request);

  try {
    const rateLimit = contactRateLimiter.check(ip);
    if (!rateLimit.allowed) {
      throw new ApiError(429, "rate_limited", "Too many messages sent. Try again later.");
    }

    const json = await request.json();
    const parsed = contactFormSchema.safeParse(json);

    if (!parsed.success) {
      throw new ApiError(400, "invalid_body", "Please check the form and try again.", parsed.error.flatten());
    }

    const { company, ...fields } = parsed.data;
    if (company) {
      // Honeypot tripped — pretend success so the bot doesn't learn to adapt.
      logger.info("Honeypot tripped on contact form", { requestId });
      return NextResponse.json({ ok: true });
    }

    if (looksLikeSpam(fields)) {
      logger.info("Contact form submission flagged as spam", { requestId });
      return NextResponse.json({ ok: true });
    }

    await createMessage(fields, hashIp(ip));
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(apiErrorBody(error, requestId), { status: error.status });
    }

    captureError(error, { requestId, route: "/api/contact" });
    const apiError = new ApiError(500, "internal_error", "Something went wrong. Please try again.");
    return NextResponse.json(apiErrorBody(apiError, requestId), { status: 500 });
  }
}

export async function POST(request: Request): Promise<Response> {
  const response = await handlePost(request);
  return withCors(response, request);
}

export function OPTIONS(request: Request): Response {
  return corsPreflightResponse(request);
}
