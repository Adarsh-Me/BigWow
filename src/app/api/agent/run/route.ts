import { NextRequest, NextResponse } from "next/server";
import { getToolRegistryForPrompt } from "@/lib/agent-tool-registry";
import type { AgentRunResponse, AgentToolSelection } from "@/types/agent";

const NVIDIA_API_URL =
  "https://integrate.api.nvidia.com/v1/chat/completions";

const MODEL = "deepseek-ai/deepseek-r1-0528";

/**
 * System prompt sent to the AI on every request.
 * The tool registry is inlined so the AI has full context.
 */
function buildSystemPrompt(): string {
  const registry = getToolRegistryForPrompt();

  return `You are the intelligent tool-routing AI for BigWow — a browser-based utility platform with 101 tools.

Your ONLY job is to read the user's request and select the best 1-3 tools from the registry to fulfil it, AND extract any concrete parameter values mentioned in the request.

## Rules
- Return ONLY valid JSON — no markdown fences, no explanation text, nothing else
- Maximum 3 tools in the tools array
- Tools must be in execution order (first tool the user should use = order 1)
- Only select tools that are in the registry below
- If you cannot match any tool, return tools:[] and set notFound:true with a message
- The "href" values must EXACTLY match the registry (e.g. "/tools/bg-removal")

## Extracting params
For each selected tool, extract any concrete values from the user's prompt that are relevant to that tool.
Examples:
- User says "calculate 20 multiply 500" → Calculator params: {"expression": "20 * 500"}
- User says "resize image to 1000x1000" → Image Resizer params: {"width": 1000, "height": 1000}
- User says "make a QR code for https://google.com" → QR Generator params: {"text": "https://google.com"}
- User says "convert 100 USD to EUR" → Currency Converter params: {"from": "USD", "to": "EUR", "amount": 100}
- User says "generate a 20 character password" → Password Generator params: {"length": 20}
- If no concrete values mentioned → omit params or use {}

## Tool Registry (JSON)
${registry}

## Response Format (strict JSON, nothing else)
{
  "reasoning": "One sentence explaining what you understood and what you selected",
  "notFound": false,
  "tools": [
    {"href": "/tools/calculator", "name": "Calculator", "order": 1, "category": "Math & Finance Tools", "params": {"expression": "20 * 500"}},
    {"href": "/tools/image-resizer", "name": "Image Resizer", "order": 2, "category": "Design Tools", "params": {"width": 1000, "height": 1000}}
  ]
}

## When no tool matches
{
  "reasoning": "Brief explanation of what was understood",
  "notFound": true,
  "message": "Friendly message to user about what's not available",
  "tools": []
}`;
}

/**
 * Local heuristic matching algorithm used when NVIDIA API fails, rate-limits, or has invalid output.
 * Scores all 101 tools based on name, description, and keyword overlap.
 */
