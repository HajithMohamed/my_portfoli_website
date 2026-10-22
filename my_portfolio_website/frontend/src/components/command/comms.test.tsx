import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { Comms } from "./comms";
import type { Profile } from "@/lib/types";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, ...props }: any) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const mockProfile: Profile = {
  name: "Mohamed Hajith",
  title: "Full-Stack Engineer & System Architect",
  tagline: "Engineering resilient, high-performance web systems and scalable backends.",
  bio: "Full-stack developer building resilient distributed systems.",
  philosophy: "Building resilient distributed architectures with precision.",
  location: "Batticaloa, Sri Lanka",
  email: "ahammedlebbehajith@gmail.com",
  availabilityStatus: "Available for Architecture & Engineering Engagements",
  currentlyExploring: ["Event-Driven Architectures", "Distributed Consensus"],
  socialLinks: [
    { label: "github", url: "https://github.com/HajithMohamed" },
    { label: "linkedin", url: "https://linkedin.com/in/hajith-mohamed" },
  ],
};

describe("Comms Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders header, direct coordinates, email, and social links", () => {
    render(<Comms profile={mockProfile} />);

    expect(screen.getByText(/COMMS\.TERMINAL \/\/ SECURE OPERATOR CHANNEL/i)).toBeDefined();
    expect(screen.getByText(/Contact & Operator Uplink/i)).toBeDefined();
    expect(screen.getByText(/ahammedlebbehajith@gmail\.com/i)).toBeDefined();
    expect(screen.getByText(/@HajithMohamed/i)).toBeDefined();
    expect(screen.getByText(/Launch Project Intake Wizard/i)).toBeDefined();
  });

  it("displays validation messages when submitting empty form", async () => {
    render(<Comms profile={mockProfile} />);

    const submitBtn = screen.getByTestId("comms-submit-btn");
    fireEvent.click(submitBtn);

    const nameInput = screen.getByLabelText(/your name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const messageInput = screen.getByLabelText(/message payload/i);

    fireEvent.change(nameInput, { target: { value: "A" } });
    fireEvent.blur(nameInput);
    expect(await screen.findByText(/at least 2 characters/i)).toBeDefined();

    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.blur(emailInput);
    expect(await screen.findByText(/valid email address/i)).toBeDefined();

    fireEvent.change(messageInput, { target: { value: "short" } });
    fireEvent.blur(messageInput);
    expect(await screen.findByText(/at least 10 characters/i)).toBeDefined();
  });

  it("successfully submits message and displays confirmation state", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    render(<Comms profile={mockProfile} />);

    fireEvent.change(screen.getByLabelText(/your name/i), {
      target: { value: "Sarah Connor" },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "sarah@cyberdyne.org" },
    });
    fireEvent.change(screen.getByLabelText(/subject/i), {
      target: { value: "Distributed Architecture Project" },
    });
    fireEvent.change(screen.getByLabelText(/message payload/i), {
      target: { value: "We want to hire you to build an enterprise platform with high availability." },
    });

    const submitBtn = screen.getByTestId("comms-submit-btn");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Transmission Dispatched Successfully/i)).toBeDefined();
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining("/messages"),
      expect.objectContaining({
        method: "POST",
      })
    );
  });
});
