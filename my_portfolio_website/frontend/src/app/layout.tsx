import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { AdminAccess } from "@/components/admin/admin-access";
import { AnalyticsTracker } from "@/components/analytics/analytics-tracker";
import { ThemeScript } from "@/components/theme/theme-script";
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
          className="pointer-events-none fixed inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse at 15% 5%, rgba(0, 240, 255, 0.09), transparent 50%), radial-gradient(ellipse at 85% 12%, rgba(245, 158, 11, 0.06), transparent 45%), radial-gradient(ellipse at 5% 55%, rgba(168, 85, 247, 0.05), transparent 45%), radial-gradient(ellipse at 95% 90%, rgba(16, 185, 129, 0.05), transparent 50%)",
          }}
        />
        {/* Global floating glowing orbs for spatial depth across all pages */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
          <div className="absolute left-1/4 top-1/6 w-[50vw] h-[50vw] bg-cyan/10 rounded-full blur-[130px] mix-blend-screen animate-orb pointer-events-none md:w-[40vw] md:h-[40vw]" />
          <div
            className="absolute right-1/4 bottom-1/4 w-[40vw] h-[40vw] bg-violet/10 rounded-full blur-[110px] mix-blend-screen animate-orb pointer-events-none md:w-[30vw] md:h-[30vw]"
            style={{ animationDelay: "-10s" }}
          />
        </div>
        <SmoothScrollProvider>
          <Providers>{children}</Providers>
        </SmoothScrollProvider>
        <AdminAccess />
        <AnalyticsTracker />
      </body>
    </html>
  );
}
