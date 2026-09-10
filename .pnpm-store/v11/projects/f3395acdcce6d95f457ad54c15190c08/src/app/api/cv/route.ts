import { NextResponse } from "next/server";
import { absoluteApiUrl } from "@/lib/utils";
import type { CvAsset, Profile } from "@/lib/types";

// The CMS stores the CV as a Cloudinary `raw` upload, so the file is served as
// application/octet-stream under its opaque public id — linking straight to it
// downloads an extensionless blob the OS can't open. Cloudinary can't fix this from the
// URL either: fl_attachment rejects a filename containing a dot, and the public id has
// no extension to append. So the bytes are streamed through this same-origin route,
// which is the only place the correct type and filename can be attached.
export const dynamic = "force-dynamic";

function filenameFor(name?: string): string {
  const base = (name ?? "CV").trim().replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_|_$/g, "");
  return `${base || "CV"}_CV.pdf`;
}

export async function GET() {
  const [resumeRes, profileRes] = await Promise.all([
    fetch(absoluteApiUrl("/resume/latest"), { cache: "no-store" }),
    fetch(absoluteApiUrl("/profile"), { cache: "no-store" }),
  ]);

  if (!resumeRes.ok) {
    return NextResponse.json({ error: "CV unavailable" }, { status: 502 });
  }

  const resume = (await resumeRes.json()) as CvAsset | null;
  if (!resume?.fileUrl) {
    return NextResponse.json({ error: "No CV published" }, { status: 404 });
  }

  const profile = profileRes.ok ? ((await profileRes.json()) as Profile) : null;

  const file = await fetch(resume.fileUrl, { cache: "no-store" });
  if (!file.ok || !file.body) {
    return NextResponse.json({ error: "CV fetch failed" }, { status: 502 });
  }

  const headers = new Headers({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="${filenameFor(profile?.name)}"`,
    "Cache-Control": "public, max-age=300",
  });
  const length = file.headers.get("content-length");
  if (length) {
    headers.set("Content-Length", length);
  }

  return new NextResponse(file.body, { headers });
}
