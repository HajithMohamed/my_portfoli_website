import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { BlogCatalogueView, calculateReadingTime } from "@/components/blog/blog-catalogue-view";
import type { BlogPost } from "@/lib/types";

// Mock server-only & public-data
vi.mock("server-only", () => ({}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/blog",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

vi.mock("next/image", () => ({
  default: ({ fill, priority, ...props }: any) => <img {...props} />,
}));

const mockPosts: BlogPost[] = [
  {
    id: "story:saga-elite",
    title: "Saga Elite: connecting a fashion drop to the order behind it",
    slug: "saga-elite-fashion-drops-and-order-workflows",
    excerpt: "Project notes on limited-stock releases, payment confirmation, and admin workflows.",
    content: "Saga Elite is a university group project for a Sri Lankan limited-edition fashion brand. " +
      "It connects that shopping experience to the everyday work of managing products, orders, and payments.",
    coverImage: "/projects/saga-elite-cover.png",
    status: "PUBLISHED",
    publishedAt: "2026-09-10T00:00:00.000Z",
    sourceUrl: "https://github.com/HajithMohamed/Saga-Elite-Web-project",
    author: "Mohamed Hajith",
    tags: [
      { name: "React", slug: "react" },
      { name: "Node.js", slug: "nodejs" },
    ],
  },
  {
    id: "story:shoe-bank",
    title: "Shoe Bank: why profit and cash need separate views",
    slug: "shoe-bank-profit-cash-and-credit-sales",
    excerpt: "How the wholesale footwear project's documented rules handle landed cost and credit invoices.",
    content: "Shoe Bank is a mobile-first management project for a Sri Lankan footwear wholesaler. " +
      "The central distinction is between making a profitable sale and receiving its payment.",
    coverImage: "/projects/shoe-bank-cover.png",
    status: "PUBLISHED",
    publishedAt: "2026-09-10T00:00:00.000Z",
    sourceUrl: "https://github.com/HajithMohamed/Footwear_Business_Management_System",
    author: "Mohamed Hajith",
    tags: [
      { name: "PHP", slug: "php" },
      { name: "MySQL", slug: "mysql" },
    ],
  },
];

describe("Blog Utilities", () => {
  it("calculates reading time correctly based on word count", () => {
    const shortText = "Word ".repeat(150);
    expect(calculateReadingTime(shortText)).toBe("1 min read");

    const longText = "Word ".repeat(650);
    expect(calculateReadingTime(longText)).toBe("4 min read");
  });
});

describe("BlogCatalogueView Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders search box, topic filter buttons, and post items", () => {
    render(<BlogCatalogueView initialPosts={mockPosts} />);

    expect(screen.getByPlaceholderText(/Search engineering articles/i)).toBeTruthy();
    expect(screen.getByText("All Topics")).toBeTruthy();
    expect(screen.getAllByText(/React/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/PHP/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/FEATURED ENGINEERING DISPATCH/i)).toBeTruthy();
    expect(screen.getByText("Saga Elite: connecting a fashion drop to the order behind it")).toBeTruthy();
  });

  it("filters posts by search query in real time", () => {
    render(<BlogCatalogueView initialPosts={mockPosts} />);

    const searchInput = screen.getByPlaceholderText(/Search engineering articles/i);
    fireEvent.change(searchInput, { target: { value: "Shoe Bank" } });

    expect(screen.getByText("Shoe Bank: why profit and cash need separate views")).toBeTruthy();
    expect(screen.queryByText("Saga Elite: connecting a fashion drop to the order behind it")).toBeNull();
  });

  it("filters posts when clicking topic tag buttons", () => {
    render(<BlogCatalogueView initialPosts={mockPosts} />);

    const phpTagBtn = screen.getByRole("button", { name: "#PHP" });
    fireEvent.click(phpTagBtn);

    expect(screen.getByText("Shoe Bank: why profit and cash need separate views")).toBeTruthy();
    expect(screen.queryByText("Saga Elite: connecting a fashion drop to the order behind it")).toBeNull();
  });

  it("shows empty state when no posts match and allows resetting filters", () => {
    render(<BlogCatalogueView initialPosts={mockPosts} />);

    const searchInput = screen.getByPlaceholderText(/Search engineering articles/i);
    fireEvent.change(searchInput, { target: { value: "NonExistentKeywordXYZ" } });

    expect(screen.getByText("No matching dispatches found")).toBeTruthy();

    const resetBtn = screen.getByRole("button", { name: /Reset Filters/i });
    fireEvent.click(resetBtn);

    expect(screen.getByText("Saga Elite: connecting a fashion drop to the order behind it")).toBeTruthy();
  });
});
