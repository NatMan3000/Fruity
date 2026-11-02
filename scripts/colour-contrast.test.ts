import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { FRUITS } from '../src/assets/fruits'
import { SEASONS, type Season } from '../src/types/fruit'
import { contrast } from '../src/utils/colour'
import { seasonTones, tonesOf, type Tones } from '../src/utils/tones'

// Every text pair the Sorbet look draws, checked for every fruit and every season (DESIGN.md "Colour").
// Static tokens are read from src/index.css, so a re-tuned hex there is what gets checked.
// (Lives in scripts/ because it reads a file with node:fs; src/ is type-checked for the browser.)
const css = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8')
const token = (name: string): string => {
  const m = css.match(new RegExp(`--color-${name}:\\s*(#[0-9A-Fa-f]{6})`))
  if (!m) throw new Error(`no token --color-${name}`)
  return m[1]
}

type Pair = [text: keyof Tones, surface: keyof Tones, why: string]

// Text on a fruit's own colours: list rows, Buy now, a fruit's page, its tips, recipe cards and Year card.
const FRUIT_TEXT: Pair[] = [
  ['ink', 'pop', 'names and body on a fruit block or page'],
  ['inkSoft', 'pop', 'secondary text on a fruit block or page'],
  ['ink', 'bright', 'tips, recipe cards, More about it'],
  ['inkSoft', 'bright', 'secondary text on those cards'],
  ['light', 'deep', 'the Year card, pairing pills, recipe icon discs'],
  ['bright', 'ink', 'idle tab labels on a fruit page'],
  ['light', 'ink', 'Add to bag, the bag badge'],
  ['ink', 'light', 'this month in the Year card'],
]

// Text on a season screen: Now, Fruit list, Year, Cook, Play, the quiz, the bag sheet.
const SEASON_TEXT: Pair[] = [
  ['light', 'page', 'titles and text on the page'],
  ['ink', 'bright', 'search field, sheets, quiz card, header discs'],
  ['inkSoft', 'bright', 'secondary text on those'],
  ['ink', 'pop', 'the current tab, a selected chip, the season sticker'],
  ['light', 'deep', 'filter chips, quiz answers'],
  ['bright', 'ink', 'idle tab labels, the List / Year toggle'],
  ['light', 'ink', 'Share list, the bag badge'],
]

const fails = (t: Tones, pairs: Pair[], label: string, min = 4.5) =>
  pairs.filter(([a, b]) => contrast(t[a], t[b]) < min).map(([a, b, why]) => `${label}: ${a} on ${b} ${contrast(t[a], t[b]).toFixed(2)} (${why})`)

describe('fruit tones', () => {
  it('keep every text pair at 4.5:1 or better for every fruit', () => {
    expect(FRUITS.flatMap(f => fails(tonesOf(f.colour), FRUIT_TEXT, f.id))).toEqual([])
  })

  it('keep the season bar readable on every fruit (3:1, graphics)', () => {
    const bad: string[] = []
    for (const f of FRUITS) {
      const t = tonesOf(f.colour)
      for (const fill of ['peak', 'season', 'off']) if (contrast(token(fill), t.ink) < 3) bad.push(`${fill} on ${f.id} ink`)
      if (contrast(t.light, t.ink) < 3) bad.push(`this-month ring on ${f.id}`)
    }
    expect(bad).toEqual([])
  })
})

describe('season tones', () => {
  it.each(Object.keys(SEASONS) as Season[])('%s keeps every text pair at 4.5:1 or better', season => {
    expect(fails(seasonTones(season), SEASON_TEXT, season)).toEqual([])
  })

  it.each(Object.keys(SEASONS) as Season[])('%s keeps the season bar readable on its page (3:1)', season => {
    const t = seasonTones(season)
    for (const fill of ['peak', 'season', 'off']) expect(contrast(token(fill), t.ink)).toBeGreaterThanOrEqual(3)
  })
})

describe('status stickers', () => {
  const pairs = ['peak', 'season', 'ending', 'off', 'always']
  it.each(pairs)('%s word reads on its own fill (4.5:1)', name => {
    expect(contrast(token(`${name}-ink`), token(name))).toBeGreaterThanOrEqual(4.5)
  })
})
