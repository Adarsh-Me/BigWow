import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  programmaticPages,
  type ProgrammaticPageConfig,
} from "@/lib/programmatic-seo-config";
import { absoluteUrl, siteConfig } from "@/lib/site";

// ── Static params (SSG) ─────────────────────────────────────────────────────
export function generateStaticParams() {
  return programmaticPages.map((p) => ({ slug: p.slug }));
}

// ── Metadata ────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = programmaticPages.find((p) => p.slug === slug);
  if (!page) return {};

  const pageUrl = absoluteUrl(`/x/${page.slug}`);

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    authors: [{ name: "BigWow" }],
    creator: "BigWow",
    publisher: "BigWow",
    alternates: { canonical: pageUrl },
    openGraph: {
      type: "article",
      url: pageUrl,
      title: page.title,
      description: page.description,
      siteName: siteConfig.name,
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: ["/og-image.png"],
      creator: "@bigwow",
      site: "@bigwow",
    },
  };
}

// ── JSON-LD helpers ──────────────────────────────────────────────────────────
function buildFaqSchema(page: ProgrammaticPageConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

function buildBreadcrumbSchema(page: ProgrammaticPageConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Guides", item: absoluteUrl("/x") },
      { "@type": "ListItem", position: 3, name: page.h1, item: absoluteUrl(`/x/${page.slug}`) },
    ],
  };
}

// ── Page Component ───────────────────────────────────────────────────────────
export default async function ProgrammaticPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = programmaticPages.find((p) => p.slug === slug);
  if (!page) notFound();

  const isCompetitor = page.type === "competitor";

  // Resolve related pages for internal linking
  const relatedPages = (page.relatedSlugs ?? [])
    .map((s) => programmaticPages.find((p) => p.slug === s))
    .filter(Boolean) as ProgrammaticPageConfig[];

  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqSchema(page)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbSchema(page)) }}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/x" className="hover:text-foreground transition-colors">Guides</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-foreground truncate max-w-[200px]">{page.h1}</li>
        </ol>
      </nav>

      {/* Hero */}
      <header className="mb-10">
        {isCompetitor && page.competitorName && (
          <span className="inline-block bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            vs {page.competitorName}
          </span>
        )}
        {!isCompetitor && (
          <span className="inline-block bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Privacy Guide
          </span>
        )}
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
          {page.h1}
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {page.intro}
        </p>
      </header>

      {/* Stat pills */}
      {page.stats.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-10">
          {page.stats.map((stat, i) => (
            <div
              key={i}
              className="flex items-start gap-2 bg-muted/60 rounded-lg px-4 py-2 text-sm max-w-sm"
            >
              <span className="text-primary mt-0.5 shrink-0" aria-hidden="true">✓</span>
              <span>{stat}</span>
            </div>
          ))}
        </div>
      )}

      {/* Competitor comparison table */}
      {isCompetitor && page.comparisonTable && page.comparisonTable.length > 0 && (
        <section className="mb-10" aria-label={`BigWow vs ${page.competitorName} comparison`}>
          <h2 className="text-xl font-semibold mb-4">
            BigWow vs {page.competitorName} — Feature Comparison
          </h2>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b">
                  <th className="text-left px-4 py-3 font-semibold">Feature</th>
                  <th className="px-4 py-3 font-semibold text-center text-primary">
                    BigWow
                  </th>
                  <th className="px-4 py-3 font-semibold text-center text-muted-foreground">
                    {page.competitorName}
                  </th>
                </tr>
              </thead>
              <tbody>
                {page.comparisonTable.map((row, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium">{row.feature}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 font-medium ${row.bigwowPass ? "text-green-600 dark:text-green-400" : "text-destructive"}`}>
                        <span aria-hidden="true">{row.bigwowPass ? "✓" : "✗"}</span>
                        {row.bigwow}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 font-medium ${row.competitorPass ? "text-green-600 dark:text-green-400" : "text-destructive"}`}>
                        <span aria-hidden="true">{row.competitorPass ? "✓" : "✗"}</span>
                        {row.competitor}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* FAQ Accordion */}
      {page.faqs.length > 0 && (
        <section className="mb-10" aria-label="Frequently asked questions">
          <h2 className="text-xl font-semibold mb-5">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {page.faqs.map((faq, i) => (
              <details
                key={i}
                className="group border rounded-lg overflow-hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 font-medium hover:bg-muted/40 transition-colors list-none">
                  <span>{faq.question}</span>
                  <span className="ml-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true">
                    ▾
                  </span>
                </summary>
                <div className="px-5 py-4 border-t text-muted-foreground leading-relaxed text-sm">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Citations */}
      {page.citations.length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Sources &amp; References
          </h2>
          <ol className="list-decimal list-inside space-y-1 text-xs text-muted-foreground">
            {page.citations.map((citation, i) => (
              <li key={i}>{citation}</li>
            ))}
          </ol>
        </section>
      )}

      {/* CTA */}
      <div className="rounded-xl border bg-primary/5 border-primary/20 p-6 mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div>
          <p className="font-semibold text-base mb-1">
            Try it now — 100% free, zero upload
          </p>
          <p className="text-sm text-muted-foreground">
            No account, no ads, no file size limits. Opens instantly in your browser.
          </p>
        </div>
        <Link
          href={page.toolPath}
          className="shrink-0 inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors"
          id={`cta-open-tool-${page.slug}`}
        >
          Open Tool →
        </Link>
      </div>

      {/* Related pages — internal linking */}
      {relatedPages.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            More Private Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {relatedPages.map((related) => (
              <Link
                key={related.slug}
                href={`/x/${related.slug}`}
                className="group block border rounded-lg p-3 text-sm hover:border-primary hover:bg-primary/5 transition-all"
              >
                <span className="font-medium group-hover:text-primary transition-colors line-clamp-2 text-xs">
                  {related.h1}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
