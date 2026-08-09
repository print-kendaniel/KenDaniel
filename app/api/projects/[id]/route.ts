import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/guard";
import { projectUpdateSchema } from "@/lib/validation/project.schema";
import { deleteProject, updateProject } from "@/lib/firebase/firestore";
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
    const parsed = projectUpdateSchema.safeParse(json);

    if (!parsed.success) {
      throw new ApiError(400, "invalid_body", "Invalid project data", parsed.error.flatten());
    }

    await updateProject(id, parsed.data);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(apiErrorBody(error, requestId), { status: error.status });
    }

    captureError(error, { requestId, route: "/api/projects/[id]" });
    const apiError = new ApiError(500, "internal_error", "Failed to update project");
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
    await deleteProject(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(apiErrorBody(error, requestId), { status: error.status });
    }

    captureError(error, { requestId, route: "/api/projects/[id]" });
    const apiError = new ApiError(500, "internal_error", "Failed to delete project");
    return NextResponse.json(apiErrorBody(apiError, requestId), { status: 500 });
  }
}
