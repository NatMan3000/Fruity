import { describe, expect, it } from 'vitest'
import { friendly, scaleQty } from './scale'

describe('scaleQty', () => {
  it('leaves the quantity exactly as written at the recipe serves', () => {
    expect(scaleQty('1 tbsp, plus extra for the grill', 1)).toBe('1 tbsp, plus extra for the grill')
  })

  it('leaves words alone', () => {
    for (const q of ['pinch', 'to taste', 'a few', 'small handful', 'to serve']) expect(scaleQty(q, 2)).toBe(q)
  })

  it('rounds spoons, cups and counts to friendly fractions', () => {
    expect(scaleQty('1 1/2 tbsp', 2)).toBe('3 tbsp')
    expect(scaleQty('1/2 tsp', 0.5)).toBe('1/4 tsp')
    expect(scaleQty('1 cup', 1.5)).toBe('1 1/2 cups')
    expect(scaleQty('2 cups', 0.5)).toBe('1 cup')
    expect(scaleQty('3', 1.5)).toBe('4 1/2')
    expect(scaleQty('1', 0.25)).toBe('1/4')
    expect(scaleQty('1', 8 / 6)).toBe('1 1/2')
    expect(scaleQty('1 tbsp', 8 / 6)).toBe('1 1/4 tbsp')
    expect(scaleQty('1 cup', 8 / 6)).toBe('1 1/3 cups')
    expect(scaleQty('2 bunches', 0.5)).toBe('1 bunch')
    expect(scaleQty('1 to 2 tbsp, to taste', 2)).toBe('2 to 4 tbsp, to taste')
  })

  it('rounds grams and millilitres to what a scale shows, and changes units past 1000', () => {
    expect(scaleQty('125ml', 1.5)).toBe('190ml')
    expect(scaleQty('600g', 2)).toBe('1.2kg')
    expect(scaleQty('500ml', 3)).toBe('1.5 litres')
    expect(scaleQty('1.5kg', 0.5)).toBe('750g')
    expect(scaleQty('1 litre', 0.5)).toBe('500ml')
    expect(scaleQty('100g (2/3 cup)', 2)).toBe('200g (1 1/3 cups)')
  })

  it('keeps sizes that are not amounts', () => {
    expect(scaleQty('4 (about 250g each)', 0.5)).toBe('2 (about 250g each)')
    expect(scaleQty('4 x 250ml', 2)).toBe('8 x 250ml')
    expect(scaleQty('400g can', 2)).toBe('2 x 400g cans')
    expect(scaleQty('400g can', 1.5)).toBe('1 1/2 x 400g cans')
    expect(scaleQty('2cm piece', 0.25)).toBe('1cm piece')
  })

  it('never rounds an ingredient away', () => {
    expect(friendly(0.05)).toBe('1/4')
    expect(friendly(0.9)).toBe('1')
    expect(friendly(12.4)).toBe('12')
  })
})
