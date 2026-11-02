export const RECIPE_TYPES = ['breakfast', 'salad', 'main', 'dessert', 'drink', 'preserve', 'snack'] as const
export type RecipeType = (typeof RECIPE_TYPES)[number]

export interface Ingredient {
  item: string     // "yellow peaches, halved and stoned"
  qty: string      // "3", "1 1/2 tbsp", "to taste": scaled by src/utils/scale.ts
  fruitId?: string // a fruit from fruits.ts: it goes in the bag as that fruit
}

export interface Recipe {
  id: string
  name: string
  blurb: string
  fruitIds: string[]        // [0] is the main fruit: card colour, sticker, and the months it counts for
  type: RecipeType
  serves?: number           // portions; scaled by the serves stepper
  makes?: string            // "4 x 250 ml jars", "16 squares": shown instead of Serves, and not scaled
  minutes: { prep: number; cook: number }
  difficulty: 'easy' | 'medium' | 'hard'
  ingredients: Ingredient[]
  steps: string[]           // 3 to 8
  tip?: string
  keep?: string             // how to store it (preserves)
  swaps?: string[]          // "Out of season? Try:"
  tags: string[]            // 'kid-friendly', 'vegetarian', 'no-cook', ...
  reviewed: boolean         // a person has cooked or read it
}
