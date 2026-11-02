---
type: design-system
title: Fruity design system - Greengrocer's Chalkboard
description: Tokens, type, colour, motion and component rules for the Fruity PWA; implemented in src/index.css.
created: 2026-11-02
---

# Fruity design: "Greengrocer's Chalkboard"

The direction agreed by the council (designer and shopper seats, round 2; [plans/rebuild-fruity.md](plans/rebuild-fruity.md)). The code is the implementation: every token below lives in `src/index.css` under `@theme`, and components use the token names (`bg-paper`, `text-ink-2`, `bg-peak`), never raw hex. The one exception is a fruit's own `colour`, which is data: its tints are computed by `src/utils/colour.ts` and applied inline.

## The scene

Two grown-ups in Melbourne, iPhones, the app installed to the home screen. Mostly used standing in a fruit shop under bright fluorescent light, glancing for three seconds between other things; sometimes on the couch, unhurried, playing the quiz. That scene decides it: a light, warm paper surface that reads in shop glare, big plain rows, status that survives a glance, and delight spent only where time is unhurried (detail pages, Play).

## Colour

Juicy on a warm paper base (revised 2 Nov 2026 after Nathan used Phase 2 on his iPhone: "The colours are pretty boring for a fruity app!"). The paper, card and ink neutrals still carry text and structure; colour now comes from three places, each with one job. No pure `#000` or `#fff` anywhere, no gradient text, no glass, no side stripes.

### Neutrals

| Token | Hex | Use |
|---|---|---|
| `paper` | `#F6F0E4` | Page background, splash, status bar (`theme_color`, `background_color`) |
| `card` | `#FBF7EE` | Raised surface: tab bar, sheets, chips, tip blocks |
| `tile` | `#EFE6D2` | Recessed surface: segmented control, inputs, quiz answers |
| `tile-strong` | `#E4D8BF` | Pressed state, the Year view's current-month column |
| `line` | `#DDD0B6` | Hairlines, used sparingly (input edge, sheet grabber) |
| `ink` | `#1F2A1C` | Text, primary buttons, selected chips |
| `ink-2` | `#4A5345` | Secondary text (7.1:1 on paper, 5.8:1 or better on every fruit tint) |
| `ink-3` | `#656B5F` | Tertiary text on paper, card or a fruit's soft tint (4.8:1 or better) |

### 1. Season status: green means buy, red-family means not now

Nathan's mapping: "my bright green would be peak and maybe less bright green in season, and then out of season would be red". Fill for shapes, `-ink` for text and icons, `-soft` for tints.

| Status | Fill | Text (`-ink`) | Soft | Word + icon |
|---|---|---|---|---|
| Peak | `peak` `#1FA34A` bright, saturated green | `#12722F` (5.2:1 on every tint) | `#DCF9E0` | "Peak" + filled star |
| In season | `season` `#7CC25A` lighter, softer green | `#3F6B2B` (5.4:1) | `#E3F8DA` | "In season" + check |
| Ending soon | `ending` `#F2A93B` amber | `#8F5400` (5.3:1) | `#FEEDD9` | "Ending soon" + hourglass |
| Out of season | `off` `#DE9D95` soft, low-saturation rose | `#A0473F` (5.3:1) | `#FEEBE9` | "Out of season" + dashed circle |
| All year | | `ink-2` | | "All year" + repeat |

- **Status is colour + word + icon, always**, and in the season bar shape as well. One component (`StatusLabel`) renders the words; nothing else invents a status style.
- Out of season is red-family but calm on purpose: a bar that is mostly out of season is a row of thin rose lines, not an alarm. The word uses the deeper `off-ink` so it still reads at a glance.
- Green is reserved for status. Decoration never uses green, so "green means buy" stays true on every screen.
- The quiz's right answer is `peak-soft` + `peak-ink` + check; the wrong answer is `berry-soft` + `berry-ink` + X.

### 2. Fruit colour: every fruit wears its own

