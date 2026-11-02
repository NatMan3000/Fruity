---
type: report
title: Fruity council - player seat, round 2
description: Agent council case from the player seat (round 2) on rebuilding the Fruity app.
created: 2026-11-02
---

# Player, Round 2

## 1. Concessions

- **Foundation first.** The skeptic and designer are right: 127 MB of photos not in the offline cache (`vite.config.ts:38`) makes any "delight" claim empty. Image pipeline plus data validator is step zero, before a single animation.
- **Shopper owns the front door.** Home is "Now": Peak / Ending soon / Arriving, bottom tab bar, no filter chrome. I drop my "greeting plus Daily Fruit as the big home card". Daily Fruit shrinks to one strip below the shopper rails.
- **Adopt:** shopping list (add from fruit or recipe), "pick it" tips, skeptic's `checkedOn`/`source` fields and "varies by state" badge, hash router, refactor not rewrite.
- **Drop:** the Origin map (free-text `origin`, L effort, LATER). Shrink the Season Wheel to a Browse view (designer's month scrub), not its own screen.
- **Shrink the salad maker.** If it cannot get a verdict and a save button cheaply, keep the existing bowl as a toy under Play and stop investing. Designer's shake-to-toss is a nice-to-have.
- **Cook-It Challenges** shrink to a "tried" tick on recipes plus a weekly pick; no challenge engine.

## 2. Rebuttal

Strongest attack (skeptic, shopper): shops use is the real job, play is secondary, and novelty fades; with no backend a shared game or log is half-broken. Answer: agreed on order, wrong on conclusion. The app earns its home-screen slot at the shops, but a 5-minute-a-week tool gets deleted or forgotten. What survives is accumulation: a passport is a history two people have built, which no lookup table has. It also feeds the shopper job ("did we like persimmon?"), so it is a shop feature in a play costume. On sync: they live together, so merge-by-share-string (below) is honest enough. I concede the quiz alone will not retain; it ships as one game, not a games hub.

## 3. Shortlist (final, all seats)

1. **Foundation: images to WebP (about 2 MB total), precache, validator with `source`/`checkedOn`, hash router, localStorage.** MUST
2. **"Now" home with Peak / Ending soon / Arriving and bottom tabs.** MUST
3. **Fruit Passport (tried, ratings for each of us, note, date; progress ring).** MUST
4. **Real recipes, about 30, with ingredients and steps, "cook this week" from peak fruit.** MUST
5. **Shopping list with add-from-recipe, copy/share as text.** MUST
6. **Pick-it / storage tips per fruit (3 bullets, sourced).** SHOULD
7. **Better quiz: 4-5 question types (peak month, NOT in season, origin continent, pairing), Fisher-Yates shuffle, two-player pass-the-phone Duel, Daily Fruit seeded by date.** SHOULD
8. **Passport/list export-import via share string and QR; region badge or state picker; origin map; salad verdict.** LATER

## 4. Visual vote

Hybrid: **A "Greengrocer's Chalkboard" as the system, with C's restraint on data screens.** Warm paper, Fraunces, bottom tabs. Photos (resized) as detail hero. Illustrated art for the grid only if Nathan wants the production job; ship real photos at 480px first and treat illustration as LATER, since a half-finished art set looks worse than good photos. B's one hero moment: the passport stamp thunk.

## 5. Recipes

About 30 original, short recipes: quantities, 4-5 steps, time, serves, fruit ids, `tried` flag per person. Nathan reviews each once (Ai drafts, human signs off, `reviewed` field, no copying sites). No recipe photos; reuse the fruit image. Shopping tie-in: "add ingredients" puts the fruit on the list. Play tie-in: cooking a recipe stamps the fruit in the passport, and "cook this week" picks use peak fruit. Old one-liners stay as labelled "ideas" below. Skeptic is right that 117 full recipes is a trap; I take 30 and let usage grow it.

## 6. Still contested

- Skeptic would keep one game; I want a Duel (two players is the one thing that makes quiz worth opening for a couple).
- Passport is MUST for me; shopper/skeptic may rank it below the list. I'd cut Pick-it before the passport.
- Hash-payload sharing: on iPhones (assumed, unconfirmed), the home-screen PWA has separate storage from Safari, so a link opened in Safari will not see PWA data; the import must be paste/QR inside the installed app.
- Whether Ai-drafted facts (pick tips, recipes) are checked enough: skeptic's month corrections are from memory too, so seasonality needs a named source before anyone trusts either version.
