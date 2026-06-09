"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { Tool, isToolNew } from "@/lib/tools-config";
import { useFavoritesStore } from "@/store/favorites-store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  tool: Tool & { category: string };
  showFavoriteButton?: boolean;
  className?: string;
  variant?: "grid" | "list" | "compact";
}

export default function ToolCard({
  tool,
  showFavoriteButton = true,
  className = "",
  variant = "grid",
}: ToolCardProps) {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const isFavorited = isFavorite(tool.href);
  const IconComponent = tool.icon;
  const tc = useTranslations("ToolsConfig");
  const tCommon = useTranslations("Common");

  const slug = tool.href.startsWith("/tools/")
    ? tool.href.replace("/tools/", "")
    : null;
  const toolName = slug ? tc(`tools.${slug}.name` as any) : tool.name;
  const toolDesc = slug ? tc(`tools.${slug}.description` as any) : tool.description;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(tool.href);
  };

  if (variant === "list") {
    return (
      <Link
        href={tool.available ? tool.href : "#"}
        className={cn("block", tool.available ? "group" : "cursor-not-allowed", className)}
      >
        <article
          data-testid="tool-card"
          className={cn(
            "premium-card relative flex w-full items-center gap-4 p-4 shadow-[0_2px_8px_rgba(0,0,0,0.01)]",
            tool.available ? "cursor-pointer" : "opacity-55",
          )}
        >
          <div className="shrink-0 rounded-xl bg-secondary/80 p-3 text-muted-foreground transition-all duration-200 group-hover:bg-accent/10 group-hover:text-accent group-hover:scale-105">
            <IconComponent className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <h3 className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-accent">
                {toolName}
              </h3>
              {!tool.available ? (
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60">
                  {tCommon("comingSoon")}
                </span>
              ) : isToolNew(tool.creationDate) ? (
                <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent">
                  {tCommon("new")}
                </span>
              ) : null}
            </div>
            <p className="line-clamp-1 text-xs text-muted-foreground">{toolDesc}</p>
          </div>

          {showFavoriteButton && tool.available && (
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground/80 hover:text-rose-500 hover:border-rose-100 hover:bg-rose-50 transition active:scale-95"
              onClick={handleFavoriteClick}
              aria-label={
                isFavorited
                  ? tCommon("removeFromFavorites")
                  : tCommon("addToFavorites")
              }
            >
              <Heart
                className={cn(
                  "h-4 w-4 transition-all duration-200",
                  isFavorited ? "fill-rose-500 text-rose-500" : "hover:text-rose-500",
                )}
              />
            </button>
          )}
        </article>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href={tool.available ? tool.href : "#"}
        className={cn("block", tool.available ? "group" : "cursor-not-allowed", className)}
      >
        <article
          data-testid="tool-card"
          className={cn(
            "premium-card relative flex w-full items-center gap-3 p-4 shadow-[0_2px_8px_rgba(0,0,0,0.01)]",
            tool.available ? "cursor-pointer" : "opacity-55",
          )}
        >
          <div className="shrink-0 rounded-xl bg-secondary/80 p-2.5 text-muted-foreground transition-all duration-200 group-hover:bg-accent/10 group-hover:text-accent group-hover:scale-105">
            <IconComponent className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-xs font-semibold text-foreground transition-colors group-hover:text-accent">
              {toolName}
            </h3>
            <p className="mt-1 line-clamp-1 text-[11px] text-muted-foreground">{toolDesc}</p>
          </div>
          {!tool.available && (
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60">
              {tCommon("comingSoon")}
            </span>
          )}
        </article>
      </Link>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={tool.available ? tool.href : "#"}
            className={cn("block h-full", tool.available ? "group" : "cursor-not-allowed", className)}
          >
            <article
              data-testid="tool-card"
              className={cn(
                "premium-card relative flex h-full min-h-[200px] w-full flex-col p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)]",
                tool.available ? "cursor-pointer" : "opacity-55",
              )}
            >
              <div className="absolute left-4 top-4 z-10 flex gap-1.5">
                {!tool.available && (
                  <span className="rounded-full bg-secondary px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60">
                    {tCommon("comingSoon")}
                  </span>
                )}
                {tool.available && isToolNew(tool.creationDate) && (
                  <span className="rounded-full bg-accent/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-accent">
                    {tCommon("new")}
                  </span>
                )}
              </div>

              {showFavoriteButton && tool.available && (
                <div className="absolute right-4 top-4 z-10">
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground/80 hover:text-rose-500 hover:border-rose-100 hover:bg-rose-50 transition active:scale-95"
                    onClick={handleFavoriteClick}
                    aria-label={
                      isFavorited
                        ? tCommon("removeFromFavorites")
                        : tCommon("addToFavorites")
                    }
                  >
                    <Heart
                      className={cn(
                        "h-4 w-4 transition-all duration-200",
                        isFavorited ? "fill-rose-500 text-rose-500" : "hover:text-rose-500",
                      )}
                    />
                  </button>
                </div>
              )}

              <div className="mb-4 mt-8 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/80 text-muted-foreground transition-all duration-200 group-hover:bg-accent/10 group-hover:text-accent group-hover:scale-105">
                <IconComponent className="h-5 w-5" />
              </div>

              <div className="mt-auto">
                <h3 className="text-sm font-semibold text-foreground transition-colors group-hover:text-accent">
                  {toolName}
                </h3>
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {toolDesc}
                </p>
              </div>
            </article>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs rounded-xl border border-border bg-card p-3 shadow-md">
          <p className="text-[11px] font-medium leading-relaxed text-foreground">{toolDesc}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
