"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { tools } from "@/lib/tools-config";
import { expandSubTools, type SubTool } from "@/lib/sub-tools-config";
import { useLanguageStore } from "@/store/language-store";
import { cn } from "@/lib/utils";

type ExpandedItem =
  | (typeof tools)[number]["items"][number]
  | (SubTool & { href: string; parentHref: string });

function getItemName(item: ExpandedItem, tc: ReturnType<typeof useTranslations>): string {
  if ("desc" in item && !("description" in item)) {
    return item.name;
  }
  const toolItem = item as { href: string };
  const toolId = toolItem.href.replace("/tools/", "");
  return tc(`tools.${toolId}.name` as any);
}

function getItemDesc(item: ExpandedItem, tc: ReturnType<typeof useTranslations>): string {
  if ("desc" in item && !("description" in item)) {
    return item.desc;
  }
  const toolItem = item as { href: string };
  const toolId = toolItem.href.replace("/tools/", "");
  return tc(`tools.${toolId}.description` as any);
}

function getItemIcon(item: ExpandedItem): any {
  return item.icon;
}

const OPEN_DELAY = 100;
const CLOSE_DELAY = 150;

// Group 12 categories into 6 main header dropdowns to avoid menu overflow
const groupedCategories = [
  {
    id: "fileTools",
    labelKey: "fileTools",
    categoryIds: ["fileTools"],
  },
  {
    id: "imageTools",
    labelKey: "imageTools",
    categoryIds: ["imageTools", "designTools"],
  },
  {
    id: "textLanguage",
    labelKey: "textLanguage",
    categoryIds: ["textLanguage"],
  },
  {
    id: "mediaTools",
    labelKey: "mediaTools",
    categoryIds: ["mediaTools", "audioTools", "mediaDownloaders"],
  },
  {
    id: "dataTools",
    labelKey: "dataTools",
    categoryIds: ["dataTools"],
  },
  {
    id: "moreTools",
    labelKey: "moreTools",
    categoryIds: ["aiTools", "mathFinance", "productivity", "securityDev", "devTools"],
  },
];

