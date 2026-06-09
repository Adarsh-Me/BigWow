"use client";

import dynamic from "next/dynamic";
import React from "react";

// Loading component for lazy loading suspense built using native React.createElement to support pure TS syntax
const LoadingFallback = () => 
  React.createElement("div", { className: "flex h-64 w-full items-center justify-center" },
    React.createElement("div", { className: "flex flex-col items-center gap-3" },
      React.createElement("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" }),
      React.createElement("p", { className: "text-xs text-muted-foreground animate-pulse" }, "Mounting workspace component...")
    )
  );

const BaseVideoDownloader = dynamic(() => import("@/components/BaseVideoDownloader"), { loading: LoadingFallback, ssr: false });
const HlsDownloader = dynamic(() => import("@/components/HlsDownloader"), { loading: LoadingFallback, ssr: false });
const YoutubeThumbnail = dynamic(() => import("@/components/YoutubeThumbnail"), { loading: LoadingFallback, ssr: false });
const VideoFrameExtractor = dynamic(() => import("@/components/VideoFrameExtractor"), { loading: LoadingFallback, ssr: false });

export const ToolRegistry: Record<string, React.ComponentType<any>> = {
  "/tools/age-calculator": dynamic(() => import("@/components/AgeCalculator"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/ai-cost-calculator": dynamic(() => import("@/components/AICostCalculator"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/ai-instruction-diff": dynamic(() => import("@/components/AIInstructionDiff"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/ai-rules-generator": dynamic(() => import("@/components/AIRulesGenerator"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/aspect-ratio": dynamic(() => import("@/components/AspectRatioCalculator"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/audio": dynamic(() => import("@/components/AudioEditor"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/barcode-generator": dynamic(() => import("@/components/BarcodeGenerator"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/barcode-scanner": dynamic(() => import("@/components/BarcodeScanner"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/base64": dynamic(() => import("@/components/Base64Converter"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/bg-removal": dynamic(() => import("@/components/BgRemoval"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/bmi-calculator": dynamic(() => import("@/components/BmiCalculator"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/calculator": dynamic(() => import("@/components/Calculator"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/chmod": dynamic(() => import("@/components/ChmodCalculator"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/claude-md-generator": dynamic(() => import("@/components/ClaudeMdGenerator"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/code-format": dynamic(() => import("@/components/CodeHighlighter"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/color-blindness": dynamic(() => import("@/components/ColorBlindnessSimulator"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/color-converter": dynamic(() => import("@/components/ColorConverter"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/color-correction": dynamic(() => import("@/components/ColorCorrection"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/color-palette": dynamic(() => import("@/components/ColorPaletteGenerator"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/compress-video": dynamic(() => import("@/components/CompressVideo"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/context-window": dynamic(() => import("@/components/ContextWindowCalculator"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/contrast-checker": dynamic(() => import("@/components/ContrastChecker"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/cron-parser": dynamic(() => import("@/components/CronParser"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/css-gradient": dynamic(() => import("@/components/CssGradientGenerator"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/css-minifier": dynamic(() => import("@/components/CssMinifier"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/css-shadow": dynamic(() => import("@/components/CssShadow"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/currency-converter": dynamic(() => import("@/components/CurrencyConverter"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/emoji-picker": dynamic(() => import("@/components/EmojiPicker"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/exif-viewer": dynamic(() => import("@/components/ExifViewer"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/expense-tracker": dynamic(() => import("@/components/ExpenseTracker"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/fake-data": dynamic(() => import("@/components/FakeDataGenerator"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/file-converter": dynamic(() => import("@/components/FileConverter"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/habit-tracker": dynamic(() => import("@/components/HabitTracker"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/hash-generator": dynamic(() => import("@/components/HashGenerator"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/html-formatter": dynamic(() => import("@/components/HtmlFormatter"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/http-status": dynamic(() => import("@/components/HttpStatusCodes"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/image-compression": dynamic(() => import("@/components/ImageCompression"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/image-converter": dynamic(() => import("@/components/ImageConverter"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/image-resizer": dynamic(() => import("@/components/ImageResizer"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/invoice": dynamic(() => import("@/components/InvoiceGenerator"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/json-csv": dynamic(() => import("@/components/JsonCsvConverter"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/json-formatter": dynamic(() => import("@/components/JsonFormatter"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/json-schema-builder": dynamic(() => import("@/components/JsonSchemaBuilder"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/json-to-ts": dynamic(() => import("@/components/JsonToTs"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/jwt-decoder": dynamic(() => import("@/components/JWTDecoder"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/keep-awake": dynamic(() => import("@/components/KeepAwake"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/loan-calculator": dynamic(() => import("@/components/LoanCalculator"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/lorem-ipsum": dynamic(() => import("@/components/LoremIpsumGenerator"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/markdown-editor": dynamic(() => import("@/components/MarkdownEditor"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/markdown-html": dynamic(() => import("@/components/MarkdownToHtml"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/markdown-table": dynamic(() => import("@/components/MarkdownTableGenerator"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/mcp-config": dynamic(() => import("@/components/McpConfigGenerator"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/mermaid": dynamic(() => import("@/components/MermaidViewer"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/meta-tags": dynamic(() => import("@/components/MetaTagsGenerator"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/mic-camera": dynamic(() => import("@/components/MicCameraTester"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/model-comparison": dynamic(() => import("@/components/ModelComparison"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/morse-code": dynamic(() => import("@/components/MorseCodeConverter"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/notepad": dynamic(() => import("@/components/Notepad"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/number-base-converter": dynamic(() => import("@/components/NumberBaseConverter"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/password-generator": dynamic(() => import("@/components/PasswordGenerator"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/password-strength": dynamic(() => import("@/components/PasswordStrength"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/pdf": dynamic(() => import("@/components/PDFTools"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/percentage-calculator": dynamic(() => import("@/components/PercentageCalculator"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/phone-mockups": dynamic(() => import("@/components/PhoneMockups"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/pomodoro": dynamic(() => import("@/components/PomodoroTimer"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/prompt-formatter": dynamic(() => import("@/components/PromptFormatter"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/prompt-library": dynamic(() => import("@/components/PromptLibrary"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/qr-generator": dynamic(() => import("@/components/QRCodeGenerator"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/qr-scanner": dynamic(() => import("@/components/QRScanner"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/regex-tester": dynamic(() => import("@/components/RegexTester"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/rich-editor": dynamic(() => import("@/components/RichEditor"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/roman-numeral": dynamic(() => import("@/components/RomanNumeralConverter"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/screen-recorder": dynamic(() => import("@/components/ScreenRecorder"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/skill-builder": dynamic(() => import("@/components/SkillBuilder"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/spreadsheet": dynamic(() => import("@/components/SpreadsheetViewer"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/sql-formatter": dynamic(() => import("@/components/SqlFormatter"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/stopwatch": dynamic(() => import("@/components/Stopwatch"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/svg": dynamic(() => import("@/components/SvgEditor"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/svg-png": dynamic(() => import("@/components/SvgPngConverter"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/system-prompt-builder": dynamic(() => import("@/components/SystemPromptBuilder"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/text-binary": dynamic(() => import("@/components/TextBinaryConverter"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/text-case": dynamic(() => import("@/components/TextCaseConverter"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/text-counter": dynamic(() => import("@/components/TextCounter"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/text-diff": dynamic(() => import("@/components/TextDiffViewer"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/text-encryption": dynamic(() => import("@/components/TextEncryption"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/text-repeater": dynamic(() => import("@/components/TextRepeater"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/text-similarity": dynamic(() => import("@/components/TextSimilarity"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/text-sorter": dynamic(() => import("@/components/TextSorter"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/timer": dynamic(() => import("@/components/Timer"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/timezone-converter": dynamic(() => import("@/components/TimeZoneConverter"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/tip-calculator": dynamic(() => import("@/components/TipCalculator"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/todo": dynamic(() => import("@/components/TodoList"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/token-counter": dynamic(() => import("@/components/TokenCounter"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/typing-test": dynamic(() => import("@/components/TypingTest"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/unit-converter": dynamic(() => import("@/components/UnitConverter"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/unix-timestamp": dynamic(() => import("@/components/UnixTimestampConverter"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/url-encoder": dynamic(() => import("@/components/UrlEncoderDecoder"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/uuid-generator": dynamic(() => import("@/components/UUIDGenerator"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/video": dynamic(() => import("@/components/VideoEditor"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/word-frequency": dynamic(() => import("@/components/WordFrequencyAnalyzer"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/world-clock": dynamic(() => import("@/components/WorldClock"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/yaml-json": dynamic(() => import("@/components/YamlJsonConverter"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/zip": dynamic(() => import("@/components/ZipTools"), {
    loading: LoadingFallback,
    ssr: false
  }),
  "/tools/youtube-downloader": (props: any) => React.createElement(BaseVideoDownloader, { platform: "youtube", title: "YouTube Downloader", description: "Download YouTube videos and audio for free. Supports 1080p, 720p, 480p quality and audio-only MP3 extraction. Powered by the open-source Cobalt engine.", placeholder: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", accentColor: "red", ...props }),
  "/tools/tiktok-downloader": (props: any) => React.createElement(BaseVideoDownloader, { platform: "tiktok", title: "TikTok Downloader", description: "Download TikTok videos without watermark. Save TikTok clips in full quality directly to your device. Optionally remove the TikTok watermark. Powered by Cobalt.", placeholder: "https://www.tiktok.com/@username/video/...", accentColor: "cyan", ...props }),
  "/tools/instagram-downloader": (props: any) => React.createElement(BaseVideoDownloader, { platform: "instagram", title: "Instagram Downloader", description: "Download Instagram Reels, videos, and stories from public accounts. Save content as MP4 or audio. Paste the post URL and download instantly. Powered by Cobalt.", placeholder: "https://www.instagram.com/reel/...", accentColor: "pink", ...props }),
  "/tools/twitter-downloader": (props: any) => React.createElement(BaseVideoDownloader, { platform: "twitter", title: "Twitter / X Downloader", description: "Download videos from Twitter (X) tweets. Paste any public tweet URL and save the embedded video at the best available quality. No login required. Powered by Cobalt.", placeholder: "https://twitter.com/user/status/... or https://x.com/user/status/...", accentColor: "slate", ...props }),
  "/tools/reddit-downloader": (props: any) => React.createElement(BaseVideoDownloader, { platform: "reddit", title: "Reddit Downloader", description: "Download Reddit videos and GIFs from public posts. Supports v.redd.it hosted videos and external links. Paste the post URL and grab the video. Powered by Cobalt.", placeholder: "https://www.reddit.com/r/subreddit/comments/...", accentColor: "orange", ...props }),
  "/tools/soundcloud-downloader": (props: any) => React.createElement(BaseVideoDownloader, { platform: "soundcloud", title: "SoundCloud Downloader", description: "Download SoundCloud tracks as MP3 audio files. Paste any public SoundCloud track URL and save the audio instantly to your device. Powered by Cobalt.", placeholder: "https://soundcloud.com/artist/track-name", accentColor: "orange", ...props }),
  "/tools/video-downloader": (props: any) => React.createElement(BaseVideoDownloader, { platform: "universal", title: "Universal Downloader", description: "All-in-one media downloader supporting YouTube, TikTok, Instagram, Twitter, Reddit, SoundCloud, and more. Paste any supported URL to download video or audio. Powered by Cobalt.", placeholder: "https://www.youtube.com/watch?v=... or any supported URL", accentColor: "indigo", ...props }),
  "/tools/hls-downloader": HlsDownloader,
  "/tools/youtube-thumbnail": YoutubeThumbnail,
  "/tools/video-frame-extractor": VideoFrameExtractor,
};
