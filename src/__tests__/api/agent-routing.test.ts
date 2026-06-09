import { describe, it, expect } from "vitest";
import { localRoutePrompt } from "@/app/api/agent/run/route";

describe("agent local workflow routing", () => {
  it("routes compress pdf to the exact PDF workflow", async () => {
    const result = await localRoutePrompt("please compress my pdf");

    expect(result.notFound).toBe(false);
    expect(result.tools[0]).toMatchObject({
      href: "/tools/pdf",
      workflowId: "compress-pdf",
      privacyMode: "local",
      requiresFile: true,
    });
  });

  it("routes humanize requests as API-required", async () => {
    const result = await localRoutePrompt("humanize this paragraph");

    expect(result.tools[0]).toMatchObject({
      workflowId: "humanize-text",
      privacyMode: "api-required",
    });
  });
});
