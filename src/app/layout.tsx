import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { BUSINESS, SITE_ORIGIN } from "@/data/siteContent";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const fraunces = localFont({
  src: "../fonts/fraunces.woff2",
  variable: "--font-fraunces",
  weight: "400 700",
  display: "swap",
});

const inter = localFont({
  src: "../fonts/inter.woff2",
  variable: "--font-inter",
  weight: "400 600",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: `${BUSINESS.name} | Khmer kitchen in ${BUSINESS.suburb}`,
    template: `%s | ${BUSINESS.name}`,
  },
  description:
    "A Khmer kitchen on Buckingham Avenue, Springvale. Lok lak, beef noodle soup and steamboat, cooked to order. Reserve a table or call the restaurant.",
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: BUSINESS.name,
    url: SITE_ORIGIN,
    title: `${BUSINESS.name} | Khmer kitchen in ${BUSINESS.suburb}`,
    description:
      "Lok lak, beef noodle soup and steamboat on Buckingham Avenue, Springvale. Cooked to order.",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: "/apple-touch-icon.png",
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#fbf6ec",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="min-h-dvh antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
