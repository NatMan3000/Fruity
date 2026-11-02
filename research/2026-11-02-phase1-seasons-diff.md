---
type: report
title: Fruity Phase 1 - proposed Victorian seasonality
description: Old vs proposed peak and available months for all 39 fruits, with sources and confidence, for Nathan to approve.
created: 2026-11-02
status: draft
---

# Fruity Phase 1: proposed Victorian seasonality

Researched 2 Nov 2026. Months are what you see at Melbourne shops (interstate fruit counts), not what Victoria grows.

- **31 of 39 changed** (months or a year-round flag); 8 unchanged.
- **6 low-confidence** (old months kept unless a source clearly contradicted them): lime, avocado, tangelo, rhubarb, mulberry, starfruit.
- **Could not source properly:** rhubarb (sources contradict each other), starfruit and tangelo (almost no Australian market data), lime and avocado (sources conflict on peak), mulberry (rarely in shops, only pick-your-own evidence). Dragon fruit, feijoa, quince and raspberry have no Melbourne Market report naming them, so they rest on industry and press sources only.
- **Source quality, be aware:** the main Melbourne evidence is the weekly Melbourne Market reports on FreshPlaza (12 reports read in full, 2025-2026). Several industry sources (Citrus Australia, Avocados Australia, Summerfruit Australia, Apple and Pear Australia, Hort Innovation) blocked or would not load, so their numbers came from search summaries and are marked "via search summary" in the JSON. Sydney Markets pages would not load (expired certificate), so those lines are also summary-level. The Environment Victoria sheet is from 2009 and gives season-level lists only. No single official Victorian month-by-month chart was found.
- **Pick and storage lines** are general, conservative shop advice, not from the sources above. Check them before they ship.
- **Where sources differed** I took the wider `available` and the narrower `peak`.
- **Big calls to look at:** banana and coconut have no peak at all (year-round); apple and pear are `stored` so all non-peak months are "available"; grape is `imported` outside Feb-Jun; strawberry now has a Jan-Apr available run (Vic summer fruit) and a gap in May; passionfruit has two peaks (summer and winter); orange, lime, avocado, raspberry and papaya are `grown` (available all year, in different forms).

## Changed (31)

