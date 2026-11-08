import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { README_CHECK_FLAG } from "@/lib/project-readme";
import { ReadmeUpdatesPanel } from "./admin-readme-updates";

const pendingUpdate = {
  id: "u1",
  createdAt: "2026-11-08T05:00:00.000Z",
  title: "README updated: TechBridge",
  record: {
    slug: "tech-bridge",
    title: "TechBridge",
    repo: "HajithMohamed/Tech_Bridge",
    htmlUrl: "https://github.com/HajithMohamed/Tech_Bridge/blob/main/README.md",
    summary: "TechBridge connects technology students with opportunities.",
    detectedAt: "2026-11-08T05:00:00.000Z",
    commit: {
      sha: "c0ffee",
      message: "docs: recruiter-ready README",
      url: "https://github.com/HajithMohamed/Tech_Bridge/commit/c0ffee",
      author: "HajithMohamed",
    },
  },
};

function json(body: unknown) {
  return new Response(JSON.stringify(body), { status: 200, headers: { "Content-Type": "application/json" } });
}

describe("ReadmeUpdatesPanel", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    cleanup();
    globalThis.fetch = originalFetch;
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it("checks READMEs right after sign-in and lists the changes", async () => {
    sessionStorage.setItem(README_CHECK_FLAG, "pending");
    let reviewed = false;
    const calls: string[] = [];
    globalThis.fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      calls.push(`${init?.method ?? "GET"} ${url.replace(/^.*\/bff/, "")}`);
      if (url.endsWith("/admin/readme/sync")) {
        return json({ checkedAt: "2026-11-08T05:00:00.000Z", checked: 6, changed: 1, failed: 0, results: [] });
      }
      if (url.endsWith("/acknowledge")) {
        reviewed = true;
        return json({ ok: true });
      }
      return json({ pending: reviewed ? [] : [pendingUpdate], recent: reviewed ? [pendingUpdate] : [] });
    }) as unknown as typeof fetch;

    render(<ReadmeUpdatesPanel />);

    expect(await screen.findByText("Checked 6 published projects: 1 README changed.")).toBeDefined();
    expect(await screen.findByText("TechBridge")).toBeDefined();
    expect(screen.getByText(/docs: recruiter-ready README/)).toBeDefined();
    expect(sessionStorage.getItem(README_CHECK_FLAG)).toBeNull();
    expect(calls[0]).toBe("POST /admin/readme/sync");

    fireEvent.click(screen.getByRole("button", { name: /Mark reviewed/ }));
    await waitFor(() => expect(screen.getByText(/No unreviewed README changes/)).toBeDefined());
    expect(calls).toContain("POST /admin/readme/updates/u1/acknowledge");
  });

  it("only loads existing notices when the dashboard is opened without signing in", async () => {
    const calls: string[] = [];
    globalThis.fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      calls.push(`${init?.method ?? "GET"} ${String(input).replace(/^.*\/bff/, "")}`);
      return json({ pending: [], recent: [] });
    }) as unknown as typeof fetch;

    render(<ReadmeUpdatesPanel />);

    await waitFor(() => expect(calls).toEqual(["GET /admin/readme/updates"]));
    expect(screen.getByText(/No unreviewed README changes/)).toBeDefined();
  });
});
