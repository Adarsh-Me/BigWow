"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Download, Upload, Camera, Trash2, ChevronLeft, ChevronRight, Play, Pause, Image as ImageIcon } from "lucide-react";

interface CapturedFrame {
  id: string;
  time: number;
  dataUrl: string;
}

export default function VideoFrameExtractor() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [frames, setFrames] = useState<CapturedFrame[]>([]);
  const [loading, setLoading] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up object URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (videoSrc) {
        URL.revokeObjectURL(videoSrc);
      }
    };
  }, [videoSrc]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      loadVideo(file);
    }
  };

  const loadVideo = (file: File) => {
    setLoading(true);
    setVideoFile(file);
    if (videoSrc) {
      URL.revokeObjectURL(videoSrc);
    }
    const url = URL.createObjectURL(file);
    setVideoSrc(url);
    setFrames([]);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
  };

  const onLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
    setLoading(false);
  };

  const onTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const seekRelative = (seconds: number) => {
    if (videoRef.current) {
      let nextTime = videoRef.current.currentTime + seconds;
      if (nextTime < 0) nextTime = 0;
      if (nextTime > duration) nextTime = duration;
      videoRef.current.currentTime = nextTime;
      setCurrentTime(nextTime);
    }
  };

  const captureFrame = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/png");
      const newFrame: CapturedFrame = {
        id: Math.random().toString(36).substring(2, 9),
        time: video.currentTime,
        dataUrl,
      };
      setFrames((prev) => [newFrame, ...prev]);
    }
  };

  const downloadFrame = (frame: CapturedFrame) => {
    const link = document.createElement("a");
    link.href = frame.dataUrl;
    link.download = `frame-${frame.time.toFixed(2)}s.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const deleteFrame = (id: string) => {
    setFrames((prev) => prev.filter((f) => f.id !== id));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 font-body">
      <div className="mb-8 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent mb-3">
          <Camera className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Video Frame Extractor
        </h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto">
          Extract high-resolution frames from local video files at exact timestamps. 100% private and client-side processing.
        </p>
      </div>

      {!videoSrc ? (
        <Card className="border-dashed border-border/60 bg-card/65 shadow-md backdrop-blur-sm p-12 text-center flex flex-col items-center justify-center min-h-[300px] rounded-2xl">
          <div className="h-14 w-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-4">
            <Upload className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-bold text-foreground mb-1">Upload Video File</h3>
          <p className="text-xs text-muted-foreground max-w-sm mb-6">
            Supports MP4, WebM, and Ogg files. Large files are handled entirely locally on your device without upload.
          </p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="video/mp4,video/webm,video/ogg"
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-accent text-accent-foreground hover:bg-accent/90 px-6 h-11 rounded-xl font-semibold shadow-sm"
          >
            Select Local Video
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Main workspace */}
          <div className="md:col-span-2 space-y-4">
            <Card className="overflow-hidden border-border/40 bg-card/65 shadow-md backdrop-blur-sm rounded-2xl">
              <div className="bg-black/90 aspect-video flex items-center justify-center relative">
                <video
                  ref={videoRef}
                  src={videoSrc}
                  onLoadedMetadata={onLoadedMetadata}
                  onTimeUpdate={onTimeUpdate}
                  onClick={togglePlay}
                  className="max-h-full max-w-full"
                />
                {loading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-accent" />
                  </div>
                )}
              </div>

              <CardContent className="p-5 space-y-4">
                {/* Timeline and scrubber */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-muted-foreground">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    step="0.001"
                    value={currentTime}
                    onChange={(e) => handleSeek(parseFloat(e.target.value))}
                    className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                </div>

                {/* Controls */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => seekRelative(-5)}
                      title="-5 seconds"
                      className="h-9 w-9 rounded-lg border-border/40"
                    >
                      -5s
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => seekRelative(-0.033)}
                      title="-1 frame (30fps)"
                      className="h-9 w-9 rounded-lg border-border/40"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={togglePlay}
                      className="h-9 w-9 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 border-0"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-accent" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => seekRelative(0.033)}
                      title="+1 frame (30fps)"
                      className="h-9 w-9 rounded-lg border-border/40"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => seekRelative(5)}
                      title="+5 seconds"
                      className="h-9 w-9 rounded-lg border-border/40"
                    >
                      +5s
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={captureFrame}
                      className="bg-accent text-accent-foreground hover:bg-accent/90 h-9 px-4 rounded-xl gap-1.5 font-bold text-xs"
                    >
                      <Camera className="w-4 h-4" /> Capture Frame
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setVideoSrc(null)}
                      className="h-9 rounded-xl border-border/40 text-xs font-semibold"
                    >
                      Change Video
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Captured frames list */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 pl-1">
              <ImageIcon className="w-4 h-4 text-accent" /> Captured Frames ({frames.length})
            </h3>

            {frames.length === 0 ? (
              <Card className="border-border/40 bg-card/65 p-8 text-center flex flex-col items-center justify-center min-h-[200px] rounded-2xl">
                <Camera className="w-6 h-6 text-muted-foreground/60 mb-2" />
                <p className="text-[11px] text-muted-foreground max-w-[150px] mx-auto leading-relaxed">
                  No frames captured yet. Use timeline or buttons to find a scene and click Capture.
                </p>
              </Card>
            ) : (
              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {frames.map((frame) => (
                  <Card key={frame.id} className="border-border/40 bg-card/65 overflow-hidden flex flex-col shadow-sm rounded-xl">
                    <div className="aspect-video relative bg-black/90">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={frame.dataUrl} alt={`Captured at ${frame.time}s`} className="w-full h-full object-contain" />
                      <span className="absolute bottom-1 right-1 bg-black/65 px-1 py-0.5 rounded text-[9px] text-white font-mono">
                        {formatTime(frame.time)}
                      </span>
                    </div>
                    <div className="p-2.5 flex items-center justify-between border-t border-border/40 bg-card">
                      <span className="text-[10px] text-muted-foreground font-mono">
                        Timestamp: {frame.time.toFixed(2)}s
                      </span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => downloadFrame(frame)}
                          className="h-7 w-7 rounded-lg text-accent hover:bg-accent/5 hover:text-accent"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteFrame(frame.id)}
                          className="h-7 w-7 rounded-lg text-red-500 hover:bg-red-500/5 hover:text-red-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
