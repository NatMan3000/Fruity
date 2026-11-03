import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { FRUITS } from '../src/assets/fruits'
import { SEASONS, type Season } from '../src/types/fruit'
import { colourDistance, contrast } from '../src/utils/colour'
import { RECIPES } from '../src/assets/recipes'
import { BLOCK_SEPARATION, blockTone, seasonTones, tonesOf, type Tones } from '../src/utils/tones'
import { CUSTOMERS } from '../src/cafe/customers'
import { MENU_COLOURS } from '../src/cafe/ui'

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

// A recipe card on a fruit's page (RecipeCard `page`) must read as its own block, not melt into a
// page of nearly its own colour (audit fruit-F4: the rhubarb crumble on the strawberry page).
describe('recipe cards on a fruit page', () => {
  const cards = FRUITS.flatMap(page => RECIPES.filter(r => r.fruitIds.includes(page.id)).map(r => {
    const main = FRUITS.find(f => f.id === r.fruitIds[0])!
    const prefer = main.id === page.id ? 'bright' as const : 'pop' as const
    const pageColour = tonesOf(page.colour).pop
    return { page: page.id, recipe: r.id, main, pageColour, ...blockTone(main.colour, pageColour, prefer) }
  }))

  it('stand clear of the page, or wear the white edge', () => {
    const bad = cards.filter(c => !c.edge && colourDistance(tonesOf(c.main.colour)[c.surface], c.pageColour) < BLOCK_SEPARATION)
    expect(bad.map(c => `${c.recipe} on ${c.page}`)).toEqual([])
  })

  it('the rhubarb crumble on the strawberry page takes its bright tone', () => {
    const c = cards.find(x => x.page === 'strawberry' && x.recipe === 'rhubarb-strawberry-ginger-crumble')!
    expect(c).toMatchObject({ surface: 'bright', edge: false })
  })

  it('keep their text readable whichever tone they take (4.5:1)', () => {
    const bad = cards.filter(c => contrast(tonesOf(c.main.colour).ink, tonesOf(c.main.colour)[c.surface]) < 4.5)
    expect(bad.map(c => c.recipe)).toEqual([])
  })
})

// The Fruit Salad Cafe wears the app's look (DESIGN.md "Fruit Salad Cafe"): its text pairs on the season
// screen are the SEASON_TEXT ones above and its shelf tiles and stickers are fruit blocks (FRUIT_TEXT).
// What is its own: the door's colour blocks, the friends' stickers in each customer's fur colour, and
// meters that must read as meters even when empty (audit play-F2): track edge and fill at 3:1.
describe('cafe', () => {
  const BLOCK_TEXT: Pair[] = [
    ['ink', 'pop', 'title and name on the block'],
    ['inkSoft', 'pop', 'the line under it, a sticker fact'],
    ['light', 'ink', 'the chevron disc, the count badge'],
  ]

  it('door blocks keep their text at 4.5:1', () => {
    expect(Object.entries(MENU_COLOURS).flatMap(([name, c]) => fails(tonesOf(c), BLOCK_TEXT, name))).toEqual([])
  })

  it("friends' stickers keep their text at 4.5:1", () => {
    expect(CUSTOMERS.flatMap(c => fails(tonesOf(c.fur), BLOCK_TEXT, c.id))).toEqual([])
  })

  const METERS: [edge: keyof Tones | 'peak', on: keyof Tones | 'peak', why: string][] = [
    ['pop', 'ink', 'level meter: its pop outline on the ink pill'],
    ['pop', 'deep', 'level meter: the pop fill on its deep track'],
    ['ink', 'bright', 'door level card: the ink track on the bright block'],
    ['light', 'deep', 'stir meter: its light edge on the deep goal pill'],
    ['ink', 'peak', 'stir meter: its ink track on the peak goal pill (stirred)'],
    ['peak', 'ink', 'stir meter: the peak fill on its ink track'],
  ]
  it.each(Object.keys(SEASONS) as Season[])('%s meters read when empty (3:1)', season => {
    const t = seasonTones(season)
    const hex = (k: keyof Tones | 'peak') => (k === 'peak' ? token('peak') : t[k])
    const bad = METERS.filter(([a, b]) => contrast(hex(a), hex(b)) < 3).map(([a, b, why]) => `${a} on ${b} ${contrast(hex(a), hex(b)).toFixed(2)} (${why})`)
    expect(bad).toEqual([])
  })
})
