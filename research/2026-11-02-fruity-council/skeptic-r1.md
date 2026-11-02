---
type: report
title: Fruity council - skeptic seat, round 1
description: Agent council case from the skeptic seat (round 1) on rebuilding the Fruity app.
created: 2026-11-02
---

# Skeptic, Round 1: the Fruity rebuild that is still right in a year

Stance: Nathan chose rebuild plus big features. I argue for the version that stays correct and loved. Build effort is cheap; attention, data upkeep and trust are not.

## 1. Data accuracy

One national calendar of 39 fruits (`src/assets/fruits.ts`, `peak` + `available` arrays, `src/types/fruit.ts:6-9`). All month claims below are from my memory, not a fetched source: leads to verify, not facts.

- **39 vs 40 is real.** `grep -c "^    id:"` gives 39; CLAUDE.md says 40. Nothing validates the dataset.
- **Banana** is peak Sep-Mar and available the other five months; **coconut** is peak all 12 months with `available: []`. Both make "in season now" meaningless. Coconut is not a seasonal Australian fruit at all.
- **Apple and pear** peak Mar-May, available only Feb and Jun. Cold-stored apples are at the shops all year, and the model has no "stored/imported" concept.
- **Strawberry** peak Sep-Nov: QLD peaks about Jun-Oct, VIC/TAS about Nov-Mar. A Tasmanian shopper in January is told it is out of season.
- **Avocado** peak Jun-Sep: Hass runs roughly Jun-Dec, QLD Shepard Jan-Apr. **Grape** available only Feb before the Mar-May peak: table grapes start about Dec. **Mango** is right for QLD, early (Sep-Oct) in the NT.
- **Citrus** is lumped Jun-Aug (orange, mandarin, grapefruit, lime, lemon). Variety is the bigger error: navels run to Oct, Valencias Sep-Jan, lemons nearly year-round, limes mainly autumn.
- Plausible, no error found: cherry, custard apple, tangelo, feijoa, persimmon, quince.

**Is one national calendar honest?** Not for roughly a third of entries; QLD vs TAS can differ 3-4 months. Minimum honest model: keep national `peak/available` as default, add an optional per-state override only where it differs materially (mango, strawberry, avocado, apple, citrus, grape, lychee), a `yearRound: 'stored' | 'imported'` flag, and `source` + `checkedOn` per fruit. One manual "home state" setting, no geolocation. Cheapest step: a visible "varies by state" badge.

**Missing staples:** no finger lime, quandong, Davidson plum, lilly pilly, loquat, nashi, cumquat, tamarillo, jackfruit, blood orange, medjool dates, blackberry, boysenberry. The bigger gap is no native bush fruit at all, the most Australian differentiator. Adding 15-20 is cheap; getting their seasons right is not.

## 2. Recipes

Today: three one-liners per fruit (`fruits.ts:25-29`), shown by `RecipeSuggestions.tsx` with a biased, mutating shuffle `.sort(() => Math.random() - 0.5)`.

- Full recipes for 39 fruits (about 117) is the trap: Ai drafts look right and are unchecked; a wrong ratio in a preserve costs trust.
- Copyright: ingredient lists are free, method text and photos are not. Write originals, never copy a site.
- Linking out breaks offline and rots within a year. Recipe photos reopen the image-weight problem.

**Smallest genuinely good feature:** about 25-30 hand-picked recipes in total (not per fruit), each a short card: quantities, 4-5 steps, time, serves, fruit tags, `tried: true` once Nathan has cooked it. No recipe photos; reuse the fruit image. The payoff is "what can I make with what is in season now". Keep the old one-liners as clearly labelled ideas.

## 3. Scope traps (static GitHub Pages, iOS PWA)

Traps:
- **Accounts/sync between two phones:** needs a backend, auth and a bill. A share link with state in the URL hash, or a "copy list" button, is free and enough for two people.
- **Prices and store stock:** no public Woolworths/Coles API; scraping breaks ToS and rots weekly.
- **Push notifications:** iOS 16.4+ installed PWAs only, and sending needs a server. Use a "new this month" badge on open instead.
- **Background sync, haptics:** unsupported on iOS.
- **Runtime Ai content:** needs a key and backend; a key in a static bundle leaks. Build-time with human review is fine.
- **Heavy 3D/animation libraries:** precache bloat and iOS memory kills. The salad maker (`useSalad.ts`) is already the animation ceiling.

Fine: localStorage favourites and shopping list (offer export; iOS can purge SW caches under storage pressure), hash routing, Web Share API, offline, CSS animation and View Transitions, a manual state picker.

## 4. Code health

- **Image weight is the emergency.** `public/images/fruits` is 127 MB for 39 files (`strawberry.jpg` 24 MB, `grapefruit.jpg` and `orange.jpg` 16 MB each); the git pack is 125 MiB. Pages serves them from `FruitDetail.tsx:103`, and Workbox `globPatterns` (`vite.config.ts:38`) omits jpg, so they are not offline. Resize to about 800 px WebP at build; roughly 127 MB becomes about 2 MB.
- **State:** all `useState` in `App.tsx:20-24`, no routing, so no deep links or back button in standalone mode. Add a tiny hash router and localStorage persistence.
- **Data shape:** 974-line TS literal mixing season facts, trivia and unsourced nutrition. Split into data + content and add a validation script (valid months, unique ids, image exists, count matches). That makes the 39/40 slip impossible.
- **Tests:** none. Add Vitest for the seasonality utils and the validator.
- **PWA update:** `pwa-update.ts` is good, keep it. Manifest icons are SVG with `purpose: any maskable` (`vite.config.ts:20-30`); iOS wants a PNG `apple-touch-icon`, verify. `package.json` name is `fruity-temp`.

**Refactor, not rewrite.** The 12 small components and utils are fine; keep the data and `pwa-update.ts`, replace the shell (routing, state, layout, visuals). A greenfield rewrite discards 974 lines of data for nothing.

## 5. If we only shipped three things

(1) Fix the foundation: compress images, add the validator with the state/year-round model, and check every fruit's months against a cited source. (2) A shop-first "Now" home screen: peak, just starting, ending in my state, with a local shopping list shareable by link. (3) Thirty hand-checked recipes filtered by what is in season; keep the quiz as the one game. Nothing with a backend.

## 6. Where I might be wrong

- Every month correction is from memory; check Hort Innovation or state market reports before trusting any of them. The structural point (national calendar oversimplifies, stored fruit distorts "in season") stands regardless.
- Two adults in one state may not need states at all; a "varies" badge may be enough.
- Recipes may be the real reason to open the app, in which case 30 is too few; let usage drive quantity.
- A shareable shopping list may be more than two people need; "copy list" might do.
