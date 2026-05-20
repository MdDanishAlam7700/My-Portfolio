---
phase: 1
slug: amoled-ui-refinement
status: approved
shadcn_initialized: false
preset: none
created: 2026-04-26
---

# Phase 01 — UI Design Contract

> Visual and interaction contract for the AMOLED Cyberpunk-Glass portfolio overhaul.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | Tailwind CSS v4 |
| Preset | AMOLED Black Cyberpunk |
| Component library | Framer Motion (Interactions) |
| Icon library | Lucide React |
| Font | Space Grotesk (Sans), JetBrains Mono (Mono) |

---

## Spacing Scale

Declared values (must be multiples of 4):

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Icon gaps, inline padding |
| sm | 8px | Compact element spacing |
| md | 16px | Default element spacing, component gaps |
| lg | 24px | Card internal padding |
| xl | 32px | Component-to-component gaps |
| 2xl | 48px | Section content breaks |
| 3xl | 80px | Major section breaks (Hero to About) |
| 4xl | 160px | Global section spacing (Breathing room) |

Exceptions: none

---

## Typography

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Body | 16px | 300 | 1.6 |
| Label | 12px | 700 | 1.2 |
| Heading | 48px | 700 | 1.1 |
| Display | 128px | 800 | 0.9 |

---

## Color

| Role | Value | Usage |
|------|-------|-------|
| Dominant (60%) | #000000 | Global background, viewport base |
| Secondary (30%) | rgba(255,255,255,0.01) | Glass cards, layered surfaces |
| Accent (10%) | #00f0ff | Key interactions, primary buttons, borders |
| Highlight | #9d00ff | Secondary glows, tertiary icons |

Accent reserved for: Primary CTAs, active nav links, and focused input borders.

---

## Copywriting Contract

| Element | Copy |
|---------|------|
| Primary CTA | Explore Expertise |
| Secondary CTA | Download CV |
| Empty state heading | No data available |
| Empty state body | Refresh the dashboard to sync metrics. |
| Error state | Connection interrupted. Retrying... |

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | none | not required |
| Framer Motion | AnimatePresence, motion.div | checked |

---

## Checker Sign-Off

- [x] Dimension 1 Copywriting: PASS
- [x] Dimension 2 Visuals: PASS
- [x] Dimension 3 Color: PASS
- [x] Dimension 4 Typography: PASS
- [x] Dimension 5 Spacing: PASS
- [x] Dimension 6 Registry Safety: PASS

**Approval:** approved 2026-04-26
