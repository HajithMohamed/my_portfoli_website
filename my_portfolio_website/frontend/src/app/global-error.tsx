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
          background: "#05070d",
          color: "#e6f0fa",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "28rem",
            padding: "2rem",
            textAlign: "center",
            border: "1px solid #1e3a5f",
            background: "rgba(10,22,40,0.6)",
          }}
        >
          <div
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#f87171",
            }}
          >
            Critical fault
          </div>
          <h1 style={{ marginTop: "1rem", fontSize: "1.5rem", fontWeight: 600 }}>
            System offline
          </h1>
          <p style={{ marginTop: "0.75rem", fontSize: "0.875rem", color: "#6b8caf" }}>
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
                color: "#5cd0ff",
                border: "1px solid rgba(92,208,255,0.4)",
                background: "rgba(92,208,255,0.1)",
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
                color: "#e6f0fa",
                border: "1px solid #1e3a5f",
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
