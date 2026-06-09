"use client";

import { Image, FileText, Video, Cpu, Code, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  title: string;
  description: string;
  toolsCount: number;
  features: string[];
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}

function CategoryCard({
  title,
  description,
  toolsCount,
  features,
  icon: Icon,
  onClick
}: CategoryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="premium-card flex flex-col text-left p-6 w-full group relative focus:outline-none focus:ring-2 focus:ring-accent/30"
    >
      {/* Top Banner Accent */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-accent/20 to-accent/0 rounded-t-xl opacity-0 group-hover:opacity-100 transition" />
      
      {/* Icon Badge */}
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/5 text-accent transition-all duration-300 group-hover:bg-accent group-hover:text-accent-foreground">
        <Icon className="h-5 w-5" />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex items-baseline justify-between mb-2">
          <h3 className="text-base font-semibold text-foreground tracking-tight transition-colors group-hover:text-accent">
            {title}
          </h3>
          <span className="text-xs font-bold text-muted-foreground/60 badge-count">
            {toolsCount} tools
          </span>
        </div>

        <p className="text-xs text-muted-foreground/80 leading-relaxed mb-4">
          {description}
        </p>

        {/* Feature List */}
        <div className="mt-auto space-y-1.5 pt-3 border-t border-border/40">
          {features.map((feat, idx) => (
            <div key={idx} className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="h-1 w-1 rounded-full bg-accent/60" />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>
    </button>
  );
}

interface CategoryShowcaseProps {
  onSelectCategory: (categoryName: string) => void;
  getToolCount: (categoryName: string) => number;
}

export default function CategoryShowcase({ onSelectCategory, getToolCount }: CategoryShowcaseProps) {
  const categories = [
    {
      title: "Image Tools",
      categoryKey: "Image Tools",
      description: "Compress, resize, edit, and convert photos client-side.",
      features: ["Background removal", "EXIF data viewer", "Format converters"],
      icon: Image
    },
    {
      title: "PDF Suite",
      categoryKey: "PDF Tools",
      description: "Manage, merge, split, secure, and sign essential documents.",
      features: ["Compress PDF file size", "Extract PDF text", "Word/Excel translation"],
      icon: FileText
    },
    {
      title: "Video Tools",
      categoryKey: "Video Tools",
      description: "Fast in-browser trimming, conversions, and resizing scripts.",
      features: ["Compress heavy video clips", "GIF format transitions", "Audio separation"],
      icon: Video
    },
    {
      title: "AI Tools",
      categoryKey: "AI Tools",
      description: "Prompt refinement libraries, cost calculators, and custom rules.",
      features: ["Context size analysis", "Token counts", "Model comparison boards"],
      icon: Cpu
    },
    {
      title: "Developer Tools",
      categoryKey: "Developer Tools",
      description: "Format, validate, minifying utilities, and code tools.",
      features: ["Base64 converter", "Cron schedule parsing", "JWT decoders"],
      icon: Code
    },
    {
      title: "Data & Analysis",
      categoryKey: "Data & Conversion",
      description: "Extract, visualize, analyze database exports and CSV files.",
      features: ["Interactive chart rendering", "SQL code formatting", "Spreadsheet viewer"],
      icon: BarChart2
    }
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <CategoryCard
            key={cat.title}
            title={cat.title}
            description={cat.description}
            toolsCount={getToolCount(cat.categoryKey)}
            features={cat.features}
            icon={cat.icon}
            onClick={() => onSelectCategory(cat.categoryKey)}
          />
        ))}
      </div>
    </div>
  );
}
