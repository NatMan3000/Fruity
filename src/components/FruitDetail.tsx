import { ArrowLeft } from 'lucide-react'
import type { Fruit, Month } from '../types/fruit'
import { MONTHS } from '../types/fruit'
import { MonthBadge } from './MonthBadge'
import { isPeakSeason, isInSeason } from '../utils/seasonality'
import { fruitImageUrl } from '../utils/images'

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
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left side: Title, description, origin, history */}
          <div className="flex-1 p-6 flex flex-col">
            {/* Title and status at top */}
            <div className="flex items-start gap-4">
              <span className="text-6xl flex-shrink-0">{fruit.emoji}</span>
              <div>
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

            {/* Description, origin, history at bottom */}
            <div className="mt-auto pt-6 space-y-4">
              {fruit.notes && (
                <p className="text-gray-600">{fruit.notes}</p>
              )}

              {fruit.origin && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700">Origin</h3>
                  <p className="text-sm text-gray-600 mt-1">{fruit.origin}</p>
                </div>
              )}

              {fruit.history && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700">History</h3>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">{fruit.history}</p>
                </div>
              )}

              {/* Season badges */}
              <div className="pt-2">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">When it's available</h3>
                <div className="flex flex-wrap gap-1">
                  {MONTHS
                    .filter((month) =>
                      isInSeason(fruit, month)
                    )
                    .map((month) => (
                      <MonthBadge
                        key={month}
                        month={month}
                        isPeak={isPeakSeason(fruit, month)}
                        isAvailable={isInSeason(fruit, month) && !isPeakSeason(fruit, month)}
                        isCurrent={month === currentMonth}
                      />
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right side: Image */}
          {fruit.image && (
            <div className="md:w-1/2 relative bg-gradient-to-b from-gray-100 to-gray-50 order-first md:order-last">
              <img
                src={fruitImageUrl(fruit, 960)}
                alt={fruit.name}
                className="w-full h-64 md:h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).parentElement!.style.display = 'none'
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Nutrition section */}
      {fruit.nutrition && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
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
        <div className="bg-white rounded-2xl shadow-sm p-6">
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
        <div className="bg-white rounded-2xl shadow-sm p-6">
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
