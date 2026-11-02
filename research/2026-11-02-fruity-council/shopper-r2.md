---
type: report
title: Fruity council - shopper seat, round 2
description: Agent council case from the shopper seat (round 2) on rebuilding the Fruity app.
created: 2026-11-02
---

# Shopper, Round 2

## 1. Concessions

- **Skeptic on foundation:** adopt in full. Images (127 MB, uncached) and a data validator come before any feature. My "region switch" shrinks to the skeptic's version: national default, a "varies by state" badge, and per-state overrides only for the ~7 fruits that differ materially (mango, strawberry, avocado, apple, citrus, grape, lychee). I also drop "best-value cue" as a feature: it is a vibe with no data, so it becomes one tag ("peak, usually cheapest") only.
- **Skeptic on recipes:** 25-30 hand-checked recipes, not 117. I had said 25-40; I now say 30 and stop.
- **Designer:** bottom tab bar (Now / Browse / Cook / Play), "Ending soon" rail, hash router so the back gesture works, calendar demoted inside Browse. I take direction A's palette as essentially mine.
- **Player:** the Passport. "Did we like persimmon?" is a genuine aisle answer, so it earns a place on the shop path. Daily Fruit too (S, seeded by date). Season Wheel replaces the calendar grid.
- **Dropped:** offline "shopping mode" as its own feature (it is the image fix) and storage tips as an item (folded into pick card).

## 2. Rebuttal

Strongest point against me: the skeptic's "Now home is only as true as the data", with strawberry, coconut and stored apples showing the calendar is wrong for a third of entries. A wrong "peak" at the shops is worse than no answer.

Answer: agreed, and it changes the order, not the idea. Ship the validator plus a one-time source check of all fruits before the Now screen goes live; add `yearRound: stored|imported` so apples and coconut stop shouting "peak". Where the app is unsure it says "varies by state", which is honest and still faster than a search box. The skeptic's months are from memory, so the check against Hort Innovation or state market reports is the work, not a footnote.


## 3. Shortlist (all seats)

1. **MUST** Foundation: resize images to WebP (grid ~480px, detail ~960px), precache the grid set, runtime-cache detail, hash router, localStorage persistence, build-time validator, source and `checkedOn` per fruit. Fix the 39 vs 40 count.
2. **MUST** "Now" home: Peak, Just landed, Ending soon, with `yearRound` and "varies by state" badges.
3. **MUST** Pick card per fruit: look/smell/feel, ripe now or ripen at home, storage line. Short, sourced from grower bodies.
4. **MUST** Shopping list: add from fruit or recipe, tick off, localStorage, "copy list" via share sheet.
5. **MUST** 30 recipes with real ingredients and steps, fruit-tagged, "cook this week" rail from peak fruit; "add ingredients to list".
6. **SHOULD** Passport: tried/not, rating each, date, one-line note; JSON/URL-fragment export-import between the two phones. Needs `navigator.storage.persist()`.
7. **SHOULD** Daily Fruit plus Season Wheel (one delight each; wheel replaces the calendar grid).
8. **LATER** Duel quiz with new question types, Build-a-Bowl verdict, origin map, native bush fruit expansion (needs checked seasons first).

## 4. Visual vote

Hybrid: **A "Greengrocer's Chalkboard"** for the shell, C's data discipline (thin 12-segment seasonal bar per row, tabular months), and real photos only on the detail hero. Reason: it reads in a glance under shop lighting, and I will not ship half-finished illustrations: emoji fallback per fruit until its art lands. B is out: 39 consistent renders is a risk and the colour-per-fruit page tint hurts quick scanning.

## 5. Recipes

Small, cookable, seasonal. About 30 original cards (we write them, Ai drafts, Nathan or his partner cooks or at least reads each; `reviewed` flag, no copying). Shape: ingredients with quantities, 4-5 steps, time, serves, fruit ids, a `tried` flag. Old one-liners stay, labelled "ideas". Shopping tie-in: recipe screen has "add to list", and the list groups by fruit-in-season first. Play tie-in: "Cook-it" marks a recipe tried and writes a Passport entry, so cooking feeds the collection. No photos, no external links, nothing offline-breaking.

## 6. Still contested

- Home front door: I hold that "Now" beats the player's Daily Fruit hero; Daily Fruit goes in as one card below the fold.
- Passport on the shop path: I want a "we liked it" dot on Now rows, a small ask the player may want bigger.
- Skeptic's "no region at all" fallback: I still want the state picker for the 7 fruits, not just a badge.

UNCERTAIN: are both phones iPhones, and are they in the same state? It decides share-sheet merge and whether the state picker earns its place.
