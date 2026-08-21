import type { NextConfig } from "next";

const contentSecurityPolicy = [
  "default-src 'self'",
  // 'wasm-unsafe-eval' is required by @splinetool/runtime (the hero's 3D
  // scene), which compiles WebAssembly for its renderer.
  "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://storage.googleapis.com https://res.cloudinary.com",
  "font-src 'self' data:",
  // *.spline.design: fetching the .splinecode scene file and its assets.
  "connect-src 'self' https://*.googleapis.com https://securetoken.googleapis.com https://*.spline.design",
  // Spline's renderer runs in a blob-sourced Web Worker.
  "worker-src 'self' blob:",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  // firebase-admin ships some entry points (e.g. firebase-admin/auth) as ESM;
  // Next.js's default bundling requires() it as CommonJS inside serverless
  // functions and throws ERR_REQUIRE_ESM at runtime. Leaving it unbundled
  // (resolved natively from node_modules at request time) is the standard
  // fix — this only ever showed up on Vercel, not `next dev`/`next build`
  // locally, because local runs don't go through the same serverless
  // function bundling path.
  serverExternalPackages: ["firebase-admin"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "storage.googleapis.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
