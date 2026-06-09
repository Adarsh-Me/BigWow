import { describe, it, expect } from "vitest";
import {
  findBestCapabilities,
  getCapabilityByWorkflowId,
  localCapabilities,
} from "@/lib/tool-capabilities";

describe("tool capability registry", () => {
  it("contains high-demand privacy-first workflows", () => {
    expect(getCapabilityByWorkflowId("compress-pdf")?.href).toBe("/tools/pdf");
    expect(getCapabilityByWorkflowId("compress-image")?.href).toBe("/tools/image-compression");
    expect(getCapabilityByWorkflowId("compress-video")?.href).toBe("/tools/compress-video");
    expect(getCapabilityByWorkflowId("grammar-checker")?.privacyMode).toBe("local");
    expect(localCapabilities.length).toBeGreaterThanOrEqual(10);
  });

  it("matches common TinyWow-style prompts to exact workflows", () => {
    expect(findBestCapabilities("compress pdf")[0]?.workflowId).toBe("compress-pdf");
    expect(findBestCapabilities("turn mp4 into gif")[0]?.workflowId).toBe("video-to-gif");
    expect(findBestCapabilities("extract text from image")[0]?.workflowId).toBe("image-to-text");
    expect(findBestCapabilities("humanize this paragraph")[0]?.workflowId).toBe("humanize-text");
  });

  it("does not prioritize planned-only workflows over ready or beta matches", () => {
    const matches = findBestCapabilities("video compressor");
    expect(matches[0]?.implementationStatus).not.toBe("planned");
  });
});
