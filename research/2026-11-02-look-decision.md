---
type: report
title: Fruity look decision - the hybrid Nathan picked from three comps
description: Which parts of the Sorbet Pop, Juicy 3D and Market Sticker comps go into the final Fruity look, in Nathan's words, as the spec for the integration build.
created: 2026-11-02
status: final
---

# Fruity look decision (D7, 2 Nov 2026)

Three working comps were built on branches `comp-sorbet`, `comp-3d` and `comp-sticker` (snapshot commits e6b03a2, 38b1988, c23323e; reports in /tmp/fruity-comp-*.md, screenshots in scratchpad/comp-*.png). Nathan and his partner tried them on their phones and picked a mix.

## Nathan's words (verbatim)

> Sorbet pop, we like the colours and the theme of this. I'm not sure if the fruits are supposed to be in there containers, or they're supposed to be popping out like that. It's a bit weird. But we do like the fruit bowl from the juicy 3D that pops in Animated like that, so that would be fun to have some sort of animation like that. I'm not sure if that bowl really suits Sorbet, but we like what you're doing with the animation, so keep that in mind. The state selector at the top, I think, is too prominent. It's rarely going to get changed. So I think we just skip the state differences and selector now. As you said, there's not many differences anyway between states. The list and year toggles are better on the juicy 3D version because they take up less space, we don't need the word, but we do like the theming on the fruit page that's in the sorbet pop version. We like the font in the market sticker version. We also like the white outlines around the pictures of the fruit in the market sticker version. We like the 3D fruit dropping in and moving around being interactive on the Juicy three D version. It would be cool if the fruit dropping in like that was a bit more interactive. Maybe like the watermelon comes in as a whole watermelon. Maybe we could interact with it to cut it to see inside it? On the year calendar on an individual fruit when it comes into the page, we like the market sticker version as it has a bit more animation and bounciness to it. The sorbet pop has better animation when you add it to a bag. We like animation.

## The spec

| Part | Take from | Detail |
|---|---|---|
| Colours and overall theme | Sorbet Pop | Season-coloured page (raspberry in spring), chunky rounded colour blocks per fruit, no white or paper. |
| Fruit art in cards | Market Sticker treatment, inside Sorbet's blocks | Fruit sits INSIDE its container (Nathan found the pop-out "a bit weird"), as a die-cut sticker with the white outline. |
| Display font | Market Sticker | Shrikhand for names and headings; Bricolage Grotesque for body and labels. |
| Now hero | Juicy 3D, re-skinned for Sorbet | The 3D drop-in of this month's peak fruit, settling, drag to spin. The vessel should suit Sorbet (not necessarily the blue bowl: a Sorbet-coloured bowl, crate or sundae dish). |
| Hero interaction (new) | Nathan's idea | More interactive: fruit arrive whole (e.g. a whole watermelon) and you can cut them open to see inside (tap or swipe to slice, halves fall apart showing the flesh and seeds). |
| List / Year toggle | Juicy 3D | Compact icon-only segmented toggle, no words. |
| Fruit page theming | Sorbet Pop | Whole page in the fruit's colour, big art (white-outlined sticker), status sticker. |
| Year calendar animation on the fruit page | Market Sticker | The bouncier entrance. |
| Add to bag animation | Sorbet Pop | Its bag animation. |
| State selector and state differences | Removed | Victorian seasons only; drop the chip, the state sheet and the "varies by state" UI. Research stays on file. |
| Motion overall | All | "We like animation": playful, springy, one-shot, reduced-motion respected, nothing looping when idle. |
