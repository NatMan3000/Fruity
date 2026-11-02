import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { FRUITS } from '../src/assets/fruits'
import { contrast, fruitTints } from '../src/utils/colour'

// Tokens are read from src/index.css, so a re-tuned hex there is what gets checked.
// (Lives in scripts/ because it reads a file with node:fs; src/ is type-checked for the browser.)
const css = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8')
const token = (name: string): string => {
  const m = css.match(new RegExp(`--color-${name}:\\s*(#[0-9A-Fa-f]{6})`))
  if (!m) throw new Error(`no token --color-${name}`)
  return m[1]
}

// Text drawn on a fruit's soft tint (rows, cook cards) and wash (icon circle, detail band).
const ON_SOFT = ['ink', 'ink-2', 'peak-ink', 'season-ink', 'off-ink', 'ending-ink']
const ON_WASH = ['ink', 'ink-2']

describe('fruit colours', () => {
  it('keeps body text at 4.5:1 or better on every fruit tint', () => {
    const fails: string[] = []
    for (const f of FRUITS) {
      const { soft, wash } = fruitTints(f.colour)
      for (const t of ON_SOFT) if (contrast(token(t), soft) < 4.5) fails.push(`${t} on ${f.id} soft ${soft}`)
      for (const t of ON_WASH) if (contrast(token(t), wash) < 4.5) fails.push(`${t} on ${f.id} wash ${wash}`)
    }
    expect(fails).toEqual([])
  })

  it('keeps the peak bar at 2.5:1 or better on every row tint', () => {
    // Peak is also full height, so the bar never relies on colour alone; this keeps it vivid.
    const fails = FRUITS.filter(f => contrast(token('peak'), fruitTints(f.colour).soft) < 2.5).map(f => f.id)
    expect(fails).toEqual([])
  })

  it('derives tints at one lightness, whatever the fruit', () => {
    // A dark fruit and a pale fruit give rows that read the same with dark text.
    const mulberry = contrast(token('ink-2'), fruitTints('#6B2D5C').soft)
    const lemon = contrast(token('ink-2'), fruitTints('#FFD93B').soft)
    expect(Math.abs(mulberry - lemon)).toBeLessThan(0.6)
  })
})

describe('accent and status pairs', () => {
  const pairs: [string, string, number][] = [
    // [text, surface, minimum]
    ['ink-2', 'paper', 4.5],
    ['ink-3', 'card', 4.5],
    ['peak-ink', 'card', 4.5],
    ['season-ink', 'card', 4.5],
    ['off-ink', 'card', 4.5],
    ['ending-ink', 'card', 4.5],
    ['peak-ink', 'peak-soft', 4.5],   // quiz right answer
    ['berry-ink', 'berry-soft', 4.5], // quiz wrong answer
    ['season-ink', 'season-soft', 4.5], // salad tags
    ['ink', 'berry-wash', 4.5],       // Now month band, one per season
    ['ink', 'tangerine-wash', 4.5],
    ['ink', 'grape-wash', 4.5],
    ['ink', 'citrus-wash', 4.5],
    ['ink-2', 'berry-wash', 4.5],
    ['ink-2', 'grape-wash', 4.5],
    ['ink', 'tangerine-wash', 4.5],   // current tab pill
    // Icons on the vivid marker circles are graphics: 3:1
    ['ink', 'peak', 3],
    ['ink', 'berry', 3],
    ['ink', 'tangerine', 3],
    ['ink', 'citrus', 3],
    ['ink', 'ending', 3],
    ['card', 'grape', 3],
    ['card', 'peak-ink', 3],          // bag tick
  ]
  it.each(pairs)('%s on %s reaches %d:1', (text, surface, min) => {
    expect(contrast(token(text), token(surface))).toBeGreaterThanOrEqual(min)
  })
})
