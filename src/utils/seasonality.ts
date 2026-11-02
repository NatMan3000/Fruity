import type { Fruit, Month, Season } from '../types/fruit'
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

export function isInSeason(fruit: Fruit, month: Month): boolean {
  return fruit.seasonality.peak.includes(month) ||
         fruit.seasonality.available.includes(month)
}

export function isPeakSeason(fruit: Fruit, month: Month): boolean {
  return fruit.seasonality.peak.includes(month)
}

export function getMonthsForSeason(season: Season): Month[] {
  return SEASONS[season]
}

export function filterFruitsBySeason(fruits: Fruit[], season: Season): Fruit[] {
  const seasonMonths = SEASONS[season]
  return fruits.filter(fruit =>
    fruit.seasonality.peak.some(m => seasonMonths.includes(m)) ||
    fruit.seasonality.available.some(m => seasonMonths.includes(m))
  )
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
