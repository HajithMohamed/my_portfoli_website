import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { GeoService } from './geo.service';
import { CollectDto } from './dto/collect.dto';
import { classifySource, parseUserAgent } from './ua.util';

export type RangeKey = '1d' | '7d' | '30d' | '90d' | '365d';

export const RANGE_KEYS: RangeKey[] = ['1d', '7d', '30d', '90d', '365d'];

const RANGE_DAYS: Record<RangeKey, number> = {
  '1d': 1,
  '7d': 7,
  '30d': 30,
  '90d': 90,
  '365d': 365,
};

type KpiRow = {
  sessions: number;
  visitors: number;
  returning: number;
  pageviews: number;
  avgduration: number;
  bounces: number;
};

type Insight = {
  title: string;
  detail: string;
  tone: 'positive' | 'warning' | 'info';
};

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly geo: GeoService,
  ) {}

  // ---- ingestion -----------------------------------------------------------

  async collect(dto: CollectDto, ip?: string, userAgent?: string) {
    const path = sanitizePath(dto.path);
    // Never record the hidden admin surface.
    if (path?.startsWith('/_internal')) {
      return { ok: true };
    }

    if (dto.kind === 'pageview') {
      await this.recordPageView(dto, path ?? '/', ip, userAgent);
    } else if (dto.kind === 'event' && dto.type) {
      await this.recordEvent(dto, path, ip, userAgent);
    } else if (dto.kind === 'ping') {
      await this.recordPing(dto, path);
    }
    return { ok: true };
  }

  private async recordPageView(
    dto: CollectDto,
    path: string,
    ip?: string,
    userAgent?: string,
  ) {
    const session = await this.ensureSession(dto, path, ip, userAgent);
    await this.prisma.$transaction([
      this.prisma.pageView.create({
        data: { path, sessionId: session.id },
      }),
      this.prisma.visitorSession.update({
        where: { id: session.id },
        data: {
          lastSeenAt: new Date(),
          exitPath: path,
          pageViewCount: { increment: 1 },
        },
      }),
    ]);
  }

  private async recordEvent(
    dto: CollectDto,
    path: string | null,
    ip?: string,
    userAgent?: string,
  ) {
    const session = await this.ensureSession(dto, path ?? '/', ip, userAgent);
    await this.prisma.analyticsEvent.create({
      data: {
        type: dto.type!,
        path,
        metadata: dto.metadata as Prisma.InputJsonValue | undefined,
        sessionId: session.id,
      },
    });
    await this.prisma.visitorSession.update({
      where: { id: session.id },
      data: { lastSeenAt: new Date() },
    });
  }

  private async recordPing(dto: CollectDto, path: string | null) {
    const session = await this.prisma.visitorSession.findUnique({
      where: { sessionKey: dto.sessionKey },
      select: { id: true, maxScrollDepth: true },
    });
    if (!session) {
      return;
    }
    const scrollDepth = dto.scrollDepth ?? 0;
    await this.prisma.visitorSession.update({
      where: { id: session.id },
      data: {
        lastSeenAt: new Date(),
        maxScrollDepth: Math.max(session.maxScrollDepth, scrollDepth),
      },
    });
    if (path && (dto.duration || dto.scrollDepth)) {
      const lastView = await this.prisma.pageView.findFirst({
        where: { sessionId: session.id, path },
        orderBy: { createdAt: 'desc' },
        select: { id: true },
      });
      if (lastView) {
        await this.prisma.pageView.update({
          where: { id: lastView.id },
          data: {
            duration: dto.duration ?? undefined,
            scrollDepth: dto.scrollDepth ?? undefined,
          },
        });
      }
    }
  }

  private async ensureSession(
    dto: CollectDto,
    entryPath: string,
    ip?: string,
    userAgent?: string,
  ) {
    const existing = await this.prisma.visitorSession.findUnique({
      where: { sessionKey: dto.sessionKey },
      select: { id: true },
    });
    if (existing) {
      return existing;
    }

    const ua = parseUserAgent(userAgent);
    const geo = await this.geo.lookup(ip);
    const priorSessions = await this.prisma.visitorSession.count({
      where: { visitorId: dto.visitorId },
    });

    return this.prisma.visitorSession.create({
      data: {
        sessionKey: dto.sessionKey,
        visitorId: dto.visitorId,
        entryPath,
        referrer: dto.referrer?.slice(0, 1024) || null,
        source: classifySource(dto.referrer, dto.utmSource),
        device: ua.device,
        os: ua.os,
        browser: ua.browser,
        country: geo.country,
        countryCode: geo.countryCode,
        region: geo.region,
        city: geo.city,
        isReturning: priorSessions > 0,
      },
      select: { id: true },
    });
  }

  // ---- aggregation ---------------------------------------------------------

  async dashboard(range: RangeKey) {
    const to = new Date();
    const days = RANGE_DAYS[range];
    const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000);
    const prevFrom = new Date(from.getTime() - days * 24 * 60 * 60 * 1000);

    const [
      kpis,
      prevKpis,
      eventCounts,
      prevEventCounts,
      timeseries,
      devices,
      browsers,
      osList,
      countries,
      sources,
      topPages,
      activeNow,
    ] = await Promise.all([
      this.kpiWindow(from, to),
      this.kpiWindow(prevFrom, from),
      this.eventCounts(from, to),
      this.eventCounts(prevFrom, from),
      this.timeseries(from, to, range === '1d' ? 'hour' : 'day'),
      this.sessionBreakdown('device', from, to),
      this.sessionBreakdown('browser', from, to),
      this.sessionBreakdown('os', from, to),
      this.countryBreakdown(from, to),
      this.sessionBreakdown('source', from, to),
      this.topPages(from, to),
      this.prisma.visitorSession.count({
        where: { lastSeenAt: { gte: new Date(Date.now() - 5 * 60 * 1000) } },
      }),
    ]);

    const projectViews = topPages
      .filter((page) => page.path.startsWith('/projects/'))
      .reduce((sum, page) => sum + page.views, 0);
    const blogViews = topPages
      .filter((page) => page.path.startsWith('/blog'))
      .reduce((sum, page) => sum + page.views, 0);

    const contactSubmissions = eventCounts['contact_submit'] ?? 0;
    const kpiPayload = {
      totalVisitors: withDelta(kpis.visitors, prevKpis.visitors),
      uniqueVisitors: withDelta(kpis.visitors, prevKpis.visitors),
      returningVisitors: withDelta(kpis.returning, prevKpis.returning),
      sessions: withDelta(kpis.sessions, prevKpis.sessions),
      pageViews: withDelta(kpis.pageviews, prevKpis.pageviews),
      activeNow: { value: activeNow, deltaPct: null as number | null },
      avgSessionDurationSec: withDelta(kpis.avgduration, prevKpis.avgduration),
      bounceRate: withDelta(
        rate(kpis.bounces, kpis.sessions),
        rate(prevKpis.bounces, prevKpis.sessions),
      ),
      conversionRate: withDelta(
        rate(contactSubmissions, kpis.sessions),
        rate(prevEventCounts['contact_submit'] ?? 0, prevKpis.sessions),
      ),
      contactSubmissions: withDelta(
        contactSubmissions,
        prevEventCounts['contact_submit'] ?? 0,
      ),
      resumeDownloads: withDelta(
        eventCounts['resume_download'] ?? 0,
        prevEventCounts['resume_download'] ?? 0,
      ),
      githubClicks: withDelta(
        eventCounts['github_click'] ?? 0,
        prevEventCounts['github_click'] ?? 0,
      ),
      socialClicks: withDelta(
        eventCounts['social_click'] ?? 0,
        prevEventCounts['social_click'] ?? 0,
      ),
      projectViews: { value: projectViews, deltaPct: null as number | null },
      blogViews: { value: blogViews, deltaPct: null as number | null },
    };

    return {
      range,
      from: from.toISOString(),
      to: to.toISOString(),
      kpis: kpiPayload,
      timeseries,
      devices,
      browsers,
      os: osList,
      countries,
      sources,
      topPages,
      insights: buildInsights({
        kpis,
        prevKpis,
        sources,
        devices,
        topPages,
        contactSubmissions,
        resumeDownloads: eventCounts['resume_download'] ?? 0,
        githubClicks: eventCounts['github_click'] ?? 0,
        rangeDays: days,
      }),
    };
  }

  private async kpiWindow(from: Date, to: Date): Promise<KpiRow> {
    const rows = await this.prisma.$queryRaw<KpiRow[]>`
      SELECT
        COUNT(*)::int AS sessions,
        COUNT(DISTINCT "visitorId")::int AS visitors,
        COUNT(DISTINCT CASE WHEN "isReturning" THEN "visitorId" END)::int AS returning,
        COALESCE(SUM("pageViewCount"), 0)::int AS pageviews,
        COALESCE(AVG(EXTRACT(EPOCH FROM ("lastSeenAt" - "startedAt"))), 0)::int AS avgduration,
        COUNT(CASE WHEN "pageViewCount" <= 1 THEN 1 END)::int AS bounces
      FROM "VisitorSession"
      WHERE "startedAt" >= ${from} AND "startedAt" < ${to}
    `;
    return (
      rows[0] ?? {
        sessions: 0,
        visitors: 0,
        returning: 0,
        pageviews: 0,
        avgduration: 0,
        bounces: 0,
      }
    );
  }

  private async eventCounts(
    from: Date,
    to: Date,
  ): Promise<Record<string, number>> {
    const rows = await this.prisma.analyticsEvent.groupBy({
      by: ['type'],
      where: { createdAt: { gte: from, lt: to } },
      _count: { _all: true },
    });
    return Object.fromEntries(rows.map((row) => [row.type, row._count._all]));
  }

  private async timeseries(from: Date, to: Date, bucket: 'hour' | 'day') {
    const rows = await this.prisma.$queryRaw<
      { bucket: string; visitors: number; sessions: number; pageviews: number }[]
    >`
      SELECT
        to_char(date_trunc(${bucket}, "startedAt"), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS bucket,
        COUNT(DISTINCT "visitorId")::int AS visitors,
        COUNT(*)::int AS sessions,
        COALESCE(SUM("pageViewCount"), 0)::int AS pageviews
      FROM "VisitorSession"
      WHERE "startedAt" >= ${from} AND "startedAt" < ${to}
      GROUP BY 1
      ORDER BY 1
    `;
    return rows;
  }

  private async sessionBreakdown(
    field: 'device' | 'browser' | 'os' | 'source',
    from: Date,
    to: Date,
  ) {
    const rows = await this.prisma.visitorSession.groupBy({
      by: [field],
      where: { startedAt: { gte: from, lt: to } },
      _count: { _all: true },
      orderBy: { _count: { [field]: 'desc' } },
      take: 10,
    });
    return rows.map((row) => ({
      name: (row[field] as string | null) ?? 'Unknown',
      count: row._count._all,
    }));
  }

  private async countryBreakdown(from: Date, to: Date) {
    const rows = await this.prisma.visitorSession.groupBy({
      by: ['country', 'countryCode'],
      where: { startedAt: { gte: from, lt: to } },
      _count: { _all: true },
      orderBy: { _count: { country: 'desc' } },
      take: 12,
    });
    return rows.map((row) => ({
      name: row.country ?? 'Unknown',
      code: row.countryCode,
      count: row._count._all,
    }));
  }

  private async topPages(from: Date, to: Date) {
    const rows = await this.prisma.pageView.groupBy({
      by: ['path'],
      where: { createdAt: { gte: from, lt: to } },
      _count: { _all: true },
      _avg: { duration: true, scrollDepth: true },
      orderBy: { _count: { path: 'desc' } },
      take: 15,
    });
    return rows.map((row) => ({
      path: row.path,
      views: row._count._all,
      avgDurationSec: Math.round(row._avg.duration ?? 0),
      avgScrollDepth: Math.round(row._avg.scrollDepth ?? 0),
    }));
  }
}

