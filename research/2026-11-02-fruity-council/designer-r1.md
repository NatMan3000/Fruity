---
type: report
title: Fruity council - designer seat, round 1
description: Agent council case from the designer seat (round 1) on rebuilding the Fruity app.
created: 2026-11-02
---

# Designer, Round 1 - Fruity rebuild

## What is wrong today (evidence)
- Chrome fights content: loud `bg-green-400` header on a `from-yellow-400 to-green-400` page (`src/App.tsx:49,51`), subtitle `text-gray-500` on green fails contrast (`App.tsx:58`). Text sits straight on a saturated gradient.
- Desktop nav: top tab bar, sticky at a hard-coded `top-[72px]` (`App.tsx:71`), unreachable one-handed at the shops. Detail view hides the nav and uses `window.scrollTo(0,0)` with no transition (`App.tsx:39`).
- Cards carry too much: emoji, status, pairing text AND a 12-cell month grid at 10px (`FruitCard.tsx:31-75`). Nothing is scannable. The squint test fails: every card has equal weight.
- Emoji is the only fruit art. Dragon fruit is a pink heart, starfruit a star, lychee a red ball (see screenshot 1). Wrong at a glance, which is the shopper's moment.
- Real photos exist (39 jpgs, `public/images/fruits/`) but total **127MB**, individual files up to ~24MB (strawberry.jpg), and `workbox.globPatterns` excludes jpg (`vite.config.ts:38`), so they never reach the offline cache. They are effectively unusable on a phone as is.
- Calendar is a 39x12 grey slab (screenshot 2): informative but dead.
- Motion today is salad-only keyframes in `index.css`; nothing in navigation.

## Three directions

### A. "Greengrocer's Chalkboard" (warm, tactile, print)
- Feeling: the best stall at the Queen Vic Market, in your pocket.
- Palette: paper `#F6F0E4`, ink `#1F2A1C`, tomato `#D8452E`, leaf `#3F7D4E`, mango `#F2A93B`, plum `#5B2A4E`. Tinted neutrals, no pure white.
- Type: Fraunces (display, soft serif, variable) + Inter Tight body + tabular numerals for months.
- Art: flat illustrated SVG, one cut-paper style, 2-3 colours plus a leaf. 39 assets: generate with nano-banana as reference sheets, vectorise and hand-clean, or start from an open set (Twemoji/Noto are emoji-grade, not distinctive). Cost: highest effort of the three, roughly one sitting per 10 fruits with review.
- Motion: View Transitions + CSS, Motion `LazyMotion` for springs; soft spring.
- Home: (1) greeting + "In peak now" hero fruit, big illustration; (2) horizontal rail "Just landed"; (3) "Ending soon" rail; (4) fruit grid, 2 columns, art plus name plus one status dot; (5) bottom tab bar.

### B. "Sorbet" (bold, playful, colour-per-fruit)
- Feeling: a Gelato menu that knows what month it is.
- Palette: each fruit owns an OKLCH hue; page tints to the hero fruit. Base `#FFF9F2`, ink `#14121A`, accent set derived per fruit.
- Type: Bricolage Grotesque (display, expressive) + DM Sans.
- Art: big cut-out fruit on a fruit-coloured blob. Source: AI-generated "3D-ish glossy" renders, 39 transparent PNG/WebP at 400px, ~15-25kb each. Highest wow, highest inconsistency risk across 39 generations.
- Motion: heavy springs, squash on tap.
- Home: full-bleed colour panel for the peak fruit, swipeable; month dial; grid beneath.

### C. "Almanac" (editorial, calm, data-forward)
- Feeling: a beautifully typeset seasonal almanac. Quiet, confident.
- Palette: bone `#F4F1EA`, charcoal `#1B1D1A`, one green `#2F6B4F`, one amber `#C98A1B`.
- Type: Newsreader + Geist/Inter; mono only for months.
- Art: the existing photos, properly processed (see budget below), cropped square, soft shadow.
- Motion: restrained, shared-element image.
- Home: month title ("November"), one-line summary, wheel/strip of what is in season, list of rows with a thin seasonal bar.

