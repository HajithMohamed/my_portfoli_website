import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { AdminAccess } from "@/components/admin/admin-access";
import { AnalyticsTracker } from "@/components/analytics/analytics-tracker";
import { ThemeScript } from "@/components/theme/theme-script";
import { PERSONAL_IDENTITY } from "@/lib/identity";
import { getSiteUrl } from "@/lib/site-url";
import { GlobalSystemBackground } from "@/components/shell/global-system-background";
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
      <body className="relative min-h-full bg-[#040710] text-foreground">
        <SmoothScrollProvider>
          <Providers>
            {/* ONE continuous, fixed, futuristic HUD background across the entire website */}
            <GlobalSystemBackground />
            {children}
            <AdminAccess />
            <AnalyticsTracker />
          </Providers>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
