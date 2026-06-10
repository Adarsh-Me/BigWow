import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/providers/providers";
import type { Locale } from "@/store/language-store";
import StructuredDataInjector from "@/components/StructuredDataInjector";
import { absoluteUrl, languageAlternates, siteConfig } from "@/lib/site";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";

const geistSans = {
  variable: "--font-geist-sans",
};

const geistMono = {
  variable: "--font-geist-mono",
};

export const metadata: Metadata = {
  title: {
    default: "BigWow | Free Browser-Based Productivity Tools",
    template: "%s | BigWow",
  },
  description:
    "Essential browser-based tools for productivity. No servers. Full privacy. Convert files, compress images, generate passwords, format code, and more — all in your browser.",
  keywords: [
    "browser tools",
    "productivity tools",
    "file converter",
    "image compression",
    "password generator",
    "code formatter",
    "base64 converter",
    "QR code generator",
    "privacy-focused",
    "client-side tools",
    "no server required",
    "free online tools",
  ],
  authors: [{ name: "BigWow" }],
  creator: "BigWow",
  publisher: "BigWow",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteConfig.baseUrl),
  alternates: {
    canonical: "/",
    languages: languageAlternates(),
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.baseUrl,
    title: "BigWow | Free Browser-Based Productivity Tools",
    description:
      "Essential browser-based tools for productivity. No servers. Full privacy.",
    siteName: "BigWow",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BigWow - Essential Browser-Based Productivity Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BigWow | Free Browser-Based Productivity Tools",
    description:
      "Essential browser-based tools for productivity. No servers. Full privacy.",
    images: ["/og-image.png"],
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
  category: "technology",
  classification: "Productivity Tools",
  referrer: "origin-when-cross-origin",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#000000",
      },
    ],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BigWow",
  },
  other: {
    "msapplication-TileColor": "#000000",
    "msapplication-config": "/browserconfig.xml",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialLocale: Locale = "en";

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.baseUrl}/#organization`,
    "name": "BigWow",
    "url": siteConfig.baseUrl,
    "logo": {
      "@type": "ImageObject",
      "url": absoluteUrl("/icon.svg"),
      "width": 512,
      "height": 512
    },
    "description": "100% free, privacy-first, client-side productivity tools. No servers. No tracking. No data collection.",
    "foundingDate": "2024",
    "founder": {
      "@type": "Organization",
      "name": "BigWow"
    },
    "sameAs": [],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "email": "studio365@zohomail.in",
        "availableLanguage": ["English"]
      }
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.baseUrl}/#website`,
    "url": siteConfig.baseUrl,
    "name": "BigWow",
    "description": "Essential browser-based tools for productivity. No servers. Full privacy.",
    "publisher": { "@id": `${siteConfig.baseUrl}/#organization` },
    "inLanguage": ["en"],
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteConfig.baseUrl}/browser-tools?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        {/* Raw Form: Cabinet Grotesk & Satoshi from Fontshare */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@700,800&f[]=satoshi@300,400,500,700&display=swap"
          rel="stylesheet"
        />
        {/* Poppins & other Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400..900&family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&family=Outfit:wght@100..900&family=Poppins:wght@300;400;500;600;700;800;900&family=Syne:wght@400..800&display=swap"
          rel="stylesheet"
        />
        {/* OpenSearch — let browsers add BigWow as a search engine */}
        <link
          rel="search"
          type="application/opensearchdescription+xml"
          title="BigWow"
          href="/opensearch.xml"
        />
        {/* DNS prefetch for known external origins used by tools */}
        <link rel="dns-prefetch" href="https://api.fontshare.com" />
        {/* Theme color hints for mobile browsers (Safari, Chrome Android) */}
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)" />
        <meta name="color-scheme" content="light dark" />
        <meta name="rating" content="general" />
        <meta name="distribution" content="global" />
        <meta name="revisit-after" content="1 day" />
        <meta httpEquiv="x-ua-compatible" content="IE=edge" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers initialLocale={initialLocale}>
          {children}
          <StructuredDataInjector />
          <Analytics />
          <SpeedInsights />
          <Script
            id="microsoft-clarity"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "x4z6qtrf8d");
              `,
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
