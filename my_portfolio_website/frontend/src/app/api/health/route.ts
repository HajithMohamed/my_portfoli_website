import { NextResponse } from "next/server";
import { checkBackendStatus } from "@/lib/public-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const deep = searchParams.get("deep") === "1";

  if (!deep) {
    return NextResponse.json({
      service: "hz-labs-frontend",
      status: "ok",
      backendConfigured: Boolean(process.env.NEXT_PUBLIC_API_URL?.trim()),
      checkedAt: new Date().toISOString(),
    });
  }

  const backend = await checkBackendStatus();
  return NextResponse.json({
    service: "hz-labs-frontend",
    status: backend.reachable ? "ok" : "degraded",
    backend,
    checkedAt: new Date().toISOString(),
  });
}
