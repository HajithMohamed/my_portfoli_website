"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

// Chart ink + series colors, validated for the #050816 admin surface
// (CVD-safe adjacent ΔE 41.3, all >= 3:1 contrast). Color follows the entity:
// desktop is always blue, mobile always aqua, tablet always yellow.
export const SERIES = {
  blue: "#3987e5",
  aqua: "#199e70",
  yellow: "#c98500",
} as const;

export const DEVICE_COLORS: Record<string, string> = {
  desktop: SERIES.blue,
  mobile: SERIES.aqua,
  tablet: SERIES.yellow,
};

const INK = {
  secondary: "#c3c2b7",
  muted: "#898781",
  grid: "rgba(255,255,255,0.07)",
  surface: "#0d101e",
};

// ---- number formatting -------------------------------------------------------

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en", { notation: value >= 10_000 ? "compact" : "standard" }).format(value);
}

export function formatDuration(totalSec: number): string {
  const minutes = Math.floor(totalSec / 60);
  const seconds = Math.round(totalSec % 60);
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
}

export function flagEmoji(code?: string | null): string {
  if (!code || code.length !== 2) return "🌐";
  return String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}

// ---- KPI tile ------------------------------------------------------------------

export function KpiCard({
  label,
  value,
  deltaPct,
  format = "number",
}: {
  label: string;
  value: number;
  deltaPct?: number | null;
  format?: "number" | "duration" | "percent";
}) {
  const display =
    format === "duration" ? formatDuration(value) : format === "percent" ? `${value}%` : formatNumber(value);
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="text-xs text-slate-400">{label}</div>
      <div className="mt-1.5 flex items-baseline justify-between gap-2">
        <span className="text-2xl font-semibold text-white">{display}</span>
        {deltaPct !== null && deltaPct !== undefined ? <DeltaChip deltaPct={deltaPct} /> : null}
      </div>
    </div>
  );
}

function DeltaChip({ deltaPct }: { deltaPct: number }) {
  const up = deltaPct > 0;
  const flat = deltaPct === 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-medium",
        flat ? "text-slate-500" : up ? "text-[#0ca30c]" : "text-[#e66767]",
      )}
    >
      {flat ? <Minus className="h-3 w-3" /> : up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
      {Math.abs(deltaPct)}%
    </span>
  );
}

// ---- range filter ---------------------------------------------------------------

export const RANGE_OPTIONS = [
  ["1d", "24h"],
  ["7d", "7 days"],
  ["30d", "30 days"],
  ["90d", "90 days"],
  ["365d", "Year"],
] as const;

export type RangeKey = (typeof RANGE_OPTIONS)[number][0];

