export type ParsedUserAgent = {
  device: 'desktop' | 'mobile' | 'tablet';
  os: string | null;
  browser: string | null;
};

/**
 * Compact user-agent classifier covering the major device classes, operating
 * systems, and browsers. Deliberately dependency-free; anything unrecognized
 * falls back to desktop/null rather than guessing.
 */
export function parseUserAgent(ua?: string | null): ParsedUserAgent {
  if (!ua) {
    return { device: 'desktop', os: null, browser: null };
  }

  const device: ParsedUserAgent['device'] = /iPad|Tablet|PlayBook|Silk/i.test(
    ua,
  )
    ? 'tablet'
    : /Mobi|iPhone|iPod|Android.*Mobile|Windows Phone/i.test(ua)
      ? 'mobile'
      : 'desktop';

  // Order matters: iOS devices claim "like Mac OS X", Android claims "Linux".
  let os: string | null = null;
  if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/Windows NT/i.test(ua)) os = 'Windows';
  else if (/Mac OS X|Macintosh/i.test(ua)) os = 'macOS';
  else if (/CrOS/i.test(ua)) os = 'ChromeOS';
  else if (/Linux/i.test(ua)) os = 'Linux';

  // Order matters: Edge/Opera/Samsung embed "Chrome", Chrome embeds "Safari".
  let browser: string | null = null;
  if (/Edg(e|A|iOS)?\//i.test(ua)) browser = 'Edge';
  else if (/OPR\/|Opera/i.test(ua)) browser = 'Opera';
  else if (/SamsungBrowser/i.test(ua)) browser = 'Samsung Internet';
  else if (/Firefox\/|FxiOS/i.test(ua)) browser = 'Firefox';
  else if (/Chrome\/|CriOS/i.test(ua)) browser = 'Chrome';
  else if (/Safari\//i.test(ua)) browser = 'Safari';

  return { device, os, browser };
}

const SOURCE_RULES: [RegExp, string][] = [
  [/google\./i, 'Google'],
  [/bing\.com/i, 'Bing'],
  [/duckduckgo\.com/i, 'DuckDuckGo'],
  [/yandex\./i, 'Yandex'],
  [/baidu\.com/i, 'Baidu'],
  [/github\.com/i, 'GitHub'],
  [/linkedin\.com|lnkd\.in/i, 'LinkedIn'],
  [/facebook\.com|fb\.com|fb\.me/i, 'Facebook'],
  [/instagram\.com/i, 'Instagram'],
  [/twitter\.com|t\.co|x\.com/i, 'X (Twitter)'],
  [/youtube\.com|youtu\.be/i, 'YouTube'],
  [/reddit\.com/i, 'Reddit'],
];

/** Classify a traffic source from an explicit utm_source or the referrer URL. */
export function classifySource(
  referrer?: string | null,
  utmSource?: string | null,
): string {
  if (utmSource) {
    const label = utmSource.trim().slice(0, 40);
    return label.charAt(0).toUpperCase() + label.slice(1);
  }
  if (!referrer) {
    return 'Direct';
  }
  let host: string;
  try {
    host = new URL(referrer).hostname;
  } catch {
    return 'Direct';
  }
  for (const [pattern, label] of SOURCE_RULES) {
    if (pattern.test(host)) {
      return label;
    }
  }
  return 'Referral';
}
