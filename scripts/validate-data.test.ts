import { describe, expect, it } from 'vitest'
import { validateFruits } from './validate-data'
import { FRUITS } from '../src/assets/fruits'

const good = {
  id: 'x', name: 'X', emoji: 'x', image: 'images/fruits/x',
  seasonality: { peak: ['Jan'], available: ['Feb'] },
}
const always = () => true

describe('validateFruits', () => {
  it('accepts valid data', () => {
    expect(validateFruits([good], always)).toEqual([])
  })

  it('accepts the real data set when images exist', () => {
    expect(validateFruits(FRUITS, always)).toEqual([])
  })

  it('fails on every kind of broken fruit', () => {
    const broken = [
      { ...good, id: 'badmonth', seasonality: { peak: ['Janu'], available: [] } },
      { ...good, id: 'both', seasonality: { peak: ['Jan'], available: ['Jan'] } },
      { ...good, id: 'x' }, // duplicate of `good`
      { ...good, id: 'empty', seasonality: { peak: [], available: [] } },
      { ...good, id: 'badpair', pairings: 'mint' },
      { ...good, id: 'badrecipe', recipes: [{ name: 'a', type: 'nope', description: 'd' }] },
    ]
    const errors = validateFruits([good, ...broken], always).join('\n')
    for (const id of ['badmonth', 'both', 'x:', 'empty', 'badpair', 'badrecipe']) {
      expect(errors).toContain(id)
    }
  })

  it('fails on a missing image file', () => {
    expect(validateFruits([good], () => false).join()).toContain('missing image file')
  })
})
