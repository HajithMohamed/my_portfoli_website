import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import AdminGithubPage from "./page";

describe("AdminGithubPage diagnostics and draft import workflow", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("displays an explicit backend connection error alert when /bff returns HTML 404", async () => {
    globalThis.fetch = vi.fn(async () =>
      new Response("<!DOCTYPE html><html><body>Not Found</body></html>", {
        status: 404,
        headers: { "Content-Type": "text/html" },
      }),
    ) as unknown as typeof fetch;

    render(<AdminGithubPage />);

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toContain("CMS Backend Connection Issue");
    expect(alert.textContent).toContain("Backend proxy (/bff) returned 404");
  });

  it("explains that approved GitHub imports are saved as Drafts with a link to Projects Management", async () => {
    let approved = false;
    globalThis.fetch = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith("/github/summary")) {
        return new Response(
          JSON.stringify({
            username: "HajithMohamed",
            repositoryCount: 4,
            commitCount: 12,
            languages: ["TypeScript"],
            recentRepos: [],
            recentActivity: [],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      if (url.endsWith("/admin/suggestions")) {
        return new Response(
          JSON.stringify(
            approved
              ? []
              : [
                  {
                    id: "sugg-1",
                    source: "github:new-repo",
                    title: "Shoe Bank ERP",
                    status: "PENDING",
                    createdAt: "2026-10-30T00:00:00.000Z",
                  },
                ],
          ),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      if (url.endsWith("/admin/suggestions/sugg-1/approve")) {
        approved = true;
        return new Response(JSON.stringify({ id: "sugg-1", status: "APPROVED" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response("{}", {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }) as unknown as typeof fetch;

    render(<AdminGithubPage />);

    const approveBtn = await screen.findByRole("button", {
      name: /Approve as Draft/i,
    });
    fireEvent.click(approveBtn);

    await waitFor(() => {
      expect(screen.getByRole("status").textContent).toContain(
        "imported as a Draft project",
      );
    });
    const manageLink = screen.getByRole("link", {
      name: /Open Projects Management/i,
    });
    expect(manageLink.getAttribute("href")).toBe("/admin/projects");
  });
});

