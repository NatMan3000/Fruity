---
type: research
title: Fruity responsive audit - full-page 393px sweep, release candidate (Cook + photos + cut faces)
description: 21 phone-width captures of every main screen and its reachable states, judged against DESIGN.md, Nathan's look decision and the mobile rules; no broken or major defects, one real 3D bug, a cluster of shared-component touch and type-floor fixes.
created: 2026-11-03
status: final
sources:
  - scratchpad/ra-2026-11-03/shots/{now,fruit,cook,play}/REVIEW.md (4 section reviews, 22 findings)
  - scratchpad/ra-2026-11-03/shots/*/*.png (21 captures)
  - ~/.claude/skills/ResponsiveAudit/scripts/apps/fruity.ts and scratchpad/ra-steps.ts
---

# Fruity responsive audit - 3 Nov 2026

**Scope.** Every main screen of the release candidate (Now, Fruit list, Year, four fruit pages, Cook, three recipes, cook mode, Play, quiz menu and a live question, Fruit Salad Cafe) plus the reachable states (Now dish sliced, bag sheet, mango and strawberry cut open, Dessert filter), captured full-page at **393px** from a frozen snapshot of the build, in **Victoria, real date (November, spring), bag seeded with 3 items**. Four reviewers judged the 21 captures against DESIGN.md, `research/2026-11-02-look-decision.md` and the mobile rules.

**Result.** 0 broken, 0 major. 8 PASS, 13 MINOR. Nothing overflows at 393, gutters are a consistent 16px, the content column is 361px everywhere, and almost every touch target clears 44px. The findings collapse into one real bug, four shared-component fixes and a short page tail.

**Already in hand, not counted here.** Nathan's own phone findings, being fixed in the current build round: the fruit page 3D sits low in its blob with an empty top third and a gap under the top bar; the blob's entrance jumps; the 3D fruit spins only horizontally.

## 1. Real bug

| Id | What | Where | Fix |
|---|---|---|---|
| now-F3 | Slice on the Now dish cut only the papaya; strawberry and pineapple stayed whole, the papaya halves lay across the neighbouring fruit and the dish rim, and the button still read "Slice" after cutting. | `src/components/NowHero.tsx`, `src/three/cutting.tsx`, `src/components/SliceButton.tsx` | Slice cuts every fruit in the dish; pieces laid out clear of each other and inside the rim; button toggles to "Put back" (the fruit page already does). |

## 2. Shared components (one fix each, many screens)

| Id | What | Screens | Owner | Fix |
|---|---|---|---|---|
| now-F1 + fruit-F1 | Status sticker word about 11px (under the 12px floor); on long names (Persimmon, Pomegranate, Custard Apple) the sticker drops under the name and rows jump from 92 to 107px. | Now, Fruit list, Cook, fruit pages | `StatusSticker.tsx`, row in `BrowsePage.tsx` | Sticker word to 13px; make the row one height for every fruit (sticker on its own line by design, or sized to fit). |
| cook-F1, cook-F2, now-F2, fruit-F3 | Touch floor: Cook filter chips about 43px; ingredient tick circles 28px; bag remove x about 10px glyph; "Goes with" pills about 40px if tappable. | Cook, recipe, bag, fruit pages | chip style, `RecipePage.tsx`, `BagSheet.tsx`, `FruitDetailPage.tsx` | 44px minimum on every interactive control; whole ingredient row is the tap target; remove button 44x44. |
| cook-F1, now-F4 | Horizontal rails hide content with only a faint fade (Snack, Drink, Preserve off-screen; "Mulber" clipped). | Cook chips, Now Just landed | `CookPage.tsx`, `NowPage.tsx` | Let the last item peek a clear 24 to 32px, or wrap the chip row to two lines. |
| fruit-F4, fruit-F5, cook-F5 | Recipe card: a same-hue card blends into its page (rhubarb card on the strawberry page); long "Makes ..." lines wrap with a misaligned icon and make cards uneven. | fruit pages, Cook | `RecipeCard.tsx` | Contrast check against the page colour and fall back to the bright tone or a white edge; icon aligned to the first line, continuation indented. |

## 3. Page tail

| Id | What | Owner | Fix |
|---|---|---|---|
| fruit-F2 | Year view name column 92px: "Custard Apple" wraps, three names nearly touch the bar. | `YearPage.tsx` | Wider name column, bar flexes. |
| cook-F3 | Cook mode: disabled Back about 2:1 contrast; "Your screen stays on" caption 13px. | `CookMode.tsx` | Hide Back on step 1; caption 15px. |
| cook-F4 | Jam page says "out of season" twice. | `RecipePage.tsx` | Keep one. |
| cook-F5 | "Out of season? Try:" shows on in-season recipes. | `RecipePage.tsx` | Show only when the main fruit is out of season; otherwise "Swap it for". |
| cook-F6 | Cook mode long title pushes the step down, big empty space below. | `CookMode.tsx` | Tighter title (2 lines max, smaller size). |
| fruit-F6 | Cut halves cast shadows outside the blob. | `src/three` hero | Folded into the hero composition fix in progress. |
| fruit-F7 | "(tap to remove)" 13px, lighter than its label. | `FruitDetailPage.tsx` | 15px, same weight. |
| play-F1 | Quiz "SCORE" label 11px. | `src/quiz/components/Hud.tsx:49` | 12px or more. |
| play-F2 | Cafe Level 1 progress track about 1.2:1 on white, reads empty. | `src/cafe/cafe.css`, `CafeGame.tsx` | Track at least 3:1. |
| play-F3 | Cafe header discs 10px from the edge, cards 16px. | `src/cafe` | 16px gutter. |
| play-F4 | Play hub cards leave the top right empty. | `PlayPage.tsx` | NIT, leave. |
| content | Lemon nutrition says "Alkalizing" (US spelling, dubious health claim). | `src/assets/fruits.ts` | Remove the claim. |

## 4. Capture notes and controls

- now-F5: the last 11px under the floating tab bar is black in the full-page capture; most likely the capture running past the document. Check on the phone before treating it as a defect.
- The bag badge reads 2 with 3 seeded items: correct, it counts items still to get and mango was seeded as ticked.
- Harness: Fruity is hash-routed under `/Fruity/`; the first run refused every shot until `serial.ts` learned to strip `basePath` (gotcha logged in the skill).

## 5. Fix order

1. now-F3 (the Slice bug).
2. The shared-component row (stickers, touch floor, rails, recipe card).
3. The page tail, in one pass.
Then a re-capture of the same 21 steps to confirm.
