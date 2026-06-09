import Link from "next/link";
import { programmaticPages } from "@/lib/programmatic-seo-config";
import { generatePageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata(
  "Privacy-First Tool Guides & Comparisons — BigWow",
  "Guides answering privacy questions about online tools. Learn which tools upload your files and which work 100% locally in your browser.",
  "/x"
);

const geoPages = programmaticPages.filter((p) => p.type === "geo" || !p.type);
const competitorPages = programmaticPages.filter((p) => p.type === "competitor");

export default function XHubPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Hero */}
      <div className="mb-12 text-center">
        <span className="inline-block bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
          Privacy Guides
        </span>
        <h1 className="text-4xl font-bold mb-4">
          Tools That Never Upload Your Files
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Every tool on BigWow runs locally in your browser — zero uploads, zero
          server processing, 100% private. These guides explain exactly how and why.
        </p>
      </div>

      {/* GEO FAQ Pages Section */}
      <section className="mb-14">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
          Privacy &amp; Local Processing Guides
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {geoPages.map((page) => (
            <Link
              key={page.slug}
              href={`/x/${page.slug}`}
              className="group block border rounded-lg p-4 hover:border-primary hover:bg-primary/5 transition-all"
            >
              <h3 className="font-medium text-sm mb-1 group-hover:text-primary transition-colors line-clamp-2">
                {page.h1}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {page.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Competitor Alternative Pages Section */}
      {competitorPages.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
            Private Alternatives to Popular Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {competitorPages.map((page) => (
              <Link
                key={page.slug}
                href={`/x/${page.slug}`}
                className="group block border rounded-lg p-4 hover:border-primary hover:bg-primary/5 transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium">
                    vs {page.competitorName}
                  </span>
                </div>
                <h3 className="font-medium text-sm mb-1 group-hover:text-primary transition-colors line-clamp-2">
                  {page.h1}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {page.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
