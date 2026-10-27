import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ProjectsPanel } from "./admin-projects-panel";
import { adminFetch } from "@/lib/api";
import type { Project } from "@/lib/types";

vi.mock("@/lib/api", () => ({
  adminFetch: vi.fn(),
  bffUrl: (path: string) => `/bff${path}`,
}));
beforeEach(() => {
  vi.mocked(adminFetch).mockReset().mockResolvedValue([]);
  HTMLDialogElement.prototype.showModal = vi.fn(function (
    this: HTMLDialogElement,
  ) {
    this.setAttribute("open", "");
  });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.removeAttribute("open");
  });
});
afterEach(cleanup);
describe("Project studio", () => {
  it("opens photos and videos directly and saves the gallery without overwriting project details", async () => {
    const project: Project = {
      id: "project-1",
      title: "Project gallery",
      slug: "project-gallery",
      description: "A project with uploaded media.",
      category: "Web app",
      status: "ACTIVE",
      featured: true,
      techStack: ["React"],
      coverImage: "https://res.cloudinary.com/demo/image/upload/screen.jpg",
      media: [
        {
          url: "https://res.cloudinary.com/demo/image/upload/screen.jpg",
          alt: "Screen",
          type: "IMAGE",
        },
        {
          url: "https://res.cloudinary.com/demo/video/upload/demo.mp4",
          alt: "Demo",
          type: "VIDEO",
        },
      ],
    };
    vi.mocked(adminFetch).mockResolvedValue([project]);
    render(<ProjectsPanel />);
    fireEvent.click(
      await screen.findByRole(
        "button",
        { name: "Manage photos and videos for Project gallery" },
        { timeout: 5000 },
      ),
    );
    expect(
      screen.getByRole("button", { name: "Upload photos & videos" }),
    ).toBeDefined();
    expect(screen.queryByLabelText("Project title")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Save media" }));
    await waitFor(() =>
      expect(
        vi
          .mocked(adminFetch)
          .mock.calls.some(
            ([path, options]) =>
              path === "/admin/projects/project-1" &&
              options?.method === "PATCH",
          ),
      ).toBe(true),
    );
    const call = vi
      .mocked(adminFetch)
      .mock.calls.find(([, options]) => options?.method === "PATCH")!;
    expect(JSON.parse(String(call[1]?.body))).toEqual({
      coverImage: project.coverImage,
      media: project.media,
    });
  });
  it("creates a private draft when no existing project is being edited", async () => {
    render(<ProjectsPanel />);
    await waitFor(() =>
      expect(screen.queryByText("Loading saved projects…")).toBeNull(),
    );
    fireEvent.click(screen.getByRole("button", { name: /New project/ }));
    fireEvent.change(screen.getByLabelText("Project title"), {
      target: { value: "New tool" },
    });
    fireEvent.change(screen.getByLabelText("Category"), {
      target: { value: "Developer tool" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "A reviewed project." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create draft" }));
    await waitFor(() =>
      expect(
        vi
          .mocked(adminFetch)
          .mock.calls.some(
            ([path, options]) =>
              path === "/admin/projects" && options?.method === "POST",
          ),
      ).toBe(true),
    );
    const call = vi
      .mocked(adminFetch)
      .mock.calls.find(([, options]) => options?.method === "POST")!;
    expect(JSON.parse(String(call[1]?.body))).toMatchObject({
      title: "New tool",
      slug: "new-tool",
      status: "DRAFT",
      showOnHomepage: false,
      media: [],
    });
    await waitFor(() =>
      expect(screen.getByText("Project saved successfully.")).toBeDefined(),
    );
  });
  it("shows a failed save as an error and keeps the editor open", async () => {
    render(<ProjectsPanel />);
    await waitFor(() =>
      expect(screen.queryByText("Loading saved projects…")).toBeNull(),
    );
    fireEvent.click(screen.getByRole("button", { name: /New project/ }));
    vi.mocked(adminFetch).mockRejectedValueOnce(
      new Error("Storage unavailable"),
    );
    fireEvent.submit(
      screen.getByRole("button", { name: "Create draft" }).closest("form")!,
    );
    await waitFor(() =>
      expect(screen.getByRole("alert").textContent).toBe("Storage unavailable"),
    );
    expect(screen.getByRole("dialog")).toBeDefined();
    expect(screen.queryByText("Project saved successfully.")).toBeNull();
  });
});
