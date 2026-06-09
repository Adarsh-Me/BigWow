"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Footer() {
  const t = useTranslations("Tools.Footer");
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/40 bg-card select-none overflow-hidden transition-colors">
      <div className="mx-auto max-w-[1400px] px-6 md:px-8 py-14 md:py-18">
        
        {/* Main Grid: 4 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-6 pb-12 border-b border-border/40">
          
          {/* Column 1: Brand & Social */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <span className="font-display text-base font-bold tracking-tight text-foreground">
                BigWow
              </span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground leading-relaxed max-w-[220px]">
              100% Client-Side &bull; Private &bull; Offline-First
            </p>
          </div>

          {/* Column 2: Tools */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Tools
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/tools/text-counter", label: "Text Counter" },
                { href: "/tools/password-generator", label: "Password Generator" },
                { href: "/tools/qr-generator", label: "QR Generator" },
                { href: "/tools/image-compression", label: "Image Compressor" },
                { href: "/tools/base64", label: "Base64 Converter" },
                { href: "/tools/json-formatter", label: "JSON Formatter" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs font-semibold text-muted-foreground hover:text-accent transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Resources
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/blog", label: "Blog" },
                { href: "/", label: "All Tools" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs font-semibold text-muted-foreground hover:text-accent transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Contact
            </h4>
            <ul className="space-y-2">
              {[
                { href: "mailto:studio365@zohomail.in", label: "Support Email" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs font-semibold text-muted-foreground hover:text-accent transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section: Copyright */}
        <div className="relative pt-6 flex flex-wrap justify-between items-center gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
              &copy; {year} BigWow. Built with privacy in mind.
            </p>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-accent flex items-center gap-1.5 font-outlier">
            <Sparkles className="h-3 w-3" />
            <span>AI-Powered v2.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
