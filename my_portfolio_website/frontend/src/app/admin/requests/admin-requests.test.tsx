import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import AdminRequestsPage from "./page";
import type { ProjectRequest } from "@/lib/types";

// Mock router
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => "/admin/requests",
}));

// Mock adminFetch
const mockAdminFetch = vi.fn();
vi.mock("@/lib/api", () => ({
  adminFetch: (...args: any[]) => mockAdminFetch(...args),
}));

const mockRequests: ProjectRequest[] = [
  {
    id: "req-1",
    referenceId: "REQ-8901",
    name: "Jane Smith",
    email: "jane@enterprise.com",
    company: "Acme Logistics",
    projectType: "Enterprise Web Application",
    timeline: "2-3 months",
    budget: "$10,000 - $25,000",
    overview: "Need a high-throughput warehouse inventory reconciliation engine.",
    deliverables: ["RBAC Portal", "REST API", "Database Schema"],
    preferredTech: ["React", "NestJS", "PostgreSQL"],
    status: "NEW",
    internalNotes: "Prioritize evaluation.",
    createdAt: "2026-10-18T10:00:00.000Z",
    updatedAt: "2026-10-18T10:00:00.000Z",
  },
  {
    id: "req-2",
    referenceId: "REQ-8902",
    name: "Alex Vance",
    email: "alex@techstart.io",
    company: "TechStart",
    projectType: "Mobile Application",
    timeline: "1 month",
    budget: "$5,000 - $10,000",
    overview: "Customer iOS and Android mobile catalog.",
    deliverables: ["React Native Client"],
    preferredTech: ["React Native", "TypeScript"],
    status: "REVIEWING",
    internalNotes: "",
    createdAt: "2026-10-19T14:30:00.000Z",
    updatedAt: "2026-10-19T14:30:00.000Z",
  },
];

describe("AdminRequestsPage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAdminFetch.mockResolvedValue(mockRequests);
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the pipeline header and loads requests from backend", async () => {
    render(<AdminRequestsPage />);

    expect(screen.getByText("Project Requests Pipeline")).toBeTruthy();

    await waitFor(() => {
      expect(mockAdminFetch).toHaveBeenCalledWith("/admin/requests");
    });

    expect(screen.getAllByText("Jane Smith").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("REQ-8901").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("REQ-8902").length).toBeGreaterThanOrEqual(1);
  });

  it("filters requests dynamically via search input", async () => {
    render(<AdminRequestsPage />);

    await waitFor(() => {
      expect(screen.getAllByText("Jane Smith").length).toBeGreaterThanOrEqual(1);
    });

    const searchInput = screen.getByPlaceholderText(/Search by name, email, ref ID/i);
    fireEvent.change(searchInput, { target: { value: "Alex" } });

    expect(screen.getAllByText("Alex Vance").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText("Jane Smith")).toBeNull();
  });

  it("filters requests when clicking stage filter buttons", async () => {
    render(<AdminRequestsPage />);

    await waitFor(() => {
      expect(screen.getAllByText("Jane Smith").length).toBeGreaterThanOrEqual(1);
    });

    // Click on Reviewing stage button
    const reviewingBtn = screen.getByRole("button", { name: /^Reviewing/i });
    fireEvent.click(reviewingBtn);

    expect(screen.getAllByText("Alex Vance").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText("Jane Smith")).toBeNull();
  });

  it("opens the detail drawer when clicking a request card", async () => {
    render(<AdminRequestsPage />);

    await waitFor(() => {
      expect(screen.getAllByText("Jane Smith").length).toBeGreaterThanOrEqual(1);
    });

    const requestCards = screen.getAllByText("Jane Smith");
    fireEvent.click(requestCards[0]);

    // Drawer should show details
    expect(screen.getByText(/Move Pipeline Stage/i)).toBeTruthy();
    expect(screen.getAllByText(/warehouse inventory reconciliation engine/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("$10,000 - $25,000").length).toBeGreaterThanOrEqual(1);
  });

  it("allows updating status stage from the detail drawer", async () => {
    mockAdminFetch.mockImplementation(async (path, opts) => {
      if (opts?.method === "PATCH") {
        return { success: true };
      }
      return mockRequests;
    });

    render(<AdminRequestsPage />);

    await waitFor(() => {
      expect(screen.getAllByText("Jane Smith").length).toBeGreaterThanOrEqual(1);
    });

    const requestCards = screen.getAllByText("Jane Smith");
    fireEvent.click(requestCards[0]);

    // Click "Approved" stage button inside drawer
    const approvedBtn = screen.getByRole("button", { name: "Approved" });
    fireEvent.click(approvedBtn);

    await waitFor(() => {
      expect(mockAdminFetch).toHaveBeenCalledWith("/admin/requests/req-1", {
        method: "PATCH",
        body: JSON.stringify({ status: "APPROVED" }),
      });
    });
  });
});
