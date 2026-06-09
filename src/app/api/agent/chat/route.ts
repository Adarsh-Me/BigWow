import { NextRequest, NextResponse } from "next/server";

const NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const MODEL = "deepseek-ai/deepseek-r1-0528";

interface ChatAPIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatAPIBody {
  messages: ChatAPIMessage[];
  currentToolName?: string;
  currentToolHref?: string;
}

/**
 * Local conversational responder used when NVIDIA DeepSeek API is rate-limited or fails.
 * Captures routing intents to trigger the local routing engine, and handles basic conversational help.
 */
async function localChatResponse(
  messages: ChatAPIMessage[],
  currentToolName?: string
): Promise<{ reply: string; shouldRoute: boolean }> {
  const latestMessage = messages[messages.length - 1]?.content ?? "";
  const lowercaseMsg = latestMessage.toLowerCase();

  // Define action keywords that signal a tool-routing intent
  const routeWords = [
    "open", "use", "go to", "start", "run", "calculate", "compress", "remove", 
    "convert", "generate", "create", "make", "resize", "format", "diff",
    "pdf", "invoice", "barcode", "qr", "image", "audio", "video", "json", "yaml"
  ];
  const isRoutingIntent = routeWords.some((word) => lowercaseMsg.includes(word));

  if (isRoutingIntent) {
    // Return the prompt rephrased as a clean command so the router can catch it
    return {
      reply: latestMessage,
      shouldRoute: true,
    };
  }

  // Conversational response tailored to active tool context
  if (currentToolName) {
    return {
      reply: `Sure! The **${currentToolName}** tool is loaded on the right. You can configure and run it directly in your browser. All processing is 100% private and client-side. Let me know if you want me to open a different tool!`,
      shouldRoute: false,
    };
  }

  // Standard greetings and help fallbacks
  if (
    lowercaseMsg.includes("hello") ||
    lowercaseMsg.includes("hi ") ||
    lowercaseMsg.includes("hey") ||
    lowercaseMsg.includes("greetings")
  ) {
    return {
      reply: "Hello! I am BigWowAI, your client-side assistant. How can I help you today? You can ask me to open any tool — e.g., 'compress a PDF', 'remove image background', 'generate a strong password', or 'open the calculator'!",
      shouldRoute: false,
    };
  }

  if (lowercaseMsg.includes("help") || lowercaseMsg.includes("what can you do")) {
    return {
      reply: "I am BigWowAI! I can open and pre-configure any of the 101 browser-based tools available on this platform. Just tell me what you need to do (e.g. 'convert CSV to JSON') and I will open it for you instantly.",
      shouldRoute: false,
    };
  }

  return {
    reply: "I am ready to help you navigate BigWow! Tell me what you'd like to do, and I'll instantly launch the appropriate tool (e.g., try saying 'split a PDF' or 'create a QR code').",
    shouldRoute: false,
  };
}

export async function POST(request: NextRequest) {
  let body: ChatAPIBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ reply: "Invalid request.", shouldRoute: false }, { status: 400 });
  }

  const { messages = [], currentToolName, currentToolHref } = body;

  if (!messages.length) {
    return NextResponse.json({ reply: "No messages provided.", shouldRoute: false }, { status: 400 });
  }

  // Check API key — Fallback to local if missing
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    console.warn("[agent/chat] NVIDIA_API_KEY not set. Using local conversational fallback.");
    const fallback = await localChatResponse(messages, currentToolName);
    return NextResponse.json(fallback);
  }

  const toolContext = currentToolName
    ? `The user is currently using the **${currentToolName}** tool (${currentToolHref ?? ""}).`
    : "No tool is currently open.";

  const systemPrompt = `You are BigWowAI, the helpful AI assistant for BigWow — a browser-based utility platform with 101 tools.

${toolContext}

## Your behavior rules:
1. If the user asks a follow-up question about the CURRENT tool (how to use it, what it does, tips) → answer helpfully in 1-3 short sentences. DO NOT start with "ROUTE:".
2. If the user clearly wants to do something with a DIFFERENT tool or a completely new task → start your response with exactly "ROUTE:" followed by their request rephrased as a clean command. Example: "ROUTE: compress a PDF file"
3. If the user asks for something BigWow definitely doesn't support (e.g. "book a flight", "order pizza") → respond warmly: "I can only help with browser-based utility tools. That's outside what BigWow does, but here's what I CAN help with: [give 2-3 examples]."
4. If the user asks for a tool that sounds plausible but is not in our 101-tool library → say warmly: "That specific tool isn't available yet — it's on our roadmap 🚀 For now, here are some related tools I can open for you: [suggest alternatives]."
5. Keep ALL responses concise (under 80 words). Be friendly, helpful, and direct.
6. Never break character or reveal you are an AI model. You are BigWowAI.`;

  // Build messages for the API — keep last 8 messages for context window
  const trimmedHistory = messages.slice(-8);
  const apiMessages = [
    { role: "system" as const, content: systemPrompt },
    ...trimmedHistory.map((m: ChatAPIMessage) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  ];

  try {
    const res = await fetch(NVIDIA_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: apiMessages,
        temperature: 0.4,
        max_tokens: 256,
      }),
    });

    if (!res.ok) {
      console.error(`[agent/chat] NVIDIA error ${res.status}, falling back to local chat`);
      const fallback = await localChatResponse(messages, currentToolName);
      return NextResponse.json(fallback);
    }

    const data = await res.json();
    let rawReply: string = data?.choices?.[0]?.message?.content ?? "";

    // Strip DeepSeek <think> blocks
    rawReply = rawReply.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

    const shouldRoute = rawReply.startsWith("ROUTE:");
    const reply = shouldRoute
      ? rawReply.slice("ROUTE:".length).trim()
      : rawReply;

    return NextResponse.json({ reply, shouldRoute });
  } catch (err) {
    console.error("[agent/chat] Error, falling back to local chat:", err);
    const fallback = await localChatResponse(messages, currentToolName);
    return NextResponse.json(fallback);
  }
}
