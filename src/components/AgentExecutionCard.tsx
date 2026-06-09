"use client";

import { useEffect, useState } from "react";
import { Sparkles, Check, ServerCrash, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

export type ExecutionStep = "thinking" | "routing" | "executing" | "done" | "error";

interface AgentExecutionCardProps {
  status: ExecutionStep;
  toolName?: string;
  errorMessage?: string;
  /** Real tool names discovered by the AI — shown in sequence during routing */
  selectedTools?: string[];
}

export default function AgentExecutionCard({
  status,
  toolName = "Selected Tool",
  errorMessage = "An execution error occurred.",
  selectedTools = [],
}: AgentExecutionCardProps) {
  const [dots, setDots] = useState("");

  // Animated loading dots for active step
  useEffect(() => {
    if (status === "done" || status === "error") return;
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 450);
    return () => clearInterval(interval);
  }, [status]);

  // Build step label — use real tool names when available
  const routingLabel =
    selectedTools.length > 1
      ? `Selected: ${selectedTools.join(" → ")}`
      : selectedTools.length === 1
      ? `Selected: ${selectedTools[0]}`
      : `Routing to ${toolName}`;

  const steps = [
    {
      key: "thinking",
      label: "Analyzing your request",
      subtext: "Reading intent and matching to the tool registry"
    },
    {
      key: "routing",
      label: routingLabel,
      subtext:
        selectedTools.length > 1
          ? `${selectedTools.length}-tool chain identified`
          : "Matching prompt to local engine"
    },
    {
      key: "executing",
      label: "Opening workspace",
      subtext: "Mounting interactive tool — 100% client-side"
    }
  ];

  const getStepState = (stepKey: string) => {
    if (status === "error") return "error";
    if (status === "done") return "completed";

    const order = ["thinking", "routing", "executing"];
    const currentIdx = order.indexOf(status);
    const stepIdx = order.indexOf(stepKey);

    if (stepIdx < currentIdx) return "completed";
    if (stepIdx === currentIdx) return "active";
    return "pending";
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl border border-border bg-card p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.12)] animate-slide-up">
      {/* Card Header */}
      <div className="flex items-center gap-3 border-b border-border/40 pb-4 mb-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
          {status === "error" ? (
            <ServerCrash className="h-4 w-4 text-rose-500" />
          ) : (
            <Cpu className="h-4 w-4 animate-pulse" />
          )}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">AI Assistant Routing</h3>
          <p className="text-xs text-muted-foreground">
            {status === "done"
              ? "Routing completed successfully"
              : status === "error"
              ? "Process halted"
              : `Processing request${dots}`}
          </p>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="space-y-6">
        {steps.map((step) => {
          const state = getStepState(step.key);
          return (
            <div key={step.key} className="flex gap-4 group">
              {/* Vertical timeline connector */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold border transition-all duration-200",
                    state === "completed"
                      ? "bg-accent border-accent text-accent-foreground"
                      : state === "active"
                      ? "border-accent text-accent bg-accent/5 ring-4 ring-accent/15"
                      : "border-border/60 bg-secondary/30 text-muted-foreground/50"
                  )}
                >
                  {state === "completed" ? (
                    <Check className="h-4 w-4" />
                  ) : state === "active" ? (
                    <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-border" />
                  )}
                </div>
                {step.key !== "executing" && (
                  <div
                    className={cn(
                      "w-[2px] h-10 mt-1 transition-colors duration-200",
                      state === "completed" ? "bg-accent" : "bg-border/40"
                    )}
                  />
                )}
              </div>

              {/* Step Labels */}
              <div className="flex-1 pt-0.5">
                <h4
                  className={cn(
                    "text-sm font-semibold transition-colors duration-200",
                    state === "active"
                      ? "text-accent"
                      : state === "completed"
                      ? "text-foreground"
                      : "text-muted-foreground/60"
                  )}
                >
                  {step.label}
                  {state === "active" && dots}
                </h4>
                <p className="text-xs text-muted-foreground/70 mt-1">{step.subtext}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Output / Error Box */}
      {status === "error" && (
        <div className="mt-6 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 p-4 animate-fade-in">
          <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">Execution Error</p>
          <p className="text-xs text-rose-500/90 dark:text-rose-400/80 mt-1">{errorMessage}</p>
        </div>
      )}

      {status === "done" && (
        <div className="mt-6 rounded-xl bg-accent/5 border border-accent/10 p-4 text-center animate-fade-in">
          <p className="text-xs font-semibold text-accent flex items-center justify-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            Execution Completed Successfully
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            Mounting tool workspace inside result container.
          </p>
        </div>
      )}
    </div>
  );
}
