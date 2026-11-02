import { describe, expect, it } from 'vitest'
import { parseRoute, routeHash } from './route'

describe('route', () => {
  it('parses known hashes and falls back to browse', () => {
    expect(parseRoute('')).toEqual({ name: 'browse' })
    expect(parseRoute('#/')).toEqual({ name: 'browse' })
    expect(parseRoute('#/fruit/mango')).toEqual({ name: 'fruit', id: 'mango' })
    expect(parseRoute('#/fruit/')).toEqual({ name: 'browse' })
    expect(parseRoute('#/calendar')).toEqual({ name: 'calendar' })
    expect(parseRoute('#/nonsense')).toEqual({ name: 'browse' })
  })

  it('round-trips', () => {
    for (const r of [{ name: 'salad' }, { name: 'quiz' }, { name: 'fruit', id: 'dragon-fruit' }] as const) {
      expect(parseRoute(routeHash(r))).toEqual(r)
    }
  })
})
