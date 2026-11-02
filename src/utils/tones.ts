import type { CSSProperties } from 'react'
import type { Season } from '../types/fruit'
import { colourDistance, hexToRgb, oklchOf, tone } from './colour'

// Sorbet tones (DESIGN.md "Colour"). Every surface is a fruit or a season colour. One `colour` becomes a
// family of tones at FIXED OKLCH lightness, so a dark fruit (mulberry) and a pale one (lemon) give blocks
// of the same weight and the same text colours read on all of them.
//   pop     the colour block itself: list rows, Buy now cards, a fruit's whole page
//   bright  a lighter, juicier tone: tip cards, header discs, a season's sheets and inputs
//   deep    a dark tone: the Year card on a fruit page, chips, pairing pills
//   ink     text and icons on pop and bright, the dark season-bar track, hard shadows
//   inkSoft secondary text on pop and bright
//   light   text on deep and on a season page (never pure white)
//   page    a vivid mid tone for a whole screen (light text on it); seasons only
// scripts/colour-contrast.test.ts checks every pair for every fruit and season.
export interface Tones { pop: string; bright: string; deep: string; ink: string; inkSoft: string; light: string; page: string }

// Yellows only reach full juice near the top of the lightness range (lower, they turn mustard), so
// yellow hues get their pop and bright tones lifted. 0 for every other hue.
function yellowness(hex: string): number {
  const [r, g, b] = hexToRgb(hex)
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  if (max - min < 0.15) return 0
  const d = max - min
  let h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4
  h *= 60
  if (h < 0) h += 360
  return Math.max(0, 1 - Math.abs(h - 52) / 22) // sRGB hue: yellow is about 52 degrees
}

const cache = new Map<string, Tones>()
export function tonesOf(colour: string): Tones {
  let t = cache.get(colour)
  if (!t) {
    const y = yellowness(colour)
    t = {
      // The fruit keeps its own lightness where it can (a red stays red, not salmon), inside the band
      // where dark text still reads.
      pop: tone(colour, Math.min(0.9, Math.max(0.72 + 0.14 * y, oklchOf(colour)[0])), 0.21),
      bright: tone(colour, 0.89 + 0.05 * y, 0.13),
      deep: tone(colour, 0.36, 0.11),
      ink: tone(colour, 0.22, 0.06),
      inkSoft: tone(colour, 0.3, 0.08),
      light: tone(colour, 0.96, 0.035),
      page: tone(colour, 0.5, 0.2),
    }
    cache.set(colour, t)
  }
  return t
}

// Each season owns a sorbet: spring raspberry, summer blood orange, autumn plum, winter kiwi. Now, Fruit,
// Year, Cook and Play sit on its `page` (picked by hand so `light` text clears 5:1).
export const SEASON_COLOUR: Record<Season, string> = {
  Spring: '#E8346E',
  Summer: '#F2581E',
  Autumn: '#8E44C8',
  Winter: '#0E9C7E',
}
const SEASON_PAGE: Record<Season, string> = {
  Spring: '#B7014E',
  Summer: '#BC3A06',
  Autumn: '#7E2FB8',
  Winter: '#006E5A',
}
export const seasonTones = (season: Season): Tones => ({ ...tonesOf(SEASON_COLOUR[season]), page: SEASON_PAGE[season] })

// The tones as CSS variables, set on a screen or a block; everything inside reads them
// (bg-(--pop), text-(--ink), ...), so one component draws correctly on any fruit or season.
export const toneVars = (t: Tones): CSSProperties => ({
  '--pop': t.pop, '--bright': t.bright, '--deep': t.deep, '--ink': t.ink, '--ink-soft': t.inkSoft, '--light': t.light, '--page': t.page,
} as CSSProperties)

// A steady tilt per fruit, -5 to 5 degrees, so stickers look slapped on by hand but never jump about.
export function tiltOf(id: string): number {
  let h = 0
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) | 0
  return (((h % 11) + 11) % 11) - 5
}

// A block in one fruit's colours sitting on another colour (a recipe card on a fruit's page) must
// still read as its own block: its preferred tone if that stands clear of the page, otherwise its other
// tone, and if neither does (a yellow card on a yellow page), the preferred one with the white die-cut
// edge round it. 0.08 in OKLab clears every card the app draws except the ones it is there to catch
// (rhubarb pop on the strawberry page is 0.023).
export const BLOCK_SEPARATION = 0.08
export function blockTone(colour: string, page: string, prefer: 'pop' | 'bright'): { surface: 'pop' | 'bright'; edge: boolean } {
  const t = tonesOf(colour)
  const other = prefer === 'pop' ? 'bright' : 'pop'
  if (colourDistance(t[prefer], page) >= BLOCK_SEPARATION) return { surface: prefer, edge: false }
  if (colourDistance(t[other], page) >= BLOCK_SEPARATION) return { surface: other, edge: false }
  return { surface: prefer, edge: true }
}
