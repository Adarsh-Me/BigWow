import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { programmaticPages, type ProgrammaticPageConfig } from "@/lib/programmatic-seo-config";

// ─── Upgrade 1: Per-tool dynamic section config ───────────────────────────────
// Each tool gets a semantically relevant title + crawlable description block.

interface ToolConfig {
  title: string;
  description: string;
}

const TOOL_CONFIG: Record<string, ToolConfig> = {
  "/tools/pdf": {
    title: "🔒 Privacy & PDF Workflow Guides",
    description:
      "BigWow processes your PDFs locally using pdf-lib — a client-side JavaScript library that runs entirely in your browser tab. Your documents are never uploaded to any server, transmitted over a network, or stored in any external database.",
  },
  "/tools/image-compression": {
    title: "⚡ Local Image Processing Guides",
    description:
      "BigWow compresses images using the browser's native Canvas API — no upload, no server, no account required. Your photos, screenshots, and design files are processed on your own device using your local CPU.",
  },
  "/tools/bg-removal": {
    title: "🛡️ Private AI Image Processing",
    description:
      "BigWow's background remover uses an AI segmentation model that runs directly in your browser via WebGL. Image data is processed on your local GPU — zero network transmission, zero server storage.",
  },
  "/tools/jwt-decoder": {
    title: "🛡 Token Security Guides",
    description:
      "BigWow decodes JWTs using local Base64 URL parsing — no network requests, no analytics scripts, no token exposure. Your authentication credentials stay inside your browser tab.",
  },
  "/tools/json-formatter": {
    title: "💡 Offline Data Format Guides",
    description:
      "BigWow formats and validates JSON using the browser's native JSON.parse — completely offline, requiring no network connection. Safe to paste API keys, database credentials, and configuration secrets.",
  },
  "/tools/hash-generator": {
    title: "🔐 Cryptographic Hashing Guides",
    description:
      "BigWow generates hashes using the browser's Web Crypto API (SubtleCrypto.digest). Your input text, passwords, and sensitive strings never reach any external server.",
  },
  "/tools/text-encryption": {
    title: "🔐 Browser Encryption Guides",
    description:
      "BigWow encrypts text using AES-256-GCM via the Web Crypto API — running entirely in your browser. Your plaintext message and passphrase are never transmitted to any server.",
  },
  "/tools/password-generator": {
    title: "🔑 Secure Password Guides",
    description:
      "BigWow generates passwords using Crypto.getRandomValues() — the browser's cryptographically secure random number generator (CSPRNG). No API call, no network request. Your passwords are generated and displayed locally.",
  },
  "/tools/regex-tester": {
    title: "🧪 Developer Workflow Guides",
    description:
      "BigWow evaluates regular expressions using your browser's native RegExp engine. Your test strings — which may contain log lines, email addresses, or auth tokens — are never sent to any server.",
  },
  "/tools/base64": {
    title: "💻 Browser-Based Encoding Guides",
    description:
      "BigWow encodes and decodes Base64 using the browser's native btoa/atob functions. No network requests — your API keys, secrets, and binary data stay entirely on your device.",
  },
  "/tools/compress-video": {
    title: "🎬 Local Video Processing Guides",
    description:
      "BigWow compresses video using FFmpeg compiled to WebAssembly, running natively in your browser tab. Your video files — which may be private recordings or confidential content — never leave your device.",
  },
  "/tools/qr-generator": {
    title: "📷 Browser QR Code Guides",
    description:
      "BigWow generates QR codes directly in your browser with no data sent to any server. The URLs and data you encode remain private — no scan tracking, no account required.",
  },
  "/tools/spreadsheet": {
    title: "📊 Local CSV & Spreadsheet Guides",
    description:
      "BigWow opens and edits CSV files locally in your browser with no data upload. Your financial data, contacts, and business records never leave your device.",
  },
  "/tools/zip": {
    title: "🗜️ Browser-Based Archive Guides",
    description:
      "BigWow creates and extracts ZIP archives entirely in-browser using JSZip. Your files — including sensitive documents, source code, and configurations — are never uploaded.",
  },
  "/tools/unit-converter": {
    title: "📐 Offline Converter Guides",
    description:
      "BigWow converts measurements locally using static lookup tables — no API calls, no tracking. Works offline and handles every unit conversion without a server.",
  },
  "/tools/invoice": {
    title: "🧾 Private Document Guides",
    description:
      "BigWow generates PDF invoices entirely in your browser using client-side rendering. Your client data, payment amounts, and business information are never uploaded to any cloud service.",
  },
  "/tools/file-converter": {
    title: "🔄 Local File Conversion Guides",
    description:
      "BigWow converts files locally in your browser — no uploads required. Unlike most online converters, your files are processed on your device and never transmitted to an external server.",
  },
  "/tools/currency-converter": {
    title: "💱 Offline Currency Conversion Guides",
    description:
      "BigWow shows real-time exchange rates without uploading any personal data. Your currency queries and financial information stay private.",
  },
};

