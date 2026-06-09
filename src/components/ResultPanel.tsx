"use client";

import { Sparkles, ArrowLeft } from "lucide-react";

interface ResultPanelProps {
  query: string;
  toolName: string;
  toolCategory: string;
  onReset: () => void;
  children: React.ReactNode;
}

export default function ResultPanel({
  toolName,
  toolCategory,
  onReset,
  children
}: ResultPanelProps) {
  return (
    <div className="flex flex-col gap-4 w-full min-h-[calc(100vh-140px)] animate-slide-up">
      
      {/* Back Button and Tool Header */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/60 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            aria-label="Back to home"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-foreground leading-none">{toolName}</h2>
            <span className="text-[10px] text-muted-foreground">{toolCategory}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-accent flex items-center gap-1.5 bg-accent/5 px-2.5 py-1 rounded-full">
            <Sparkles className="h-3 w-3" />
            100% Client-Side
          </span>
        </div>
      </div>

      {/* Full Screen Workspace */}
      <div className="w-full flex-1 flex flex-col">
        <section className="flex flex-col rounded-2xl border border-border bg-card shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden h-full flex-1">
          {/* Mount Child Page Component Workspace */}
          <div className="flex-1 bg-background/50 p-4 sm:p-6 overflow-y-auto">
            <div className="w-full max-w-4xl mx-auto">
              {children}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
