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
