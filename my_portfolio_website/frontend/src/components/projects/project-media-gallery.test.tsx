import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProjectMediaGallery } from "./project-media-gallery";
import type { Project } from "@/lib/types";

afterEach(cleanup);
const project: Project = {
  id: "one",
  slug: "one",
  title: "Inventory",
  description: "Inventory management",
  techStack: ["PHP"],
  category: "ERP",
  status: "ACTIVE",
  featured: true,
  media: [
    {
      url: "/projects/shoe-bank-cover.png",
      alt: "Inventory overview",
      type: "IMAGE",
      order: 0,
    },
    {
      url: "https://res.cloudinary.com/demo/video/upload/demo.mp4",
      alt: "Inventory demo",
      type: "VIDEO",
      order: 1,
    },
  ],
};

describe("Project media gallery", () => {
  it("starts on the chosen cover while preserving saved gallery order", () => {
    render(
      <ProjectMediaGallery
        project={{
          ...project,
          coverImage: "/projects/tech-bridge-cover.png",
          media: [
            project.media![0],
            {
              url: "/projects/tech-bridge-cover.png",
              alt: "Selected cover screenshot",
              type: "IMAGE",
            },
          ],
        }}
      />,
    );
    expect(screen.getByAltText("Selected cover screenshot")).toBeDefined();
    expect(screen.getByText(/02\s*\/\s*02/)).toBeDefined();
  });
  it("supports arrows and keyboard navigation without autoplaying videos", () => {
    render(<ProjectMediaGallery project={project} />);
    expect(screen.getByAltText("Inventory overview")).toBeDefined();
    fireEvent.click(screen.getByRole("button", { name: "Next media" }));
    expect(
      screen.getByRole("button", { name: /Play Inventory demo/ }),
    ).toBeDefined();
    expect(document.querySelector("video")).toBeNull();
    fireEvent.keyDown(
      screen.getByRole("region", { name: "Inventory media gallery" }),
      { key: "ArrowLeft" },
    );
    expect(screen.getByAltText("Inventory overview")).toBeDefined();
  });

  it("opens an accessible lightbox and closes on Escape, restoring focus", () => {
    HTMLDialogElement.prototype.showModal = vi.fn(function (
      this: HTMLDialogElement,
    ) {
      this.setAttribute("open", "");
    });
    HTMLDialogElement.prototype.close = vi.fn(function (
      this: HTMLDialogElement,
    ) {
      this.removeAttribute("open");
    });
    render(<ProjectMediaGallery project={project} />);
    const opener = screen.getByRole("button", {
      name: /Expand Inventory overview/,
    });
    opener.focus();
    fireEvent.click(opener);
    expect(
      screen.getByRole("dialog", { name: "Inventory media viewer" }),
    ).toBeDefined();
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(opener);
  });

  it("shows an honest fallback when screenshots are absent", () => {
    render(<ProjectMediaGallery project={{ ...project, media: [] }} />);
    expect(screen.getByText("Screenshots coming soon")).toBeDefined();
    expect(screen.queryByRole("button", { name: "Next media" })).toBeNull();
  });

  it("supports a horizontal swipe without requiring arrow controls", () => {
    render(<ProjectMediaGallery project={project} />);
    const gallery = screen.getByRole("region", {
      name: "Inventory media gallery",
    });
    fireEvent.touchStart(gallery, { changedTouches: [{ clientX: 220 }] });
    fireEvent.touchEnd(gallery, { changedTouches: [{ clientX: 100 }] });
    expect(
      screen.getByRole("button", { name: /Play Inventory demo/ }),
    ).toBeDefined();
  });
});
