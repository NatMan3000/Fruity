import { describe, expect, it } from 'vitest'
import { validateFruits } from './validate-data'
import { FRUITS } from '../src/assets/fruits'

const good = {
  id: 'x', name: 'X', emoji: 'x', image: 'images/fruits/x',
  seasonality: { peak: ['Jan'], available: ['Feb'] },
  sources: [
    { name: 'a', url: 'https://a.example', says: 'a' },
    { name: 'b', url: 'https://b.example', says: 'b' },
  ],
  checkedOn: '2026-11-02',
  confidence: 'high',
}
const now = new Date('2026-11-02')
const always = () => true

describe('validateFruits', () => {
  it('accepts valid data', () => {
    expect(validateFruits([good], always, now)).toEqual([])
  })

  it('accepts the real data set when images exist', () => {
    expect(validateFruits(FRUITS, always, now)).toEqual([])
  })

  it('fails on every kind of broken fruit', () => {
    const broken = [
      { ...good, id: 'badmonth', seasonality: { peak: ['Janu'], available: [] } },
      { ...good, id: 'both', seasonality: { peak: ['Jan'], available: ['Jan'] } },
      { ...good, id: 'x' }, // duplicate of `good`
      { ...good, id: 'empty', seasonality: { peak: [], available: [] } },
      { ...good, id: 'badpair', pairings: 'mint' },
      { ...good, id: 'onesource', sources: [good.sources[0]] },
      { ...good, id: 'stale', checkedOn: '2024-01-01' },
      { ...good, id: 'nodate', checkedOn: undefined },
      { ...good, id: 'noconf', confidence: undefined },
      { ...good, id: 'badstate', stateOverrides: { XX: { peak: ['Jan'], available: [] } } },
      { ...good, id: 'overlap', stateOverrides: { NSW: { peak: ['Jan'], available: ['Jan'] } } },
      { ...good, id: 'badrecipe', recipes: [{ name: 'a', type: 'nope', description: 'd' }] },
    ]
    const errors = validateFruits([good, ...broken], always, now).join('\n')
    for (const id of ['badmonth', 'both', 'x:', 'empty', 'badpair', 'badrecipe',
      'onesource', 'stale', 'nodate', 'noconf', 'badstate', 'overlap']) {
      expect(errors).toContain(id)
    }
  })

  it('fails on a missing image file', () => {
    expect(validateFruits([good], () => false, now).join()).toContain('missing image file')
  })
})
