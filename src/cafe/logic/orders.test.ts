import { describe, expect, it } from 'vitest'
import { FRUITS } from '../../assets/fruits'
import type { Fruit, Month } from '../../types/fruit'
import { MONTHS } from '../../types/fruit'
import { checkBowl, generateOrder, hintFor, MAX_LEVEL, matches, orderSentence, seededRng, wantsFilled, type Order, type OrderContext } from './orders'
import { buildRecipe } from './recipe'
import { TRAITS, traitsOf } from './traits'
import { levelFor, newStickers, NEW_PROGRESS, scoreServe } from './progress'

const ctx: OrderContext = { month: 'Jan' }
const get = (...ids: string[]): Fruit[] => ids.map(id => {
  const f = FRUITS.find(x => x.id === id)
  if (!f) throw new Error(`no fruit ${id}`)
  return f
})

describe('cafe traits', () => {
  it('covers every fruit in the app', () => {
    for (const f of FRUITS) expect(TRAITS[f.id], f.id).toBeDefined()
    expect(Object.keys(TRAITS).sort()).toEqual(FRUITS.map(f => f.id).sort())
  })
})

describe('checkBowl', () => {
  const redAndRound: Pick<Order, 'wants' | 'avoid'> = {
    wants: [{ trait: { kind: 'colour', colour: 'red' }, count: 1 }, { trait: { kind: 'shape', shape: 'round' }, count: 1 }],
  }

  it('accepts a bowl that meets every want with different fruits', () => {
    expect(checkBowl(redAndRound, get('strawberry', 'orange'), ctx)).toEqual({ ok: true })
  })

  it('needs a separate fruit for each want, even if one fruit is both', () => {
    // An apple is red and round, but one apple cannot fill two wants.
    const r = checkBowl(redAndRound, get('apple'), ctx)
    expect(r.ok).toBe(false)
    expect(r.ok === false && r.reason).toBe('missing')
    expect(checkBowl(redAndRound, get('apple', 'banana'), ctx).ok).toBe(false)
    expect(checkBowl(redAndRound, get('apple', 'cherry'), ctx)).toEqual({ ok: true })
  })

  it('finds the matching even when the first choice would block it', () => {
    // Apple must be the round one so strawberry can be the red one; a greedy check fails here.
    expect(checkBowl(redAndRound, get('apple', 'strawberry'), ctx)).toEqual({ ok: true })
  })

  it('counts each fruit once however many times it is dropped in', () => {
    const twoRed = { wants: [{ trait: { kind: 'colour', colour: 'red' } as const, count: 2 }] }
    expect(checkBowl(twoRed, get('cherry', 'cherry'), ctx).ok).toBe(false)
    expect(checkBowl(twoRed, get('cherry', 'strawberry'), ctx)).toEqual({ ok: true })
  })

  it('rejects a fruit the order says to leave out, naming it', () => {
    const noPips = { wants: [{ trait: { kind: 'any' } as const, count: 2 }], avoid: { kind: 'pips' } as const }
    expect(checkBowl(noPips, get('banana', 'strawberry'), ctx)).toEqual({ ok: true })
    expect(checkBowl(noPips, get('banana', 'grape'), ctx)).toEqual({ ok: false, reason: 'avoid', fruitId: 'grape' })
  })

  it('flags fruit that needs cooking and an empty bowl', () => {
    const any = { wants: [{ trait: { kind: 'any' } as const, count: 1 }] }
    expect(checkBowl(any, [], ctx)).toEqual({ ok: false, reason: 'empty' })
    expect(checkBowl(any, get('rhubarb', 'banana'), ctx)).toEqual({ ok: false, reason: 'cooking', fruitId: 'rhubarb' })
  })

  it('reports which want is still missing', () => {
    const order: Pick<Order, 'wants' | 'avoid'> = { wants: [{ trait: { kind: 'fruit', id: 'banana' }, count: 1 }, { trait: { kind: 'colour', colour: 'purple' }, count: 1 }] }
    const r = checkBowl(order, get('banana', 'lemon'), ctx)
    expect(r).toEqual({ ok: false, reason: 'missing', want: order.wants[1] })
    expect(hintFor(r, order, FRUITS)).toBe('Nearly! I still need something purple.')
  })

  it('ticks each want on the bubble only when it has its own fruit', () => {
    expect(wantsFilled(redAndRound, get('apple'), ctx).reduce((a, b) => a + b)).toBe(1)
    expect(wantsFilled(redAndRound, get('apple', 'strawberry'), ctx)).toEqual([1, 1])
    expect(wantsFilled(redAndRound, [], ctx)).toEqual([0, 0])
    const three = { wants: [{ trait: { kind: 'any' } as const, count: 3 }] }
    expect(wantsFilled(three, get('apple', 'banana'), ctx)).toEqual([2])
  })

  it('uses the real seasons for season and fresh-now wants', () => {
    const summer = { wants: [{ trait: { kind: 'season', season: 'Summer' } as const, count: 1 }] }
    expect(checkBowl(summer, get('mango'), ctx).ok).toBe(true)
    expect(checkBowl(summer, get('banana'), ctx).ok).toBe(false) // all year, never "a summer fruit"
    const fresh = { kind: 'fresh' } as const
    expect(matches(fresh, get('mango')[0], { month: 'Jan' })).toBe(true)
    expect(matches(fresh, get('mango')[0], { month: 'Jul' })).toBe(false)
    expect(matches(fresh, get('banana')[0], ctx)).toBe(false)
  })
})

