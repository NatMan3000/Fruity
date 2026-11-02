import { describe, expect, it } from 'vitest'
import { addFruit, bagText, clearDone, isBag, remainingCount, removeItem, toggleDone } from './bag'

describe('bag', () => {
  const mango = { id: 'mango', name: 'Mango' }
  const cherry = { id: 'cherry', name: 'Cherry' }

  it('adds each fruit once, ticks, clears ticked and removes', () => {
    let bag = addFruit(addFruit(addFruit([], mango), cherry), mango)
    expect(bag.map(i => i.id)).toEqual(['fruit:mango', 'fruit:cherry'])
    bag = toggleDone(bag, 'fruit:mango')
    expect(remainingCount(bag)).toBe(1)
    expect(bagText(bag)).toBe('Fruity shopping list\n- Cherry')
    expect(clearDone(bag).map(i => i.id)).toEqual(['fruit:cherry'])
    expect(removeItem(bag, 'fruit:cherry').map(i => i.id)).toEqual(['fruit:mango'])
  })

  it('lists everything when all are ticked', () => {
    const bag = toggleDone(addFruit([], mango), 'fruit:mango')
    expect(bagText(bag)).toBe('Fruity shopping list\n- Mango')
  })

  it('rejects stored values that are not a bag', () => {
    expect(isBag([{ id: 'fruit:mango', name: 'Mango', fruitId: 'mango', done: false }])).toBe(true)
    expect(isBag([{ id: 'fruit:mango', name: 'Mango' }])).toBe(false)
    expect(isBag({})).toBe(false)
    expect(isBag(null)).toBe(false)
  })
})
