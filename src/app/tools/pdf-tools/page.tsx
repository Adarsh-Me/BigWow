import { generatePageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";
import Link from "next/link";

export const metadata = generatePageMetadata(
  "Free PDF Tools Online — Merge, Split, Compress PDF Without Uploading",
  "Free online PDF tools: merge PDFs, split PDF, compress PDF, rotate PDF, convert PDF to images. 100% client-side — your documents never leave your device. Better than Smallpdf, iLovePDF.",
  "/tools/pdf-tools"
);

const pdfToolsSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Free PDF Tools Online — No Upload Required",
  "url": `${siteConfig.baseUrl}/tools/pdf-tools`,
  "description": "Free online PDF tools: merge, split, compress, rotate PDF. 100% client-side — your documents never leave your device.",
  "publisher": { "@type": "Organization", "name": "BigWow", "url": siteConfig.baseUrl }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I merge PDF files online for free without uploading?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Use BigWow's free PDF merger at bigwow.space/tools/pdf. It merges PDF files entirely in your browser using pdf-lib (WebAssembly). Your documents never leave your device."
      }
    },
    {
      "@type": "Question",
      "name": "How do I compress a PDF online without uploading to a server?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "BigWow's PDF compressor reduces PDF file size locally in your browser. No upload, no account. Go to bigwow.space/tools/pdf and select Compress PDF."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between BigWow and Smallpdf or iLovePDF?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Smallpdf and iLovePDF upload your PDF files to their servers for processing. BigWow processes everything in your browser — your documents never leave your device. BigWow is also completely free with no file size limits, no watermarks, and no account required."
      }
    }
  ]
};

const tools = [
  { href: "/tools/pdf?subTool=merge-pdfs", name: "Merge PDFs", desc: "Combine multiple PDF files into one. Drag to reorder. Zero uploads." },
  { href: "/tools/pdf?subTool=split-pdf", name: "Split PDF", desc: "Extract specific pages or page ranges from a PDF. Local processing." },
  { href: "/tools/pdf?subTool=compress-pdf", name: "Compress PDF", desc: "Reduce PDF file size without quality loss. 100% in-browser." },
  { href: "/tools/pdf?subTool=rotate-pdf", name: "Rotate PDF", desc: "Rotate all or selected PDF pages. Client-side, no upload." },
  { href: "/tools/pdf?subTool=pdf-to-images", name: "PDF to Images", desc: "Convert PDF pages to JPEG images. Packed as ZIP. No server." },
  { href: "/tools/pdf?subTool=pdf-to-text", name: "PDF to Text", desc: "Extract text from PDF files locally. Safe for confidential docs." },
  { href: "/tools/pdf?subTool=images-to-pdf", name: "Images to PDF", desc: "Combine images into a single PDF. Fully client-side." },
];

export default function PdfToolsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pdfToolsSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-4">Free PDF Tools Online</h1>
        <p className="text-lg text-muted-foreground mb-4">
          Merge, split, compress, rotate, and convert PDFs — 100% in your browser. Your documents never leave your device.
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          No uploads · No signup · No watermarks · No file size limits · Free forever
        </p>
        <p className="text-sm text-muted-foreground mb-12">
          A better alternative to Smallpdf and iLovePDF — because your files stay on your device.
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
              <h3 className="font-semibold mb-2">How do I merge PDF files online for free?</h3>
              <p className="text-muted-foreground">Use the <Link href="/tools/pdf?subTool=merge-pdfs" className="underline">PDF Merger</Link>. Drop your files in, drag to reorder, click merge. Everything runs locally using pdf-lib — no upload, no server.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">How do I reduce PDF file size online?</h3>
              <p className="text-muted-foreground">The <Link href="/tools/pdf?subTool=compress-pdf" className="underline">PDF Compressor</Link> reduces file size by optimising image quality within the PDF. No upload, works on any PDF.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Is BigWow better than Smallpdf?</h3>
              <p className="text-muted-foreground">For privacy, yes. Smallpdf uploads every file to their servers. BigWow processes everything in your browser — your documents are never transmitted. BigWow is also completely free with no file limits or watermarks.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">How do I split a PDF online for free?</h3>
              <p className="text-muted-foreground">Use the <Link href="/tools/pdf?subTool=split-pdf" className="underline">PDF Splitter</Link>. Enter the page numbers to extract, and download the result. Zero uploads required.</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
