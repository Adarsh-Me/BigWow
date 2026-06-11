"use client";

import dynamic from "next/dynamic";
import React from "react";

const BgRemoval = dynamic(() => import("./BgRemoval"), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
        <p className="text-xs text-muted-foreground animate-pulse">Loading background remover...</p>
      </div>
    </div>
  ),
});

export default function BgRemovalWrapper() {
  return <BgRemoval />;
}
