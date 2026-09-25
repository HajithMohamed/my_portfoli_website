import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { AdminAccess } from "@/components/admin/admin-access";
import { AnalyticsTracker } from "@/components/analytics/analytics-tracker";
import { ThemeScript } from "@/components/theme/theme-script";
import { PERSONAL_IDENTITY } from "@/lib/identity";
import { getSiteUrl } from "@/lib/site-url";
import { GlobalHudBackdrop } from "@/components/shell/global-hud-backdrop";
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
      data-theme="jarvis"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="relative min-h-full bg-background text-foreground">
        {/* Global backdrop layers */}
        <div className="pointer-events-none fixed inset-0 bg-grid opacity-70" aria-hidden />
        <div className="pointer-events-none fixed inset-0 bg-scanlines" aria-hidden />
        <div
          className="pointer-events-none fixed inset-0 transition-all duration-700"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse at 15% 5%, var(--radial-orb-1, rgba(92, 208, 255, 0.12)), transparent 50%), radial-gradient(ellipse at 85% 12%, var(--radial-orb-2, rgba(245, 158, 11, 0.08)), transparent 45%), radial-gradient(ellipse at 5% 55%, var(--radial-orb-3, rgba(168, 85, 247, 0.07)), transparent 45%), radial-gradient(ellipse at 95% 90%, var(--radial-orb-4, rgba(16, 185, 129, 0.05)), transparent 50%)",
          }}
        />
        {/* Global 3D Constellation Mesh & Theme-Reactive Glowing Orbs across all pages */}
        <GlobalHudBackdrop />
        <SmoothScrollProvider>
          <Providers>{children}</Providers>
        </SmoothScrollProvider>
        <AdminAccess />
        <AnalyticsTracker />
      </body>
    </html>
  );
}
