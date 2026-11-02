---
type: design-system
title: Fruity design system - Greengrocer's Chalkboard
description: Tokens, type, motion and component rules for the Fruity PWA; implemented in src/index.css.
created: 2026-11-02
---

# Fruity design: "Greengrocer's Chalkboard"

The direction agreed by the council (designer and shopper seats, round 2; [plans/rebuild-fruity.md](plans/rebuild-fruity.md)). The code is the implementation: every token below lives in `src/index.css` under `@theme`, and components use the token names (`bg-paper`, `text-ink-2`, `bg-tomato`), never raw hex.

## The scene

Two grown-ups in Melbourne, iPhones, the app installed to the home screen. Mostly used standing in a fruit shop under bright fluorescent light, glancing for three seconds between other things; sometimes on the couch, unhurried, playing the quiz. That scene decides it: a light, warm paper surface that reads in shop glare, big plain rows, status that survives a glance, and delight spent only where time is unhurried (detail pages, Play).

## Colour

Restrained: tinted warm neutrals do almost everything. The three produce colours are status, never decoration. No pure `#000` or `#fff` anywhere.

| Token | Hex | Use |
|---|---|---|
| `paper` | `#F6F0E4` | Page background, splash, status bar (`theme_color`, `background_color`) |
| `card` | `#FBF7EE` | Raised surface: rows, cards, tab bar, sheets |
| `tile` | `#EFE6D2` | Recessed surface: selected tab pill, fruit icon backdrop, inputs |
| `tile-strong` | `#E4D8BF` | Pressed state, out-of-season bar segments |
| `line` | `#DDD0B6` | Hairlines, used sparingly (input edge, sheet grabber) |
| `ink` | `#1F2A1C` | Text, primary buttons, selected chips |
| `ink-2` | `#4A5345` | Secondary text (7:1 on paper) |
| `ink-3` | `#656B5F` | Tertiary text on paper or card only (4.8:1); use `ink-2` on `tile` |
| `tomato` / `tomato-deep` / `tomato-soft` | `#D8452E` / `#B23421` / `#F7DCD3` | **Peak**. Fill, text (5.4:1), tint |
| `leaf` / `leaf-deep` / `leaf-soft` | `#3F7D4E` / `#2F6A3F` / `#DCE8D6` | **In season / good**. Fill, text (5.7:1), tint |
| `mango` / `mango-deep` / `mango-soft` | `#F2A93B` / `#8F5400` / `#FBE7C4` | **Ending soon**. Fill, text (5.4:1), tint |

Rules:

- **Status is colour + word + icon, always.** Peak = tomato + "Peak" + star. In season = leaf + "In season" + check. Ending soon = mango + "Ending soon" + hourglass. All year = ink-2 + "All year" + repeat. Out of season = ink-3 + "Out of season" + dashed circle. One component (`StatusLabel`) renders them; nothing else invents a status style.
- The fill colours (`tomato`, `leaf`, `mango`) are for shapes (bar segments, dots). Text in a status colour uses the `-deep` shade.
- The quiz's wrong answer reuses `tomato-deep` with an X icon and the word; its right answer uses `leaf-deep` with a check. That is the only non-season use.
- **Selected is not active.** The current tab, a chosen state and a selected filter chip are neutral: recessed `tile` (tabs) or `ink` fill (chips), never a produce colour. Primary buttons are `ink` on `paper` text.
- Text selection is `mango-soft`, the caret and focus ring are `ink`.

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
- **`FruitIcon` is the only way a fruit is shown small** (rows, rails, bag, picker, quiz picture). Art icon when the manifest has it, otherwise the emoji on a soft `tile` circle of the same size. Sizes: `sm` 32, `md` 44, `lg` 56, `xl` 96. CSS rounds the square icon.
- Fruits without new art keep their old photo as the detail hero until the art lands.

## Season bar

The 12-segment bar replaces the old 3x4 month grid everywhere (browse, detail, Year view). Peak, in season and off are told apart by **shape as well as colour**: peak is a full-height `tomato` segment, in season a half-height `leaf` segment, off a thin `tile-strong` line. The current month carries an `ink` marker under its segment (and a bold initial where initials show). Each bar has a text label for screen readers ("Peak Dec to Feb. In season Oct, Nov, Mar. Now: Nov, in season").

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

- **Tab bar** (`TabBar`): Now / Fruit / Cook / Play, lucide icons plus labels, fixed to the bottom with the safe-area inset. Current tab: icon in a `tile` pill, label `ink` semibold; the rest `ink-3`.
- **Bag button** (`BagButton`): top right on Now, Fruit, fruit detail and Cook. Badge shows items still to get, tabular, `ink` fill.
- **Bottom sheet** (`Sheet`): native `<dialog>` (focus trap, Esc to close, background inert), `card` surface, `rounded-card` top corners, a close button. Backdrop is `ink` at 20% with a barely-there blur.
- **Filter chips**: single-select, tap again to clear. Selected is `ink` fill with a check; pills sit at `justify-self: start` in any grid.
- **State chip**: map pin + state code + chevron; opens the state sheet. The chosen state is stored (`fruity.state`, default `VIC`) and every season calculation reads it.

## Writing

Australian English (colour, favourite, fibre). No em or en dashes: use " - ", commas or colons. Write "Ai", not "AI". Plain, short, warm; no exclamation marks on status.