Each fruit in `src/assets/fruits.ts` has a `colour` (#RRGGBB, validated at build): mango orange, kiwifruit green, plum purple, blueberry blue. `src/utils/colour.ts` derives two tints from it **at a fixed OKLCH lightness**, keeping only the hue and a capped chroma, so mulberry and lemon give rows of the same lightness and dark text has the same contrast on every fruit:

| Tint | OKLCH | Where |
|---|---|---|
| `soft` | L 0.955, C up to 0.045 | Fruit rows (Buy now, Fruit list), Cook cards, pairing chips |
| `wash` | L 0.90, C up to 0.085 | The `FruitIcon` circle, the detail page header band and hero backdrop, tip-block icon circles |

- Text on a tint is always `ink`, `ink-2`, `ink-3` or a status `-ink`. `scripts/colour-contrast.test.ts` checks every fruit's tints against those (4.5:1) and the peak bar (2.5:1), reading the hexes from `src/index.css`.
- The new art has a cream studio backdrop; it is drawn with `mix-blend-mode: multiply` on the wash, so the backdrop takes the fruit's colour and the fruit itself barely shifts. Old photos are not blended.
- Pressed rows darken with `brightness-95` rather than switching to a neutral, so they keep their colour.

### 3. Juice: bright accents for decoration

| Token | Vivid | `-soft` | `-wash` | Job |
|---|---|---|---|---|
| `berry` | `#E5365F` | `#FEEBEC` | `#FED1D4` | Spring; "Just landed" marker; quiz wrong (`berry-ink` `#B3213F`) |
| `tangerine` | `#FF8A1E` | `#FEECE1` | `#FFD4B8` | Summer; "Cook this week" marker; current tab pill |
| `grape` | `#7E4BB0` | `#F4ECFE` | `#E7D5FE` | Autumn |
| `citrus` | `#FFC928` | `#FDEFCF` | `#F6DB9D` | Winter; text selection |

- Each season of the year owns one accent (`src/utils/accents.ts`): spring blossom berry, summer tangerine, autumn grape, winter citrus. The Now page's month sits on a band in that season's `-wash` with a vivid season mark (flower, sun, leaf, citrus); the season filter chips carry the same colour as a dot.
- Now's section headings each have a small vivid marker circle with an icon: Buy now (peak green star, because it is the peak list), Just landed (berry sparkles), Ending soon (amber hourglass), Cook this week (tangerine pot). Icons on vivid circles are 3:1 or better (`ink` on all but grape, `card` on grape).
- Vivid accents are marks and small shapes only, never a text colour and never a large fill behind text: large areas use `-wash` or `-soft`.
- Text selection is `citrus-wash`; the caret and focus ring are `ink`.

### Contrast (checked by `scripts/colour-contrast.test.ts`)

| Pair | Ratio |
|---|---|
| `ink-2` on the lowest fruit soft tint / wash | 6.96 / 5.79 |
| Status `-ink` words on the lowest fruit soft tint | 5.24 (peak) to 5.44 (in season) |
| `ink` on each season band wash | 10.9 to 11.1 |
| `peak` bar on the lowest fruit soft tint / on card | 2.85 / 3.07 (plus full height) |
| `season` and `off` bars on card | 2.02 / 2.10 (plus half height and a thin line) |

## Type

| Role | Face | Size / line | Weight |
|---|---|---|---|
| Page title, fruit name on detail | Fraunces (display) | 30/34, 34/38 on detail | 600 |
| Section heading | Fraunces | 20/26 | 600 |
| Fruit name in rows and cards | Fraunces | 18/22 | 600 |
| Body | Inter Tight | 17/24 | 400 |
| Small (tips, descriptions) | Inter Tight | 15/20 | 400 |
| Caption, status word, tab label | Inter Tight | 13/16 | 500-600 |

- Fraunces is the optical-size variable cut (`opsz` + `wght`), Inter Tight the weight variable cut, both self-hosted Latin-subset WOFF2 from `@fontsource-variable` and precached by the service worker. About 112 KB total.
- Numbers use tabular figures (`tabular-nums`): counts, badges, nutrition, times.
- Steps are about 1.25 apart; hierarchy comes from scale and weight, not colour.
- Text fills its container. No measure caps (`max-w-prose`, `ch` widths) inside rows, cards or sheets, and no truncation of content text.

## Shape and space

- **Radii pair:** `rounded-card` 16px for rows, cards, sheets and the hero; `rounded-control` 10px for buttons, inputs and segmented controls. Chips, badges and fruit icons are fully round.
- **Depth without shadows:** tonal steps (`paper` page, `card` raised, `tile` recessed). No drop shadows, no 1px divider lines between rows (gaps do that).
- **Spacing:** Tailwind's 4px scale only. Page gutter 16px (`px-4`). Within a group 8-12px (`gap-2`, `gap-3`), between sections 24px (`gap-6`). Use `gap`, not margins.
- **Targets:** every tappable thing is at least 44x44px.
- **Safe areas:** page headers pad `env(safe-area-inset-top)`, the tab bar pads `env(safe-area-inset-bottom)`. Shell height is `min-h-[100dvh]`, never `h-screen`.

## Fruit art

- One generated studio set on a warm cream background (`images-src/fruits/<id>.png`, imported with `bun run art:import`). `bun run images` writes `<id>-480.webp` and `<id>-960.webp` (4:3) for every fruit, and `<id>-icon.webp` (160x160, square, centred on the fruit) for fruits with new art; `src/assets/art-manifest.json` lists those ids.
- **`FruitIcon` is the only way a fruit is shown small** (rows, rails, bag, picker, quiz picture). Art icon when the manifest has it, otherwise the emoji, both on a circle in the fruit's `wash` tint. Sizes: `sm` 32, `md` 44, `row` 48 (Now's Buy now rows and rails), `lg` 56 (Fruit list), `xl` 96. CSS rounds the square icon.
- Fruits without new art keep their old photo as the detail hero until the art lands.

