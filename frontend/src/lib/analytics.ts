import { bffUrl } from "./api";

// First-party, anonymous analytics client. Identity is a random UUID in
// localStorage (visitor) plus a 30-minute sliding session id in sessionStorage.
// No cookies, no fingerprinting, no third parties. Admins are excluded via the
// hz_dnt flag set on admin login.

const VISITOR_KEY = "hz_vid";
const SESSION_KEY = "hz_sid";
const SESSION_SEEN_KEY = "hz_sid_at";
const DNT_KEY = "hz_dnt";
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

type CollectPayload = {
  visitorId: string;
  sessionKey: string;
  kind: "pageview" | "event" | "ping";
  path?: string;
  referrer?: string;
  utmSource?: string;
  type?: string;
  metadata?: Record<string, unknown>;
  scrollDepth?: number;
  duration?: number;
};

function randomId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

export function analyticsDisabled(): boolean {
  try {
    return typeof window === "undefined" || localStorage.getItem(DNT_KEY) === "1";
  } catch {
    return true;
  }
}

/** Called after a successful admin login so the owner's visits are not counted. */
export function excludeSelfFromAnalytics() {
  try {
    localStorage.setItem(DNT_KEY, "1");
  } catch {
    // Storage unavailable — nothing to do.
  }
}

function getVisitorId(): string {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = randomId();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

function getSessionKey(): string {
  const lastSeen = Number(sessionStorage.getItem(SESSION_SEEN_KEY) ?? 0);
  let key = sessionStorage.getItem(SESSION_KEY);
  if (!key || Date.now() - lastSeen > SESSION_TIMEOUT_MS) {
    key = randomId();
    sessionStorage.setItem(SESSION_KEY, key);
  }
  sessionStorage.setItem(SESSION_SEEN_KEY, String(Date.now()));
  return key;
}

function send(body: CollectPayload) {
  const url = bffUrl("/analytics/collect");
  const json = JSON.stringify(body);
  try {
    if (navigator.sendBeacon) {
      const ok = navigator.sendBeacon(url, new Blob([json], { type: "application/json" }));
      if (ok) return;
    }
    void fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: json,
      keepalive: true,
    });
  } catch {
    // Analytics must never break the site.
  }
}

function dispatch(partial: Omit<CollectPayload, "visitorId" | "sessionKey">) {
  if (analyticsDisabled()) return;
  try {
    send({
      visitorId: getVisitorId(),
      sessionKey: getSessionKey(),
      ...partial,
    });
  } catch {
    // Storage blocked (private mode etc.) — skip silently.
  }
}

export function trackPageView(path: string) {
  const params = new URLSearchParams(window.location.search);
  // Same-origin referrers are internal navigation, not a traffic source.
  let referrer: string | undefined;
  try {
    if (document.referrer && new URL(document.referrer).origin !== window.location.origin) {
      referrer = document.referrer;
    }
  } catch {
    referrer = undefined;
  }
  dispatch({
    kind: "pageview",
    path,
    referrer,
    utmSource: params.get("utm_source") ?? undefined,
  });
}

/** Record a custom interaction, e.g. track("github_click", { href }). */
export function track(type: string, metadata?: Record<string, unknown>) {
  dispatch({
    kind: "event",
    type,
    path: window.location.pathname,
    metadata,
  });
}

export function trackLeave(path: string, durationSec: number, scrollDepth: number) {
  dispatch({
    kind: "ping",
    path,
    duration: Math.max(0, Math.round(durationSec)),
    scrollDepth: Math.min(100, Math.max(0, Math.round(scrollDepth))),
  });
}