export default function MegaMenu() {
  const pathname = usePathname();
  const { dir } = useLanguageStore();
  const tc = useTranslations("ToolsConfig");

  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);

  const openTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map());

  const clearTimeouts = useCallback(() => {
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const closePanel = useCallback(
    (focusId?: string | null) => {
      clearTimeouts();
      setOpenCategoryId(null);
      if (focusId) {
        triggerRefs.current.get(focusId)?.focus();
      }
    },
    [clearTimeouts],
  );

  const cancelClose = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const scheduleOpen = useCallback(
    (categoryId: string) => {
      cancelClose();
      if (openCategoryId === categoryId) return;
      if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = setTimeout(() => {
        setOpenCategoryId(categoryId);
        openTimeoutRef.current = null;
      }, OPEN_DELAY);
    },
    [openCategoryId, cancelClose],
  );

  const scheduleClose = useCallback(() => {
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setOpenCategoryId(null);
      closeTimeoutRef.current = null;
    }, CLOSE_DELAY);
  }, []);

  useEffect(() => {
    if (!openCategoryId) return;
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".mega-menu-root")) {
        closePanel();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePanel(openCategoryId);
    };
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [openCategoryId, closePanel]);

  useEffect(() => {
    closePanel();
  }, [pathname, closePanel]);

  useEffect(() => () => clearTimeouts(), [clearTimeouts]);

  const handleCategoryClick = (categoryId: string) => {
    clearTimeouts();
    if (openCategoryId === categoryId) {
      closePanel();
    } else {
      setOpenCategoryId(categoryId);
    }
  };

  const handleCategoryKey = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    idx: number,
  ) => {
    const total = groupedCategories.length;
    let nextIdx: number | null = null;
    if (e.key === "ArrowRight") {
      nextIdx = dir === "rtl" ? (idx - 1 + total) % total : (idx + 1) % total;
    } else if (e.key === "ArrowLeft") {
      nextIdx = dir === "rtl" ? (idx + 1) % total : (idx - 1 + total) % total;
    }
    if (nextIdx !== null) {
      e.preventDefault();
      triggerRefs.current.get(groupedCategories[nextIdx].id)?.focus();
    }
  };

  const openGroup = openCategoryId
    ? groupedCategories.find((g) => g.id === openCategoryId) ?? null
    : null;

  const openGroupItems = useMemo(() => {
    if (!openGroup) return [];
    const matchingCats = tools.filter((c) => openGroup.categoryIds.includes(c.id));
    const allItems: typeof tools[number]["items"] = [];
    matchingCats.forEach((cat) => {
      allItems.push(...cat.items);
    });
    return allItems;
  }, [openGroup]);

  return (
    <div
      className="mega-menu-root flex items-center min-w-0 max-w-full"
      onMouseLeave={scheduleClose}
    >
      <div className="flex items-center gap-0.5 min-w-0 overflow-x-auto scrollbar-hide">
        {groupedCategories.map((group, idx) => {
          const isOpen = openCategoryId === group.id;
          const panelId = `mega-menu-panel-${group.id}`;
          return (
            <button
              key={group.id}
              ref={(el) => {
                triggerRefs.current.set(group.id, el);
              }}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onMouseEnter={() => {
                cancelClose();
                scheduleOpen(group.id);
              }}
              onClick={() => handleCategoryClick(group.id)}
              onKeyDown={(e) => handleCategoryKey(e, idx)}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0",
                isOpen
                  ? "text-accent"
                  : "text-foreground/80 hover:text-foreground",
              )}
            >
              {tc(`categories.${group.labelKey}` as any)}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {openGroup && (
          <motion.div
            key={openGroup.id}
            id={`mega-menu-panel-${openGroup.id}`}
            role="region"
            aria-label={tc(`categories.${openGroup.labelKey}` as any)}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="mega-menu-panel absolute top-full start-0 end-0 z-50 bg-popover border-t border-border/60 shadow-2xl shadow-black/10"
            onMouseEnter={cancelClose}
          >
            <div className="p-4 md:p-8 max-w-[1400px] mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-8">
                {/* Highlighted Top 4 tools of the group */}
                <div className="grid grid-cols-2 gap-3">
                  {expandSubTools(
                    openGroupItems.slice().sort((a, b) => a.order - b.order),
                  )
                    .slice(0, 4)
                    .map((item) => {
                      const Icon = getItemIcon(item);
                      const available = "available" in item ? item.available : true;
                      return (
                        <Link
                          key={item.href}
                          href={available ? item.href : "#"}
                          onClick={() => closePanel()}
                          className={cn(
                            "premium-card flex items-start gap-3 p-3 rounded-xl group",
                            !available && "opacity-60 pointer-events-none",
                          )}
                        >
                          <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground line-clamp-1">
                              {getItemName(item, tc)}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {getItemDesc(item, tc)}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                </div>

                {/* Sublist of the remaining tools in the group */}
                <div>
                  {(() => {
                    const expanded = expandSubTools(
                      openGroupItems.slice().sort((a, b) => a.order - b.order),
                    );
                    if (expanded.length <= 4) {
                      return (
                        <Link
                          href={`/browser-tools#${openGroup.categoryIds[0]}`}
                          onClick={() => closePanel()}
                          className="text-sm font-semibold text-accent hover:text-accent/80 inline-flex items-center gap-1.5"
                        >
                          {tc("allCategoryTools", { category: tc(`categories.${openGroup.labelKey}` as any) })}
                          <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                        </Link>
                      );
                    }
                    return (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                          {expanded.slice(4, 16).map((item) => {
                            const available = "available" in item ? item.available : true;
                            return (
                              <Link
                                key={item.href}
                                href={available ? item.href : "#"}
                                onClick={() => closePanel()}
                                className={cn(
                                  "block text-sm text-foreground/85 hover:text-foreground transition-colors truncate",
                                  !available && "opacity-60 pointer-events-none",
                                )}
                              >
                                {getItemName(item, tc)}
                              </Link>
                            );
                          })}
                        </div>
                        <Link
                          href={`/browser-tools#${openGroup.categoryIds[0]}`}
                          onClick={() => closePanel()}
                          className="text-sm font-semibold text-accent hover:text-accent/80 inline-flex items-center gap-1.5 pt-2"
                        >
                          {tc("allCategoryTools", { category: tc(`categories.${openGroup.labelKey}` as any) })}
                          <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                        </Link>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