export function RangeFilter({ value, onChange }: { value: RangeKey; onChange: (range: RangeKey) => void }) {
  return (
    <div className="flex flex-wrap gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-1 text-xs">
      {RANGE_OPTIONS.map(([key, label]) => (
        <button
          className={cn(
            "rounded-md px-3 py-1.5 transition-colors",
            value === key ? "bg-blue-500/20 font-medium text-white" : "text-slate-400 hover:text-white",
          )}
          key={key}
          onClick={() => onChange(key)}
          type="button"
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ---- area chart (single series, crosshair + tooltip) ----------------------------

export type TimeseriesPoint = { bucket: string; visitors: number; sessions: number; pageviews: number };

const W = 640;
const H = 200;
const PAD = { top: 12, right: 12, bottom: 24, left: 36 };

export function VisitorsAreaChart({ data, hourly }: { data: TimeseriesPoint[]; hourly: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  const { points, max } = useMemo(() => {
    const max = Math.max(1, ...data.map((d) => d.visitors));
    const innerW = W - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;
    const points = data.map((d, i) => ({
      x: PAD.left + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW),
      y: PAD.top + innerH - (d.visitors / max) * innerH,
      ...d,
    }));
    return { points, max };
  }, [data]);

  if (data.length === 0) {
    return <EmptyChart message="No visits recorded in this period yet." />;
  }

  const baseline = H - PAD.bottom;
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1].x.toFixed(1)},${baseline} L${points[0].x.toFixed(1)},${baseline} Z`;

  function formatBucket(bucket: string): string {
    const date = new Date(bucket);
    return hourly
      ? date.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", hour12: false })
      : date.toLocaleDateString("en", { month: "short", day: "numeric" });
  }

  function onMove(event: React.MouseEvent) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((event.clientX - rect.left) / rect.width) * W;
    let nearest = 0;
    let best = Infinity;
    points.forEach((p, i) => {
      const d = Math.abs(p.x - x);
      if (d < best) {
        best = d;
        nearest = i;
      }
    });
    setHover(nearest);
  }

  const active = hover !== null ? points[hover] : null;
  const gridYs = [0.5, 1].map((f) => PAD.top + (H - PAD.top - PAD.bottom) * (1 - f));

  return (
    <div className="relative" onMouseLeave={() => setHover(null)} onMouseMove={onMove} ref={containerRef}>
      <svg className="block w-full" role="img" aria-label="Unique visitors over time" viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <linearGradient id="viz-area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={SERIES.blue} stopOpacity="0.28" />
            <stop offset="100%" stopColor={SERIES.blue} stopOpacity="0" />
          </linearGradient>
        </defs>
        {gridYs.map((y, i) => (
          <g key={i}>
            <line stroke={INK.grid} strokeWidth="1" x1={PAD.left} x2={W - PAD.right} y1={y} y2={y} />
            <text fill={INK.muted} fontSize="10" textAnchor="end" x={PAD.left - 6} y={y + 3}>
              {formatNumber(Math.round(max * (i === 0 ? 0.5 : 1)))}
            </text>
          </g>
        ))}
        <line stroke="rgba(255,255,255,0.14)" strokeWidth="1" x1={PAD.left} x2={W - PAD.right} y1={baseline} y2={baseline} />
        <path d={areaPath} fill="url(#viz-area)" />
        <path d={linePath} fill="none" stroke={SERIES.blue} strokeLinejoin="round" strokeWidth="2" />
        {[0, Math.floor((points.length - 1) / 2), points.length - 1]
          .filter((v, i, arr) => arr.indexOf(v) === i)
          .map((i) => (
            <text fill={INK.muted} fontSize="10" key={i} textAnchor={i === 0 ? "start" : i === points.length - 1 ? "end" : "middle"} x={points[i].x} y={H - 8}>
              {formatBucket(points[i].bucket)}
            </text>
          ))}
        {active ? (
          <g>
            <line stroke="rgba(255,255,255,0.25)" strokeDasharray="3 3" strokeWidth="1" x1={active.x} x2={active.x} y1={PAD.top} y2={baseline} />
            <circle cx={active.x} cy={active.y} fill={SERIES.blue} r="4" stroke={INK.surface} strokeWidth="2" />
          </g>
        ) : null}
      </svg>
      {active ? (
        <div
          className="pointer-events-none absolute top-1 z-10 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-slate-950/95 px-2.5 py-1.5 text-xs shadow-xl"
          style={{ left: `${(active.x / W) * 100}%` }}
        >
          <div className="text-slate-400">{formatBucket(active.bucket)}</div>
          <div className="mt-0.5 font-medium text-white">
            {formatNumber(active.visitors)} visitors · {formatNumber(active.pageviews)} views
          </div>
        </div>
      ) : null}
    </div>
  );
}

// ---- donut (device split) --------------------------------------------------------

export function DeviceDonut({ items }: { items: { name: string; count: number }[] }) {
  const [hover, setHover] = useState<string | null>(null);
  const total = items.reduce((sum, item) => sum + item.count, 0);
  if (total === 0) {
    return <EmptyChart message="No device data yet." />;
  }

  const R = 62;
  const CX = 80;
  const CY = 80;
  const gapRad = 0.05;
  let angle = -Math.PI / 2;

  const slices = items
    .filter((item) => item.count > 0)
    .map((item) => {
      const frac = item.count / total;
      const start = angle + gapRad / 2;
      const end = angle + frac * Math.PI * 2 - gapRad / 2;
      angle += frac * Math.PI * 2;
      return { ...item, start, end: Math.max(end, start + 0.01), frac };
    });

  function arcPath(start: number, end: number): string {
    const sx = CX + R * Math.cos(start);
    const sy = CY + R * Math.sin(start);
    const ex = CX + R * Math.cos(end);
    const ey = CY + R * Math.sin(end);
    return `M${sx.toFixed(2)},${sy.toFixed(2)} A${R},${R} 0 ${end - start > Math.PI ? 1 : 0} 1 ${ex.toFixed(2)},${ey.toFixed(2)}`;
  }

  const activeSlice = slices.find((slice) => slice.name === hover) ?? null;

  return (
    <div className="flex items-center gap-6">
      <svg aria-label="Sessions by device" className="shrink-0" height="160" role="img" viewBox="0 0 160 160" width="160">
        {slices.map((slice) => (
          <path
            d={arcPath(slice.start, slice.end)}
            fill="none"
            key={slice.name}
            onMouseEnter={() => setHover(slice.name)}
            onMouseLeave={() => setHover(null)}
            opacity={hover && hover !== slice.name ? 0.35 : 1}
            stroke={DEVICE_COLORS[slice.name] ?? SERIES.blue}
            strokeLinecap="butt"
            strokeWidth={hover === slice.name ? 22 : 18}
            style={{ transition: "opacity 150ms, stroke-width 150ms" }}
          />
        ))}
        <text fill="#fff" fontSize="20" fontWeight="600" textAnchor="middle" x={CX} y={CY - 2}>
          {activeSlice ? `${Math.round(activeSlice.frac * 100)}%` : formatNumber(total)}
        </text>
        <text fill={INK.muted} fontSize="9" textAnchor="middle" x={CX} y={CY + 14}>
          {activeSlice ? activeSlice.name : "sessions"}
        </text>
      </svg>
      <div className="grid flex-1 gap-2 text-sm">
        {slices.map((slice) => (
          <div
            className="flex items-center justify-between gap-3"
            key={slice.name}
            onMouseEnter={() => setHover(slice.name)}
            onMouseLeave={() => setHover(null)}
          >
            <span className="flex items-center gap-2 text-slate-300">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: DEVICE_COLORS[slice.name] ?? SERIES.blue }} />
              <span className="capitalize">{slice.name}</span>
            </span>
            <span className="text-xs text-slate-400 tabular-nums">
              {formatNumber(slice.count)} · {Math.round(slice.frac * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- horizontal bar list ------------------------------------------------------------

export function BarList({
  items,
  formatValue = formatNumber,
}: {
  items: { label: string; value: number; hint?: string }[];
  formatValue?: (value: number) => string;
}) {
  const max = Math.max(1, ...items.map((item) => item.value));
  if (items.length === 0) {
    return <p className="text-sm text-slate-500">No data yet.</p>;
  }
  return (
    <div className="grid gap-2.5">
      {items.map((item) => (
        <div key={`${item.label}-${item.hint ?? ""}`}>
          <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate text-slate-300">
              {item.hint ? <span className="mr-1.5">{item.hint}</span> : null}
              {item.label}
            </span>
            <span className="shrink-0 text-xs text-slate-400 tabular-nums">{formatValue(item.value)}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full"
              style={{ width: `${(item.value / max) * 100}%`, backgroundColor: SERIES.blue }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ---- shared bits -----------------------------------------------------------------------

export function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-white/10 text-sm text-slate-500">
      {message}
    </div>
  );
}

export function ChartSkeleton({ className }: { className?: string }) {
  return <div className={cn("h-40 animate-pulse rounded-lg bg-white/[0.04]", className)} />;
}
