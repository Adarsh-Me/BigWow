import { Metadata } from "next";
import { findToolByHref } from "./tools-config";
import { absoluteUrl, languageAlternates, siteConfig } from "./site";
import { toolCapabilities } from "./tool-capabilities";

export function generateToolMetadata(href: string): Metadata {
  const tool = findToolByHref(href);

  if (!tool) {
    return {
      title: "Tool Not Found - BigWow",
      description: "The requested tool could not be found.",
    };
  }

  const toolUrl = absoluteUrl(href);

  // Detect whether this tool runs locally (no server uploads)
  const capability = toolCapabilities.find((c) => c.href === href);
  const isLocalTool = capability ? capability.privacyMode === "local" : true; // default: assume local

  // Privacy-first title & description — BigWow's core moat
  const privacyPrefix = isLocalTool ? "Private " : "";
  const privacySuffix = isLocalTool ? " — No Upload, 100% Local" : "";
  const seoTitle = `${privacyPrefix}${tool.name}${privacySuffix} | Free ${tool.category} Tool | BigWow`;
  const seoDescription = isLocalTool
    ? `${tool.description} Zero uploads — all processing runs locally in your browser. No signup, no ads, no limits. Free forever.`
    : `${tool.description} Completely free forever — no hidden fees, no ads, no registration required. Runs entirely in your browser with full privacy.`;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: [
      // Primary tool keywords
      tool.name.toLowerCase(),
      tool.category.toLowerCase(),

      // Privacy-first differentiators — BigWow's core moat
      "private",
      "no upload",
      "offline",
      "local-first",
      "secure",
      "client-side",
      "browser only",
      "privacy focused",
      "no server",
      "zero upload",
      "100% local",

      // Core free-tool differentiators
      "free online tool",
      "free forever",
      "no ads",
      "no registration",
      "no signup",
      "no login",
      "no servers",
      "open source",
      "no watermark",
      "no limits",
      "no file size limit",
      "no subscription",
      "no premium",
      "completely free",
      "100% free",
      "zero cost",
      "no hidden fees",
      "no credit card",
      "no payment",
      "free alternative",
      "better than paid",

      // Technical differentiators
      "browser tool",
      "web tool",
      "online utility",
      "instant tool",
      "fast tool",
      "secure tool",
      "private tool",
      "offline capable",
      "no data collection",
      "no tracking",
      "gdpr compliant",
      "local processing",

      // Competitive advantages
      "vs canva",
      "vs photoshop",
      "vs adobe",
      "vs smallpdf",
      "vs ilovepdf",
      "vs removebg",
      "vs photopea",
      "alternative to",
      "replacement for",

      // User intent keywords
      "how to",
      "online",
      "instant",
      "quick",
      "easy",
      "simple",
      "fast",
      "efficient",
      "professional",
      "high quality",
      "best free",
      "top free",

      // Finance/data keywords (relevant to subcategories)
      "expense tracker",
      "budget management",
      "financial tracking",
      "expense reports",
      "spending analysis",
      "personal finance",
      "money management",
      "expense categories",
      "budget planning",
      "financial charts",
      "charts",
      "data visualization",
      "graph",
      "chart creator",
      "bar chart",
      "line chart",
      "pie chart",
      "area chart",
      "radar chart",
      "radial chart",
      "currency",
      "currency converter",
      "exchange rate",
      "forex",
      "money converter",
      "currency calculator",
      "exchange rate calculator",
      "currency conversion",
      "foreign exchange",
      "currency rates",
      "live exchange rates",
      "real-time currency",
      "currency tool",
      "money exchange",
      "currency translator",
      "international currency",
      "currency converter online",
      "free currency converter",
      "USD",
      "EUR",
      "GBP",
      "JPY",
      "CAD",
      "AUD",
      "CHF",
      "CNY",

      // Tool-specific keywords extracted from description
      ...tool.description
        .toLowerCase()
        .split(" ")
        .filter(
          (word) =>
            word.length > 3 &&
            ![
              "the", "and", "for", "with", "from", "this", "that", "your",
              "are", "can", "use", "all", "get", "has", "its", "our", "out",
              "but", "not", "you", "any", "may", "new", "now", "old", "see",
              "him", "two", "how", "her", "was", "one", "had", "by", "word",
              "what", "some", "we", "it", "is", "or", "the", "of", "to",
              "and", "a", "in", "he", "on", "as", "his", "they", "i", "at",
              "be", "have", "were", "when", "said", "there", "each", "which",
              "she", "do", "their", "if", "will", "up", "other", "about",
              "many", "then", "them", "these", "so", "would", "make", "like",
              "into", "time", "more", "go", "no", "way", "could", "my",
              "than", "first", "been", "call", "who", "find", "long", "down",
              "day", "did", "come", "made", "part",
            ].includes(word)
        ),
    ],
    authors: [{ name: "BigWow" }],
    creator: "BigWow",
    publisher: "BigWow",
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
    openGraph: {
      type: "website",
      locale: "en_US",
      alternateLocale: ["ar_SA", "ar_AE", "ar_EG"],
      url: toolUrl,
      title: seoTitle,
      description: seoDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${tool.name} — Private ${tool.category} Tool | BigWow`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: ["/og-image.png"],
      creator: "@bigwow",
      site: "@bigwow",
    },
    alternates: {
      canonical: toolUrl,
      languages: languageAlternates(href),
    },
    category: "technology",
  };
}

export function generatePageMetadata(
  title: string,
  description: string,
  path: string = ""
): Metadata {
  const pageUrl = absoluteUrl(path);

  // Privacy-first page metadata
  const seoPageTitle = title.includes("BigWow")
    ? title
    : `${title} | Private Browser Tools — No Upload, No Signup | BigWow`;
  const seoPageDescription = description.includes("locally")
    ? description
    : `${description} All tools run locally in your browser — zero uploads, zero server processing. Completely free, no signup required.`;

  return {
    title: seoPageTitle,
    description: seoPageDescription,
    keywords: [
      // Core differentiators
      "browser tools",
      "online tools",
      "free tools",
      "free forever",
      "no ads",
      "no registration",
      "no signup",
      "no login",
      "no servers",
      "privacy focused",
      "open source",
      "no watermark",
      "no limits",
      "completely free",
      "100% free",
      "zero cost",
      "no hidden fees",
      "no subscription",
      "no premium",
      "client side",
      "browser only",
      "local processing",
      "no data collection",
      "no tracking",
      "gdpr compliant",

      // Privacy-first moat keywords
      "private tools",
      "no upload tools",
      "offline tools",
      "local-first tools",
      "secure browser tools",
      "zero upload",
      "client-side tools",

      // User intent keywords
      "productivity",
      "web utilities",
      "instant tools",
      "fast tools",
      "secure tools",
      "best free tools",
      "top free tools",
      "free alternatives",
      "better than paid",
      "professional tools",
      "high quality tools",

      // Competitive keywords
      "vs canva",
      "vs photoshop",
      "vs adobe",
      "vs smallpdf",
      "vs ilovepdf",
      "alternative to",
      "replacement for",
    ],
    authors: [{ name: "BigWow" }],
    creator: "BigWow",
    publisher: "BigWow",
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
    openGraph: {
      type: "website",
      locale: "en_US",
      alternateLocale: ["ar_SA", "ar_AE", "ar_EG"],
      url: pageUrl,
      title: seoPageTitle,
      description: seoPageDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: seoPageTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seoPageTitle,
      description: seoPageDescription,
      images: ["/og-image.png"],
      creator: "@bigwow",
      site: "@bigwow",
    },
    alternates: {
      canonical: pageUrl,
      languages: languageAlternates(path),
    },
    category: "technology",
  };
}
