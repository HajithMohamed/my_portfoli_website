import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { absoluteApiUrl } from "@/lib/utils";
import type { CvAsset } from "@/lib/types";
import { PERSONAL_IDENTITY } from "@/lib/identity";

export const dynamic = "force-dynamic";

function filenameFor(name?: string): string {
  const base = (name ?? "CV").trim().replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_|_$/g, "");
  return `${base || "CV"}_CV.pdf`;
}

async function serveFallbackCv() {
  try {
    const filePath = path.join(process.cwd(), "public", "Mohamed_Hajith_CV.pdf");
    const fileBuffer = await fs.readFile(filePath);
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filenameFor(PERSONAL_IDENTITY.name)}"`,
        "Content-Length": String(fileBuffer.length),
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "CV unavailable" }, { status: 404 });
  }
}

export async function GET() {
  try {
    const resumeRes = await fetch(absoluteApiUrl("/resume/latest"), { cache: "no-store" });

    if (!resumeRes.ok) {
      return await serveFallbackCv();
    }

    const resume = (await resumeRes.json()) as CvAsset | null;
    if (!resume?.fileUrl) {
      return await serveFallbackCv();
    }

    const file = await fetch(resume.fileUrl, { cache: "no-store" });
    if (!file.ok || !file.body) {
      return await serveFallbackCv();
    }

    const headers = new Headers({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filenameFor(PERSONAL_IDENTITY.name)}"`,
      "Cache-Control": "public, max-age=300",
    });
    const length = file.headers.get("content-length");
    if (length) {
      headers.set("Content-Length", length);
    }

    return new NextResponse(file.body, { headers });
  } catch {
    return await serveFallbackCv();
  }
}

