import { describe, expect, it } from 'vitest'
import { glanceTip } from './tips'

describe('glanceTip', () => {
  it('keeps leading clauses of the first sentence within one line', () => {
    expect(glanceTip('Sweet smell at the base, heavy for its size, golden colour creeping up from the bottom, fresh green leaves. Skip a fermented smell.'))
      .toBe('Sweet smell at the base')
    expect(glanceTip('Crisp, firm stalks with glossy colour. Skip floppy ones.')).toBe('Crisp, firm stalks with glossy colour')
    expect(glanceTip('Skin yellowing about half way, slight give; ripen on the bench.')).toBe('Skin yellowing about half way')
    expect(glanceTip('Firm, yellow with slight brown on the ridge edges (that is ripe). Skip green.'))
      .toBe('Firm, yellow with slight brown on the ridge edges (that is ripe)')
  })

  it('always keeps the first clause, and handles no tip', () => {
    expect(glanceTip('Ripe when it gives slightly to a gentle squeeze at the stem end; flick the stem cap.'))
      .toBe('Ripe when it gives slightly to a gentle squeeze at the stem end')
    expect(glanceTip(undefined)).toBeUndefined()
  })
})
