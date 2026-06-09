export type CapabilityPrivacyMode = "local" | "ai-optional" | "api-required";
export type CapabilityStatus = "ready" | "beta" | "planned";

export interface ToolCapability {
  workflowId: string;
  name: string;
  href: string;
  category: string;
  description: string;
  inputTypes: string[];
  outputTypes: string[];
  privacyMode: CapabilityPrivacyMode;
  implementationStatus: CapabilityStatus;
  keywords: string[];
  routeParams?: Record<string, string>;
  requiresFile?: boolean;
}

export const toolCapabilities: ToolCapability[] = [
  {
    workflowId: "compress-pdf",
    name: "Compress PDF",
    href: "/tools/pdf",
    category: "PDF Tools",
    description: "Reduce PDF file size locally in your browser.",
    inputTypes: ["pdf"],
    outputTypes: ["pdf"],
    privacyMode: "local",
    implementationStatus: "ready",
    keywords: ["compress pdf", "reduce pdf", "shrink pdf", "pdf smaller", "pdf compressor"],
    routeParams: { subTool: "compress-pdf" },
    requiresFile: true,
  },
  {
    workflowId: "merge-pdf",
    name: "Merge PDF",
    href: "/tools/pdf",
    category: "PDF Tools",
    description: "Combine PDF files locally in your browser.",
    inputTypes: ["pdf"],
    outputTypes: ["pdf"],
    privacyMode: "local",
    implementationStatus: "ready",
    keywords: ["merge pdf", "combine pdf", "join pdf"],
    routeParams: { subTool: "merge-pdfs" },
    requiresFile: true,
  },
  {
    workflowId: "split-pdf",
    name: "Split PDF",
    href: "/tools/pdf",
    category: "PDF Tools",
    description: "Extract PDF pages or ranges locally.",
    inputTypes: ["pdf"],
    outputTypes: ["pdf", "zip"],
    privacyMode: "local",
    implementationStatus: "ready",
    keywords: ["split pdf", "extract pdf pages", "separate pdf"],
    routeParams: { subTool: "split-pdf" },
    requiresFile: true,
  },
  {
    workflowId: "compress-image",
    name: "Image Compressor",
    href: "/tools/image-compression",
    category: "Image Tools",
    description: "Compress JPG, PNG, and WebP files locally.",
    inputTypes: ["image"],
    outputTypes: ["image"],
    privacyMode: "local",
    implementationStatus: "ready",
    keywords: ["compress image", "image compressor", "reduce image size", "shrink photo", "smaller image"],
    requiresFile: true,
  },
  {
    workflowId: "remove-background",
    name: "Remove Background",
    href: "/tools/bg-removal",
    category: "Image Tools",
    description: "Remove image backgrounds with in-browser AI.",
    inputTypes: ["image"],
    outputTypes: ["png"],
    privacyMode: "local",
    implementationStatus: "ready",
    keywords: ["remove background", "background remover", "transparent background", "cutout"],
    requiresFile: true,
  },
  {
    workflowId: "image-to-text",
    name: "Image to Text",
    href: "/tools/image-to-text",
    category: "Image Tools",
    description: "Extract text from images locally with OCR.",
    inputTypes: ["image"],
    outputTypes: ["text"],
    privacyMode: "local",
    implementationStatus: "planned",
    keywords: ["image to text", "ocr", "extract text from image", "read text from photo"],
    requiresFile: true,
  },
  {
    workflowId: "compress-video",
    name: "Video Compressor",
    href: "/tools/compress-video",
    category: "Video Tools",
    description: "Reduce video file size locally with browser video processing.",
    inputTypes: ["video"],
    outputTypes: ["video"],
    privacyMode: "local",
    implementationStatus: "beta",
    keywords: ["compress video", "video compressor", "reduce video size", "shrink mp4", "smaller video"],
    requiresFile: true,
  },
  {
    workflowId: "video-to-gif",
    name: "Video to GIF",
    href: "/tools/compress-video",
    category: "Video Tools",
    description: "Convert short video clips into GIFs locally.",
    inputTypes: ["video"],
    outputTypes: ["gif"],
    privacyMode: "local",
    implementationStatus: "beta",
    keywords: ["video to gif", "mp4 to gif", "convert video gif", "make gif", "turn mp4 into gif"],
    routeParams: { mode: "gif" },
    requiresFile: true,
  },
  {
    workflowId: "mp4-to-mp3",
    name: "MP4 to MP3",
    href: "/tools/compress-video",
    category: "Video Tools",
    description: "Extract audio from video files locally.",
    inputTypes: ["video"],
    outputTypes: ["audio"],
    privacyMode: "local",
    implementationStatus: "beta",
    keywords: ["mp4 to mp3", "extract audio", "video to audio", "audio from video"],
    routeParams: { mode: "audio" },
    requiresFile: true,
  },
  {
    workflowId: "grammar-checker",
    name: "Grammar Checker",
    href: "/tools/grammar-checker",
    category: "AI Writing Tools",
    description: "Check grammar locally where supported.",
    inputTypes: ["text"],
    outputTypes: ["text"],
    privacyMode: "local",
    implementationStatus: "planned",
    keywords: ["grammar checker", "fix grammar", "proofread", "spelling checker", "harper"],
  },
  {
    workflowId: "humanize-text",
    name: "Humanize Text",
    href: "/tools/humanize-text",
    category: "AI Writing Tools",
    description: "Rewrite text in a more natural tone using an AI provider.",
    inputTypes: ["text"],
    outputTypes: ["text"],
    privacyMode: "api-required",
    implementationStatus: "planned",
    keywords: ["humanize text", "paraphrase", "rewrite", "make human", "content improver"],
  },
];

const statusWeight: Record<CapabilityStatus, number> = {
  ready: 3,
  beta: 2,
  planned: 1,
};

export const localCapabilities = toolCapabilities.filter(
  (capability) => capability.privacyMode === "local"
);

export function getCapabilityByWorkflowId(workflowId: string): ToolCapability | undefined {
  return toolCapabilities.find((capability) => capability.workflowId === workflowId);
}

export function buildWorkflowHref(capability: ToolCapability): string {
  const params = capability.routeParams ?? {};
  const entries = Object.entries(params);
  if (entries.length === 0) return capability.href;

  const search = new URLSearchParams(entries);
  return `${capability.href}?${search.toString()}`;
}

export function findBestCapabilities(prompt: string, limit = 3): ToolCapability[] {
  const normalizedPrompt = prompt.toLowerCase();
  const words = normalizedPrompt
    .split(/\s+/)
    .map((word) => word.replace(/[^a-z0-9]/g, ""))
    .filter(Boolean);

  return toolCapabilities
    .map((capability) => {
      let score = statusWeight[capability.implementationStatus];
      const name = capability.name.toLowerCase();

      if (normalizedPrompt.includes(name)) score += 20;
      if (normalizedPrompt.includes(capability.workflowId.replace(/-/g, " "))) score += 16;

      for (const keyword of capability.keywords) {
        const normalizedKeyword = keyword.toLowerCase();
        if (normalizedPrompt.includes(normalizedKeyword)) score += 12;
        for (const word of words) {
          if (normalizedKeyword.includes(word)) score += 1;
        }
      }

      for (const word of words) {
        if (name.includes(word)) score += 2;
        if (capability.description.toLowerCase().includes(word)) score += 1;
      }

      return { capability, score };
    })
    .filter((entry) => entry.score > statusWeight[entry.capability.implementationStatus])
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.capability);
}
