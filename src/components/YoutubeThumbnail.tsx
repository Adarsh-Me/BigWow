"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Download, Image as ImageIcon, AlertCircle } from "lucide-react";

interface ThumbnailOption {
  key: string;
  name: string;
  url: string;
  resolution: string;
}

export default function YoutubeThumbnail() {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const extractVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\/shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleExtract = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setVideoId(null);

    if (!videoUrl.trim()) {
      setError("Please paste a valid YouTube URL first.");
      return;
    }

    const parsedId = extractVideoId(videoUrl.trim());
    if (parsedId) {
      setVideoId(parsedId);
    } else {
      setError("Invalid YouTube URL. Please make sure it contains a valid video ID.");
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setVideoUrl(text);
      setError(null);
      setVideoId(null);
    } catch (err) {
      // clipboard read failed
    }
  };

  const getThumbnails = (id: string): ThumbnailOption[] => {
    return [
      {
        key: "maxres",
        name: "Maximum Resolution (HD)",
        url: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
        resolution: "1280 x 720 (1080p/720p)",
      },
      {
        key: "standard",
        name: "Standard Definition",
        url: `https://img.youtube.com/vi/${id}/sddefault.jpg`,
        resolution: "640 x 480",
      },
      {
        key: "high",
        name: "High Quality",
        url: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
        resolution: "480 x 360",
      },
      {
        key: "medium",
        name: "Medium Quality",
        url: `https://img.youtube.com/vi/${id}/mqdefault.jpg`,
        resolution: "320 x 180",
      },
    ];
  };

  const downloadImage = async (url: string, filename: string) => {
    try {
      // Fetch the image via blob to force download window
      const response = await fetch(url);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      // Fallback to direct opening if CORS restricts fetch
      window.open(url, "_blank");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 font-body">
      <div className="mb-8 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent mb-3">
          <ImageIcon className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          YouTube Thumbnail Downloader
        </h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto">
          Extract and download all thumbnail qualities from any YouTube video or Shorts immediately. Run completely locally.
        </p>
      </div>

      <Card className="border-border/40 bg-card/65 shadow-md backdrop-blur-sm mb-8">
        <CardContent className="p-6">
          <form onSubmit={handleExtract} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="youtube-url" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Enter YouTube Video / Shorts URL
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="youtube-url"
                    placeholder="https://www.youtube.com/watch?v=... or shorts links"
                    value={videoUrl}
                    onChange={(e) => {
                      setVideoUrl(e.target.value);
                      setError(null);
                      setVideoId(null);
                    }}
                    className="pr-16 h-11 border-border/40 bg-background/50 rounded-xl"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handlePaste}
                    className="absolute right-1.5 top-1.5 h-8 px-3 rounded-lg hover:bg-secondary/60 text-xs font-semibold text-accent"
                  >
                    Paste
                  </Button>
                </div>
                <Button
                  type="submit"
                  className="h-11 px-6 bg-accent text-accent-foreground hover:bg-accent/90 transition-all font-semibold rounded-xl"
                >
                  Extract
                </Button>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-500 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-xs font-medium">{error}</div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {videoId && (
        <div className="grid gap-6 sm:grid-cols-2">
          {getThumbnails(videoId).map((thumb) => (
            <Card key={thumb.key} className="border-border/40 bg-card/50 shadow-sm overflow-hidden flex flex-col justify-between group">
              <div className="aspect-video bg-muted relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumb.url}
                  alt={thumb.name}
                  className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-300"
                  onError={(e) => {
                    // Hide option if thumbnail is missing (e.g. low res videos lack maxres)
                    (e.target as HTMLElement).parentElement?.parentElement?.parentElement?.classList.add("hidden");
                  }}
                />
                <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm rounded px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {thumb.resolution}
                </div>
              </div>
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-foreground truncate">{thumb.name}</h3>
                  <p className="text-[10px] text-muted-foreground">{thumb.resolution}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => downloadImage(thumb.url, `youtube-thumbnail-${videoId}-${thumb.key}.jpg`)}
                  className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg text-xs gap-1.5 shrink-0"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
