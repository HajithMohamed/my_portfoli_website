import type { NextConfig } from "next";

// The admin API is reached through a same-origin proxy so the session cookie is
// first-party on the site's own domain (works whether the API is same-domain or
// a separate host in production).
const backendOrigin = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"
).replace(/\/$/, "");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Optional remote images supplied by repository metadata or the CMS.
      { protocol: "https", hostname: "opengraph.githubassets.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      // Admin CMS uploads.
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  async redirects() {
    // The protected control center moved away from an encoded leading-underscore
    // segment because Next 16 generates incompatible route types for that form.
    // Keep existing private bookmarks working without exposing a second route.
    return [
      {
        source: "/_internal/:path*",
        destination: "/admin/:path*",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [{ source: "/bff/:path*", destination: `${backendOrigin}/:path*` }];
  },
};

export default nextConfig;
