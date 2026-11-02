---
type: report
title: Fruity council - shopper seat, round 1
description: Agent council case from the shopper seat (round 1) on rebuilding the Fruity app.
created: 2026-11-02
---

# Fruity rebuild: the Shopper's case (Round 1)

**Thesis:** at the shops Fruity has one job: answer "what should I buy right now, and is this one any good?" in under three seconds, one thumb, patchy signal. Today it answers a calendar question. The home screen leads with a search box, season filter and checkbox (screenshot 1) before any answer; the actual answer, "Just in season", sits below the fold, two cards wide.

## 1. Features, ranked

1. **"Buy now" home (S).** One screen: Peak (buy), Good (fine), Ending soon (last chance), Coming next month. Big tappable rows, no filters. Data already exists: `isPeakSeason`/`isInSeason` (`utils/seasonality.ts:18-24`). Add a derived "ending soon" (last available month) and "arriving". Risk: low.
2. **Pick it: ripeness and how-to-choose card (M).** Per fruit: 3 bullets "look / smell / feel", a "ripe now vs ripen at home" tag, and a "don't buy if" line. This is the feature a grown-up actually lacks in the aisle (is this melon good?). Risk: accuracy, so keep it short and conservative, source from grower bodies.
3. **Recipe-to-list (M).** Recipes become first-class: tap a recipe, its fruit ingredients go on a list, and the home shows "cook this week" recipes built only from peak fruit. Today recipes are 3 one-liners per fruit with no ingredients (`types/fruit.ts:21-25`, name/type/description only) and the home just lists them (screenshot 1, "What to Make This Month"). Needs a real recipe shape: ingredients[], steps[], serves, time. Risk: biggest content load.
4. **Shopping list (S-M).** Add from any fruit or recipe, tick off in the aisle, localStorage, works offline. Pairings become "also grab lime". Risk: low.
5. **Storage and shelf life (S).** "Fridge or bench, lasts N days, freeze it?" One line on the fruit card, shown next to the pick tips. Stops waste, which is the real cost saving.
6. **Region switch (M).** Seasons differ a lot (mango Dec in Darwin vs later in Sydney; Tassie cherries). One picker (Tropical north / NSW-Vic-SA / WA / Tas), stored, shifts month arrays. Risk: data volume, so start with only ~12 fruits that genuinely vary and fall back to national.
7. **Best-value cue (S).** "Peak = cheapest and tastiest" flag plus "glut weeks" for a few fruits. Qualitative only, no prices. Real prices need a backend and rot instantly: do not build.
8. **Offline-proof shopping mode (S).** Verify the aisle works with no signal: `vite.config.ts:38` precaches only `js,css,html,ico,png,svg`, so fruit `.jpg` images (`fruits.ts:10`) are NOT precached and will fail offline. Add jpg/webp or a runtime cache, and shrink them.

## 2. Look and feel pitch: "Market Stall"

- Palette: warm paper off-white `#FBF6EC`, ink `#1F2A1F`, one accent per state: peak = ripe tomato-red `#D9432B`, good = leaf green `#3F7D3A`, ending = amber `#E3A21A`. No loud gradients.
- Type: chunky rounded display (e.g. Fraunces or Bricolage) for fruit names, system sans for body. Min 17px body, 56px rows.
- Home in 5 lines: (1) date + "Spring, 11 in peak" (2) horizontal-snap "Buy now" photo cards, name, one-line pick tip (3) "Ending soon" strip (4) "Cook this week" recipe cards, tap = add to list (5) bottom thumb-bar: Now / Fruit / Recipes / List.
- Motion: only on state change, under 200ms: list tick springs, card press scale, a small ripe-colour fill on the peak badge. No entrance animation on the home glance; the quiz and salad maker can be as playful as they like.
- Bottom nav not top tabs (reachable one-handed).

## 3. Cut or demote

- Cut the 4-way season filter plus checkbox as home chrome (`SeasonFilter.tsx`); fold into search results. The icon-only season buttons in screenshot 1 are unlabelled.
- Demote Calendar (`SeasonCalendar.tsx`) to a "Plan" view inside Fruit; month grids per card (`FruitCard.tsx`, 3x4 grid) are noise at a glance: replace with a single 12-segment bar.
- Demote history/origin/nutrition (`FruitDetail.tsx`) below the fold, keep as "Learn" content.
- Keep Quiz and Salad maker, but off the main shop path (the player advocate may want more; I will concede space, not the home).

## 4. Honest weaknesses

- Ripeness, storage and regional data is hand-curated and unverified at scale; one wrong "pick" tip costs trust faster than any animation earns it.
- Fruit-only is narrow: a shopper also wants vegetables, and recipes drag in non-fruit ingredients (pantry, meat). Scope creep is real; I would cap the list at "fruit + free-text items".
- No prices or stock means "best value" is a vibe, not a fact.
- Two grown-ups: a shared list needs sync, which needs a backend. localStorage means each phone has its own list. A share-as-text button is the cheap workaround, and I admit it is clunky.
- Shop use is maybe 5 minutes a week; I am optimising a short session. The Player seat has a fair claim on retention.
- Region data could be wrong for microclimates; I would label it "typical".

## 5. Data without a backend

- Static typed JSON in repo (extend `fruits.ts`, or split to `data/*.json`), shipped in the bundle, so offline is free. Add fields: `pick`, `ripen`, `storage`, `regions`, and a `recipes.ts` with ingredients.
- Sources: Hort Innovation / Fruit & Veg "Seasonal guide" pages, state grower bodies, Australian Fruit and Veg Federation produce guides, CSIRO. Store `sourceUrl` and `reviewedOn` per fruit.
- Use Ai to draft, a human check each entry once; put a TypeScript schema plus a small script that fails the build on missing fields, bad months, or `reviewedOn` older than 18 months.
- Recipes: write our own (no scraping, copyright). 25-40 recipes, tagged by fruit, enough to cover peak fruit in every month.
- Ship via GitHub Pages as now; the service worker auto-updates content with the app.
