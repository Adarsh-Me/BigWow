"use client";

import { useState, useRef } from "react";
import { Upload, Mic, ArrowRight, Sparkles, X, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

interface AgentInputProps {
  onSubmit: (query: string, file: File | null) => void;
  isLoading?: boolean;
}

export default function AgentInput({ onSubmit, isLoading = false }: AgentInputProps) {
  const [query, setQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const examples = [
    { label: "Compress PDF", query: "compress my PDF file to reduce its size" },
    { label: "Remove background", query: "remove the background from my image" },
    { label: "BG removal + resize", query: "remove background from image then resize it to 1000x1000 square" },
    { label: "Generate invoice", query: "create a professional invoice for my freelance work" },
    { label: "Format JSON", query: "format and validate my JSON data" },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() && !selectedFile) return;
    onSubmit(query, selectedFile);
  };

  const handleExampleClick = (exampleQuery: string) => {
    setQuery(exampleQuery);
    onSubmit(exampleQuery, selectedFile);
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Mock voice activation
      setQuery("Listening...");
      setTimeout(() => {
        setQuery("Remove background from my portrait image");
        setIsRecording(false);
      }, 2500);
    } else {
      setIsRecording(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleFormSubmit} className="space-y-4 animate-slide-up">
        <div className="relative group">
          {/* Outer Border Glow Wrapper */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/20 to-accent/10 rounded-2xl blur opacity-30 group-focus-within:opacity-100 transition duration-300" />
          
          <div className="relative flex flex-col w-full rounded-2xl border border-border/80 bg-card p-4 shadow-[0_12px_40px_rgba(15,23,42,0.03)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.15)] group-focus-within:border-accent/40 transition duration-200">
            
            {/* Upper text input area */}
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask AI anything — 'calculate 20 × 500', 'compress a PDF', 'remove background'…"
              rows={2}
              className="w-full resize-none bg-transparent py-2 text-base font-medium text-foreground outline-none placeholder:text-muted-foreground/60 min-h-[50px] max-h-[160px]"
              disabled={isLoading || isRecording}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleFormSubmit(e);
                }
              }}
            />

            {/* Display Selected File Chip if any */}
            {selectedFile && (
              <div className="flex items-center gap-2 self-start bg-accent/5 border border-accent/10 rounded-full px-3 py-1 text-xs font-semibold text-accent mb-3 animate-fade-in">
                <Paperclip className="h-3.5 w-3.5" />
                <span className="truncate max-w-[200px]">{selectedFile.name}</span>
                <button
                  type="button"
                  onClick={removeFile}
                  className="rounded-full p-0.5 hover:bg-accent/10 text-accent/80 transition"
                  aria-label="Remove file"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            {/* Lower buttons action bar */}
            <div className="flex items-center justify-between border-t border-border/40 pt-3">
              <div className="flex items-center gap-2">
                
                {/* Upload File Button */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={triggerFileUpload}
                  className="inline-flex items-center gap-2 rounded-xl bg-secondary/80 border border-border/30 px-3.5 py-2 text-xs font-semibold text-foreground/80 transition-all hover:bg-secondary active:scale-98"
                  disabled={isLoading}
                >
                  <Upload className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Upload File</span>
                </button>

                {/* Voice Input Button */}
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold border transition-all active:scale-98",
                    isRecording
                      ? "bg-rose-50 border-rose-200 text-rose-600 animate-pulse"
                      : "bg-secondary/80 border-border/30 text-foreground/80 hover:bg-secondary"
                  )}
                  disabled={isLoading}
                >
                  <Mic className="h-3.5 w-3.5" />
                  <span>{isRecording ? "Listening..." : "Voice Input"}</span>
                </button>
              </div>

              {/* Submit Action Button */}
              <button
                type="submit"
                disabled={isLoading || (!query.trim() && !selectedFile)}
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center rounded-xl transition-all active:scale-95",
                  (query.trim() || selectedFile) && !isLoading
                    ? "bg-accent text-accent-foreground shadow-sm hover:opacity-90"
                    : "bg-secondary text-muted-foreground/45 cursor-not-allowed border border-border/20"
                )}
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Try examples selection chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
          <span className="text-muted-foreground/75 font-medium mr-1">Try these:</span>
          {examples.map((ex) => (
            <button
              key={ex.label}
              type="button"
              onClick={() => handleExampleClick(ex.query)}
              className="rounded-full border border-border/80 bg-card/60 px-3.5 py-1.5 font-medium text-foreground/70 transition-all hover:border-accent hover:text-accent hover:bg-accent/5 active:scale-98"
              disabled={isLoading}
            >
              {ex.label}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}
