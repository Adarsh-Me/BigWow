import {
  BrainIcon,
  BookMinusIcon,
  FileDownIcon,
  HammerIcon,
  ImagesIcon,
  SquarePlayIcon,
  FileIcon,
  CodeIcon,
  VideoIcon,
  FileTextIcon,
  Grid3X3Icon,
  PaintRollerIcon,
  DatabaseIcon,
  FileArchiveIcon,
  FileImageIcon,
  TypeIcon,
  HashIcon,
  QrCodeIcon,
  CalculatorIcon,
  ShieldIcon,
  ReceiptIcon,
  SmartphoneIcon,
  BarcodeIcon,
  CheckSquareIcon,
  ClockIcon,
  CameraIcon,
  GlobeIcon,
  CalendarIcon,
  KeyIcon,
  PaletteIcon,
  CalendarClockIcon,
  DollarSignIcon,
  BarChart3Icon,
  CoinsIcon,
  BracesIcon,
  TextCursorInputIcon,
  LinkIcon,
  ImageIcon,
  NotebookIcon,
  LockIcon,
  TimerIcon,
  RefreshCwIcon,
  SwatchBookIcon,
  ScaleIcon,
  UserIcon,
  ServerIcon,
  GraduationCapIcon,
  MonitorIcon,
  PercentIcon,
  BinaryIcon,
  CpuIcon,
  SunIcon,
  WrenchIcon,
  ZapIcon,
  ArrowUpNarrowWideIcon,
  RadioIcon,
  RepeatIcon,
  SmileIcon,
  EyeIcon,
  InfoIcon,
  SplitIcon,
  Columns2Icon,
  FileJson2Icon,
  SquareIcon,
  GitBranchIcon,
  TagIcon,
  TableIcon,
  DownloadIcon,
  MusicIcon,
  FilmIcon,
  ImagePlayIcon,
} from "lucide-react";

export interface Tool {
  name: string;
  href: string;
  icon: any;
  available: boolean;
  description: string;
  order: number;
  creationDate: string; // ISO date string (YYYY-MM-DD)
}

export interface ToolCategory {
  category: string;
  id: string;
  items: Tool[];
  order: number;
}

