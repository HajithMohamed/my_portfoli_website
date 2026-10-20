import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import StartProjectPage from "./page";

let mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useSearchParams: () => mockSearchParams,
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/start-project",
}));

describe("StartProjectPage Wizard Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockSearchParams = new URLSearchParams();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("renders the wizard header and step 1 inputs", () => {
    render(<StartProjectPage />);

    expect(screen.getByText(/PROJECT REQUEST/i)).toBeDefined();
    expect(screen.getAllByText(/About You & Project/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByPlaceholderText(/e\.g\. Alex Morgan/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/e\.g\. you@company\.com/i)).toBeDefined();
  });

  it("blocks advancement to step 2 when name is empty and shows inline error", () => {
    render(<StartProjectPage />);

    const nextButtons = screen.getAllByRole("button", { name: /continue/i });
    fireEvent.click(nextButtons[0]);

    expect(screen.getByText(/Please enter your name to proceed/i)).toBeDefined();
  });

  it("blocks advancement to step 2 when email is invalid", () => {
    render(<StartProjectPage />);

    const nameInput = screen.getByPlaceholderText(/e\.g\. Alex Morgan/i);
    const emailInput = screen.getByPlaceholderText(/e\.g\. you@company\.com/i);

    fireEvent.change(nameInput, { target: { value: "Alex Developer" } });
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });

    const nextButtons = screen.getAllByRole("button", { name: /continue/i });
    fireEvent.click(nextButtons[0]);

    expect(screen.getByText(/Please enter a valid email address/i)).toBeDefined();
  });

  it("advances to step 2 (Goals) when name and email are valid", () => {
    render(<StartProjectPage />);

    const nameInput = screen.getByPlaceholderText(/e\.g\. Alex Morgan/i);
    const emailInput = screen.getByPlaceholderText(/e\.g\. you@company\.com/i);

    fireEvent.change(nameInput, { target: { value: "Alex Developer" } });
    fireEvent.change(emailInput, { target: { value: "alex@example.com" } });

    const nextButtons = screen.getAllByRole("button", { name: /continue/i });
    fireEvent.click(nextButtons[0]);

    expect(screen.getByText(/What are you trying to achieve/i)).toBeDefined();
  });

  it("displays catalog preselection badge when service query param is present", () => {
    mockSearchParams = new URLSearchParams("service=web-saas");
    render(<StartProjectPage />);

    expect(screen.getByText(/Catalog Preselection:/i)).toBeDefined();
    expect(screen.getAllByText(/Web & SaaS/i).length).toBeGreaterThanOrEqual(1);
  });
});
