import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Providers } from "@/components/providers";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { CursorSpotlight } from "@/components/effects/cursor-spotlight";
import { AdminAccess } from "@/components/admin/admin-access";
import { AnalyticsTracker } from "@/components/analytics/analytics-tracker";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://hzlabs.dev"),
  title: {
    default: "HZ Labs | Full Stack Developer Building Modern Web Platforms",
    template: "%s | HZ Labs",
  },
  description:
    "HZ Labs is the portfolio CMS and digital product studio website for Mohamed Hajith, an independent software engineer building scalable web platforms.",
  openGraph: {
    title: "HZ Labs",
    description: "Building Digital Products, Platforms, and Scalable Systems",
    url: "/",
    siteName: "HZ Labs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HZ Labs",
    description: "Building Digital Products, Platforms, and Scalable Systems",
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
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#050816] text-slate-50">
        <SmoothScrollProvider>
          <CursorSpotlight>
            <Providers>{children}</Providers>
          </CursorSpotlight>
        </SmoothScrollProvider>
        <AdminAccess />
        <AnalyticsTracker />
      </body>
    </html>
  );
}
