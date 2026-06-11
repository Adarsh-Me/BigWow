import NavigationTracker from "@/components/NavigationTracker";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";


export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground transition-colors duration-200 flex-col">
      <NavigationTracker />

      {/* Premium Sticky Header for individual tool pages */}
      <header className="sticky top-0 z-40 w-full h-14 border-b border-border glass-strong shadow-floating flex items-center justify-between px-4 sm:px-6 shrink-0 select-none">
        <Link
          href="/browser-tools"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/60 hover:bg-secondary/60 text-xs font-bold text-muted-foreground hover:text-foreground transition-all duration-150 active:scale-98"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>All Tools</span>
        </Link>

        <Link href="/" className="flex items-center gap-2 active:scale-98 transition-transform">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-accent-foreground shadow-sm shrink-0">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <span className="font-display text-xs font-bold tracking-tight text-foreground hidden sm:block">
            BigWow
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeSwitcher className="h-8 w-8 hover:bg-secondary/60 rounded-xl" />
        </div>
      </header>

      {/* Main workspace — full width, no sidebar */}
      <main className="flex-1 overflow-auto py-6 px-4 md:px-8 bg-background/50 backdrop-blur-sm transition-all duration-150 animate-in fade-in duration-200">
        <div className="mx-auto max-w-[1400px] h-full flex flex-col">

          {children}
        </div>
      </main>
    </div>
  );
}
