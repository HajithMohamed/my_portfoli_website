import type { NextConfig } from "next";

// The admin API is reached through a same-origin proxy so the session cookie is
// first-party on the site's own domain (works whether the API is same-domain or
// a separate host in production).
//
// Vercel evaluates rewrites at build time. A localhost or private Render
// hostname therefore produces a deployed site where every /bff request is a
// 404 (often accompanied by DNS_HOSTNAME_RESOLVED_PRIVATE). Fail the production
// build early instead of publishing that broken configuration.
function getBackendOrigin(): string | null {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  const isVercel = process.env.VERCEL === "1";

  if (!configuredUrl) {
    if (isVercel) {
      console.warn(
        "\n⚠️ [DEPLOYMENT NOTICE] NEXT_PUBLIC_API_URL is not set in Vercel environment variables.\n" +
        "   The /bff proxy to the backend is disabled. To connect your live backend,\n" +
        "   go to Vercel Project Settings > Environment Variables, add NEXT_PUBLIC_API_URL=https://your-api.onrender.com,\n" +
        "   and redeploy.\n"
      );
      return null;
    }
    return "http://localhost:4000";
  }

  let url: URL;
  try {
    url = new URL(configuredUrl);
  } catch {
    console.warn(`\n⚠️ [DEPLOYMENT NOTICE] NEXT_PUBLIC_API_URL "${configuredUrl}" is invalid. Expected a full URL with https://.\n`);
    return isVercel ? null : "http://localhost:4000";
  }

  const privateHost =
    url.hostname === "localhost" ||
    url.hostname.endsWith(".local") ||
    url.hostname.endsWith(".internal") ||
    /^127(?:\.\d{1,3}){3}$/.test(url.hostname) ||
    /^10(?:\.\d{1,3}){3}$/.test(url.hostname) ||
    /^192\.168(?:\.\d{1,3}){2}$/.test(url.hostname) ||
    /^172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2}$/.test(url.hostname);

  if (isVercel && (url.protocol !== "https:" || privateHost || (url.pathname !== "/" && url.pathname !== ""))) {
    console.warn(
      `\n⚠️ [DEPLOYMENT NOTICE] NEXT_PUBLIC_API_URL ("${configuredUrl}") points to a private or localhost origin.\n` +
      "   Vercel cannot proxy to private origins. Disabling /bff proxy until a public HTTPS URL is set.\n"
    );
    return null;
  }

  return url.origin;
}

const backendOrigin = getBackendOrigin();

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
    if (!backendOrigin) {
      return [];
    }
    return [{ source: "/bff/:path*", destination: `${backendOrigin}/:path*` }];
  },
};

export default nextConfig;
