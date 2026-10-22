import type { ReactNode } from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { absoluteApiUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Admin Control Center | HZ Labs",
  robots: { index: false, follow: false, nocache: true },
};

// Server-side gate: verify the HTTP-only session against the API before showing
// admin shell and controls. Unauthenticated requests render the in-place login form
// so administrators can log in directly without a 404 wall.
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

export default async function AdminLayout({ children }: { children: ReactNode }) {
  if (!(await isAuthenticated())) {
    return <AdminLoginForm />;
  }
  return <AdminShell>{children}</AdminShell>;
}
