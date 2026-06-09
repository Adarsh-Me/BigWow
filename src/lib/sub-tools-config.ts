import {
  LayersIcon,
  SplitIcon,
  FileDownIcon,
  RefreshCwIcon,
  FileImageIcon,
  FileTextIcon,
  FileArchiveIcon,
  ArchiveIcon,
} from "lucide-react";

export interface SubTool {
  id: string;
  name: string;
  desc: string;
  icon: any;
  order: number;
}

export const SUB_TOOLS: Record<string, SubTool[]> = {
  "/tools/pdf": [
    { id: "merge-pdfs", name: "Merge PDFs", desc: "Combine multiple PDF files into one", icon: LayersIcon, order: 1 },
    { id: "split-pdf", name: "Split PDF", desc: "Extract specific pages from a PDF", icon: SplitIcon, order: 2 },
    { id: "compress-pdf", name: "Compress PDF", desc: "Reduce PDF file size", icon: FileDownIcon, order: 3 },
    { id: "rotate-pdf", name: "Rotate PDF", desc: "Rotate all PDF pages", icon: RefreshCwIcon, order: 4 },
    { id: "pdf-to-images", name: "PDF to Images", desc: "Convert PDF pages to JPEGs inside ZIP", icon: FileImageIcon, order: 5 },
    { id: "pdf-to-text", name: "PDF to Text", desc: "Extract text blocks from PDF", icon: FileTextIcon, order: 6 },
    { id: "images-to-pdf", name: "Images to PDF", desc: "Compile images into single PDF", icon: FileImageIcon, order: 7 },
    { id: "text-to-pdf", name: "Text to PDF", desc: "Compile raw text to PDF", icon: FileTextIcon, order: 8 },
  ],
  "/tools/zip": [
    { id: "compress", name: "Create ZIP", desc: "Compress files into a ZIP archive", icon: FileArchiveIcon, order: 1 },
    { id: "extract", name: "Extract ZIP", desc: "Extract files from a ZIP archive", icon: ArchiveIcon, order: 2 },
  ],
};

export function getSubTools(parentHref: string): SubTool[] {
  return SUB_TOOLS[parentHref] ?? [];
}

export function expandSubTools<T extends { href: string }>(
  items: T[],
): (T | (SubTool & { href: string; parentHref: string }))[] {
  return items.flatMap((item) => {
    const subs = getSubTools(item.href);
    if (subs.length === 0) return [item] as any;
    return subs
      .sort((a, b) => a.order - b.order)
      .map((sub) => ({
        ...sub,
        href: `${item.href}?subTool=${sub.id}`,
        parentHref: item.href,
      })) as any;
  });
}
