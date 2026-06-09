"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Wrench, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import ChatSidebar from "./ChatSidebar";
import ToolWorkspace from "./ToolWorkspace";
import type { ChatMessage, ToolTab } from "@/types/chat";
import type { AgentToolSelection } from "@/types/agent";

interface ChatWorkspaceProps {
  initialPrompt: string;
  onExit: () => void;
}

let msgIdCounter = 0;
const genId = () => `msg-${++msgIdCounter}-${Date.now()}`;

let tabIdCounter = 0;
const genTabId = () => `tab-${++tabIdCounter}-${Date.now()}`;

const MAX_TABS = 8;

type OpenToolMeta = Pick<
  AgentToolSelection,
  "workflowId" | "workflowName" | "privacyMode" | "implementationStatus" | "requiresFile" | "nextPrompt"
>;

export default function ChatWorkspace({ initialPrompt, onExit }: ChatWorkspaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [tabs, setTabs] = useState<ToolTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);

  // Mobile tab: "chat" | "tool"
  const [mobileView, setMobileView] = useState<"chat" | "tool">("chat");

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? null;

  /** Add a user message bubble */
  const pushUser = (content: string) => {
    const msg: ChatMessage = { id: genId(), role: "user", content, timestamp: Date.now() };
    setMessages((prev) => [...prev, msg]);
    return msg;
  };

  /** Add an assistant message bubble */
  const pushAssistant = (
    content: string,
    extra?: Partial<Pick<ChatMessage, "toolOpened" | "isNotFound">>
  ) => {
    const msg: ChatMessage = {
      id: genId(),
      role: "assistant",
      content,
      timestamp: Date.now(),
      ...extra,
    };
    setMessages((prev) => [...prev, msg]);
    return msg;
  };

  /** Open a tool tab (or switch to it if already open) */
  const openToolTab = useCallback(
    (
      href: string,
      name: string,
      category: string,
      params?: Record<string, unknown>,
      meta?: OpenToolMeta
    ) => {
      setTabs((prev) => {
        const existing = prev.find((t) => t.href === href && t.workflowId === meta?.workflowId);
        if (existing) {
          setActiveTabId(existing.id);
          return prev;
        }
        const newTab: ToolTab = {
          id: genTabId(),
          href,
          name,
          category,
          params,
          workflowId: meta?.workflowId,
          workflowName: meta?.workflowName,
          privacyMode: meta?.privacyMode,
          implementationStatus: meta?.implementationStatus,
          requiresFile: meta?.requiresFile,
          nextPrompt: meta?.nextPrompt,
          openedAt: Date.now(),
        };
        const updated = [...prev, newTab];
        // Evict oldest if over cap
        const capped = updated.length > MAX_TABS ? updated.slice(updated.length - MAX_TABS) : updated;
        setActiveTabId(newTab.id);
        return capped;
      });
      // Switch mobile to tool view after opening
      setMobileView("tool");
    },
    []
  );

  /** Route a prompt via the AI router API */
  const routePrompt = useCallback(
    async (prompt: string) => {
      setIsThinking(true);
      try {
        const res = await fetch("/api/agent/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        });
        const data = await res.json();

        if (data.notFound || !data.tools?.length) {
          // Tool not found — reply in chat only
          pushAssistant(
            data.notFoundMessage ??
              "That specific tool isn't available yet — it's on our roadmap 🚀 Here are some things I CAN help with: compress a PDF, calculate expressions, remove image backgrounds, generate QR codes, convert files, and 95+ more tools.",
            { isNotFound: true }
          );
          return;
        }

        // Open each tool as a tab and compose the reply
        const toolChips = data.tools
          .slice(0, 3)
          .map((t: AgentToolSelection) => {
            openToolTab(t.href, t.name, t.category ?? "Tools", t.params, {
              workflowId: t.workflowId,
              workflowName: t.workflowName,
              privacyMode: t.privacyMode,
              implementationStatus: t.implementationStatus,
              requiresFile: t.requiresFile,
              nextPrompt: t.nextPrompt,
            });
            return t;
          });

        const firstName = toolChips[0]?.name ?? "the tool";
        const hasParams =
          toolChips[0]?.params && Object.keys(toolChips[0].params).length > 0;
        const paramHint = hasParams
          ? " I've pre-filled it with the values from your request."
          : "";

        const replyText =
          toolChips.length > 1
            ? `I've opened **${toolChips.length} tools** for you: ${toolChips.map((t: { name: string }) => t.name).join(" → ")}. Use the tabs on the right to switch between them.${paramHint}`
            : `**${firstName}** is ready on the right.${paramHint} ${toolChips[0]?.nextPrompt ?? data.reasoning ?? ""}`;

        pushAssistant(replyText, {
          toolOpened: {
            name: toolChips[0]?.name,
            href: toolChips[0]?.href,
            category: toolChips[0]?.category ?? "Tools",
          },
        });
      } catch {
        pushAssistant(
          "I couldn't connect to the AI router. Please check your connection and try again."
        );
      } finally {
        setIsThinking(false);
      }
    },
    [openToolTab]
  );

  /** Handle a new message from the sidebar input */
  const handleSend = useCallback(
    async (text: string) => {
      pushUser(text);
      setIsThinking(true);

      try {
        // Ask the conversational AI whether this is a follow-up or a new task
        const res = await fetch("/api/agent/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              ...messages.map((m) => ({ role: m.role, content: m.content })),
              { role: "user", content: text },
            ],
            currentToolName: activeTab?.name,
            currentToolHref: activeTab?.href,
          }),
        });
        const data = await res.json();

        if (data.shouldRoute) {
          // New task — route to a tool
          await routePrompt(data.reply);
        } else {
          // Follow-up — display the reply in chat
          setIsThinking(false);
          pushAssistant(data.reply);
        }
      } catch {
        setIsThinking(false);
        pushAssistant("Something went wrong. Please try again.");
      }
    },
    [messages, activeTab, routePrompt]
  );

  // Kick off the initial prompt once on mount via useEffect
  // useRef prevents double-fire in React Strict Mode
  const firedRef = useRef(false);
  useEffect(() => {
    if (firedRef.current || !initialPrompt) return;
    firedRef.current = true;
    pushUser(initialPrompt);
    routePrompt(initialPrompt);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-background">
      {/* ── Mobile tab switcher ──────────────────────────────── */}
      <div className="lg:hidden flex items-center gap-1 px-3 py-2 border-b border-border/60 bg-card shrink-0">
        <button
          onClick={() => setMobileView("chat")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all",
            mobileView === "chat"
              ? "bg-accent text-accent-foreground shadow-sm"
              : "text-muted-foreground hover:bg-secondary/60"
          )}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          AI Chat
        </button>
        <button
          onClick={() => setMobileView("tool")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all",
            mobileView === "tool"
              ? "bg-accent text-accent-foreground shadow-sm"
              : "text-muted-foreground hover:bg-secondary/60"
          )}
        >
          <Wrench className="h-3.5 w-3.5" />
          Tool
          {tabs.length > 0 && (
            <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent-foreground/20 text-[9px]">
              {tabs.length}
            </span>
          )}
        </button>
      </div>

      {/* ── Two-pane layout ──────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left: Chat sidebar */}
        <div
          className={cn(
            "flex flex-col overflow-hidden transition-all duration-300 ease-in-out shrink-0",
            // Desktop width and opacity transitions based on collapse state
            isChatCollapsed
              ? "lg:w-0 lg:opacity-0 lg:pointer-events-none"
              : "lg:w-[360px] lg:opacity-100",
            // Mobile: show/hide based on tab
            mobileView === "chat" ? "flex w-full" : "hidden lg:flex"
          )}
        >
          <ChatSidebar
            messages={messages}
            isThinking={isThinking}
            activeTab={activeTab}
            onSend={handleSend}
            onExit={onExit}
          />
        </div>

        {/* Collapse Sidebar Handle Button (Desktop only, visible when a tool is open) */}
        {tabs.length > 0 && (
          <button
            onClick={() => setIsChatCollapsed((prev) => !prev)}
            className={cn(
              "hidden lg:flex absolute top-1/2 -translate-y-1/2 z-50 h-16 w-4.5 items-center justify-center rounded-r-xl border border-l-0 border-border bg-card text-muted-foreground hover:text-foreground transition-all duration-300 shadow-md hover:bg-secondary/40 active:scale-95",
              isChatCollapsed ? "left-0" : "left-[360px]"
            )}
            title={isChatCollapsed ? "Expand chatbot" : "Collapse chatbot to full screen"}
            aria-label={isChatCollapsed ? "Expand chatbot" : "Collapse chatbot"}
          >
            {isChatCollapsed ? (
              <ChevronRight className="h-3 w-3" />
            ) : (
              <ChevronLeft className="h-3 w-3" />
            )}
          </button>
        )}

        {/* Right: Tool workspace */}
        <div
          className={cn(
            "flex flex-col overflow-hidden flex-1 transition-all duration-300 ease-in-out",
            // Mobile: show/hide based on tab
            mobileView === "tool" ? "flex" : "hidden lg:flex"
          )}
        >
          <ToolWorkspace
            tabs={tabs}
            activeTabId={activeTabId}
            onTabSelect={setActiveTabId}
            onTabClose={(id) => {
              setTabs((prev) => {
                const next = prev.filter((t) => t.id !== id);
                if (activeTabId === id) {
                  setActiveTabId(next[next.length - 1]?.id ?? null);
                }
                return next;
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}
