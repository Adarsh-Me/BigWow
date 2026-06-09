"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Standard fallback loading state for dynamic imports
const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center py-20 px-4 min-h-[400px]">
    <Loader2 className="h-8 w-8 text-accent animate-spin mb-3" />
    <p className="text-sm text-slate-500 dark:text-slate-400">Loading interactive tool workbench...</p>
  </div>
);

// Map of tool paths to dynamically imported components
const BaseVideoDownloader = dynamic(() => import("./BaseVideoDownloader"), { loading: LoadingFallback, ssr: false });
const HlsDownloader = dynamic(() => import("./HlsDownloader"), { loading: LoadingFallback, ssr: false });
const YoutubeThumbnail = dynamic(() => import("./YoutubeThumbnail"), { loading: LoadingFallback, ssr: false });
const VideoFrameExtractor = dynamic(() => import("./VideoFrameExtractor"), { loading: LoadingFallback, ssr: false });
const CompressVideo = dynamic(() => import("./CompressVideo"), { loading: LoadingFallback, ssr: false });

export const ToolRegistry: Record<string, React.ComponentType<any>> = {
  "/tools/ai-upscaler": dynamic(() => import("./AIUpscaler"), { loading: LoadingFallback, ssr: false }),
  "/tools/bg-removal": dynamic(() => import("./BgRemoval"), { loading: LoadingFallback, ssr: false }),
  "/tools/phone-mockups": dynamic(() => import("./PhoneMockups"), { loading: LoadingFallback, ssr: false }),
  "/tools/image-compression": dynamic(() => import("./ImageCompression"), { loading: LoadingFallback, ssr: false }),
  "/tools/image-converter": dynamic(() => import("./ImageConverter"), { loading: LoadingFallback, ssr: false }),
  "/tools/color-correction": dynamic(() => import("./ColorCorrection"), { loading: LoadingFallback, ssr: false }),
  "/tools/svg": dynamic(() => import("./SvgEditor"), { loading: LoadingFallback, ssr: false }),
  "/tools/color-converter": dynamic(() => import("./ColorConverter"), { loading: LoadingFallback, ssr: false }),
  
  "/tools/pdf": dynamic(() => import("./PDFTools"), { loading: LoadingFallback, ssr: false }),
  "/tools/zip": dynamic(() => import("./ZipTools"), { loading: LoadingFallback, ssr: false }),
  "/tools/spreadsheet": dynamic(() => import("./SpreadsheetViewer"), { loading: LoadingFallback, ssr: false }),
  "/tools/file-converter": dynamic(() => import("./FileConverter"), { loading: LoadingFallback, ssr: false }),
  
  "/tools/video": dynamic(() => import("./VideoEditor"), { loading: LoadingFallback, ssr: false }),
  "/tools/audio": dynamic(() => import("./AudioEditor"), { loading: LoadingFallback, ssr: false }),
  "/tools/mic-camera": dynamic(() => import("./MicCameraTester"), { loading: LoadingFallback, ssr: false }),
  
  "/tools/text-case": dynamic(() => import("./TextCaseConverter"), { loading: LoadingFallback, ssr: false }),
  "/tools/text-counter": dynamic(() => import("./TextCounter"), { loading: LoadingFallback, ssr: false }),
  "/tools/code-format": dynamic(() => import("./CodeHighlighter"), { loading: LoadingFallback, ssr: false }),
  "/tools/rich-editor": dynamic(() => import("./RichEditor"), { loading: LoadingFallback, ssr: false }),
  "/tools/lorem-ipsum": dynamic(() => import("./LoremIpsumGenerator"), { loading: LoadingFallback, ssr: false }),
  "/tools/typing-test": dynamic(() => import("./TypingTest"), { loading: LoadingFallback, ssr: false }),
  "/tools/text-diff": dynamic(() => import("./TextDiffViewer"), { loading: LoadingFallback, ssr: false }),
  "/tools/markdown-editor": dynamic(() => import("./MarkdownEditor"), { loading: LoadingFallback, ssr: false }),
  "/tools/html-formatter": dynamic(() => import("./HtmlFormatter"), { loading: LoadingFallback, ssr: false }),
  "/tools/notepad": dynamic(() => import("./Notepad"), { loading: LoadingFallback, ssr: false }),
  "/tools/text-sorter": dynamic(() => import("./TextSorter"), { loading: LoadingFallback, ssr: false }),
  "/tools/morse-code": dynamic(() => import("./MorseCodeConverter"), { loading: LoadingFallback, ssr: false }),
  "/tools/word-frequency": dynamic(() => import("./WordFrequencyAnalyzer"), { loading: LoadingFallback, ssr: false }),
  "/tools/markdown-html": dynamic(() => import("./MarkdownToHtml"), { loading: LoadingFallback, ssr: false }),
  "/tools/text-repeater": dynamic(() => import("./TextRepeater"), { loading: LoadingFallback, ssr: false }),
  "/tools/markdown-table": dynamic(() => import("./MarkdownTableGenerator"), { loading: LoadingFallback, ssr: false }),
  
  "/tools/json-csv": dynamic(() => import("./JsonCsvConverter"), { loading: LoadingFallback, ssr: false }),
  "/tools/base64": dynamic(() => import("./Base64Converter"), { loading: LoadingFallback, ssr: false }),
  "/tools/qr-generator": dynamic(() => import("./QRCodeGenerator"), { loading: LoadingFallback, ssr: false }),
  "/tools/barcode-generator": dynamic(() => import("./BarcodeGenerator"), { loading: LoadingFallback, ssr: false }),
  "/tools/qr-scanner": dynamic(() => import("./QRScanner"), { loading: LoadingFallback, ssr: false }),
  "/tools/barcode-scanner": dynamic(() => import("./BarcodeScanner"), { loading: LoadingFallback, ssr: false }),
  "/tools/charts": dynamic(() => import("./Charts").then(mod => mod.Charts), { loading: LoadingFallback, ssr: false }),
  "/tools/json-formatter": dynamic(() => import("./JsonFormatter"), { loading: LoadingFallback, ssr: false }),
  "/tools/yaml-json": dynamic(() => import("./YamlJsonConverter"), { loading: LoadingFallback, ssr: false }),
  "/tools/url-encoder": dynamic(() => import("./UrlEncoderDecoder"), { loading: LoadingFallback, ssr: false }),
  "/tools/fake-data": dynamic(() => import("./FakeDataGenerator"), { loading: LoadingFallback, ssr: false }),
  "/tools/text-binary": dynamic(() => import("./TextBinaryConverter"), { loading: LoadingFallback, ssr: false }),
  "/tools/json-to-ts": dynamic(() => import("./JsonToTs"), { loading: LoadingFallback, ssr: false }),
  "/tools/mermaid": dynamic(() => import("./MermaidViewer"), { loading: LoadingFallback, ssr: false }),
  
  "/tools/invoice": dynamic(() => import("./InvoiceGenerator"), { loading: LoadingFallback, ssr: false }),
  "/tools/unit-converter": dynamic(() => import("./UnitConverter"), { loading: LoadingFallback, ssr: false }),
  "/tools/timezone-converter": dynamic(() => import("./TimeZoneConverter"), { loading: LoadingFallback, ssr: false }),
  "/tools/calculator": dynamic(() => import("./Calculator"), { loading: LoadingFallback, ssr: false }),
  "/tools/age-calculator": dynamic(() => import("./AgeCalculator"), { loading: LoadingFallback, ssr: false }),
  "/tools/number-base-converter": dynamic(() => import("./NumberBaseConverter"), { loading: LoadingFallback, ssr: false }),
  "/tools/expense-tracker": dynamic(() => import("./ExpenseTracker"), { loading: LoadingFallback, ssr: false }),
  "/tools/currency-converter": dynamic(() => import("./CurrencyConverter"), { loading: LoadingFallback, ssr: false }),
  "/tools/loan-calculator": dynamic(() => import("./LoanCalculator"), { loading: LoadingFallback, ssr: false }),
  "/tools/percentage-calculator": dynamic(() => import("./PercentageCalculator"), { loading: LoadingFallback, ssr: false }),
  "/tools/aspect-ratio": dynamic(() => import("./AspectRatioCalculator"), { loading: LoadingFallback, ssr: false }),
  "/tools/bmi-calculator": dynamic(() => import("./BmiCalculator"), { loading: LoadingFallback, ssr: false }),
  "/tools/tip-calculator": dynamic(() => import("./TipCalculator"), { loading: LoadingFallback, ssr: false }),
  
  "/tools/todo": dynamic(() => import("./TodoList"), { loading: LoadingFallback, ssr: false }),
  "/tools/timer": dynamic(() => import("./Timer"), { loading: LoadingFallback, ssr: false }),
  "/tools/pomodoro": dynamic(() => import("./PomodoroTimer"), { loading: LoadingFallback, ssr: false }),
  "/tools/world-clock": dynamic(() => import("./WorldClock"), { loading: LoadingFallback, ssr: false }),
  "/tools/stopwatch": dynamic(() => import("./Stopwatch"), { loading: LoadingFallback, ssr: false }),
  "/tools/habit-tracker": dynamic(() => import("./HabitTracker"), { loading: LoadingFallback, ssr: false }),
  "/tools/keep-awake": dynamic(() => import("./KeepAwake"), { loading: LoadingFallback, ssr: false }),
  
  "/tools/uuid-generator": dynamic(() => import("./UUIDGenerator"), { loading: LoadingFallback, ssr: false }),
  "/tools/jwt-decoder": dynamic(() => import("./JWTDecoder"), { loading: LoadingFallback, ssr: false }),
  "/tools/password-generator": dynamic(() => import("./PasswordGenerator"), { loading: LoadingFallback, ssr: false }),
  "/tools/hash-generator": dynamic(() => import("./HashGenerator"), { loading: LoadingFallback, ssr: false }),
  "/tools/unix-timestamp": dynamic(() => import("./UnixTimestampConverter"), { loading: LoadingFallback, ssr: false }),
  "/tools/regex-tester": dynamic(() => import("./RegexTester"), { loading: LoadingFallback, ssr: false }),
  "/tools/cron-parser": dynamic(() => import("./CronParser"), { loading: LoadingFallback, ssr: false }),
  "/tools/password-strength": dynamic(() => import("./PasswordStrength"), { loading: LoadingFallback, ssr: false }),
  "/tools/text-encryption": dynamic(() => import("./TextEncryption"), { loading: LoadingFallback, ssr: false }),
  "/tools/http-status": dynamic(() => import("./HttpStatusCodes"), { loading: LoadingFallback, ssr: false }),
  "/tools/css-minifier": dynamic(() => import("./CssMinifier"), { loading: LoadingFallback, ssr: false }),
  "/tools/sql-formatter": dynamic(() => import("./SqlFormatter"), { loading: LoadingFallback, ssr: false }),
  "/tools/chmod": dynamic(() => import("./ChmodCalculator"), { loading: LoadingFallback, ssr: false }),
  "/tools/meta-tags": dynamic(() => import("./MetaTagsGenerator"), { loading: LoadingFallback, ssr: false }),
  
  "/tools/css-gradient": dynamic(() => import("./CssGradientGenerator"), { loading: LoadingFallback, ssr: false }),
  "/tools/color-palette": dynamic(() => import("./ColorPaletteGenerator"), { loading: LoadingFallback, ssr: false }),
  "/tools/image-resizer": dynamic(() => import("./ImageResizer"), { loading: LoadingFallback, ssr: false }),
  "/tools/screen-recorder": dynamic(() => import("./ScreenRecorder"), { loading: LoadingFallback, ssr: false }),
  "/tools/contrast-checker": dynamic(() => import("./ContrastChecker"), { loading: LoadingFallback, ssr: false }),
  "/tools/color-blindness": dynamic(() => import("./ColorBlindnessSimulator"), { loading: LoadingFallback, ssr: false }),
  "/tools/exif-viewer": dynamic(() => import("./ExifViewer"), { loading: LoadingFallback, ssr: false }),
  "/tools/emoji-picker": dynamic(() => import("./EmojiPicker"), { loading: LoadingFallback, ssr: false }),
  "/tools/css-shadow": dynamic(() => import("./CssShadow"), { loading: LoadingFallback, ssr: false }),
  
  "/tools/token-counter": dynamic(() => import("./TokenCounter"), { loading: LoadingFallback, ssr: false }),
  "/tools/context-window": dynamic(() => import("./ContextWindowCalculator"), { loading: LoadingFallback, ssr: false }),
  "/tools/ai-cost-calculator": dynamic(() => import("./AICostCalculator"), { loading: LoadingFallback, ssr: false }),
  "/tools/model-comparison": dynamic(() => import("./ModelComparison"), { loading: LoadingFallback, ssr: false }),
  "/tools/system-prompt-builder": dynamic(() => import("./SystemPromptBuilder"), { loading: LoadingFallback, ssr: false }),
  "/tools/prompt-library": dynamic(() => import("./PromptLibrary"), { loading: LoadingFallback, ssr: false }),
  "/tools/claude-md-generator": dynamic(() => import("./ClaudeMdGenerator"), { loading: LoadingFallback, ssr: false }),
  "/tools/ai-rules-generator": dynamic(() => import("./AIRulesGenerator"), { loading: LoadingFallback, ssr: false }),
  "/tools/json-schema-builder": dynamic(() => import("./JsonSchemaBuilder"), { loading: LoadingFallback, ssr: false }),
  "/tools/mcp-config": dynamic(() => import("./McpConfigGenerator"), { loading: LoadingFallback, ssr: false }),
  "/tools/prompt-formatter": dynamic(() => import("./PromptFormatter"), { loading: LoadingFallback, ssr: false }),
  "/tools/skill-builder": dynamic(() => import("./SkillBuilder"), { loading: LoadingFallback, ssr: false }),
  "/tools/ai-instruction-diff": dynamic(() => import("./AIInstructionDiff"), { loading: LoadingFallback, ssr: false }),
  "/tools/text-similarity": dynamic(() => import("./TextSimilarity"), { loading: LoadingFallback, ssr: false }),
  "/tools/compress-video": CompressVideo,
  "/tools/youtube-downloader": (props: any) => <BaseVideoDownloader platform="youtube" title="YouTube Downloader" description="Download YouTube videos and audio for free. Supports 1080p, 720p, 480p quality and audio-only MP3 extraction. Powered by the open-source Cobalt engine." placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ" accentColor="red" {...props} />,
  "/tools/tiktok-downloader": (props: any) => <BaseVideoDownloader platform="tiktok" title="TikTok Downloader" description="Download TikTok videos without watermark. Save TikTok clips in full quality directly to your device. Optionally remove the TikTok watermark. Powered by Cobalt." placeholder="https://www.tiktok.com/@username/video/..." accentColor="cyan" {...props} />,
  "/tools/instagram-downloader": (props: any) => <BaseVideoDownloader platform="instagram" title="Instagram Downloader" description="Download Instagram Reels, videos, and stories from public accounts. Save content as MP4 or audio. Paste the post URL and download instantly. Powered by Cobalt." placeholder="https://www.instagram.com/reel/..." accentColor="pink" {...props} />,
  "/tools/twitter-downloader": (props: any) => <BaseVideoDownloader platform="twitter" title="Twitter / X Downloader" description="Download videos from Twitter (X) tweets. Paste any public tweet URL and save the embedded video at the best available quality. No login required. Powered by Cobalt." placeholder="https://twitter.com/user/status/... or https://x.com/user/status/..." accentColor="slate" {...props} />,
  "/tools/reddit-downloader": (props: any) => <BaseVideoDownloader platform="reddit" title="Reddit Downloader" description="Download Reddit videos and GIFs from public posts. Supports v.redd.it hosted videos and external links. Paste the post URL and grab the video. Powered by Cobalt." placeholder="https://www.reddit.com/r/subreddit/comments/..." accentColor="orange" {...props} />,
  "/tools/soundcloud-downloader": (props: any) => <BaseVideoDownloader platform="soundcloud" title="SoundCloud Downloader" description="Download SoundCloud tracks as MP3 audio files. Paste any public SoundCloud track URL and save the audio instantly to your device. Powered by Cobalt." placeholder="https://soundcloud.com/artist/track-name" accentColor="orange" {...props} />,
  "/tools/video-downloader": (props: any) => <BaseVideoDownloader platform="universal" title="Universal Downloader" description="All-in-one media downloader supporting YouTube, TikTok, Instagram, Twitter, Reddit, SoundCloud, and more. Paste any supported URL to download video or audio. Powered by Cobalt." placeholder="https://www.youtube.com/watch?v=... or any supported URL" accentColor="indigo" {...props} />,
  "/tools/hls-downloader": HlsDownloader,
  "/tools/youtube-thumbnail": YoutubeThumbnail,
  "/tools/video-frame-extractor": VideoFrameExtractor,
};