| Fruit | Old peak | New peak | Old available | New available | Year-round | Confidence | Main source |
|---|---|---|---|---|---|---|---|
| mango | Dec-Feb | Dec-Feb | Mar, Nov | Mar, Oct-Nov | - | medium | Australian Mango Industry Association, Our Industry |
| watermelon | Dec-Feb | Dec-Feb | Mar, Nov | Mar-Apr, Nov | - | medium | Melons Australia via FreshPlaza: melon production spans 12 months |
| rockmelon | Dec-Feb | Dec-Feb | Mar, Nov | Mar-Apr, Sep-Nov | - | medium | Melbourne Market report, 24 Sep 2025 (FreshPlaza) |
| honeydew | Dec-Feb | Dec-Feb | Mar, Nov | Mar-Apr, Sep-Nov | - | medium | Melbourne Market report, 24 Sep 2025 (FreshPlaza) |
| passionfruit | Dec-Mar | Jun-Aug, Dec-Feb | Apr, Nov | Mar-May, Nov | - | medium | Passionfruit Australia, Horticulture Statistics Handbook 2022/23 |
| cherry | Dec | Dec | Jan, Nov | Jan-Feb, Nov | - | high | Melbourne Market report (The Happy Apple), 28 Oct 2026 (FreshPlaza) |
| blueberry | Dec-Feb | Dec-Feb | Mar, Nov | Mar, Sep-Nov | - | medium | Austrade, Blueberries industry capability report |
| nectarine | Dec-Feb | Dec-Feb | Nov | Mar, Nov | - | medium | Melbourne Market report, 6 Mar 2025 (FreshPlaza) |
| peach | Dec-Feb | Dec-Feb | Nov | Mar, Nov | - | medium | Melbourne Market report, 6 Mar 2025 (FreshPlaza) |
| plum | Jan-Feb | Jan-Mar | Mar, Dec | Apr, Dec | - | medium | Melbourne Market report, 6 Mar 2025 (FreshPlaza) |
| apple | Mar-May | Mar-May | Feb, Jun | Jun-Feb | stored | high | Apple and Pear Australia via FreshPlaza: year-round supply depends on cold storage |
| pear | Mar-May | Mar-May | Feb, Jun | Jun-Feb | stored | medium | Queen Victoria Market, seasonal produce guide (Seasonal Fruits table) |
| grape | Mar-May | Feb-Apr | Feb | May-Jun, Dec-Jan | imported | medium | Melbourne Market report, 6 Mar 2025 (FreshPlaza) |
| quince | Apr-May | Apr-Jun | Mar | Mar, Jul | - | medium | Melbourne Market report, 1 Jun 2026 (FreshPlaza) |
| pomegranate | Mar-May | Apr-May | Feb | Mar, Jun-Jul | - | medium | Melbourne Market report, 5 May 2025 (FreshPlaza) |
| orange | Jun-Aug | Jun-Aug | May, Sep | Sep-May | grown | medium | Melbourne Market report, 5 May 2025 (FreshPlaza) |
| mandarin | Jun-Aug | Jun-Aug | May, Sep | Apr-May, Sep-Oct | - | high | Melbourne Market report, 5 May 2025 (FreshPlaza) |
| grapefruit | Jun-Aug | Jun-Aug | May, Sep | Apr-May, Sep | - | medium | Queen Victoria Market, seasonal produce guide (Seasonal Fruits table) |
| lemon | Jun-Aug | Jun-Aug | May, Sep-Oct | Apr-May, Sep-Oct | - | medium | Melbourne Market report, 1 Jun 2026 (FreshPlaza) |
| lime | Jun-Aug | Jun-Aug | May, Sep | May, Sep | grown | low | Limes grown year-round in Australia, peaks and troughs (via Citrus Australia, search summary) |
| kiwifruit | Jun-Aug | May-Jul | May, Sep | Mar-Apr, Aug-Oct | - | medium | Seeka Australia (Shepparton, Vic) |
| avocado | Jun-Sep | Jun-Sep | May, Oct | Oct-May | grown | low | Melbourne Market report, 3 Mar 2026 (FreshPlaza) |
| custard-apple | Jun-Aug | May-Jul | May | Mar-Apr, Aug-Sep | - | medium | Queensland Country Life: custard apple season Feb-Aug |
| strawberry | Sep-Nov | Sep-Dec | Aug, Dec | Jan-Apr, Jun-Aug | - | medium | Melbourne Market report (The Happy Apple), 28 Oct 2026 (FreshPlaza) |
| raspberry | Oct-Dec | Dec-Mar | Jan, Sep | Apr-May, Nov | grown | medium | Tasmanian Government raspberry profile (2014) |
| banana | Sep-Mar | - | Apr-Aug | all year | grown | high | Australian Banana Growers Council, Our Industry |
| pineapple | Oct-Feb | Nov-Jan | Mar, Sep | Feb-Apr, Sep-Oct | - | medium | Piñata Farms, Mareeba harvest and Christmas peak (via search summary) |
| papaya | Sep-Feb | Mar-May, Sep-Nov | Mar, Aug | Jun-Aug, Dec-Feb | grown | high | Papaya Australia, Year-round deliciousness |
| mulberry | Oct-Nov | Dec-Jan | Sep, Dec | Feb, Nov | - | low | Victorian pick-your-own listing (Geelong area) |
| coconut | all year | - | - | all year | imported | medium | IndexBox, Australia coconut market |
| dragon-fruit | Nov-Feb | Jan-Feb | Mar, Oct | Mar-Apr, Oct-Dec | - | medium | Northern Territory Government: Pitaya (dragon fruit) |

## Unchanged (8)

| Fruit | Old peak | New peak | Old available | New available | Year-round | Confidence | Main source |
|---|---|---|---|---|---|---|---|
| lychee | Dec-Jan | Dec-Jan | Feb, Nov | Feb, Nov | - | medium | Australian Lychee Growers Association, via Fruitnet |
| apricot | Dec-Jan | Dec-Jan | Feb, Nov | Feb, Nov | - | medium | Prima Fresh (Tatura, Vic) apricot brand via FreshPlaza |
| fig | Feb-Mar | Feb-Mar | Jan, Apr | Jan, Apr | - | high | Melbourne Market report, 1 Apr 2026 (FreshPlaza) |
| persimmon | Apr-May | Apr-May | Mar, Jun | Mar, Jun | - | high | Australian persimmon season, harvest March to June (FreshPlaza) |
| feijoa | Apr-May | Apr-May | Mar, Jun | Mar, Jun | - | medium | Feijoa sales in Australia, NZ season early March to end of May (FreshPlaza) |
| tangelo | Jul-Aug | Jul-Aug | Jun, Sep | Jun, Sep | - | low | Melbourne Market report, 5 May 2025 (FreshPlaza) |
| rhubarb | Sep-Nov | Sep-Nov | Aug, Dec | Aug, Dec | - | low | Queen Victoria Market, seasonal produce guide (Seasonal Fruits table) |
| starfruit | Nov-Feb | Nov-Feb | Mar, Oct | Mar, Oct | - | low | Rare Fruit Council of Australia archive, carambola |
