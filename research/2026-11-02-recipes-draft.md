---
type: report
title: Fruity recipes draft (33)
description: 33 original recipes for Phase 3 Cook with month coverage and items a cook should check.
created: 2026-11-02
status: draft
---

---
type: draft
title: Fruity Phase 3 recipe drafts
description: 33 original recipes for the Cook tab, with month coverage and the points a cook should check before reviewed is set.
created: 2026-11-02
---

# Fruity recipes: 33 drafts for Phase 3 "Cook"

All written from scratch for this app (common techniques, no copied method text). Data: `/tmp/fruity-recipes.json`. Seasons are the Victorian `seasonality.peak` in `src/assets/fruits.ts` as of today. Every recipe is a draft until a person has cooked or read it and set `reviewed: true`.

## Recipes

| # | Recipe | Main fruit | Type | Peak months of main fruit | Time (prep + cook) | Serves |
|---|---|---|---|---|---|---|
| 1 | Pork cutlets with charred peaches and sage brown butter | Peach | Main | Dec, Jan, Feb | 30 min (10 + 20) | 4 |
| 2 | Prawn, mango and herb noodle salad | Mango | Main | Dec, Jan, Feb | 30 min (25 + 5) | 4 |
| 3 | Watermelon, feta and mint salad with quick-pickled onion | Watermelon | Salad | Dec, Jan, Feb | 20 min (20 + 0) | 4 |
| 4 | Cherry clafoutis | Cherry | Dessert | Dec | 55 min (15 + 40) | 6 |
| 5 | Apricot and almond galette | Apricot | Dessert | Dec, Jan | 75 min (30 + 45) | 8 |
| 6 | Blueberry buttermilk pancakes | Blueberry | Breakfast | Dec, Jan, Feb | 30 min (10 + 20) | 4 |
| 7 | Nectarine, burrata and prosciutto salad | Nectarine | Salad | Dec, Jan, Feb | 15 min (15 + 0) | 4 |
| 8 | Lychee, lime and mint spritz | Lychee | Drink | Dec, Jan | 15 min (15 + 0) | 4 |
| 9 | Crisp five-spice duck with fresh plum sauce | Plum | Main | Jan, Feb, Mar | 50 min (15 + 35) | 4 |
| 10 | Spiced plum jam | Plum | Preserve | Jan, Feb, Mar | 65 min (20 + 45) | 16 portions |
| 11 | Fig, prosciutto and goat's cheese salad with honey-balsamic | Fig | Salad | Feb, Mar | 20 min (15 + 5) | 4 |
| 12 | Roast chicken thighs with grapes and rosemary | Grape | Main | Feb, Mar, Apr | 60 min (15 + 45) | 4 |
| 13 | Pork sausage, apple and fennel traybake | Apple | Main | Mar, Apr, May | 60 min (15 + 45) | 4 |
| 14 | Apple and cinnamon bircher muesli | Apple | Breakfast | Mar, Apr, May | 10 min (10 + 0) | 4 |
| 15 | Pear and ginger upside-down cake | Pear | Dessert | Mar, Apr, May | 80 min (25 + 55) | 8 |
| 16 | Slow-cooked lamb and quince tagine | Quince | Main | Apr, May, Jun | 145 min (25 + 120) | 6 |
| 17 | Quince paste | Quince | Preserve | Apr, May, Jun | 210 min (30 + 180) | 20 portions |
| 18 | Roast pumpkin, pomegranate and feta salad | Pomegranate | Salad | Apr, May | 55 min (20 + 35) | 4 |
| 19 | Feijoa and ginger loaf | Feijoa | Snack | Apr, May | 75 min (20 + 55) | 10 portions |
| 20 | Whole orange and almond cake | Orange | Dessert | Jun, Jul, Aug | 170 min (20 + 150) | 12 |
| 21 | Sticky mandarin and soy chicken | Mandarin | Main | Jun, Jul, Aug | 35 min (15 + 20) | 4 |
| 22 | Lemon delicious pudding | Lemon | Dessert | Jun, Jul, Aug | 65 min (20 + 45) | 6 |
| 23 | Preserved lemons | Lemon | Preserve | Jun, Jul, Aug | 20 min (20 + 0) | 24 portions |
| 24 | Ruby grapefruit, avocado and prawn salad | Grapefruit | Salad | Jun, Jul, Aug | 20 min (20 + 0) | 4 |
| 25 | Kiwifruit, banana and spinach smoothie | Kiwifruit | Drink | May, Jun, Jul | 5 min (5 + 0) | 2 |
| 26 | Passionfruit slice | Passionfruit | Snack | Dec, Jan, Feb, Jun, Jul, Aug | 55 min (20 + 35) | 16 portions |
| 27 | Smashed avocado with lemon, chilli, feta and a jammy egg | Avocado | Breakfast | Jun, Jul, Aug, Sep | 18 min (10 + 8) | 2 |
| 28 | Strawberry and balsamic Eton mess | Strawberry | Dessert | Sep, Oct, Nov, Dec | 20 min (20 + 0) | 6 |
| 29 | Rhubarb, strawberry and ginger crumble | Rhubarb | Dessert | Sep, Oct, Nov | 60 min (20 + 40) | 6 |
| 30 | Papaya, lime and coconut breakfast bowl | Papaya | Breakfast | Mar, Apr, May, Sep, Oct, Nov | 10 min (10 + 0) | 2 |
| 31 | Spiced fish tacos with papaya and lime salsa | Papaya | Main | Mar, Apr, May, Sep, Oct, Nov | 35 min (25 + 10) | 4 |
| 32 | Charred pork and pineapple skewers with chilli-lime glaze | Pineapple | Main | Nov, Dec, Jan | 42 min (30 + 12) | 4 |
| 33 | Brown-sugar banana bread | Banana | Snack | none (year-round, grown) | 75 min (15 + 60) | 10 portions |

