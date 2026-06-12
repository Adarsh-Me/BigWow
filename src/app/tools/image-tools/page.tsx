import { generatePageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";
import Link from "next/link";

export const metadata = generatePageMetadata(
  "Free Image Tools Online — Compress, Convert, Resize, Remove Background (No Upload)",
  "Free online image tools: compress images, remove backgrounds, convert HEIC to JPG, WebP to JPG, PNG to JPG, resize images, and more. 100% client-side — your photos never leave your device.",
  "/tools/image-tools"
);

const imageToolsSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Free Image Tools Online — No Upload Required",
  "url": `${siteConfig.baseUrl}/tools/image-tools`,
  "description": "Free online image tools: compress, convert, resize, remove background, and more. 100% client-side — your images never leave your device.",
  "publisher": { "@type": "Organization", "name": "BigWow", "url": siteConfig.baseUrl }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I compress an image online without uploading it?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Use BigWow's free image compressor. It compresses JPG, PNG, and WebP images entirely in your browser using the HTML5 Canvas API. Your image never leaves your device. Go to bigwow.space/tools/image-compression, drag your image in, and download the compressed version."
      }
    },
    {
      "@type": "Question",
      "name": "How do I convert HEIC to JPG for free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "BigWow's image converter supports HEIC to JPG conversion entirely in your browser. No upload required. Go to bigwow.space/tools/image-converter and select your HEIC file."
      }
    },
    {
      "@type": "Question",
      "name": "How do I remove a background from a photo for free without watermarks?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "BigWow's AI background remover uses an on-device neural network (ONNX Runtime Web) to remove backgrounds locally. No uploads, no watermarks, no account. Go to bigwow.space/tools/bg-removal."
      }
    }
  ]
};

const tools = [
  { href: "/tools/image-compression", name: "Image Compressor", desc: "Compress JPG, PNG, WebP — reduce file size up to 90%. Zero uploads." },
  { href: "/tools/bg-removal", name: "Background Remover", desc: "AI background removal in your browser. No upload, no watermark, free forever." },
  { href: "/tools/image-converter", name: "Image Converter", desc: "Convert HEIC to JPG, WebP to JPG, PNG to JPG, and more. Client-side." },
  { href: "/tools/image-resizer", name: "Image Resizer", desc: "Resize images to exact pixels or percentage. Aspect ratio lock. No upload." },
  { href: "/tools/color-correction", name: "Color Correction", desc: "Adjust brightness, contrast, saturation, and hue locally in your browser." },
  { href: "/tools/ai-upscaler", name: "AI Image Upscaler", desc: "Upscale images up to 4x using on-device AI. Fully private." },
  { href: "/tools/exif-viewer", name: "EXIF Viewer", desc: "View and strip EXIF metadata from photos. No upload needed." },
];

export default function ImageToolsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(imageToolsSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-4">Free Image Tools Online</h1>
        <p className="text-lg text-muted-foreground mb-4">
          Compress, convert, resize, and edit images — 100% in your browser. Your photos never leave your device.
        </p>
        <p className="text-sm text-muted-foreground mb-12">
          No uploads · No signup · No watermarks · No file size limits · Free forever
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="border rounded-lg p-5 hover:border-foreground transition-colors"
            >
              <h2 className="font-semibold mb-1">{tool.name}</h2>
              <p className="text-sm text-muted-foreground">{tool.desc}</p>
            </Link>
          ))}
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">How do I compress an image online for free without uploading it?</h3>
              <p className="text-muted-foreground">Use BigWow&apos;s <Link href="/tools/image-compression" className="underline">Image Compressor</Link>. It compresses JPG, PNG, and WebP images using the HTML5 Canvas API — entirely in your browser. Supports bulk compression. No file size limits.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">How do I convert HEIC to JPG for free?</h3>
              <p className="text-muted-foreground">Use the <Link href="/tools/image-converter" className="underline">Image Converter</Link> to convert HEIC to JPG, WebP to JPG, PNG to JPG, and more. All conversions run locally in your browser.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">How do I remove a background without a watermark?</h3>
              <p className="text-muted-foreground">The <Link href="/tools/bg-removal" className="underline">Background Remover</Link> uses on-device AI — no uploads, no watermarks, no account. The model downloads once and runs offline after that.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">How do I compress an image to 100KB or 50KB?</h3>
              <p className="text-muted-foreground">The <Link href="/tools/image-compression" className="underline">Image Compressor</Link> lets you set a target file size or quality percentage, so you can hit exact KB targets like 100KB, 50KB, or 200KB.</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
