import type { Fruit, Month } from '../../types/fruit'
import { isPeakSeason, isInSeason } from '../../utils/seasonality'

interface FruitPickerProps {
  fruits: Fruit[]
  selectedIds: string[]
  currentMonth: Month
  onToggle: (id: string) => void
  showOnlyInSeason?: boolean
}

export function FruitPicker({
  fruits,
  selectedIds,
  currentMonth,
  onToggle,
  showOnlyInSeason = false
}: FruitPickerProps) {
  // Filter to in-season if enabled
  const displayFruits = showOnlyInSeason
    ? fruits.filter(f => isInSeason(f, currentMonth))
    : fruits

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-medium text-gray-700">Pick your fruits</h3>
        <span className="text-xs text-gray-500">
          {selectedIds.length} selected
        </span>
      </div>

      <div className="relative">
        {/* Scroll container */}
        <div className="flex gap-2 overflow-x-auto pb-2 px-1 -mx-1 scrollbar-hide">
          {displayFruits.map(fruit => {
            const isSelected = selectedIds.includes(fruit.id)
            const isPeak = isPeakSeason(fruit, currentMonth)
            const available = isInSeason(fruit, currentMonth)

            return (
              <button
                key={fruit.id}
                onClick={() => onToggle(fruit.id)}
                className={`
                  flex-shrink-0 flex flex-col items-center gap-1 p-2 rounded-xl
                  transition-all active:scale-95
                  ${isSelected
                    ? 'bg-emerald-100 ring-2 ring-emerald-500 shadow-md'
                    : 'bg-white/80 hover:bg-white hover:shadow-sm'
                  }
                  ${!available && !isSelected ? 'opacity-50' : ''}
                `}
              >
                <span className="text-2xl relative">
                  {fruit.emoji}
                  {isSelected && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </span>
                  )}
                </span>
                <span className="text-xs text-gray-600 whitespace-nowrap max-w-[60px] truncate">
                  {fruit.name}
                </span>
                {isPeak && (
                  <span className="text-[10px] text-emerald-600 font-medium">Peak</span>
                )}
              </button>
            )
          })}
        </div>

        {/* Fade edges to indicate scrolling */}
        <div className="absolute left-0 top-0 bottom-2 w-4 bg-gradient-to-r from-white/80 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-2 w-4 bg-gradient-to-l from-white/80 to-transparent pointer-events-none" />
      </div>
    </div>
  )
}
