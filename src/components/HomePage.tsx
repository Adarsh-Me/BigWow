"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Calculator,
  ChevronRight,
  ChevronDown,
  Clock3,
  Code2,
  Command,
  Cpu,
  Database,
  FileText,
  Globe,
  Heart,
  History,
  Home,
  Image as ImageIcon,
  LayoutGrid,
  Mic,
  Palette,
  RotateCcw,
  Search,
  Send,
  Settings,
  Shield,
  Sparkles,
  Star,
  Upload,
  Video,
  X,
  Zap,
  Music,
  Wrench,
  Menu,
  Play,
  Bell,
  Plus,
  MoreHorizontal,
  Check,
  Download,
  Mail,
} from "lucide-react";
import { getAllTools, tools as allCategories } from "@/lib/tools-config";
import { expandSubTools } from "@/lib/sub-tools-config";
import { useFavoritesStore } from "@/store/favorites-store";
import { useRecentToolsStore } from "@/store/recent-tools-store";
import { useToolStore } from "@/store/tool-store";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import HomeFAQ from "@/components/HomeFAQ";
import { Button } from "@/components/ui/button";
import { RequestToolDialog } from "@/components/RequestToolDialog";
import { ThemeSwitcher } from "@/components/theme-switcher";
import MegaMenu from "@/components/mega-menu";
import MobileNavDrawer from "@/components/mobile-nav-drawer";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { PixelTrail } from "@/components/ui/pixel-trail";
import { GooeyFilter } from "@/components/ui/gooey-filter";
import { useScreenSize } from "@/hooks/use-screen-size";

// AI-First SPA Components
import { ToolRegistry } from "./ToolRegistry";
import AgentExecutionCard, { ExecutionStep } from "./AgentExecutionCard";
import AgentInput from "./AgentInput";
import ResultPanel from "./ResultPanel";
import AgentChainPanel from "./AgentChainPanel";
import type { ChainStep } from "@/types/agent";
import ChatWorkspace from "./ChatWorkspace";

interface HomePageProps {
  initialSearchQuery?: string;
}

/* ──────────────────────────────────────────────────────────────
   STATIC DATA — computed once, outside component to avoid
   hydration mismatches
   ────────────────────────────────────────────────────────────── */

const CATEGORY_META: Record<string, {
  bg: string;
  iconBg: string;
  iconColor: string;
  Icon: React.ComponentType<{ className?: string }>;
  displayName: string;
  shortDesc: string;
}> = {
  "Image Tools": {
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-500",
    Icon: ImageIcon,
    displayName: "Image Tools",
    shortDesc: "Edit, convert, enhance and optimise images.",
  },
  "File Tools": {
    bg: "bg-red-50",
    iconBg: "bg-red-100",
    iconColor: "text-red-500",
    Icon: FileText,
    displayName: "PDF Tools",
    shortDesc: "Create, convert, merge, split and secure PDFs.",
  },
  "Media Tools": {
    bg: "bg-violet-50",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-500",
    Icon: Video,
    displayName: "Video Tools",
    shortDesc: "Edit, trim, convert and work with videos.",
  },
  "Audio Tools": {
    bg: "bg-orange-50",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
    Icon: Music,
    displayName: "Audio Tools",
    shortDesc: "Edit audio, test mic, and analyse sound.",
  },
  "Text & Language Tools": {
    bg: "bg-sky-50",
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
    Icon: BookOpen,
    displayName: "Text & Writing",
    shortDesc: "Transform, optimise and analyse text easily.",
  },
  "Developer Tools": {
    bg: "bg-cyan-50",
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
    Icon: Code2,
    displayName: "Developer Tools",
    shortDesc: "Format, convert, test and debug like a pro.",
  },
  "Data Tools": {
    bg: "bg-amber-50",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    Icon: Database,
    displayName: "Data & Conversion",
    shortDesc: "Convert, decode and visualise data.",
  },
  "Math & Finance Tools": {
    bg: "bg-indigo-50",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    Icon: Calculator,
    displayName: "Math & Finance",
    shortDesc: "Calculators, converters and financial trackers.",
  },
  "Productivity Tools": {
    bg: "bg-pink-50",
    iconBg: "bg-pink-100",
    iconColor: "text-pink-500",
    Icon: BriefcaseBusiness,
    displayName: "Productivity",
    shortDesc: "Boost your productivity and daily workflow.",
  },
  "Security & Development Tools": {
    bg: "bg-teal-50",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
    Icon: Shield,
    displayName: "Security & Dev",
    shortDesc: "Secure, protect and analyse your data.",
  },
  "Design Tools": {
    bg: "bg-rose-50",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-500",
    Icon: Palette,
    displayName: "Design & Utility",
    shortDesc: "Colours, generators, viewers and utilities.",
  },
  "AI Tools": {
    bg: "bg-purple-50",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    Icon: Cpu,
    displayName: "AI Tools",
    shortDesc: "AI utilities, prompts, generators & more.",
  },
  "Media & Downloader Tools": {
    bg: "bg-sky-50",
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
    Icon: Download,
    displayName: "Video Downloader Tools",
    shortDesc: "Download YouTube, TikTok, Instagram, Reddit & more.",
  },
};

