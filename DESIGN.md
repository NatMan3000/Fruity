---
type: design-system
title: Fruity design system - Sorbet Sticker
description: Tokens, type, colour, art, motion and component rules for the Fruity PWA after the D7 hybrid look; implemented in src/index.css and src/utils/tones.ts.
created: 2026-11-02
---

# Fruity design: "Sorbet Sticker"

The hybrid Nathan picked from three working comps on 2 Nov 2026 (D7, [research/2026-11-02-look-decision.md](research/2026-11-02-look-decision.md)): Sorbet Pop's colours and fruit-page theming, Market Sticker's type, white-outlined stickers and bouncy Year calendar, Juicy 3D's drop-in hero and compact List/Year toggle, plus Nathan's new idea: cut the fruit open in the hero to see inside. Victoria only: the state selector and per-state seasons are gone.

The code is the implementation. Static tokens live in `src/index.css` under `@theme`; the per-screen and per-fruit tones come from `src/utils/tones.ts` as CSS variables and are read as `bg-(--pop)`, `text-(--ink)` and so on. Components never use raw hex; a fruit's own `colour` is data.

## The scene

Two grown-ups in Melbourne, iPhones, the app on the home screen. Mostly a three-second glance in a fruit shop; sometimes on the couch, playing. A gelato counter that knows the month: loud, juicy, every surface a colour, big plain blocks that survive shop glare, and play (the dish, the quiz, the cafe) where time is unhurried.

## Colour

No white or paper anywhere. Every surface is a season colour or a fruit colour; the only near-white is a sticker's die-cut edge (`sticker`, `#FFFDF8`), and only ever as an outline.

### Tones (src/utils/tones.ts)

One colour becomes a family of tones at fixed OKLCH lightness, so a dark fruit (mulberry) and a pale one (lemon) give blocks of the same weight and the same text colours read on all of them. Yellows are lifted so they don't go mustard.

| Tone | OKLCH | Job |
|---|---|---|
| `pop` | the fruit's own L, kept in 0.72-0.9, C up to 0.21 | The colour block: list rows, Buy now, Cook sections, a fruit's whole page |
| `bright` | L 0.89 (0.94 for yellows), C 0.13 | Tip and recipe cards, header discs, the season's sheets, search field, quiz card |
| `deep` | L 0.36, C 0.11 | The Year card on a fruit page, chips, quiz answers, pairing pills |
| `ink` | L 0.22, C 0.06 | Text on pop and bright, the season-bar track, the tab bar, hard shadows |
| `inkSoft` | L 0.30, C 0.08 | Secondary text on pop and bright |
| `light` | L 0.96, C 0.035 | Text on deep, ink and a season page; this month's ring |
| `page` | hand-picked per season | A season screen's background |

`toneVars(t)` turns a family into CSS variables (`--pop`, `--bright`, `--deep`, `--ink`, `--ink-soft`, `--light`, `--page`). Put it on a block and everything inside draws in that fruit's colours.

### Screens

`useScreen` (src/hooks/useScreen.ts, called once in `App`) sets the screen's family on `<html>`, plus `--screen` (background), `--on-screen` (text), `--shadow` and `--scoop` (the tab bar's current pill), and sets `theme-color`, so the page, the overscroll, the tab bar, sheets and the iPhone status bar always agree.

| Screen | Background | Text |
|---|---|---|
| Now, Fruit, Year, Cook, Play, quiz, bag sheet | the season's `page` | `light` |
| A fruit's page | the fruit's `pop` | `ink` |

Each season owns a sorbet: spring raspberry (`#B7014E` page), summer blood orange (`#BC3A06`), autumn plum (`#7E2FB8`), winter kiwi (`#006E5A`). Spring's raspberry is the splash and first-paint colour (`index.html`, the manifest).

### Season status: green means buy, red family means not now

Nathan's mapping, unchanged: peak bright green, in season lighter green, out of season red family. Fill plus its own `-ink` for the word.

| Status | Fill | Word ink | Shape in the season bar | Sticker |
|---|---|---|---|---|
| Peak | `peak` `#2BD963` | `#04310F` | full-height pill | "Peak" + filled star |
| In season | `season` `#B9F08C` | `#173D05` | half-height pill | "In season" + check |
| Ending (last month) | `ending` `#FFB53D` | `#3D2100` | | "Ending soon" / "Last month" + hourglass |
| Out of season | `off` `#FF7468` | `#3F0904` | small red dot | "Out of season" + dashed circle |
| All year | `always` `#D9C8FF` | `#2A1659` | | "All year" + repeat |

- **Status is colour + word + icon, always**, and shape in the bar. `StatusSticker` is the one status style: a tilted pill with a white die-cut edge.
- The quiz's right answer is `peak`, a wrong one `off`.

### Contrast (scripts/colour-contrast.test.ts)

