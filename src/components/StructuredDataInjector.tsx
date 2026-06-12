"use client";

import { usePathname } from "next/navigation";
import { findToolByHref } from "@/lib/tools-config";
import { useMessages } from "next-intl";
import { absoluteUrl, siteConfig } from "@/lib/site";

export default function StructuredDataInjector() {
  const pathname = usePathname();
  const messages = useMessages() as any;

  if (!pathname || !pathname.startsWith("/tools/")) {
    return null;
  }

  const tool = findToolByHref(pathname);
  if (!tool) {
    return null;
  }

  const toolId = pathname.split("/").pop();
  if (!toolId) {
    return null;
  }

  // Get translated name and description if available
  let toolName = tool.name;
  let toolDescription = tool.description;
  try {
    const translatedName = messages?.ToolsConfig?.tools?.[toolId]?.name;
    const translatedDescription = messages?.ToolsConfig?.tools?.[toolId]?.description;
    if (translatedName) {
      toolName = translatedName;
    }
    if (translatedDescription) {
      toolDescription = translatedDescription;
    }
  } catch (e) {
    // Fallback to default config values if translation lookup fails or keys are not defined
  }

  const baseUrl = siteConfig.baseUrl;
  const toolUrl = absoluteUrl(pathname);

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": toolName,
    "description": toolDescription,
    "url": toolUrl,
    "applicationCategory": "UtilitiesApplication",
    "applicationSubCategory": tool.category || "Utility",
    "operatingSystem": "Any — runs in web browser",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "softwareVersion": "1.0",
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString().split("T")[0],
    "inLanguage": "en",
    "isAccessibleForFree": true,
    "author": {
      "@type": "Organization",
      "name": "BigWow",
      "url": baseUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "BigWow",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/icon.svg`
      }
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "description": "Completely free forever — no hidden fees, no ads, no registration required"
    },
    "featureList": [
      "100% Free Forever",
      "No Ads or Watermarks",
      "No Registration Required",
      "Files Never Leave Your Device",
      "100% Client-Side Processing",
      "Works Offline",
      "No File Size Limits",
      "No Data Collection",
      "No Tracking"
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Is the ${toolName} free?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes, the ${toolName} on BigWow is completely free with no account, no ads, no watermarks, and no file size limits. Free forever.`
        }
      },
      {
        "@type": "Question",
        "name": `Does ${toolName} upload my files to a server?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `No. The ${toolName} processes everything 100% in your browser. Your files never leave your device and are never sent to any server.`
        }
      },
      {
        "@type": "Question",
        "name": `Does ${toolName} work offline?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes. Once loaded, the ${toolName} works without an internet connection. All processing runs locally using your browser's built-in capabilities.`
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema, null, 2),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema, null, 2),
        }}
      />
    </>
  );
}
