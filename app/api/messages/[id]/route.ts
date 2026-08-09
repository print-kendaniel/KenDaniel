import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth/guard";
import { markMessageRead } from "@/lib/firebase/firestore";
import { ApiError, apiErrorBody, captureError } from "@/lib/errors";
import { newRequestId } from "@/lib/logging/logger";

interface Params {
  params: Promise<{ id: string }>;
}

const bodySchema = z.object({ read: z.boolean() });

export async function PATCH(request: Request, { params }: Params): Promise<NextResponse> {
  const requestId = newRequestId();

  try {
    const admin = await getAdminSession();
    if (!admin) {
      throw new ApiError(401, "unauthorized", "Admin session required");
    }

    const { id } = await params;
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);

    if (!parsed.success) {
      throw new ApiError(400, "invalid_body", "Invalid request body", parsed.error.flatten());
    }

    await markMessageRead(id, parsed.data.read);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(apiErrorBody(error, requestId), { status: error.status });
    }

    captureError(error, { requestId, route: "/api/messages/[id]" });
    const apiError = new ApiError(500, "internal_error", "Failed to update message");
    return NextResponse.json(apiErrorBody(apiError, requestId), { status: 500 });
  }
}
