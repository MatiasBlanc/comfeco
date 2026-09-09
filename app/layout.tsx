import type { Metadata, Viewport } from "next";
import type { JSX, ReactNode } from "react";

import "./globals.css";

const title = "COMFECO — Community Fest and Code";
const description =
  "COMFECO reúne a la comunidad tech de Latinoamérica para aprender, crear y conectar a través de conferencias, workshops y hackathons.";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.ico" },
  openGraph: {
    type: "website",
    locale: "es_LA",
    url: "/",
    siteName: "COMFECO",
    title,
    description,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "COMFECO — Community Fest and Code",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.png"],
    creator: "@comfeco",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#2F2F33",
  colorScheme: "dark",
};

interface RootLayoutProps {
  children: ReactNode;
}

/**
 * Define el documento raíz y sus metadatos globales.
 *
 * @param props - Contenido generado por las rutas de la aplicación.
 * @returns Documento HTML raíz.
 */
export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="es">
      <body>
        <a href="#contenido" className="skip-link">
          Saltar al contenido
        </a>
        {children}
      </body>
    </html>
  );
}
