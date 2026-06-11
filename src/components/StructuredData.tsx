import { getAllTools } from "@/lib/tools-config";
import { absoluteUrl, siteConfig } from "@/lib/site";

interface StructuredDataProps {
  type: "website" | "tool" | "organization";
  toolName?: string;
  toolDescription?: string;
  toolCategory?: string;
  toolUrl?: string;
}

export default function StructuredData({
  type,
  toolName,
  toolDescription,
  toolCategory,
  toolUrl,
}: StructuredDataProps) {
  const baseUrl = siteConfig.baseUrl;
  const allTools = getAllTools().filter((tool) => tool.available);

  const getWebsiteStructuredData = () => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Browser Tools Collection",
    description: "Collection of free online tools",
    numberOfItems: allTools.length,
    itemListElement: allTools.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SoftwareApplication",
        name: tool.name,
        description: tool.description,
        url: absoluteUrl(tool.href),
        applicationCategory: tool.category,
        operatingSystem: "Web Browser",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
    })),
  });

  const getToolStructuredData = () => ({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: toolName,
    description: toolDescription,
    url: toolUrl,
    applicationCategory: toolCategory,
    operatingSystem: "Web Browser",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    softwareVersion: "1.0",
    datePublished: "2024-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/icon.svg"),
      },
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  });

  const getOrganizationStructuredData = () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    description: "100% free, privacy-first, client-side browser tools for productivity. Over 101+ offline-capable tools with no servers, no signups, and zero data collection.",
    url: baseUrl,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/icon.svg"),
      width: 512,
      height: 512,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      url: baseUrl,
    },
  });

  const getStructuredData = () => {
    switch (type) {
      case "website":
        return getWebsiteStructuredData();
      case "tool":
        return getToolStructuredData();
      case "organization":
        return getOrganizationStructuredData();
      default:
        return getWebsiteStructuredData();
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData(), null, 2),
      }}
    />
  );
}
