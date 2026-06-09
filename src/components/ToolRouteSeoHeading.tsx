"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { findToolByHref } from "@/lib/tools-config";

export default function ToolRouteSeoHeading() {
  const pathname = usePathname();
  const [heading, setHeading] = useState<string | null>(null);

  useEffect(() => {
    if (!pathname || !pathname.startsWith("/tools/")) {
      setHeading(null);
      return;
    }

    const tool = findToolByHref(pathname);
    if (!tool) {
      setHeading(null);
      return;
    }

    const hasPageH1 = Boolean(document.querySelector("main h1"));
    setHeading(hasPageH1 ? null : tool.name);
  }, [pathname]);

  if (!heading) {
    return null;
  }

  return <h1 className="sr-only">{heading}</h1>;
}