Mix: 9 main, 5 salad, 7 dessert, 4 breakfast, 2 drink, 3 preserve, 3 snack. 11 tagged kid-friendly.

## Month-by-month coverage (main fruit at peak)

Rule: at least 3 recipes per month whose main fruit (`fruitIds[0]`) is at Victorian peak.

| Month | Count | Recipes |
|---|---|---|
| Jan | ✅ 11 | Pork cutlets with charred peaches and sage brown butter (Peach); Prawn, mango and herb noodle salad (Mango); Watermelon, feta and mint salad with quick-pickled onion (Watermelon); Apricot and almond galette (Apricot); Blueberry buttermilk pancakes (Blueberry); Nectarine, burrata and prosciutto salad (Nectarine); Lychee, lime and mint spritz (Lychee); Crisp five-spice duck with fresh plum sauce (Plum); Spiced plum jam (Plum); Passionfruit slice (Passionfruit); Charred pork and pineapple skewers with chilli-lime glaze (Pineapple) |
| Feb | ✅ 10 | Pork cutlets with charred peaches and sage brown butter (Peach); Prawn, mango and herb noodle salad (Mango); Watermelon, feta and mint salad with quick-pickled onion (Watermelon); Blueberry buttermilk pancakes (Blueberry); Nectarine, burrata and prosciutto salad (Nectarine); Crisp five-spice duck with fresh plum sauce (Plum); Spiced plum jam (Plum); Fig, prosciutto and goat's cheese salad with honey-balsamic (Fig); Roast chicken thighs with grapes and rosemary (Grape); Passionfruit slice (Passionfruit) |
| Mar | ✅ 9 | Crisp five-spice duck with fresh plum sauce (Plum); Spiced plum jam (Plum); Fig, prosciutto and goat's cheese salad with honey-balsamic (Fig); Roast chicken thighs with grapes and rosemary (Grape); Pork sausage, apple and fennel traybake (Apple); Apple and cinnamon bircher muesli (Apple); Pear and ginger upside-down cake (Pear); Papaya, lime and coconut breakfast bowl (Papaya); Spiced fish tacos with papaya and lime salsa (Papaya) |
| Apr | ✅ 10 | Roast chicken thighs with grapes and rosemary (Grape); Pork sausage, apple and fennel traybake (Apple); Apple and cinnamon bircher muesli (Apple); Pear and ginger upside-down cake (Pear); Slow-cooked lamb and quince tagine (Quince); Quince paste (Quince); Roast pumpkin, pomegranate and feta salad (Pomegranate); Feijoa and ginger loaf (Feijoa); Papaya, lime and coconut breakfast bowl (Papaya); Spiced fish tacos with papaya and lime salsa (Papaya) |
| May | ✅ 10 | Pork sausage, apple and fennel traybake (Apple); Apple and cinnamon bircher muesli (Apple); Pear and ginger upside-down cake (Pear); Slow-cooked lamb and quince tagine (Quince); Quince paste (Quince); Roast pumpkin, pomegranate and feta salad (Pomegranate); Feijoa and ginger loaf (Feijoa); Kiwifruit, banana and spinach smoothie (Kiwifruit); Papaya, lime and coconut breakfast bowl (Papaya); Spiced fish tacos with papaya and lime salsa (Papaya) |
| Jun | ✅ 10 | Slow-cooked lamb and quince tagine (Quince); Quince paste (Quince); Whole orange and almond cake (Orange); Sticky mandarin and soy chicken (Mandarin); Lemon delicious pudding (Lemon); Preserved lemons (Lemon); Ruby grapefruit, avocado and prawn salad (Grapefruit); Kiwifruit, banana and spinach smoothie (Kiwifruit); Passionfruit slice (Passionfruit); Smashed avocado with lemon, chilli, feta and a jammy egg (Avocado) |
| Jul | ✅ 8 | Whole orange and almond cake (Orange); Sticky mandarin and soy chicken (Mandarin); Lemon delicious pudding (Lemon); Preserved lemons (Lemon); Ruby grapefruit, avocado and prawn salad (Grapefruit); Kiwifruit, banana and spinach smoothie (Kiwifruit); Passionfruit slice (Passionfruit); Smashed avocado with lemon, chilli, feta and a jammy egg (Avocado) |
| Aug | ✅ 7 | Whole orange and almond cake (Orange); Sticky mandarin and soy chicken (Mandarin); Lemon delicious pudding (Lemon); Preserved lemons (Lemon); Ruby grapefruit, avocado and prawn salad (Grapefruit); Passionfruit slice (Passionfruit); Smashed avocado with lemon, chilli, feta and a jammy egg (Avocado) |
| Sep | ✅ 5 | Smashed avocado with lemon, chilli, feta and a jammy egg (Avocado); Strawberry and balsamic Eton mess (Strawberry); Rhubarb, strawberry and ginger crumble (Rhubarb); Papaya, lime and coconut breakfast bowl (Papaya); Spiced fish tacos with papaya and lime salsa (Papaya) |
| Oct | ✅ 4 | Strawberry and balsamic Eton mess (Strawberry); Rhubarb, strawberry and ginger crumble (Rhubarb); Papaya, lime and coconut breakfast bowl (Papaya); Spiced fish tacos with papaya and lime salsa (Papaya) |
| Nov | ✅ 5 | Strawberry and balsamic Eton mess (Strawberry); Rhubarb, strawberry and ginger crumble (Rhubarb); Papaya, lime and coconut breakfast bowl (Papaya); Spiced fish tacos with papaya and lime salsa (Papaya); Charred pork and pineapple skewers with chilli-lime glaze (Pineapple) |
| Dec | ✅ 11 | Pork cutlets with charred peaches and sage brown butter (Peach); Prawn, mango and herb noodle salad (Mango); Watermelon, feta and mint salad with quick-pickled onion (Watermelon); Cherry clafoutis (Cherry); Apricot and almond galette (Apricot); Blueberry buttermilk pancakes (Blueberry); Nectarine, burrata and prosciutto salad (Nectarine); Lychee, lime and mint spritz (Lychee); Passionfruit slice (Passionfruit); Strawberry and balsamic Eton mess (Strawberry); Charred pork and pineapple skewers with chilli-lime glaze (Pineapple) |

