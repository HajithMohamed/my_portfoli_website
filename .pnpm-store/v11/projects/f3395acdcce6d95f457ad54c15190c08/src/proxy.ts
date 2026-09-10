import { NextResponse, type NextRequest } from "next/server";

// Defense in depth for the hidden admin surface: the route is already gated by a
// server-side session check and excluded from robots/sitemap, but we also stamp a
// noindex header so it can never be indexed even if a URL leaks.
export function proxy(_request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return response;
}

export const config = {
  matcher: ["/_internal/:path*"],
};
