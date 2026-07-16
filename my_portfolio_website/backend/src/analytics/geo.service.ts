import { Injectable, Logger } from '@nestjs/common';

export type GeoResult = {
  country: string | null;
  countryCode: string | null;
  region: string | null;
  city: string | null;
};

const EMPTY: GeoResult = {
  country: null,
  countryCode: null,
  region: null,
  city: null,
};

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const CACHE_MAX = 5_000;
const LOOKUP_TIMEOUT_MS = 1_500;

/**
 * Best-effort IP geolocation via the keyless ipwho.is API. Results are cached
 * in memory for a day; private/local addresses and any lookup failure resolve
 * to nulls so tracking never blocks on geo.
 */
@Injectable()
export class GeoService {
  private readonly logger = new Logger(GeoService.name);
  private readonly cache = new Map<string, { at: number; geo: GeoResult }>();

  async lookup(ip?: string | null): Promise<GeoResult> {
    if (!ip || isPrivateIp(ip)) {
      return EMPTY;
    }

    const cached = this.cache.get(ip);
    if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
      return cached.geo;
    }

    const geo = await this.fetchGeo(ip);
    if (this.cache.size >= CACHE_MAX) {
      this.cache.clear();
    }
    this.cache.set(ip, { at: Date.now(), geo });
    return geo;
  }

  private async fetchGeo(ip: string): Promise<GeoResult> {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), LOOKUP_TIMEOUT_MS);
      const response = await fetch(
        `https://ipwho.is/${encodeURIComponent(ip)}?fields=success,country,country_code,region,city`,
        { signal: controller.signal },
      );
      clearTimeout(timer);
      if (!response.ok) {
        return EMPTY;
      }
      const data = (await response.json()) as {
        success?: boolean;
        country?: string;
        country_code?: string;
        region?: string;
        city?: string;
      };
      if (!data.success) {
        return EMPTY;
      }
      return {
        country: data.country ?? null,
        countryCode: data.country_code ?? null,
        region: data.region ?? null,
        city: data.city ?? null,
      };
    } catch {
      this.logger.debug(`Geo lookup failed for ${ip}`);
      return EMPTY;
    }
  }
}

function isPrivateIp(ip: string): boolean {
  return (
    ip === 'unknown' ||
    ip === '::1' ||
    /^127\./.test(ip) ||
    /^10\./.test(ip) ||
    /^192\.168\./.test(ip) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(ip) ||
    /^169\.254\./.test(ip) ||
    /^f[cd][0-9a-f]{2}:/i.test(ip) ||
    /^fe80:/i.test(ip)
  );
}
