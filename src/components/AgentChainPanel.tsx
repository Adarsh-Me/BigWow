"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Circle,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Wrench,
  MessageSquare,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChainStep } from "@/types/agent";

interface AgentChainPanelProps {
  steps: ChainStep[];
  reasoning: string;
  currentIndex: number;
  onNext: () => void;
  onReset: () => void;
  children: React.ReactNode; // The active tool component
}

export default function AgentChainPanel({
  steps,
  reasoning,
  currentIndex,
  onNext,
  onReset,
  children,
}: AgentChainPanelProps) {
  const [activeMobileTab, setActiveMobileTab] = useState<"tool" | "steps">("tool");
  const isLastStep = currentIndex >= steps.length - 1;
  const currentStep = steps[currentIndex];
  const hasMultipleSteps = steps.length > 1;

  return (
    <div className="flex flex-col gap-3 w-full min-h-[calc(100vh-140px)] animate-slide-up">

      {/* ── AI Reasoning Banner ───────────────────────────────── */}
      <div className="flex items-start gap-3 rounded-2xl border border-accent/20 bg-accent/5 px-4 py-3">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent mt-0.5">
          <Sparkles className="h-3.5 w-3.5" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-accent mb-0.5">AI understood</p>
          <p className="text-sm text-foreground leading-relaxed">{reasoning}</p>
        </div>
        <button
          onClick={onReset}
          className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-accent transition-colors ml-auto"
          aria-label="Start over"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">New prompt</span>
        </button>
      </div>

      {/* ── Mobile Tab Bar (only shown when multiple steps) ──── */}
      {hasMultipleSteps && (
        <div className="lg:hidden flex items-center gap-1 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm">
          <button
            onClick={() => setActiveMobileTab("tool")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200",
              activeMobileTab === "tool"
                ? "bg-accent text-accent-foreground shadow-sm"
                : "text-muted-foreground hover:bg-secondary/60"
            )}
          >
            <Wrench className="h-3.5 w-3.5" />
            <span>{currentStep?.name ?? "Tool"}</span>
          </button>
          <button
            onClick={() => setActiveMobileTab("steps")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200",
              activeMobileTab === "steps"
                ? "bg-accent text-accent-foreground shadow-sm"
                : "text-muted-foreground hover:bg-secondary/60"
            )}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Steps ({currentIndex + 1}/{steps.length})</span>
          </button>
        </div>
      )}

      {/* ── Main Grid ─────────────────────────────────────────── */}
      <div
        className={cn(
          "grid gap-4 w-full flex-1",
          hasMultipleSteps ? "grid-cols-1 lg:grid-cols-[260px_1fr]" : "grid-cols-1"
        )}
      >
        {/* ── Left: Chain Stepper (hidden on mobile unless tab active) ── */}
        {hasMultipleSteps && (
          <aside
            className={cn(
              "flex-col rounded-2xl border border-border bg-card shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden",
              activeMobileTab === "steps" ? "flex" : "hidden lg:flex"
            )}
          >
            {/* Header */}
            <div className="p-4 border-b border-border/40 bg-secondary/15">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Tool Chain
              </h3>
              <p className="text-[11px] text-muted-foreground/70 mt-0.5">
                {steps.length} tools selected
              </p>
            </div>

            {/* Step List */}
            <div className="flex-1 p-4 space-y-2">
              {steps.map((step, idx) => {
                const isActive = idx === currentIndex;
                const isDone = step.status === "done";
                const isPending = step.status === "pending";

                return (
                  <div
                    key={step.href}
                    className={cn(
                      "flex items-start gap-3 rounded-xl p-3 transition-all duration-200",
                      isActive
                        ? "bg-accent/8 border border-accent/20"
                        : isDone
                        ? "bg-secondary/30 border border-border/30"
                        : "border border-transparent opacity-50"
                    )}
                  >
                    {/* Status Icon */}
                    <div className="shrink-0 mt-0.5">
                      {isDone ? (
                        <CheckCircle2 className="h-5 w-5 text-accent" />
                      ) : isActive ? (
                        <Loader2 className="h-5 w-5 text-accent animate-spin" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground/40" />
                      )}
                    </div>

                    {/* Step Info */}
                    <div className="min-w-0">
                      <div
                        className={cn(
                          "text-xs font-bold leading-snug",
                          isActive
                            ? "text-accent"
                            : isDone
                            ? "text-foreground"
                            : "text-muted-foreground/60"
                        )}
                      >
                        {step.name}
                      </div>
                      <div className="text-[10px] text-muted-foreground/60 mt-0.5">
                        Step {idx + 1}
                        {isDone && " — Done"}
                        {isActive && " — Active"}
                        {isPending && " — Waiting"}
                      </div>
                      <div className="text-[10px] text-muted-foreground/50 truncate">
                        {step.category}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Back button */}
            <div className="p-3 border-t border-border/40">
              <button
                onClick={onReset}
                className="flex w-full items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-accent transition-colors px-3 py-2 rounded-xl hover:bg-secondary/40"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Start new prompt
              </button>
            </div>
          </aside>
        )}

        {/* ── Right: Active Tool Workspace ───────────────────── */}
        <section
          className={cn(
            "flex flex-col rounded-2xl border border-border bg-card shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden",
            hasMultipleSteps && activeMobileTab === "steps" ? "hidden lg:flex" : "flex"
          )}
        >
          {/* Workspace Header — desktop only */}
          <div className="hidden lg:flex p-4 border-b border-border/40 items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-2 w-2 rounded-full bg-accent animate-ping" />
              <h2 className="text-sm font-semibold text-foreground">
                {currentStep?.name ?? "Workspace"}
              </h2>
              {currentStep?.category && (
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground/80 uppercase">
                  {currentStep.category}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-accent flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              100% Client-Side
            </span>
          </div>

          {/* Tool Component */}
          <div className="flex-1 bg-background/50 p-4 sm:p-6 overflow-y-auto">
            <div className="w-full max-w-4xl mx-auto">
              {children}
            </div>
          </div>

          {/* Next Step Footer (only when there are more steps) */}
          {!isLastStep && (
            <div className="p-4 border-t border-border/40 bg-secondary/10 flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Step {currentIndex + 1}</span> complete.
                Ready for the next tool?
              </div>
              <button
                onClick={onNext}
                className="flex items-center gap-2 rounded-xl bg-accent text-accent-foreground px-4 py-2 text-xs font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all"
              >
                Next: {steps[currentIndex + 1]?.name}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Done state — last step */}
          {isLastStep && steps.length > 1 && (
            <div className="p-4 border-t border-border/40 bg-accent/5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-accent">
                <CheckCircle2 className="h-4 w-4" />
                All {steps.length} tools completed
              </div>
              <button
                onClick={onReset}
                className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary/60 transition-all"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                New prompt
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
