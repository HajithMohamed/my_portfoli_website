"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Info, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { adminFetch } from "@/lib/api";
import {
  BarList,
  ChartSkeleton,
  DeviceDonut,
  EmptyChart,
  formatDuration,
  formatNumber,
  flagEmoji,
  KpiCard,
  RangeFilter,
  RangeKey,
  TimeseriesPoint,
  VisitorsAreaChart,
} from "./analytics-charts";

type Kpi = { value: number; deltaPct: number | null };

export type AnalyticsDashboard = {
  range: RangeKey;
  from: string;
  to: string;
  kpis: {
    totalVisitors: Kpi;
    uniqueVisitors: Kpi;
    returningVisitors: Kpi;
    sessions: Kpi;
    pageViews: Kpi;
    activeNow: Kpi;
    avgSessionDurationSec: Kpi;
    bounceRate: Kpi;
    conversionRate: Kpi;
    contactSubmissions: Kpi;
    resumeDownloads: Kpi;
    githubClicks: Kpi;
    socialClicks: Kpi;
    projectViews: Kpi;
    blogViews: Kpi;
  };
  timeseries: TimeseriesPoint[];
  devices: { name: string; count: number }[];
  browsers: { name: string; count: number }[];
  os: { name: string; count: number }[];
  countries: { name: string; code: string | null; count: number }[];
  sources: { name: string; count: number }[];
  topPages: { path: string; views: number; avgDurationSec: number; avgScrollDepth: number }[];
  insights: { title: string; detail: string; tone: "positive" | "warning" | "info" }[];
};

