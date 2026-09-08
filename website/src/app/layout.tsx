import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BUSINESS } from "@/data/siteContent";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(BUSINESS.origin),
  title: {
    default: `${BUSINESS.name} | Khmer kitchen in Springvale`,
    template: `%s | ${BUSINESS.name}`,
  },
  description:
    "Lok lak, beef noodle soup and steamboat on Buckingham Avenue, Springvale. Authentic Cambodian seasoning. Reserve a table or call (03) 9558 5555.",
  openGraph: {
    title: `${BUSINESS.name} | Khmer kitchen in Springvale`,
    description:
      "Authentic Cambodian dishes in Springvale. Reserve a table online or call the kitchen.",
    url: BUSINESS.origin,
    siteName: BUSINESS.name,
    images: [{ url: "/assets/og.jpg", width: 1200, height: 630 }],
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: BUSINESS.name,
    description: "Cambodian restaurant in Springvale — reserve a table.",
    images: ["/assets/og.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  manifest: "/site.webmanifest",
};

const LD_JSON = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: BUSINESS.name,
  servesCuisine: "Cambodian",
  telephone: "+61 3 9558 5555",
  url: BUSINESS.origin,
  image: `${BUSINESS.origin}/assets/og.jpg`,
  hasMap: BUSINESS.mapsDirections,
  address: {
    "@type": "PostalAddress",
    streetAddress: BUSINESS.street,
    addressLocality: BUSINESS.suburb,
    addressRegion: "VIC",
    postalCode: "3171",
    addressCountry: "AU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU" className="h-full antialiased">
      <body className="flex min-h-full flex-col font-body">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LD_JSON) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-lemongrass focus:px-4 focus:py-2 focus:text-lacquer"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="relative flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
