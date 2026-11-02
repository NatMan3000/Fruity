import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Fruit } from '../types/fruit'
import {
  filterFruitsBySeason, filterFruitsInSeason, getCurrentMonth, getCurrentSeason,
  isInSeason, isPeakSeason, searchFruits,
} from './seasonality'

const fruit = (id: string, peak: Fruit['seasonality']['peak'], available: Fruit['seasonality']['available']): Fruit => ({
  id, name: id[0].toUpperCase() + id.slice(1), emoji: '', seasonality: { peak, available },
})
const mango = fruit('mango', ['Dec', 'Jan'], ['Nov'])
const apple = fruit('apple', ['Apr'], ['May'])

afterEach(() => vi.useRealTimers())

describe('seasonality', () => {
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
