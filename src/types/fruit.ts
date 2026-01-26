export type Month =
  | 'Jan' | 'Feb' | 'Mar' | 'Apr' | 'May' | 'Jun'
  | 'Jul' | 'Aug' | 'Sep' | 'Oct' | 'Nov' | 'Dec'

export type Season = 'Summer' | 'Autumn' | 'Winter' | 'Spring'

export interface FruitSeasonality {
  peak: Month[]      // Prime season months
  available: Month[] // Available but not peak
}

export interface NutritionalInfo {
  calories: number        // per 100g
  vitaminC?: number      // mg per 100g
  fiber?: number         // g per 100g
  highlights: string[]   // e.g., ['High in Vitamin C', 'Good fiber source']
}

export interface RecipeSuggestion {
  name: string
  type: 'smoothie' | 'dessert' | 'salad' | 'preserve' | 'snack' | 'breakfast'
  description: string
}

export interface Fruit {
  id: string
  name: string
  emoji: string
  seasonality: FruitSeasonality
  notes?: string
  nutrition?: NutritionalInfo
  pairings?: string[]           // Flavor pairings: ['chocolate', 'mint', 'cream']
  recipes?: RecipeSuggestion[]  // Quick recipe ideas
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
