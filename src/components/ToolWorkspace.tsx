"use client";

import { useState } from "react";
import { X, Sparkles, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ToolRegistry } from "./ToolRegistry";
import { getPrefillProps } from "@/lib/tool-prefill-registry";
import type { ToolTab } from "@/types/chat";

interface ToolWorkspaceProps {
  tabs: ToolTab[];
  activeTabId: string | null;
  onTabSelect: (id: string) => void;
  onTabClose: (id: string) => void;
}

// Category → emoji mapping for tab icons
const CATEGORY_EMOJI: Record<string, string> = {
  "Image Tools": "🖼️",
  "File Tools": "📄",
  "Media Tools": "🎬",
  "Text & Language Tools": "📝",
  "Data Tools": "📊",
  "Math & Finance Tools": "🧮",
  "Productivity Tools": "⚡",
  "Security & Development Tools": "🔐",
  "Design Tools": "🎨",
  "AI Tools": "🤖",
};

export default function ToolWorkspace({
  tabs,
  activeTabId,
  onTabSelect,
  onTabClose,
}: ToolWorkspaceProps) {
  const [showOverflow, setShowOverflow] = useState(false);

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? null;
  const ToolComponent = activeTab ? ToolRegistry[activeTab.href] : null;
  const prefillProps = activeTab
    ? getPrefillProps(activeTab.href, activeTab.params)
    : {};

  // Tabs to show in the bar vs overflow dropdown
  const visibleTabs = tabs.slice(0, 6);
  const overflowTabs = tabs.slice(6);

  if (tabs.length === 0) {
    return (
      <div className="flex flex-col h-full bg-background items-center justify-center gap-4 p-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/60 text-4xl">
          🛠️
        </div>
        <div className="text-center space-y-1.5">
          <h3 className="text-sm font-bold text-foreground">No tool open yet</h3>
          <p className="text-xs text-muted-foreground max-w-[260px] leading-relaxed">
            Ask BigWowAI on the left to open a tool — try{" "}
            <span className="font-semibold text-accent">"calculate 20 × 500"</span> or{" "}
            <span className="font-semibold text-accent">"compress a PDF"</span>.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {["🖼️ Remove background", "📄 PDF tools", "🧮 Calculator", "📊 Charts"].map((ex) => (
            <span
              key={ex}
              className="px-2.5 py-1 rounded-full bg-secondary/60 border border-border/40 text-[10px] font-medium text-muted-foreground"
            >
              {ex}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* ── Tab Bar ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-0 border-b border-border/60 bg-card shrink-0 overflow-hidden">
        {/* Tabs */}
        <div
          className="flex items-stretch overflow-x-auto flex-1 scrollbar-none"
          style={{ scrollbarWidth: "none" }}
        >
          {visibleTabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            const emoji = CATEGORY_EMOJI[tab.category] ?? "🔧";
            return (
              <div
                key={tab.id}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium cursor-pointer border-b-2 transition-all duration-150 select-none whitespace-nowrap shrink-0 group relative",
                  isActive
                    ? "border-b-accent text-foreground bg-background"
                    : "border-b-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/40 bg-card"
                )}
                onClick={() => onTabSelect(tab.id)}
              >
                <span className="text-sm leading-none">{emoji}</span>
                <span className="max-w-[120px] truncate">{tab.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTabClose(tab.id);
                  }}
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-full transition-all ml-0.5",
                    isActive
                      ? "opacity-60 hover:opacity-100 hover:bg-secondary"
                      : "opacity-0 group-hover:opacity-60 hover:opacity-100 hover:bg-secondary"
                  )}
                  aria-label={`Close ${tab.name}`}
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Overflow dropdown */}
        {overflowTabs.length > 0 && (
          <div className="relative shrink-0">
            <button
              onClick={() => setShowOverflow((v) => !v)}
              className="flex items-center gap-1 px-3 py-2.5 text-xs text-muted-foreground hover:text-foreground transition-colors border-l border-border/40"
            >
              <span className="font-medium">+{overflowTabs.length}</span>
              <ChevronDown className={cn("h-3 w-3 transition-transform", showOverflow && "rotate-180")} />
            </button>
            {showOverflow && (
              <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-xl border border-border bg-card shadow-xl py-1">
                {overflowTabs.map((tab) => {
                  const emoji = CATEGORY_EMOJI[tab.category] ?? "🔧";
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        onTabSelect(tab.id);
                        setShowOverflow(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-secondary/60 transition-colors"
                    >
                      <span>{emoji}</span>
                      <span className="truncate">{tab.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Privacy badge */}
        <div className="hidden sm:flex items-center gap-1 px-3 text-[10px] font-bold text-accent shrink-0 border-l border-border/40">
          <Sparkles className="h-3 w-3" />
          <span>100% Private</span>
        </div>
      </div>

      {/* ── Tool Workspace ───────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto bg-background/60">
        {activeTab && (
          <div className="w-full h-full p-4 sm:p-6">
            <div className="w-full max-w-5xl mx-auto">
              {ToolComponent ? (
                <ToolComponent {...(prefillProps as Record<string, unknown>)} />
              ) : (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="text-4xl">🚧</div>
                  <div className="text-center">
                    <h3 className="text-sm font-bold text-foreground">Tool workspace loading</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      The <strong>{activeTab.name}</strong> component is not registered yet.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
