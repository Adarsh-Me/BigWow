import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browser Tools - 100+ Free Online Productivity Tools | BigWow",
  description: "Browse 100+ free browser-based online tools. No servers, full privacy. Convert files, compress images, generate mockups, test codes, and work with media client-side.",
  openGraph: {
    title: "Browser Tools - 100+ Free Online Productivity Tools | BigWow",
    description: "Browse 100+ free browser-based online tools. No servers, full privacy.",
    type: "website",
    siteName: "BigWow",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Browser Tools - 100+ Free Online Productivity Tools | BigWow",
    description: "Browse 100+ free browser-based online tools. No servers, full privacy.",
    images: ["/og-image.png"],
  },
};

export default function BrowserToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
