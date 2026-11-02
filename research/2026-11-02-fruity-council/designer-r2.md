---
type: report
title: Fruity council - designer seat, round 2
description: Agent council case from the designer seat (round 2) on rebuilding the Fruity app.
created: 2026-11-02
---

# Designer, Round 2

I looked at three of the photos (dragon fruit, quince, strawberry). They are three different worlds: a white-background cutout, a 19th-century botanical print, and a grey-gradient studio shot (strawberry is 8256x5504 px). They cannot be the grid's visual language as they stand.

## 1. Concessions
- **Shopper wins the home.** "Now" is Buy now / Ending soon / Arriving, no search box, no filters above the answer. My "hero fruit plus rails" becomes their three-state list with big rows. Peak is the hero only as a single top row.
- **Skeptic wins the foundation.** Image diet, data validator, hash router, `source` + `checkedOn` per fruit, "varies by state" badge, refactor not rewrite. These ship before any pretty.
- **Player wins the reason to return**, in a smaller form: Daily Fruit and the Passport. Duel, Origin map and Season Wheel as a full game drop to LATER.
- **I drop my illustrated-SVG-for-everything plan.** 50 consistent illustrations is the job most likely to be half-finished, and a half-done set looks worse than emoji. Skeptic's point on scope, and I take it.
- **Tab bar: 4 tabs still hold, with one change.** Now / Fruit / Cook / Play. The shopping list is not a tab: it is a persistent bag button (count badge) top right on Now, Fruit and Cook, opening a bottom sheet. The Passport is not a tab either: its ticks and ratings live on each fruit (stamp on the card and detail, "we liked it, 4 and 5"), with the collection view inside Play. That keeps the shopper's list one tap from anywhere and the player's log where the shopper needs it ("did we like persimmon?"). Player's 5-tab bar is one too many for thumb reach.

## 2. Rebuttal
Strongest attack: Skeptic and Shopper both say a designer's 'delight' budget competes with correctness, and that shop use is five minutes a week, so polish is wasted. My answer: the five minutes is the one the app is judged on, and speed IS a design outcome. The home must answer in under 3 seconds with no entrance animation (Shopper's rule, I accept it). Motion is spent where it carries meaning: state change, the card-to-detail transition, a tick on the list. Delight lives in Play and the Passport, where time is unhurried. Data clarity (the 12-segment bar, honest "ending soon") is design too.

## 3. Shortlist (ranked, all seats)
1. **MUST** Foundation: resize images to WebP, hash router, validator, `checkedOn`, precache/runtime-cache images.
2. **MUST** "Now" home: Buy now, Ending soon, Arriving (derived from existing `isPeakSeason`), bottom tab bar.
3. **MUST** Fruit grid and detail redesign: one art language, 12-segment season bar replacing the 3x4 grid, shared-element transition.
4. **MUST** Shopping list (localStorage, offline, "copy list" to share).
5. **MUST** Recipes: about 30 hand-checked, real shape (ingredients, steps, time, serves), filtered by in-season fruit.
6. **SHOULD** Passport: tried/rating per person on each fruit, plus Daily Fruit (date-seeded).
7. **SHOULD** Quiz rework: month-picker and "which is NOT in season", Fisher-Yates shuffle; salad maker gets a Save button, no new engine.
8. **LATER** Pick-it ripeness tips, region picker, Passport export, Duel, Season Wheel, Origin map.

## 4. Visual: "Greengrocer's Chalkboard", photo-first
- Type: Fraunces + Inter Tight, 17px body. Motion: CSS and View Transitions, no library in v1.
- Palette unchanged: paper `#F6F0E4`, ink `#1F2A1C`, tomato `#D8452E` (peak), leaf `#3F7D4E` (good), mango `#F2A93B` (ending). Status is colour plus word plus icon.
- **Art: photos, normalised, not illustrated.** One build script: crop each to 4:3, cut out or flatten onto a shared warm `#EFE6D2` tile with a soft contact shadow, export WebP at 480 px (grid, ~20kb) and 960 px (detail, ~70kb). Quince's botanical print gets replaced. Emoji stays as the instant placeholder and the fallback.
- **Cost for about 50 fruits:** the 39 existing: the script is about an hour, then I review a contact sheet and expect 8-10 that need a redo. About 11 new fruits (the native bush fruits Skeptic wants): source CC0/CC-BY from Wikimedia Commons with attribution, or generate in one fixed studio prompt and cut out. Roughly a day of review, not a week of drawing. Result: about 5MB total versus 127MB. Background removal quality is the risk; I would test on 6 fruits first.

## 5. Recipes
- Lives under **Cook**, with a segment: "In season" (default) / All / Saved. Also reachable from a fruit's detail and from the Now home ("Cook this week", 3 cards).
- Recipe screen: top, a fruit image tile with the in-season status; then time and serves as two plain figures; ingredients as a checklist where fruit items carry an "add to bag" tap (Shopper's recipe-to-list); steps below as large numbered rows. A sticky bottom bar: "Add fruit to bag" and "I cooked it" (feeds the Passport).
- Motion: card opens by shared-element lift, ingredients tick with a 150ms fill, "I cooked it" drops a stamp once. Everything else still. Cook mode keeps the screen awake (WakeLock) and shows steps one at a time.

## 6. Still contested
- Four tabs vs Shopper's four-with-List: I put the list in a bag button, not a tab.
- Photo-first art vs a fully illustrated set: I will fight for a normalised look, not mixed sources.
- Daily Fruit and Passport at v1 vs Skeptic's three-things-only: I think the Passport is what makes the second phone care.
- UNCERTAIN: are both phones iPhones? It decides View Transitions (iOS 18+) and WakeLock behaviour.
