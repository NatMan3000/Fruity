import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Fruit } from '../types/fruit'
import {
  filterFruitsBySeason, filterFruitsInSeason, getCurrentMonth, getCurrentSeason,
  isInSeason, isPeakSeason, searchFruits, nowSections, fruitStatus, describeMonths,
} from './seasonality'

const fruit = (id: string, peak: Fruit['seasonality']['peak'], available: Fruit['seasonality']['available']): Fruit => ({
  id, name: id[0].toUpperCase() + id.slice(1), emoji: '', seasonality: { peak, available },
  sources: [], checkedOn: '2026-11-02', confidence: 'high',
})
const mango = fruit('mango', ['Dec', 'Jan'], ['Nov'])
const apple = fruit('apple', ['Apr'], ['May'])

afterEach(() => vi.useRealTimers())

const ALL: Fruit['seasonality']['available'] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

describe('seasonality', () => {
  it('year-round fruit is never peak and always available', () => {
    const banana: Fruit = { ...fruit('banana', [], ALL), yearRound: 'grown' }
    for (const m of ALL) {
      expect(isPeakSeason(banana, m)).toBe(false)
      expect(isInSeason(banana, m)).toBe(true)
    }
  })

  it('stored fruit stays available outside peak', () => {
    const stored: Fruit = { ...fruit('apple', ['Mar', 'Apr'], ['May', 'Aug']), yearRound: 'stored' }
    expect(isInSeason(stored, 'Aug')).toBe(true)
    expect(isPeakSeason(stored, 'Aug')).toBe(false)
  })

  it('a state override changes the result for that state only', () => {
    const f: Fruit = { ...fruit('mango', ['Jan'], ['Feb']), stateOverrides: { QLD: { peak: ['Oct'], available: ['Nov'] } } }
    expect(isPeakSeason(f, 'Oct')).toBe(false)
    expect(isPeakSeason(f, 'Oct', 'VIC')).toBe(false)
    expect(isPeakSeason(f, 'Oct', 'QLD')).toBe(true)
    expect(isInSeason(f, 'Jan', 'QLD')).toBe(false)
    expect(isPeakSeason(f, 'Jan', 'NSW')).toBe(true)
  })

  it('peak implies in season, available is in season but not peak', () => {
    expect(isPeakSeason(mango, 'Jan')).toBe(true)
    expect(isInSeason(mango, 'Nov')).toBe(true)
    expect(isPeakSeason(mango, 'Nov')).toBe(false)
    expect(isInSeason(mango, 'Jul')).toBe(false)
  })

  it('filters by month and by season (Southern Hemisphere)', () => {
    expect(filterFruitsInSeason([mango, apple], 'Apr')).toEqual([apple])
    expect(filterFruitsBySeason([mango, apple], 'Summer')).toEqual([mango])
    expect(filterFruitsBySeason([mango, apple], 'Autumn')).toEqual([apple])
  })

  it('searches case-insensitively and trims', () => {
    expect(searchFruits([mango, apple], '  MAN ')).toEqual([mango])
    expect(searchFruits([mango, apple], '')).toHaveLength(2)
  })

  it('maps the clock to month and season', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 6, 15))
    expect(getCurrentMonth()).toBe('Jul')
    expect(getCurrentSeason()).toBe('Winter')
  })
})

describe('Now screen sections', () => {
  const f = (id: string, peak: Fruit['seasonality']['peak'], available: Fruit['seasonality']['available'], extra: Partial<Fruit> = {}): Fruit =>
    ({ ...fruit(id, peak, available), ...extra })
  const fruits = [
    f('cherry', ['Dec', 'Jan'], ['Nov']),         // Nov: just landed (available, new)
    f('strawberry', ['Oct', 'Nov'], ['Sep']),     // Nov: peak, ending this month
    f('pineapple', ['Nov', 'Dec'], ['Oct']),      // Nov: peak, newly peak
    f('papaya', ['Oct', 'Nov', 'Dec'], ['Sep']),  // Nov: peak, mid-season
    f('lemon', ['Jul'], ['Oct', 'Nov']),          // Nov: available, last month
    f('banana', [], ALL, { yearRound: 'grown' }), // never on Now
    f('apple', ['Apr'], ['May']),                 // Nov: off
  ]

  it('splits fruit into exclusive sections and ranks Buy now', () => {
    const s = nowSections(fruits, 'Nov')
    expect(s.buyNow.map(x => x.id)).toEqual(['strawberry', 'pineapple', 'papaya'])
    expect(s.justLanded.map(x => x.id)).toEqual(['cherry'])
    expect(s.endingSoon.map(x => x.id)).toEqual(['lemon'])
    const all = [...s.buyNow, ...s.justLanded, ...s.endingSoon].map(x => x.id)
    expect(new Set(all).size).toBe(all.length)
    expect(all).not.toContain('banana')
  })

  it('uses the chosen state', () => {
    const mango = f('mango', ['Jan'], ['Dec', 'Feb'], { stateOverrides: { NT: { peak: ['Oct', 'Nov'], available: ['Sep', 'Dec'] } } })
    expect(nowSections([mango], 'Nov').buyNow).toEqual([])
    expect(nowSections([mango], 'Nov', 'NT').buyNow).toEqual([mango])
  })

  it('gives each fruit one status word', () => {
    expect(fruitStatus(fruits[1], 'Nov')).toBe('peak')
    expect(fruitStatus(fruits[4], 'Nov')).toBe('ending')
    expect(fruitStatus(fruits[0], 'Nov')).toBe('available')
    expect(fruitStatus(fruits[5], 'Nov')).toBe('always')
    expect(fruitStatus(fruits[6], 'Nov')).toBe('off')
  })

  it('describes month runs across the year end', () => {
    expect(describeMonths(['Dec', 'Jan', 'Feb'])).toBe('Dec to Feb')
    expect(describeMonths(['Oct', 'Nov', 'Mar'])).toBe('Mar, Oct, Nov')
    expect(describeMonths(['Jan', 'Dec'])).toBe('Dec, Jan')
    expect(describeMonths(ALL)).toBe('all year')
    expect(describeMonths([])).toBe('')
  })
})
