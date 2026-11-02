---
type: plan
title: Fruity rebuild - council consensus and build plan
description: What a 4-seat agent council (shopper, player, designer, skeptic) agreed Fruity should become, and the phased plan to build it.
created: 2026-11-02
status: approved
---

# Fruity rebuild

Council transcripts (2 rounds, 4 seats): [research/2026-11-02-fruity-council/](../research/2026-11-02-fruity-council/).

## Brief (Nathan, 2 Nov 2026)

- For: "Us, as grown-ups". Used: "At the shops" and "Playing / learning". Look: "Let the team pitch". Scope: "Rebuild + big new features". Plus: "We're also thinking of adding recipes as well".

## The one-line answer

Fruity becomes a calm, warm, shop-first app that answers "what should we buy right now?" in three seconds, with real recipes that fill a shopping bag, and a shared tasting log that gives the two of you a reason to open it on the couch.

## Consensus (all four seats agreed by Round 2)

| Topic | Decision |
|---|---|
| Home | "Now" screen: Buy now (peak), Just landed, Ending soon. No search box or filters above the answer. Daily Fruit is one strip below. |
| Navigation | Bottom tab bar, 4 tabs: Now / Fruit / Cook / Play. Hash router so the iPhone back swipe works. |
| Look | "Greengrocer's Chalkboard": warm paper `#F6F0E4`, ink `#1F2A1C`, tomato `#D8452E` (peak), leaf `#3F7D4E` (good), mango `#F2A93B` (ending). Fraunces for fruit names, Inter Tight for body. Loud green header and yellow gradient go. |
| Fruit art | The existing photos, normalised by one script onto a shared warm tile (same crop, shadow, background), WebP 480 px grid and 960 px detail. Emoji stays only as a fallback. Hand-drawn illustration is LATER. |
| Motion | Only where it means something: card-to-detail lift (View Transitions), season bar filling, list ticks, a passport stamp. No entrance animation on Now. CSS first, no animation library in v1. Respects reduced motion. |
| Recipes | About 30 original recipes (not 117): quantities, 4-5 steps, time, serves, fruit tags. Ai drafts, a human checks each before `reviewed: true`. No copied method text, no recipe photos. Old one-liners stay as "ideas". |
| Shopping | A bag button on every screen (count badge) opening a list sheet. Add from a fruit or a recipe, tick off in the aisle, share as text. Offline. |
| Data truth | Seasonality checked against two named sources per fruit before the Now screen ships. `yearRound` flag (banana, coconut, cold-stored apple and pear stop shouting "peak"). "Varies by state" badge on about 10 fruits. Build fails on bad data. |
| Foundation | Refactor, not rewrite. Photos 127 MB down to about 5 MB and cached offline (today they are not: `vite.config.ts:38`). |
| No backend | Everything stays on GitHub Pages. No accounts, prices, push notifications or runtime Ai. |

## Calls I made where the seats still differed

- **Shopping list is a bag button, not a tab** (designer over shopper): one tap from every screen beats a fourth tab.
- **Passport ships in v1, in Phase 4** (player wanted MUST, others SHOULD): it is the one feature that grows over time, and it answers a shop question ("did we like persimmon?").
- **No state picker**: you're both in Victoria (`Q1`), so the months are Victorian (Melbourne Market as the lead source), with a "varies by state" badge where other states differ a lot.
- **Season Wheel waits** until the data is verified (skeptic): a pretty wrong answer is worse than a plain right one.
- **Duel quiz is a stretch goal** at the end of Phase 4, not a core item.

## Phases

### Phase 0: Foundation