Months covered: 12/12. Banana bread has no peak month (banana is year-round) and counts in no month.

Thin spot: October has 4, and two of them lean on papaya (Qld fruit, peak in our data Sep to Nov). The only Victorian-grown spring stars are strawberry and rhubarb. If papaya's spring peak is later judged too generous, October drops to 2: a strawberry or rhubarb recipe (strawberry jam, roasted rhubarb with yoghurt and granola) would be the fix.

## Check before marking reviewed

### Food safety ⚠️

- **Spiced plum jam:** sterilising (120°C oven 20 min, lids boiled 10 min), set at about 104°C or the saucer test, 5mm headspace, store unopened up to 6 months, fridge after opening and use within a month. These are conservative home-kitchen instructions, not a tested canning process (no water-bath step). A cook should confirm the 6 months is comfortable or shorten it, and check 1kg sugar to about 1.35kg fruit sets reliably with Victorian blood plums (no added pectin).
- **Preserved lemons:** salt plus lemon juice, cured 3 to 4 weeks in a cool cupboard, then fridge, use within 6 months, discard on fuzzy mould or off smell. Traditional and high-acid, but check whether you'd rather the whole cure happen in the fridge (slower, about 6 weeks). Also check 6 to 8 lemons actually fit a 1 litre jar; with large lemons it is more like 5.
- **Quince paste:** stored in the fridge, about 6 months. The burn warning (it spits near the end) is in the tip. Cook time of 1 1/2 to 2 1/2 hours on top of the 45 to 60 minute poach is realistic but varies a lot with the pot.
- **Pork cutlets:** I wrote "about 65°C in the thickest part, a blush of pink". That matches current Australian pork industry advice as I remember it, but I did not check a source this session; confirm, or change to "cooked through" if you'd rather play safe.
- **Duck:** served medium (pink), which is normal for duck breast. Chicken recipes say 75°C.
- **Rhubarb:** tip says the leaves are poisonous. Correct, worth keeping.

