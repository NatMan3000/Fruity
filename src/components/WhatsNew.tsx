import type { Fruit, Month } from '../types/fruit'
import { MONTHS } from '../types/fruit'
import { isPeakSeason } from '../utils/seasonality'

interface WhatsNewProps {
  fruits: Fruit[]
  currentMonth: Month
  onFruitClick?: (fruitId: string) => void
}

export function WhatsNew({ fruits, currentMonth, onFruitClick }: WhatsNewProps) {
  // Calculate previous month
  const currentIndex = MONTHS.indexOf(currentMonth)
  const previousMonth = MONTHS[currentIndex === 0 ? 11 : currentIndex - 1]

  // Filter fruits that are peak NOW but were NOT peak last month
  const newFruits = fruits.filter(
    (fruit) =>
      isPeakSeason(fruit, currentMonth) && !isPeakSeason(fruit, previousMonth)
  )

  // Don't render if no new fruits
  if (newFruits.length === 0) return null

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">
        🌟 New This Month
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {newFruits.map((fruit) => (
          <div
            key={fruit.id}
            onClick={() => onFruitClick?.(fruit.id)}
            className="flex-none w-32 p-3 rounded-xl bg-white border-2 border-emerald-400 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="text-center">
              <span className="text-3xl">{fruit.emoji}</span>
              <p className="text-sm font-medium text-gray-900 mt-2">
                {fruit.name}
              </p>
              <p className="text-xs text-emerald-600 mt-1">Peak season!</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
