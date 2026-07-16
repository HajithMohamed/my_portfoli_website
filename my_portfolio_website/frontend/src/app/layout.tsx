import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Providers } from "@/components/providers";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
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

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://hzlabs.dev"),
  title: {
    default: "Hz Labs — Software Engineer · Command Center",
    template: "%s | Hz Labs",
  },
  description:
    "Hz Labs is the operations console of Mohamed Hajith — full-stack software engineer. Live systems, projects, and architecture in one command-center portfolio.",
  authors: [{ name: "Mohamed Hajith" }],
  openGraph: {
    title: "Hz Labs — Software Engineer · Command Center",
    description:
      "The operations console of Mohamed Hajith — full-stack software engineer. Live systems, projects, and architecture.",
    url: "/",
    siteName: "Hz Labs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hz Labs — Software Engineer · Command Center",
    description:
      "The operations console of Mohamed Hajith — full-stack software engineer.",
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
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
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
