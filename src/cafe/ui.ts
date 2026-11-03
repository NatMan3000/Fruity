// The cafe's controls in the app's own style (DESIGN.md "Components"): header discs in the screen's
// `bright` with `ink` icons (as TopBar and the quiz), and chunky pills that sink into their shadow.
// Kid targets stay big: discs 44px, game pills 56px.
export const DISC = 'press inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-(--bright) text-(--ink)'

const PILL = 'press block-shadow inline-flex min-h-14 items-center [@media(max-height:700px)]:min-h-12 justify-center gap-2 rounded-full leading-tight font-extrabold disabled:opacity-50'
const TONE = {
  ink: 'bg-(--ink) text-(--light)',
  bright: 'bg-(--bright) text-(--ink)',
  pop: 'bg-(--pop) text-(--ink)',
} as const

// A pill in one of the screen's tones. `fit` carries its side padding and type size, so a caller that
// wants others replaces them rather than adding a second class that fights the first.
export const pill = (tone: keyof typeof TONE, fit = 'px-5 text-[1.125rem]') => `${PILL} ${TONE[tone]} ${fit}`

// The sticker book and the recipe cover the whole screen (and the tab bar) on the season's page.
export const OVERLAY = 'cafe-slide-up fixed inset-0 z-50 flex flex-col overflow-y-auto overscroll-contain bg-(--screen) text-(--on-screen)'

// The cafe door's colour blocks (like the quiz's mode cards). The Play tab shows the cafe in this yellow,
// so its door keeps it; the sticker book is strawberry, the grown-ups' salad kiwi. Checked in
// scripts/colour-contrast.test.ts.
export const MENU_COLOURS = { cafe: '#FFD93B', stickers: '#E8378E', free: '#8DB33A' } as const
