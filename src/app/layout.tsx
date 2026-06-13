import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SmoothScrollProvider } from "@/providers/SmoothScrollProvider";
import { Navbar } from "@/components/layout/Navbar";
import { CustomCursor } from "@/components/layout/CustomCursor";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// URL base del sitio (para que las imágenes OG resuelvan a URLs absolutas).
// En Vercel, define NEXT_PUBLIC_SITE_URL con tu dominio definitivo.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const title = "Jhonzhu — Desarrollo Web Interactivo y Tiendas Online";
const description =
  "Diseño y desarrollo de páginas web y tiendas online a medida, con un alto nivel de interactividad. Experiencias rápidas, modernas y pensadas para convertir.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s · Jhonzhu",
  },
  description,
  keywords: [
    "desarrollo web",
    "diseño web",
    "tiendas online",
    "ecommerce",
    "páginas web a medida",
    "desarrollador frontend",
    "Next.js",
    "React",
    "portfolio",
  ],
  authors: [{ name: "Jhonzhu" }],
  creator: "Jhonzhu",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: siteUrl,
    siteName: "Jhonzhu",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      // Geist (sans + mono) + altura completa. suppressHydrationWarning
      // porque Lenis añade clases al <html> en cliente y difieren del SSR.
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <SmoothScrollProvider>
          <Navbar />
          <CustomCursor />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
