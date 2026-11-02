import type { Fruit, FruitSeasonality, Month, Season } from '../types/fruit'
import { SEASONS, MONTHS } from '../types/fruit'

export function getCurrentMonth(): Month {
  const monthIndex = new Date().getMonth()
  return MONTHS[monthIndex]
}

export function seasonOf(month: Month): Season {
  const entry = Object.entries(SEASONS).find(([, months]) => months.includes(month))
  return (entry?.[0] as Season) || 'Summer'
}

export function getCurrentSeason(): Season {
  return seasonOf(getCurrentMonth())
}

// Fruity is Victoria only (D7, 2 Nov 2026): the Victorian season is the season. Per-state
// overrides stay on file in fruits.ts but nothing reads them.
export function getSeasonality(fruit: Fruit): FruitSeasonality {
  return fruit.seasonality
}

// A fruit with no peak months (banana, coconut) is year-round: never peak, always available.
function isAlwaysAvailable(fruit: Fruit): boolean {
  return getSeasonality(fruit).peak.length === 0 && fruit.yearRound !== undefined
}

export function isInSeason(fruit: Fruit, month: Month): boolean {
  if (isAlwaysAvailable(fruit)) return true
  const { peak, available } = getSeasonality(fruit)
  return peak.includes(month) || available.includes(month)
}

export function isPeakSeason(fruit: Fruit, month: Month): boolean {
  return getSeasonality(fruit).peak.includes(month)
}

export function getMonthsForSeason(season: Season): Month[] {
  return SEASONS[season]
}

export function filterFruitsBySeason(fruits: Fruit[], season: Season): Fruit[] {
  const seasonMonths = SEASONS[season]
  return fruits.filter(fruit => seasonMonths.some(m => isInSeason(fruit, m)))
}

export function filterFruitsInSeason(fruits: Fruit[], month: Month): Fruit[] {
  return fruits.filter(fruit => isInSeason(fruit, month))
}

export function searchFruits(fruits: Fruit[], query: string): Fruit[] {
  const lowerQuery = query.toLowerCase().trim()
  if (!lowerQuery) return fruits

  return fruits.filter(fruit =>
    fruit.name.toLowerCase().includes(lowerQuery)
  )
}

export function monthOffset(month: Month, by: number): Month {
  return MONTHS[(MONTHS.indexOf(month) + by + 12) % 12]
}

// In shops all year with no peak (banana, coconut): kept out of Buy now, Just landed and Ending soon.
export function isYearRound(fruit: Fruit): boolean {
  return isAlwaysAvailable(fruit)
}

export type SeasonLevel = 'peak' | 'available' | 'off'

export function monthLevel(fruit: Fruit, month: Month): SeasonLevel {
  if (isPeakSeason(fruit, month)) return 'peak'
  return isInSeason(fruit, month) ? 'available' : 'off'
}

// Entered peak, or came into season, this month.
export function isArriving(fruit: Fruit, month: Month): boolean {
  if (isYearRound(fruit)) return false
  const prev = monthOffset(month, -1)
  return (isInSeason(fruit, month) && !isInSeason(fruit, prev)) ||
    (isPeakSeason(fruit, month) && !isPeakSeason(fruit, prev))
}

// This month is the last month it is in season (peak or available).
export function isEnding(fruit: Fruit, month: Month): boolean {
  if (isYearRound(fruit)) return false
  return isInSeason(fruit, month) && !isInSeason(fruit, monthOffset(month, 1))
}

export type FruitStatus = 'peak' | 'ending' | 'available' | 'always' | 'off'

export function fruitStatus(fruit: Fruit, month: Month): FruitStatus {
  if (isYearRound(fruit)) return 'always'
  if (isPeakSeason(fruit, month)) return 'peak'
  if (isEnding(fruit, month)) return 'ending'
  return isInSeason(fruit, month) ? 'available' : 'off'
}

export interface NowSections {
  buyNow: Fruit[]     // at peak this month; last-month and new arrivals first
  justLanded: Fruit[] // came into season this month, not yet at peak
  endingSoon: Fruit[] // last month in season, not at peak
}

// The Now screen. Each fruit appears once: a peak fruit that is new or ending stays in Buy now
// (its row says so), so the screen never repeats itself. Year-round fruit never appears.
export function nowSections(fruits: Fruit[], month: Month): NowSections {
  const byName = (a: Fruit, b: Fruit) => a.name.localeCompare(b.name)
  const rank = (f: Fruit) => (isEnding(f, month) ? 0 : isArriving(f, month) ? 1 : 2)
  const seasonal = fruits.filter(f => !isYearRound(f))
  const peak = seasonal.filter(f => isPeakSeason(f, month))
  return {
    buyNow: [...peak].sort((a, b) => rank(a) - rank(b) || byName(a, b)),
    justLanded: seasonal.filter(f => !isPeakSeason(f, month) && isArriving(f, month)).sort(byName),
    endingSoon: seasonal.filter(f => !isPeakSeason(f, month) && isEnding(f, month)).sort(byName),
  }
}

const STATUS_ORDER: Record<FruitStatus, number> = { peak: 0, ending: 1, available: 2, always: 3, off: 4 }

export function sortBySeason(fruits: Fruit[], month: Month): Fruit[] {
  return [...fruits].sort((a, b) =>
    STATUS_ORDER[fruitStatus(a, month)] - STATUS_ORDER[fruitStatus(b, month)] ||
    a.name.localeCompare(b.name))
}

// "Dec to Feb", "Oct, Nov, Mar", "all year". Runs wrap around the year end.
export function describeMonths(months: Month[]): string {
  if (months.length === 0) return ''
  if (months.length === 12) return 'all year'
  const has = new Set(months)
  // Start scanning just after a gap so a Dec-Jan run is not split.
  const start = MONTHS.findIndex((m, i) => has.has(m) && !has.has(MONTHS[(i + 11) % 12]))
  const runs: Month[][] = []
  for (let k = 0; k < 12; k++) {
    const m = MONTHS[(start + k) % 12]
    if (!has.has(m)) continue
    const last = runs[runs.length - 1]
    if (last && last[last.length - 1] === monthOffset(m, -1)) last.push(m)
    else runs.push([m])
  }
  return runs.map(r => (r.length >= 3 ? `${r[0]} to ${r[r.length - 1]}` : r.join(', '))).join(', ')
}
