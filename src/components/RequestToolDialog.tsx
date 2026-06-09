"use client";

import * as React from "react";
import { Hammer, Send } from "lucide-react";
import { siteConfig } from "@/lib/site";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const RECIPIENT_EMAIL = "studio365@zohomail.in";

type Priority = "Low" | "Medium" | "High";

interface RequestToolDialogProps {
  trigger?: React.ReactNode;
  triggerClassName?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function RequestToolDialog({
  trigger,
  triggerClassName,
  open,
  onOpenChange,
}: RequestToolDialogProps) {
  const [toolName, setToolName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [useCase, setUseCase] = React.useState("");
  const [priority, setPriority] = React.useState<Priority>("Medium");
  const [contactEmail, setContactEmail] = React.useState("");
  const [sending, setSending] = React.useState(false);

  const reset = React.useCallback(() => {
    setToolName("");
    setDescription("");
    setUseCase("");
    setPriority("Medium");
    setContactEmail("");
    setSending(false);
  }, []);

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange?.(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toolName.trim() || !description.trim()) return;
    setSending(true);

    const subject = `Tool Request: ${toolName.trim()}`;
    const lines = [
      "## Tool Request",
      "",
      `**Tool Name:** ${toolName.trim()}`,
      `**Priority:** ${priority}`,
      "",
      "**Description:**",
      description.trim(),
      "",
    ];
    if (useCase.trim()) {
      lines.push("**Use Case:**", useCase.trim(), "");
    }
    if (contactEmail.trim()) {
      lines.push(`**Reply to:** ${contactEmail.trim()}`, "");
    }
    lines.push(
      "---",
      `Sent from the Request-a-Tool form on ${siteConfig.baseUrl.replace(/^https?:\/\//, "")}`,
    );
    const body = lines.join("\n");

    const mailto = `mailto:${RECIPIENT_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;

    setTimeout(() => {
      setSending(false);
      handleOpenChange(false);
    }, 400);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 h-9 text-xs font-semibold tracking-tight transition-all hover:bg-secondary/60 active:scale-[0.98]",
              triggerClassName,
            )}
          >
            <Hammer className="h-3.5 w-3.5 text-muted-foreground" />
            Request a tool
          </button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[480px] gap-0 p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 dark:bg-accent/15 text-accent">
              <Hammer className="h-4 w-4" />
            </span>
            <div className="space-y-0.5">
              <DialogTitle className="text-base">Request a tool</DialogTitle>
              <DialogDescription className="text-xs">
                Tell us what you&apos;d like to see next. We read every submission.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div className="space-y-1.5">
            <label
              htmlFor="rt-name"
              className="text-xs font-semibold text-foreground"
            >
              Tool name <span className="text-accent">*</span>
            </label>
            <Input
              id="rt-name"
              value={toolName}
              onChange={(e) => setToolName(e.target.value)}
              placeholder="e.g. Markdown to PDF"
              maxLength={80}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="rt-desc"
              className="text-xs font-semibold text-foreground"
            >
              What should it do? <span className="text-accent">*</span>
            </label>
            <Textarea
              id="rt-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the tool's behavior, inputs, and outputs."
              rows={3}
              maxLength={600}
              required
            />
            <p className="text-[10px] text-muted-foreground">
              {description.length}/600
            </p>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="rt-usecase"
              className="text-xs font-semibold text-foreground"
            >
              Use case{" "}
              <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <Textarea
              id="rt-usecase"
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
              placeholder="How would this help you in your day-to-day?"
              rows={2}
              maxLength={300}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Priority
              </label>
              <div className="flex gap-1.5">
                {(["Low", "Medium", "High"] as Priority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={cn(
                      "flex-1 h-8 rounded-lg border text-[11px] font-bold transition-all",
                      priority === p
                        ? "border-accent bg-accent/10 text-accent dark:bg-accent/15"
                        : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="rt-email"
                className="text-xs font-semibold text-foreground"
              >
                Reply-to{" "}
                <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <Input
                id="rt-email"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="you@email.com"
              />
            </div>
          </div>
        </form>

        <DialogFooter className="px-6 py-4 border-t border-border/60 bg-muted/30 sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleOpenChange(false)}
            disabled={sending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={sending}
            onClick={handleSubmit}
            className="gap-1.5"
          >
            <Send className="h-3.5 w-3.5" />
            {sending ? "Opening email…" : "Open email to send"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
