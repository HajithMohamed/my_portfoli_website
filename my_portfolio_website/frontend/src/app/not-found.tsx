import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050816] px-4 text-center text-slate-50">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-blue-300">404</p>
        <h1 className="mt-4 font-display text-4xl font-semibold">Page not found</h1>
        <p className="mt-3 max-w-md text-slate-400">The requested HZ Labs route is not available.</p>
        <ButtonLink className="mt-7" href="/">
          Back Home
        </ButtonLink>
      </div>
    </main>
  );
}
