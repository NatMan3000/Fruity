---
type: report
title: Fruity state overrides research
description: Where each Australian state's fruit shop season differs from Victoria, with sources; 3 shipped, 2 low-confidence dropped.
created: 2026-11-02
---

# Fruity state overrides (research, 2 Nov 2026)

5 overrides across 5 states (NT, QLD, TAS, NSW, WA). Confidence: 1 high, 2 medium, 2 low. Everything else: no override (Victorian default applies). ACT inherits NSW (no ACT-specific source found). SA: nothing found.

Honest headline: sources are thin. Market reports and grower pages are mostly news items, not month tables, so I only kept pairs with a quoted source and a shift of about a month or more.

## Overrides

- NT: mangoes peak Oct-Nov, available Sep and Dec (Vic: peak Dec-Feb). Medium: FreshPlaza reports Darwin peaking late Oct to early Dec, underway by mid Sep.
- QLD: strawberries peak Jul-Oct, available May-Jun and Nov (Vic: peak Sep-Dec). Medium: QLD winter season May-Oct, height Jul-Sep per a travel article.
- TAS: cherries peak Jan, available Dec and Feb (Vic: peak Dec). High: Fruit Growers Tasmania says peak is January.
- NSW (and ACT): blueberries peak Oct-Dec, available Aug-Sep and Jan-Feb (Vic: peak Dec-Feb). Low: Sydney Markets reports only mention an October North Coast flush and August arrivals.
- WA: avocados peak Oct-Jan, available Sep and Feb-Mar (Vic: peak Jun-Sep). Low: WA Hass harvest runs roughly Sep-Mar (exporter and industry profile, search summaries only), but I could not confirm what Perth shops sell in winter.

## Low-confidence items

- NSW blueberries and WA avocados (above). Check before shipping, or drop them.
- QLD strawberries "available" months are conservative; a Stanthorpe summer crop also runs through new year.

## Checked, no override (shift under about a month, or no source)

- TAS raspberries (Nov-May) and blueberries (Dec-Mar/May): match the Vic default; Tas just adds local supply.
- QLD mangoes: Burdekin main harvest mid-Nov, Mareeba peak late Dec-Jan: close to Vic default.
- QLD lychees: season late Oct to Mar (NSW north) vs Vic Nov-Feb: under a month at the edges.
- WA strawberries: northern Perth winter crop May-Dec peaking from Aug (Woolworths via search): close to Vic Sep-Dec.
- WA stone fruit (Nov to early May, local grower blog): general range only.
- NSW cherries, grapes, figs, plums, citrus (Sydney Markets reports): match Vic.

## Could not source

Whole-state tables for SA, WA, NT and ACT. Citrus, apples, pears, grapes, pineapple, papaya, banana, dragon fruit, custard apple, passionfruit, rockmelon, watermelon, persimmon and the rest by state: no state-specific evidence found. The Tasmanian seasonal produce guide PDF is a graphic calendar that would not extract as text. Brisbane Markets' fruit guide is a 2011 flipbook. Perth Market and Adelaide Produce Market had no month-by-month guide in search results. Several fetches 404'd or 403'd (Moreton Bay page, Woolworths, pickyourown WA), so a few "says" lines come from search summaries and are marked so in the JSON.

## Shipped

NT mango, QLD strawberry and TAS cherry went into `stateOverrides` in src/assets/fruits.ts. NSW blueberry and WA avocado were dropped: one source each, low confidence.
