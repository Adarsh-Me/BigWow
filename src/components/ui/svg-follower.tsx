"use client"

import type React from "react"
import { useRef, useEffect, useCallback, useState } from "react"

interface Position {
  x: number
  y: number
}

interface Point {
  position: Position
  time: number
  drift: Position
  age: number
  direction: Position
}

interface SVGFollowerProps {
  width?: number
  height?: number
  colors?: string[]
  removeDelay?: number
  autoPlay?: boolean
  className?: string
  baseThickness?: number
  thicknessMultiplier?: number
  enableGlow?: boolean
  shapeSpawnRate?: number
}

export function SVGFollower({
  width = 1400,
  height = 1200,
  colors = ["#ff6b6b", "#fff200", "#45b7d1", "#96ceb4", "#ffeaa7"],
  removeDelay = 400,
  autoPlay = false,
  className = "",
  baseThickness = 4,
  thicknessMultiplier = 0.4,
  enableGlow = true,
  shapeSpawnRate = 0.15,
}: SVGFollowerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const followersRef = useRef<Follower[]>([])
  const animationRef = useRef<number>()
  const [isRecording, setIsRecording] = useState(false)
  const recordingRef = useRef<Position[]>([])

  class Follower {
    private points: Point[] = []
    private line: SVGPathElement
    private color: string
    private stage: SVGSVGElement

    constructor(stage: SVGSVGElement, color: string) {
      this.stage = stage
      this.color = color
      this.line = document.createElementNS("http://www.w3.org/2000/svg", "path")
      this.line.style.fill = color
      this.line.style.stroke = color
      this.line.style.strokeWidth = "1.5"
      if (enableGlow) {
        this.line.setAttribute("filter", "url(#glow-filter)")
      }
      this.stage.appendChild(this.line)
    }

    private getDrift(): number {
      return (Math.random() - 0.5) * 3
    }

    public add(position: Position) {
      const direction = { x: 0, y: 0 }
      if (this.points[0]) {
        direction.x = (position.x - this.points[0].position.x) * 0.25
        direction.y = (position.y - this.points[0].position.y) * 0.25
      }

      const point: Point = {
        position: position,
        time: Date.now(),
        drift: {
          x: this.getDrift() + direction.x / 2,
          y: this.getDrift() + direction.y / 2,
        },
        age: 0,
        direction: direction,
      }

      // Generate decorative shapes
      const shapeChance = Math.random()
      if (shapeChance < shapeSpawnRate) this.makeCircle(point)
      else if (shapeChance < shapeSpawnRate * 2) this.makeSquare(point)
      else if (shapeChance < shapeSpawnRate * 3) this.makeTriangle(point)

      this.points.unshift(point)
    }

    private createLine(points: Point[]): string {
      const path: string[] = [points.length ? "M" : ""]

      if (points.length > 0) {
        let forward = true
        let i = 0

        while (i >= 0) {
          const point = points[i]
          
          // Speed calculations
          const speed = Math.sqrt(point.direction.x * point.direction.x + point.direction.y * point.direction.y)
          const currentThickness = baseThickness + speed * thicknessMultiplier

          // Perpendicular offsets to form a ribbon
          const dx = point.direction.x === 0 && point.direction.y === 0 ? 1 : point.direction.x
          const dy = point.direction.x === 0 && point.direction.y === 0 ? 0 : point.direction.y
          const len = Math.sqrt(dx * dx + dy * dy)
          const nx = -dy / len
          const ny = dx / len

          const wx = nx * currentThickness
          const wy = ny * currentThickness

          const x = point.position.x + (forward ? wy : -wy)
          const y = point.position.y + (forward ? wx : -wx)
          point.age += 0.2

          path.push(String(x + point.drift.x * point.age))
          path.push(String(y + point.drift.y * point.age))

          i += forward ? 1 : -1
          if (i === points.length) {
            i--
            forward = false
          }
        }
      }

      return path.join(" ")
    }

    public trim() {
      const now = Date.now()
      while (this.points.length > 0 && this.points[this.points.length - 1].time < now - removeDelay) {
        this.points.pop()
      }
      this.line.setAttribute("d", this.createLine(this.points))
    }

    private makeCircle(point: Point) {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
      const speed = Math.sqrt(point.direction.x * point.direction.x + point.direction.y * point.direction.y)
      const radius = Math.max(5, speed * 0.8) + Math.random() * 8
      circle.setAttribute("r", String(radius))
      circle.style.fill = this.color
      circle.setAttribute("cx", "0")
      circle.setAttribute("cy", "0")
      if (enableGlow) {
        circle.setAttribute("filter", "url(#glow-filter)")
      }
      this.moveShape(circle, point)
    }

    private makeSquare(point: Point) {
      const speed = Math.sqrt(point.direction.x * point.direction.x + point.direction.y * point.direction.y)
      const size = Math.max(8, speed * 1.2) + Math.random() * 12
      const square = document.createElementNS("http://www.w3.org/2000/svg", "rect")
      square.setAttribute("width", String(size))
      square.setAttribute("height", String(size))
      square.setAttribute("x", String(-size / 2))
      square.setAttribute("y", String(-size / 2))
      square.style.fill = this.color
      if (enableGlow) {
        square.setAttribute("filter", "url(#glow-filter)")
      }
      this.moveShape(square, point)
    }

    private makeTriangle(point: Point) {
      const speed = Math.sqrt(point.direction.x * point.direction.x + point.direction.y * point.direction.y)
      const size = Math.max(8, speed * 1.2) + Math.random() * 12
      const triangle = document.createElementNS("http://www.w3.org/2000/svg", "polygon")
      triangle.setAttribute("points", `0,${-size / 2} ${size / 2},${size / 2} ${-size / 2},${size / 2}`)
      triangle.style.fill = this.color
      if (enableGlow) {
        triangle.setAttribute("filter", "url(#glow-filter)")
      }
      this.moveShape(triangle, point)
    }

    private moveShape(shape: SVGElement, point: Point) {
      this.stage.appendChild(shape)
      const driftX = point.position.x + point.direction.x * (Math.random() * 20) + point.drift.x * (Math.random() * 10)
      const driftY = point.position.y + point.direction.y * (Math.random() * 20) + point.drift.y * (Math.random() * 10)

      shape.style.transform = `translate(${point.position.x}px, ${point.position.y}px) scale(1) rotate(0deg)`
      shape.style.transformOrigin = "center"
      shape.style.transition = "transform 0.8s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 0.8s ease-out"

      setTimeout(() => {
        shape.style.transform = `translate(${driftX}px, ${driftY}px) scale(0) rotate(${Math.random() * 360}deg)`
        shape.style.opacity = "0"
        setTimeout(() => {
          if (this.stage.contains(shape)) {
            this.stage.removeChild(shape)
          }
        }, 800)
      }, 20)
    }

    public destroy() {
      if (this.stage.contains(this.line)) {
        this.stage.removeChild(this.line)
      }
    }
  }

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      const position: Position = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }

      followersRef.current.forEach((follower) => follower.add(position))

      if (isRecording) {
        recordingRef.current.push({
          x: (position.x / width) * 100,
          y: (position.y / height) * 100,
        })
      }
    },
    [width, height, isRecording],
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault()
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      const touch = e.touches[0]
      const position: Position = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      }

      followersRef.current.forEach((follower) => follower.add(position))

      if (isRecording) {
        recordingRef.current.push({
          x: (position.x / width) * 100,
          y: (position.y / height) * 100,
        })
      }
    },
    [width, height, isRecording],
  )

  const startRecording = () => {
    recordingRef.current = []
    setIsRecording(true)
  }

  const stopRecording = () => {
    setIsRecording(false)
    console.log("Recording:", JSON.stringify(recordingRef.current))
  }

  const animate = useCallback(() => {
    followersRef.current.forEach((follower) => follower.trim())
    animationRef.current = requestAnimationFrame(animate)
  }, [])

  // AutoPlay / Screensaver generation
  useEffect(() => {
    if (!autoPlay) return

    let time = 0
    const interval = setInterval(() => {
      time += 0.04
      const centerX = width / 2
      const centerY = height / 2
      
      // Lissajous curve movement
      const x = centerX + Math.sin(time * 1.3) * (width * 0.4)
      const y = centerY + Math.cos(time * 1.9) * (height * 0.4)
      
      const position: Position = { x, y }
      followersRef.current.forEach((follower) => follower.add(position))
    }, 16)

    return () => clearInterval(interval)
  }, [autoPlay, width, height])

  useEffect(() => {
    if (!svgRef.current) return

    // Clean up old followers before creating new ones
    followersRef.current.forEach(f => f.destroy())
    
    // Initialize followers
    followersRef.current = colors.map((color) => new Follower(svgRef.current!, color))

    // Start animation loop
    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [colors, animate, enableGlow])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden w-full h-full cursor-crosshair rounded-2xl border border-border/50 bg-slate-950/40 backdrop-blur-sm shadow-inner ${className}`}
      style={{ width, height }}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseDown={startRecording}
      onMouseUp={stopRecording}
      onTouchStart={startRecording}
      onTouchEnd={stopRecording}
    >
      <svg ref={svgRef} width={width} height={height} xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 select-none pointer-events-none">
        <defs>
          <filter id="glow-filter" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  )
}
