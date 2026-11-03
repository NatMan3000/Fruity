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
| Small, captions, sticker words | Bricolage Grotesque 600-800 | 15, 13, 13-15 caps (never under 13: the 12px floor plus the caps' tracking) |

- Both self-hosted Latin WOFF2 (`@fontsource/shrikhand` 16 KB, `@fontsource-variable/bricolage-grotesque` weight axis 41 KB), precached. Shrikhand has one weight: `.font-display` turns off synthesis so it is never faked bold.
- Numbers use `tabular-nums`. Text fills its container: no measure caps in blocks or sheets, no truncation of content text; long names wrap.

## Shape and space

- **Chunky blocks:** `rounded-block` 28px for rows, cards, sheets; every button, input and chip is a pill. A block sits on a hard 5px offset shadow in the screen's ink (`.block-shadow`) and sinks into it when pressed (`.press`).
- **Spacing:** Tailwind's 4px scale. Gutter 16px. Within a group 8-16px, between sections 36px.
- **Targets:** at least 44x44px. **Safe areas:** headers pad `env(safe-area-inset-top)`, the floating tab bar `env(safe-area-inset-bottom)`; shell `min-h-[100dvh]`.

## Fruit art

- **Every fruit picture is a die-cut sticker that sits INSIDE its block** (Nathan found Sorbet's pop-out "a bit weird"). `FruitSticker` is the only way to draw one: the art sticker when the fruit has new art, otherwise its emoji with the same white edge traced round it (`.sticker-emoji`). Exactly one of the two is drawn, never both, which is what fixed the doubled quiz picture. Each fruit has a steady tilt (`tiltOf`).
- All 39 fruit have art and a sticker (3 Nov 2026), so the emoji edge is only a safety net: the validator fails the build if any fruit is missing `<id>-sticker.webp` or `<id>-sticker-sm.webp`.
- **The studio photo** (Nathan, 3 Nov 2026: "in the more about it for each, add the fruit image here"): the whole generated picture on its cream background, `<id>-photo-720.webp` (720 square, quality 75, written by `images`), sits at the top of a fruit page's "More about it", the block's full content width, 20px corners, alt "<Fruit> on a plain background". "More about it" is a plain section like Recipes and Goes with (heading above a `bright` block), always open: no fold (Nathan: "should be expanded by default. doesnt need to collapse at all"). The photo is `loading="lazy"`, so it is fetched as the page scrolls near it, and runtime-cached (`fruity-fruit-photos`), not precached; offline before that, the precached sticker stands in on the same square. The validator fails the build if a fruit lacks it. This is the only place the cream-background picture is shown; everywhere else a fruit is its sticker.
- `FruitIcon` (the cafe's name) is a thin wrapper over `FruitSticker`, so the cafe shows the same stickers.
- **Pipeline, one command:** `bun run art` = `art:import` (imports `<id>.png` from `~/.cache/kai-tmp/fruity-art` as `images-src/fruits/<id>-art.jpg`, JPEG q85; `scripts/originals.ts` re-imports only when the PNG's bytes change, recorded in `sources.json`, so a regenerated set flows through in one run and an unchanged one rebuilds nothing) + `images` (the studio photos and `src/assets/art-manifest.json`) + `stickers` (`scripts/build-stickers.ts`: Apple Vision lifts the fruit off its backdrop, `scripts/subject-mask.swift`, macOS only; bakes a 28px white edge; writes `<id>-sticker.webp` 640px and `<id>-sticker-sm.webp` 256px). Stickers rebuild only when their source is newer; `--force` rebuilds all; then `dishes` (below). Originals are committed as JPEG, never the big PNGs; generated files are committed.

## The 3D heroes (src/three/, src/components/NowHero.tsx, FruitHero.tsx)

- **A fruit's page** (`SpinFruit`, comp-3d's drop): the fruit in 3D drops onto a juicier blob spinning, bounces, squashes and coasts to a stop; cut it open as below. A fruit without a model (`src/three/modelled.ts`, kept in step with the models by a test) shows its white-edged sticker dropping in instead, as does any device without WebGL.
  - **Free spin** (Nathan, 3 Nov 2026: "they should free spin like a normal 3d model"): a drag that starts ON the fruit (its own pointerdown, a raycast hit) turns it about the screen axis at right angles to the drag, any direction, quaternions about the fruit's middle (`useTrackball` in `motion.ts`), and a flick coasts; that press cancels its own touchmoves, so the page does not scroll under it. A drag that starts on empty canvas turns it about the vertical only, and a vertical one there scrolls the page. No drift back to upright: it stays as you leave it, like a model viewer, and a cut is planned afresh from wherever it is. Reduced motion: no arrival spin, no coast; dragging still turns it.
  - **Drop-in edge:** the fruit falls in from above the canvas, so while it drops the canvas's top 56px fade in (a CSS mask, `DROP_FADE` in SpinFruit) and it appears through a soft edge, not a hard line under the top bar; the mask comes off once it has landed.
  - **Framing** (Nathan: the fruit sat low with the top of the blob empty): the blob is fixed at 300 x 256 (`src/three/framing.ts`) with the canvas centred on it; each fruit is sized to fill about two thirds of the blob and the camera looks at its middle, so it sits in the centre; cut, the camera eases to the middle of the pieces and pulls back if they spread past the blob. The key light is higher here (1.4, 6, 2.2) so shadows stay short and inside the blob. Every size is fixed up front, so nothing reflows when the canvas or fonts arrive.
  - **Slice button:** in `ink`, centred and hanging half off the blob's lower edge (reads Put back once it is open); the Now dish keeps its `bright` one at the side, and there it cuts every fruit in the dish at once and reads Put back while any fruit is open.
  - **The blob** pops in where it rests: scale 0.82 to 1 and fade, 260 ms, ending exactly on its resting transform (it used to animate `transform: translateX(-50%)` on top of Tailwind's `translate`, so it slid in from the left and jumped to the centre).

**On Now:**

- This month's peak fruit drop one by one into a sundae coupe glazed in the season's `pop` with a `light` lip, bounce, squash and settle; the dish rocks on each landing. The fruit with the best insides go in first (watermelon in summer, kiwi and citrus in winter), then Buy now order.
- **Cut them open:** tap a fruit, or flick quickly sideways across it (22 px inside 100 ms), and it slices: a knife stroke flashes, a few drops of juice fly, the halves fall apart side by side and turn their cut faces up to you. Tap a cut fruit to put it back. A slower sideways drag turns instead (spins the dish; on a fruit's page any drag on the fruit turns it freely, above). A vertical swipe on the dish still scrolls the page (`touch-action: pan-y`); the dish only turns about the vertical, since its fruit rest in it under gravity and the dish is how you scroll past Now's hero. No hint text (Nathan, 2 Nov 2026): the Slice button is the cue, and the way in for keyboard and screen-reader users; cuts are announced. The cut, the juice and the gesture live in `src/three/cutting.tsx`, shared by the dish and the fruit page.
- **The whole dish cut at once** (the Slice button; audit now-F3, 3 Nov 2026): every fruit is cut by its type as on its own page, then `planDish` (`src/three/dish.ts`) fits the open fruit together: seen from above, each open fruit (its pieces as one group) is pushed clear of the others and of the fruit that hop, and kept inside the bowl short of the rim; if they cannot all fit, every open fruit shrinks a little and it tries again; then each rests on the bowl. A fruit tapped open on its own goes to the same spot. The plan is made in idle time once the dish settles and redone only if the dish has been turned. `bun run models:sheet` cuts the dish for all twelve months at three turns and fails on any piece meeting another fruit, the rim or the bowl (`models-dish.png`). Whole fruit rest inside the bowl too, clear of the rim and of each other (`restPoses`): a fruit that would reach the rim at its slot's turn is turned about the vertical to the angle that keeps it in (the rhubarb lies along the curve); then the five are fitted together from above the same way as the cut pieces (`pack`), shrinking together a little if they will not fit, and each settles onto the bowl. The dish is no longer piled, so the first fruit no longer sits on the others. The sheet checks every month's dish whole at rest (`dish/<Mon>-whole.png`) and a dish of five of every one of the 39 fruit, whole and cut (`models-dish-of-five.png`), so the hop-type fruit (rhubarb, grapes, cherries, berries, bananas) are tested in every slot.
- Round fruit are built as two halves (`models.ts` `cutBody`), each closed by a cap textured with its flesh (`flesh.ts`). Bunches, berries, bananas and rhubarb hop when tapped instead. Whole, a fruit built in pieces must read as one smooth body: the cut faces are hidden until the pieces start to part (`cutFace`, shown by `stepCut`), and where two pieces meet their skin normals come from the shape itself, so no seam shades (the whole lemon showed its five slices, 3 Nov 2026). `bun run models:sheet` writes every whole fruit full size (`dir/whole/<id>.png`) to check.
- **Every cut face is painted from the real thing, never a stock pattern** (Nathan, 2 Nov 2026, of a strawberry drawn like a citrus wheel: "this is not what strawberry sliced looks like"). Each fruit's inside is checked against a photo of it cut (the studio set in `~/.cache/kai-tmp/fruity-art/`) or, where there is none, its well-known look, and the face follows the cut's own outline. Radiating lines belong only to fruit that really have them (citrus segments, kiwi and pineapple fibres). Per fruit:
  - Strawberry (lengthways): deep red rim under the skin, flesh paling inwards to pink, a pale whitish-pink core in the berry's own shape hanging from the calyx, faint pale strands from the core out to the seeds; seeds only on the skin. Skin red to the shoulders, never orange. The calyx (Nathan, 3 Nov 2026: "a lot better, except for its green leaf"): ten thin, slightly ragged sepals lying down and out over the shoulders, built on the body's own surface and lifted just off it (`shoulderSepals` in models.ts), darker green with a lighter midrib, tips lifting a touch, and a short stem; never a stiff crown on top, never anything inside or through the berry. A lengthways cut leaves each half the five sepals and the half stem on its side. The model sheet fails if any sepal or stem vertex is inside the body (`hug` meshes, ray parity).
  - Apple, pear, quince (lengthways): cream flesh (quince yellower), a faint heart-shaped core line, a slit of seed chambers down the middle with seeds pointing to the stem (quince more of them), stem and calyx channels, the dried calyx at the base. No five-seed star: that is the across cut.
  - Peach, nectarine, apricot, plum (lengthways): flesh richer under the skin, a big pointed ridged stone (about a third of the width) proud of one half, and in the other the stained hollow with the stone's ridges pressed in and red fibres round it (peach, nectarine). Plum is a blood plum: deep red flesh paling round the stone.
  - Mango (lengthways): deep golden-orange, the big flat pale fibrous stone lying along it.
  - Avocado: pale yellow round a big glossy stone, greening to a bright green band under the dark skin.
  - Fig (lengthways): purple skin, thick cream band, a rose-red heart of strands running in to a pale hollow, tiny seeds.
  - Feijoa (across): cream flesh, a gritty greenish band under the skin, translucent jelly in four lobes with tiny seeds.
  - Persimmon (across, Fuyu): seedless deep orange with a soft pale eight-petal flower in the middle.
  - Pomegranate (across): red rind, pale pith, cream membranes splitting it into chambers packed with glossy ruby seeds.
  - Rockmelon, honeydew (lengthways): an oval seed cavity along the fruit, seeds clinging to its walls; rockmelon's in orange stringy pulp, honeydew's clean.
  - Unchanged and right: watermelon, kiwifruit, citrus wheels, dragon fruit, passionfruit, papaya, lychee, coconut, custard apple, pineapple rings, starfruit stars, banana coins. A fruit with no spec gets a pale tone of its own colour.
  - A fruit's own inside is a `draw` function in `flesh.ts`; shared parts (rim band, pit, stone, seeds, segments) are spec fields. Textures are painted once per fruit and cut direction, at most 512 px (stones 128 px).
- Cuts by type (Nathan: "The pineapple would be better if it cut into slices!"): rounds where a fruit is known by its slices: pineapple rings (crown left on the top piece), citrus wheels, kiwifruit rounds, starfruit stars, banana coins, all fanned out like dealt cards. Halves where the inside is the payoff: lengthways for stone fruit, avocado, mango, papaya, strawberry, melons, fig, dragon fruit and lychee; across for passionfruit, pomegranate, persimmon, feijoa and coconut. Faces are canvas-painted flesh that lights itself a little, so the inside keeps its colour whichever way it turns.
- **Pieces never interpenetrate; the whole body is fully replaced by its pieces.** Two halves lie side by side (staggered in depth if their edges would meet). More pieces all turn the same way, cut face to you, thin out a little, and either lie in a flat row with gaps (small pieces, banana coins) or shingle: each sits above the last by at least its own thickness, so parallel pieces can never meet. A crown piece (pineapple) or banana tip stands at the end of the row. Whatever is not cut (the banana's other fingers) eases back while the pieces come forward. The row is centred where the fruit was. Then `cutOverlaps` (convex hulls of each piece's solid body) checks it exactly and nudges until clear.
- **Check them:** `bun run models:sheet [dir]` renders every fruit whole and cut from the fruit page's camera into two labelled contact sheets (`models.html` and `src/dev/model-sheet.ts`, dev-only, not in the app build). Run it after touching `src/three/` and look at every tile; it also writes every cut full size (`dir/cut/<id>.png`) and FAILS (exit 1, red label) if any cut piece overlaps another or the rest of the fruit, or if a leaf that lies on the skin (`userData.hug`) has a vertex inside the body.
- All 39 fruit are modelled (comp-3d's 31 plus dragon fruit, passionfruit, lychee, feijoa, fig, coconut, custard apple and quince).
- **Cost:** three.js and React Three Fiber (one shared chunk, 249 KB gzip, also used by the cafe), the models, flesh and cutting (12 KB) and the two scenes (2 KB and 1 KB) load lazily, only once the Buy now list has painted (`requestIdleCallback`). No `manualChunks`: forcing a `three` chunk pulled React into it and made the main entry preload all of three.js (caught 2 Nov 2026). Render on demand (`frameloop="demand"`), DPR capped at 2, one 1024 shadow map. Until it lands the dish's place waits empty, so the dish dropping in is the first thing seen there (the sticker still flashed up first and vanished, Nathan, 3 Nov 2026); a still of three stickers in a flat dish shows only where WebGL is missing or the scene fails.

## Welcome (src/components/Welcome.tsx, src/three/WelcomeFruit.tsx)

A tap-to-enter front page (Nathan, D21, 3 Nov 2026: "a really fun page with cool animation when you touch it"), shown on every launch, a shared deep link included, and on every return from the background.

- **On screen:** the season's `page` colour, a tilted `pop` pill with the month and season, "Fruity" huge in Shrikhand (`light`, a hard 6px `ink` shadow), this month's lead fruit (the one the Now dish leads with, `dishFruits`) floating and slowly turning in 3D on a `pop` blob, the month's other dish fruit as stickers slapped on round the edges, and an `ink` "Tap to slice" pill. The whole screen is one button (accessible name "Enter Fruity. Tap to slice", inside a modal `<dialog>` named "Welcome to Fruity", focused on open); Enter, Space and Escape go in too. The status bar wears the season's colour while it is up.
- **The tap:** a knife stroke flashes across the fruit at -16 degrees with the slice sound, the fruit is cut along it (laid so its cut is level, then tilted to the stroke), juice flies, the pieces fly apart along the cut's normal turning their cut faces to you, and the screen itself splits along the same line: the two halves (each with a `bright` cut face along its edge) part a little, then pull away faster and faster, hinging a few degrees, and the app is underneath. About 0.77 s from the tap until the welcome has gone. The screen underneath holds its entrance motion while the welcome is up (`html[data-welcome]` pauses it) and plays it as the halves part.
- **Why the tap:** it is the gesture iOS needs to start Web Audio. The tap calls `unlockAudio` itself (it also resumes a context iOS stopped while the app was away), and the 3D heroes wait for the welcome to go (`useAfterPaint`), so the Now bowl's drop and clunk happen where they are seen and heard: the bowl's canvas is up within about 30 ms of the welcome going and it lands about 0.6 s later.
- **When:** every cold start. On the way into the background it goes up straight away (so the picture on the way back is the welcome, never a flash of the old screen); back within 2 s (`FLICKER_MS`, the notification shade, a quick look elsewhere) it is taken down before the first frame; never over Cook mode. It covers whatever screen was there and the tap reveals it as it was: same route, scroll, cut fruit and state (`src/utils/welcome.ts`, `src/hooks/useWelcome.ts`).
- **Fast:** colour, wordmark, cue and the fruit's sticker paint from the main bundle (the wordmark waits up to 350 ms for Shrikhand, never shows in the fallback face); the 3D fruit is its own small chunk and crossfades in over the sticker once its first frame is up, with the cut's shaders and textures compiled and the audio context made ahead, so the tap costs nothing. While it waits it also fetches the hero under it (its scene chunk and its fruit models), so the dish starts straight after.
- **No WebGL:** the sticker stays and is cut with the screen. **Reduced motion:** the welcome still shows, the fruit sits still, and the tap fades it out in 220 ms (no stroke, no flying halves, no sound).
- The one thing that moves while idle: the floating fruit, and only while the welcome is up.

## Motion

"We like animation." Playful, springy, one-shot. CSS only (springs as `linear()` curves in `--ease-spring` and `--ease-bounce`, Web Animations for the bag swell); no animation library ships.

| Moment | What moves |
|---|---|
| First visit of a session: Now, Fruit list, Year, Cook | Titles rise; blocks pop in staggered with a slight twist; list rows swing in from alternating sides |
| A fruit page opens | The blob pops in where it rests, the 3D fruit drops in spinning and coasts to a stop, the status sticker slaps on, the Year bars bounce up one by one (Market Sticker's entrance) |
| Add to bag | The button swells once and turns peak green, the tick spins in, a small sticker of the fruit hops up into the bag, whose count pops |
| Tabs | The current pill glides across in step with the page slide (same length and curve). Drag it: press on the bar and slide sideways, it follows the finger and lights the tab under it, and on release snaps to that tab and goes there; reduced motion still follows the finger and snaps without travel |
| Page moves | A fruit, a recipe or a game slides in from the right over the screen it came from, and Back slides it off to the right again (300 ms, `--ease-out-soft`); between tabs the whole screen slides sideways, the old one off one side as the new one comes in from the other, side by side (a tab to the right moves the content left; both ways one length and curve, `--tab-move` 420 ms on `--ease-glide`, both opaque). A 3D hero on the screen a move brings in (the Now dish, a fruit) is built only once the slide has finished, so the slide never stutters (`pageMove` in `useRoute.ts`). The tab bar stays put. The iPhone's back swipe is Safari's own animation: nothing is added to it. Any back move (the swipe, Back) shows the screen as it was left: no entrance replays, its pictures paint at once, and a 3D hero is already at rest (`renderBack` in `useRoute.ts`) |
| Sheet | Springs up, slides down |
| Hero | Now: the empty area, then the bowl drops in with a soft landing (its shadow grows as it comes down, the canvas top fades in), and 150 ms after it lands the fruit drop in one after another (about 1.5 s in all). Fruit page: the fruit drops in. Then cut, juice, rejoin (above) |

- Transform and opacity only. Nothing loops and nothing moves while idle: the 3D scene stops rendering once still. The one exception is the welcome's floating fruit, only while the welcome is up (above).
- `prefers-reduced-motion: reduce` turns all of it off: screens appear in their final state, the hero's fruit start in the dish and cut without travel, the bag skips the hop.

## Components

- **Top bar** (`TopBar`): a Back disc on a fruit page, the title in Shrikhand, extra controls, and the bag disc (`bright` with an `ink` icon, a count badge in `ink`).
- **List / Year toggle** (`FruitTabHeader`): two round icon buttons in an `ink` pill, no words on screen, each with its name as an `aria-label` and `aria-current` on the one you are on.
- **Tab bar** (`TabBar`): a floating `ink` pill; the current tab sits in a `--scoop` pill (the season's `pop`, or the fruit's `bright` on a fruit page). The scoop can be dragged between tabs (`src/utils/tabDrag.ts`: past a 10px sideways slop a press becomes a drag; a tap, a wobble or a vertical swipe never does). The bar takes only sideways touch (`touch-action: pan-y`), so a vertical swipe on it still scrolls the page.
- **Colour block rows**: Buy now and the Fruit list are blocks in the fruit's `pop` with the sticker inside on the left, the name in Shrikhand, a status sticker, and the pick tip (Now) or the season bar (list).
- **Season bar** (`SeasonStrip`): twelve scoops in an `ink` track; this month ringed in `light`; on a fruit page, `lg` with month initials and the bouncy entrance.
- **Sheet** (`Sheet`): native `<dialog>`, the screen's `bright` with `ink` text, a `pop` close disc.
- **Filter chips**: `deep` with a colour dot, `pop` with a check when on; they squish when pressed. At least 44px tall. A sideways chip row nudges its gap and the chips' side padding so the chip at the screen edge is always visibly cut, at least 24px showing and 16px hidden (`src/utils/peek.ts`); Cook's recipe types are one sideways row too (snap-to-start), so the first recipe stays near the top.
- **Sideways rails** (Now's Just landed and Ending soon): the gap between scoops stretches with the screen so the fourth scoop always peeks about 30px.
- **Status sticker in a list row**: on its own line under the name, so a long name never pushes it down and every row is one height.
- **A block on a page of another fruit's colour** (a `RecipeCard` on a fruit page): if its tone sits closer than 0.08 (OKLab) to the page it takes its other tone, and if both do, the white die-cut edge (`blockTone` in `src/utils/tones.ts`, tested in `scripts/colour-contrast.test.ts`).

## Cook (src/pages/CookPage.tsx, RecipePage.tsx, CookMode.tsx)

Fruity's own recipes (`src/assets/recipes.ts`, 35, Phase 3), in the same blocks as the fruit.

- **Dish photos** (Nathan: "a picture of what the recipes cook, as in the final plate"): one generated photo per recipe, the finished plate on a kitchen table. `scripts/build-dishes.ts` (part of `bun run art`) imports `<id>.png` from `~/.cache/kai-tmp/fruity-dishes` as `images-src/dishes/<id>.jpg` (JPEG q85, same hash rule as the fruit) and writes `public/images/dishes/<id>-720.webp` (cards, thumbnails, quality 72; precached) and `<id>-1200.webp` (the recipe hero, quality 78; cached the first time it opens, CacheFirst, 40 entries); `dishUrl` in `src/utils/images.ts`. The validator fails the build if a recipe lacks either. **No text sits on a photo**: the only things over one are the top bar's discs (each its own `bright` fill) and stickers, so no scrim is needed; anything wordy added later needs a scrim that keeps 4.5:1.
- **Cook tab:** a segmented `ink` pill (In season, All, Saved; the current one in the season's `pop`), filter chips for type and Kid-friendly, and each recipe as a `RecipeCard`: a block in its main fruit's `pop` (`bright` on that fruit's own page) with the dish photo as its picture (16:10, 4:3 on Now's rail) and the fruit's sticker slapped over the photo's lower right edge, so the fruit still leads; below it the type, an "In season" peak sticker when the main fruit is at its peak, the name in Shrikhand, and time and serves or makes. In season means the main fruit is in the shops, peak first.
- **A recipe's page** wears its main fruit like a fruit page (App sets the screen tones): the dish photo full-bleed at the top (4:3, at most 60% of the screen, 40px rounded bottom corners) with the top bar floating over it; the main fruit's sticker drops onto its lower edge and any other fruit slap on beside it, on the photo. Offline before the hero was cached, it falls back to the precached 720. Facts as `deep` pills, Start cooking as the fat `ink` pill, a serves stepper (1 to 12; `src/utils/scale.ts` rescales only numbers, to friendly fractions and amounts a scale shows), ingredients as a tickable `bright` list, Add fruit to bag and Add all to bag (the bag groups Fruit and Other), the method as big numbered `bright` cards, Tip, Keeping it (preserves: always "Store in the fridge; this is not a shelf-stable preserve"), the swaps (headed Out of season? Try: only when the main fruit is out of season, Swap it for otherwise; an out-of-season recipe says so once, in its status sticker, with a See the swaps link), and We made this in a `deep` block.
- **Cook mode** covers the tab bar in the main fruit's `pop`: the dish as a small thumbnail in the header with the fruit's sticker on its corner, one step at a time on a `bright` card, progress dots, the step's ingredients as `pop` pills at your serves, tap-to-start timers (`ink` pill, `peak` when done, a Web Audio chime), Back and Next or a sideways swipe (no Back on the first step), and the Screen Wake Lock while it is open. The recipe name sits at 17px so the longest fits two lines beside the close disc and the dish.
- **Motion:** the next step slides in from the side you went; the bag buttons swell, turn `peak` and send the recipe's fruit hopping one after another into the bag; We made this throws a one-shot burst of the recipe's fruit and sprinkles. All off under reduced motion.
- The recipes are their own chunk (`useRecipes`), as are the recipe page and cook mode, so Now and the fruit pages paint without them. A recipe is `reviewed: false` until a person has cooked or read it; the page says so in a line at the bottom.

## Guess the fruit (src/quiz/)

A game, not a flash-card set (Nathan, 2 Nov 2026: "not very fun! ... do better!"). Full screen over the tab bar like the cafe, on the season's page colour; the question card is `bright`, answers `deep`, right `peak`, wrong `off`.

- **Round types, mixed each game:** Inside out (the 3D fruit already cut open, swaying), Silhouette spin (a flat ink shape spinning, colour then shine arriving as the clock runs), Close-up (a tight zoom on the skin pulling back), Season sense (tap a peak month on a 12-month grid; which one is NOT in season, or at its peak, this month), Pairs (ingredient pictures, the right one from `pairings`, the wrong ones firmly savoury), Odd one out (shop families in `src/quiz/logic/traits.ts`). Every answer comes from the data; `src/quiz/logic/questions.test.ts` checks it.
- **Scoring:** 100 plus up to 100 for speed (15 s clock), times a combo (x2 from 3 in a row, x3 from 6, x4 from 10), three strawberry hearts, 1 to 3 stars, personal best and the daily on this phone (`localStorage 'fruity.quiz'`). Difficulty follows the streak in Quick play and the position in the daily and Pass the phone.
- **Feedback:** right: the 3D fruit slices open with juice (an inside-out one closes back up and hops), juice drops burst from the tapped answer, the points float up, the result bar slides up in `peak` and moves on by itself; wrong: the card squishes, the fruit wobbles, the bar in `off` shows the answer and a one-line fun fact and waits. Streaks of 3, 5 and 10 slap a sticker with rays. Sounds reuse the cafe's (`src/cafe/sound.ts`), off until switched on.
- **Modes:** Quick play (10), Pass the phone (two named players, 6 each, a hand-over screen in the player's colour before every turn so the clock only starts when they tap), Daily fruit challenge (8, dealt from the date so both phones match, one go a day, a day streak).
- **3D:** one canvas for the whole game (`src/three/QuizStage.tsx`, lazy, preloaded while the menu is up), frameloop demand: it renders while the clock runs and stops once the answer has played. No WebGL: the sticker does the same trick in 2D (black, blurred or zoomed, clearing with the clock).

## App icon

A red apple with a lime leaf on a bright green square (`scripts/build-icons.ts`, `bun run icons`). The home-screen icon is the 180px PNG `public/icons/apple-touch-icon.png`, inlined into the page head as a `data:` URI at build (`vite.config.ts` `inlineTouchIcon`): on iOS 26 a URL-based touch icon gave a letter tile on the theme colour (the Add to Home Screen sheet's own loader failed), and SVG touch icons are ignored for the Home Screen. Manifest icons are PNG, cache-busted `?v=N`. Fixed and confirmed on Nathan's iPhone, 2 Nov 2026. A changed icon needs the home-screen app deleted and re-added.

## Writing

Australian English (colour, favourite, fibre). No em or en dashes: use " - ", commas or colons. Write "Ai", not "AI". Plain, short, warm.
