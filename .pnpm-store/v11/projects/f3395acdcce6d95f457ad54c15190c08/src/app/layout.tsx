import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { AdminAccess } from "@/components/admin/admin-access";
import { AnalyticsTracker } from "@/components/analytics/analytics-tracker";
import { PERSONAL_IDENTITY } from "@/lib/identity";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${PERSONAL_IDENTITY.name} | ${PERSONAL_IDENTITY.title}`,
    template: `%s | ${PERSONAL_IDENTITY.name}`,
  },
  description:
    "The portfolio of Mohamed Hajith, full stack developer. Explore GitHub projects, recent work, and project notes. BICT (Hons), Faculty of Technology, University of Ruhuna.",
  authors: [{ name: PERSONAL_IDENTITY.name }],
  openGraph: {
    title: `${PERSONAL_IDENTITY.name} | ${PERSONAL_IDENTITY.title}`,
    description:
      "Explore Mohamed Hajith's GitHub projects, recent work, and project notes.",
    url: "/",
    siteName: PERSONAL_IDENTITY.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${PERSONAL_IDENTITY.name} | ${PERSONAL_IDENTITY.title}`,
    description:
      "Mohamed Hajith — Full Stack Developer. Projects, progress, and project notes.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="relative min-h-full bg-background text-foreground">
        {/* Global backdrop layers */}
        <div className="pointer-events-none fixed inset-0 bg-grid opacity-70" aria-hidden />
        <div className="pointer-events-none fixed inset-0 bg-scanlines" aria-hidden />
        <div
          className="pointer-events-none fixed inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse at 20% 0%, rgba(92,208,255,0.10), transparent 55%), radial-gradient(ellipse at 100% 100%, rgba(30,58,95,0.35), transparent 60%)",
          }}
        />
        <SmoothScrollProvider>
          <Providers>{children}</Providers>
        </SmoothScrollProvider>
        <AdminAccess />
        <AnalyticsTracker />
      </body>
    </html>
  );
}
