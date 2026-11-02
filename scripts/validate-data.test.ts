import { describe, expect, it } from 'vitest'
import { validateFruits, validateRecipes } from './validate-data'
import { FRUITS } from '../src/assets/fruits'
import { RECIPES } from '../src/assets/recipes'

const good = {
  id: 'x', name: 'X', emoji: 'x', colour: '#FF9F1C', image: 'images/fruits/x',
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
      { ...good, id: 'badcolour', colour: 'orange' },
    ]
    const errors = validateFruits([good, ...broken], always, now).join('\n')
    for (const id of ['badmonth', 'both', 'x:', 'empty', 'badpair', 'badrecipe',
      'onesource', 'stale', 'nodate', 'noconf', 'badstate', 'overlap', 'badcolour']) {
      expect(errors).toContain(id)
    }
  })

  it('fails on a missing image file', () => {
    expect(validateFruits([good], () => false, now).join()).toContain('missing image file')
  })
})

describe('validateRecipes', () => {
  const recipe = RECIPES.find(r => r.id === 'cherry-clafoutis')!

  it('accepts the real recipes', () => {
    expect(validateRecipes(RECIPES, FRUITS)).toEqual([])
  })

  it('fails on every kind of broken recipe', () => {
    const broken = [
      { ...recipe, id: 'badfruit', fruitIds: ['cherry', 'durian'] },
      { ...recipe, id: 'badingfruit', ingredients: [...recipe.ingredients, { item: 'x', qty: '1', fruitId: 'durian' }] },
      { ...recipe, id: 'twosteps', steps: recipe.steps.slice(0, 2) },
      { ...recipe, id: 'ninesteps', steps: [...recipe.steps, ...recipe.steps].slice(0, 9) },
      { ...recipe, id: 'noserves', serves: undefined, makes: undefined },
      { ...recipe, id: 'endash', blurb: 'Soft, eggy and sweet \u2013 a French classic.' },
      { ...recipe, id: 'emdash', steps: [...recipe.steps.slice(0, 3), 'Bake \u2014 then cool.'] },
      { ...recipe, id: 'nofan', steps: [...recipe.steps.slice(0, 3), 'Heat the oven to 180°C.'] },
    ]
    const errors = validateRecipes([...RECIPES, ...broken], FRUITS).join('\n')
    for (const [id, msg] of [['badfruit', 'unknown fruitId "durian"'], ['badingfruit', 'unknown fruitId'], ['twosteps', '3 to 8 steps'],
      ['ninesteps', '3 to 8 steps'], ['noserves', 'serves'], ['endash', 'Unicode dash'], ['emdash', 'Unicode dash'], ['nofan', 'fan-forced']]) {
      expect(errors).toMatch(new RegExp(`${id}: .*${msg.replace(/[()]/g, '.')}`))
    }
  })

  it('fails a month with fewer than 3 recipes whose main fruit is at peak', () => {
    const noSpring = RECIPES.filter(r => !['strawberry', 'rhubarb'].includes(r.fruitIds[0]))
    const errors = validateRecipes(noSpring, FRUITS)
    expect(errors).toContain('Oct: only 2 recipe(s) whose main fruit is at its Victorian peak (need 3)')
  })
})