### Quantities a cook should check

- **Passionfruit slice:** the baked condensed milk filling (395g can, 3 yolks, 60ml lemon, 125ml pulp, 15 to 18 min at 160°C) is my own balance, modelled on a key lime filling. Most likely to need a tweak on first bake (set time, or more lemon for tang).
- **Pear and ginger upside-down cake:** 22cm tin, 225g flour, 125g butter, 50 to 55 min. Check it isn't over-full with three pears' worth of fruit under it.
- **Feijoa loaf:** 300g pulp to 250g flour with no milk; feijoa pulp varies in wetness, so the bake time (50 to 60 min) may run long.
- **Apricot galette:** 180g butter to 250g flour is a rich, flaky pastry; fine by hand but it needs to stay cold.
- **Cherry clafoutis:** baked at 180°C for 40 to 45 min in a 24cm dish; some ovens finish it sooner.
- **Orange and almond cake:** 2 oranges about 400g total. Very large navels can make it bitter and wet; weigh them.
- **Lemon delicious:** a 1.5 litre dish; a deeper, narrower dish takes 5 to 10 minutes longer.

### Data and app points

- `serves` on preserves and slices is portions (16 for 4 jars of jam, 20 for quince paste, 24 for preserved lemons, 16 squares, 10 slices). The app may want a `makes` field ("4 x 250ml jars") instead; I put the jar sizes in the ingredients.
- Avocado smash has no `swaps` (avocado is in shops all year).
- Banana bread's main fruit has no peak, so it never shows in "In season"; it is there as the year-round kid staple.
- Lime is a secondary fruit in 6 recipes. Our data has lime peaking Jun to Aug while most of those recipes are summer dishes; harmless for coverage (only `fruitIds[0]` counts), but the "Add fruit to bag" flow will add limes in summer, which is fine since limes are in shops all year.
- Validator checks passed: unique kebab ids, every `fruitId` exists in `fruits.ts`, every listed fruit has an ingredient, 4 to 8 steps each, no Unicode dashes, no US terms from a short banned list.
