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
bun run art       # New fruit art in one step: import from ~/.cache/kai-tmp/fruity-art, build the webps
                  # and art-manifest.json, then the white-edged stickers (macOS: Apple Vision cut-out)
```

---

## Design

`DESIGN.md` is the design system ("Sorbet Sticker", the D7 hybrid of 2 Nov 2026): season-coloured screens, each fruit a block in its own colour, die-cut sticker art inside the blocks, Shrikhand + Bricolage Grotesque, a 3D sundae dish on Now whose fruit you can cut open. Read it before touching any screen. Victoria only: there is no state selector; `stateOverrides` in fruits.ts stay on file but nothing reads them.

---

## Project Structure

```
src/
├── assets/fruits.ts          # 39 Australian fruits (validator prints the count); art-manifest.json
├── cafe/                     # Fruit Salad Cafe kids' game (lazy chunk, its own look)
├── components/               # FruitSticker, StatusSticker, SeasonStrip, TopBar, TabBar, Sheet,
│                             # BagSheet, NowHero (lazy 3D hero), FruitQuiz, RecipeIdeas, FruitIcon
├── hooks/                    # useRoute, useBag, useScreen (screen colours), useCurrentMonth, ...
├── pages/                    # Now, Browse (Fruit list), Year, FruitDetail, Cook, Play
├── three/                    # Lazy 3D: HeroDish (the dish and cutting), models (39 procedural
│                             # fruit, round ones in halves), flesh (cut-face textures), stage, motion
├── utils/                    # seasonality, status, tones (Sorbet colour families), colour maths, ...
├── App.tsx                   # Shell: routes, screen tones, tab bar, bag sheet
└── index.css                 # Tokens (@theme), fonts, motion keyframes
scripts/                      # validate-data, build-images, build-stickers (+ subject-mask.swift),
                              # import-art, build-icons, colour-contrast.test.ts
```

---

## Features

- **Current season awareness**: Highlights fruits in peak season
- **Search**: Filter by fruit name
- **Season filter**: Filter by Summer/Autumn/Winter/Spring
- **In-season toggle**: Show only currently available fruits
- **Now**: this month's peak fruit in a 3D sundae dish you can cut open, Buy now, Just landed, Ending soon, Cook this week
- **Fruit Salad Cafe**: Kids' game: customers order by picture, drop, chop and stir, stickers
- **Season Calendar**: Year-at-a-glance view of all fruit seasons
- **Fruit Quiz**: Guess the fruit game
- **Fruit Detail Pages**: The whole page in the fruit's colour; season, add to bag, how to pick and store, recipes, pairings, origin, nutrition
- **Offline support**: PWA works without network after install
- **Mobile-first**: Responsive grid, installable on home screen

---

## Hosting

Deployed to GitHub Pages via GitHub Actions workflow.

**URL:** https://natman3000.github.io/Fruity/

---

*Last updated: 2026-11-02*
