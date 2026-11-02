export type Month =
  | 'Jan' | 'Feb' | 'Mar' | 'Apr' | 'May' | 'Jun'
  | 'Jul' | 'Aug' | 'Sep' | 'Oct' | 'Nov' | 'Dec'

export type Season = 'Summer' | 'Autumn' | 'Winter' | 'Spring'

export interface FruitSeasonality {
  peak: Month[]      // Prime season months
  available: Month[] // Available but not peak
}

export type AusState = 'VIC' | 'NSW' | 'ACT' | 'QLD' | 'SA' | 'WA' | 'TAS' | 'NT'

export const AUS_STATES: AusState[] = ['VIC', 'NSW', 'ACT', 'QLD', 'SA', 'WA', 'TAS', 'NT']

export interface FruitSource {
  name: string
  url: string
  says: string // What the source says, in a line
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
  image?: string                // Stem 'images/fruits/<id>'; files are <stem>-480.webp and <stem>-960.webp (scripts/build-images.ts)
  seasonality: FruitSeasonality // The Victorian season (default)
  stateOverrides?: Partial<Record<AusState, FruitSeasonality>> // Per-state seasons where they differ from Victoria
  yearRound?: 'stored' | 'imported' | 'grown' // Why a fruit is in shops outside its season
  variesByState?: boolean
  stateNote?: string            // How other states differ
  pick?: string                 // How to choose a good one
  storage?: string              // How to keep it
  sources: FruitSource[]
  checkedOn: string             // ISO date the season data was last checked
  confidence: 'high' | 'medium' | 'low'
  notes?: string
  origin?: string               // Where the fruit originates from
  history?: string              // Interesting historical facts
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