Every text pair above is checked for all 39 fruit and all four seasons at 4.5:1, the season-bar fills at 3:1 on their dark track, and each status word on its fill at 4.5:1. The test reads the static hexes from `src/index.css`, so re-tuning a token is what gets checked; a too-light ink or a pale status word fails it (checked by breaking both on 2 Nov 2026).

## Type

| Role | Face | Size |
|---|---|---|
| Month and page titles | Shrikhand | `clamp(2.5rem, 13vw, 3.5rem)` |
| A fruit's name on its page | Shrikhand | `text-hero` 48/49 |
| Section headings | Shrikhand | `text-title` 28/31 |
| Fruit names in rows and cards | Shrikhand | `text-name` 22/25 |
| Body | Bricolage Grotesque 500-600 | `text-body` 17/25 |
| Small, captions, sticker words | Bricolage Grotesque 600-800 | 15, 13, 11-15 caps |

- Both self-hosted Latin WOFF2 (`@fontsource/shrikhand` 16 KB, `@fontsource-variable/bricolage-grotesque` weight axis 41 KB), precached. Shrikhand has one weight: `.font-display` turns off synthesis so it is never faked bold.
- Numbers use `tabular-nums`. Text fills its container: no measure caps in blocks or sheets, no truncation of content text; long names wrap.

## Shape and space

- **Chunky blocks:** `rounded-block` 28px for rows, cards, sheets; every button, input and chip is a pill. A block sits on a hard 5px offset shadow in the screen's ink (`.block-shadow`) and sinks into it when pressed (`.press`).
- **Spacing:** Tailwind's 4px scale. Gutter 16px. Within a group 8-16px, between sections 36px.
- **Targets:** at least 44x44px. **Safe areas:** headers pad `env(safe-area-inset-top)`, the floating tab bar `env(safe-area-inset-bottom)`; shell `min-h-[100dvh]`.

## Fruit art

