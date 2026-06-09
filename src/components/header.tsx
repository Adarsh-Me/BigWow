"use client";

import { Button } from "./ui/button";
import { Hammer, Menu, Sparkles, Search, X } from "lucide-react";
import { useToolStore } from "@/store/tool-store";
import { useLanguageStore } from "@/store/language-store";
import Logo from "./logo";
import Link from "next/link";
import { useEffect, useState, useRef, useMemo } from "react";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import MobileNavDrawer from "./mobile-nav-drawer";
import MegaMenu from "./mega-menu";
import { ThemeSwitcher } from "./theme-switcher";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { searchAllTools } from "@/lib/search-utils";
import { cn } from "@/lib/utils";
import { RequestToolDialog } from "./RequestToolDialog";

export default function Header() {
  const pathname = usePathname();
  const { currentTool, setCurrentTool } = useToolStore();
  const { dir } = useLanguageStore();
  const t = useTranslations("Header");
  const tc = useTranslations("ToolsConfig");
  const tCommon = useTranslations("Common");

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!pathname.startsWith("/tools") && pathname !== "/") {
      setCurrentTool(null);
    }
  }, [pathname, setCurrentTool]);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Close search on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSearchQuery("");
      }
      // Cmd/Ctrl+K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchAllTools(searchQuery).slice(0, 8);
  }, [searchQuery]);



  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/85 backdrop-blur-md transition-all duration-200">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 max-w-[1600px] mx-auto gap-2">

        {/* Left Side: Brand Logo */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Mobile menu trigger */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-secondary/60 rounded-xl"
                  aria-label={t("openMenu")}
                >
                  <Menu className="h-5 w-5 text-foreground" />
                </Button>
              </SheetTrigger>
              <SheetContent side={dir === "rtl" ? "right" : "left"} className="w-80 p-0 border-r border-border bg-card">
                <MobileNavDrawer />
              </SheetContent>
            </Sheet>
          </div>

          <Link
            href="/"
            className="flex items-center gap-2.5 transition-transform duration-150 active:scale-98"
            aria-label="Go to homepage"
          >
            {currentTool ? (
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Logo />
                </div>
                <h1 className="text-sm font-semibold tracking-tight text-foreground font-display hidden sm:block">
                  {tc(`tools.${currentTool.href.replace("/tools/", "")}.name` as any)}
                </h1>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span className="font-display text-md font-bold tracking-tight text-foreground hidden sm:block">
                  {tCommon("siteName")}
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Center: Mega Menu (desktop) */}
        <div className="hidden lg:flex flex-1 justify-center min-w-0">
          <MegaMenu />
        </div>

        {/* Right Side: Search + Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">

          {/* Search button + overlay */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="h-9 w-9 hover:bg-secondary/60 rounded-xl text-muted-foreground hover:text-foreground"
              aria-label="Search tools"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Desktop Social Links & Switchers */}
          <div className="hidden md:flex items-center gap-1.5">
            <ThemeSwitcher className="h-9 w-9 hover:bg-secondary/60 rounded-xl" />
          </div>

          <div className="md:hidden flex items-center gap-1">
            <ThemeSwitcher variant="outline" className="h-8 w-8 rounded-lg" />
          </div>

          {/* CTAs */}
          <RequestToolDialog
            triggerClassName="hidden sm:inline-flex"
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex h-9 px-4 rounded-xl border-border hover:border-foreground/10 hover:bg-secondary/60 text-xs font-semibold tracking-tight transition-all active:scale-98"
              >
                <Hammer className="h-3.5 w-3.5 me-2 text-muted-foreground" />
                {t("requestTool")}
              </Button>
            }
          />
        </div>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm"
              onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
            />

            {/* Search modal */}
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4"
            >
              <div className="rounded-2xl border border-border/60 bg-popover shadow-2xl shadow-black/20 overflow-hidden">
                {/* Search input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border/40">
                  <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search tools…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                  />
                  <div className="flex items-center gap-1.5">
                    <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-border/50 bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
                      ESC
                    </kbd>
                    <button
                      onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Results */}
                {searchQuery.trim() ? (
                  <div className="max-h-80 overflow-y-auto py-1.5">
                    {searchResults.length > 0 ? (
                      searchResults.map((tool) => (
                        <Link
                          key={tool.href}
                          href={tool.available === false ? "#" : tool.href}
                          onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                          className={cn(
                            "flex items-center gap-3 px-4 py-2.5 transition-colors",
                            tool.available === false
                              ? "opacity-40 cursor-not-allowed pointer-events-none"
                              : "hover:bg-secondary/60 cursor-pointer"
                          )}
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                            <tool.icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{tool.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{tool.category}</p>
                          </div>
                          {tool.available === false && (
                            <span className="ml-auto text-[9px] font-bold bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 uppercase tracking-wider shrink-0">
                              Soon
                            </span>
                          )}
                        </Link>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                        No tools found for &ldquo;{searchQuery}&rdquo;
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                    Type to search across all tools…
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
