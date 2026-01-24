export type Month =
  | 'Jan' | 'Feb' | 'Mar' | 'Apr' | 'May' | 'Jun'
  | 'Jul' | 'Aug' | 'Sep' | 'Oct' | 'Nov' | 'Dec'

export type Season = 'Summer' | 'Autumn' | 'Winter' | 'Spring'

export interface FruitSeasonality {
  peak: Month[]      // Prime season months
  available: Month[] // Available but not peak
}

export interface Fruit {
  id: string
  name: string
  emoji: string
  seasonality: FruitSeasonality
  notes?: string
}

export const MONTHS: Month[] = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

export const SEASONS: Record<Season, Month[]> = {
  Summer: ['Dec', 'Jan', 'Feb'],
  Autumn: ['Mar', 'Apr', 'May'],
  Winter: ['Jun', 'Jul', 'Aug'],
  Spring: ['Sep', 'Oct', 'Nov']
}