export async function localRoutePrompt(prompt: string): Promise<AgentRunResponse> {
  const { findBestCapabilities } = await import("@/lib/tool-capabilities");
  const capabilityMatches = findBestCapabilities(prompt);

  if (capabilityMatches.length > 0) {
    return {
      reasoning: `I found the best workflow: **${capabilityMatches[0].name}**.`,
      tools: capabilityMatches.map((capability, index) => ({
        href: capability.href,
        name: capability.name,
        order: index + 1,
        category: capability.category,
        params: {
          ...(capability.routeParams ?? {}),
          workflowId: capability.workflowId,
        },
        workflowId: capability.workflowId,
        workflowName: capability.name,
        privacyMode: capability.privacyMode,
        implementationStatus: capability.implementationStatus,
        requiresFile: capability.requiresFile,
        nextPrompt: capability.requiresFile
          ? `Upload your ${capability.inputTypes.join(" or ")} file to run ${capability.name}.`
          : undefined,
      })),
      notFound: false,
    };
  }

  const { agentToolRegistry } = await import("@/lib/agent-tool-registry");
  const lowercasePrompt = prompt.toLowerCase();
  const words = lowercasePrompt.split(/\s+/).map((w) => w.replace(/[^a-z0-9]/g, ""));

  // Score each tool based on keyword and name matches
  const scored = agentToolRegistry.map((tool) => {
    let score = 0;
    const nameLower = tool.name.toLowerCase();

    // Direct slash command match gets very high score
    if (tool.command && lowercasePrompt.includes(tool.command.toLowerCase())) {
      score += 100;
    }

    // Direct name match or sub-match is highly weighted
    if (lowercasePrompt.includes(nameLower)) {
      score += 15;
    }

    // Keyword matches
    tool.keywords.forEach((keyword) => {
      const kwLower = keyword.toLowerCase();
      if (lowercasePrompt.includes(kwLower)) {
        score += 4;
      }
      words.forEach((word) => {
        if (word && kwLower === word) {
          score += 3;
        }
      });
    });

    // Description match
    const descLower = tool.description.toLowerCase();
    words.forEach((word) => {
      if (word && descLower.includes(word)) {
        score += 0.5;
      }
    });

    return { tool, score };
  });

  // Filter out zero scores and sort descending
  const matches = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (matches.length === 0) {
    return {
      reasoning: "I analyzed your request locally but couldn't identify a matching tool. You can explore the tool categories on the main dashboard.",
      tools: [],
      notFound: true,
      notFoundMessage: "That specific tool isn't available yet — it's on our roadmap 🚀 Here are some tools I CAN open for you: compress a PDF, calculate expressions, remove backgrounds, generate invoices, or create QR codes.",
    };
  }

  // Extract simple parameters from prompt if available
  const toolsWithParams = matches.map((m, index) => {
    const params: Record<string, any> = {};
    const href = m.tool.href;

    if (href === "/tools/calculator") {
      const mathMatch = prompt.match(/[0-9\s+\-*/x()=]+/);
      if (mathMatch && mathMatch[0].trim().length > 2) {
        params.expression = mathMatch[0].replace(/x/gi, "*").trim();
      }
    } else if (href === "/tools/qr-generator" || href === "/tools/qr-scanner") {
      const urlMatch = prompt.match(/https?:\/\/[^\s]+/i);
      if (urlMatch) {
        params.text = urlMatch[0];
      }
    } else if (href === "/tools/password-generator") {
      const lengthMatch = prompt.match(/\b\d+\b/);
      if (lengthMatch) {
        params.length = parseInt(lengthMatch[0]);
      }
    } else if (href === "/tools/currency-converter") {
      const amountMatch = prompt.match(/\b\d+(\.\d+)?\b/);
      if (amountMatch) {
        params.amount = parseFloat(amountMatch[0]);
      }
      const currencies = ["usd", "eur", "gbp", "jpy", "cad", "aud", "inr", "aed"];
      const foundCurrencies = currencies.filter((c) => lowercasePrompt.includes(c));
      if (foundCurrencies.length >= 1) params.from = foundCurrencies[0].toUpperCase();
      if (foundCurrencies.length >= 2) params.to = foundCurrencies[1].toUpperCase();
    }

    return {
      href: m.tool.href,
      name: m.tool.name,
      order: index + 1,
      category: m.tool.category,
      params,
    };
  });

  return {
    reasoning: `I've opened the most relevant tool: **${toolsWithParams[0].name}** for your request.`,
    tools: toolsWithParams,
    notFound: false,
  };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  // ── Parse request body ───────────────────────────────────────
  let prompt: string;
  try {
    const body = await request.json();
    prompt = String(body?.prompt ?? "").trim();
  } catch {
    return NextResponse.json<AgentRunResponse>(
      { reasoning: "Invalid request body.", tools: [], error: "invalid_request" },
      { status: 400 }
    );
  }

  if (!prompt) {
    return NextResponse.json<AgentRunResponse>(
      { reasoning: "No prompt provided.", tools: [], error: "empty_prompt" },
      { status: 400 }
    );
  }

  // ── Check API key — Fallback to local if missing ──────────────
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    console.warn("[agent/run] NVIDIA_API_KEY not set. Using local fallback.");
    const fallbackData = await localRoutePrompt(prompt);
    return NextResponse.json<AgentRunResponse>(fallbackData);
  }

  // ── Call NVIDIA NIM / DeepSeek ───────────────────────────────
  let rawContent: string;
  try {
    const res = await fetch(NVIDIA_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: buildSystemPrompt() },
          { role: "user", content: prompt },
        ],
        temperature: 0.1,
        max_tokens: 512,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "unknown");
      console.error(`[agent/run] NVIDIA API error ${res.status}:`, errorText);
      // Fallback!
      const fallbackData = await localRoutePrompt(prompt);
      return NextResponse.json<AgentRunResponse>(fallbackData);
    }

    const data = await res.json();
    rawContent = data?.choices?.[0]?.message?.content ?? "";
  } catch (err) {
    console.error("[agent/run] Fetch error, using local routing:", err);
    // Fallback!
    const fallbackData = await localRoutePrompt(prompt);
    return NextResponse.json<AgentRunResponse>(fallbackData);
  }

  // ── Parse AI JSON response ───────────────────────────────────
  // Strip any accidental markdown fences the model might add
  const cleaned = rawContent
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/gi, "")
    // Strip DeepSeek <think>...</think> reasoning blocks
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .trim();

  let parsed: { reasoning?: string; tools?: AgentToolSelection[]; notFound?: boolean; message?: string };
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    console.error("[agent/run] Failed to parse AI response, using local routing fallback:", rawContent);
    const fallbackData = await localRoutePrompt(prompt);
    return NextResponse.json<AgentRunResponse>(fallbackData);
  }

  // ── Validate tools against registry ─────────────────────────
  const { agentToolRegistry } = await import("@/lib/agent-tool-registry");
  const validHrefs = new Set(agentToolRegistry.map((t) => t.href));

  const validatedTools: AgentToolSelection[] = (parsed.tools ?? [])
    .filter((t) => t?.href && validHrefs.has(t.href))
    .slice(0, 3)
    .map((t, i) => ({
      href: t.href,
      name: t.name ?? t.href,
      order: i + 1,
      category: t.category,
      params: t.params ?? {},
      workflowId: t.workflowId,
      workflowName: t.workflowName,
      privacyMode: t.privacyMode,
      implementationStatus: t.implementationStatus,
      requiresFile: t.requiresFile,
      nextPrompt: t.nextPrompt,
    }));

  return NextResponse.json<AgentRunResponse>({
    reasoning: parsed.reasoning ?? "Here are the best tools for your request.",
    tools: validatedTools,
    notFound: parsed.notFound ?? false,
    notFoundMessage: parsed.message,
  });
}
