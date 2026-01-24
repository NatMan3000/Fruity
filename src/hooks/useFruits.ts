import { useMemo } from 'react'
import type { Fruit, Month, Season } from '../types/fruit'
import { FRUITS } from '../assets/fruits'
import { filterFruitsBySeason, filterFruitsInSeason, searchFruits, isPeakSeason } from '../utils/seasonality'

interface UseFruitsOptions {
  searchQuery?: string
  season?: Season | null
  currentMonth: Month
  showOnlyInSeason?: boolean
}

interface UseFruitsResult {
  fruits: Fruit[]
  inSeasonCount: number
  peakSeasonCount: number
}

export function useFruits({
  searchQuery = '',
  season = null,
  currentMonth,
  showOnlyInSeason = false
}: UseFruitsOptions): UseFruitsResult {
  return useMemo(() => {
    let filtered = [...FRUITS]

    // Apply search filter
    if (searchQuery) {
      filtered = searchFruits(filtered, searchQuery)
    }

    // Apply season filter
    if (season) {
      filtered = filterFruitsBySeason(filtered, season)
    }

    // Apply in-season filter
    if (showOnlyInSeason) {
      filtered = filterFruitsInSeason(filtered, currentMonth)
    }

    // Sort: peak season first, then available, then alphabetical
    filtered.sort((a, b) => {
      const aIsPeak = isPeakSeason(a, currentMonth)
      const bIsPeak = isPeakSeason(b, currentMonth)

      if (aIsPeak && !bIsPeak) return -1
      if (!aIsPeak && bIsPeak) return 1

      return a.name.localeCompare(b.name)
    })

    // Calculate counts
    const inSeasonCount = filtered.filter(f =>
      f.seasonality.peak.includes(currentMonth) ||
      f.seasonality.available.includes(currentMonth)
    ).length

    const peakSeasonCount = filtered.filter(f =>
      f.seasonality.peak.includes(currentMonth)
    ).length

    return {
      fruits: filtered,
      inSeasonCount,
      peakSeasonCount
    }
  }, [searchQuery, season, currentMonth, showOnlyInSeason])
}
