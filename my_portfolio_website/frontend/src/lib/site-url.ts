/** Canonical origin from deployment configuration; never point this portfolio at an old brand. */
export function getSiteUrl(): string {
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  return (process.env.NEXT_PUBLIC_SITE_URL ?? (host ? `https://${host}` : "http://localhost:3000"))
    .replace(/\/+$/, "");
}
