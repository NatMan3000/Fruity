import clsx from 'clsx'
import type { Fruit, Month } from '../types/fruit'
import { MONTHS } from '../types/fruit'
import { isPeakSeason, isInSeason } from '../utils/seasonality'

interface SeasonCalendarProps {
  fruits: Fruit[]
  currentMonth: Month
  onFruitClick?: (fruitId: string) => void
}

export function SeasonCalendar({ fruits, currentMonth, onFruitClick }: SeasonCalendarProps) {
  // Sort fruits alphabetically
  const sortedFruits = [...fruits].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white shadow-sm border border-gray-200 p-4 overflow-x-auto">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          📅 Year-at-a-Glance
        </h2>
        <div className="min-w-max">
          {/* Header row with months */}
          <div className="flex mb-2">
            <div className="w-32 flex-none" />
            {MONTHS.map((month) => (
              <div
                key={month}
                className={clsx(
                  'w-10 mx-0.5 text-center text-xs font-medium',
                  month === currentMonth
                    ? 'text-emerald-600 font-bold'
                    : 'text-gray-600'
                )}
              >
                {month}
              </div>
            ))}
          </div>

          {/* Fruit rows */}
          {sortedFruits.map((fruit) => (
            <div
              key={fruit.id}
              className={clsx(
                'flex items-center mb-1 rounded-lg transition-colors',
                onFruitClick && 'cursor-pointer hover:bg-gray-50'
              )}
              onClick={() => onFruitClick?.(fruit.id)}
            >
              {/* Fruit name */}
              <div className="w-32 flex-none flex items-center gap-2 pr-2">
                <span className="text-xl">{fruit.emoji}</span>
                <span className="text-xs text-gray-700 truncate">
                  {fruit.name}
                </span>
              </div>

              {/* Month cells */}
              {MONTHS.map((month) => {
                const isPeak = isPeakSeason(fruit, month)
                const available = isInSeason(fruit, month)
                const isCurrent = month === currentMonth

                return (
                  <div
                    key={month}
                    className={clsx(
                      'w-10 h-6 mx-0.5 rounded transition-all',
                      // Base colors matching MonthBadge
                      {
                        'bg-emerald-200': isPeak,
                        'bg-amber-200': available && !isPeak,
                        'bg-gray-200': !available
                      },
                      // Current month gets matching dark border
                      {
                        'ring-2 ring-emerald-400': isCurrent && isPeak,
                        'ring-2 ring-amber-400': isCurrent && available && !isPeak,
                        'ring-2 ring-gray-300': isCurrent && !available
                      }
                    )}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend - outside the white container */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-200" />
          <span>Peak season</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-200" />
          <span>Still available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-200" />
          <span>Out of season</span>
        </div>
      </div>
    </div>
  )
}