## Season bar

The 12-segment bar replaces the old 3x4 month grid everywhere (browse, detail, Year view). Peak, in season and off are told apart by **shape as well as colour**: peak is a full-height bright `peak` green segment, in season a half-height soft `season` green segment, off a thin soft-rose `off` line. The legend draws the same three shapes. The current month carries an `ink` marker under its segment (and a bold initial where initials show). Each bar has a text label for screen readers ("Peak Dec to Feb. In season Oct, Nov, Mar. Now: Nov, in season").

- In the Fruit list every row has the same structure (name and status on one line, the status never wraps under the name, bar below), and the list is one column at every width, so every bar starts at the same x and sits at the same height in its row.

## Motion

Motion only where it means something. CSS and the View Transitions API, no animation library.

| Moment | What moves | Timing |
|---|---|---|
| Card or row to fruit detail | The tapped icon morphs into the hero (`view-transition-name: fruit-hero`, set on the tapped element only) | 220ms ease-out; a 150ms fade where View Transitions are missing |
| Detail opens | Season bar segments fill upward (`scaleY`, origin bottom, 8ms stagger) | 160ms each, all done under 250ms |
| Bag tick | Check fills (`scale` + opacity) | 150ms ease-out |
| Bottom sheet | Slides up, backdrop fades | 220ms in, 180ms out, ease-out |

- Transform and opacity only, never layout properties. Ease-out, no bounce.
- No entrance animation on Now. Tab switches are instant.
- No perpetual animation anywhere (no `animate-pulse`, `animate-ping`, `animate-bounce`, no `infinite` on anything always mounted). The salad maker's stir runs only while mixing (2.5s).
- `prefers-reduced-motion: reduce` turns all of it off: View Transitions are skipped, sheets appear without sliding, the bar is drawn full.

## Components

- **Tab bar** (`TabBar`): Now / Fruit / Cook / Play, lucide icons plus labels, fixed to the bottom with the safe-area inset. Current tab: icon in a `tangerine-wash` pill, label `ink` semibold; the rest `ink-3`.
- **Header bands**: Now's month header and a fruit page's header (back, hero, name) sit on a full-width band with 28px bottom corners, in the season's or the fruit's wash. Status text stays below the band, on paper.
- **Bag button** (`BagButton`): top right on Now, Fruit, fruit detail and Cook. Badge shows items still to get, tabular, `ink` fill.
- **Bottom sheet** (`Sheet`): native `<dialog>` (focus trap, Esc to close, background inert), `card` surface, `rounded-card` top corners, a close button. Backdrop is `ink` at 20% with a barely-there blur.
- **Filter chips**: single-select, tap again to clear. Selected is `ink` fill with a check; unselected chips show a colour dot (peak green, in-season green, each season's accent, `ink-3` for year-round). On a phone the row scrolls sideways and its right edge fades while more chips are hidden past it; from `sm` up the chips wrap, so none is ever out of reach.
- **State chip**: map pin + state code + chevron; opens the state sheet. The chosen state is stored (`fruity.state`, default `VIC`) and every season calculation reads it.

## App icon

A red apple with a lime leaf on a bright green (`#22B04F`) square, drawn as SVG in `scripts/build-icons.ts` (`bun run icons`), rendered with sharp:

| File | Size | Use |
|---|---|---|
| `apple-touch-icon.png` | 180, opaque, full bleed | iOS home screen (`<link rel="apple-touch-icon" sizes="180x180">`); iOS rounds the corners |
| `icon-192.png`, `icon-512.png` | 192, 512 | Manifest `purpose: any` |
| `icon-maskable-512.png` | 512, apple scaled to 80% | Manifest `purpose: maskable`; the apple stays inside the central safe circle |
| `favicon.svg` | vector, rounded tile | Browser tab only |

The manifest lists PNGs only. iOS cannot use an SVG home-screen icon: with an SVG in the manifest it showed a letter "F" placeholder. iOS bakes the icon in when the app is added, so a changed icon needs the home-screen app deleted and re-added.

## Writing

Australian English (colour, favourite, fibre). No em or en dashes: use " - ", commas or colons. Write "Ai", not "AI". Plain, short, warm; no exclamation marks on status.
