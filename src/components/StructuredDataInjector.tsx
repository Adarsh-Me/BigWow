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
    "@type": "SoftwareApplication",
    "name": toolName,
    "description": toolDescription,
    "url": toolUrl,
    "applicationCategory": tool.category || "Utility",
    "operatingSystem": "Web Browser",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "softwareVersion": "1.0",
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString().split("T")[0],
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
      "description": "Completely free forever - no hidden fees, no ads, no registration required"
    },
    "featureList": [
      "100% Free Forever",
      "No Ads or Watermarks",
      "No Registration Required",
      "Complete Privacy Protection",
      "Runs in Browser Only",
      "No Server Processing",
      "Open Source",
      "Updated Weekly",
      "No File Size Limits",
      "No Data Collection",
      "Client-Side Local Processing"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 2),
      }}
    />
  );
}
