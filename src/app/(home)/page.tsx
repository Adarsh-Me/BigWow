import HomePage from "@/components/HomePage";
import StructuredData from "@/components/StructuredData";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { findFirstTool } from "@/lib/search-utils";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "BigWow — 113 Free Browser Tools: PDF, Image, AI & Dev (No Upload Required)",
  description:
    "113 free browser tools for PDF, image compression, background removal, QR codes, JSON formatting, password generation, and more. 100% client-side — your files never leave your device. No signup, no ads, forever free.",
  keywords: [
    // High-priority from keyword research (low competition, high intent)
    "free online tools no upload",
    "browser tools privacy",
    "compress image online free",
    "image compressor online",
    "background remover online free",
    "free background remover no watermark",
    "remove background from image free",
    "word counter online free",
    "json formatter online",
    "password generator online",
    "qr code generator free",
    "compress pdf online free",
    "split pdf online free",
    "merge pdf files online",
    "reduce pdf file size",
    "png to jpg converter",
    "jpg to png converter",
    "heic to jpg converter",
    "webp to jpg converter",
    "image resizer online",
    "lorem ipsum generator",
    "case converter online",
    "regex tester online",
    "base64 encoder decoder",
    "url encoder decoder online",
    "uuid generator online",
    "free ocr online",
    "image to text converter online",
    // Core differentiators
    "client-side tools",
    "no server upload tools",
    "offline browser tools",
    "privacy first tools",
    "free tools no signup",
    "free tools no account",
    "100% private tools",
    "local processing tools",
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
    url: siteConfig.baseUrl,
    title: "BigWow — 113 Free Browser Tools: PDF, Image, AI & Dev (No Upload Required)",
    description:
      "113 free browser tools for PDF, image, AI, and developer tasks. 100% client-side — your files never leave your device. No signup, no ads, forever free.",
    siteName: "BigWow",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BigWow — Free Browser Tools, No Upload Required",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BigWow — 113 Free Browser Tools: PDF, Image, AI & Dev (No Upload)",
    description:
      "113 free browser tools. 100% client-side — files never leave your device. No signup, no ads.",
    images: ["/og-image.png"],
    creator: "@bigwow",
    site: "@bigwow",
  },
  alternates: {
    canonical: siteConfig.baseUrl,
  },
  category: "technology",
};

interface HomeProps {
  searchParams: Promise<{
    search?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  // Await the searchParams promise
  const params = await searchParams;

  // Handle search parameter and redirect to first tool found
  if (params.search) {
    const searchTerm = params.search;
    const firstTool = findFirstTool(searchTerm);

    if (firstTool) {
      // Redirect to the most relevant tool
      redirect(firstTool.href);
    }
    // If no tool found, continue to show homepage with search results
  }

  return (
    <>
      <StructuredData type="website" />
      <HomePage initialSearchQuery={params.search} />
    </>
  );
}