export function useAnalyticsDashboard(range: RangeKey) {
  const [data, setData] = useState<AnalyticsDashboard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    adminFetch<AnalyticsDashboard>(`/admin/analytics/dashboard?range=${range}`)
      .then((payload) => {
        if (!cancelled) setData(payload);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load analytics");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [range]);

  return { data, error, loading };
}

const TONE_META = {
  positive: { icon: TrendingUp, color: "text-[#0ca30c]", label: "Positive" },
  warning: { icon: AlertTriangle, color: "text-[#fab219]", label: "Attention" },
  info: { icon: Info, color: "text-blue-300", label: "Insight" },
} as const;

export function InsightsPanel({ insights }: { insights: AnalyticsDashboard["insights"] }) {
  return (
    <Card>
      <h3 className="text-sm font-semibold text-white">Insights</h3>
      <p className="mt-0.5 text-xs text-slate-500">Heuristics computed from your traffic — refreshed with each range.</p>
      <div className="mt-4 grid gap-3">
        {insights.length === 0 ? (
          <p className="text-sm text-slate-500">Nothing notable yet — check back once more visits come in.</p>
        ) : (
          insights.map((insight) => {
            const meta = TONE_META[insight.tone];
            const Icon = meta.icon;
            return (
              <div className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-3" key={insight.title}>
                <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${meta.color}`} aria-label={meta.label} />
                <div>
                  <div className="text-sm font-medium text-white">{insight.title}</div>
                  <p className="mt-1 text-xs leading-5 text-slate-400">{insight.detail}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}

/** Compact analytics block for the dashboard page: KPIs, trend chart, insights. */
export function AnalyticsOverview() {
  const [range, setRange] = useState<RangeKey>("30d");
  const { data, error, loading } = useAnalyticsDashboard(range);

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-white">Visitor Analytics</h2>
        <RangeFilter onChange={setRange} value={range} />
      </div>
      {error ? <p className="mb-4 text-sm text-red-300">{error}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading || !data ? (
          Array.from({ length: 8 }).map((_, i) => <ChartSkeleton className="h-[86px]" key={i} />)
        ) : (
          <>
            <KpiCard label="Unique Visitors" {...data.kpis.uniqueVisitors} value={data.kpis.uniqueVisitors.value} deltaPct={data.kpis.uniqueVisitors.deltaPct} />
            <KpiCard label="Page Views" value={data.kpis.pageViews.value} deltaPct={data.kpis.pageViews.deltaPct} />
            <KpiCard label="Avg Session" value={data.kpis.avgSessionDurationSec.value} deltaPct={data.kpis.avgSessionDurationSec.deltaPct} format="duration" />
            <KpiCard label="Bounce Rate" value={data.kpis.bounceRate.value} deltaPct={data.kpis.bounceRate.deltaPct} format="percent" />
            <KpiCard label="Returning Visitors" value={data.kpis.returningVisitors.value} deltaPct={data.kpis.returningVisitors.deltaPct} />
            <KpiCard label="CV Downloads" value={data.kpis.resumeDownloads.value} deltaPct={data.kpis.resumeDownloads.deltaPct} />
            <KpiCard label="GitHub Clicks" value={data.kpis.githubClicks.value} deltaPct={data.kpis.githubClicks.deltaPct} />
            <KpiCard label="Contact Submissions" value={data.kpis.contactSubmissions.value} deltaPct={data.kpis.contactSubmissions.deltaPct} />
          </>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <div className="flex items-baseline justify-between">
            <h3 className="text-sm font-semibold text-white">Visitors over time</h3>
            {data ? (
              <span className="text-xs text-slate-500">{data.kpis.activeNow.value} active in the last 5 min</span>
            ) : null}
          </div>
          <div className="mt-4">
            {loading || !data ? <ChartSkeleton /> : <VisitorsAreaChart data={data.timeseries} hourly={range === "1d"} />}
          </div>
        </Card>
        {loading || !data ? (
          <ChartSkeleton className="h-auto" />
        ) : (
          <InsightsPanel insights={data.insights} />
        )}
      </div>
    </section>
  );
}

/** Full analytics page: everything in the overview plus audience + behavior breakdowns. */
export function AnalyticsPanel() {
  const [range, setRange] = useState<RangeKey>("30d");
  const { data, error, loading } = useAnalyticsDashboard(range);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-white">Visitor Analytics</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            First-party, anonymous analytics: audience, geography, devices, traffic sources, and behavior.
          </p>
        </div>
        <RangeFilter onChange={setRange} value={range} />
      </div>
      {error ? <p className="mb-4 text-sm text-red-300">{error}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading || !data ? (
          Array.from({ length: 8 }).map((_, i) => <ChartSkeleton className="h-[86px]" key={i} />)
        ) : (
          <>
            <KpiCard label="Unique Visitors" value={data.kpis.uniqueVisitors.value} deltaPct={data.kpis.uniqueVisitors.deltaPct} />
            <KpiCard label="Sessions" value={data.kpis.sessions.value} deltaPct={data.kpis.sessions.deltaPct} />
            <KpiCard label="Page Views" value={data.kpis.pageViews.value} deltaPct={data.kpis.pageViews.deltaPct} />
            <KpiCard label="Active Now" value={data.kpis.activeNow.value} deltaPct={null} />
            <KpiCard label="Conversion Rate" value={data.kpis.conversionRate.value} deltaPct={data.kpis.conversionRate.deltaPct} format="percent" />
            <KpiCard label="Project Views" value={data.kpis.projectViews.value} deltaPct={null} />
            <KpiCard label="Blog Views" value={data.kpis.blogViews.value} deltaPct={null} />
            <KpiCard label="Social Clicks" value={data.kpis.socialClicks.value} deltaPct={data.kpis.socialClicks.deltaPct} />
          </>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <h3 className="text-sm font-semibold text-white">Visitors over time</h3>
          <div className="mt-4">
            {loading || !data ? <ChartSkeleton /> : <VisitorsAreaChart data={data.timeseries} hourly={range === "1d"} />}
          </div>
        </Card>
        <Card>
          <h3 className="mb-4 text-sm font-semibold text-white">Devices</h3>
          {loading || !data ? <ChartSkeleton /> : <DeviceDonut items={data.devices} />}
        </Card>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Card>
          <h3 className="mb-4 text-sm font-semibold text-white">Traffic Sources</h3>
          {loading || !data ? (
            <ChartSkeleton />
          ) : (
            <BarList items={data.sources.map((source) => ({ label: source.name, value: source.count }))} />
          )}
        </Card>
        <Card>
          <h3 className="mb-4 text-sm font-semibold text-white">Countries</h3>
          {loading || !data ? (
            <ChartSkeleton />
          ) : data.countries.length === 0 ? (
            <EmptyChart message="No geo data yet (local visits are not geolocated)." />
          ) : (
            <BarList
              items={data.countries.map((country) => ({
                label: country.name,
                value: country.count,
                hint: flagEmoji(country.code),
              }))}
            />
          )}
        </Card>
        <Card className="md:col-span-2 xl:col-span-1">
          <h3 className="mb-4 text-sm font-semibold text-white">Browsers</h3>
          {loading || !data ? (
            <ChartSkeleton />
          ) : (
            <BarList items={data.browsers.map((browser) => ({ label: browser.name, value: browser.count }))} />
          )}
        </Card>
        <Card>
          <h3 className="mb-4 text-sm font-semibold text-white">Operating Systems</h3>
          {loading || !data ? (
            <ChartSkeleton />
          ) : (
            <BarList items={data.os.map((os) => ({ label: os.name, value: os.count }))} />
          )}
        </Card>
        <Card className="md:col-span-2">
          <h3 className="mb-4 text-sm font-semibold text-white">Top Pages</h3>
          {loading || !data ? (
            <ChartSkeleton />
          ) : data.topPages.length === 0 ? (
            <EmptyChart message="No page views in this period." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs text-slate-500">
                    <th className="pb-2 pr-4 font-medium">Page</th>
                    <th className="pb-2 pr-4 font-medium">Views</th>
                    <th className="pb-2 pr-4 font-medium">Avg time</th>
                    <th className="pb-2 font-medium">Avg scroll</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topPages.map((page) => (
                    <tr className="border-b border-white/5 last:border-0" key={page.path}>
                      <td className="max-w-[280px] truncate py-2 pr-4 text-slate-300">{page.path}</td>
                      <td className="py-2 pr-4 text-slate-400 tabular-nums">{formatNumber(page.views)}</td>
                      <td className="py-2 pr-4 text-slate-400 tabular-nums">{formatDuration(page.avgDurationSec)}</td>
                      <td className="py-2 text-slate-400 tabular-nums">{page.avgScrollDepth}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <div className="mt-6">{loading || !data ? <ChartSkeleton /> : <InsightsPanel insights={data.insights} />}</div>
    </>
  );
}
