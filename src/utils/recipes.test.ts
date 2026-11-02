import { describe, expect, it } from 'vitest'
import { FRUITS } from '../assets/fruits'
import { RECIPES } from '../assets/recipes'
import { MONTHS } from '../types/fruit'
import { atPeak, cookThisWeek, realRecipeFor, filterRecipes, formatMinutes, recipesForFruit, stepIngredients, stepTimers } from './recipes'

describe('cookThisWeek', () => {
  it('gives the same three in the same week, on any phone', () => {
    for (const m of MONTHS) {
      const a = cookThisWeek(RECIPES, FRUITS, m, 2026, 44).map(r => r.id)
      const b = cookThisWeek([...RECIPES].reverse(), FRUITS, m, 2026, 44).map(r => r.id)
      expect(a).toEqual(b)
      expect(a).toHaveLength(3)
    }
  })

  it('only picks recipes whose main fruit is at peak, with different main fruit', () => {
    const picks = cookThisWeek(RECIPES, FRUITS, 'Jan', 2026, 3)
    expect(picks.every(r => atPeak(r, FRUITS, 'Jan'))).toBe(true)
    expect(new Set(picks.map(r => r.fruitIds[0])).size).toBe(3)
  })

  it('changes over the weeks of a month', () => {
    const weeks = [0, 1, 2, 3, 4].map(w => cookThisWeek(RECIPES, FRUITS, 'Jan', 2026, w).map(r => r.id).join())
    expect(new Set(weeks).size).toBeGreaterThan(1)
  })
})

describe('filterRecipes', () => {
  it('In season keeps recipes whose main fruit is in the shops, peak first', () => {
    const list = filterRecipes(RECIPES, FRUITS, 'Oct', { view: 'season', type: null, kids: false }, [])
    expect(list.length).toBeGreaterThan(0)
    expect(atPeak(list[0], FRUITS, 'Oct')).toBe(true)
    expect(list.some(r => r.fruitIds[0] === 'cherry')).toBe(false)
  })

  it('filters by type and kid-friendly, and Saved keeps the saved order', () => {
    const desserts = filterRecipes(RECIPES, FRUITS, 'Oct', { view: 'all', type: 'dessert', kids: false }, [])
    expect(desserts.every(r => r.type === 'dessert')).toBe(true)
    const kids = filterRecipes(RECIPES, FRUITS, 'Oct', { view: 'all', type: null, kids: true }, [])
    expect(kids.every(r => r.tags.includes('kid-friendly'))).toBe(true)
    const saved = filterRecipes(RECIPES, FRUITS, 'Oct', { view: 'saved', type: null, kids: false }, ['banana-bread', 'nope', 'cherry-clafoutis'])
    expect(saved.map(r => r.id)).toEqual(['banana-bread', 'cherry-clafoutis'])
  })
})

describe('recipe helpers', () => {
  it('lists recipes for a fruit, main-fruit ones first', () => {
    const lemon = recipesForFruit(RECIPES, 'lemon')
    expect(lemon[0].fruitIds[0]).toBe('lemon')
    expect(lemon.some(r => r.fruitIds[0] !== 'lemon')).toBe(true)
  })

  it('finds the times in a step', () => {
    expect(stepTimers('Simmer for 15 to 20 minutes, then rest for 5 minutes.')).toEqual([
      { label: '15 to 20 minutes', seconds: 900 },
      { label: '5 minutes', seconds: 300 },
    ])
    expect(stepTimers('cook for 1 1/2 to 2 1/2 hours')).toEqual([{ label: '1 1/2 to 2 1/2 hours', seconds: 5400 }])
    expect(stepTimers('Add the sage for 30 seconds until crisp.')).toEqual([{ label: '30 seconds', seconds: 30 }])
    expect(stepTimers('Stand them on their fat edge for the last minute.')).toEqual([])
  })

  it('finds the ingredients a step mentions', () => {
    const pork = RECIPES.find(r => r.id === 'pork-cutlets-grilled-peaches-sage-butter')!
    const names = (i: number) => stepIngredients(pork.steps[i], pork.ingredients).map(j => pork.ingredients[j].item.split(',')[0])
    expect(names(1)).toEqual(['yellow peaches', 'olive oil'])
    expect(names(4)).toEqual(['butter', 'sage leaves'])
  })

  it('formats times', () => {
    expect(formatMinutes(25)).toBe('25 min')
    expect(formatMinutes(75)).toBe('1 hr 15 min')
    expect(formatMinutes(180)).toBe('3 hr')
  })
})

describe('realRecipeFor', () => {
  it('finds a fresh recipe built on a bowl fruit, and nothing when there is none', () => {
    expect(realRecipeFor(RECIPES, ['watermelon', 'banana'])?.id).toBe('watermelon-feta-mint-salad')
    expect(realRecipeFor(RECIPES, ['tangelo'])).toBeUndefined()
  })
})

