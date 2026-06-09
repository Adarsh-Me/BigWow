"use client";

import { useState, useRef } from "react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface NavSubItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  available?: boolean;
}

export interface NavItem {
  id: string;
  label: string;
  subMenus?: NavSubItem[];
  link?: string;
}

interface Props {
  navItems: NavItem[];
  className?: string;
}

export function DropdownNavigation({ navItems, className }: Props) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isHover, setIsHover] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMenuOpen = (menuLabel: string) => setOpenMenu(menuLabel);
  const handleMenuClose = () => setOpenMenu(null);

  return (
    <div
      ref={containerRef}
      className={cn("relative flex items-center gap-0.5", className)}
      onMouseLeave={handleMenuClose}
    >
      {navItems.map((item, index) => {
        const hasSubMenu = item.subMenus && item.subMenus.length > 0;
        const isOpen = openMenu === item.id;

        return (
          <div key={item.id} className="relative">
            {hasSubMenu ? (
              <button
                onMouseEnter={() => {
                  handleMenuOpen(item.id);
                  setIsHover(index);
                }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 outline-none",
                  "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
                  isOpen && "text-foreground bg-secondary/60"
                )}
              >
                {item.label}
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                />
              </button>
            ) : (
              <Link
                href={item.link ?? "#"}
                onMouseEnter={() => {
                  handleMenuClose();
                  setIsHover(index);
                }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150",
                  "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                )}
              >
                {item.label}
              </Link>
            )}

            <AnimatePresence>
              {isOpen && hasSubMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute top-[calc(100%+8px)] left-0 z-50 min-w-[220px] max-w-[260px]"
                >
                  {/* Arrow pointer */}
                  <div className="absolute -top-1.5 left-4 h-3 w-3 rotate-45 rounded-sm border-t border-l border-border/60 bg-popover z-10" />

                  <div className="relative overflow-hidden rounded-xl border border-border/60 bg-popover shadow-xl shadow-black/10 backdrop-blur-md">
                    <div className="py-1.5">
                      {item.subMenus!.map((sub, subIndex) => (
                        <Link
                          key={sub.href}
                          href={sub.available === false ? "#" : sub.href}
                          className={cn(
                            "group flex items-center gap-2.5 px-3.5 py-2 text-sm transition-colors duration-100",
                            sub.available === false
                              ? "opacity-40 cursor-not-allowed pointer-events-none"
                              : "hover:bg-secondary/70 text-muted-foreground hover:text-foreground cursor-pointer"
                          )}
                        >
                          {sub.icon && (
                            <sub.icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70 group-hover:text-accent transition-colors" />
                          )}
                          <span className="truncate font-medium">{sub.label}</span>
                          {sub.available === false && (
                            <span className="ml-auto text-[9px] font-bold bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 uppercase tracking-wider shrink-0">
                              Soon
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