describe('generateOrder', () => {
  it('always offers an answer on the shelf, at every level and month', () => {
    let n = 0
    for (let level = 1; level <= MAX_LEVEL; level++) {
      for (const month of MONTHS as Month[]) {
        for (let seed = 1; seed <= 25; seed++) {
          const c = { month }
          const order = generateOrder(level, FRUITS, c, seededRng(seed * 101 + level))
          const shelf = get(...order.shelf)
          expect(new Set(order.shelf).size).toBe(order.shelf.length)
          expect(order.shelf.length).toBeGreaterThanOrEqual(8)
          // The whole shelf minus the forbidden and raw fruit must contain an answer.
          const usable = shelf.filter(f => traitsOf(f.id).rawOk && !(order.avoid && matches(order.avoid, f, c)))
          expect(checkBowl(order, usable, c), `${level} ${month} ${seed} ${orderSentence(order, FRUITS)}`).toEqual({ ok: true })
          n++
        }
      }
    }
    expect(n).toBe(MAX_LEVEL * 12 * 25)
  })

  it('is repeatable from a seed', () => {
    const a = generateOrder(3, FRUITS, ctx, seededRng(7))
    const b = generateOrder(3, FRUITS, ctx, seededRng(7))
    expect(a).toEqual(b)
  })

  it('keeps level 1 to one or two simple things and adds "no ..." rules later', () => {
    for (let seed = 1; seed <= 60; seed++) {
      const easy = generateOrder(1, FRUITS, ctx, seededRng(seed))
      expect(easy.avoid).toBeUndefined()
      expect(easy.wants.reduce((s, w) => s + w.count, 0)).toBeLessThanOrEqual(2)
      expect(easy.wants.every(w => w.trait.kind === 'fruit' || w.trait.kind === 'colour')).toBe(true)
    }
    const hard = Array.from({ length: 60 }, (_, i) => generateOrder(6, FRUITS, ctx, seededRng(i + 1)))
    expect(hard.some(o => o.avoid)).toBe(true)
  })

  it('reads as a sentence a kid can follow', () => {
    expect(orderSentence({
      wants: [{ trait: { kind: 'colour', colour: 'red' }, count: 1 }, { trait: { kind: 'season', season: 'Summer' }, count: 2 }],
      avoid: { kind: 'pips' },
    }, FRUITS)).toBe('Something red and two summer fruits, but no fruit with pips')
    expect(orderSentence({ wants: [{ trait: { kind: 'fruit', id: 'apple' }, count: 1 }, { trait: { kind: 'fruit', id: 'blueberry' }, count: 1 }] }, FRUITS))
      .toBe('An apple and some blueberries')
  })
})

describe('progress', () => {
  it('scores stars and levels', () => {
    expect(scoreServe(false, false).stars).toBe(1)
    expect(scoreServe(true, true).stars).toBe(3)
    expect(levelFor(0)).toBe(1)
    expect(levelFor(5)).toBe(2)
    expect(levelFor(999)).toBe(6)
  })

  it('gives each sticker once', () => {
    const p = { ...NEW_PROGRESS, stickers: ['fruit:mango'] }
    expect(newStickers(p, ['mango', 'banana'], 'koala', 2)).toEqual(['fruit:banana'])
    expect(newStickers(p, ['mango'], 'koala', 3)).toEqual(['friend:koala'])
  })
})

describe('buildRecipe', () => {
  it('makes four steps and a dressing from the pairings, skipping fruit already in the bowl', () => {
    const r = buildRecipe(get('mango', 'banana', 'lime'), 'Jan', FRUITS)
    expect(r.steps).toHaveLength(4)
    expect(r.dressing).not.toMatch(/lime/i)
    expect(r.dressing).toMatch(/dressing$/)
    expect(r.ingredients.slice(0, 3).map(i => i.fruitId)).toEqual(['mango', 'banana', 'lime'])
  })

  it('suggests an in-season swap for out-of-season fruit', () => {
    const r = buildRecipe(get('cherry'), 'Jul', FRUITS)
    expect(r.outOfSeason.map(o => o.fruit.id)).toEqual(['cherry'])
    expect(r.outOfSeason[0].swap).toBeDefined()
  })
})
