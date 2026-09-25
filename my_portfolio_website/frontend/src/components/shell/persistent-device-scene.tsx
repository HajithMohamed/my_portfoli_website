"use client";

import { usePathname } from "next/navigation";

interface ScreenContent {
  route: string;
  title: string;
  detail: string;
  signals: readonly [string, string, string];
}

function contentFor(pathname: string): ScreenContent {
  if (pathname.startsWith("/about")) {
    return {
      route: "ABOUT / OPERATOR",
      title: "Engineering profile",
      detail: "background · focus · availability",
      signals: ["BIO", "FOCUS", "OPEN"],
    };
  }

  if (pathname.startsWith("/projects")) {
    return {
      route: "PROJECTS / ARCHIVE",
      title: "Shipping systems",
      detail: "repositories · case studies · builds",
      signals: ["REPOS", "BUILDS", "LIVE"],
    };
  }

  if (pathname.startsWith("/certificates")) {
    return {
      route: "CREDENTIALS / VAULT",
      title: "Learning record",
      detail: "courses · milestones · progress",
      signals: ["CERTS", "HOURS", "NEXT"],
    };
  }

  if (pathname.startsWith("/blog")) {
    return {
      route: "NOTES / FIELD LOG",
      title: "Build in public",
      detail: "decisions · progress · lessons",
      signals: ["LOGS", "IDEAS", "SIGNAL"],
    };
  }

  if (pathname.startsWith("/start-project")) {
    return {
      route: "INTAKE / NEW PROJECT",
      title: "Start a build",
      detail: "scope · goals · collaboration",
      signals: ["BRIEF", "SCOPE", "LAUNCH"],
    };
  }

  return {
    route: "HOME / COMMAND DECK",
    title: "Operator online",
    detail: "portfolio system · ready",
    signals: ["STATUS", "FOCUS", "COMMS"],
  };
}

function Screen({ portraitUrl, content, compact = false }: { portraitUrl?: string; content: ScreenContent; compact?: boolean }) {
  return (
    <div className={`device-screen-content${compact ? " device-screen-content-compact" : ""}`}>
      <div className="device-screen-scan" />
      <div className="device-screen-photo">
        {portraitUrl ? (
          // The image comes from the profile editor and is decorative here.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={portraitUrl} alt="" />
        ) : (
          <div className="device-screen-photo-fallback">
            <span>OP</span>
          </div>
        )}
      </div>
      <div className="device-screen-copy">
        <span className="device-screen-route">{content.route}</span>
        <strong>{content.title}</strong>
        <span className="device-screen-detail">{content.detail}</span>
        <div className="device-screen-signals">
          {content.signals.map((signal) => (
            <span key={signal}>{signal}</span>
          ))}
        </div>
      </div>
      <span className="device-screen-status">LIVE</span>
    </div>
  );
}

/** CSS devices avoid a heavy WebGL dependency while retaining continuous 3D-like motion. */
export function PersistentDeviceScene({ portraitUrl }: { portraitUrl?: string }) {
  const pathname = usePathname();
  const content = contentFor(pathname);

  return (
    <div className="persistent-device-scene">
      <div className="device-aura" />

      <div className="device-laptop" aria-hidden="true">
        <div className="device-laptop-screen">
          <Screen portraitUrl={portraitUrl} content={content} />
        </div>
        <div className="device-laptop-base">
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className="device-phone" aria-hidden="true">
        <div className="device-phone-notch" />
        <Screen portraitUrl={portraitUrl} content={content} compact />
        <div className="device-phone-home" />
      </div>
    </div>
  );
}
