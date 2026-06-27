import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getMarket } from "@/lib/market";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const market = getMarket()
const base = `https://${market.domain}`

export const metadata: Metadata = {
  metadataBase: new URL(base),
  title: {
    default: `Enlisted.${market.code === 'CA' ? 'ca' : market.code === 'AU' ? 'au' : market.code === 'UK' ? 'co.uk' : 'us'} — The Marketplace for ${market.name} Public Company Executives`,
    template: `%s — ${market.seo.titleSuffix}`,
  },
  description: market.seo.description,
  keywords: market.seo.keywords,
  authors: [{ name: "Enlisted Inc." }],
  creator: "Enlisted Inc.",
  openGraph: {
    type: "website",
    locale: market.locale,
    url: base,
    siteName: `Enlisted — ${market.name}`,
    title: `${market.seo.titleSuffix} — The Marketplace for ${market.name} Public Company Executives`,
    description: market.seo.ogDescription,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `Enlisted — The Directory for ${market.name} Public Markets`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${market.seo.titleSuffix} — The Marketplace for ${market.name} Public Company Executives`,
    description: market.seo.ogDescription,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={market.locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
