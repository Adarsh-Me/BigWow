"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Download,
  Image as ImageIcon,
  Sparkles,
  Loader2,
  Check,
  AlertCircle,
  ArrowRight,
  Shield,
  Zap,
  RotateCcw,
  Sliders,
  Mail,
  Grid
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface WaitlistEntry {
  email: string;
  timestamp: number;
}

export default function AIUpscaler() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  
  // Settings state
  const [scaleFactor, setScaleFactor] = useState<"2x" | "4x">("2x");
  const [modelType, setModelType] = useState<"standard" | "anime" | "portrait">("standard");
  const [denoiseLevel, setDenoiseLevel] = useState<number>(30);
  const [outputFormat, setOutputFormat] = useState<"png" | "jpeg">("png");

  // Flow states
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState<string>("");
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  
  // Fallback states
  const [fallbackResult, setFallbackResult] = useState<string | null>(null);
  const [fallbackDimensions, setFallbackDimensions] = useState<{ width: number; height: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (fallbackResult) URL.revokeObjectURL(fallbackResult);
    };
  }, [previewUrl, fallbackResult]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setFallbackResult(null);
    setShowWaitlist(false);

    // Get image dimensions
    const img = new window.Image();
    img.onload = () => {
      setImageSize({ width: img.width, height: img.height });
    };
    img.src = url;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    }
  };

  // Run the AI upscale simulation
  const startAIUpscale = () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setWaitlistSubmitted(false);
    setEmailInput("");

    const steps = [
      "Initializing WebGPU execution environment...",
      "Analyzing image tensors & color spaces...",
      "Allocating GPU memory buffers (VRAM)...",
      "Running 4-layer super-resolution neural network (12%...)",
      "Running 4-layer super-resolution neural network (46%...)",
      "Running 4-layer super-resolution neural network (88%...)",
      "Applying face restoration & denoise pass tensors...",
      "Optimizing output matrix arrays..."
    ];

    let currentStep = 0;
    setProcessStep(steps[0]);

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setProcessStep(steps[currentStep]);
      } else {
        clearInterval(interval);
        setIsProcessing(false);
        setShowWaitlist(true);
      }
    }, 900);
  };

  // Run the working canvas-based fallback
  const runFallbackUpscale = () => {
    if (!selectedFile || !previewUrl || !imageSize) return;
    setIsProcessing(true);
    setProcessStep("Generating canvas context...");
    
    setTimeout(() => {
      const img = new window.Image();
      img.onload = () => {
        const factor = scaleFactor === "2x" ? 2 : 4;
        const targetWidth = imageSize.width * factor;
        const targetHeight = imageSize.height * factor;

        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Apply high-quality image smoothing for bilinear scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setFallbackResult(url);
            setFallbackDimensions({ width: targetWidth, height: targetHeight });
          }
          setIsProcessing(false);
        }, `image/${outputFormat}`);
      };
      img.src = previewUrl;
    }, 1000);
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    // Get current list
    const existing: WaitlistEntry[] = JSON.parse(
      localStorage.getItem("bigwow_upscaler_waitlist") || "[]"
    );
    existing.push({ email: emailInput.trim(), timestamp: Date.now() });
    
    // Save back
    localStorage.setItem("bigwow_upscaler_waitlist", JSON.stringify(existing));
    
    // Log to console for easy developer extraction
    console.log("Waitlist Signup Captured:", emailInput.trim(), existing);

    setWaitlistSubmitted(true);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setImageSize(null);
    setFallbackResult(null);
    setShowWaitlist(false);
  };

  const downloadResult = () => {
    if (!fallbackResult) return;
    const a = document.createElement("a");
    a.href = fallbackResult;
    a.download = `upscaled_${scaleFactor}_${selectedFile?.name || "image"}.${outputFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Helper to format bytes
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="w-full max-w-[1000px] mx-auto space-y-6 px-4 py-8 font-sans antialiased text-[#1a1c1e] dark:text-[#f8fafc]">
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-150/40 dark:border-slate-850 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 dark:bg-accent/15 text-[11px] font-bold text-accent tracking-wide uppercase">
            <Zap className="h-3.5 w-3.5" />
            AI Super Resolution
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">AI Image Upscaler</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold">
            Enhance and multiply image resolutions locally. 100% private, no image uploads.
          </p>
        </div>

        {selectedFile && !isProcessing && (
          <Button
            onClick={handleReset}
            variant="ghost"
            className="rounded-xl border border-gray-200 dark:border-slate-800 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-900"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-2" />
            Reset Workbench
          </Button>
        )}
      </div>

      {!selectedFile ? (
        /* Upload Area */
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900/60 p-12 text-center cursor-pointer hover:border-accent/40 dark:hover:border-accent/30 hover:shadow-sm transition-all duration-300 min-h-[350px] relative overflow-hidden group"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-accent/5 blur-[80px] pointer-events-none" />
          
          <div className="flex flex-col items-center gap-4 relative z-10">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-850 text-slate-500 group-hover:scale-105 group-hover:text-accent transition-all duration-300 border border-gray-100 dark:border-slate-800 shadow-sm">
              <Upload className="h-7 w-7" />
            </div>
            <div className="space-y-1.5 max-w-sm">
              <h3 className="font-extrabold text-[15px]">Select or drop image</h3>
              <p className="text-xs text-slate-400 dark:text-slate-505 font-bold leading-normal">
                Supports PNG, JPG, WebP and HEIC up to 20MB. Fully local processing.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Workbench Area */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left panel: Image Preview */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative rounded-3xl border border-gray-150/40 dark:border-slate-805 bg-white dark:bg-slate-900 p-4 shadow-sm overflow-hidden flex flex-col items-center justify-center min-h-[300px] max-h-[500px]">
              {isProcessing ? (
                /* Processing overlay spinner */
                <div className="absolute inset-0 bg-white/95 dark:bg-slate-950/95 flex flex-col items-center justify-center gap-4 z-20 p-6">
                  <div className="relative flex items-center justify-center">
                    <Loader2 className="h-10 w-10 text-accent animate-spin" />
                    <Sparkles className="h-5 w-5 text-blue-500 absolute animate-pulse" />
                  </div>
                  <div className="space-y-1 text-center">
                    <h3 className="text-sm font-black tracking-tight">{processStep}</h3>
                    <p className="text-[11px] text-slate-400 dark:text-slate-505 font-bold">
                      GPU resources allocated locally
                    </p>
                  </div>
                </div>
              ) : null}

              {previewUrl && (
                /* Preview Image */
                <img
                  src={fallbackResult || previewUrl}
                  alt="Workbench Source Preview"
                  className="max-h-[360px] max-w-full rounded-xl object-contain shadow-sm border border-gray-100 dark:border-slate-800"
                />
              )}

              {/* Status information */}
              {imageSize && (
                <div className="mt-4 flex flex-wrap gap-2 justify-center text-[11px] text-slate-400 dark:text-slate-505 font-black uppercase tracking-wider">
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-850">
                    Input: {imageSize.width} × {imageSize.height}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-850">
                    File: {formatBytes(selectedFile.size)}
                  </span>
                  {fallbackResult && fallbackDimensions && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 font-extrabold border border-emerald-500/20">
                      Output: {fallbackDimensions.width} × {fallbackDimensions.height} (Canvas Resized)
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Privacy note */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/15 text-[12px] text-emerald-700 dark:text-emerald-400 font-bold leading-normal">
              <Shield className="h-4.5 w-4.5 shrink-0 text-emerald-500" />
              <span>
                Privacy Secured: All calculations run locally in your browser cache. The image never leaves your computer.
              </span>
            </div>
          </div>

          {/* Right panel: Settings & Actions */}
          <div className="lg:col-span-5 space-y-4">
            {showWaitlist ? (
              /* Waitlist Capture Card */
              <div className="rounded-3xl border border-blue-500/20 bg-blue-500/5 p-6 space-y-5 relative overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-3 duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-blue-500/10 blur-xl pointer-events-none" />
                
                <div className="space-y-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    <AlertCircle className="h-5.5 w-5.5" />
                  </div>
                  <h3 className="font-extrabold text-[15px] tracking-tight">
                    Local WebGPU Required
                  </h3>
                  <p className="text-xs leading-[1.5] text-slate-500 dark:text-slate-400 font-semibold">
                    Calculations require advanced local WebGPU/VRAM parameters. To run this super-resolution neural network at 60 FPS offline in your browser, we are currently testing our optimized WebGPU-powered local upscaler engine with a limited cohort.
                  </p>
                </div>

                {!waitlistSubmitted ? (
                  <form onSubmit={handleWaitlistSubmit} className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="Enter email to get early access..."
                        className="w-full text-xs font-bold pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 shadow-sm"
                    >
                      Join WebGPU Denoise Beta <ArrowRight className="ml-2 h-3.5 w-3.5" />
                    </Button>
                  </form>
                ) : (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                    <Check className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                    <span>You're on the list! We'll notify you when the model is ready.</span>
                  </div>
                )}

                <div className="border-t border-blue-500/15 pt-3.5">
                  <p className="text-[10px] text-slate-400 dark:text-slate-505 font-bold leading-normal">
                    Or you can still use the{" "}
                    <button
                      type="button"
                      onClick={runFallbackUpscale}
                      className="text-blue-500 underline font-black hover:text-blue-600"
                    >
                      standard browser-based resize fallback (bilinear)
                    </button>{" "}
                    to scale and download right now.
                  </p>
                </div>
              </div>
            ) : fallbackResult ? (
              /* Completed Fallback Output Options */
              <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-5 shadow-sm animate-in fade-in duration-300">
                <div className="space-y-1.5">
                  <h3 className="font-extrabold text-[15px] tracking-tight flex items-center gap-2">
                    <Check className="h-5 w-5 text-emerald-500" />
                    Upscaling complete!
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    The image was scaled using the browser canvas rendering engine.
                  </p>
                </div>
                
                <div className="space-y-2.5">
                  <Button
                    onClick={downloadResult}
                    className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 shadow-sm flex items-center justify-center"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Image
                  </Button>
                  
                  <Button
                    onClick={() => setFallbackResult(null)}
                    variant="ghost"
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-800 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-900"
                  >
                    <RotateCcw className="mr-2 h-3.5 w-3.5" />
                    Scale Again / Adjust Settings
                  </Button>
                </div>
              </div>
            ) : (
              /* Regular settings panel */
              <div className="rounded-3xl border border-gray-150/40 dark:border-slate-805 bg-white dark:bg-slate-900 p-6 space-y-6 shadow-sm">
                <div className="flex items-center gap-2 border-b border-gray-100 dark:border-slate-850 pb-3">
                  <Sliders className="h-4.5 w-4.5 text-accent" />
                  <h3 className="font-extrabold text-[14px]">Upscaler Parameters</h3>
                </div>

                {/* Scale factor selection */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-505 block">
                    Scale Factor
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "2x", label: "Double (2x Resolution)" },
                      { value: "4x", label: "Quadruple (4x Super Resolution)" }
                    ].map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setScaleFactor(item.value as "2x" | "4x")}
                        className={cn(
                          "px-3.5 py-2.5 rounded-xl text-xs font-bold border text-center transition-all",
                          scaleFactor === item.value
                            ? "bg-accent/10 border-accent text-accent"
                            : "border-gray-200 dark:border-slate-800 hover:bg-slate-55 dark:hover:bg-slate-850"
                        )}
                      >
                        {item.value}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Model selector */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-505 block">
                    AI Upscale Model Preset
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: "standard", name: "Standard Super-Resolution", desc: "Balanced details and artifact clean up" },
                      { id: "anime", name: "Anime & Digital Art", desc: "Preserves sharp lines and vector-like shading" },
                      { id: "portrait", name: "Portrait & Face Restore", desc: "Adds face details and cleans eyes/pores (Slow)" }
                    ].map((model) => (
                      <button
                        key={model.id}
                        type="button"
                        onClick={() => setModelType(model.id as "standard" | "anime" | "portrait")}
                        className={cn(
                          "w-full text-left p-3.5 rounded-xl border transition-all flex flex-col gap-0.5",
                          modelType === model.id
                            ? "bg-accent/5 border-accent text-[#1a1c1e] dark:text-white"
                            : "border-gray-150/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850"
                        )}
                      >
                        <span className="text-xs font-black tracking-tight flex items-center gap-1.5">
                          {model.name}
                          {modelType === model.id && (
                            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                          )}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold leading-normal">
                          {model.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Denoise slider mockup */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-505">
                    <span>Clean Noise & Artifacts</span>
                    <span className="text-accent">{denoiseLevel}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={denoiseLevel}
                    onChange={(e) => setDenoiseLevel(Number(e.target.value))}
                    className="w-full accent-accent h-1 bg-gray-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-[9px] text-slate-400 dark:text-slate-505 font-bold leading-normal">
                    Higher denoise levels smooth out JPEG compression relics but may soften minor textures.
                  </p>
                </div>

                {/* Output format */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-505 block">
                    Output Format
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "png", name: "PNG (Lossless)" },
                      { id: "jpeg", name: "JPEG (Custom Quality)" }
                    ].map((fmt) => (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => setOutputFormat(fmt.id as "png" | "jpeg")}
                        className={cn(
                          "px-3 py-2 rounded-xl text-xs font-bold border text-center transition-all",
                          outputFormat === fmt.id
                            ? "bg-accent/10 border-accent text-accent"
                            : "border-gray-200 dark:border-slate-800 hover:bg-slate-55 dark:hover:bg-slate-850"
                        )}
                      >
                        {fmt.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CTA Action buttons */}
                <div className="space-y-2.5 pt-3 border-t border-gray-100 dark:border-slate-850">
                  <Button
                    onClick={startAIUpscale}
                    className="w-full rounded-xl bg-gradient-to-r from-accent to-blue-600 dark:from-accent dark:to-blue-500 hover:opacity-95 text-white text-xs font-bold py-3 shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="h-4 w-4" />
                    Upscale with AI Model
                  </Button>

                  <button
                    type="button"
                    onClick={runFallbackUpscale}
                    className="w-full text-center py-2.5 text-[11px] font-bold text-slate-450 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-205 transition-colors border border-dashed border-gray-200 dark:border-slate-800 rounded-xl"
                  >
                    Use standard bilinear canvas scale
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
