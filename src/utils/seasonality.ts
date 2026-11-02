import type { AusState, Fruit, FruitSeasonality, Month, Season } from '../types/fruit'
import { SEASONS, MONTHS } from '../types/fruit'

export function getCurrentMonth(): Month {
  const monthIndex = new Date().getMonth()
  return MONTHS[monthIndex]
}

export function getCurrentSeason(): Season {
  const month = getCurrentMonth()
  const entry = Object.entries(SEASONS).find(([, months]) =>
    months.includes(month)
  )
  return (entry?.[0] as Season) || 'Summer'
}

export function getSeasonality(fruit: Fruit, state: AusState = 'VIC'): FruitSeasonality {
  return fruit.stateOverrides?.[state] ?? fruit.seasonality
}

// A fruit with no peak months (banana, coconut) is year-round: never peak, always available.
function isAlwaysAvailable(fruit: Fruit, state: AusState): boolean {
  return getSeasonality(fruit, state).peak.length === 0 && fruit.yearRound !== undefined
}

export function isInSeason(fruit: Fruit, month: Month, state: AusState = 'VIC'): boolean {
  if (isAlwaysAvailable(fruit, state)) return true
  const { peak, available } = getSeasonality(fruit, state)
  return peak.includes(month) || available.includes(month)
}

export function isPeakSeason(fruit: Fruit, month: Month, state: AusState = 'VIC'): boolean {
  return getSeasonality(fruit, state).peak.includes(month)
}

export function getMonthsForSeason(season: Season): Month[] {
  return SEASONS[season]
}

export function filterFruitsBySeason(fruits: Fruit[], season: Season, state: AusState = 'VIC'): Fruit[] {
  const seasonMonths = SEASONS[season]
  return fruits.filter(fruit => seasonMonths.some(m => isInSeason(fruit, m, state)))
}

export function filterFruitsInSeason(fruits: Fruit[], month: Month, state: AusState = 'VIC'): Fruit[] {
  return fruits.filter(fruit => isInSeason(fruit, month, state))
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
export function isYearRound(fruit: Fruit, state: AusState = 'VIC'): boolean {
  return isAlwaysAvailable(fruit, state)
}

export type SeasonLevel = 'peak' | 'available' | 'off'

export function monthLevel(fruit: Fruit, month: Month, state: AusState = 'VIC'): SeasonLevel {
  if (isPeakSeason(fruit, month, state)) return 'peak'
  return isInSeason(fruit, month, state) ? 'available' : 'off'
}

// Entered peak, or came into season, this month.
export function isArriving(fruit: Fruit, month: Month, state: AusState = 'VIC'): boolean {
  if (isYearRound(fruit, state)) return false
  const prev = monthOffset(month, -1)
  return (isInSeason(fruit, month, state) && !isInSeason(fruit, prev, state)) ||
    (isPeakSeason(fruit, month, state) && !isPeakSeason(fruit, prev, state))
}

// This month is the last month it is in season (peak or available).
export function isEnding(fruit: Fruit, month: Month, state: AusState = 'VIC'): boolean {
  if (isYearRound(fruit, state)) return false
  return isInSeason(fruit, month, state) && !isInSeason(fruit, monthOffset(month, 1), state)
}

export type FruitStatus = 'peak' | 'ending' | 'available' | 'always' | 'off'

export function fruitStatus(fruit: Fruit, month: Month, state: AusState = 'VIC'): FruitStatus {
  if (isYearRound(fruit, state)) return 'always'
  if (isPeakSeason(fruit, month, state)) return 'peak'
  if (isEnding(fruit, month, state)) return 'ending'
  return isInSeason(fruit, month, state) ? 'available' : 'off'
}

export interface NowSections {
  buyNow: Fruit[]     // at peak this month; last-month and new arrivals first
  justLanded: Fruit[] // came into season this month, not yet at peak
  endingSoon: Fruit[] // last month in season, not at peak
}

// The Now screen. Each fruit appears once: a peak fruit that is new or ending stays in Buy now
// (its row says so), so the screen never repeats itself. Year-round fruit never appears.
export function nowSections(fruits: Fruit[], month: Month, state: AusState = 'VIC'): NowSections {
  const byName = (a: Fruit, b: Fruit) => a.name.localeCompare(b.name)
  const rank = (f: Fruit) => (isEnding(f, month, state) ? 0 : isArriving(f, month, state) ? 1 : 2)
  const seasonal = fruits.filter(f => !isYearRound(f, state))
  const peak = seasonal.filter(f => isPeakSeason(f, month, state))
  return {
    buyNow: [...peak].sort((a, b) => rank(a) - rank(b) || byName(a, b)),
    justLanded: seasonal.filter(f => !isPeakSeason(f, month, state) && isArriving(f, month, state)).sort(byName),
    endingSoon: seasonal.filter(f => !isPeakSeason(f, month, state) && isEnding(f, month, state)).sort(byName),
  }
}

const STATUS_ORDER: Record<FruitStatus, number> = { peak: 0, ending: 1, available: 2, always: 3, off: 4 }

export function sortBySeason(fruits: Fruit[], month: Month, state: AusState = 'VIC'): Fruit[] {
  return [...fruits].sort((a, b) =>
    STATUS_ORDER[fruitStatus(a, month, state)] - STATUS_ORDER[fruitStatus(b, month, state)] ||
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
