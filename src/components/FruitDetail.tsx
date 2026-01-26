import { ArrowLeft } from 'lucide-react'
import type { Fruit, Month } from '../types/fruit'
import { MonthBadge } from './MonthBadge'
import { isPeakSeason, isInSeason } from '../utils/seasonality'

interface FruitDetailProps {
  fruit: Fruit
  currentMonth: Month
  onBack: () => void
}

export function FruitDetail({ fruit, currentMonth, onBack }: FruitDetailProps) {
  const inSeason = isInSeason(fruit, currentMonth)
  const isPeak = isPeakSeason(fruit, currentMonth)

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back</span>
      </button>

      {/* Hero section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start gap-4">
          <span className="text-6xl">{fruit.emoji}</span>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{fruit.name}</h1>
            {isPeak && (
              <span className="inline-block mt-1 px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
                Peak season now!
              </span>
            )}
            {inSeason && !isPeak && (
              <span className="inline-block mt-1 px-3 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-full">
                Available now
              </span>
            )}
            {!inSeason && (
              <span className="inline-block mt-1 px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                Out of season
              </span>
            )}
          </div>
        </div>

        {fruit.notes && (
          <p className="mt-4 text-gray-600">{fruit.notes}</p>
        )}

        {/* Season badges */}
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">When it's available</h3>
          <div className="flex flex-wrap gap-1">
            {fruit.seasonality.peak.map((month) => (
              <MonthBadge
                key={month}
                month={month}
                isPeak
                isCurrent={month === currentMonth}
              />
            ))}
            {fruit.seasonality.available.map((month) => (
              <MonthBadge
                key={month}
                month={month}
                isAvailable
                isCurrent={month === currentMonth}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Nutrition section */}
      {fruit.nutrition && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Nutrition</h2>
          <p className="text-xs text-gray-500 mb-3">Per 100g serving</p>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-blue-700">{fruit.nutrition.calories}</div>
              <div className="text-xs text-blue-600">calories</div>
            </div>
            {fruit.nutrition.vitaminC && (
              <div className="bg-orange-50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-orange-700">{fruit.nutrition.vitaminC}mg</div>
                <div className="text-xs text-orange-600">Vitamin C</div>
              </div>
            )}
            {fruit.nutrition.fiber && (
              <div className="bg-green-50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-green-700">{fruit.nutrition.fiber}g</div>
                <div className="text-xs text-green-600">fiber</div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {fruit.nutrition.highlights.map((highlight, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Pairings section */}
      {fruit.pairings && fruit.pairings.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pairs well with</h2>
          <div className="flex flex-wrap gap-2">
            {fruit.pairings.map((pairing) => (
              <span
                key={pairing}
                className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium"
              >
                {pairing}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recipes section */}
      {fruit.recipes && fruit.recipes.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recipe ideas</h2>
          <div className="space-y-4">
            {fruit.recipes.map((recipe) => (
              <div
                key={recipe.name}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl"
              >
                <span className="text-2xl">
                  {recipe.type === 'smoothie' && '🥤'}
                  {recipe.type === 'dessert' && '🍰'}
                  {recipe.type === 'salad' && '🥗'}
                  {recipe.type === 'preserve' && '🫙'}
                  {recipe.type === 'snack' && '🍿'}
                  {recipe.type === 'breakfast' && '🍳'}
                </span>
                <div>
                  <h3 className="font-semibold text-gray-900">{recipe.name}</h3>
                  <p className="text-sm text-gray-600 mt-0.5">{recipe.description}</p>
                  <span className="inline-block mt-2 px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-xs capitalize">
                    {recipe.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
