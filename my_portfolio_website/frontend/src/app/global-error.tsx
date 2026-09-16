"use client";

// Custom global error boundary. Providing this overrides Next's default
// `/_global-error` route, which otherwise fails to prerender under Turbopack
// with "Cannot read properties of null (reading 'useContext')". It renders its
// own <html>/<body> and uses only inline styles so it has no dependency on the
// root layout, fonts, providers, or globals.css during prerender.
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          background: "var(--background, var(--bg-base))",
          color: "var(--foreground, var(--text-primary))",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "28rem",
            padding: "2rem",
            textAlign: "center",
            border: "1px solid var(--border, var(--border-subtle))",
            background: "color-mix(in oklab, var(--surface, var(--bg-surface)) 60%, transparent)",
          }}
        >
          <div
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "var(--signal-red, var(--status-error))",
            }}
          >
            Critical fault
          </div>
          <h1 style={{ marginTop: "1rem", fontSize: "1.5rem", fontWeight: 600 }}>
            System offline
          </h1>
          <p style={{ marginTop: "0.75rem", fontSize: "0.875rem", color: "var(--muted-foreground, var(--text-secondary))" }}>
            A top-level exception took the console down. Reboot to reconnect.
          </p>
          <div
            style={{
              marginTop: "1.5rem",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            <button
              onClick={reset}
              type="button"
              style={{
                padding: "0.5rem 1rem",
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--cyan, var(--accent))",
                border: "1px solid color-mix(in oklab, var(--cyan, var(--accent)) 40%, transparent)",
                background: "color-mix(in oklab, var(--cyan, var(--accent)) 10%, transparent)",
                cursor: "pointer",
              }}
            >
              {"> reboot"}
            </button>
            <a
              href="/"
              style={{
                padding: "0.5rem 1rem",
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--foreground, var(--text-primary))",
                border: "1px solid var(--border, var(--border-subtle))",
                textDecoration: "none",
              }}
            >
              {"> return home"}
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