## My pick: A, with C's data discipline and B's one hero moment
Two grown-ups at the shops need fast recognition (art must show the real fruit, not a pink heart), glanceable status, one hand. At home, for play, they want charm. A gives charm without childishness; B tires after a week and relies on 39 consistent AI renders; C is lovely but has least "fun". Photos (C) stay as the detail-page hero, art (A) is the grid language. Important: pick ONE art system for the grid.

## Information architecture
- Bottom tab bar, 4 tabs: **Now** (home), **Browse**, **Cook** (recipes + salad maker), **Play** (quiz + salad toy). Calendar is not a tab: it is a view inside Browse (segment: Grid / Year) and a detail section. Fewer tabs, thumb reach, safe-area padding.
- Home "Now": peak hero, "Just landed", "Ending soon" (the thing a shopper actually asks: buy it now or miss it), "Cook this week" rail of 3 recipes using peak fruit.
- Search: a pinned field at the top of Browse; filter chips (Peak / Available / by season) in a horizontal scroll row, not the current boxed panel (`App.tsx:123-137`).
- Recipes: top-level under Cook, filter "uses fruit in season now". Each fruit detail links its recipes; each recipe links its fruit. Recipe data today is 3 one-liners per fruit (`fruits.ts`, ~117): good seed for cards, not a recipe. New features need ingredients and steps as a separate `recipes.ts`, keyed by fruit id.
- Detail: a route (hash router, so back gesture works in a home-screen PWA) with shared-element transition from card art to hero via View Transitions API (iOS 18+; fall back to a fade). Order: hero, status line, seasonal bar (one row, not a 3x4 grid), "buying tips", recipes, history collapsed.

## Five delight moments
1. **Landing day**: when the app opens in a month where a fruit enters peak, its card does a one-time bloom (scale 0.9 to 1, ring pulse once, haptic via `navigator.vibrate` where available). Shown once per fruit per season (localStorage).
2. **Month wheel scrub**: drag a ring to a month and the grid re-sorts with a FLIP animation; fruits slide in and out. "What will be good in July?" becomes a toy.
3. **Shared-element open**: the card art lifts into the detail hero with spring easing; the month bar fills left to right on arrival.
4. **Quiz answer**: correct answer, the fruit does a squash-pop and the choice chip fills; wrong answer, a single soft shake and the correct one pulses once. Streak shown as a fruit bowl filling.
5. **Salad toss**: keep the existing bowl (`SaladBowl.tsx`) but drive it by device-motion shake on mobile, with a button fallback; result card is shareable as an image.

## Guard rails (iOS home-screen PWA)
- `prefers-reduced-motion`: disable springs and parallax, keep opacity fades and the state change itself. Motion goes through one wrapper so this is enforced once.
- Animate only `transform` and `opacity`; no layout animation. No perpetual animation anywhere (also keeps battery down).
- Bundle: JS under 150kb gzipped initial, route-split Cook and Play. Motion via `LazyMotion` or CSS-only first.
- Images: resize to 480px WebP/AVIF (grid ~20-30kb), 960px for detail (~80kb). 39 fruits is ~1.5MB grid plus ~3MB detail, versus 127MB now. Precache the grid set, runtime-cache (CacheFirst, 60 entries) the detail set. Add `jpg/webp/avif` to workbox globs or runtime routes; a pre-existing offline gap.
- Fonts: self-host variable WOFF2, subset to Latin, `font-display: swap`, 2 families max, precached.
- Safe areas: `env(safe-area-inset-bottom)` on the tab bar, `100dvh` not `100vh`, 44px targets, text 16px+ in inputs (stops iOS zoom).

## Genuine weaknesses of my position
- Direction A's illustration set is a real production job and the style can drift across 39 assets; if it is half done it looks worse than emoji. Mitigation: ship emoji fallback per fruit and migrate gradually.
- View Transitions need iOS 18+; older phones get the fade. Fine, but the signature moment is not universal.
- Motion library adds weight and a reduced-motion burden; "fun animation" is the first thing that jank exposes on an old iPhone.
- I am optimising feel; I have no evidence about what Nathan's partner actually taps at the shops. A shopper advocate may rightly say Now plus search is the whole app and Play is secondary.
