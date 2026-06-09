export const siteConfig = {
  name: "BigWow",
  baseUrl: "https://bigwow.space",
  defaultLocale: "en",
  supportedLocales: ["en"] as const,
};

export function absoluteUrl(path = "") {
  if (!path || path === "/") {
    return siteConfig.baseUrl;
  }

  return `${siteConfig.baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function languageAlternates(path = "") {
  const url = absoluteUrl(path);

  return {
    "x-default": url,
    en: url,
  };
}
