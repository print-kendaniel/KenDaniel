import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/guard";
import { projectInputSchema } from "@/lib/validation/project.schema";
import { createProject } from "@/lib/firebase/firestore";
import { ApiError, apiErrorBody, captureError } from "@/lib/errors";
import { newRequestId } from "@/lib/logging/logger";

export async function POST(request: Request): Promise<NextResponse> {
  const requestId = newRequestId();

  try {
    const admin = await getAdminSession();
    if (!admin) {
      throw new ApiError(401, "unauthorized", "Admin session required");
    }

    const json = await request.json();
    const parsed = projectInputSchema.safeParse(json);

    if (!parsed.success) {
      throw new ApiError(400, "invalid_body", "Invalid project data", parsed.error.flatten());
    }

    const project = await createProject(parsed.data);
    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(apiErrorBody(error, requestId), { status: error.status });
    }

    captureError(error, { requestId, route: "/api/projects" });
    const apiError = new ApiError(500, "internal_error", "Failed to create project");
    return NextResponse.json(apiErrorBody(apiError, requestId), { status: 500 });
  }
}
