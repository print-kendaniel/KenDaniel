import "server-only";
import { randomUUID } from "node:crypto";
import { adminStorage } from "@/lib/firebase/admin";

const ALLOWED_CONTENT_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);

export async function uploadImage(
  folder: "projects" | "posts",
  file: Buffer,
  contentType: string,
): Promise<string> {
  if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
    throw new Error(`Unsupported image content type: ${contentType}`);
  }

  const bucket = adminStorage.bucket();
  const extension = contentType.split("/")[1];
  const path = `${folder}/${randomUUID()}.${extension}`;
  const fileRef = bucket.file(path);

  await fileRef.save(file, {
    contentType,
    public: true,
    metadata: { cacheControl: "public, max-age=31536000, immutable" },
  });

  return `https://storage.googleapis.com/${bucket.name}/${path}`;
}
