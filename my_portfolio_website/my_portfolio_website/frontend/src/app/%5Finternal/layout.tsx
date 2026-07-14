import type { ReactNode } from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { absoluteApiUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Internal",
  robots: { index: false, follow: false, nocache: true },
};

// Server-side gate: verify the HTTP-only session against the API before any
// admin UI is sent to the browser. Unauthenticated requests get a genuine 404 so
// the route reveals nothing about its existence.
async function isAuthenticated(): Promise<boolean> {
  const cookie = (await headers()).get("cookie") ?? "";
  if (!cookie.includes("hz_admin_session=")) {
    return false;
  }
  try {
    const response = await fetch(absoluteApiUrl("/auth/me"), {
      headers: { cookie },
      cache: "no-store",
    });
    return response.ok;
  } catch {
    return false;
  }
}

export default async function InternalLayout({ children }: { children: ReactNode }) {
  if (!(await isAuthenticated())) {
    notFound();
  }
  return <AdminShell>{children}</AdminShell>;
}
