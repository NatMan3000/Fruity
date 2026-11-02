import { describe, expect, it } from 'vitest'
import { parseRoute, routeHash, tabFor, type Route } from './route'

describe('route', () => {
  it('parses known hashes and falls back to Now', () => {
    expect(parseRoute('')).toEqual({ name: 'now' })
    expect(parseRoute('#/')).toEqual({ name: 'now' })
    expect(parseRoute('#/fruit')).toEqual({ name: 'browse' })
    expect(parseRoute('#/fruit/')).toEqual({ name: 'browse' })
    expect(parseRoute('#/fruit/mango')).toEqual({ name: 'fruit', id: 'mango' })
    expect(parseRoute('#/fruit/year')).toEqual({ name: 'year' })
    expect(parseRoute('#/cook')).toEqual({ name: 'cook' })
    expect(parseRoute('#/play')).toEqual({ name: 'play' })
    expect(parseRoute('#/play/quiz')).toEqual({ name: 'quiz' })
    expect(parseRoute('#/play/salad')).toEqual({ name: 'salad' })
    expect(parseRoute('#/play/nonsense')).toEqual({ name: 'play' })
    expect(parseRoute('#/nonsense')).toEqual({ name: 'now' })
  })

  it('keeps Phase 0 deep links working', () => {
    expect(parseRoute('#/calendar')).toEqual({ name: 'year' })
    expect(parseRoute('#/quiz')).toEqual({ name: 'quiz' })
    expect(parseRoute('#/salad')).toEqual({ name: 'salad' })
  })

  it('round-trips every route', () => {
    const routes: Route[] = [
      { name: 'now' }, { name: 'browse' }, { name: 'year' }, { name: 'cook' },
      { name: 'play' }, { name: 'quiz' }, { name: 'salad' }, { name: 'fruit', id: 'dragon-fruit' },
    ]
    for (const r of routes) expect(parseRoute(routeHash(r))).toEqual(r)
  })

  it('maps routes to their tab', () => {
    expect(tabFor({ name: 'fruit', id: 'mango' })).toBe('fruit')
    expect(tabFor({ name: 'year' })).toBe('fruit')
    expect(tabFor({ name: 'salad' })).toBe('play')
    expect(tabFor({ name: 'now' })).toBe('now')
  })
})
