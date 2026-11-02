---
type: report
title: Fruity council - skeptic seat, round 2
description: Agent council case from the skeptic seat (round 2) on rebuilding the Fruity app.
created: 2026-11-02
---

# Skeptic, Round 2

Assumption: both partners use iPhones (unconfirmed).

## 1. Concessions

- Shopper's "Buy now" home and bottom tab bar: accepted, cheapest and most-used.
- Player's Passport: accepted, and it beats my "shopping list" as the sharing feature. Local log plus export string is honest and cheap.
- Daily Fruit seeded by date: accepted, no backend, same fruit on both phones.
- Shopper's pick/ripeness tips and storage line: accepted, but only as 1-2 conservative lines per fruit, each with a source.
- I shrink "state picker" to a v1 "varies by state" badge on about 10 fruits, full overrides later.

## 2. Challenges

1. **Designer: 39 bespoke illustrations (Direction A, nano-banana).** Style drift across 39 generations, half-done looks worse than emoji. Smallest safe change: use the existing photos, processed to 480 px WebP, as the only grid art in v1; illustration is LATER, one fruit at a time, emoji fallback.
2. **Player: the "harmony score" in Build a Bowl and the Duel quiz question types.** Harmony scores invent authority from unverified `pairings`. Smallest change: no score; show the pairings as "goes well with" and keep the quiz to month-peak and not-in-season questions that the validated data can answer.
3. **Designer/Player: shake-to-toss, haptics, `navigator.vibrate`, "Landing day" bloom.** Vibration API does not exist on iOS Safari; shake needs a DeviceMotion permission prompt from a user gesture. Smallest change: button only, no haptics, drop the bloom (or a plain badge) in v1. Also the Player's "hot-linked Wikimedia images" is wrong: images are local files (`FruitDetail.tsx:103` uses `BASE_URL`), the problem is weight (127 MB), not hot-linking.

## 3. Shortlist

1. MUST: image diet (480/960 px WebP, ~5 MB total), precache grid, runtime-cache detail.
2. MUST: data validator plus tests, fix banana/coconut/apple/pear, stored-vs-fresh flag, source and `checkedOn` per fruit.
3. MUST: "Now" home (Peak / Just landed / Ending soon) with bottom tab bar and hash routing.
4. MUST: shopping list, localStorage, "copy list" share, export.
5. SHOULD: 25-30 hand-written, hand-checked recipes with ingredients and steps, filter by in-season.
6. SHOULD: Passport (tried, rating each, note) with export/import string; Daily Fruit.
7. SHOULD: "varies by state" badge on about 10 fruits; pick tip and storage line.
8. LATER: Season Wheel, Duel quiz, native bush fruits, illustrations, origin map, per-state overrides, Build a Bowl verdict.

## 4. Visual vote

Hybrid: C's photos as art, A's paper palette and Fraunces/Inter type, no B. Zero new art, about 5 MB offline, upkeep near nil (a new fruit is one photo). A's illustrations carry real ongoing cost; B needs 39 consistent Ai renders; no.

## 5. Recipes

Smallest good version: 25-30 original recipes, ~6 lines each (quantities, 4-5 steps, time, serves, fruit ids, `tried`). Ai drafts, Nathan cooks or checks each before `reviewed: true`. Bundled in the app, so offline. No copied method text or photos (ingredient lists are free, expression is not). Old one-liners stay as "ideas". Reuse the fruit photo.

## 6. Data plan (every name below needs checking)

- Candidate sources: Hort Innovation and its Fruit and Veg "seasonal guide" material; Melbourne Market, Sydney Markets and Brisbane Markets seasonal produce guides; state grower bodies (Queensland, Tasmanian cherry, avocado and citrus industry bodies); Australian Mango Industry Association; Apple and Pear Australia; Seasonal Food Guide Australia as a cross-check. I have not verified any URL or figure.
- Process: pull two independent sources per fruit, record both in `sources[]` with `checkedOn`; where they disagree, take the wider "available" and the narrower "peak". One reviewer (Nathan) approves the diff table, not each fruit.
- Validator fails the build on unknown months, duplicate ids, missing image, stale `checkedOn` (over 18 months), and count mismatch with a generated total (kills "40 vs 39").
- Per-state: v1 only the badge. Override table added for fruits where sources show 2+ months of divergence.

## 7. Still contested

- Passport sync by URL-fragment merge: last-write-wins per entry is fine, but any "live" two-phone sync is a backend; I will fight that.
- Fruit-only scope: do not let recipes pull in a full grocery list (vegetables, pantry).
- Replacing the calendar with a Season Wheel before the data is validated: a pretty wrong answer is worse than a plain right one.
