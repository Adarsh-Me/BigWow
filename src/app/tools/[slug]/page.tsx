import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { programmaticPages } from "@/lib/programmatic-seo-config";
import ProgrammaticToolRenderer from "@/components/ProgrammaticToolRenderer";
import { ShieldCheck, BookOpen, Check, Award } from "lucide-react";
import Link from "next/link";
import { absoluteUrl, languageAlternates, siteConfig } from "@/lib/site";

export async function generateStaticParams() {
  return programmaticPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = programmaticPages.find((p) => p.slug === slug);
  if (!page) return { title: "Tool Not Found | BigWow" };

  const canonicalPath = `/tools/${slug}`;
  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: {
      canonical: absoluteUrl(canonicalPath),
      languages: languageAlternates(canonicalPath),
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: absoluteUrl(canonicalPath),
      title: page.title,
      description: page.description,
      siteName: "BigWow",
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
    },
  };
}

export default async function ProgrammaticSEOPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = programmaticPages.find((p) => p.slug === slug);
  if (!page) notFound();

  const baseUrl = siteConfig.baseUrl;
  const fullUrl = absoluteUrl(`/tools/${slug}`);

  // SoftwareApplication JSON-LD Schema
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${fullUrl}#application`,
    "name": page.h1,
    "url": fullUrl,
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "description": page.description,
    "softwareVersion": "1.0.0",
    "inLanguage": "en",
    "author": {
      "@type": "Organization",
      "name": "BigWow",
      "url": baseUrl,
    },
  };

  // FAQPage JSON-LD Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${fullUrl}#faq`,
    "mainEntity": page.faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <div className="w-full space-y-10 py-6 animate-in fade-in duration-300">
      {/* Dynamic JSON-LD injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ── HEADER BANNER ─────────────────────────────────────── */}
      <section className="space-y-4 max-w-4xl">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 dark:bg-accent/25 border border-accent/20 px-3 py-1 text-[11px] font-bold text-accent">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>100% Client-Side Privacy Shield</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold tracking-tighter text-foreground leading-[1.1]">
          {page.h1}
        </h1>

        <p className="text-md sm:text-lg text-muted-foreground leading-relaxed font-medium max-w-3xl">
          {page.intro}
        </p>
      </section>

      {/* ── WORKSPACE SECTION ─────────────────────────────────── */}
      <section className="rounded-3xl border border-border bg-card shadow-floating p-2 sm:p-4 md:p-6 overflow-hidden relative">
        {/* Soft visual background glow */}
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-accent/5 dark:bg-accent/10 blur-3xl pointer-events-none" />
        <ProgrammaticToolRenderer
          toolPath={page.toolPath}
          defaultSubTool={page.defaultSubTool}
        />
      </section>

      {/* ── COMPLIANCE & INFO GRID (Princeton GEO Compliance) ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        {/* Left Column: Security & Standards Reference */}
        <div className="rounded-2xl border border-border p-6 sm:p-8 bg-card/50 backdrop-blur-sm space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Award className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-display font-bold text-foreground">
              Technical Verification & Standards
            </h2>
          </div>

          <div className="space-y-5">
            <div>
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5" />
                Citations & Regulatory Specs
              </h3>
              <ul className="space-y-2">
                {page.citations.map((cite, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-foreground/80 leading-relaxed font-medium pl-3 border-l-2 border-accent/40"
                  >
                    {cite}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                Audited Performance Stats
              </h3>
              <ul className="space-y-2.5">
                {page.stats.map((stat, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs text-foreground/80 leading-relaxed font-medium"
                  >
                    <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <span>{stat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Frequently Asked Questions */}
        <div className="rounded-2xl border border-border p-6 sm:p-8 bg-card/50 backdrop-blur-sm space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-display font-bold text-foreground">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-5">
            {page.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="space-y-1.5 pb-4 border-b border-border/40 last:border-b-0 last:pb-0"
              >
                <h3 className="text-sm font-bold text-foreground">
                  {faq.question}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CALLOUT ────────────────────────────────────── */}
      <section className="text-center py-6 border-t border-border/40">
        <Link
          href="/browser-tools"
          className="text-xs font-bold text-accent hover:underline flex items-center justify-center gap-1"
        >
          Explore All 101+ Local Browser Utilities →
        </Link>
      </section>
    </div>
  );
}
