import { generatePageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";
import Link from "next/link";

export const metadata = generatePageMetadata(
  "Free Developer Tools Online — JSON Formatter, JWT Decoder, Regex Tester (No Upload)",
  "Free browser-based developer tools: JSON formatter, Base64 encoder, JWT decoder, UUID generator, regex tester, URL encoder, hash generator, and more. 100% private — your data never leaves your browser.",
  "/tools/developer-tools"
);

const devToolsSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Free Developer Tools Online — No Upload, No Account",
  "url": `${siteConfig.baseUrl}/tools/developer-tools`,
  "description": "Free browser-based developer tools: JSON formatter, Base64, JWT decoder, UUID generator, regex tester, and more. 100% private.",
  "publisher": { "@type": "Organization", "name": "BigWow", "url": siteConfig.baseUrl }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the best free JSON formatter online?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "BigWow's JSON formatter at bigwow.space/tools/json-formatter formats, validates, and minifies JSON entirely in your browser. Safe to paste API keys and credentials — nothing is sent to any server."
      }
    },
    {
      "@type": "Question",
      "name": "How do I decode a JWT token safely?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Use BigWow's JWT Decoder at bigwow.space/tools/jwt-decoder. Unlike jwt.io, BigWow decodes JWTs entirely in your browser using local Base64 parsing — your auth tokens never leave your device."
      }
    },
    {
      "@type": "Question",
      "name": "How do I test a regex online without sending my data to a server?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "BigWow's Regex Tester at bigwow.space/tools/regex-tester runs all matching locally using the browser's native JavaScript RegExp engine. Safe to paste log snippets, tokens, and personal data."
      }
    }
  ]
};

const tools = [
  { href: "/tools/json-formatter", name: "JSON Formatter", desc: "Format, validate, minify JSON. Safe for credentials — zero server." },
  { href: "/tools/base64", name: "Base64 Encoder/Decoder", desc: "Encode/decode Base64 strings and files. Uses native btoa/atob APIs." },
  { href: "/tools/jwt-decoder", name: "JWT Decoder", desc: "Decode JSON Web Tokens privately. Unlike jwt.io — nothing sent to server." },
  { href: "/tools/uuid-generator", name: "UUID Generator", desc: "Generate v4 UUIDs using crypto.randomUUID(). Cryptographically random." },
  { href: "/tools/regex-tester", name: "Regex Tester", desc: "Test regular expressions locally. Safe to paste sensitive log data." },
  { href: "/tools/hash-generator", name: "Hash Generator", desc: "SHA-256, SHA-512, MD5. Uses Web Crypto API. Your input stays local." },
  { href: "/tools/url-encoder", name: "URL Encoder/Decoder", desc: "Percent-encode and decode URLs and query strings." },
  { href: "/tools/yaml-json", name: "YAML ↔ JSON", desc: "Convert between YAML and JSON formats instantly." },
  { href: "/tools/cron-parser", name: "Cron Parser", desc: "Explain cron expressions in plain English. Shows next 10 runs." },
  { href: "/tools/unix-timestamp", name: "Unix Timestamp", desc: "Convert epoch seconds ↔ human-readable date with timezone." },
  { href: "/tools/sql-formatter", name: "SQL Formatter", desc: "Format and beautify SQL queries with proper indentation." },
  { href: "/tools/password-generator", name: "Password Generator", desc: "Generate secure passwords using Crypto.getRandomValues(). 100% local." },
];

export default function DeveloperToolsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(devToolsSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-4">Free Developer Tools Online</h1>
        <p className="text-lg text-muted-foreground mb-4">
          JSON formatter, JWT decoder, regex tester, Base64 encoder, UUID generator, and more — all free, all in your browser.
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          No uploads · No account · 100% private · Paste credentials safely · Works offline
        </p>
        <p className="text-sm text-muted-foreground mb-12">
          Every tool runs locally — safe to use with API keys, JWT tokens, database credentials, and sensitive log data.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
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
              <h3 className="font-semibold mb-2">Is it safe to paste API keys into a JSON formatter?</h3>
              <p className="text-muted-foreground">On BigWow, yes. The <Link href="/tools/json-formatter" className="underline">JSON Formatter</Link> uses browser-native JSON.parse — no network request is made. Open DevTools → Network while using it to confirm zero data transmission.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">How do I decode a JWT without sending it to jwt.io?</h3>
              <p className="text-muted-foreground">Use the <Link href="/tools/jwt-decoder" className="underline">JWT Decoder</Link>. It parses tokens using local Base64 string operations — your auth tokens never leave your browser. Safe for production tokens from live environments.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">How do I generate a UUID in the browser?</h3>
              <p className="text-muted-foreground">The <Link href="/tools/uuid-generator" className="underline">UUID Generator</Link> uses the browser's crypto.randomUUID() API — producing cryptographically random v4 UUIDs with no server call.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What is the best free online regex tester?</h3>
              <p className="text-muted-foreground">The <Link href="/tools/regex-tester" className="underline">BigWow Regex Tester</Link> runs all matching using the browser's native RegExp engine. Unlike Regex101, nothing is sent to a server — safe to test against real log data and personal information.</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
