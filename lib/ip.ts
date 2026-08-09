import "server-only";
import { createHmac } from "node:crypto";
import { serverConfig } from "@/lib/config/server";

/** HMAC instead of plain hash so raw IPs can't be recovered via a rainbow table over the small IPv4 space. */
export function hashIp(ip: string): string {
  return createHmac("sha256", serverConfig.IP_HASH_SECRET).update(ip).digest("hex");
}

export function getRequestIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}
