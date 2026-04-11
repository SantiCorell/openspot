import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";

import { AppProviders } from "@/app/providers";
import { OpenSpotSupportChat } from "@/components/chat/OpenSpotSupportChat";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteJsonLd } from "@/components/seo/SiteJsonLd";
import { siteBaseUrlAsUrl } from "@/lib/seo/siteBaseUrl";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

export const dynamic = "force-dynamic";

function siteUrl(): URL {
  const u =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  try {
    return new URL(u);
  } catch {
    return new URL("http://localhost:3000");
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
    { color: "#fafafa" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  colorScheme: "light dark",
};

export const metadata: Metadata = {
  metadataBase: siteBaseUrlAsUrl(),
  title: {
    default: "OpenSpot — dónde abrir tu negocio",
    template: "%s | OpenSpot",
  },
  description:
    "OpenSpot: estudios de viabilidad y ubicación en toda España. Millones de datos propios en BBDD analíticas actualizadas, cruzados con padrón INE, modelos económicos e informes con IA para hostelería, retail y servicios.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "OpenSpot",
  },
  formatDetection: {
    telephone: false,
  },
  keywords: [
    "dónde abrir un negocio",
    "viabilidad local España",
    "análisis de ubicación",
    "datos mercado local",
    "INE municipios",
    "saturación hostelería",
    "inteligencia de mercado",
  ],
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "OpenSpot",
    title: "OpenSpot — dónde abrir tu negocio",
    description:
      "Estudios de viabilidad y ubicación en España con datos INE, competencia modelada e informes con IA.",
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenSpot — dónde abrir tu negocio",
    description:
      "Datos municipales, mapas de afluencia y scoring para abrir negocio en España.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-[var(--background)] text-[var(--foreground)]">
        <SiteJsonLd />
        <AppProviders>
          <SiteHeader />
          {children}
          <SiteFooter />
          <OpenSpotSupportChat />
        </AppProviders>
      </body>
    </html>
  );
}
