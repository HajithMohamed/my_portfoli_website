import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const title = searchParams.get("title") || "HZ Labs Studio";
    const category = searchParams.get("category") || "Full-Stack Software Architecture";
    const badge = searchParams.get("badge") || "SYSTEM DOSSIER";
    const techString = searchParams.get("tech") || "Next.js,TypeScript,NestJS,Distributed Systems";
    const techTags = techString.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 5);

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#05070f",
            backgroundImage:
              "radial-gradient(circle at 15% 20%, rgba(6, 182, 212, 0.18) 0%, transparent 45%), radial-gradient(circle at 85% 80%, rgba(99, 102, 241, 0.18) 0%, transparent 45%)",
            padding: "60px 70px",
            fontFamily: "sans-serif",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* Header Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: "#06b6d4",
                  boxShadow: "0 0 12px #06b6d4",
                }}
              />
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: "0.25em",
                  color: "#06b6d4",
                  textTransform: "uppercase",
                }}
              >
                HZ LABS // {badge}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "6px 16px",
                borderRadius: "20px",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                color: "#94a3b8",
                fontSize: 14,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {category}
            </div>
          </div>

          {/* Main Title Body */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              maxWidth: "1000px",
            }}
          >
            <h1
              style={{
                fontSize: title.length > 40 ? 52 : 64,
                fontWeight: 900,
                color: "#ffffff",
                lineHeight: 1.15,
                margin: 0,
                letterSpacing: "-0.02em",
                textShadow: "0 0 40px rgba(6, 182, 212, 0.3)",
              }}
            >
              {title}
            </h1>

            {/* Tech Stack Pills */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginTop: "12px",
              }}
            >
              {techTags.map((tech) => (
                <div
                  key={tech}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "6px 14px",
                    borderRadius: "8px",
                    border: "1px solid rgba(6, 182, 212, 0.3)",
                    backgroundColor: "rgba(6, 182, 212, 0.1)",
                    color: "#06b6d4",
                    fontSize: 15,
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                  }}
                >
                  #{tech}
                </div>
              ))}
            </div>
          </div>

          {/* Footer Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              paddingTop: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 14,
                  color: "#05070f",
                }}
              >
                MH
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#ffffff",
                  }}
                >
                  Mohamed Hajith
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: "#64748b",
                    letterSpacing: "0.05em",
                  }}
                >
                  Full-Stack Software Engineer · BICT (Hons)
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#64748b",
                fontSize: 14,
                letterSpacing: "0.05em",
              }}
            >
              <span>hzlabs.studio</span>
              <span>·</span>
              <span style={{ color: "#06b6d4" }}>production verified</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate OpenGraph image: ${e.message}`, {
      status: 500,
    });
  }
}
