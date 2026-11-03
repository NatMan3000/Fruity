import { useLayoutEffect } from 'react'
import type { Tones } from '../utils/tones'
import { toneVars } from '../utils/tones'

// The screen's colours (DESIGN.md "Colour"): a season screen sits on the season's `page` with `light`
// text; a fruit's page is that fruit's `pop` with `ink` text. The tones go on <html> as CSS variables,
// so the page, the overscroll, the tab bar, the sheets and the iPhone status bar all agree.
export type ScreenKind = 'season' | 'fruit'

// The iPhone's status bar colour: the screen's, unless something covering the whole screen (the welcome)
// wears its own colour for a while.
let screenColour = ''
let override: string | null = null
const applyThemeColour = () => document.querySelector('meta[name="theme-color"]')?.setAttribute('content', override ?? screenColour)

export function overrideThemeColour(colour: string | null) {
  override = colour
  applyThemeColour()
}

export function useScreen(t: Tones, kind: ScreenKind) {
  useLayoutEffect(() => {
    const root = document.documentElement
    const vars: Record<string, string> = {
      ...(toneVars(t) as Record<string, string>),
      '--screen': kind === 'fruit' ? t.pop : t.page,
      '--on-screen': kind === 'fruit' ? t.ink : t.light,
      '--on-screen-soft': kind === 'fruit' ? t.inkSoft : t.light,
      '--shadow': t.ink,
      '--scoop': kind === 'fruit' ? t.bright : t.pop,
    }
    for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v)
    screenColour = vars['--screen']
    applyThemeColour()
  }, [t, kind])
}
