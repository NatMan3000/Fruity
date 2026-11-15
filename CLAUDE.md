# Fruity - Australian Fruit Seasonality PWA

| Field | Value |
|-------|-------|
| **Status** | Active |
| **Priority** | Low |
| **Owner** | Nathan |
| **Category** | personal |

---

## Quick Context

A simple PWA for quick fruit seasonality reference in Australia. Shows which fruits are in season based on the current month, with search and filter capabilities. Works offline after first load.

---

## Project History

`TIMELINE.md`: grep on demand; `open-threads.md`: surfaced at session start

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 + TypeScript |
| Build | Vite 7 |
| Styling | TailwindCSS v4 |
| PWA | vite-plugin-pwa |
| Runtime | Bun |

---

## Commands

```bash
bun install       # Install dependencies
bun run dev       # Development server (default: 5173)
bun run build     # Validate data, type-check, production build
bun run test      # Vitest (run touched files with --maxWorkers=2)
bun run lint      # ESLint
bun run preview   # Preview production build
bun run art       # New fruit art in one step: import from ~/.cache/kai-tmp/fruity-art, build the studio photos
                  # and art-manifest.json, then the white-edged stickers (macOS: Apple Vision cut-out),
                  # then the recipe dish photos from ~/.cache/kai-tmp/fruity-dishes (bun run dishes)
```

---

## Design

`DESIGN.md` is the design system ("Sorbet Sticker", the D7 hybrid of 2 Nov 2026): season-coloured screens, each fruit a block in its own colour, die-cut sticker art inside the blocks, Shrikhand + Bricolage Grotesque, a 3D sundae dish on Now whose fruit you can cut open. Read it before touching any screen. Its 3D rule 1 (a 3D fruit's place waits empty, never its photo first) is gated by `scripts/no-photo-before-3d.test.ts`: put it in any brief that adds or changes a 3D scene. Victoria only: there is no state selector; `stateOverrides` in fruits.ts stay on file but nothing reads them.

---

## Project Structure

The tree is in the code. The non-obvious parts:

- `src/assets/fruits.ts`: 39 Australian fruits (the validator prints the count), with `art-manifest.json`; `src/assets/recipes.ts` holds Fruity's own recipes, both checked by `scripts/validate-data.ts`.
- `src/cafe/` (Fruit Salad Cafe) and `src/quiz/` (Guess the fruit) are lazy chunks; the quiz logic in `src/quiz/logic/` is pure and tested.
- `src/three/` is the lazy 3D layer: the hero dish, 39 procedural fruit models, cut-face textures. The feature list is in `DESIGN.md`.
- `src/utils/tones.ts` holds the Sorbet colour families; `src/hooks/useScreen` sets each screen's colour.
- `scripts/`: validate-data, build-images, build-stickers (`subject-mask.swift`), build-dishes, import-art, build-icons, `colour-contrast.test.ts`.

---

## Hosting

Deployed to GitHub Pages via GitHub Actions workflow.

**URL:** https://natman3000.github.io/Fruity/