- Image script: normalise the 39 photos, test on 6 first and show a contact sheet; replace the odd ones (quince is a botanical print, strawberry is 8256 px).
- Workbox: precache the grid images, runtime-cache the detail images.
- Hash router (Now / Fruit / Fruit detail / Cook / recipe / Play) and state persisted in localStorage.
- Split `fruits.ts` into data + content; a validator (valid months, unique ids, image exists, count) and Vitest for the seasonality utils.
- Housekeeping: `package.json` name, PNG apple-touch-icon, fix the 39 vs 40 count in CLAUDE.md.
- Done when: build passes the validator, the app works in airplane mode with images, total images under 6 MB.

### Phase 1: Data truth

- For each fruit, two sources, Victorian months first (candidates, all to be checked: Melbourne Market seasonal guide, Hort Innovation seasonal guides, Sydney / Brisbane market guides, industry bodies such as Australian Mangoes and Apple and Pear Australia). Record `sources[]` and `checkedOn`.
- Add `yearRound: 'stored' | 'imported'`, the "varies by state" flag, and a one-line pick tip and storage line per fruit.
- Output: one diff table (old months vs new, with source) for Nathan to approve in one go.
- Done when: Nathan has approved the table and the validator fails on any unsourced fruit.

### Phase 2: New shell and look

- Fruit art (`D3`, Nathan 2 Nov: generate one matching set with Ai, test 6 first): about 40 generated studio shots on the warm paper tile, one style. The same images, cropped round, replace the emoji as the fruit icons on cards, rows and the bag (Nathan: "some don't have an emoji"; dragon fruit is a pink heart, starfruit a star). Emoji only as a fallback while an image loads.
- Design tokens, self-hosted fonts, bottom tab bar with safe areas.
- Now home, Fruit browse (search, filter chips, a 12-segment season bar per row instead of the 3x4 month grid), fruit detail with a shared-element transition.
- Bag button and list sheet.
- Calendar becomes a "Year" view inside Fruit.
- Done when: checked at iPhone width in a real browser, reduced-motion on and off, the home answers with no scrolling.

### Phase 3: Cook

- `recipes.ts` with about 30 recipes covering peak fruit in every month; Ai-drafted, each reviewed.
- Cook tab (In season / All / Saved), recipe screen with an ingredient checklist, "Add fruit to bag", "I cooked it", and cook mode (screen stays awake, one step at a time).
- "Cook this week" rail on Now.
- Done when: every month has at least 3 recipes using its peak fruit, all marked reviewed.

### Phase 4: Play

- Fruit Passport: tried, a rating from each of you, date, note; stamps on cards; collection view in Play. Stored in IndexedDB with `navigator.storage.persist()`.
- Daily Fruit, picked from the date so both phones show the same one.
- Quiz rework: "which month is it at peak?", "which is NOT in season now?", proper shuffle.
- Salad maker becomes a real fruit salad (`D2`): the bowl you build turns into a recipe with a dressing drawn from the fruits' pairings, an in-season check that offers swaps ("swap the cherries for mango"), one tap to add it all to the bag, shake to toss (one "allow motion" tap on iPhone, button fallback), a picture card to share, and each fruit stamped in the passport. No made-up "harmony score".
- Stretch: pass-the-phone Duel.
- Done when: a passport entry survives a reload and an app update.

### Later (not in this rebuild)

Season Wheel, per-state month overrides, native bush fruits (finger lime, quandong, Davidson plum and more), illustrated art set, origin map, passport export and QR sharing between phones, salad harmony score.

## How it gets built

Each phase goes to a worker agent in its own git worktree with a written target, then a separate checker drives the app at phone width before I commit. One phase at a time; you see each phase on your phone (GitHub Pages) before the next starts.

## Decisions (Nathan, 2 Nov 2026: "Yes to all")

- `D1`: plan approved, Phase 0 started.
- `Q1`: both in Victoria, one state, no picker.
- `Q2`: both iPhones. Passport import is paste or QR inside the installed app (an iPhone home-screen app can't see Safari's storage). View Transitions need iOS 18+, with a fade fallback.
- `D2`: salad maker upgrade is in Phase 4.
- `D3`: fruit art is a generated matching set, which also replaces the emoji icons.
