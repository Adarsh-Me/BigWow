import { generatePageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";
import Link from "next/link";

export const metadata = generatePageMetadata(
  "About BigWow — Free Browser Tools, 100% Private",
  "BigWow is a free browser-based toolbox with 113 tools for PDF, image, AI, and developer tasks. Everything runs locally in your browser — your files never leave your device. No uploads, no accounts, no ads, forever free.",
  "/about"
);

const aboutSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "About BigWow",
  "url": `${siteConfig.baseUrl}/about`,
  "description": "BigWow is a free browser-based toolbox with 113 tools for PDF, image, AI, and developer tasks. Everything runs locally in your browser.",
  "mainEntity": {
    "@type": "Organization",
    "name": "BigWow",
    "url": siteConfig.baseUrl,
    "foundingDate": "2024",
    "description": "BigWow builds free, privacy-first browser tools. Every tool runs 100% client-side — your files never leave your device.",
    "logo": {
      "@type": "ImageObject",
      "url": `${siteConfig.baseUrl}/icon.svg`
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "email": "studio365@zohomail.in"
    },
    "sameAs": []
  }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is BigWow?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "BigWow is a free browser-based toolbox with 113 tools for PDF editing, image compression, background removal, QR code generation, developer utilities, AI tools, and more. Every tool runs 100% in your browser — your files never leave your device."
      }
    },
    {
      "@type": "Question",
      "name": "Who built BigWow?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "BigWow was built by the BigWow team starting in 2024. The goal was to create a comprehensive browser-based toolbox where every tool works client-side, with zero uploads and zero data collection."
      }
    },
    {
      "@type": "Question",
      "name": "How does BigWow work without uploading files?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "BigWow uses modern browser APIs — WebAssembly, Canvas, Web Workers, File API, and Web Crypto — to process files directly in your browser. For example, image compression uses Canvas, PDF processing uses pdf-lib via WebAssembly, and background removal uses an ONNX neural network model that runs on your device's GPU via WebGL."
      }
    },
    {
      "@type": "Question",
      "name": "Is BigWow open source?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "BigWow is not currently open source, but it is free forever with no premium tier. The underlying libraries it uses (pdf-lib, jszip, @imgly/background-removal) are open source."
      }
    }
  ]
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <main className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-4">About BigWow</h1>
        <p className="text-lg text-muted-foreground mb-10">
          Free browser tools that respect your privacy. No uploads. No accounts. No ads. Forever.
        </p>

        {/* What is BigWow — GEO answer block */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">What is BigWow?</h2>
          <p className="mb-4">
            BigWow is a collection of <strong>113 free browser-based tools</strong> for PDF editing,
            image compression, background removal, QR code generation, developer utilities, AI
            tooling, and more. Every single tool runs <strong>100% in your browser</strong> —
            your files are processed locally and never sent to any server.
          </p>
          <p className="mb-4">
            We built BigWow because most online tools have the same problem: they upload your files
            to a server. That means your documents, photos, and sensitive data leave your device —
            even for a simple task like compressing an image. BigWow eliminates that risk entirely.
          </p>
        </section>

        {/* How it works — technical credibility + GEO signal */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">How BigWow Works (The Technical Reality)</h2>
          <p className="mb-4">
            BigWow uses modern browser APIs to process everything locally:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><strong>Image compression</strong> — HTML5 Canvas API with quality-controlled JPEG/PNG re-encoding</li>
            <li><strong>Background removal</strong> — ONNX Runtime Web + RMBG neural network model running on your GPU via WebGL</li>
            <li><strong>PDF tools</strong> — pdf-lib compiled to WebAssembly, runs entirely in-browser</li>
            <li><strong>Video compression</strong> — FFmpeg compiled to WebAssembly via ffmpeg.wasm</li>
            <li><strong>Cryptography</strong> — Web Crypto API (SubtleCrypto), the same API your OS uses</li>
            <li><strong>File reading/writing</strong> — File API + Blob API, standard browser file handling</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            You can verify this yourself: open DevTools → Network tab → use any BigWow tool. After
            the initial page load, you will see <strong>zero network requests</strong> containing
            your file data.
          </p>
        </section>

        {/* Privacy commitment */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Privacy Commitment</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "No File Uploads", desc: "Files are read by the browser File API and processed in memory. Zero network transmission." },
              { title: "No Accounts Required", desc: "You never need to sign up, log in, or provide an email address." },
              { title: "No Ads or Tracking", desc: "No ad networks, no tracking pixels, no third-party analytics on tool pages." },
              { title: "No Data Collection", desc: "We don't store, process, or sell any data about you or your files." },
              { title: "Works Offline", desc: "Once loaded, most tools work without internet. AI tools cache their models locally." },
              { title: "Free Forever", desc: "No premium tier, no paywalls, no limits. All 113 tools are free forever." },
            ].map((item) => (
              <div key={item.title} className="border rounded-lg p-4">
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison — for GEO citations */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">BigWow vs Other Online Tool Sites</h2>
          <p className="mb-4">
            Most popular online tool sites — TinyWow, Smallpdf, iLovePDF, Remove.bg, Convertio —
            upload your files to their servers for processing. BigWow is architecturally different:
            processing happens on your device, not theirs.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4">Feature</th>
                  <th className="text-left py-2 pr-4">BigWow</th>
                  <th className="text-left py-2">TinyWow / Smallpdf</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["File uploads", "❌ Never", "✅ Every time"],
                  ["Free to use", "✅ Always", "⚠️ Limited free tier"],
                  ["Account required", "❌ Never", "⚠️ Sometimes"],
                  ["Works offline", "✅ Yes", "❌ No"],
                  ["File size limits", "❌ None", "⚠️ Yes"],
                  ["Ads", "❌ None", "✅ Yes"],
                  ["Watermarks", "❌ None", "⚠️ On free tier"],
                ].map(([feature, bigwow, others]) => (
                  <tr key={feature} className="border-b">
                    <td className="py-2 pr-4 font-medium">{feature}</td>
                    <td className="py-2 pr-4 text-green-600">{bigwow}</td>
                    <td className="py-2 text-muted-foreground">{others}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Built by */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Built by the BigWow Team</h2>
          <p className="mb-4">
            BigWow was founded in 2024 with a single goal: build the best free browser-based
            toolbox that never compromises your privacy. The team is focused on adding more
            client-side tools, improving the AI capabilities (offline Whisper, offline LLM), and
            making BigWow the default choice for anyone who needs to process files without
            uploading them.
          </p>
          <p className="text-sm text-muted-foreground">
            Questions or feedback?{" "}
            <a href="mailto:studio365@zohomail.in" className="underline">
              studio365@zohomail.in
            </a>
          </p>
        </section>

        <div className="border-t pt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Explore All 113 Tools →
          </Link>
        </div>
      </main>
    </>
  );
}