// ---- helpers ---------------------------------------------------------------

function sanitizePath(path?: string | null): string | null {
  if (!path) {
    return null;
  }
  const clean = path.split(/[?#]/)[0].slice(0, 512);
  return clean.startsWith('/') ? clean : `/${clean}`;
}

function rate(part: number, whole: number): number {
  return whole > 0 ? Math.round((part / whole) * 1000) / 10 : 0;
}

function withDelta(current: number, previous: number) {
  const deltaPct =
    previous > 0
      ? Math.round(((current - previous) / previous) * 1000) / 10
      : null;
  return { value: current, deltaPct };
}

function buildInsights(input: {
  kpis: KpiRow;
  prevKpis: KpiRow;
  sources: { name: string; count: number }[];
  devices: { name: string; count: number }[];
  topPages: { path: string; views: number; avgScrollDepth: number }[];
  contactSubmissions: number;
  resumeDownloads: number;
  githubClicks: number;
  rangeDays: number;
}): Insight[] {
  const insights: Insight[] = [];
  const { kpis, prevKpis, sources, devices, topPages, rangeDays } = input;
  const label = rangeDays === 1 ? '24 hours' : `${rangeDays} days`;

  if (kpis.sessions < 5) {
    insights.push({
      title: 'Not enough data yet',
      detail: `Only ${kpis.sessions} session(s) recorded in the last ${label}. Share the portfolio link (LinkedIn, GitHub README, job applications) to start building a meaningful picture.`,
      tone: 'info',
    });
    return insights;
  }

  if (prevKpis.visitors > 0) {
    const growth = Math.round(
      ((kpis.visitors - prevKpis.visitors) / prevKpis.visitors) * 100,
    );
    if (growth >= 10) {
      insights.push({
        title: `Traffic up ${growth}%`,
        detail: `Unique visitors grew from ${prevKpis.visitors} to ${kpis.visitors} versus the previous ${label}. Whatever you promoted recently is working — keep it up.`,
        tone: 'positive',
      });
    } else if (growth <= -10) {
      insights.push({
        title: `Traffic down ${Math.abs(growth)}%`,
        detail: `Unique visitors fell from ${prevKpis.visitors} to ${kpis.visitors}. Consider publishing a new project or post, and re-sharing the portfolio.`,
        tone: 'warning',
      });
    }
  }

  const topSource = sources[0];
  if (topSource && topSource.name !== 'Unknown') {
    const share = Math.round((topSource.count / kpis.sessions) * 100);
    insights.push({
      title: `${topSource.name} drives ${share}% of visits`,
      detail:
        topSource.name === 'Direct'
          ? 'Most visitors type the URL or use a saved link — recruiters often do this from a CV. Make sure the printed URL is short and correct.'
          : `${topSource.name} is your strongest channel. Keep your profile/README there fresh and linking here.`,
      tone: 'info',
    });
  }

  const bounceRate = rate(kpis.bounces, kpis.sessions);
  if (bounceRate >= 70) {
    insights.push({
      title: `High bounce rate (${bounceRate}%)`,
      detail:
        'Most sessions view a single page. Strengthen internal links from the hero to projects and the case studies to keep visitors exploring.',
      tone: 'warning',
    });
  } else if (bounceRate > 0 && bounceRate <= 40) {
    insights.push({
      title: `Healthy engagement (${bounceRate}% bounce)`,
      detail: 'Most visitors view multiple pages — the navigation flow is working.',
      tone: 'positive',
    });
  }

  const mobile = devices.find((device) => device.name === 'mobile');
  if (mobile && mobile.count / kpis.sessions >= 0.4) {
    insights.push({
      title: 'Significant mobile audience',
      detail: `${Math.round((mobile.count / kpis.sessions) * 100)}% of sessions are on mobile. Double-check the 3D hero and project cards on small screens.`,
      tone: 'info',
    });
  }

  const topProject = topPages.find((page) => page.path.startsWith('/projects/'));
  if (topProject) {
    insights.push({
      title: 'Most-viewed project',
      detail: `${topProject.path.replace('/projects/', '')} leads with ${topProject.views} views. Consider featuring it first in the showcase.`,
      tone: 'info',
    });
  }

  if (input.resumeDownloads > 0 || input.contactSubmissions > 0) {
    insights.push({
      title: 'Conversions happening',
      detail: `${input.resumeDownloads} CV download(s) and ${input.contactSubmissions} contact submission(s) in the last ${label}. ${input.githubClicks} visitors clicked through to GitHub.`,
      tone: 'positive',
    });
  }

  return insights;
}
