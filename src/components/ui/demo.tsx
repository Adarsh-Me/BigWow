"use client"

import { useState } from "react"
import { SVGFollower } from "@/components/ui/svg-follower"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Settings, Eye, HelpCircle } from "lucide-react"

export default function DemoOne() {
  const [baseThickness, setBaseThickness] = useState(4)
  const [thicknessMultiplier, setThicknessMultiplier] = useState(0.4)
  const [removeDelay, setRemoveDelay] = useState(400)
  const [enableGlow, setEnableGlow] = useState(true)
  const [autoPlay, setAutoPlay] = useState(false)
  const [shapeSpawnRate, setShapeSpawnRate] = useState(0.15)

  // Curated premium color palettes
  const colorPalettes = [
    { name: "Neon Aurora", colors: ["#ff5e62", "#ff9966", "#FFD97D", "#4E65FF", "#92EFFD"] },
    { name: "Cyberpunk", colors: ["#ff007f", "#00f0ff", "#ff00ff", "#7f00ff", "#ffff00"] },
    { name: "Classic Soft", colors: ["#ff6b6b", "#fff200", "#45b7d1", "#96ceb4", "#ffeaa7"] },
    { name: "Electric Forest", colors: ["#00FF87", "#60EFFF", "#0061FF", "#A9F1DF", "#FF007F"] }
  ]

  const [activePaletteIndex, setActivePaletteIndex] = useState(0)

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start justify-center min-h-[calc(100vh-6rem)] w-full py-2">
      {/* Visual Canvas Container */}
      <div className="flex-1 w-full aspect-video lg:aspect-auto lg:h-[75vh] min-h-[400px] relative rounded-2xl overflow-hidden shadow-2xl border border-white/5 dark:border-white/10">
        <SVGFollower
          width={1200}
          height={800}
          colors={colorPalettes[activePaletteIndex].colors}
          removeDelay={removeDelay}
          autoPlay={autoPlay}
          baseThickness={baseThickness}
          thicknessMultiplier={thicknessMultiplier}
          enableGlow={enableGlow}
          shapeSpawnRate={shapeSpawnRate}
          className="absolute inset-0 w-full h-full"
        />

        {/* Dynamic overlay help tag */}
        <div className="absolute bottom-4 left-4 z-10 pointer-events-none bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-white flex items-center gap-1.5 text-xs">
          <HelpCircle className="h-3.5 w-3.5 text-accent animate-pulse" />
          <span>Move cursor or touch over the canvas to draw glowing particle trails</span>
        </div>
      </div>

      {/* Control Panel Settings */}
      <Card className="w-full lg:w-[350px] bg-slate-950/80 backdrop-blur-xl border border-slate-800 text-slate-100 shadow-2xl shrink-0">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-accent" />
              <h2 className="font-bold text-sm tracking-tight text-white">Trail Customization</h2>
            </div>
            <div className="flex items-center gap-1 text-[10px] bg-slate-800/80 text-accent font-semibold px-2 py-0.5 rounded-full border border-slate-700">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Interactive</span>
            </div>
          </div>

          {/* Preset Palettes */}
          <div className="space-y-2.5">
            <Label className="text-xs font-semibold text-slate-400">Color Palette</Label>
            <div className="grid grid-cols-2 gap-2">
              {colorPalettes.map((palette, idx) => (
                <button
                  key={palette.name}
                  onClick={() => setActivePaletteIndex(idx)}
                  className={`flex flex-col gap-1.5 p-2 rounded-lg border text-left transition-all ${
                    activePaletteIndex === idx
                      ? "border-accent bg-accent/10 text-white"
                      : "border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-slate-400"
                  }`}
                >
                  <span className="text-[10px] font-bold">{palette.name}</span>
                  <div className="flex gap-0.5">
                    {palette.colors.map((c) => (
                      <span
                        key={c}
                        className="w-3 h-3 rounded-full border border-black/20 shrink-0"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Autoplay / Screensaver */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-900">
            <div className="space-y-0.5">
              <Label htmlFor="autoplay" className="text-xs font-bold text-white flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-accent" /> Autoplay Screensaver
              </Label>
              <p className="text-[10px] text-slate-400">Animate automatically when idle</p>
            </div>
            <Switch
              id="autoplay"
              checked={autoPlay}
              onCheckedChange={setAutoPlay}
            />
          </div>

          {/* Glow Option */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-900">
            <div className="space-y-0.5">
              <Label htmlFor="glow" className="text-xs font-bold text-white">Glow Filter</Label>
              <p className="text-[10px] text-slate-400">Enable neon drop shadow effects</p>
            </div>
            <Switch
              id="glow"
              checked={enableGlow}
              onCheckedChange={setEnableGlow}
            />
          </div>

          {/* Base Thickness Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <Label className="text-slate-400 font-medium">Base Line Thickness</Label>
              <span className="text-white font-mono">{baseThickness}px</span>
            </div>
            <Slider
              min={1}
              max={15}
              step={1}
              value={[baseThickness]}
              onValueChange={(val) => setBaseThickness(val[0])}
            />
          </div>

          {/* Speed Thickness Multiplier */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <Label className="text-slate-400 font-medium">Velocity Ribbon Scale</Label>
              <span className="text-white font-mono">{thicknessMultiplier.toFixed(1)}x</span>
            </div>
            <Slider
              min={0.1}
              max={2.0}
              step={0.1}
              value={[thicknessMultiplier]}
              onValueChange={(val) => setThicknessMultiplier(val[0])}
            />
          </div>

          {/* Shape Spawn Rate */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <Label className="text-slate-400 font-medium">Geometric Particle Rate</Label>
              <span className="text-white font-mono">{(shapeSpawnRate * 100).toFixed(0)}%</span>
            </div>
            <Slider
              min={0.0}
              max={0.4}
              step={0.05}
              value={[shapeSpawnRate]}
              onValueChange={(val) => setShapeSpawnRate(val[0])}
            />
          </div>

          {/* Trail Length / Remove Delay */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <Label className="text-slate-400 font-medium">Trail Lifespan</Label>
              <span className="text-white font-mono">{removeDelay}ms</span>
            </div>
            <Slider
              min={100}
              max={1200}
              step={50}
              value={[removeDelay]}
              onValueChange={(val) => setRemoveDelay(val[0])}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
