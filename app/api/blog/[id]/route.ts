import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/guard";
import { postUpdateSchema } from "@/lib/validation/post.schema";
import { deletePost, updatePost } from "@/lib/firebase/firestore";
import { ApiError, apiErrorBody, captureError } from "@/lib/errors";
import { newRequestId } from "@/lib/logging/logger";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: Params): Promise<NextResponse> {
  const requestId = newRequestId();

  try {
    const admin = await getAdminSession();
    if (!admin) {
      throw new ApiError(401, "unauthorized", "Admin session required");
    }

    const { id } = await params;
    const json = await request.json();
    const parsed = postUpdateSchema.safeParse(json);

    if (!parsed.success) {
      throw new ApiError(400, "invalid_body", "Invalid post data", parsed.error.flatten());
    }

    await updatePost(id, parsed.data);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(apiErrorBody(error, requestId), { status: error.status });
    }

    captureError(error, { requestId, route: "/api/blog/[id]" });
    const apiError = new ApiError(500, "internal_error", "Failed to update post");
    return NextResponse.json(apiErrorBody(apiError, requestId), { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params): Promise<NextResponse> {
  const requestId = newRequestId();

  try {
    const admin = await getAdminSession();
    if (!admin) {
      throw new ApiError(401, "unauthorized", "Admin session required");
    }

    const { id } = await params;
    await deletePost(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(apiErrorBody(error, requestId), { status: error.status });
    }

    captureError(error, { requestId, route: "/api/blog/[id]" });
    const apiError = new ApiError(500, "internal_error", "Failed to delete post");
    return NextResponse.json(apiErrorBody(apiError, requestId), { status: 500 });
  }
}
