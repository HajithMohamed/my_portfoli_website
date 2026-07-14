import type { NextConfig } from "next";
import path from "node:path";

// The admin API is reached through a same-origin proxy so the session cookie is
// first-party on the site's own domain (works whether the API is same-domain or
// a separate host in production).
const backendOrigin = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"
).replace(/\/$/, "");

const nextConfig: NextConfig = {
  // node_modules lives two levels up (shared monorepo root); pin the Turbopack
  // workspace root there so it can resolve `next` and won't mis-infer from a
  // stray nested lockfile.
  turbopack: {
    root: path.join(__dirname, "..", ".."),
  },
  async rewrites() {
    return [{ source: "/bff/:path*", destination: `${backendOrigin}/:path*` }];
  },
};

export default nextConfig;
