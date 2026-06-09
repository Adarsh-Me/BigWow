"use client";

import { MessageSquare, Zap, CheckCircle2 } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Ask or upload",
      description: "Type your query or drag and drop a file directly into the AI input bar.",
      icon: MessageSquare,
    },
    {
      num: "02",
      title: "AI selects the best tool",
      description: "Our local router parses the request and automatically mounts the correct workflow.",
      icon: Zap,
    },
    {
      num: "03",
      title: "Get instant results",
      description: "All processing happens 100% in your browser. Download or edit without server uploads.",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.01)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={idx} className="relative flex flex-col items-center md:items-start text-center md:text-left group">
              {/* Vertical connector on mobile / Horizontal on desktop */}
              {idx < 2 && (
                <div className="hidden md:block absolute top-7 left-[80%] right-[-20%] h-[1.5px] bg-gradient-to-r from-accent/20 to-transparent pointer-events-none" />
              )}
              
              {/* Step circle */}
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/5 text-accent mb-4 transition-all duration-300 group-hover:scale-105">
                <Icon className="h-5 w-5" />
              </div>

              <div className="text-[10px] font-bold text-accent tracking-widest uppercase mb-1.5 font-outlier">
                Step {step.num}
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground/80 max-w-xs">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