export const tools: ToolCategory[] = [
  {
    category: "Image Tools",
    id: "imageTools",
    order: 1,
    items: [
      {
        name: "Background Removal",
        href: "/tools/bg-removal",
        icon: ImagesIcon,
        available: true,
        order: 1,
        creationDate: "2025-08-20",
        description:
          "Remove image backgrounds privately — your photos never leave your device. An on-device AI model runs entirely in your browser, so no files are uploaded to any server. Perfect for product photos, portraits, and graphics. Supports PNG, JPG, and WebP. No watermark, no signup, completely free.",
      },
      {
        name: "Phone Mockups",
        href: "/tools/phone-mockups",
        icon: SmartphoneIcon,
        available: true,
        order: 2,
        creationDate: "2025-09-01",
        description:
          "Place screenshots into iPhone/Android device frames. Upload a screenshot, choose a frame, adjust fit, background, and export.",
      },
      {
        name: "Image Compression",
        href: "/tools/image-compression",
        icon: FileDownIcon,
        available: true,
        order: 3,
        creationDate: "2025-08-20",
        description:
          "Compress images locally in your browser — zero uploads, zero server processing, 100% private. Reduce JPG, PNG, and WebP file sizes by up to 90% using client-side canvas algorithms. Perfect for web optimization, email attachments, and confidential photos you can't risk uploading to a cloud.",
      },
      {
        name: "Format Converter",
        href: "/tools/image-converter",
        icon: HammerIcon,
        available: true,
        order: 4,
        creationDate: "2025-08-20",
        description:
          "Convert images between different formats like JPG, PNG, WebP, GIF, BMP, TIFF, and SVG. Batch conversion supported. Optimize for web or print.",
      },
      {
        name: "Color Correction",
        href: "/tools/color-correction",
        icon: PaintRollerIcon,
        available: true,
        order: 5,
        creationDate: "2025-08-20",
        description:
          "Adjust colors, brightness, contrast, saturation, and hue in images. Enhance photos, fix lighting issues, and create artistic effects. Works with all image formats.",
      },
      {
        name: "SVG Tools",
        href: "/tools/svg",
        icon: FileImageIcon,
        available: true,
        order: 6,
        creationDate: "2025-09-20",
        description:
          "Edit and manipulate SVG vector graphics. Scale, modify colors, optimize paths, and convert to other formats. Ideal for logos, icons, and scalable graphics.",
      },
      {
        name: "Color Converter",
        href: "/tools/color-converter",
        icon: PaletteIcon,
        available: true,
        order: 7,
        creationDate: "2025-09-10",
        description: "Convert between HEX, RGB, and HSL with live preview.",
      },
    ],
  },
  {
    category: "File Tools",
    id: "fileTools",
    order: 2,
    items: [
      {
        name: "PDF Tools",
        href: "/tools/pdf",
        icon: FileTextIcon,
        available: true,
        order: 1,
        creationDate: "2025-08-20",
        description:
          "Merge, split, compress, and manipulate PDFs locally — your documents never leave your browser. Powered by pdf-lib running entirely client-side, so no files are uploaded to any server. Extract text, rotate pages, and convert to other formats. No file size limits, no signup, no watermarks.",
      },
      {
        name: "Zip Tools",
        href: "/tools/zip",
        icon: FileArchiveIcon,
        available: true,
        order: 2,
        creationDate: "2025-08-20",
        description:
          "Create, extract, and manage ZIP archives. Compress files and folders, extract archives, and browse contents. Supports password protection and encryption.",
      },
      {
        name: "CSV/Excel Viewer",
        href: "/tools/spreadsheet",
        icon: Grid3X3Icon,
        available: true,
        order: 3,
        creationDate: "2025-08-20",
        description:
          "View and edit CSV and Excel files in your browser. Sort, filter, and analyze data. Export to different formats. No software installation required.",
      },
      {
        name: "File Converter",
        href: "/tools/file-converter",
        icon: FileIcon,
        available: true,
        order: 4,
        creationDate: "2025-08-20",
        description:
          "Convert files between different formats including documents, images, audio, and video. Supports hundreds of file types with high-quality conversion.",
      },
    ],
  },

  {
    category: "Media Tools",
    id: "mediaTools",
    order: 3,
    items: [
      {
        name: "Video Editor",
        href: "/tools/video",
        icon: VideoIcon,
        available: true,
        order: 1,
        creationDate: "2025-08-20",
        description:
          "Trim, convert, and edit video files. Cut clips, merge videos, adjust quality, and convert between formats. Works with MP4, AVI, MOV, and more.",
      },
      {
        name: "Audio Editor",
        href: "/tools/audio",
        icon: SquarePlayIcon,
        available: true,
        order: 2,
        creationDate: "2025-08-20",
        description:
          "Edit and process audio files. Trim, merge, convert formats, adjust volume, and apply effects. Supports MP3, WAV, FLAC, and other audio formats.",
      },
      {
        name: "Mic & Camera Tester",
        href: "/tools/mic-camera",
        icon: CameraIcon,
        available: true,
        order: 3,
        creationDate: "2025-09-10",
        description:
          "Check your camera preview and test microphone input levels with a live meter.",
      },
      {
        name: "Video Compressor",
        href: "/tools/compress-video",
        icon: VideoIcon,
        available: true,
        order: 4,
        creationDate: "2025-08-20",
        description:
          "Compress video files to reduce size while maintaining quality. Reduce MP4 and WebM file sizes with browser-based FFmpeg — no uploads needed.",
      },
    ],
  },
  {
    category: "Text & Language Tools",
    id: "textLanguage",
    order: 4,
    items: [
      {
        name: "Text Case Converter",
        href: "/tools/text-case",
        icon: TypeIcon,
        available: true,
        order: 1,
        creationDate: "2025-08-20",
        description:
          "Convert text between different cases: uppercase, lowercase, title case, camelCase, snake_case, and more. Perfect for coding and content formatting.",
      },
      {
        name: "Text Counter",
        href: "/tools/text-counter",
        icon: HashIcon,
        available: true,
        order: 2,
        creationDate: "2025-08-20",
        description:
          "Count words, characters, lines, and paragraphs in text. Analyze readability, estimate reading time, and get detailed statistics for content analysis.",
      },
      {
        name: "Code Formatter",
        href: "/tools/code-format",
        icon: CodeIcon,
        available: true,
        order: 3,
        creationDate: "2025-08-20",
        description:
          "Format and beautify your code with proper indentation and syntax highlighting. Supports JavaScript, Python, HTML, CSS, JSON, and many more languages.",
      },
      {
        name: "Rich Editor",
        href: "/tools/rich-editor",
        icon: BookMinusIcon,
        available: true,
        order: 4,
        creationDate: "2025-08-20",
        description:
          "Edit and preview rich text documents with formatting options. Create documents with bold, italic, lists, links, and more. Export to HTML or Markdown.",
      },
      {
        name: "Lorem Ipsum Generator",
        href: "/tools/lorem-ipsum",
        icon: FileTextIcon,
        available: true,
        order: 5,
        creationDate: "2025-08-20",
        description:
          "Generate placeholder text for designs and mockups. Customize length, paragraphs, and format. Perfect for web design, presentations, and prototyping.",
      },
      {
        name: "Typing Test",
        href: "/tools/typing-test",
        icon: TypeIcon,
        available: true,
        order: 6,
        creationDate: "2025-09-01",
        description:
          "Measure your typing speed (WPM) and accuracy with optional mechanical keyboard click sounds.",
      },
      {
        name: "Text Diff Viewer",
        href: "/tools/text-diff",
        icon: FileTextIcon,
        available: true,
        order: 7,
        creationDate: "2025-09-10",
        description: "Compare two texts and copy a simple patch.",
      },
      {
        name: "Markdown Editor",
        href: "/tools/markdown-editor",
        icon: FileTextIcon,
        available: true,
        order: 8,
        creationDate: "2026-02-20",
        description:
          "Write Markdown with a live split-pane preview. Supports GFM tables, code blocks, and task lists. Export as Markdown or HTML.",
      },
      {
        name: "HTML Formatter",
        href: "/tools/html-formatter",
        icon: CodeIcon,
        available: true,
        order: 9,
        creationDate: "2026-02-20",
        description:
          "Format, prettify, or minify HTML code. Automatically indents tags, fixes nesting, and removes whitespace for production builds.",
      },
      {
        name: "Notepad",
        href: "/tools/notepad",
        icon: NotebookIcon,
        available: true,
        order: 10,
        creationDate: "2026-02-20",
        description:
          "A distraction-free scratch pad that saves your notes automatically to the browser. Supports multiple notes with titles and timestamps.",
      },
      {
        name: "Text Sorter",
        href: "/tools/text-sorter",
        icon: ArrowUpNarrowWideIcon,
        available: true,
        order: 11,
        creationDate: "2026-02-22",
        description:
          "Sort lines of text alphabetically, by length, or numerically. Remove duplicates, reverse order, shuffle randomly, and trim whitespace.",
      },
      {
        name: "Morse Code Converter",
        href: "/tools/morse-code",
        icon: RadioIcon,
        available: true,
        order: 12,
        creationDate: "2026-02-22",
        description:
          "Convert text to Morse code and decode Morse code back to text. Supports all letters, numbers, and punctuation. Copy or play audio beeps.",
      },
      {
        name: "Word Frequency Analyzer",
        href: "/tools/word-frequency",
        icon: BarChart3Icon,
        available: true,
        order: 13,
        creationDate: "2026-02-22",
        description:
          "Analyze word frequency in any text. Find the most common words, filter stop words, and export results as CSV. Useful for SEO and writing analysis.",
      },
      {
        name: "Markdown to HTML",
        href: "/tools/markdown-html",
        icon: CodeIcon,
        available: true,
        order: 14,
        creationDate: "2026-02-22",
        description:
          "Convert Markdown to clean HTML instantly. Supports GFM tables, task lists, code blocks, and more. Copy the HTML output or download as a file.",
      },
      {
        name: "Text Repeater",
        href: "/tools/text-repeater",
        icon: RepeatIcon,
        available: true,
        order: 15,
        creationDate: "2026-02-22",
        description:
          "Repeat any text or character N times with a custom separator. Useful for generating test data, placeholder content, and patterns.",
      },
      {
        name: "Markdown Table Generator",
        href: "/tools/markdown-table",
        icon: TableIcon,
        available: true,
        order: 15,
        creationDate: "2026-03-05",
        description:
          "Build tables in a visual grid editor and export as valid Markdown table syntax. Control column alignment per column.",
      },
    ],
  },
  {
    category: "Data Tools",
    id: "dataTools",
    order: 5,
    items: [
      {
        name: "JSON to CSV",
        href: "/tools/json-csv",
        icon: DatabaseIcon,
        available: true,
        order: 1,
        creationDate: "2025-08-20",
        description:
          "Convert JSON data to CSV format for spreadsheet applications. Handle nested objects, arrays, and complex data structures. Perfect for data analysis and reporting.",
      },
      {
        name: "Base64 Tools",
        href: "/tools/base64",
        icon: DatabaseIcon,
        available: true,
        order: 2,
        creationDate: "2025-08-20",
        description:
          "Encode and decode Base64 strings and files entirely in your browser — nothing is sent to a server. Uses the native btoa/atob browser APIs so your binary data, images, and secrets stay local. Essential for web development, API debugging, and safely encoding credentials without log exposure.",
      },
      {
        name: "QR Code Generator",
        href: "/tools/qr-generator",
        icon: QrCodeIcon,
        available: true,
        order: 3,
        creationDate: "2025-08-20",
        description:
          "Generate QR codes from text, URLs, contact information, and more. Customize colors, size, and error correction. Download as PNG, SVG, or PDF.",
      },
      {
        name: "Barcode Generator",
        href: "/tools/barcode-generator",
        icon: BarcodeIcon,
        available: true,
        order: 4,
        creationDate: "2025-08-20",
        description:
          "Generate various barcode types including CODE128, EAN-13, UPC-A, CODE39, and more. Customize appearance and download as PNG. Perfect for inventory, retail, and logistics.",
      },
      {
        name: "QR Code Scanner",
        href: "/tools/qr-scanner",
        icon: CameraIcon,
        available: true,
        order: 5,
        creationDate: "2025-08-20",
        description:
          "Scan QR codes using your camera or upload an image. Get instant results with copy and download options. Perfect for quickly accessing URLs, contact info, and other QR data.",
      },
      {
        name: "Barcode Scanner",
        href: "/tools/barcode-scanner",
        icon: CameraIcon,
        available: true,
        order: 6,
        creationDate: "2025-08-20",
        description:
          "Scan barcodes using your camera or upload an image. Supports multiple barcode formats including EAN-13, UPC-A, CODE128, and more. Get instant results with validation.",
      },
      {
        name: "Charts",
        href: "/tools/charts",
        icon: BarChart3Icon,
        available: true,
        order: 7,
        creationDate: "2025-09-19",
        description:
          "Create beautiful, customizable charts with full control over every detail. Support for area, bar, line, pie, radar, and radial charts with multiple export options.",
      },
      {
        name: "JSON Formatter",
        href: "/tools/json-formatter",
        icon: BracesIcon,
        available: true,
        order: 8,
        creationDate: "2026-02-20",
        description:
          "Format, validate, and minify JSON offline — safe to use with API keys, credentials, and secrets. All parsing runs in local JavaScript, so your JSON payload is never sent to any server or logged. Pretty-print with syntax highlighting, detect errors, sort keys, and minify for production.",
      },
      {
        name: "YAML ↔ JSON",
        href: "/tools/yaml-json",
        icon: RefreshCwIcon,
        available: true,
        order: 9,
        creationDate: "2026-02-20",
        description:
          "Convert between YAML and JSON formats instantly. Validate syntax, format output, and switch between human-readable YAML and machine-readable JSON.",
      },
      {
        name: "URL Encoder/Decoder",
        href: "/tools/url-encoder",
        icon: LinkIcon,
        available: true,
        order: 10,
        creationDate: "2026-02-20",
        description:
          "Encode or decode URLs and query strings. Percent-encode special characters and decode percent-encoded strings. Essential for web developers and API debugging.",
      },
      {
        name: "Fake Data Generator",
        href: "/tools/fake-data",
        icon: UserIcon,
        available: true,
        order: 11,
        creationDate: "2026-02-20",
        description:
          "Generate realistic fake data for testing and prototyping. Names, emails, addresses, phone numbers, credit cards, UUIDs, and more. Export as JSON or CSV.",
      },
      {
        name: "Text to Binary",
        href: "/tools/text-binary",
        icon: BinaryIcon,
        available: true,
        order: 12,
        creationDate: "2026-02-20",
        description:
          "Convert text to binary, hexadecimal, octal, and decimal representations. Decode binary/hex back to text. Useful for encoding, security, and low-level programming.",
      },
      {
        name: "JSON → TypeScript",
        href: "/tools/json-to-ts",
        icon: FileJson2Icon,
        available: true,
        order: 13,
        creationDate: "2026-03-05",
        description:
          "Paste JSON and instantly get TypeScript interfaces. Handles nested objects, arrays, optional fields, and union types.",
      },
      {
        name: "Mermaid Diagram Viewer",
        href: "/tools/mermaid",
        icon: GitBranchIcon,
        available: true,
        order: 14,
        creationDate: "2026-03-05",
        description:
          "Write Mermaid markdown and see your diagram rendered live. Supports flowcharts, sequence diagrams, ER diagrams, and more.",
      },
    ],
  },
  {
    category: "Math & Finance Tools",
    id: "mathFinance",
    order: 6,
    items: [
      {
        name: "Invoice Generator",
        href: "/tools/invoice",
        icon: ReceiptIcon,
        available: true,
        order: 1,
        creationDate: "2025-08-20",
        description:
          "Create professional invoices with customizable templates, automatic tax calculations, and PDF export. Perfect for freelancers, small businesses, and contractors.",
      },
      {
        name: "Unit Converter",
        href: "/tools/unit-converter",
        icon: CalculatorIcon,
        available: true,
        order: 2,
        creationDate: "2025-08-20",
        description:
          "Convert between different units of measurement including length, weight, temperature, area, volume, and more. Supports metric, imperial, and scientific units.",
      },

      {
        name: "Time Zone Converter",
        href: "/tools/timezone-converter",
        icon: GlobeIcon,
        available: true,
        order: 3,
        creationDate: "2025-08-20",
        description:
          "Convert times between different time zones. View current times worldwide and convert specific dates and times. Perfect for scheduling and international communication.",
      },
      {
        name: "Calculator",
        href: "/tools/calculator",
        icon: CalculatorIcon,
        available: true,
        order: 4,
        creationDate: "2025-09-10",
        description:
          "Advanced calculator with both basic and scientific modes. Perform arithmetic operations, trigonometric functions, logarithms, memory operations, and more. Full keyboard support included.",
      },
      {
        name: "Age Calculator",
        href: "/tools/age-calculator",
        icon: CalendarIcon,
        available: true,
        order: 5,
        creationDate: "2025-08-20",
        description:
          "Calculate your exact age in years, months, and days. Compare ages between two people and get detailed age information including zodiac signs and next birthday.",
      },
      {
        name: "Number Base Converter",
        href: "/tools/number-base-converter",
        icon: CalculatorIcon,
        available: true,
        order: 6,
        creationDate: "2025-09-10",
        description:
          "Convert between binary, octal, decimal and hexadecimal with live validation.",
      },
      {
        name: "Expense Tracker",
        href: "/tools/expense-tracker",
        icon: DollarSignIcon,
        available: true,
        order: 7,
        creationDate: "2025-09-11",
        description:
          "Track your expenses with detailed categorization, budget management, and comprehensive reports. Visualize spending patterns with interactive charts and export data for analysis.",
      },
      {
        name: "Currency Converter",
        href: "/tools/currency-converter",
        icon: CoinsIcon,
        available: true,
        order: 8,
        creationDate: "2025-09-24",
        description:
          "Convert between all major currencies in the browser using cached daily rates and animated number display.",
      },
      {
        name: "Loan Calculator",
        href: "/tools/loan-calculator",
        icon: CalculatorIcon,
        available: true,
        order: 9,
        creationDate: "2026-02-20",
        description:
          "Calculate monthly payments, total interest, and amortization schedules for mortgages and loans. Visualize payment breakdown with an interactive chart.",
      },
      {
        name: "Percentage Calculator",
        href: "/tools/percentage-calculator",
        icon: PercentIcon,
        available: true,
        order: 10,
        creationDate: "2026-02-20",
        description:
          "Calculate percentages, percentage change, percentage of a number, and reverse percentages. Multiple calculation modes for everyday math needs.",
      },
      {
        name: "Aspect Ratio Calculator",
        href: "/tools/aspect-ratio",
        icon: ScaleIcon,
        available: true,
        order: 11,
        creationDate: "2026-02-20",
        description:
          "Calculate and lock aspect ratios for images and videos. Find the missing dimension, compare ratios, and get pixel dimensions for common screen sizes.",
      },
      {
        name: "BMI Calculator",
        href: "/tools/bmi-calculator",
        icon: UserIcon,
        available: true,
        order: 12,
        creationDate: "2026-02-22",
        description:
          "Calculate Body Mass Index (BMI) in metric or imperial units. Shows BMI category, healthy weight range, and visual gauge.",
      },
      {
        name: "Tip Calculator",
        href: "/tools/tip-calculator",
        icon: ReceiptIcon,
        available: true,
        order: 13,
        creationDate: "2026-02-22",
        description:
          "Calculate tips and split bills between multiple people. Choose tip percentage or enter custom amount. Shows per-person totals.",
      },
    ],
  },
  {
    category: "Productivity Tools",
    id: "productivity",
    order: 7,
    items: [
      {
        name: "Todo List",
        href: "/tools/todo",
        icon: CheckSquareIcon,
        available: true,
        order: 1,
        creationDate: "2025-08-20",
        description:
          "Organize your tasks and stay productive. Create, manage, and track your todos with priority levels. Mark tasks as completed and keep your workflow organized.",
      },
      {
        name: "Timer & Countdown",
        href: "/tools/timer",
        icon: ClockIcon,
        available: true,
        order: 2,
        creationDate: "2025-08-20",
        description:
          "Simple timer and countdown with fullscreen mode and completion sound. Perfect for work sessions, workouts, cooking, and presentations.",
      },
      {
        name: "Pomodoro Timer",
        href: "/tools/pomodoro",
        icon: TimerIcon,
        available: true,
        order: 3,
        creationDate: "2026-02-20",
        description:
          "Boost focus with the Pomodoro Technique. 25-minute work sessions with 5-minute short breaks and 15-minute long breaks. Tracks sessions and plays sounds.",
      },
      {
        name: "World Clock",
        href: "/tools/world-clock",
        icon: SunIcon,
        available: true,
        order: 4,
        creationDate: "2026-02-20",
        description:
          "View current time in multiple cities and time zones simultaneously. Add your favorite cities, compare times, and see which ones overlap during business hours.",
      },
      {
        name: "Stopwatch",
        href: "/tools/stopwatch",
        icon: TimerIcon,
        available: true,
        order: 5,
        creationDate: "2026-02-22",
        description:
          "Precise stopwatch with lap times and split tracking. Start, stop, reset, and record laps. Export lap history as CSV.",
      },
      {
        name: "Habit Tracker",
        href: "/tools/habit-tracker",
        icon: CheckSquareIcon,
        available: true,
        order: 6,
        creationDate: "2026-02-22",
        description:
          "Track daily habits and build streaks. Add custom habits, mark them complete each day, and view your streak and completion history. All stored locally.",
      },
      {
        name: "Keep Awake",
        href: "/tools/keep-awake",
        icon: ZapIcon,
        available: true,
        order: 7,
        creationDate: "2026-04-14",
        description:
          "Prevent your laptop or phone from sleeping. Choose a duration — 15 minutes, an hour, all day — or stay awake indefinitely. Uses the Screen Wake Lock API, works on Mac, Windows, Linux, iOS and Android. No install, no accounts.",
      },
    ],
  },
  {
    category: "Security & Development Tools",
    id: "securityDev",
    order: 8,
    items: [
      {
        name: "UUID Generator",
        href: "/tools/uuid-generator",
        icon: KeyIcon,
        available: true,
        order: 1,
        creationDate: "2025-08-20",
        description:
          "Generate Universally Unique Identifiers (UUIDs) in different versions and formats. Perfect for database keys, API identifiers, and unique references.",
      },
      {
        name: "JWT Decoder",
        href: "/tools/jwt-decoder",
        icon: ShieldIcon,
        available: true,
        order: 2,
        creationDate: "2025-08-20",
        description:
          "Decode JSON Web Tokens (JWTs) securely — your tokens are never sent to any server. Unlike jwt.io, BigWow parses JWTs entirely in your browser using local Base64 URL decoding, so your auth credentials, session tokens, and user claims stay private. View header, payload, expiry, and signature locally.",
      },
      {
        name: "Password Generator",
        href: "/tools/password-generator",
        icon: ShieldIcon,
        available: true,
        order: 3,
        creationDate: "2025-08-20",
        description:
          "Generate cryptographically secure passwords locally — nothing is ever transmitted to a server. Uses the browser's Crypto.getRandomValues() API so your generated passwords are provably random and completely private. Set length, character types, and special requirements. No account needed.",
      },
      {
        name: "Hash Generator",
        href: "/tools/hash-generator",
        icon: HashIcon,
        available: true,
        order: 4,
        creationDate: "2025-08-20",
        description:
          "Generate cryptographic hashes privately in your browser — your input text is never sent to a server. Uses the Web Crypto API (SubtleCrypto) for SHA-256, SHA-384, SHA-512, and MD5. Perfect for verifying data integrity, generating checksums, and hashing sensitive strings without network exposure.",
      },
      {
        name: "Unix Timestamp Converter",
        href: "/tools/unix-timestamp",
        icon: ClockIcon,
        available: true,
        order: 5,
        creationDate: "2025-09-10",
        description: "Epoch seconds/milliseconds ↔ human date with timezone.",
      },
      {
        name: "Regex Tester",
        href: "/tools/regex-tester",
        icon: CodeIcon,
        available: true,
        order: 6,
        creationDate: "2025-09-10",
        description:
          "Test regular expressions privately — your input text and patterns are never sent to a server. Unlike Regex101, BigWow runs all matching locally using the browser's native JavaScript RegExp engine. Safe to test against log snippets, emails, tokens, or any sensitive text data.",
      },
      {
        name: "Cron Parser",
        href: "/tools/cron-parser",
        icon: CalendarClockIcon,
        available: true,
        order: 7,
        creationDate: "2025-09-10",
        description: "Explain cron expressions and list next runs.",
      },
      {
        name: "Password Strength",
        href: "/tools/password-strength",
        icon: ShieldIcon,
        available: true,
        order: 8,
        creationDate: "2026-02-20",
        description:
          "Analyze the strength of any password in real time. Checks entropy, character variety, common patterns, and dictionary words. All analysis runs locally.",
      },
      {
        name: "Text Encryption",
        href: "/tools/text-encryption",
        icon: LockIcon,
        available: true,
        order: 9,
        creationDate: "2026-02-20",
        description:
          "Encrypt and decrypt text with AES-256-GCM entirely in your browser — no data ever touches a server. Powered by the Web Crypto API so your plaintext and keys are processed exclusively in local memory. Use a passphrase or generate a random key. Zero cloud storage, zero third-party exposure.",
      },
      {
        name: "HTTP Status Codes",
        href: "/tools/http-status",
        icon: ServerIcon,
        available: true,
        order: 10,
        creationDate: "2026-02-20",
        description:
          "Quick reference for all HTTP status codes with descriptions, use cases, and examples. Search by code number or keyword. Covers 1xx through 5xx.",
      },
      {
        name: "CSS Minifier",
        href: "/tools/css-minifier",
        icon: ZapIcon,
        available: true,
        order: 11,
        creationDate: "2026-02-22",
        description:
          "Minify or beautify CSS code. Remove comments and whitespace for production, or prettify minified CSS for debugging. Shows size reduction percentage.",
      },
      {
        name: "SQL Formatter",
        href: "/tools/sql-formatter",
        icon: DatabaseIcon,
        available: true,
        order: 12,
        creationDate: "2026-02-22",
        description:
          "Format and beautify SQL queries with proper indentation and keyword casing. Supports SELECT, INSERT, UPDATE, DELETE, CREATE, and more.",
      },
      {
        name: "Chmod Calculator",
        href: "/tools/chmod",
        icon: LockIcon,
        available: true,
        order: 13,
        creationDate: "2026-03-05",
        description:
          "Calculate Unix file permissions visually. Toggle read/write/execute bits for owner, group, and others to get the octal value and chmod command.",
      },
      {
        name: "Meta Tags Generator",
        href: "/tools/meta-tags",
        icon: TagIcon,
        available: true,
        order: 14,
        creationDate: "2026-03-05",
        description:
          "Generate HTML meta tags, Open Graph tags, and Twitter Card tags. Preview how your page will appear in search results and social media.",
      },
    ],
  },
  {
    category: "Design Tools",
    id: "designTools",
    order: 9,
    items: [
      {
        name: "CSS Gradient Generator",
        href: "/tools/css-gradient",
        icon: SwatchBookIcon,
        available: true,
        order: 1,
        creationDate: "2026-02-20",
        description:
          "Create beautiful CSS gradients visually. Add color stops, control angles and positions, and copy the generated CSS. Supports linear, radial, and conic gradients.",
      },
      {
        name: "Color Palette Generator",
        href: "/tools/color-palette",
        icon: PaletteIcon,
        available: true,
        order: 2,
        creationDate: "2026-02-20",
        description:
          "Generate harmonious color palettes from a base color. Explore complementary, triadic, analogous, and split-complementary schemes. Export as CSS variables or JSON.",
      },
      {
        name: "Image Resizer",
        href: "/tools/image-resizer",
        icon: ImageIcon,
        available: true,
        order: 3,
        creationDate: "2026-02-20",
        description:
          "Resize images to exact dimensions or by percentage. Lock aspect ratio, choose output format, and adjust quality. No file size limits, runs fully in browser.",
      },
      {
        name: "Screen Recorder",
        href: "/tools/screen-recorder",
        icon: MonitorIcon,
        available: true,
        order: 4,
        creationDate: "2026-02-20",
        description:
          "Record your screen, window, or tab directly in the browser using the Screen Capture API. No extensions or software needed. Save as WebM video.",
      },
      {
        name: "Color Contrast Checker",
        href: "/tools/contrast-checker",
        icon: Columns2Icon,
        available: true,
        order: 5,
        creationDate: "2026-02-22",
        description:
          "Check color contrast ratios for WCAG accessibility compliance. Enter foreground and background colors to get AA and AAA pass/fail results for normal and large text.",
      },
      {
        name: "Color Blindness Simulator",
        href: "/tools/color-blindness",
        icon: EyeIcon,
        available: true,
        order: 6,
        creationDate: "2026-02-22",
        description:
          "Simulate how images appear to people with different types of color blindness: deuteranopia, protanopia, tritanopia, and achromatopsia.",
      },
      {
        name: "EXIF Viewer",
        href: "/tools/exif-viewer",
        icon: InfoIcon,
        available: true,
        order: 7,
        creationDate: "2026-02-22",
        description:
          "View EXIF metadata from photos: camera model, lens, aperture, shutter speed, ISO, GPS coordinates, and more. No upload — processed locally.",
      },
      {
        name: "Emoji Picker",
        href: "/tools/emoji-picker",
        icon: SmileIcon,
        available: true,
        order: 8,
        creationDate: "2026-02-22",
        description:
          "Browse and search all Unicode emojis by name or category. Click to copy to clipboard. Filter by skin tone and find emoji codes.",
      },
      {
        name: "CSS Box Shadow Generator",
        href: "/tools/css-shadow",
        icon: SquareIcon,
        available: true,
        order: 9,
        creationDate: "2026-03-05",
        description:
          "Build CSS box shadows visually with sliders for offset, blur, spread, color, and opacity. Supports multiple shadow layers.",
      },
    ],
  },
  {
    category: "AI Tools",
    id: "aiTools",
    order: 10,
    items: [
      {
        name: "AI Image Upscaler",
        href: "/tools/ai-upscaler",
        icon: ImageIcon,
        available: true,
        order: 1,
        creationDate: "2026-06-08",
        description:
          "Upscale and enhance images in-browser using local AI models. Boost resolution up to 4x, denoise, and optimize details. 100% private, runs entirely on your device.",
      },
      {
        name: "Token Counter",
        href: "/tools/token-counter",
        icon: BrainIcon,
        available: true,
        order: 2,
        creationDate: "2026-03-05",
        description:
          "Count tokens for any text across popular AI models: GPT-4o, Claude, Llama 3, and more. Instantly see token usage before sending to an API. No API key needed.",
      },
      {
        name: "Context Window Calculator",
        href: "/tools/context-window",
        icon: BrainIcon,
        available: true,
        order: 2,
        creationDate: "2026-03-05",
        description:
          "Calculate how much of a model's context window your text uses. See tokens used, percentage filled, tokens remaining, and estimated API cost for major models.",
      },
      {
        name: "AI Cost Calculator",
        href: "/tools/ai-cost-calculator",
        icon: BrainIcon,
        available: true,
        order: 3,
        creationDate: "2026-03-05",
        description:
          "Estimate your AI API costs by entering token counts and selecting a model. Supports GPT-4o, Claude 3.5, Gemini, Llama, and more with up-to-date pricing.",
      },
      {
        name: "Model Comparison",
        href: "/tools/model-comparison",
        icon: BrainIcon,
        available: true,
        order: 4,
        creationDate: "2026-03-05",
        description:
          "Compare AI language models side by side: context window size, pricing, capabilities, speed, and provider. Filter and sort to find the best model for your use case.",
      },
      {
        name: "System Prompt Builder",
        href: "/tools/system-prompt-builder",
        icon: BrainIcon,
        available: true,
        order: 5,
        creationDate: "2026-03-05",
        description:
          "Build structured system prompts for AI models using a guided form. Set role, tone, constraints, output format, and examples. Export as plain text or Claude XML tags.",
      },
      {
        name: "Prompt Library",
        href: "/tools/prompt-library",
        icon: BrainIcon,
        available: true,
        order: 6,
        creationDate: "2026-03-05",
        description:
          "Save, organize, and search your AI prompts locally in the browser. Tag prompts by category, copy with one click, and export or import your entire library as JSON.",
      },
      {
        name: "CLAUDE.md Generator",
        href: "/tools/claude-md-generator",
        icon: BrainIcon,
        available: true,
        order: 7,
        creationDate: "2026-03-05",
        description:
          "Generate CLAUDE.md files for your projects using a structured form. Define tech stack, conventions, commands, do/don't rules, and coding standards. Copy or download.",
      },
      {
        name: "AI Rules Generator",
        href: "/tools/ai-rules-generator",
        icon: BrainIcon,
        available: true,
        order: 8,
        creationDate: "2026-03-05",
        description:
          "Generate .cursorrules, .windsurfrules, and GitHub Copilot instruction files for your IDE. Fill in your stack and preferences, get a ready-to-use AI rules file.",
      },
      {
        name: "JSON Schema Builder",
        href: "/tools/json-schema-builder",
        icon: BrainIcon,
        available: true,
        order: 9,
        creationDate: "2026-03-05",
        description:
          "Build JSON schemas for LLM tool calls and function calling using a visual form. Outputs OpenAI and Anthropic tool format. Perfect for structured AI output definitions.",
      },
      {
        name: "MCP Config Generator",
        href: "/tools/mcp-config",
        icon: BrainIcon,
        available: true,
        order: 10,
        creationDate: "2026-03-05",
        description:
          "Generate Model Context Protocol (MCP) configuration files for Claude Desktop and other MCP clients. Add servers, configure transports, and export valid JSON config.",
      },
      {
        name: "Prompt Formatter",
        href: "/tools/prompt-formatter",
        icon: BrainIcon,
        available: true,
        order: 11,
        creationDate: "2026-03-05",
        description:
          "Convert prompts between different AI formats: ChatML, Llama 3 Instruct, Claude XML tags, and plain text. Preview the formatted output instantly.",
      },
      {
        name: "Skill / Agent Builder",
        href: "/tools/skill-builder",
        icon: BrainIcon,
        available: true,
        order: 12,
        creationDate: "2026-03-05",
        description:
          "Scaffold AI agent skill files with a guided form. Set name, description, trigger phrases, and instructions. Outputs a ready-to-use YAML/Markdown skill file.",
      },
      {
        name: "AI Instruction Diff",
        href: "/tools/ai-instruction-diff",
        icon: BrainIcon,
        available: true,
        order: 13,
        creationDate: "2026-03-05",
        description:
          "Compare two system prompts, CLAUDE.md files, or AI instruction sets side by side. Highlights additions, deletions, and changes to track prompt evolution.",
      },
      {
        name: "Text Similarity",
        href: "/tools/text-similarity",
        icon: BrainIcon,
        available: true,
        order: 14,
        creationDate: "2026-03-05",
        description:
          "Measure semantic similarity between texts using TF-IDF cosine similarity, all in the browser. Useful for comparing prompts, outputs, or any text pairs.",
      },
    ],
  },
  {
    category: "Media & Downloader Tools",
    id: "mediaDownloaders",
    order: 11,
    items: [
      {
        name: "YouTube Downloader",
        href: "/tools/youtube-downloader",
        icon: VideoIcon,
        available: true,
        order: 1,
        creationDate: "2026-06-07",
        description:
          "Download YouTube videos and audio tracks for free. Supports 1080p, 720p, 480p quality and audio-only MP3 extraction. Powered by the open-source Cobalt engine. No account needed.",
      },
      {
        name: "TikTok Downloader",
        href: "/tools/tiktok-downloader",
        icon: FilmIcon,
        available: true,
        order: 2,
        creationDate: "2026-06-07",
        description:
          "Download TikTok videos without watermark. Save TikTok clips in full quality directly to your device. Optionally remove the TikTok watermark. Powered by Cobalt.",
      },
      {
        name: "Instagram Downloader",
        href: "/tools/instagram-downloader",
        icon: ImagePlayIcon,
        available: true,
        order: 3,
        creationDate: "2026-06-07",
        description:
          "Download Instagram Reels, videos, and stories from public accounts. Save content as MP4 or audio. Paste the post URL and download instantly. Powered by Cobalt.",
      },
      {
        name: "Twitter / X Downloader",
        href: "/tools/twitter-downloader",
        icon: DownloadIcon,
        available: true,
        order: 4,
        creationDate: "2026-06-07",
        description:
          "Download videos from Twitter (X) tweets. Paste any public tweet URL and save the embedded video at the best available quality. No login required. Powered by Cobalt.",
      },
      {
        name: "Reddit Downloader",
        href: "/tools/reddit-downloader",
        icon: DownloadIcon,
        available: true,
        order: 5,
        creationDate: "2026-06-07",
        description:
          "Download Reddit videos and GIFs from public posts. Supports v.redd.it hosted videos and external links. Paste the post URL and grab the video. Powered by Cobalt.",
      },
      {
        name: "SoundCloud Downloader",
        href: "/tools/soundcloud-downloader",
        icon: MusicIcon,
        available: true,
        order: 6,
        creationDate: "2026-06-07",
        description:
          "Download SoundCloud tracks as MP3 audio files. Paste any public SoundCloud track URL and save the audio instantly to your device. Powered by Cobalt.",
      },
      {
        name: "Universal Downloader",
        href: "/tools/video-downloader",
        icon: DownloadIcon,
        available: true,
        order: 7,
        creationDate: "2026-06-07",
        description:
          "All-in-one media downloader supporting YouTube, TikTok, Instagram, Twitter, Reddit, SoundCloud, and more. Paste any supported URL to download video or audio. Powered by Cobalt.",
      },
      {
        name: "HLS Stream Downloader",
        href: "/tools/hls-downloader",
        icon: VideoIcon,
        available: true,
        order: 8,
        creationDate: "2026-06-07",
        description:
          "Download HLS (.m3u8) video streams and merge segments into a single MP4 file directly in your browser. No software installation required.",
      },
      {
        name: "YouTube Thumbnail Grabber",
        href: "/tools/youtube-thumbnail",
        icon: ImageIcon,
        available: true,
        order: 9,
        creationDate: "2026-06-07",
        description:
          "Fetch and download YouTube video thumbnails in all available sizes: maxresdefault, hqdefault, mqdefault, and sddefault. Paste a YouTube URL or video ID.",
      },
      {
        name: "Video Frame Extractor",
        href: "/tools/video-frame-extractor",
        icon: CameraIcon,
        available: true,
        order: 10,
        creationDate: "2026-06-07",
        description:
          "Extract individual frames from any video file. Seek to specific timestamps and save frames as PNG or JPG images, all processed locally in your browser.",
      },
    ],
  },
];

// Helper function to get all tools as a flat array
export const getAllTools = (): (Tool & { category: string })[] => {
  return tools.flatMap((category) =>
    category.items.map((tool) => ({ ...tool, category: category.category })),
  );
};

// Helper function to find a tool by href
export const findToolByHref = (
  href: string,
): (Tool & { category: string }) | null => {
  const allTools = getAllTools();
  return allTools.find((tool) => tool.href === href) || null;
};

// Helper function to check if a tool is new (15 days or less)
export const isToolNew = (creationDate: string): boolean => {
  const toolDate = new Date(creationDate);
  const currentDate = new Date();
  const diffTime = currentDate.getTime() - toolDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 15;
};

// Helper function to get days since creation
export const getDaysSinceCreation = (creationDate: string): number => {
  const toolDate = new Date(creationDate);
  const currentDate = new Date();
  const diffTime = currentDate.getTime() - toolDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
