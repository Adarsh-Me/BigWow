"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Loader2, Download, Video, Music,
  AlertCircle, CheckCircle, Info,
  Film, ImagePlay, Mic,
} from "lucide-react";

type Platform = "youtube" | "tiktok" | "instagram" | "twitter" | "reddit" | "soundcloud" | "universal";

// Icons resolved internally — never passed from Server Components
const PLATFORM_ICONS: Record<Platform, React.ComponentType<{ className?: string }>> = {
  youtube:    Video,
  tiktok:     Film,
  instagram:  ImagePlay,
  twitter:    Download,
  reddit:     Download,
  soundcloud: Music,
  universal:  Download,
};

interface BaseVideoDownloaderProps {
  platform: Platform;
  title: string;
  description: string;
  placeholder: string;
  accentColor: string;
}

export default function BaseVideoDownloader({
  platform,
  title,
  description,
  placeholder,
  accentColor,
}: BaseVideoDownloaderProps) {
  const IconComponent = PLATFORM_ICONS[platform];
  const [videoUrl, setVideoUrl] = useState("");
  const [format, setFormat] = useState(platform === "soundcloud" ? "audio" : "video"); // "video" | "audio"
  const [quality, setQuality] = useState("1080"); // "1080" | "720" | "480" | "360"
  const [noWatermark, setNoWatermark] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);

  // Dynamic CSS variables mapper
  const colorMap: Record<string, { bg: string; text: string; ring: string; border: string; hover: string }> = {
    red: {
      bg: "bg-red-500/10 dark:bg-red-500/10",
      text: "text-red-500 dark:text-red-400",
      ring: "focus-visible:ring-red-500",
      border: "border-red-500/20",
      hover: "hover:bg-red-600 bg-red-500 text-white",
    },
    cyan: {
      bg: "bg-cyan-500/10 dark:bg-cyan-500/10",
      text: "text-cyan-500 dark:text-cyan-400",
      ring: "focus-visible:ring-cyan-500",
      border: "border-cyan-500/20",
      hover: "hover:bg-cyan-600 bg-cyan-500 text-white",
    },
    pink: {
      bg: "bg-rose-500/10 dark:bg-rose-500/10",
      text: "text-rose-500 dark:text-rose-400",
      ring: "focus-visible:ring-rose-500",
      border: "border-rose-500/20",
      hover: "hover:bg-rose-600 bg-rose-500 text-white",
    },
    slate: {
      bg: "bg-slate-500/10 dark:bg-slate-500/10",
      text: "text-slate-600 dark:text-slate-400",
      ring: "focus-visible:ring-slate-500",
      border: "border-slate-500/20",
      hover: "hover:bg-slate-700 bg-slate-600 text-white",
    },
    orange: {
      bg: "bg-orange-500/10 dark:bg-orange-500/10",
      text: "text-orange-500 dark:text-orange-400",
      ring: "focus-visible:ring-orange-500",
      border: "border-orange-500/20",
      hover: "hover:bg-orange-600 bg-orange-500 text-white",
    },
    indigo: {
      bg: "bg-accent/10",
      text: "text-accent",
      ring: "focus-visible:ring-accent",
      border: "border-accent/20",
      hover: "hover:bg-accent/90 bg-accent text-accent-foreground",
    },
  };

  const activeColor = colorMap[accentColor] || colorMap.indigo;

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setVideoUrl(text);
      setError(null);
      setDownloadLink(null);
    } catch (err) {
      // clipboard read failed silently
    }
  };

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim()) {
      setError("Please paste a valid URL.");
      return;
    }

    // Platform validation
    const lowerUrl = videoUrl.toLowerCase();
    if (platform === "youtube" && !lowerUrl.includes("youtube.com") && !lowerUrl.includes("youtu.be")) {
      setError("Please paste a valid YouTube URL (youtube.com or youtu.be).");
      return;
    }
    if (platform === "tiktok" && !lowerUrl.includes("tiktok.com")) {
      setError("Please paste a valid TikTok URL.");
      return;
    }
    if (platform === "instagram" && !lowerUrl.includes("instagram.com")) {
      setError("Please paste a valid Instagram URL.");
      return;
    }
    if (platform === "twitter" && !lowerUrl.includes("twitter.com") && !lowerUrl.includes("x.com")) {
      setError("Please paste a valid Twitter/X URL.");
      return;
    }
    if (platform === "reddit" && !lowerUrl.includes("reddit.com")) {
      setError("Please paste a valid Reddit URL.");
      return;
    }
    if (platform === "soundcloud" && !lowerUrl.includes("soundcloud.com")) {
      setError("Please paste a valid SoundCloud URL.");
      return;
    }

    setLoading(true);
    setError(null);
    setDownloadLink(null);

    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: videoUrl.trim(),
          videoQuality: quality,
          downloadMode: format === "audio" ? "audio" : "auto",
          audioFormat: "mp3",
          filenameStyle: "pretty",
          ...(platform === "tiktok" && noWatermark ? { tiktokFullAudio: true } : {}),
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      if (!data.url) {
        throw new Error("No download URL returned by server.");
      }

      setDownloadLink(data.url);
      window.open(data.url, "_blank", "noopener,noreferrer");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 font-body">
      <div className="mb-8 text-center">
        <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${activeColor.bg} ${activeColor.text} mb-3`}>
          <IconComponent className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto">
          {description}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Downloader Form Card */}
        <Card className="md:col-span-2 border-border/40 bg-card/65 shadow-md backdrop-blur-sm">
          <CardContent className="p-6">
            <form onSubmit={handleDownload} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="url" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Paste Media URL
                </Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="url"
                      placeholder={placeholder}
                      value={videoUrl}
                      onChange={(e) => {
                        setVideoUrl(e.target.value);
                        setError(null);
                        setDownloadLink(null);
                      }}
                      className={`pr-16 h-11 border-border/40 bg-background/50 rounded-xl focus-visible:ring-2 ${activeColor.ring}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handlePaste}
                      className={`absolute right-1.5 top-1.5 h-8 px-3 rounded-lg hover:bg-secondary/60 text-xs font-semibold ${activeColor.text}`}
                    >
                      Paste
                    </Button>
                  </div>
                  <Button
                    type="submit"
                    disabled={loading || !videoUrl.trim()}
                    className={`h-11 px-5 rounded-xl font-semibold transition-all shadow-sm ${activeColor.hover}`}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Advanced Settings */}
              {platform !== "soundcloud" && (
                <div className="grid gap-6 sm:grid-cols-2 pt-4 border-t border-border/40">
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Format Mode
                    </Label>
                    <div className="flex gap-2">
                      {[
                        { label: "Video", value: "video", icon: Video },
                        { label: "Audio Only", value: "audio", icon: Music },
                      ].map(({ label, value, icon: Icon }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => { setFormat(value); setDownloadLink(null); }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            format === value
                              ? `${activeColor.hover} border-transparent`
                              : "border-border/40 bg-background/50 text-muted-foreground hover:bg-secondary/60"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" /> {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {format === "video" && (
                    <div className="space-y-3">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Max Quality
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { label: "1080p", value: "1080" },
                          { label: "720p", value: "720" },
                          { label: "480p", value: "480" },
                        ].map((item) => (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() => { setQuality(item.value); setDownloadLink(null); }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                              quality === item.value
                                ? `${activeColor.hover} border-transparent`
                                : "border-border/40 bg-background/50 text-muted-foreground hover:bg-secondary/60"
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Helper switches */}
              {platform === "tiktok" && (
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="watermark"
                    checked={noWatermark}
                    onCheckedChange={(checked) => setNoWatermark(checked === true)}
                  />
                  <Label htmlFor="watermark" className="text-xs font-medium cursor-pointer text-muted-foreground">
                    Remove watermark (TikTok if available)
                  </Label>
                </div>
              )}
            </form>

            {/* Status Feedback */}
            {error && (
              <div className="mt-6 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-500 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-xs font-medium leading-relaxed">{error}</div>
              </div>
            )}

            {downloadLink && (
              <div className="mt-6 p-4 rounded-xl border border-green-500/20 bg-green-500/5 text-green-600 dark:text-green-400 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-2">
                  <div className="text-xs font-medium">Download link extracted successfully!</div>
                  <Button
                    asChild
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs"
                  >
                    <a href={downloadLink} target="_blank" rel="noopener noreferrer">
                      Download File Directly
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Sidebar Card */}
        <Card className="border-border/40 bg-card/65 shadow-md backdrop-blur-sm">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Info className="w-4 h-4 text-accent" /> How It Works
            </h3>
            <div className="text-[12px] text-muted-foreground leading-relaxed space-y-2">
              <p>Powered by the open-source <strong>Cobalt</strong> engine. We automatically try multiple public servers to ensure the best availability.</p>
              <p>Files download directly to your browser from the source CDN — nothing is stored on our servers.</p>
              <p className="pt-2 text-[10px] text-muted-foreground/70">
                Public links only. Age-restricted, private, or region-blocked content may not be accessible.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
