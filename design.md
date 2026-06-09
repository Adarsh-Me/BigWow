# Design — BrowseryTools (Atelier Emerald)

A locked design system for this app. Every page redesign reads this file before emitting code. Do not regenerate per page — extend or amend this file when the system needs to grow.

## Genre
Modern-Minimal (SaaS-inspired, tactile, responsive). Sleek, quiet paper backdrops, highly active and responsive interactive states, elegant spacing, premium roundings.

## Macrostructure family
- Directory/Marketing: Ecosystem Index
- AI Hub/Conversational Mode: Split-Screen Layout (Left: Chat/Agent Logs, Right: Live Interactive Tool viewport)
- Interactive Tools: Workbench
- Secondary/Prose: Long Document

## Theme
Atelier Emerald color space (slate-neutral with an emerald green highlight). Defined in native OKLCH format for light and dark modes.

- Background Paper: `oklch(98.5% 0.003 160)` (`--background`)
- Paper Elevation 2: `oklch(95.5% 0.004 160)` (`--color-paper-2`)
- Border / Rule: `oklch(91.5% 0.006 160)` (`--border` / `--color-rule`)
- Neutral Text: `oklch(50% 0.005 160)` (`--color-neutral`)
- Muted Text: `oklch(65% 0.004 160)` (`--color-muted`)
- Primary Ink: `oklch(18% 0.005 160)` (`--foreground` / `--color-ink`)
- Accent Emerald: `oklch(62.5% 0.165 160)` (`--accent` / `--color-accent`)
- Accent Ink: `oklch(99% 0.001 160)` (`--accent-foreground` / `--color-accent-ink`)
- Focus tint: `oklch(62.5% 0.165 160 / 0.25)`

### Dark Mode overrides
- Background Midnight: `oklch(13.5% 0.006 160)`
- Paper Elevation 2: `oklch(18.5% 0.007 160)`
- Border / Rule: `oklch(23.5% 0.008 160)`
- Neutral Text: `oklch(60% 0.004 160)`
- Muted Text: `oklch(50% 0.005 160)`
- Primary Ink: `oklch(90% 0.004 160)`
- Accent Emerald: `oklch(66.5% 0.145 160)`
- Accent Ink: `oklch(10% 0.006 160)`
- Focus tint: `oklch(66.5% 0.145 160 / 0.35)`

## Typography
- Display & Body: Google Font `Geist`, highly responsive tracking and sizes.
- Monospace/Outlier: Geist Mono.
- Typography styles emphasize premium letter-spacing, semi-bold visual weights, and high readability.

## Spacing & Radius
- Radius: `12px` (`--radius`) for container items and cards. Custom configurations:
  - Large: `var(--radius)` (12px)
  - Medium: `calc(var(--radius) - 2px)` (10px)
  - Small: `calc(var(--radius) - 4px)` (8px)
- Spacing: Premium 4-point scaling to secure responsive grid alignment.

## Motion
- Easings: `cubic-bezier(0.16, 1, 0.3, 1)` (named `--ease-out` / `ease-out`)
- Transitions: Custom `180ms` spring-like transitions for hover transformations.
- Focus visible rings: Soft outlines mapping `--color-accent` with offset.

## Interactive Card State (`.premium-card`)
- Base background: `var(--color-paper)` (elevated dynamically)
- Border: `1px solid var(--color-rule)`
- Hover: Soft border color shift to `var(--color-accent)` with soft ambient halo drop shadow.
- Active: Press scaling state `scale(0.99)` for tactile feedback.

## AI Interaction Model
- AI Hero: Centered input section focusing on text query entry, file drop/upload, and fast sample button clicks.
- AI Router Cards: Real-time logs showing tool translation states.
- Conversational Split-Screen Layout: Activating a tool via AI loads a prompt sidebar on the left and mounts the actual functional interactive workspace on the right.
