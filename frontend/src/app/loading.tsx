export default function Loading() {
  return (
    <div className="min-h-screen bg-[#050816] px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl animate-pulse space-y-6">
        <div className="h-10 w-2/3 rounded-lg bg-white/5" />
        <div className="h-4 w-1/2 rounded bg-white/5" />
        <div className="h-4 w-1/3 rounded bg-white/5" />
        <div className="grid gap-4 pt-10 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="h-40 rounded-xl bg-white/5" key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
