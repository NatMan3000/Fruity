import { useState } from 'react'
import clsx from 'clsx'
import type { Fruit, Month, RecipeSuggestion } from '../types/fruit'
import { isPeakSeason } from '../utils/seasonality'

interface RecipeSuggestionsProps {
  fruits: Fruit[]
  currentMonth: Month
  onFruitClick?: (fruitId: string) => void
}

interface RecipeWithFruit extends RecipeSuggestion {
  fruit: Fruit
}

export function RecipeSuggestions({ fruits, currentMonth, onFruitClick }: RecipeSuggestionsProps) {
  // Pick 3-6 random recipes from fruits in peak season, once per mount
  const [selectedRecipes] = useState<RecipeWithFruit[]>(() => {
    const all: RecipeWithFruit[] = []
    fruits.forEach((fruit) => {
      if (isPeakSeason(fruit, currentMonth) && fruit.recipes) {
        fruit.recipes.forEach((recipe) => all.push({ ...recipe, fruit }))
      }
    })
    return all.sort(() => Math.random() - 0.5).slice(0, 6)
  })

  if (selectedRecipes.length === 0) return null

  const typeColors: Record<RecipeSuggestion['type'], string> = {
    smoothie: 'bg-purple-100 text-purple-700',
    dessert: 'bg-pink-100 text-pink-700',
    salad: 'bg-green-100 text-green-700',
    preserve: 'bg-amber-100 text-amber-700',
    snack: 'bg-blue-100 text-blue-700',
    breakfast: 'bg-orange-100 text-orange-700'
  }

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">
        🍳 What to Make This Month
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedRecipes.map((recipe, index) => (
          <div
            key={`${recipe.fruit.id}-${index}`}
            onClick={() => onFruitClick?.(recipe.fruit.id)}
            className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start gap-3 mb-2">
              <span className="text-2xl">{recipe.fruit.emoji}</span>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm">
                  {recipe.name}
                </h3>
                <span
                  className={clsx(
                    'inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium',
                    typeColors[recipe.type]
                  )}
                >
                  {recipe.type}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              {recipe.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
