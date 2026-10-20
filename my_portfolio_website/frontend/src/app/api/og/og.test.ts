import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";

describe("OpenGraph Generator API (/api/og)", () => {
  it("generates an OpenGraph image response with default parameters", async () => {
    const request = new NextRequest("http://localhost:3000/api/og");
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("image/png");
  });

  it("handles custom title, category, and tech parameters", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/og?title=Footwear%20BMS&category=Case%20Study&badge=DOSSIER&tech=React,Node.js,MongoDB"
    );
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("image/png");
  });
});