const DEFAULT_CONFIG: ToolConfig = {
  title: "🔒 Privacy & Security Guides",
  description:
    "BigWow processes all data locally in your browser. Nothing is ever uploaded to an external server — no files, no text, no metadata.",
};

// ─── Upgrade 3: Priority selection (max 5: ≤3 GEO + ≤2 competitor) ───────────
// Sort order: typed "geo" first (Phase 3 pages), then untyped (Phase 1 pages).
// This ensures newer, more specific GEO pages get priority over generic untyped ones.

function selectGuides(toolPath: string): ProgrammaticPageConfig[] {
  const all = programmaticPages.filter((p) => p.toolPath === toolPath);

  const geoTyped    = all.filter((p) => p.type === "geo");
  const geoUntyped  = all.filter((p) => !p.type);
  const competitor  = all.filter((p) => p.type === "competitor");

  // Take typed GEO pages first (higher semantic specificity), then untyped
  const geoSelected      = [...geoTyped, ...geoUntyped].slice(0, 3);
  const competitorSelected = competitor.slice(0, 2);

  return [...geoSelected, ...competitorSelected];
}

// ─── Component ────────────────────────────────────────────────────────────────

interface RelatedPrivacyGuidesProps {
  /** The canonical tool route, e.g. "/tools/pdf" */
  toolPath: string;
}

/**
 * RelatedPrivacyGuides — Server Component (RSC)
 *
 * Renders a tool-specific "Privacy Guides" section beneath a tool page.
 * Creates the Tool ↔ GEO Page ↔ Competitor bidirectional link graph.
 *
 * Upgrades applied (Phase 7.1):
 *   1. Dynamic section title per tool intent
 *   2. Crawlable GEO content block above links
 *   3. Priority-based selection, max 5 links
 */
export default function RelatedPrivacyGuides({ toolPath }: RelatedPrivacyGuidesProps) {
  const guides = selectGuides(toolPath);
  const config = TOOL_CONFIG[toolPath] ?? DEFAULT_CONFIG;

  if (guides.length === 0) return null;

  const geoGuides        = guides.filter((p) => p.type !== "competitor");
  const competitorGuides = guides.filter((p) => p.type === "competitor");

  return (
    <aside
      aria-label="Privacy and security guides for this tool"
      className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm divide-y divide-border/40 mt-3 overflow-hidden"
    >
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex items-start gap-3 px-5 pt-5 pb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent shrink-0 mt-0.5">
          <ShieldCheck className="h-4 w-4" />
        </div>
        <h2 className="text-sm font-bold text-foreground leading-tight pt-1.5">
          {config.title}
        </h2>
      </div>

      {/* ── Upgrade 2: GEO content block (crawlable, citation-worthy) ── */}
      <div className="px-5 py-4 bg-muted/30 space-y-2.5">
        <p className="text-xs text-muted-foreground leading-relaxed">
          {config.description}
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-1">
          {[
            "No uploads",
            "No tracking",
            "No signup required",
          ].map((item) => (
            <li
              key={item}
              className="flex items-center gap-1.5 text-xs font-medium text-foreground/70"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-green-500/70 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* ── GEO guide links ─────────────────────────────────────────── */}
      {geoGuides.length > 0 && (
        <div className="px-3 py-3 space-y-0.5">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 pb-1.5">
            Related Guides
          </p>
          {geoGuides.map((page) => (
            <Link
              key={page.slug}
              href={`/x/${page.slug}`}
              className="group flex items-center justify-between gap-3 rounded-lg px-2 py-2 hover:bg-accent/10 transition-colors"
            >
              <span className="text-xs font-medium text-foreground/80 group-hover:text-foreground transition-colors leading-snug">
                {page.h1}
              </span>
              <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-accent shrink-0 transition-colors" />
            </Link>
          ))}
        </div>
      )}

      {/* ── Competitor alternative links ────────────────────────────── */}
      {competitorGuides.length > 0 && (
        <div className="px-3 py-3 space-y-0.5">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 pb-1.5">
            Private Alternatives
          </p>
          {competitorGuides.map((page) => (
            <Link
              key={page.slug}
              href={`/x/${page.slug}`}
              className="group flex items-center justify-between gap-3 rounded-lg px-2 py-2 hover:bg-accent/10 transition-colors"
            >
              <span className="flex items-center gap-2 min-w-0">
                <span className="shrink-0 text-[10px] font-bold bg-secondary text-muted-foreground px-1.5 py-0.5 rounded whitespace-nowrap">
                  vs {page.competitorName}
                </span>
                <span className="text-xs font-medium text-foreground/80 group-hover:text-foreground transition-colors leading-snug truncate">
                  {page.h1}
                </span>
              </span>
              <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-accent shrink-0 transition-colors" />
            </Link>
          ))}
        </div>
      )}

      {/* ── Footer hub link ─────────────────────────────────────────── */}
      <div className="px-5 py-3">
        <Link
          href="/x"
          className="text-[11px] font-medium text-accent hover:underline flex items-center gap-1 underline-offset-2"
        >
          View all 33 privacy guides
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </aside>
  );
}
