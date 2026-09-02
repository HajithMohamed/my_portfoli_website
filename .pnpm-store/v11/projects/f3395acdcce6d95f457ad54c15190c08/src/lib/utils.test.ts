import { describe, expect, it } from "vitest";
import { formatDate } from "./utils";

describe("formatDate", () => {
  it("returns Draft for empty values", () => {
    expect(formatDate(null)).toBe("Draft");
  });

  it("formats ISO dates", () => {
    expect(formatDate("2026-06-09T00:00:00.000Z")).toContain("2026");
  });
});
