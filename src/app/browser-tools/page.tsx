"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { tools as allCategories, getAllTools } from "@/lib/tools-config";
import { ArrowLeft, Search, Sparkles, Heart, ChevronRight, ArrowUp, Compass, Menu } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import MegaMenu from "@/components/mega-menu";
import MobileNavDrawer from "@/components/mobile-nav-drawer";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useLanguageStore } from "@/store/language-store";
import { expandSubTools, type SubTool } from "@/lib/sub-tools-config";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type ExpandedItem =
  | (typeof allCategories)[number]["items"][number]
  | (SubTool & { href: string; parentHref: string });

function getItemName(item: ExpandedItem): string {
  if ("desc" in item && !("description" in item)) return item.name;
  return (item as { name: string }).name;
}

function getItemDesc(item: ExpandedItem): string {
  if ("desc" in item && !("description" in item)) return item.desc;
  return (item as { description: string }).description;
}

// Locally defined metadata to keep styling beautiful and consistent with the homepage
const CATEGORY_STYLES: Record<string, {
  bg: string;
  iconBg: string;
  iconColor: string;
  displayName: string;
  shortDesc: string;
}> = {
  "Image Tools": {
    bg: "bg-blue-50/50 dark:bg-blue-950/10 border-blue-100/50 dark:border-blue-900/20",
    iconBg: "bg-blue-100 dark:bg-blue-950/30",
    iconColor: "text-blue-500",
    displayName: "Image Tools",
    shortDesc: "Edit, convert, enhance and optimise images.",
  },
  "File Tools": {
    bg: "bg-red-50/50 dark:bg-red-950/10 border-red-100/50 dark:border-red-900/20",
    iconBg: "bg-red-100 dark:bg-red-950/30",
    iconColor: "text-red-500",
    displayName: "PDF Tools",
    shortDesc: "Create, convert, merge, split and secure PDFs.",
  },
  "Media Tools": {
    bg: "bg-violet-50/50 dark:bg-violet-950/10 border-violet-100/50 dark:border-violet-900/20",
    iconBg: "bg-violet-100 dark:bg-violet-950/30",
    iconColor: "text-violet-500",
    displayName: "Video Tools",
    shortDesc: "Edit, trim, convert and work with videos.",
  },
  "Audio Tools": {
    bg: "bg-orange-50/50 dark:bg-orange-950/10 border-orange-100/50 dark:border-orange-900/20",
    iconBg: "bg-orange-100 dark:bg-orange-950/30",
    iconColor: "text-orange-500",
    displayName: "Audio Tools",
    shortDesc: "Edit audio, test mic, and analyse sound.",
  },
  "Text & Language Tools": {
    bg: "bg-sky-50/50 dark:bg-sky-950/10 border-sky-100/50 dark:border-sky-900/20",
    iconBg: "bg-sky-100 dark:bg-sky-950/30",
    iconColor: "text-sky-600",
    displayName: "Text & Writing",
    shortDesc: "Transform, optimise and analyse text easily.",
  },
  "Data Tools": {
    bg: "bg-amber-50/50 dark:bg-amber-950/10 border-amber-100/50 dark:border-amber-900/20",
    iconBg: "bg-amber-100 dark:bg-amber-950/30",
    iconColor: "text-amber-600",
    displayName: "Data & Conversion",
    shortDesc: "Convert, decode and visualise data.",
  },
  "Math & Finance Tools": {
    bg: "bg-indigo-50/50 dark:bg-indigo-950/10 border-indigo-100/50 dark:border-indigo-900/20",
    iconBg: "bg-indigo-100 dark:bg-indigo-950/30",
    iconColor: "text-indigo-600",
    displayName: "Math & Finance",
    shortDesc: "Calculators, converters and financial trackers.",
  },
  "Productivity Tools": {
    bg: "bg-pink-50/50 dark:bg-pink-950/10 border-pink-100/50 dark:border-pink-900/20",
    iconBg: "bg-pink-100 dark:bg-pink-950/30",
    iconColor: "text-pink-500",
    displayName: "Productivity",
    shortDesc: "Timers, planners, clocks and habits.",
  },
  "Security & Development Tools": {
    bg: "bg-teal-50/50 dark:bg-teal-950/10 border-teal-100/50 dark:border-teal-900/20",
    iconBg: "bg-teal-100 dark:bg-teal-950/30",
    iconColor: "text-teal-600",
    displayName: "Security & Dev",
    shortDesc: "Secure, protect and analyse your data.",
  },
  "Design Tools": {
    bg: "bg-rose-50/50 dark:bg-rose-950/10 border-rose-100/50 dark:border-rose-900/20",
    iconBg: "bg-rose-100 dark:bg-rose-950/30",
    iconColor: "text-rose-500",
    displayName: "Design & Utility",
    shortDesc: "Colours, generators, viewers and utilities.",
  },
  "AI Tools": {
    bg: "bg-purple-50/50 dark:bg-purple-950/10 border-purple-100/50 dark:border-purple-900/20",
    iconBg: "bg-purple-100 dark:bg-purple-950/30",
    iconColor: "text-purple-600",
    displayName: "AI Tools",
    shortDesc: "AI utilities, prompts, generators & more.",
  }
};

