import { NextResponse } from "next/server";
import { z } from "zod";
import { createSessionCookie, SESSION_COOKIE_MAX_AGE_MS, SESSION_COOKIE_NAME, verifyAdminIdToken } from "@/lib/auth/session";
import { apiErrorBody, ApiError } from "@/lib/errors";
import { logger, newRequestId } from "@/lib/logging/logger";

const bodySchema = z.object({
  idToken: z.string().min(1),
});

export async function POST(request: Request): Promise<NextResponse> {
  const requestId = newRequestId();

  try {
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);

    if (!parsed.success) {
      throw new ApiError(400, "invalid_body", "idToken is required", parsed.error.flatten());
    }

    // Confirms the token is valid AND belongs to an allow-listed admin UID
    // before a session cookie is ever minted.
    await verifyAdminIdToken(parsed.data.idToken);
    const sessionCookie = await createSessionCookie(parsed.data.idToken);

    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_COOKIE_MAX_AGE_MS / 1000,
    });
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(apiErrorBody(error, requestId), { status: error.status });
    }

    logger.error("Failed to create session", { requestId, error: String(error) });
    const apiError = new ApiError(401, "unauthorized", "Could not establish an admin session");
    return NextResponse.json(apiErrorBody(apiError, requestId), { status: 401 });
  }
}
