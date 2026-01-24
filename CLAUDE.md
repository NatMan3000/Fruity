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
│   └── fruits.ts          # 40 Australian fruits with seasonality data
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
- **Offline support**: PWA works without network after install
- **Mobile-first**: Responsive grid, installable on home screen

---

## Hosting (TODO)

Not yet deployed. Options:
- Cloudflare Pages (recommended)
- HomeLab via cloudflared tunnel
- Vercel/Netlify

---

## Timeline

| Date | Event |
|------|-------|
| 2026-01-24 | Project created with 40 Australian fruits |

---

*Last updated: 2026-01-24*
