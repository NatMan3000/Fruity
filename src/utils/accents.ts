import { CookingPot, Flower2, Hourglass, Leaf, Citrus, Sparkles, Star, Sun, type LucideIcon } from 'lucide-react'
import type { Season } from '../types/fruit'

// The juice palette's jobs (DESIGN.md "Colour"). Class names are spelled out in full so Tailwind
// finds them. `mark` is the vivid circle, `on` the icon colour that reads on it, `wash` the band.
export interface Accent { mark: string; on: string; wash: string; soft: string }

export const ACCENTS = {
  berry: { mark: 'bg-berry', on: 'text-ink', wash: 'bg-berry-wash', soft: 'bg-berry-soft' },
  tangerine: { mark: 'bg-tangerine', on: 'text-ink', wash: 'bg-tangerine-wash', soft: 'bg-tangerine-soft' },
  grape: { mark: 'bg-grape', on: 'text-card', wash: 'bg-grape-wash', soft: 'bg-grape-soft' },
  citrus: { mark: 'bg-citrus', on: 'text-ink', wash: 'bg-citrus-wash', soft: 'bg-citrus-soft' },
  peak: { mark: 'bg-peak', on: 'text-ink', wash: 'bg-peak-soft', soft: 'bg-peak-soft' },
  ending: { mark: 'bg-ending', on: 'text-ink', wash: 'bg-ending-soft', soft: 'bg-ending-soft' },
} satisfies Record<string, Accent>

export type AccentName = keyof typeof ACCENTS

// Each season of the year owns one accent: spring blossom, summer stone fruit, autumn plums and
// figs, winter citrus. Used by the Now header band and the season filter chips.
export const SEASON_ACCENT: Record<Season, { accent: AccentName; Icon: LucideIcon }> = {
  Spring: { accent: 'berry', Icon: Flower2 },
  Summer: { accent: 'tangerine', Icon: Sun },
  Autumn: { accent: 'grape', Icon: Leaf },
  Winter: { accent: 'citrus', Icon: Citrus },
}

// Now page section markers.
export const SECTION_MARK: Record<'buy' | 'landed' | 'ending' | 'cook', { accent: AccentName; Icon: LucideIcon }> = {
  buy: { accent: 'peak', Icon: Star },
  landed: { accent: 'berry', Icon: Sparkles },
  ending: { accent: 'ending', Icon: Hourglass },
  cook: { accent: 'tangerine', Icon: CookingPot },
}
