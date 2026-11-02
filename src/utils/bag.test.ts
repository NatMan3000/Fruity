import { describe, expect, it } from 'vitest'
import { addFruit, addOther, addRecipe, bagText, clearDone, groupBag, isBag, remainingCount, removeItem, toggleDone } from './bag'
import type { Recipe } from '../types/recipe'

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

  it('groups fruit and other items, and lists them under headings when there are both', () => {
    const bag = addOther(addFruit(addOther([], 'Caster sugar', '150g'), mango), 'caster sugar ')
    expect(bag.map(i => i.id)).toEqual(['item:caster sugar', 'fruit:mango'])
    const { fruit, other } = groupBag(bag)
    expect(fruit.map(i => i.id)).toEqual(['fruit:mango'])
    expect(other.map(i => i.name)).toEqual(['Caster sugar'])
    expect(bagText(bag)).toBe('Fruity shopping list\n\nFruit\n- Mango\n\nOther\n- Caster sugar (150g)')
    expect(isBag(bag)).toBe(true)
  })

  it('adds a recipe: fruit once each with its amounts, the rest as plain items, water left out', () => {
    const recipe = {
      id: 'r', name: 'Test jam', fruitIds: ['mango', 'cherry'],
      ingredients: [
        { item: 'mangoes, chopped', qty: '2', fruitId: 'mango' },
        { item: 'cherries', qty: '200g', fruitId: 'cherry' },
        { item: 'mango juice', qty: '1/2 cup', fruitId: 'mango' },
        { item: 'caster sugar', qty: '150g' },
        { item: 'water', qty: '125ml' },
      ],
    } as unknown as Recipe
    const onlyFruit = addRecipe([], recipe, [mango, cherry], 2, 'fruit')
    expect(onlyFruit.map(i => [i.id, i.note])).toEqual([
      ['fruit:mango', '4 + 1 cup, for Test jam'],
      ['fruit:cherry', '400g, for Test jam'],
    ])
    const all = addRecipe(onlyFruit, recipe, [mango, cherry], 1, 'all')
    expect(all.map(i => i.id)).toEqual(['fruit:mango', 'fruit:cherry', 'item:caster sugar'])
    expect(all[0].note).toBe('4 + 1 cup, for Test jam') // already in the bag: left as it was
  })
})
