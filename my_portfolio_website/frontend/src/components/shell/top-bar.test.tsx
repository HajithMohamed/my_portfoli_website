import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { TopBar, PRIMARY_NAV_ITEMS } from "./top-bar";

// Mock next/navigation
let mockPathname = "/";
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

// Mock framer-motion to render clean elements without animation stalls in jsdom
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, layoutId, ...props }: any) => (
      <div className={className} data-layoutid={layoutId} {...props}>
        {children}
      </div>
    ),
    span: ({ children, className, ...props }: any) => (
      <span className={className} {...props}>
        {children}
      </span>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe("TopBar Navigation Component", () => {
  beforeEach(() => {
    mockPathname = "/";
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the HZ LABS studio brand name and link to homepage", () => {
    render(<TopBar />);
    const brandLink = screen.getByRole("link", { name: /hz labs/i });
    expect(brandLink).toBeDefined();
    expect(brandLink.getAttribute("href")).toBe("/");
  });

  it("renders all approved primary navigation links", () => {
    render(<TopBar />);
    // Check that Home, Services, Work, and About exist
    PRIMARY_NAV_ITEMS.forEach((item) => {
      const link = screen.getAllByRole("link", { name: new RegExp(item.label, "i") })[0];
      expect(link).toBeDefined();
      expect(link.getAttribute("href")).toBe(item.href);
    });

    // Check Start a Project primary CTA button exists
    const ctaLink = screen.getAllByRole("link", { name: /start a project/i })[0];
    expect(ctaLink).toBeDefined();
    expect(ctaLink.getAttribute("href")).toBe("/start-project");
  });

  it("highlights Home as active when on the root route", () => {
    mockPathname = "/";
    render(<TopBar />);
    const homeLinks = screen.getAllByRole("link", { name: /^home$/i });
    expect(homeLinks[0].className).toContain("text-white");
  });

  it("highlights About as active when navigating to /about", () => {
    mockPathname = "/about";
    render(<TopBar />);
    const aboutLinks = screen.getAllByRole("link", { name: /^about$/i });
    expect(aboutLinks[0].className).toContain("text-white");
  });

  it("highlights Work as active when on /projects route", () => {
    mockPathname = "/projects";
    render(<TopBar />);
    const workLinks = screen.getAllByRole("link", { name: /^work$/i });
    expect(workLinks[0].className).toContain("text-white");
  });

  it("highlights Start a Project with active styling on /start-project route", () => {
    mockPathname = "/start-project";
    render(<TopBar />);
    const ctaLinks = screen.getAllByRole("link", { name: /start a project/i });
    expect(ctaLinks[0].className).toContain("from-violet-600");
  });

  it("toggles the mobile drawer menu when clicking the hamburger button", () => {
    render(<TopBar />);
    const toggleButton = screen.getByRole("button", { name: /open navigation menu/i });
    expect(toggleButton.getAttribute("aria-expanded")).toBe("false");

    // Click to open
    fireEvent.click(toggleButton);
    expect(screen.getByRole("button", { name: /close navigation menu/i })).toBeDefined();
    expect(toggleButton.getAttribute("aria-expanded")).toBe("true");

    // Drawer modal dialog should be visible
    const mobileDrawer = screen.getByRole("dialog", { name: /mobile navigation menu/i });
    expect(mobileDrawer).toBeDefined();

    // Click to close
    fireEvent.click(toggleButton);
    expect(toggleButton.getAttribute("aria-expanded")).toBe("false");
  });

  it("closes the mobile drawer when Escape key is pressed", () => {
    render(<TopBar />);
    const toggleButton = screen.getByRole("button", { name: /open navigation menu/i });

    // Open drawer
    fireEvent.click(toggleButton);
    expect(toggleButton.getAttribute("aria-expanded")).toBe("true");

    // Press Escape
    fireEvent.keyDown(window, { key: "Escape" });
    expect(toggleButton.getAttribute("aria-expanded")).toBe("false");
  });

  it("includes secondary navigation links in the mobile drawer (Blog, Certificates, Admin)", () => {
    render(<TopBar />);
    const toggleButton = screen.getByRole("button", { name: /open navigation menu/i });
    fireEvent.click(toggleButton);

    expect(screen.getByRole("link", { name: /blog/i })).toBeDefined();
    expect(screen.getByRole("link", { name: /certificates/i })).toBeDefined();
    expect(screen.getByRole("link", { name: /admin/i })).toBeDefined();
  });
});
