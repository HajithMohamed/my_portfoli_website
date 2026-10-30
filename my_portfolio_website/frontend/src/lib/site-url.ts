/** Canonical origin from deployment configuration; never point this portfolio at an old brand. */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const host =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    process.env.VERCEL_URL?.trim();
  const raw =
    configured || (host ? `https://${host}` : "http://localhost:3000");
  const candidate = (/^https?:\/\//i.test(raw) ? raw : `https://${raw}`).replace(
    /\/+$/,
    "",
  );
  try {
    new URL(candidate);
    return candidate;
  } catch {
    return "http://localhost:3000";
  }
}