// Sidebar categories (static, no SSR mismatch)
const SIDEBAR_CATS = [
  { id: "imageTools",    label: "Image Tools",      count: 10, iconBg: "bg-blue-100",    iconColor: "text-blue-500",    Icon: ImageIcon },
  { id: "fileTools",     label: "PDF Tools",         count: 5,  iconBg: "bg-red-100",     iconColor: "text-red-500",     Icon: FileText },
  { id: "mediaTools",    label: "Video Tools",       count: 4,  iconBg: "bg-violet-100",  iconColor: "text-violet-500",  Icon: Video },
  { id: "audioTools",    label: "Audio Tools",       count: 3,  iconBg: "bg-orange-100",  iconColor: "text-orange-500",  Icon: Music },
  { id: "textLanguage",  label: "Text & Writing",    count: 16, iconBg: "bg-sky-100",     iconColor: "text-sky-600",     Icon: BookOpen },
  { id: "devTools",      label: "Developer Tools",   count: 17, iconBg: "bg-cyan-100",    iconColor: "text-cyan-600",    Icon: Code2 },
  { id: "dataTools",     label: "Data & Conversion", count: 15, iconBg: "bg-amber-100",   iconColor: "text-amber-600",   Icon: Database },
  { id: "aiTools",       label: "AI Tools",          count: 18, iconBg: "bg-purple-100",  iconColor: "text-purple-600",  Icon: Cpu },
  { id: "mathFinance",   label: "Math & Finance",    count: 12, iconBg: "bg-indigo-100",  iconColor: "text-indigo-600",  Icon: Calculator },
  { id: "productivity",  label: "Productivity",      count: 8,  iconBg: "bg-pink-100",    iconColor: "text-pink-500",    Icon: BriefcaseBusiness },
  { id: "securityDev",   label: "Security & Dev",    count: 12, iconBg: "bg-teal-100",    iconColor: "text-teal-600",    Icon: Shield },
  { id: "designTools",      label: "Design & Utility",        count: 9,  iconBg: "bg-rose-100",    iconColor: "text-rose-500",    Icon: Palette },
  { id: "mediaDownloaders", label: "Video Downloader Tools",   count: 10, iconBg: "bg-sky-100",     iconColor: "text-sky-600",     Icon: Download },
];

const QUICK_CHIPS = [
  "Compress PDF",
  "Remove background",
  "Convert JPG to SVG",
  "Generate Invoice",
  "Extract text from image",
];

const POPULAR_ACTIONS = [
  { label: "Compress PDF",       Icon: FileText,  iconBg: "bg-red-100",     iconColor: "text-red-500",    href: "/tools/pdf" },
  { label: "Remove Background",  Icon: ImageIcon, iconBg: "bg-blue-100",    iconColor: "text-blue-500",   href: "/tools/bg-removal" },
  { label: "Convert Image",      Icon: ImageIcon, iconBg: "bg-indigo-100",  iconColor: "text-indigo-600", href: "/tools/image-converter" },
  { label: "Generate Invoice",   Icon: FileText,  iconBg: "bg-orange-100",  iconColor: "text-orange-500", href: "/tools/invoice" },
  { label: "QR Code Generator",  Icon: Wrench,    iconBg: "bg-purple-100",  iconColor: "text-purple-600", href: "/tools/qr-generator" },
  { label: "JSON Formatter",     Icon: Code2,     iconBg: "bg-cyan-100",    iconColor: "text-cyan-600",   href: "/tools/json-formatter" },
];

