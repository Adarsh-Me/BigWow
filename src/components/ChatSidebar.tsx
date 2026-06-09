"use client";

import { useEffect, useRef, useState } from "react";
import {
  Sparkles,
  ArrowLeft,
  Send,
  Wrench,
  AlertTriangle,
  Loader2,
  Bot,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage, ToolTab } from "@/types/chat";

interface ChatSidebarProps {
  messages: ChatMessage[];
  isThinking: boolean;
  activeTab: ToolTab | null;
  onSend: (text: string) => void;
  onExit: () => void;
}

export default function ChatSidebar({
  messages,
  isThinking,
  activeTab,
  onSend,
  onExit,
}: ChatSidebarProps) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isThinking) return;
    setInput("");
    onSend(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatTime = (ts: number) =>
    new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <aside className="flex flex-col h-full bg-card border-r border-border">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/60 bg-secondary/10 shrink-0">
        <button
          onClick={onExit}
          className="flex items-center justify-center h-8 w-8 rounded-xl bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all active:scale-95"
          aria-label="Back to home"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-foreground leading-none">BigWowAI</p>
            <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
              {activeTab ? `Using: ${activeTab.name}` : "Ready to help"}
            </p>
          </div>
        </div>
        {/* Live indicator */}
        <div className="ml-auto flex items-center gap-1.5 shrink-0">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-[10px] font-semibold text-accent">LIVE</span>
        </div>
      </div>

      {/* ── Messages ───────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 scroll-smooth">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex gap-2", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
            {/* Avatar */}
            <div className={cn(
              "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold mt-0.5",
              msg.role === "user"
                ? "bg-accent/10 text-accent"
                : "bg-secondary text-muted-foreground"
            )}>
              {msg.role === "user"
                ? <User className="h-3 w-3" />
                : <Bot className="h-3 w-3" />}
            </div>

            <div className={cn("flex flex-col max-w-[82%]", msg.role === "user" ? "items-end" : "items-start")}>
              {/* Timestamp */}
              <span className="text-[9px] text-muted-foreground/60 mb-1 px-1 font-medium">
                {msg.role === "user" ? "You" : "BigWowAI"} · {formatTime(msg.timestamp)}
              </span>

              {/* Tool-opened chip */}
              {msg.toolOpened && (
                <div className="flex items-center gap-1.5 mb-1.5 px-2.5 py-1.5 rounded-xl bg-accent/8 border border-accent/15 text-[10px] font-semibold text-accent">
                  <Wrench className="h-3 w-3 shrink-0" />
                  <span>{msg.toolOpened.name} opened</span>
                  <span className="text-accent/50">·</span>
                  <span className="text-accent/70">{msg.toolOpened.category}</span>
                </div>
              )}

              {/* Bubble */}
              <div
                className={cn(
                  "rounded-2xl px-3 py-2.5 text-xs leading-relaxed break-words",
                  msg.role === "user"
                    ? "bg-accent text-accent-foreground rounded-tr-sm"
                    : msg.isNotFound
                    ? "bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/30 text-amber-800 dark:text-amber-300 rounded-tl-sm"
                    : "bg-secondary/60 border border-border/40 text-foreground rounded-tl-sm"
                )}
              >
                {msg.isNotFound && (
                  <div className="flex items-center gap-1.5 mb-1.5 text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="h-3 w-3 shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-wide">Not yet available</span>
                  </div>
                )}
                <span
                  dangerouslySetInnerHTML={{
                    __html: msg.content
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                      .replace(/\*(.*?)\*/g, "<em>$1</em>")
                      .replace(/\n/g, "<br/>"),
                  }}
                />
              </div>
            </div>
          </div>
        ))}

        {/* Thinking indicator */}
        {isThinking && (
          <div className="flex gap-2 items-start">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground mt-0.5">
              <Bot className="h-3 w-3" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[9px] text-muted-foreground/60 mb-1 px-1 font-medium">BigWowAI</span>
              <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm bg-secondary/60 border border-border/40 px-3 py-2.5">
                <Loader2 className="h-3 w-3 animate-spin text-accent" />
                <span className="text-xs text-muted-foreground">Thinking…</span>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input ──────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="shrink-0 px-3 py-3 border-t border-border/60 bg-card">
        <div className="relative flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              activeTab
                ? `Ask about ${activeTab.name} or request a new tool…`
                : "Ask AI to open any tool…"
            }
            rows={1}
            disabled={isThinking}
            className="flex-1 resize-none rounded-xl border border-border/80 bg-background px-3 py-2.5 text-xs text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition disabled:opacity-50 min-h-[38px] max-h-[120px] leading-relaxed"
            style={{ height: "38px" }}
            onInput={(e) => {
              const t = e.currentTarget;
              t.style.height = "38px";
              t.style.height = Math.min(t.scrollHeight, 120) + "px";
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isThinking}
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all active:scale-95",
              input.trim() && !isThinking
                ? "bg-accent text-accent-foreground shadow-sm hover:opacity-90"
                : "bg-secondary text-muted-foreground/40 cursor-not-allowed"
            )}
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="text-[9px] text-muted-foreground/50 mt-1.5 px-1">
          Enter to send · Shift+Enter for new line
        </p>
      </form>
    </aside>
  );
}
