import { MetadataRoute } from "next";
import { getAllTools } from "@/lib/tools-config";
import { blogPosts } from "@/lib/blog-data";
import { programmaticPages } from "@/lib/programmatic-seo-config";
import { absoluteUrl, languageAlternates } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  // Get all available tools
  const allTools = getAllTools().filter((tool) => tool.available);

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl(),
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1,
      alternates: { languages: languageAlternates() },
    },
    {
      url: absoluteUrl("/browser-tools"),
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.95,
      alternates: { languages: languageAlternates("/browser-tools") },
    },
    {
      url: absoluteUrl("/blog"),
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: { languages: languageAlternates("/blog") },
    },
    {
      url: absoluteUrl("/flowstate"),
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: { languages: languageAlternates("/flowstate") },
    },
    {
      url: absoluteUrl("/x"),
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.85,
      alternates: { languages: languageAlternates("/x") },
    },
  ];

  // Tool routes
  const toolRoutes: MetadataRoute.Sitemap = allTools.map((tool) => ({
    url: absoluteUrl(tool.href),
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.8,
    alternates: { languages: languageAlternates(tool.href) },
  }));

  // Programmatic landing routes (/x/[slug])
  const geoRoutes: MetadataRoute.Sitemap = programmaticPages
    .filter((p) => p.type === "geo" || !p.type)
    .map((page) => ({
      url: absoluteUrl(`/x/${page.slug}`),
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.78,
      alternates: { languages: languageAlternates(`/x/${page.slug}`) },
    }));

  const competitorRoutes: MetadataRoute.Sitemap = programmaticPages
    .filter((p) => p.type === "competitor")
    .map((page) => ({
      url: absoluteUrl(`/x/${page.slug}`),
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.72,
      alternates: { languages: languageAlternates(`/x/${page.slug}`) },
    }));

  // Blog post routes
  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
    alternates: { languages: languageAlternates(`/blog/${post.slug}`) },
  }));

  return [...staticRoutes, ...toolRoutes, ...geoRoutes, ...competitorRoutes, ...blogRoutes];
}
