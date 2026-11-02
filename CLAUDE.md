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
bun run build     # Production build
bun run preview   # Preview production build
```

---

## Project Structure

```
src/
├── assets/
│   └── fruits.ts          # 39 Australian fruits (validator prints the count)
├── components/
│   ├── FruitCard.tsx      # Individual fruit display
│   ├── FruitList.tsx      # Responsive grid of fruits
│   ├── MonthBadge.tsx     # Month indicator badges
│   ├── SearchBar.tsx      # Text search input
│   └── SeasonFilter.tsx   # Season filter buttons
├── hooks/
│   ├── useCurrentMonth.ts # Current month detection
│   └── useFruits.ts       # Filter/search logic
├── types/
│   └── fruit.ts           # TypeScript interfaces
├── utils/
│   └── seasonality.ts     # Season calculation helpers
├── App.tsx                # Main app component
├── main.tsx               # Entry point
└── index.css              # Tailwind imports
```

---

## Features

- **Current season awareness**: Highlights fruits in peak season
- **Search**: Filter by fruit name
- **Season filter**: Filter by Summer/Autumn/Winter/Spring
- **In-season toggle**: Show only currently available fruits
- **Fruit Salad Maker**: Interactive tool to build fruit salads
- **Season Calendar**: Year-at-a-glance view of all fruit seasons
- **Fruit Quiz**: Guess the fruit game
- **Fruit Detail Pages**: Origin, history, nutrition, recipes, pairings with images
- **Offline support**: PWA works without network after install
- **Mobile-first**: Responsive grid, installable on home screen

---

## Hosting

Deployed to GitHub Pages via GitHub Actions workflow.

**URL:** https://natman3000.github.io/Fruity/

---

*Last updated: 2026-01-26*
