import { publicConfig } from "@/lib/config/public";

const ALLOWED_ORIGIN = publicConfig.NEXT_PUBLIC_SITE_URL;

/** Applies same-origin-only CORS headers. Cross-origin browser requests are not permitted. */
export function withCors(response: Response, request: Request): Response {
  const origin = request.headers.get("origin");
  if (origin === ALLOWED_ORIGIN) {
    response.headers.set("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
    response.headers.set("Vary", "Origin");
  }
  return response;
}

export function corsPreflightResponse(request: Request): Response {
  const response = new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
  return withCors(response, request);
}