export default function BrowserToolsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { dir } = useLanguageStore();

  useEffect(() => {
    setMounted(true);
    const favs = localStorage.getItem("browsery-favorites");
    if (favs) {
      try {
        setFavorites(JSON.parse(favs));
      } catch (e) {
        console.error(e);
      }
    }

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);

    // Auto-scroll to selected tool card and highlight it!
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const scrollTarget = urlParams.get("scroll");
      if (scrollTarget) {
        setTimeout(() => {
          const el = document.getElementById(`tool-${scrollTarget}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            // Add a beautiful glowing highlight focus ring
            el.classList.add("ring-2", "ring-accent", "dark:ring-accent", "ring-offset-2", "dark:ring-offset-slate-950");
            setTimeout(() => {
              el.classList.remove("ring-2", "ring-accent", "dark:ring-accent", "ring-offset-2", "dark:ring-offset-slate-950");
            }, 2500);
          }
        }, 600);
      }

      // Smooth scroll to category section hash if present in URL
      const hashId = window.location.hash.substring(1);
      if (hashId) {
        setTimeout(() => {
          const el = document.getElementById(hashId);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 650);
      }
    }

    const handlePointerMove = (e: PointerEvent) => {
      const cards = document.querySelectorAll(".proximity-card");
      cards.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const rect = htmlEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
        
        const threshold = 220; 
        const proximity = Math.max(0, 1 - dist / threshold); // 0 to 1
        
        if (proximity > 0) {
          htmlEl.style.transform = `scale(${1 + proximity * 0.04})`;
          htmlEl.style.filter = `brightness(${1 - proximity * 0.03})`;
          htmlEl.style.borderColor = `rgba(99, 102, 241, ${0.05 + proximity * 0.35})`;
          htmlEl.style.zIndex = "10";
          htmlEl.style.transition = "transform 0.1s ease-out, filter 0.1s ease-out, border-color 0.1s ease-out";
        } else {
          htmlEl.style.transform = "";
          htmlEl.style.filter = "";
          htmlEl.style.borderColor = "";
          htmlEl.style.zIndex = "";
          htmlEl.style.transition = "";
        }
      });
    };

    const handlePointerLeave = () => {
      document.querySelectorAll(".proximity-card").forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.transform = "";
        htmlEl.style.filter = "";
        htmlEl.style.borderColor = "";
        htmlEl.style.zIndex = "";
        htmlEl.style.transition = "";
      });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  const toggleFavorite = (href: string) => {
    let next: string[];
    if (favorites.includes(href)) {
      next = favorites.filter((h) => h !== href);
    } else {
      next = [...favorites, href];
    }
    setFavorites(next);
    localStorage.setItem("browsery-favorites", JSON.stringify(next));
  };

  const isFavorite = (href: string) => favorites.includes(href);

  // Grouped active tools filtered by search query
  const filteredGroups = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    
    return allCategories
      .map((cat) => {
        const filteredItems = cat.items.filter((item) => {
          if (!item.available) return false;
          if (!q) return true;
          return (
            item.name.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q)
          );
        });

        return {
          ...cat,
          styles: CATEGORY_STYLES[cat.category] ?? {
            bg: "bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800",
            iconBg: "bg-slate-100 dark:bg-slate-800",
            iconColor: "text-slate-500",
            displayName: cat.category,
            shortDesc: "Explore browser tools.",
          },
          items: filteredItems,
        };
      })
      .filter((cat) => cat.items.length > 0)
      .sort((a, b) => a.order - b.order);
  }, [searchQuery]);

  const totalToolCount = useMemo(() => {
    return allCategories.reduce((acc, cat) => acc + cat.items.filter(t => t.available).length, 0);
  }, []);

  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const springTransition = {
    type: "spring" as const,
    stiffness: 200,
    damping: 25
  };

  return (
    <div className="min-h-screen bg-background text-foreground select-none pb-20">
      
      {/* ── HEADER NAVIGATION ────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full border-b border-border glass-strong shadow-floating transition-all duration-200">
        <div className="flex h-16 items-center px-4 md:px-8 max-w-[1400px] mx-auto gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="xl:hidden hover:bg-secondary/60 rounded-xl h-9 w-9 shrink-0"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5 text-foreground" />
              </Button>
            </SheetTrigger>
            <SheetContent side={dir === "rtl" ? "right" : "left"} className="w-80 p-0 border-r border-border bg-card">
              <SheetTitle className="sr-only">Tools navigation</SheetTitle>
              <MobileNavDrawer />
            </SheetContent>
          </Sheet>

          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/60 hover:bg-secondary/60 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all duration-150 active:scale-98 shrink-0"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Back to Home
          </Link>

          <Link href="/" className="flex items-center gap-2.5 active:scale-98 transition-transform shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-sm shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-display text-sm font-bold tracking-tight text-foreground">
              BigWow
            </span>
          </Link>

          <div className="hidden xl:flex flex-1 justify-center min-w-0">
            <MegaMenu />
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-auto">
            <ThemeSwitcher className="h-9 w-9 hover:bg-secondary/60 rounded-xl" />
          </div>
        </div>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springTransition}
        className="max-w-[1400px] mx-auto px-4 md:px-8 py-10 space-y-12"
      >
        
        {/* ── HERO BANNER ─────────────────────────────────────── */}
        <section className="text-center space-y-4 max-w-3xl mx-auto py-4 relative overflow-visible">
          {/* Floating abstract decorative icons (Figures without bg) */}
          <div className="absolute -left-12 top-6 text-accent/30 dark:text-accent/20 animate-float hidden md:block select-none pointer-events-none">
            <Sparkles className="h-10 w-10" />
          </div>
          <div className="absolute -right-12 bottom-6 text-teal-400/30 dark:text-teal-400/20 animate-float [animation-delay:2s] hidden md:block select-none pointer-events-none">
            <Compass className="h-10 w-10" />
          </div>
          {/* Soft background radial glows */}
          <div className="absolute -left-20 top-0 h-40 w-40 rounded-full bg-accent/10 dark:bg-accent/25 blur-3xl opacity-60 pointer-events-none animate-pulse-slow" />
          <div className="absolute -right-20 bottom-0 h-40 w-40 rounded-full bg-teal-400/10 dark:bg-teal-950/20 blur-3xl opacity-60 pointer-events-none animate-pulse-slow [animation-delay:3.5s]" />

          <div className="inline-flex items-center gap-2 rounded-full bg-foreground/5 dark:bg-foreground/10 border border-border/40 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-foreground">
            <Compass className="h-3.5 w-3.5 text-muted-foreground/60" />
            Explore All Tools
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tighter text-foreground leading-[0.9]">
            Browser Tools ({totalToolCount})
          </h1>
          <p className="text-md text-muted-foreground leading-relaxed font-medium">
            100% private, serverless, client-side tools running securely inside your browser. No files are uploaded to any server. Grouped cleanly by category.
          </p>
        </section>

        {/* ── INTERACTIVE CONTROLS (SEARCH & INDEX) ───────────── */}
        <section className="space-y-6 max-w-4xl mx-auto">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across all 101+ tools..."
              className="w-full h-14 rounded-2xl border border-border glass pl-12 pr-6 text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all font-medium placeholder:text-muted-foreground/50 shadow-floating"
            />
          </div>

          {/* Quick links category pills */}
          {!searchQuery.trim() && (
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {allCategories
                .filter((cat) => cat.items.filter(t => t.available).length > 0)
                .sort((a, b) => a.order - b.order)
                .map((cat) => {
                  const style = CATEGORY_STYLES[cat.category] ?? { iconBg: "bg-slate-100", iconColor: "text-slate-500" };
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleScrollToSection(cat.id)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-border glass text-xs font-semibold text-muted-foreground hover:border-foreground hover:text-foreground transition-all shadow-floating active:scale-98"
                    >
                      <span className={cn("h-1.5 w-1.5 rounded-full", style.iconColor, "bg-current")} />
                      {style.displayName}
                      <span className="text-[10px] text-muted-foreground bg-foreground/5 px-1.5 py-0.5 rounded-full ml-1 font-outlier">
                        {cat.items.filter(t => t.available).length}
                      </span>
                    </button>
                  );
                })}
            </div>
          )}
        </section>

        {/* ── GROUPED LIST OF TOOLS ───────────────────────────── */}
        <section className="space-y-12">
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group) => {
              const { styles } = group;
              return (
                <div 
                  key={group.id} 
                  id={group.id}
                  className="rounded-3xl border border-border p-6 md:p-8 space-y-6 glass shadow-floating transition-colors duration-200 relative z-10"
                >
                  {/* Category Header */}
                  <div className="flex items-start gap-4 pb-4 border-b border-border/40">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-foreground/5 dark:bg-foreground/10 text-foreground border border-border/40 shadow-sm transition-transform duration-300">
                      {(() => {
                        const styleMeta = allCategories.find(c => c.category === group.category);
                        const Icon = styleMeta?.items[0]?.icon ?? Compass; // Get icon from first tool as fallback
                        return <Icon className="h-6 w-6 text-foreground" />;
                      })()}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <h2 className="text-xl font-display font-extrabold text-foreground tracking-tight">{styles.displayName}</h2>
                      <p className="text-xs text-muted-foreground font-semibold leading-relaxed">{styles.shortDesc}</p>
                    </div>
                    <span className="ml-auto text-[11px] font-bold px-2.5 py-1 rounded-full bg-foreground/5 dark:bg-foreground/10 text-foreground border border-border/40">
                      {expandSubTools(group.items).length} tools
                    </span>
                  </div>

                  {/* Grid of tool cards (sub-tools expanded inline) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
                    {expandSubTools(group.items).map((item) => {
                      const ToolIcon = item.icon;
                      const favorited = isFavorite(item.href);
                      const available = "available" in item ? item.available : true;
                      const itemId = item.href.replace("/tools/", "").replace(/\?.*$/, "");
                      return (
                        <div
                          key={item.href}
                          id={`tool-${itemId}`}
                          className="relative group select-none"
                        >
                          <Link
                            href={available ? item.href : "#"}
                            className={cn(
                              "flex items-center gap-3.5 rounded-2xl premium-card p-4 pr-12 cursor-pointer w-full text-left transition-all active:scale-[0.985]",
                              !available && "opacity-60 pointer-events-none"
                            )}
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-foreground/5 dark:bg-foreground/10 text-foreground border border-border/40 transition-all duration-300 group-hover:scale-105">
                              <ToolIcon className="h-4.5 w-4.5 text-foreground" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-[12.5px] font-extrabold text-foreground truncate leading-snug group-hover:text-accent transition-colors font-sans">
                                {getItemName(item)}
                              </div>
                              <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1 leading-snug font-medium font-sans">
                                {getItemDesc(item)}
                              </p>
                            </div>
                          </Link>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleFavorite(item.href);
                            }}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-foreground/5 transition-colors shrink-0 z-20"
                            aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
                          >
                            <Heart
                              className={cn(
                                "h-3.5 w-3.5 transition-colors",
                                favorited
                                  ? "text-red-500 fill-red-500"
                                  : "text-muted-foreground/35 group-hover:text-red-300"
                              )}
                            />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 rounded-3xl border border-dashed border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/20 space-y-3">
              <Search className="h-8 w-8 mx-auto text-slate-300 dark:text-slate-700" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">No tools found matching &ldquo;{searchQuery}&rdquo;</p>
              <button 
                onClick={() => setSearchQuery("")}
                className="text-xs text-accent font-bold hover:underline"
              >
                Clear Search
              </button>
            </div>
          )}
        </section>
      </motion.main>

      {/* Floating Scroll to Top button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 p-3.5 rounded-full bg-accent hover:bg-accent/80 text-accent-foreground shadow-xl hover:scale-105 active:scale-95 transition-all duration-150"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-4.5 w-4.5" />
        </button>
      )}
    </div>
  );
}
