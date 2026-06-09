"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Home,
  Zap,
  Target,
  Clock,
  User,
  Sparkles,
  Shield,
  ArrowRight,
  ChevronRight,
  Activity,
  Layers,
  CheckCircle2,
  Compass
} from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";

export default function FlowStateShowcase() {
  const [activeTab, setActiveTab] = useState("home");

  const springTransition = {
    type: "spring" as const,
    stiffness: 200,
    damping: 25
  };

  const navItems = [
    { id: "home", Icon: Home, label: "Home" },
    { id: "features", Icon: Zap, label: "Features" },
    { id: "stats", Icon: Target, label: "Stats" },
    { id: "timeline", Icon: Clock, label: "Timeline" },
    { id: "about", Icon: User, label: "About" }
  ];

  const stats = [
    { value: "8–12", label: "Apps used before noon", desc: "bloating your browser stack daily" },
    { value: "23min", label: "To regain deep focus", desc: "wasted after a single notification" },
    { value: "47", label: "Average open tabs", desc: "cluttering your screen right now" }
  ];

  const features = [
    {
      title: "Context-Aware Workspace",
      desc: "One tab that dynamically bundles code tools, formatters, and design assets based on your active mindset.",
      Icon: Layers
    },
    {
      title: "Local-First Privacy Guard",
      desc: "Zero server uploads. Data stays completely client-side in secure local storage vaults.",
      Icon: Shield
    },
    {
      title: "WebGPU Accelerated Work",
      desc: "Run neural rendering, upscale imagery, and compress PDFs using your local system hardware.",
      Icon: Sparkles
    }
  ];

  const timelineSteps = [
    {
      step: "01",
      title: "Assess Context",
      desc: "The OS analyzes your current workspace state and compiles a tailored suite of client-side utilities.",
      side: "left"
    },
    {
      step: "02",
      title: "Minimize Cognitive Load",
      desc: "Cluttered browser tabs are collapsed into single-mindset focus groups, restoring deep focus in minutes.",
      side: "right"
    },
    {
      step: "03",
      title: "Execute Locally",
      desc: "Compute operations (upscaling, compression, conversion) run natively using WebGPU, with zero server hops.",
      side: "left"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground select-none overflow-x-hidden font-sans relative pb-24 transition-colors duration-300">
      
      {/* Organic Pulsing SVG Decorative Blobs */}
      <div className="absolute top-1/4 -left-48 w-[500px] h-[500px] pointer-events-none opacity-40 mix-blend-multiply filter blur-3xl dark:mix-blend-screen animate-blob-pulse" style={{ animationDuration: "12s" }}>
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="fill-[#f0efed] dark:fill-[#1b1b1b] w-full h-full">
          <path d="M43.7,-76.3C55.4,-70.6,62.8,-55.9,69.5,-41.8C76.1,-27.7,82,-13.8,82,-0.1C81.9,13.7,75.9,27.3,68.4,39.8C60.9,52.3,51.8,63.6,39.9,72.4C28,81.1,14,87.4,-0.8,88.7C-15.6,90,-31.2,86.4,-44.6,78.3C-58,70.2,-69.1,57.7,-76.7,43.5C-84.3,29.3,-88.4,14.7,-88.6,-0.1C-88.8,-15,-85,-29.9,-77.4,-43.3C-69.8,-56.6,-58.4,-68.4,-44.8,-73.2C-31.2,-78,-15.6,-75.7,0.1,-75.9C15.8,-76.1,31.7,-78.9,43.7,-76.3Z" transform="translate(100 100)" />
        </svg>
      </div>

      <div className="absolute top-2/3 -right-48 w-[600px] h-[600px] pointer-events-none opacity-40 mix-blend-multiply filter blur-3xl dark:mix-blend-screen animate-blob-pulse" style={{ animationDuration: "18s", animationDelay: "2s" }}>
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="fill-[#eae9e7] dark:fill-[#141414] w-full h-full">
          <path d="M42.2,-73.7C52.9,-68.3,58.7,-52.1,65.6,-37C72.5,-21.9,80.5,-7.9,81.1,6.5C81.7,20.8,74.9,35.4,65.6,47.4C56.2,59.3,44.4,68.6,30.9,75C17.5,81.5,2.4,85.2,-13.4,84.1C-29.2,83.1,-45.7,77.4,-58.4,67.6C-71.1,57.7,-79.9,43.8,-83.9,28.6C-87.9,13.4,-87,3.1,-84,-7.8C-80.9,-18.6,-75.8,-30.1,-67.6,-40.4C-59.5,-50.7,-48.3,-59.8,-35.9,-64.8C-23.5,-69.7,-10,-70.6,3.4,-75.2C16.8,-79.8,31.6,-88.2,42.2,-73.7Z" transform="translate(100 100)" />
        </svg>
      </div>

      {/* ── INTERACTIVE FLOATING DOCK (OS Dock style) ────────────────────── */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] sm:w-auto max-w-2xl">
        <div className="flex items-center justify-between gap-6 px-4 py-2 rounded-full border border-border/80 glass shadow-floating relative">
          
          {/* Logo link / Brand */}
          <Link href="/" className="flex items-center gap-2 active:scale-98 transition-transform shrink-0">
            <span className="font-display text-sm font-black tracking-tight text-foreground pl-2">
              FlowState
            </span>
          </Link>
 
          {/* DOCK ICON NAVIGATION */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const TabIcon = item.Icon;
              const isActive = activeTab === item.id;
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setActiveTab(item.id);
                    const el = document.getElementById(item.id);
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={`relative flex h-11 w-11 items-center justify-center rounded-full border transition-all ${
                    isActive
                      ? "bg-foreground text-background border-foreground shadow-sm"
                      : "bg-foreground/5 hover:bg-foreground/10 text-foreground border-border/40"
                  }`}
                  title={item.label}
                >
                  <TabIcon className="h-5 w-5" />
                  {isActive && (
                    <motion.span
                      layoutId="active-indicator"
                      className="absolute -bottom-1 h-1 w-1 rounded-full bg-foreground"
                      transition={springTransition}
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>
 
          {/* Right: Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <ThemeSwitcher className="h-9 w-9 hover:bg-secondary/60 rounded-full" />
            <Button
              className="hidden sm:inline-flex h-11 rounded-full bg-foreground text-background hover:bg-foreground/90 text-xs font-bold px-6 shadow-floating"
              onClick={() => alert("Welcome to the Productivity FlowState OS.")}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>

      {/* ── HERO SECTION ──────────────────────────────────────────────── */}
      <motion.main
        id="home"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springTransition}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-16 relative"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_0%,transparent_60%)] pointer-events-none" />

        <div className="flex flex-col items-center justify-center text-center gap-8 max-w-4xl mx-auto py-12 relative z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-foreground/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
              <Activity className="h-3.5 w-3.5 text-foreground animate-pulse" />
              AI-Powered Productivity OS
            </div>
            
            <h1 className="text-6xl sm:text-8xl md:text-[8rem] font-display font-black leading-[0.85] tracking-tighter text-foreground select-none">
              FlowState
            </h1>
            
            <p className="text-lg sm:text-[24px] text-muted-foreground font-medium max-w-2xl mx-auto leading-normal font-sans">
              Your personal digital executive, powered by AI. One tab. Every tool. Zero chaos.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button
              className="rounded-full bg-foreground text-background hover:bg-foreground/90 font-bold px-8 py-6 text-sm shadow-floating active:scale-98 transition-all flex items-center gap-2"
              onClick={() => {
                const el = document.getElementById("features");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Start Free Trial
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-border bg-background hover:bg-secondary text-foreground font-bold px-8 py-6 text-sm shadow-sm active:scale-98 transition-all"
              onClick={() => {
                const el = document.getElementById("timeline");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              See how it works
            </Button>
          </div>
        </div>
      </motion.main>

      {/* ── STATS GRID ────────────────────────────────────────────────── */}
      <section id="stats" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...springTransition, delay: i * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="rounded-[32px] glass border border-border/80 p-8 shadow-floating text-left flex flex-col justify-between h-[220px]"
            >
              <h3 className="text-4xl sm:text-[48px] font-display font-black text-foreground leading-none tracking-tight">
                {stat.value}
              </h3>
              <div className="space-y-1">
                <p className="text-[14px] font-extrabold uppercase tracking-widest text-foreground font-sans">
                  {stat.label}
                </p>
                <p className="text-xs text-muted-foreground font-medium">
                  {stat.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── WAVE SVG TRANSITION (80px High) ───────────────────────────── */}
      <div className="w-full overflow-hidden leading-none relative h-20 bg-transparent shrink-0">
        <svg viewBox="0 0 1440 80" className="w-full h-full fill-[#f5f5f0] dark:fill-[#121212] transition-colors duration-300">
          <path d="M0,80 C240,0 480,80 720,40 C960,0 1200,80 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </div>

      {/* ── FEATURE BENTO GRID ────────────────────────────────────────── */}
      <section id="features" className="bg-[#f5f5f0] dark:bg-[#121212] py-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-display font-black text-foreground tracking-tight leading-none">
              Streamline Your Focus Workspace
            </h2>
            <p className="text-sm text-muted-foreground font-medium">
              Eliminate browser tab fatigue and focus on execution. FlowState structures tool workflows natively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feat, i) => {
              const Icon = feat.Icon;
              return (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ ...springTransition, delay: i * 0.1 }}
                  className="rounded-[40px] bg-background border border-border p-8 text-left transition-all duration-300 hover:shadow-floating flex flex-col justify-between group h-[340px]"
                >
                  <div className="space-y-6">
                    <div className="w-16 h-16 rounded-[20px] bg-foreground/5 flex items-center justify-center shrink-0 border border-border/40 transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-7 w-7 text-foreground" />
                    </div>
                    <h3 className="text-xl font-display font-extrabold text-foreground tracking-tight leading-tight">
                      {feat.title}
                    </h3>
                  </div>
                  <p className="text-[14px] leading-relaxed text-muted-foreground font-medium">
                    {feat.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── WAVE SVG TRANSITION (INVERTED) ────────────────────────────── */}
      <div className="w-full overflow-hidden leading-none relative h-20 bg-transparent shrink-0 rotate-180">
        <svg viewBox="0 0 1440 80" className="w-full h-full fill-[#f5f5f0] dark:fill-[#121212] transition-colors duration-300">
          <path d="M0,80 C240,0 480,80 720,40 C960,0 1200,80 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </div>

      {/* ── CENTRAL TIMELINE ─────────────────────────────────────────── */}
      <section id="timeline" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-display font-black text-foreground tracking-tight leading-none">
            The FlowState Method
          </h2>
          <p className="text-sm text-muted-foreground font-medium">
            How FlowState orchestrates tools to rebuild cognitive momentum.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical center timeline line */}
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2" />

          <div className="space-y-12">
            {timelineSteps.map((step, idx) => (
              <div key={step.title} className="relative flex flex-col sm:flex-row items-stretch gap-8">
                
                {/* Center Timeline Indicator Bullet */}
                <div className="absolute left-4 sm:left-1/2 top-6 h-4 w-4 rounded-full bg-foreground border-4 border-background -translate-x-1/2 z-10" />

                {/* Left Card content (for left steps, empty on right steps on wide screens) */}
                <div className="w-full sm:w-1/2 flex items-center justify-end pr-0 sm:pr-12 text-right">
                  {step.side === "left" && (
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={springTransition}
                      className="rounded-[32px] bg-card border border-border p-6 shadow-floating text-left w-full hover:shadow-lg transition-shadow duration-300"
                    >
                      <span className="text-xs font-black text-muted-foreground/40 block mb-2">{step.step}</span>
                      <h4 className="font-display font-extrabold text-[16px] text-foreground tracking-tight">{step.title}</h4>
                      <p className="text-xs text-muted-foreground font-medium mt-2 leading-relaxed">{step.desc}</p>
                    </motion.div>
                  )}
                </div>

                {/* Right Card content (for right steps, empty on left steps on wide screens) */}
                <div className="w-full sm:w-1/2 flex items-center justify-start pl-8 sm:pl-12 text-left">
                  {step.side === "right" && (
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={springTransition}
                      className="rounded-[32px] bg-card border border-border p-6 shadow-floating text-left w-full hover:shadow-lg transition-shadow duration-300"
                    >
                      <span className="text-xs font-black text-muted-foreground/40 block mb-2">{step.step}</span>
                      <h4 className="font-display font-extrabold text-[16px] text-foreground tracking-tight">{step.title}</h4>
                      <p className="text-xs text-muted-foreground font-medium mt-2 leading-relaxed">{step.desc}</p>
                    </motion.div>
                  )}
                  
                  {/* Fallback layout for mobile: stack left cards to the right too */}
                  <div className="sm:hidden w-full">
                    {step.side === "left" && (
                      <div className="rounded-[32px] bg-card border border-border p-6 shadow-floating text-left w-full">
                        <span className="text-xs font-black text-muted-foreground/40 block mb-2">{step.step}</span>
                        <h4 className="font-display font-extrabold text-[16px] text-foreground tracking-tight">{step.title}</h4>
                        <p className="text-xs text-muted-foreground font-medium mt-2 leading-relaxed">{step.desc}</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────── */}
      <footer id="about" className="border-t border-border mt-16 pt-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h5 className="text-[12px] font-extrabold uppercase tracking-widest text-foreground mb-4">Product</h5>
            <ul className="space-y-2.5 text-xs text-muted-foreground font-semibold">
              <li><Link href="#" className="hover:text-foreground transition-colors">Mindset Bundles</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Local Vaults</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Offline Shaders</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-[12px] font-extrabold uppercase tracking-widest text-foreground mb-4">Company</h5>
            <ul className="space-y-2.5 text-xs text-muted-foreground font-semibold">
              <li><Link href="#" className="hover:text-foreground transition-colors">Philosophy</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Local AI manifesto</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Open Source</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-[12px] font-extrabold uppercase tracking-widest text-foreground mb-4">Resources</h5>
            <ul className="space-y-2.5 text-xs text-muted-foreground font-semibold">
              <li><Link href="#" className="hover:text-foreground transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">API Endpoint Dev</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Local Sandbox</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-[12px] font-extrabold uppercase tracking-widest text-foreground mb-4">Social</h5>
            <ul className="space-y-2.5 text-xs text-muted-foreground font-semibold">
              <li><Link href="#" className="hover:text-foreground transition-colors">Figma OS Kit</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">GitHub Repository</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Twitter Feed</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-16 pt-8 border-t border-border/40 text-[11px] text-muted-foreground font-semibold">
          <p>© FlowState Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
