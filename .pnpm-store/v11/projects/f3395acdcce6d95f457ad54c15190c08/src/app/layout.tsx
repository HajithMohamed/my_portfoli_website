import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { AdminAccess } from "@/components/admin/admin-access";
import { AnalyticsTracker } from "@/components/analytics/analytics-tracker";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://hzlabs.dev"),
  title: {
    default: "Hertz Labs - Software Engineer Command Center",
    template: "%s | Hertz Labs",
  },
  description:
    "Hertz Labs is the operations console of Mohamed Hajith, full-stack software engineer. Live systems, projects, and architecture in one command-center portfolio.",
  authors: [{ name: "Mohamed Hajith" }],
  openGraph: {
    title: "Hertz Labs - Software Engineer Command Center",
    description:
      "The operations console of Mohamed Hajith, full-stack software engineer. Live systems, projects, and architecture.",
    url: "/",
    siteName: "Hertz Labs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hertz Labs - Software Engineer Command Center",
    description:
      "The operations console of Mohamed Hajith, full-stack software engineer.",
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
