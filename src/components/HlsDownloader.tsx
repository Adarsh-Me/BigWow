"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Loader2, Download, Radio, AlertCircle, CheckCircle, Info } from "lucide-react";

export default function HlsDownloader() {
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setPlaylistUrl(text);
      setError(null);
      setSuccess(false);
    } catch (err) {
      // clipboard read failed
    }
  };

  const parseM3u8 = (content: string, baseUrl: string): string[] => {
    const lines = content.split("\n");
    const urls: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Ignore comment lines
      if (line.startsWith("#")) {
        continue;
      }

      // If it is a relative URL, resolve it against the playlist base URL
      if (line.startsWith("http://") || line.startsWith("https://")) {
        urls.push(line);
      } else {
        // Resolve relative path
        try {
          const resolved = new URL(line, baseUrl).href;
          urls.push(resolved);
        } catch (e) {
          // relative URL resolution failed, try raw concatenate
          const separator = baseUrl.endsWith("/") ? "" : "/";
          urls.push(`${baseUrl}${separator}${line}`);
        }
      }
    }

    return urls;
  };

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistUrl.trim()) {
      setError("Please enter a valid M3U8 URL.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setProgress(0);
    setStatusText("Fetching manifest index...");

    try {
      // 1. Fetch M3U8 manifest index
      const manifestRes = await fetch(playlistUrl.trim());
      if (!manifestRes.ok) {
        throw new Error("Failed to fetch HLS stream manifest index. Check CORS permissions on the source.");
      }

      const content = await manifestRes.text();
      if (!content.includes("#EXTM3U")) {
        throw new Error("Invalid playlist URL. The file is not a valid M3U8 playlist.");
      }

      // Find base URL path
      const parsedUrl = new URL(playlistUrl.trim());
      const baseUrl = parsedUrl.origin + parsedUrl.pathname.substring(0, parsedUrl.pathname.lastIndexOf("/"));

      // 2. Parse segment URLs
      let segmentUrls = parseM3u8(content, baseUrl);

      // If it's a master playlist that redirects to sub-playlists, resolve the first variant stream
      if (content.includes("#EXT-X-STREAM-INF")) {
        setStatusText("Master playlist detected. Resolving stream variant...");
        const firstVariantUrl = segmentUrls[0];
        if (!firstVariantUrl) {
          throw new Error("No media stream variants found in master playlist.");
        }
        
        // Fetch sub-playlist manifest
        const subRes = await fetch(firstVariantUrl);
        const subContent = await subRes.text();
        const subParsedUrl = new URL(firstVariantUrl);
        const subBaseUrl = subParsedUrl.origin + subParsedUrl.pathname.substring(0, subParsedUrl.pathname.lastIndexOf("/"));
        segmentUrls = parseM3u8(subContent, subBaseUrl);
      }

      if (segmentUrls.length === 0) {
        throw new Error("No media stream segments found in the playlist.");
      }

      setStatusText(`Found ${segmentUrls.length} stream segments. Downloading segments in parallel...`);

      // 3. Download segments in parallel batches (concurrency of 5 to avoid overloading)
      const concurrencyLimit = 5;
      const buffers: ArrayBuffer[] = new Array(segmentUrls.length);
      let downloadedCount = 0;

      for (let i = 0; i < segmentUrls.length; i += concurrencyLimit) {
        const batch = segmentUrls.slice(i, i + concurrencyLimit).map(async (url, index) => {
          const globalIndex = i + index;
          try {
            const res = await fetch(url);
            if (!res.ok) throw new Error();
            const buffer = await res.arrayBuffer();
            buffers[globalIndex] = buffer;
          } catch (err) {
            // Fill with empty array buffer to prevent crashing on missing segments
            buffers[globalIndex] = new ArrayBuffer(0);
          } finally {
            downloadedCount++;
            setProgress(Math.round((downloadedCount / segmentUrls.length) * 100));
            setStatusText(`Downloaded ${downloadedCount} of ${segmentUrls.length} stream segments...`);
          }
        });

        await Promise.all(batch);
      }

      // 4. Merge downloaded segments
      setStatusText("Merging segments into downloadable file...");
      const finalBlob = new Blob(buffers, { type: "video/mp2t" });
      const finalUrl = URL.createObjectURL(finalBlob);

      // 5. Trigger download file
      const link = document.createElement("a");
      link.href = finalUrl;
      link.download = "downloaded-stream.ts";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(finalUrl);

      setSuccess(true);
      setStatusText("HLS Stream Downloaded and Merged Successfully!");
    } catch (err: any) {
      setError(err.message || "An error occurred downloading HLS stream segments.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 font-body">
      <div className="mb-8 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent mb-3">
          <Radio className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          HLS / M3U8 Stream Downloader
        </h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto">
          Download HLS streams (.m3u8 links) directly in your browser. Segments are downloaded and combined without quality loss.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Downloader Form Card */}
        <Card className="md:col-span-2 border-border/40 bg-card/65 shadow-md backdrop-blur-sm">
          <CardContent className="p-6">
            <form onSubmit={handleDownload} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="m3u8-url" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Paste M3U8 Playlist URL
                </Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="m3u8-url"
                      placeholder="https://example.com/stream/index.m3u8"
                      value={playlistUrl}
                      onChange={(e) => {
                        setPlaylistUrl(e.target.value);
                        setError(null);
                        setSuccess(false);
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
                    disabled={loading || !playlistUrl.trim()}
                    className="h-11 px-5 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 transition-all font-semibold"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {loading && (
                <div className="space-y-2.5 pt-4">
                  <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                    <span>{statusText}</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </form>

            {error && (
              <div className="mt-6 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-500 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-xs font-medium leading-relaxed">{error}</div>
              </div>
            )}

            {success && (
              <div className="mt-6 p-4 rounded-xl border border-green-500/20 bg-green-500/5 text-green-600 dark:text-green-400 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-xs font-medium">{statusText}</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Sidebar Card */}
        <Card className="border-border/40 bg-card/65 shadow-md backdrop-blur-sm">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Info className="w-4 h-4 text-accent" /> How HLS Downloader Works
            </h3>
            <div className="text-[12px] text-muted-foreground leading-relaxed space-y-2">
              <p>HLS streams serve video sliced into hundreds of tiny binary segments (`.ts` files) indexed by a playlist manifest (`.m3u8`).</p>
              <p>This downloader parses that manifest index, fetches those individual segments in parallel directly, and concatenates them sequentially into a single file in memory.</p>
              <p className="font-semibold text-foreground/80">Note: The source host must allow CORS (Cross-Origin Resource Sharing) requests, otherwise files cannot be fetched directly in the browser.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
