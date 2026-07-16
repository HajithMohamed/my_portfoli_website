"use client";

import { useState } from "react";
import { Panel } from "@/components/hud/panel";
import { absoluteApiUrl } from "@/lib/utils";
import { track } from "@/lib/analytics";
import type { Profile } from "@/lib/types";

function TerminalField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="mt-2 flex items-center gap-2 border-b border-cyan/15 py-1.5">
      <span className="text-cyan/60">▸</span>
      <label htmlFor={`comms-${name}`} className="w-16 shrink-0 text-[10px] uppercase tracking-[0.25em] text-cyan">
        {label}
      </label>
      <input
        id={`comms-${name}`}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground/60"
      />
    </div>
  );
}

export function Comms({ profile }: { profile: Profile }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [form, setForm] = useState({ name: "", from: "", subject: "", body: "" });

  const githubLink = profile.socialLinks?.find((l) => l.url.includes("github.com"))?.url;
  const githubHandle = githubLink?.replace(/\/$/, "").split("/").pop() ?? "HajithMohamed";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    try {
      const response = await fetch(absoluteApiUrl("/messages"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.from,
          subject: form.subject || "Portfolio inquiry",
          message: form.body,
        }),
      });
      if (response.ok) {
        setState("sent");
        track("contact_submit");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  return (
    <Panel label="comms.terminal" subtitle="open channel" live>
      <div className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 font-mono text-xs">
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-cyan/70">operator</div>
            <div className="text-foreground">{profile.name}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-cyan/70">direct</div>
            <a href={`mailto:${profile.email}`} className="text-cyan hover:underline">
              {profile.email}
            </a>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-cyan/70">github</div>
            <a
              href={githubLink ?? `https://github.com/${githubHandle}`}
              target="_blank"
              rel="noreferrer"
              className="text-foreground hover:text-cyan"
            >
              @{githubHandle}
            </a>
          </div>
          {profile.socialLinks
            ?.filter((l) => !l.url.includes("github.com") && !l.url.startsWith("mailto:"))
            .map((l) => (
              <div key={l.label}>
                <div className="text-[10px] uppercase tracking-[0.25em] text-cyan/70">
                  {l.label}
                </div>
                <a
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="break-all text-foreground hover:text-cyan"
                >
                  {l.url.replace(/^https?:\/\//, "")}
                </a>
              </div>
            ))}
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-cyan/70">location</div>
            <div className="text-foreground">{profile.location}</div>
          </div>
          <div className="border-t border-cyan/10 pt-3 text-[11px] text-muted-foreground">
            <span className="text-cyan/70">▸ tip:</span> lead with the problem, not the tech.
          </div>
        </div>

        <form onSubmit={submit} className="border border-cyan/15 bg-black/40 p-4 font-mono text-xs">
          <TerminalField
            label="callsign"
            name="name"
            value={form.name}
            onChange={(v) => setForm((f) => ({ ...f, name: v }))}
            placeholder="your name"
            required
          />
          <TerminalField
            label="from"
            name="email"
            type="email"
            value={form.from}
            onChange={(v) => setForm((f) => ({ ...f, from: v }))}
            placeholder="you@company.com"
            required
          />
          <TerminalField
            label="re"
            name="subject"
            value={form.subject}
            onChange={(v) => setForm((f) => ({ ...f, subject: v }))}
            placeholder="short subject"
          />
          <div className="mt-3">
            <div className="mb-1 flex items-center gap-2">
              <span className="text-cyan/60">▸</span>
              <label
                htmlFor="comms-message"
                className="text-[10px] uppercase tracking-[0.25em] text-cyan"
              >
                message
              </label>
            </div>
            <textarea
              id="comms-message"
              name="message"
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              rows={5}
              required
              className="w-full resize-none border border-cyan/20 bg-transparent p-2 text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-cyan"
              placeholder="briefing…"
            />
          </div>

          <button
            type="submit"
            disabled={state === "sending" || state === "sent"}
            className="mt-4 flex w-full items-center justify-center gap-2 border border-cyan/50 bg-cyan/10 px-4 py-2.5 uppercase tracking-[0.25em] text-cyan transition-all hover:bg-cyan/20 disabled:opacity-60"
          >
            {state === "idle" && "> transmit"}
            {state === "error" && "> retry transmit"}
            {state === "sending" && (
              <>
                <span className="inline-block h-2 w-2 rounded-full bg-cyan animate-pulse-dot" />
                encoding…
              </>
            )}
            {state === "sent" && (
              <>
                <span className="text-signal-green">✓</span> received
              </>
            )}
          </button>
          {state === "sent" && (
            <div className="mt-2 text-[11px] text-signal-green">
              signal received. expect a reply within 24h.
            </div>
          )}
          {state === "error" && (
            <div className="mt-2 text-[11px] text-signal-red">
              transmission failed — email {profile.email} directly.
            </div>
          )}
        </form>
      </div>
    </Panel>
  );
}
