import type { Metadata, Viewport } from "next";

import { AnalyticsEvents } from "@/components/analytics-events";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const title = "COMFECO — Community Fest and Code";
const description =
  "Hackathon, tecnología y comunidad. Estamos explorando el regreso de COMFECO y queremos construirlo junto a developers de toda LATAM.";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_LA",
    url: "/",
    siteName: "COMFECO",
    title,
    description,
  },
  twitter: {
    card: "summary",
    title,
    description,
    creator: "@comfeco",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#07090d",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <a
          href="#contenido"
          className="fixed left-4 top-4 z-[100] -translate-y-20 rounded-md bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition-transform focus:translate-y-0"
        >
          Saltar al contenido
        </a>
        {children}
        <AnalyticsEvents />
        <Toaster />
      </body>
    </html>
  );
}
