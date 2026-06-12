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
    default: "BigWow — Free Browser Tools: No Upload, No Signup, 100% Private",
    template: "%s | BigWow",
  },
  description:
    "113 free browser tools for image compression, PDF editing, background removal, QR codes, JSON formatting, password generation, and more. 100% client-side — your files never leave your device. No signup, no ads, forever free.",
  keywords: [
    // Top 20 from keyword research — low competition, high intent
    "compress image online free",
    "image compressor online",
    "background remover online free",
    "free background remover no watermark",
    "word counter online free",
    "json formatter online",
    "password generator online",
    "qr code generator free",
    "compress pdf online",
    "split pdf online free",
    "merge pdf files online",
    "reduce pdf file size",
    "png to jpg converter",
    "heic to jpg converter",
    "webp to jpg converter",
    "image resizer online",
    "lorem ipsum generator",
    "case converter online",
    "regex tester online",
    "free ocr online",
    // Core brand keywords
    "free online tools no upload",
    "browser tools privacy",
    "client-side tools",
    "free tools no signup",
    "offline browser tools",
    "100% private tools",
    "no server upload tools",
    "privacy first free tools",
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
      "100% free, client-side browser tools for productivity. No servers, no signups, no tracking. Over 101+ offline-capable tools running entirely in your browser with full privacy.",
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
      "100% free, client-side browser tools for productivity. No servers, no signups, no tracking. Over 101+ offline-capable tools running entirely in your browser with full privacy.",
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
      { url: "/favicon-48x48.png?v=2", type: "image/png", sizes: "48x48" },
      { url: "/favicon.ico?v=2", sizes: "any" },
      { url: "/icon.svg?v=2", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png?v=2", sizes: "180x180" }],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg?v=2",
        color: "#000000",
      },
    ],
  },
  manifest: "/manifest.json?v=2",
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
    "description": "100% free, privacy-first, client-side browser tools for productivity. Over 101+ offline-capable tools with no servers, no signups, and zero data collection.",
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
    "description": "100% free, client-side browser tools for productivity. Over 101+ offline-capable tools running entirely in your browser with full privacy.",
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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is BigWow?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "BigWow is a collection of 113 free browser-based tools for PDF editing, image compression, background removal, QR code generation, developer utilities, AI tools, and more. Every tool runs 100% in your browser — your files never leave your device."
        }
      },
      {
        "@type": "Question",
        "name": "Does BigWow upload my files to a server?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. All processing runs locally in your browser using JavaScript and WebAssembly. Your files never leave your device and are never sent to any server. You can verify this by opening your browser's Network tab in Developer Tools while using any tool."
        }
      },
      {
        "@type": "Question",
        "name": "Is BigWow really free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, all 113 tools are completely free with no account required, no ads, no file size limits, no watermarks, and no premium tier. Free forever."
        }
      },
      {
        "@type": "Question",
        "name": "Does BigWow work offline?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Once the page has loaded, most tools work without an internet connection. AI-powered tools like the background remover download their model once and then run offline from your browser cache."
        }
      },
      {
        "@type": "Question",
        "name": "What tools does BigWow offer?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "BigWow offers 113 tools across categories: Image Tools (compress, resize, convert, remove background), PDF Tools (merge, split, compress, rotate), Developer Tools (JSON formatter, JWT decoder, regex tester, UUID generator), AI Tools (token counter, model comparison, prompt library), Text Tools (word counter, case converter, markdown editor), and more."
        }
      },
      {
        "@type": "Question",
        "name": "How is BigWow different from TinyWow or Smallpdf?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Unlike TinyWow and Smallpdf, BigWow processes everything 100% in your browser — your files are never uploaded to any server. TinyWow and Smallpdf upload your files to their servers for processing. BigWow is also completely free with no file size limits, no watermarks, and no account required."
        }
      }
    ]
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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
