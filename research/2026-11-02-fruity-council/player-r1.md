---
type: report
title: Fruity council - player seat, round 1
description: Agent council case from the player seat (round 1) on rebuilding the Fruity app.
created: 2026-11-02
---

# Fruity council, Round 1: THE PLAYER

Pitch: Fruity should be the app two adults open on the couch with a glass of wine, not only a lookup table. The shops use case is served by a fast, calm front door; everything else is about a reason to come back.

## 1. Features, ranked

1. **Fruit Passport (shared tasting log). M, low risk.** Every fruit is a stamp: tried / not yet, rating for each of you, where and when, one-line note. Empty stamps are the pull ("we've had 17 of 39"). Seasonal stamps ("first mango of the year") reset each year. Why they return: collecting is the oldest hook, and it is useful at the shops ("did we like persimmon?").
2. **Two-player Duel quiz. M, low risk.** Pass-the-phone, same device, best of 7. Question types that are hard for adults: "which month is it peak?" (a month-wheel drag), "which is NOT in season now?", "Australia or imported?", "origin by continent", "which two flavours pair?". Replaces the emoji guess (`FruitQuiz.tsx:134-142` shows a blurred emoji, four options: trivial).
3. **Daily Fruit (one a day, deterministic from the date). S, low risk.** Seeded by date so both phones show the same fruit with no backend. One fact, one "ask each other" prompt, one recipe. Streak counter for the pair. Cheap and the best habit loop.
4. **Cook-It Challenges (recipes as play). M, medium risk (content).** Weekly "in-season pair": cook something from fruit X + pairing Y (pairings already exist in data). Mark cooked, rate, add a photo-free note to the passport. Recipes get real steps (see section 5), with a "swap one ingredient" twist.
5. **Odd-Fruit Hunter. S, low risk.** A "Never tried" shelf that surfaces in-season fruits you have not logged, with a "dare" ("find a quince this weekend"). Gives the shops use case a game layer.
6. **Season Wheel (replaces the calendar grid). M, medium risk.** A 12-month ring you spin; fruits orbit their peak arcs. Learning by touch, and the best animation showcase.
7. **Salad maker becomes "Build a Bowl" with a verdict. M.** Pick 3-5 fruits; the app scores harmony (seasonal overlap, pairings, colour) and suggests a dressing from existing `pairings`. Save to passport as a "bowl", cook it for real.
8. **Origin map. L, medium risk.** Tap-the-world guessing and a "fruit miles" view. Great, but `origin` is free text (`types/fruit.ts` `origin?: string`), so it needs structured data first. Phase 2.

## 2. Look and feel: "Greengrocer's Crate"

- Warm paper background (#FAF3E3), ink text (#2B2A28), one saturated accent per fruit pulled from its colour (peach, plum, lime), used only on that fruit's card and the screen it opens. Drop the loud green header and yellow-green gradient.
- Type: a characterful serif display (Fraunces) for fruit names, a quiet sans (Inter) for body. Big numerals for scores and streaks.
- Home in five lines: (1) greeting plus today's Daily Fruit as a large card with a gentle idle sway; (2) "Peak now" horizontal shelf; (3) passport progress ring for both of you; (4) a Duel button; (5) bottom tab bar: Today, Fruit, Play, Cook, Passport.
- Motion (concrete): card flip to reveal a fruit with a 3D tilt; fruit "drops" into the bowl with squash and bounce, juice ripple on a correct quiz answer; passport stamp thunks down with a slight rotation and haptic-style scale; month wheel spins with inertia and snaps; streak flame grows. Respect `prefers-reduced-motion`. Use CSS transforms and springs only, no heavy library (Motion One or hand-rolled), keeping the bundle small.

## 3. Cut or rework

- **Quiz: rework.** One question type, 5 questions, emoji clue, cluesRevealed capped at 2 (`FruitQuiz.tsx:13,66`). `Math.random() - 0.5` sort (`:25,36-41`) is also a biased shuffle; use Fisher-Yates and a seeded RNG for the Daily.
- **Salad maker: rework, don't keep as is.** 309-line `SaladBowl.tsx` is mostly SVG particles and a random-pitch sound (`:53-61,79`), a toy with no outcome. Keep the fun mixing moment, give it a verdict and a save button. If that is too much, cut it before polishing it.
- **Emoji as primary art:** keep for tiny UI, but the 39 Wikimedia `image` URLs are hot-linked (runtime network, breaks offline). Self-host compressed images.
- **Recipes today:** 3 one-liners per fruit (`fruits.ts:25,48`: name, type, description). Not cookable. Needs the rework in section 5.
- **Calendar grid:** replace by the Season Wheel; tiny month grids are unreadable on a phone.

## 4. My weaknesses, honestly

- Novelty wears off in a few weeks. Only the passport (accumulating history) and the daily seed survive; the quiz alone will not.
- No backend means no live sync: two phones hold two logs. Duels are one-device-only unless we add a share-link flow.
- Games need content volume. 39 fruits is a shallow pool; question variety must come from question types, not more fruit.
- Play features compete with the shops use case for screen space; if the shopper seat wants speed, home must stay fast and quiet.
- iOS PWA storage can be evicted by Safari after inactivity, so local-only passport data is at risk.

## 5. Data and two-phone sharing

- **Content:** keep static TypeScript/JSON, but split into `fruits.json` (facts), `recipes.json` (real recipes with ingredients, steps, time, serves, fruit ids) and `questions.json`. Author recipes with Ai drafting in batches, Nathan reviews and signs off each; add a `reviewed: true` and `source` field. Seasonality verified against one named source (e.g. Australian Fruit & Veg guides) and a "last verified" date per fruit.
- **Accuracy without a backend:** a build-time validator (months valid, ids unique, every recipe fruit exists, images present) in CI. Seasonality varies by state; add an optional `region` override rather than guessing.
- **Two-phone sharing, yes on a static site:** (a) export/import passport as a small JSON file or a compressed string in a URL fragment (`#p=...`), share via iOS share sheet; merge by fruit id with last-write-wins per entry timestamp; (b) a QR code of the same payload for in-person merge; (c) optional later: a free GitHub Gist or Cloudflare KV, but that is a backend by another name. I recommend (a)+(b): honest, zero infra, and the couple lives together anyway. Persist with IndexedDB and `navigator.storage.persist()` to reduce eviction risk.

UNCERTAIN: do Nathan and his partner both use iPhones (share sheet and Safari storage behaviour decide the merge design)?
