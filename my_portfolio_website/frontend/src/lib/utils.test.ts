import { describe, expect, it } from "vitest";
import { formatBffError } from "./api";
import { absoluteApiUrl, formatDate, normalizeApiBaseUrl } from "./utils";

describe("formatDate", () => {
  it("returns Draft for empty values", () => {
    expect(formatDate(null)).toBe("Draft");
  });

  it("formats ISO dates", () => {
    expect(formatDate("2026-06-09T00:00:00.000Z")).toContain("2026");
  });
});

describe("normalizeApiBaseUrl and formatBffError", () => {
  it("strips accidental /api or /bff suffixes and adds https scheme when omitted", () => {
    expect(normalizeApiBaseUrl("my-portfoli-website-dbaf.vercel.app/")).toBe(
      "https://my-portfoli-website-dbaf.vercel.app",
    );
    expect(
      normalizeApiBaseUrl("https://my-portfoli-website-dbaf.vercel.app/api"),
    ).toBe("https://my-portfoli-website-dbaf.vercel.app");
    expect(normalizeApiBaseUrl("localhost:4000")).toBe("http://localhost:4000");

    const prev = process.env.NEXT_PUBLIC_API_URL;
    process.env.NEXT_PUBLIC_API_URL =
      "https://my-portfoli-website-dbaf.vercel.app/bff/";
    expect(absoluteApiUrl("/projects")).toBe(
      "https://my-portfoli-website-dbaf.vercel.app/projects",
    );
    process.env.NEXT_PUBLIC_API_URL = prev;
  });

  it("replaces HTML 404 and Vercel Authentication pages with clear diagnostic messages", () => {
    expect(
      formatBffError(404, "<!DOCTYPE html><html><body>404</body></html>"),
    ).toContain("Backend proxy (/bff) returned 404");

    expect(
      formatBffError(
        302,
        "Protected by Vercel Authentication",
        "https://vercel.com/sso-api",
      ),
    ).toContain("Vercel Authentication");

    expect(
      formatBffError(
        503,
        JSON.stringify({
          message: "Service Unavailable",
          hint: "Set DATABASE_URL in Vercel",
        }),
      ),
    ).toBe("Service Unavailable — Set DATABASE_URL in Vercel");
  });
});
