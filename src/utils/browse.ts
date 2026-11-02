import type { Fruit, Month, Season } from '../types/fruit'
import { SEASONS } from '../types/fruit'
import { filterFruitsBySeason, isInSeason, isPeakSeason, searchFruits, sortBySeason } from './seasonality'

export type BrowseFilter = 'peak' | 'inSeason' | Season | 'yearRound'

export const BROWSE_FILTERS: { id: BrowseFilter; label: string }[] = [
  { id: 'peak', label: 'Peak now' },
  { id: 'inSeason', label: 'In season' },
  { id: 'Summer', label: 'Summer' },
  { id: 'Autumn', label: 'Autumn' },
  { id: 'Winter', label: 'Winter' },
  { id: 'Spring', label: 'Spring' },
  { id: 'yearRound', label: 'Year-round' },
]

export const isBrowseFilterOrNull = (v: unknown): v is BrowseFilter | null =>
  v === null || BROWSE_FILTERS.some(f => f.id === v)

export function browseFruits(fruits: Fruit[], query: string, filter: BrowseFilter | null, month: Month): Fruit[] {
  let list = searchFruits(fruits, query)
  if (filter === 'peak') list = list.filter(f => isPeakSeason(f, month))
  else if (filter === 'inSeason') list = list.filter(f => isInSeason(f, month))
  else if (filter === 'yearRound') list = list.filter(f => f.yearRound !== undefined)
  else if (filter && filter in SEASONS) list = filterFruitsBySeason(list, filter)
  return sortBySeason(list, month)
}
