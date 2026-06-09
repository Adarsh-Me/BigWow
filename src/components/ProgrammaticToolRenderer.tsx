"use client";

import { ToolRegistry } from "@/components/ToolRegistry";

interface ProgrammaticToolRendererProps {
  toolPath: string;
  defaultSubTool?: string;
}

export default function ProgrammaticToolRenderer({
  toolPath,
  defaultSubTool,
}: ProgrammaticToolRendererProps) {
  const ToolComponent = ToolRegistry[toolPath];
  if (!ToolComponent) {
    return (
      <div className="p-8 text-center rounded-2xl border border-dashed border-red-200 bg-red-50/20 text-red-600 dark:bg-red-950/10 dark:border-red-900/30 dark:text-red-400">
        Tool component not found in registry: {toolPath}
      </div>
    );
  }
  return <ToolComponent defaultSubTool={defaultSubTool} />;
}
