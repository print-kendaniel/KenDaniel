import type { MetadataRoute } from "next";
import { publicConfig } from "@/lib/config/public";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/login", "/api"],
    },
    sitemap: `${publicConfig.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  };
}
