import { ImageResponse } from "next/og";
import { getProjectBySlug } from "@/lib/firebase/firestore";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  const title = project?.title ?? "Project";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          backgroundColor: "#ffffff",
          color: "#0a0a0f",
          fontSize: 56,
          fontWeight: 600,
        }}
      >
        {title}
      </div>
    ),
    size,
  );
}