export default function HomePage({ initialSearchQuery = "" }: HomePageProps) {
  const screenSize = useScreenSize();
  // ── State ──
  const [query, setQuery]           = useState(initialSearchQuery);
  const [toolSearch, setToolSearch] = useState("");
  const [sortBy, setSortBy]         = useState("Popular");
  const [mounted, setMounted]       = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [viewMode, setViewMode]     = useState<"grid" | "list">("grid");
  const scrollContainerRef          = useRef<HTMLDivElement>(null);

  const [generalEmail, setGeneralEmail] = useState("");
  const [generalSubbed, setGeneralSubbed] = useState(false);

  const allTools = useMemo(() => getAllTools(), []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  const handleGeneralWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!generalEmail.trim()) return;
    const existing = JSON.parse(localStorage.getItem("bigwow_general_waitlist") || "[]");
    existing.push({ email: generalEmail.trim(), timestamp: Date.now() });
    localStorage.setItem("bigwow_general_waitlist", JSON.stringify(existing));
    console.log("General AI Waitlist Capture:", generalEmail.trim(), existing);
    setGeneralSubbed(true);
  };

  // SPA Workbench & Drawer States
  const [activeToolHref, setActiveToolHref]     = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [isRouting, setIsRouting]               = useState(false);
  const [routingStatus, setRoutingStatus]       = useState<ExecutionStep>("thinking");
  const [routedToolName, setRoutedToolName]     = useState("");
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    let allCount = 0;
    allCategories.forEach((cat) => {
      const availableItems = cat.items.filter((item) => item.available);
      const expandedItems = expandSubTools(availableItems);
      const count = expandedItems.length;
      const displayName = CATEGORY_META[cat.category]?.displayName || cat.category;
      counts[displayName] = count;
      allCount += count;
    });
    counts["All"] = allCount;
    return counts;
  }, []);

  // AI Chain State — for multi-tool chained execution
  const [activeToolChain, setActiveToolChain]   = useState<ChainStep[]>([]);
  const [currentChainIndex, setCurrentChainIndex] = useState(0);
  const [aiReasoning, setAiReasoning]           = useState("");
  const [routingError, setRoutingError]         = useState<string | null>(null);

  // Chat Workspace Mode — full-page Lovable-style 2-pane view
  const [isChatMode, setIsChatMode]             = useState(false);
  const [chatInitialPrompt, setChatInitialPrompt] = useState("");

  const allToolsRef = useRef<HTMLDivElement>(null);

  // Avoid hydration mismatch for localStorage-driven data
  useEffect(() => { setMounted(true); }, []);

  // Smooth scroll to inline category drawer when expanded
  useEffect(() => {
    if (expandedCategory) {
      setTimeout(() => {
        const drawer = document.getElementById("inline-category-drawer");
        if (drawer) {
          drawer.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }, 120);
    }
  }, [expandedCategory]);

  // Expose Zustand store states and handlers
  const favorites       = useFavoritesStore((state) => state.favorites);
  const recentTools     = useRecentToolsStore((state) => state.recentTools);
  const toggleFavorite  = useFavoritesStore((state) => state.toggleFavorite);
  const isFavorite      = useFavoritesStore((state) => state.isFavorite);
  const addRecentTool   = useRecentToolsStore((state) => state.addRecentTool);
  const setCurrentTool  = useToolStore((state) => state.setCurrentTool);

  const { getFavoriteTools } = useFavoritesStore();
  const { getRecentTools }   = useRecentToolsStore();

  const favoriteCount = mounted ? getFavoriteTools(allTools).length : 0;
  const recentCount   = mounted ? getRecentTools(allTools).length   : 0;

  const topRecentTools = useMemo(() => {
    if (!mounted) return [];
    return recentTools
      .map((rt) => allTools.find((t) => t.href === rt.href))
      .filter((t): t is typeof allTools[number] => !!t && t.available)
      .slice(0, 5);
  }, [recentTools, allTools, mounted]);

  const explorerCategories = useMemo(() => {
    const list = [
      { id: "All", label: "All", count: categoryCounts["All"] ?? 0 }
    ];
    if (favoriteCount > 0) {
      list.push({ id: "Favorites", label: "Favorites", count: favoriteCount });
    }
    if (recentCount > 0) {
      list.push({ id: "Recent Tools", label: "Recent Tools", count: recentCount });
    }
    allCategories
      .sort((a, b) => a.order - b.order)
      .forEach(cat => {
        const displayName = CATEGORY_META[cat.category]?.displayName || cat.category;
        const count = categoryCounts[displayName] ?? 0;
        if (count > 0) {
          list.push({
            id: displayName,
            label: displayName,
            count: count
          });
        }
      });
    return list;
  }, [allCategories, categoryCounts, favoriteCount, recentCount]);

  // ── Category click handler ──
  const handleCategoryClick = (displayName: string) => {
    setSelectedCategory(displayName);
    setToolSearch("");
    setActiveToolHref(null);
    // Small delay so state updates first, then scroll
    setTimeout(() => {
      allToolsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  // ── Tool Selection Handler ──
  const handleToolClick = (e: React.MouseEvent | null, href: string) => {
    if (e) e.preventDefault();
    addRecentTool(href);
    setActiveToolHref(href);
    
    // Sync to global tool store for header name display
    const targetTool = allTools.find((t) => t.href === href);
    if (targetTool) {
      setCurrentTool({
        name: targetTool.name,
        href: targetTool.href,
        description: targetTool.description,
        category: targetTool.category || "Utility",
      });
    }
    
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Clean Home Reset SPA State ──
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveToolHref(null);
    setExpandedCategory(null);
    setSelectedCategory("All");
    setToolSearch("");
    setIsRouting(false);
    setCurrentTool(null);
    setIsChatMode(false);
    setChatInitialPrompt("");
  };

  // ── Enter Chat Workspace Mode ──────────────────────────────
  const handleAISearchWithQuery = (queryText: string) => {
    const q = queryText.trim();
    if (!q) return;
    setChatInitialPrompt(q);
    setIsChatMode(true);
  };

  const handleAISearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAISearchWithQuery(query);
  };

  // ── Active Tool Metadata Calculations ──
  const activeTool = useMemo(() => {
    if (!activeToolHref) return null;
    return allTools.find((t) => t.href === activeToolHref);
  }, [activeToolHref, allTools]);

  const activeCategory = useMemo(() => {
    if (!activeTool) return null;
    const cat = allCategories.find((c) =>
      c.items.some((item) => item.href === activeTool.href)
    );
    return cat ? CATEGORY_META[cat.category]?.displayName || cat.category : null;
  }, [activeTool, allCategories]);

  // ── All-tools grid — filtered by category + search ──
  const allToolCards = useMemo(() => {
    let pool: typeof allTools;
    if (selectedCategory === "All") {
      pool = allTools.filter((t) => t.available);
    } else if (selectedCategory === "Favorites") {
      pool = getFavoriteTools(allTools);
    } else if (selectedCategory === "Recent Tools") {
      pool = getRecentTools(allTools);
    } else {
      const matchCat = allCategories.find(
        (cat) => CATEGORY_META[cat.category]?.displayName === selectedCategory
      );
      pool = matchCat ? (matchCat.items.filter((t) => t.available) as typeof allTools) : [];
    }

    const q = toolSearch.trim().toLowerCase();
    if (!q) return pool;
    return pool.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        (t.command && t.command.toLowerCase().includes(q))
    );
  }, [allTools, toolSearch, selectedCategory, favorites, recentTools, getFavoriteTools, getRecentTools, allCategories]);

  const categoryTitle = useMemo(() => {
    if (selectedCategory === "All") return "All Tools";
    if (selectedCategory === "Favorites") return "Your Favorites";
    if (selectedCategory === "Recent Tools") return "Recently Used Tools";
    return selectedCategory;
  }, [selectedCategory]);

  const categorySubtitle = useMemo(() => {
    if (selectedCategory === "All") return "Explore our complete suite of 101+ client-side utilities.";
    if (selectedCategory === "Favorites") return "Quick access to your hand-picked favorite tools.";
    if (selectedCategory === "Recent Tools") return "Your recently processed and loaded operations.";
    return `Fully private, client-side ${selectedCategory.toLowerCase()} solutions.`;
  }, [selectedCategory]);

  // ── Category grid ──
  const categoryGrid = useMemo(
    () =>
      allCategories
        .sort((a, b) => a.order - b.order)
        .map((cat) => ({
          ...cat,
          meta: CATEGORY_META[cat.category],
          count: cat.items.filter((t) => t.available).length,
        }))
        .filter((cat) => cat.meta),
    [allCategories]
  );

  // ── Tool ── category color map (href ── iconBg + iconColor) ──
  const toolColorMap = useMemo(() => {
    const map: Record<string, { iconBg: string; iconColor: string }> = {};
    allCategories.forEach((cat) => {
      const meta = CATEGORY_META[cat.category];
      if (!meta) return;
      cat.items.forEach((tool) => {
        map[tool.href] = { iconBg: meta.iconBg, iconColor: meta.iconColor };
      });
    });
    return map;
  }, [allCategories]);

  // Proximity animation effect for tool cards and navigation items
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePointerMove = (e: PointerEvent) => {
      // 1. Tool Cards proximity (2D Euclidean distance check)
      const cards = document.querySelectorAll(".proximity-card");
      cards.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const rect = htmlEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
        
        const threshold = 240; 
        const proximity = Math.max(0, 1 - dist / threshold); // 0 to 1
        
        if (proximity > 0) {
          // Scale up to 1.05 and subtly darken by up to 4%
          htmlEl.style.transform = `scale(${1 + proximity * 0.05})`;
          htmlEl.style.filter = `brightness(${1 - proximity * 0.04})`;
          htmlEl.style.borderColor = `rgba(99, 102, 241, ${0.05 + proximity * 0.35})`; // dynamic theme border glow using Indigo
          htmlEl.style.zIndex = "10";
          htmlEl.style.transition = "transform 0.1s ease-out, filter 0.1s ease-out, border-color 0.1s ease-out";
        } else {
          htmlEl.style.transform = "";
          htmlEl.style.filter = "";
          htmlEl.style.borderColor = "";
          htmlEl.style.zIndex = "";
          htmlEl.style.transition = "";
        }
      });

      // 2. Navigation items proximity (1D/2D distance check for menu bar)
      const navItems = document.querySelectorAll(".proximity-nav");
      navItems.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const rect = htmlEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
        
        const threshold = 120;
        const proximity = Math.max(0, 1 - dist / threshold); // 0 to 1
        
        if (proximity > 0) {
          htmlEl.style.transform = `scale(${1 + proximity * 0.1})`; // scale nav tabs up to 10%
          htmlEl.style.filter = `brightness(${1 - proximity * 0.04})`;
          htmlEl.style.transition = "transform 0.1s ease-out, filter 0.1s ease-out";
        } else {
          htmlEl.style.transform = "";
          htmlEl.style.filter = "";
          htmlEl.style.transition = "";
        }
      });
    };

    const handlePointerLeave = () => {
      document.querySelectorAll(".proximity-card").forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.transform = "";
        htmlEl.style.filter = "";
        htmlEl.style.borderColor = "";
        htmlEl.style.zIndex = "";
        htmlEl.style.transition = "";
      });
      document.querySelectorAll(".proximity-nav").forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.transform = "";
        htmlEl.style.filter = "";
        htmlEl.style.transition = "";
      });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  const springTransition = {
    type: "spring" as const,
    stiffness: 200,
    damping: 25
  };



  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground select-none font-sans relative">
      


      {/* ── CONDITIONAL HEADER ────────────────────────────── */}
      {activeToolHref ? (
        <header className="sticky top-0 z-40 w-full border-b border-border glass-strong shadow-floating transition-all duration-200">
          <div className="flex h-16 items-center px-4 md:px-8 max-w-[1400px] mx-auto gap-4">
            <button
              onClick={handleHomeClick}
              className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground active:scale-95 transition-all border border-border px-3.5 py-2 rounded-xl bg-background/5"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              <span>Back to Dashboard</span>
            </button>
            <div className="flex-1 text-center font-display font-extrabold text-sm text-foreground truncate">
              {activeTool?.name} <span className="text-[10px] uppercase text-muted-foreground ml-2">({activeCategory})</span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <ThemeSwitcher className="h-9 w-9 hover:bg-secondary/60 rounded-xl" />
            </div>
          </div>
        </header>
      ) : (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] sm:w-auto max-w-2xl">
          <div className="flex items-center justify-between gap-6 px-4 py-2 rounded-full border border-border/80 glass shadow-floating relative">
            <button
              onClick={handleHomeClick}
              aria-label="Go to BigWow home"
              className="flex items-center gap-2 active:scale-98 transition-transform shrink-0"
            >
              <Zap className="h-4 w-4 text-foreground block sm:hidden ml-2" aria-hidden="true" />
              <span className="hidden sm:inline-block font-display text-sm font-bold tracking-tight text-foreground pl-2">
                BigWow
              </span>
            </button>

            <nav className="flex items-center gap-1 sm:gap-2">
              {[
                { id: "home", Icon: Home, label: "Home" },
                { id: "core-tools", Icon: LayoutGrid, label: "Tools" },
                { id: "faq", Icon: BookOpen, label: "FAQ" }
              ].map((item) => {
                const TabIcon = item.Icon;
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const el = document.getElementById(item.id);
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="relative flex h-11 w-11 items-center justify-center rounded-full border bg-foreground/5 hover:bg-foreground/10 text-foreground border-border/40 transition-all"
                    title={item.label}
                  >
                    <TabIcon className="h-5 w-5" />
                  </motion.button>
                );
              })}
            </nav>

            <div className="flex items-center gap-2 shrink-0">
              <ThemeSwitcher className="h-9 w-9 hover:bg-secondary/60 rounded-full" />
              <RequestToolDialog
                triggerClassName="border-border text-foreground hover:bg-foreground/10"
                trigger={
                  <Button
                    className="hidden sm:inline-flex h-11 rounded-full bg-foreground text-background hover:bg-foreground/90 text-xs font-bold px-6 shadow-floating"
                  >
                    Request a tool
                  </Button>
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springTransition}
          className="w-full flex flex-col"
        >
          {isRouting ? (
            <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center min-h-[500px]">
              <AgentExecutionCard
                status={routingStatus}
                toolName={routedToolName}
                selectedTools={activeToolChain.map((t) => t.name)}
              />
            </div>
          ) : activeToolHref ? (
            <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
              {(() => {
                const ToolComponent = ToolRegistry[activeToolHref];
                const toolEl = ToolComponent ? <ToolComponent /> : (
                  <div className="text-center py-12">
                    <p className="text-sm text-slate-500">Tool workspace mounting in progress...</p>
                  </div>
                );

                if (activeToolChain.length > 1) {
                  return (
                    <AgentChainPanel
                      steps={activeToolChain}
                      reasoning={aiReasoning}
                      currentIndex={currentChainIndex}
                      onNext={() => {
                        const nextIdx = currentChainIndex + 1;
                        if (nextIdx < activeToolChain.length) {
                          setActiveToolChain((prev) =>
                            prev.map((s, i) =>
                              i === currentChainIndex
                                ? { ...s, status: "done" }
                                : i === nextIdx
                                ? { ...s, status: "active" }
                                : s
                            )
                          );
                          setCurrentChainIndex(nextIdx);
                          handleToolClick(null, activeToolChain[nextIdx].href);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      }}
                      onReset={() => {
                        setActiveToolChain([]);
                        setCurrentChainIndex(0);
                        setActiveToolHref(null);
                        setAiReasoning("");
                      }}
                    >
                      {toolEl}
                    </AgentChainPanel>
                  );
                }

                return toolEl;
              })()}
            </div>
          ) : (
            <>
              {/* ── HERO BANNER WRAPPER WITH DECORATIVE BACKGROUNDS ─────────────────── */}
              <div className="relative w-full overflow-hidden shrink-0">
                {/* Organic Pulsing SVG Decorative Blobs */}
                <div className="absolute top-1/4 -left-48 w-[500px] h-[500px] pointer-events-none opacity-45 mix-blend-multiply filter blur-3xl dark:mix-blend-screen animate-blob-pulse" style={{ animationDuration: "12s" }}>
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="fill-[#f0efed] dark:fill-[#1b1b1b] w-full h-full">
                    <path d="M43.7,-76.3C55.4,-70.6,62.8,-55.9,69.5,-41.8C76.1,-27.7,82,-13.8,82,-0.1C81.9,13.7,75.9,27.3,68.4,39.8C60.9,52.3,51.8,63.6,39.9,72.4C28,81.1,14,87.4,-0.8,88.7C-15.6,90,-31.2,86.4,-44.6,78.3C-58,70.2,-69.1,57.7,-76.7,43.5C-84.3,29.3,-88.4,14.7,-88.6,-0.1C-88.8,-15,-85,-29.9,-77.4,-43.3C-69.8,-56.6,-58.4,-68.4,-44.8,-73.2C-31.2,-78,-15.6,-75.7,0.1,-75.9C15.8,-76.1,31.7,-78.9,43.7,-76.3Z" transform="translate(100 100)" />
                  </svg>
                </div>
                <div className="absolute top-2/3 -right-48 w-[600px] h-[600px] pointer-events-none opacity-45 mix-blend-multiply filter blur-3xl dark:mix-blend-screen animate-blob-pulse" style={{ animationDuration: "18s", animationDelay: "2s" }}>
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="fill-[#eae9e7] dark:fill-[#141414] w-full h-full">
                    <path d="M42.2,-73.7C52.9,-68.3,58.7,-52.1,65.6,-37C72.5,-21.9,80.5,-7.9,81.1,6.5C81.7,20.8,74.9,35.4,65.6,47.4C56.2,59.3,44.4,68.6,30.9,75C17.5,81.5,2.4,85.2,-13.4,84.1C-29.2,83.1,-45.7,77.4,-58.4,67.6C-71.1,57.7,-79.9,43.8,-83.9,28.6C-87.9,13.4,-87,3.1,-84,-7.8C-80.9,-18.6,-75.8,-30.1,-67.6,-40.4C-59.5,-50.7,-48.3,-59.8,-35.9,-64.8C-23.5,-69.7,-10,-70.6,3.4,-75.2C16.8,-79.8,31.6,-88.2,42.2,-73.7Z" transform="translate(100 100)" />
                  </svg>
                </div>

                {/* Interactive Gooey Pixel Trail Background */}
                <GooeyFilter id="homepage-gooey-pixel-trail" strength={6} />
                <div
                  className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-35 dark:opacity-20"
                  style={{ filter: "url(#homepage-gooey-pixel-trail)" }}
                >
                  <PixelTrail
                    pixelSize={screenSize.lessThan("md") ? 24 : 32}
                    fadeDuration={800}
                    delay={0}
                    pixelClassName="bg-neutral-400/25 dark:bg-neutral-600/20"
                  />
                </div>

                <section id="home" className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-4 sm:pb-6 w-full relative z-10">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_0%,transparent_60%)] pointer-events-none" />

                  <div className="flex flex-col items-center justify-center text-center gap-8 max-w-4xl mx-auto py-12 relative z-10">
                    <div className="space-y-6">
                      <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-foreground/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
                        <Shield className="h-3.5 w-3.5 text-foreground" />
                        100% Client-Side Privacy OS
                      </div>
                      
                      <h1 className="text-5xl sm:text-8xl md:text-[8rem] font-display font-black leading-[0.85] tracking-tighter text-foreground select-none">
                        BigWow
                      </h1>
                      
                      <p className="text-lg sm:text-[24px] text-muted-foreground font-medium max-w-2xl mx-auto leading-normal font-sans">
                        Your personal digital executive, powered by AI. No server uploads. Every tool. Zero chaos.
                      </p>
                    </div>

                    {/* Centered Search Prompt Pill */}
                    <form onSubmit={handleAISearchSubmit} className="w-full max-w-2xl rounded-full border border-border/80 bg-background pl-6 pr-2.5 py-2 flex items-center justify-between gap-3 shadow-floating hover:border-accent/50 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/15 transition-all duration-300">
                      <Search className="h-4.5 w-4.5 shrink-0 text-muted-foreground/60" />
                      <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search tools or ask AI (e.g. compress my PDF)..."
                        className="flex-1 text-[13px] sm:text-[14px] text-foreground bg-transparent outline-none placeholder-muted-foreground/50 font-medium py-1"
                      />
                      <button type="submit" className="px-6 py-2.5 rounded-full bg-foreground hover:bg-foreground/90 text-background text-xs font-bold tracking-tight shadow-sm transition-all shrink-0">
                        Search
                      </button>
                    </form>

                    {/* Try Chips */}
                    <div className="flex items-center justify-center gap-2 text-[11px] sm:text-[12px] flex-wrap max-w-xl mx-auto">
                      <span className="text-muted-foreground font-semibold">Try these:</span>
                      {QUICK_CHIPS.map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => handleAISearchWithQuery(chip)}
                          className="px-3.5 py-1 rounded-full border border-border/80 bg-background hover:border-foreground hover:text-foreground text-muted-foreground font-medium transition-all shadow-sm active:scale-95"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>
                </section>
              </div>


              {/* ── WAVE SVG TRANSITION (56px High) ───────────────────────────── */}
              <div className="w-full overflow-hidden leading-none relative h-12 sm:h-16 bg-transparent shrink-0">
                <svg viewBox="0 0 1440 80" className="w-full h-full fill-[#f5f5f0] dark:fill-[#121212] transition-colors duration-300">
                  <path d="M0,80 C240,0 480,80 720,40 C960,0 1200,80 1440,40 L1440,80 L0,80 Z" />
                </svg>
              </div>

              {/* ── UNIFIED TOOLS EXPLORER (FLOWSTATE THEME) ─────────────────── */}
              <section id="core-tools" className="bg-[#f5f5f0] dark:bg-[#121212] pt-4 sm:pt-8 pb-12 sm:pb-20 transition-colors duration-300 w-full relative z-10">
                <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                  
                  {/* Search Bar & View Mode Toggle */}
                  <div className="flex items-center gap-3 w-full">
                    <div className="relative flex-1 w-full">
                      <Search className="absolute left-3.5 sm:left-4 top-1/2 h-4.5 w-4.5 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground/60" />
                      <input
                        type="text"
                        value={toolSearch}
                        onChange={(e) => setToolSearch(e.target.value)}
                        placeholder="Search tools..."
                        className="w-full h-11 sm:h-14 rounded-xl sm:rounded-2xl border border-border/80 bg-background pl-10 sm:pl-12 pr-6 text-xs sm:text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all font-medium placeholder:text-muted-foreground/50 shadow-floating"
                      />
                      {toolSearch && (
                        <button 
                          onClick={() => setToolSearch("")} 
                          type="button" 
                          className="absolute right-4 top-1/2 -translate-y-1/2"
                        >
                          <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                        </button>
                      )}
                    </div>
                    
                    {/* View Mode Buttons */}
                    <div className="flex items-center gap-0.5 p-1 rounded-xl border border-border/80 bg-background shadow-floating shrink-0 font-sans h-11 sm:h-14">
                      <button
                        type="button"
                        onClick={() => setViewMode("grid")}
                        className={cn(
                          "p-1.5 sm:p-2.5 rounded-lg transition-colors active:scale-95",
                          viewMode === "grid" 
                            ? "bg-foreground/5 text-foreground border border-border/45" 
                            : "text-muted-foreground hover:text-foreground"
                        )}
                        title="Grid View"
                      >
                        <LayoutGrid className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode("list")}
                        className={cn(
                          "p-1.5 sm:p-2.5 rounded-lg transition-colors active:scale-95",
                          viewMode === "list" 
                            ? "bg-foreground/5 text-foreground border border-border/45" 
                            : "text-muted-foreground hover:text-foreground"
                        )}
                        title="List View"
                      >
                        <Menu className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                      </button>
                    </div>
                  </div>

                  {/* Horizontal Scroll Selector Slider (Pills with Counts) */}
                  <div className="relative flex items-center gap-2 group/slider font-sans w-full">
                    {/* Left Scroll Button */}
                    <button
                      type="button"
                      onClick={scrollLeft}
                      aria-label="Scroll categories left"
                      className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background shadow-floating hover:bg-secondary/60 active:scale-90 transition-all shrink-0 z-20"
                    >
                      <ChevronRight className="h-4 w-4 rotate-180 text-foreground" aria-hidden="true" />
                    </button>

                    {/* Scroll Container Wrapper with Fading Gradients */}
                    <div className="relative flex-1 overflow-hidden flex items-center">
                      {/* Left Gradient Overlay */}
                      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#f5f5f0] dark:from-[#121212] to-transparent pointer-events-none z-10" />

                      {/* Scroll Container */}
                      <div
                        ref={scrollContainerRef}
                        className="flex-1 flex items-center gap-3.5 overflow-x-auto py-2 px-6 scrollbar-none select-none scroll-smooth"
                        style={{ scrollbarWidth: "none" }}
                      >
                        {explorerCategories.map((opt) => {
                          const isSelected = selectedCategory === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setSelectedCategory(opt.id)}
                              className={cn(
                                "flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-bold transition-all whitespace-nowrap active:scale-95 cursor-pointer",
                                isSelected 
                                  ? "bg-foreground text-background border-foreground shadow-sm" 
                                  : "bg-background border-border/80 text-muted-foreground hover:text-foreground hover:border-border"
                              )}
                            >
                              <span>{opt.label}</span>
                              <span 
                                className={cn(
                                  "flex items-center justify-center text-[9px] font-black px-1.5 rounded-full shrink-0 min-w-[20px] h-5 leading-none",
                                  isSelected ? "bg-background text-foreground" : "bg-foreground/5 text-muted-foreground"
                                )}
                              >
                                {opt.count}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Right Gradient Overlay */}
                      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#f5f5f0] dark:from-[#121212] to-transparent pointer-events-none z-10" />
                    </div>

                    {/* Right Scroll Button */}
                    <button
                      type="button"
                      onClick={scrollRight}
                      aria-label="Scroll categories right"
                      className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background shadow-floating hover:bg-secondary/60 active:scale-90 transition-all shrink-0 z-20"
                    >
                      <ChevronRight className="h-4 w-4 text-foreground" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Recently Opened Top 5 Tools */}
                  {selectedCategory === "All" && !toolSearch.trim() && topRecentTools.length > 0 && (
                    <div className="w-full text-left space-y-3 pb-2">
                      <span className="text-[10px] font-display font-black text-foreground/60 tracking-widest uppercase leading-none block">
                        Recently Opened
                      </span>
                      <div className="flex flex-wrap items-center gap-2.5">
                        {topRecentTools.map((tool) => {
                          const ToolIcon = tool.icon;
                          return (
                            <a
                              key={tool.href}
                              href={tool.href}
                              onClick={(e) => handleToolClick(e, tool.href)}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-border bg-background hover:bg-foreground/5 hover:border-foreground/20 active:scale-95 transition-all text-xs font-bold text-foreground shadow-sm"
                            >
                              <ToolIcon className="h-4 w-4 text-foreground" />
                              <span>{tool.name}</span>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Category Title Heading */}
                  <div className="text-left pt-2 border-t border-border/40 w-full">
                    <p role="heading" aria-level={2} className="text-xs font-display font-extrabold text-foreground tracking-widest leading-none uppercase">
                      {toolSearch.trim() ? "Search Results" : selectedCategory}
                    </p>
                  </div>

                  {/* Grid / List of Cards */}
                  <div className="w-full">
                    {allToolCards.length > 0 ? (
                      viewMode === "grid" ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
                          {allToolCards.map((tool, i) => {
                            const ToolIcon = tool.icon;
                            const favorited = isFavorite(tool.href);
                            return (
                              <div
                                key={tool.href}
                                className="group relative select-none h-[130px] sm:h-[160px]"
                              >
                                <a
                                  href={tool.href}
                                  onClick={(e) => handleToolClick(e, tool.href)}
                                  className="flex flex-col items-center justify-center text-center p-4 sm:p-6 rounded-[24px] sm:rounded-[32px] border border-border bg-background hover:shadow-floating hover:border-foreground/20 transition-all h-full w-full active:scale-[0.985] gap-2.5 sm:gap-4"
                                >
                                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-foreground/5 dark:bg-foreground/10 text-foreground border border-border/40 transition-all duration-300 group-hover:scale-105">
                                    <ToolIcon className="h-4.5 w-4.5 sm:h-5.5 sm:w-5.5 text-foreground" />
                                  </div>
                                  <div className="text-[12px] sm:text-[13px] font-extrabold text-foreground line-clamp-2 leading-tight px-2 sm:px-6 font-sans text-center">
                                    {tool.name}
                                  </div>
                                </a>
                                
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleFavorite(tool.href);
                                  }}
                                  className="absolute right-1.5 top-1.5 sm:right-3 sm:top-3 p-1.5 sm:p-2 rounded-lg hover:bg-foreground/5 transition-colors shrink-0 z-20 min-w-[24px] min-h-[24px] flex items-center justify-center"
                                  aria-label={favorited ? `Remove ${tool.name} from favorites` : `Add ${tool.name} to favorites`}
                                >
                                  <Heart
                                    aria-hidden="true"
                                    className={cn(
                                      "h-3.5 w-3.5 transition-colors",
                                      favorited
                                        ? "text-red-500 fill-red-500"
                                        : "text-muted-foreground/35 group-hover:text-red-300"
                                    )}
                                  />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2.5 w-full">
                          {allToolCards.map((tool, i) => {
                            const ToolIcon = tool.icon;
                            const favorited = isFavorite(tool.href);
                            return (
                              <div
                                key={tool.href}
                                className="group relative select-none"
                              >
                                <a
                                  href={tool.href}
                                  onClick={(e) => handleToolClick(e, tool.href)}
                                  className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-background hover:shadow-floating hover:border-foreground/20 transition-all w-full text-left active:scale-[0.985] pr-12"
                                >
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-foreground/5 dark:bg-foreground/10 text-foreground border border-border/40 transition-all duration-300 group-hover:scale-105">
                                    <ToolIcon className="h-4.5 w-4.5 text-foreground" />
                                  </div>
                                  <div className="min-w-0 flex-1 font-sans">
                                    <div className="text-[13px] font-extrabold text-foreground leading-snug">
                                      {tool.name}
                                    </div>
                                    <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1 leading-snug font-medium">
                                      {tool.description}
                                    </p>
                                  </div>
                                </a>
                                
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleFavorite(tool.href);
                                  }}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-foreground/5 transition-colors shrink-0 z-20 min-w-[24px] min-h-[24px] flex items-center justify-center"
                                  aria-label={favorited ? `Remove ${tool.name} from favorites` : `Add ${tool.name} to favorites`}
                                >
                                  <Heart
                                    aria-hidden="true"
                                    className={cn(
                                      "h-3.5 w-3.5 transition-colors",
                                      favorited
                                        ? "text-red-500 fill-red-500"
                                        : "text-muted-foreground/35 group-hover:text-red-300"
                                    )}
                                  />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )
                    ) : (
                      <div className="text-center py-16 rounded-[40px] border border-dashed border-border bg-background/5 space-y-3 max-w-4xl mx-auto font-sans">
                        <Search className="h-8 w-8 mx-auto text-muted-foreground/45" />
                        <p className="text-sm font-semibold text-muted-foreground">No tools found matching &ldquo;{toolSearch}&rdquo;</p>
                        <button 
                          onClick={() => { setToolSearch(""); setSelectedCategory("All"); }}
                          className="text-xs text-foreground font-bold hover:underline"
                        >
                          Reset Filters
                        </button>
                      </div>
                    )}
                  </div>
                  
                </div>
              </section>

              {/* ── WAVE SVG TRANSITION (INVERTED) ────────────────────────────── */}
              <div className="w-full overflow-hidden leading-none relative h-12 sm:h-16 bg-transparent shrink-0 rotate-180">
                <svg viewBox="0 0 1440 80" className="w-full h-full fill-[#f5f5f0] dark:fill-[#121212] transition-colors duration-300">
                  <path d="M0,80 C240,0 480,80 720,40 C960,0 1200,80 1440,40 L1440,80 L0,80 Z" />
                </svg>
              </div>

              {/* ── OFFLINE AI WAITLIST CTA ──────────────────────── */}
              <section className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
                <div className="rounded-[28px] sm:rounded-[40px] border border-border glass shadow-floating p-6 sm:p-12 space-y-6 relative overflow-hidden font-sans">
                  <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-accent/5 blur-[80px] pointer-events-none" />
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="space-y-4 max-w-xl text-left">
                      <div className="inline-flex items-center gap-1 bg-foreground/5 text-foreground px-3.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase border border-border/40">
                        <Zap className="h-3 w-3" />
                        WebGPU Offline Roadmap
                      </div>
                      <h3 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-foreground leading-none">
                        Looking for more offline AI capabilities?
                      </h3>
                      <p className="text-sm text-muted-foreground font-semibold leading-relaxed">
                        We are developing optimized WebGPU execution shaders to run advanced AI models 100% locally in your browser cache. Join the waitlist for updates and early access to:
                      </p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs text-muted-foreground font-bold mt-2">
                        <li className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                          4x Super Resolution AI Upscaler
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                          Offline Whisper Audio Transcription
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                          Local AI Video Compressor
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                          Offline LLM Chat (Llama-3-8B)
                        </li>
                      </ul>
                    </div>

                    <div className="w-full md:w-80 shrink-0">
                      {!generalSubbed ? (
                        <form onSubmit={handleGeneralWaitlistSubmit} className="space-y-3">
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground/60" />
                            <input
                              type="email"
                              required
                              value={generalEmail}
                              onChange={(e) => setGeneralEmail(e.target.value)}
                              placeholder="Enter your email address..."
                              className="w-full text-xs font-semibold pl-10 pr-4 py-3.5 rounded-xl border border-border bg-background outline-none focus:border-accent transition-colors"
                            />
                          </div>
                          <Button
                            type="submit"
                            className="w-full rounded-xl bg-foreground hover:bg-foreground/90 text-background text-xs font-bold py-3.5 shadow-sm border border-border"
                          >
                            Join Offline AI Beta
                          </Button>
                        </form>
                      ) : (
                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                          <Check className="h-4.5 w-4.5 text-emerald-500 shrink-0 animate-bounce" />
                          <span>You're subscribed! We'll email you updates.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* FAQ Section */}
              <section id="faq" className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 pb-24 w-full">
                <HomeFAQ />
              </section>
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
}
