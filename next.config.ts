import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async headers() {
    return [
      {
        // Global: allow all crawlers at HTTP level + advertise llms.txt to AI agents
        source: "/(.*)",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
          },
          {
            // AI discovery: advertise llms.txt location in HTTP headers
            key: "Link",
            value: "<https://bigwow.space/llms.txt>; rel=\"ai-context\", <https://bigwow.space/llms-full.txt>; rel=\"ai-context-full\"",
          },
        ],
      },
      {
        source: "/tools/bg-removal",
        headers: [{ key: "Cross-Origin-Opener-Policy", value: "same-origin" }],
      },
      {
        // Apply specific headers to static assets
        source: "/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Apply headers to images
        source: "/(.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp))",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/tools",
        destination: "/",
        permanent: true,
      },
    ];
  },
  productionBrowserSourceMaps: false,
  compress: true,
  devIndicators: false,
  // Optimize images
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },
};

export default nextConfig;