- **Every fruit picture is a die-cut sticker that sits INSIDE its block** (Nathan found Sorbet's pop-out "a bit weird"). `FruitSticker` is the only way to draw one: the art sticker when the fruit has new art, otherwise its emoji with the same white edge traced round it (`.sticker-emoji`). Exactly one of the two is drawn, never both, which is what fixed the doubled quiz picture. Each fruit has a steady tilt (`tiltOf`).
- `FruitIcon` (the cafe's name) is a thin wrapper over `FruitSticker`, so the cafe shows the same stickers.
- **Pipeline, one command:** `bun run art` = `art:import` (copies `<id>.png` from `~/.cache/kai-tmp/fruity-art`) + `images` (webps and `src/assets/art-manifest.json`) + `stickers` (`scripts/build-stickers.ts`: Apple Vision lifts the fruit off its backdrop, `scripts/subject-mask.swift`, macOS only; bakes a 28px white edge; writes `<id>-sticker.webp` 640px and `<id>-sticker-sm.webp` 256px). Stickers rebuild only when their source is newer; `--force` rebuilds all. Generated files are committed.
- The 4:3 photos and round icons that `images` still writes (`-480`, `-960`, `-icon`) are no longer drawn and are left out of the precache.

## The 3D heroes (src/three/, src/components/NowHero.tsx, FruitHero.tsx)

- **A fruit's page** (`SpinFruit`, comp-3d's drop): the fruit in 3D drops onto a juicier blob spinning, bounces, squashes and coasts to a stop; drag to turn it; cut it open as below (the Slice button reads Put back once it is open). A fruit without a model (`src/three/modelled.ts`, kept in step with the models by a test) shows its white-edged sticker dropping in instead, as does any device without WebGL.

**On Now:**

- This month's peak fruit drop one by one into a sundae coupe glazed in the season's `pop` with a `light` lip, bounce, squash and settle; the dish rocks on each landing. The fruit with the best insides go in first (watermelon in summer, kiwi and citrus in winter), then Buy now order.
- **Cut them open:** tap a fruit, or flick quickly sideways across it (22 px inside 100 ms), and it slices: a knife stroke flashes, a few drops of juice fly, the halves fall apart side by side and turn their cut faces up to you. Tap a cut fruit to put it back. A slower sideways drag turns instead (spins the dish, or turns the fruit on its page). A vertical swipe still scrolls the page (`touch-action: pan-y`). No hint text (Nathan, 2 Nov 2026): the Slice button is the cue, and the way in for keyboard and screen-reader users; cuts are announced. The cut, the juice and the gesture live in `src/three/cutting.tsx`, shared by the dish and the fruit page.
- Round fruit are built as two halves (`models.ts` `cutBody`), each closed by a cap textured with its flesh (`flesh.ts`): watermelon red with black seeds and a white-and-green rind, kiwi with its seed ring and pale core, citrus segments, dragon fruit speckles, passionfruit pulp, avocado, peach, plum and lychee with a stone standing proud of one half, papaya and melons with a seed cavity, and a generic pale flesh for any fruit without a spec. Bunches, berries, bananas and rhubarb hop when tapped instead.
- Cuts by type (Nathan: "The pineapple would be better if it cut into slices!"): rounds where a fruit is known by its slices: pineapple rings (crown left on the top piece), citrus wheels, kiwifruit rounds, starfruit stars, banana coins, all fanned out like dealt cards. Halves where the inside is the payoff: lengthways for stone fruit, avocado, mango, papaya, strawberry, melons, fig, dragon fruit and lychee; across for passionfruit, pomegranate, persimmon, feijoa and coconut. Faces are canvas-painted flesh that lights itself a little, so the inside keeps its colour whichever way it turns.
- **Pieces never interpenetrate; the whole body is fully replaced by its pieces.** Two halves lie side by side (staggered in depth if their edges would meet). More pieces all turn the same way, cut face to you, thin out a little, and either lie in a flat row with gaps (small pieces, banana coins) or shingle: each sits above the last by at least its own thickness, so parallel pieces can never meet. A crown piece (pineapple) or banana tip stands at the end of the row. Whatever is not cut (the banana's other fingers) eases back while the pieces come forward. The row is centred where the fruit was. Then `cutOverlaps` (convex hulls of each piece's solid body) checks it exactly and nudges until clear.
- **Check them:** `bun run models:sheet [dir]` renders every fruit whole and cut from the fruit page's camera into two labelled contact sheets (`models.html` and `src/dev/model-sheet.ts`, dev-only, not in the app build). Run it after touching `src/three/` and look at every tile; it also writes every cut full size (`dir/cut/<id>.png`) and FAILS (exit 1, red label) if any cut piece overlaps another or the rest of the fruit.
- All 39 fruit are modelled (comp-3d's 31 plus dragon fruit, passionfruit, lychee, feijoa, fig, coconut, custard apple and quince).
- **Cost:** three.js and React Three Fiber (one shared chunk, 249 KB gzip, also used by the cafe), the models, flesh and cutting (12 KB) and the two scenes (2 KB and 1 KB) load lazily, only once the Buy now list has painted (`requestIdleCallback`). No `manualChunks`: forcing a `three` chunk pulled React into it and made the main entry preload all of three.js (caught 2 Nov 2026). Render on demand (`frameloop="demand"`), DPR capped at 2, one 1024 shadow map. A still poster of three stickers shows until it lands, or for good where WebGL is missing or fails.

## Motion

"We like animation." Playful, springy, one-shot. CSS only (springs as `linear()` curves in `--ease-spring` and `--ease-bounce`, Web Animations for the bag swell); no animation library ships.

| Moment | What moves |
|---|---|
| First visit of a session: Now, Fruit list, Year, Cook | Titles rise; blocks pop in staggered with a slight twist; list rows swing in from alternating sides |
| A fruit page opens | The blob springs in with a twist, the 3D fruit drops in spinning and coasts to a stop, the status sticker slaps on, the Year bars bounce up one by one (Market Sticker's entrance) |
| Add to bag | The button swells once and turns peak green, the tick spins in, a small sticker of the fruit hops up into the bag, whose count pops |
| Tabs | The current pill slides across with an overshoot |
| Sheet | Springs up, slides down |
| Hero | Drop-in, cut, juice, rejoin (above) |

- Transform and opacity only. Nothing loops and nothing moves while idle: the 3D scene stops rendering once still.
- `prefers-reduced-motion: reduce` turns all of it off: screens appear in their final state, the hero's fruit start in the dish and cut without travel, the bag skips the hop.

## Components

- **Top bar** (`TopBar`): a Back disc on a fruit page, the title in Shrikhand, extra controls, and the bag disc (`bright` with an `ink` icon, a count badge in `ink`).
- **List / Year toggle** (`FruitTabHeader`): two round icon buttons in an `ink` pill, no words on screen, each with its name as an `aria-label` and `aria-current` on the one you are on.
- **Tab bar** (`TabBar`): a floating `ink` pill; the current tab sits in a `--scoop` pill (the season's `pop`, or the fruit's `bright` on a fruit page).
- **Colour block rows**: Buy now and the Fruit list are blocks in the fruit's `pop` with the sticker inside on the left, the name in Shrikhand, a status sticker, and the pick tip (Now) or the season bar (list).
- **Season bar** (`SeasonStrip`): twelve scoops in an `ink` track; this month ringed in `light`; on a fruit page, `lg` with month initials and the bouncy entrance.
- **Sheet** (`Sheet`): native `<dialog>`, the screen's `bright` with `ink` text, a `pop` close disc.
- **Filter chips**: `deep` with a colour dot, `pop` with a check when on; they squish when pressed.

## App icon

A red apple with a lime leaf on a bright green square (`scripts/build-icons.ts`, `bun run icons`), PNG only in the manifest: iOS cannot use an SVG home-screen icon. A changed icon needs the home-screen app deleted and re-added.

## Writing

Australian English (colour, favourite, fibre). No em or en dashes: use " - ", commas or colons. Write "Ai", not "AI". Plain, short, warm.
