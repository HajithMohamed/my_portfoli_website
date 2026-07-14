import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    service: "hz-labs-frontend",
    status: "ok",
    checkedAt: new Date().toISOString(),
  });
}
