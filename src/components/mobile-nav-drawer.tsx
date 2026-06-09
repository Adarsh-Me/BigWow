"use client";

import Link from "next/link";
import { useMemo } from "react";
import { SheetClose } from "@/components/ui/sheet";
import { useLanguageStore } from "@/store/language-store";
import { tools } from "@/lib/tools-config";
import { expandSubTools, type SubTool } from "@/lib/sub-tools-config";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type ExpandedItem =
  | (typeof tools)[number]["items"][number]
  | (SubTool & { href: string; parentHref: string });

function getItemName(
  item: ExpandedItem,
  tc: ReturnType<typeof useTranslations>,
): string {
  if ("desc" in item && !("description" in item)) {
    return item.name;
  }
  const toolItem = item as { href: string };
  const toolId = toolItem.href.replace("/tools/", "");
  return tc(`tools.${toolId}.name` as any);
}

export default function MobileNavDrawer() {
  const { dir } = useLanguageStore();
  const tc = useTranslations("ToolsConfig");

  const sortedCategories = useMemo(
    () =>
      tools.map((category) => ({
        ...category,
        items: [...category.items].sort((a, b) => a.order - b.order),
      })),
    []
  );

  return (
    <div className="flex-1 overflow-y-auto" dir={dir}>
      {sortedCategories.map((category) => {
        const expanded = expandSubTools(category.items);
        return (
          <div key={category.id}>
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-4 pt-4 pb-2">
              {tc(`categories.${category.id}` as any)}
            </div>
            <div>
              {expanded.map((item) => {
                const available = "available" in item ? item.available : true;
                const Icon = item.icon;
                return (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={available ? item.href : "#"}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/85 hover:bg-secondary/60",
                        !available && "opacity-40 pointer-events-none"
                      )}
                    >
                      <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="truncate">
                        {getItemName(item, tc)}
                      </span>
                    </Link>
                  </SheetClose>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
