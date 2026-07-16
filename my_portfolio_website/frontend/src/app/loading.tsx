export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 font-mono">
      <div className="hud-panel corner-brackets w-full max-w-md p-8">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em]">
          <span className="text-cyan">◉ boot.sequence</span>
          <span className="flex items-center gap-1.5 text-signal-green">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal-green animate-pulse-dot" />
            loading
          </span>
        </div>
        <div className="mt-6 space-y-2 text-[11px] text-muted-foreground">
          <div className="animate-pulse">▸ initialising console…</div>
          <div className="animate-pulse [animation-delay:150ms]">▸ fetching telemetry…</div>
          <div className="animate-pulse [animation-delay:300ms]">▸ mounting systems…</div>
          <span className="ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 bg-cyan animate-flicker" />
        </div>
        <div className="mt-6 h-1 w-full overflow-hidden bg-cyan/10">
          <div className="h-full w-1/2 animate-pulse bg-cyan/60" />
        </div>
      </div>
    </div>
  );
}
