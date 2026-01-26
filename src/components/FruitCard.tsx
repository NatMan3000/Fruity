import clsx from 'clsx'
import type { Fruit, Month } from '../types/fruit'
import { MONTHS } from '../types/fruit'
import { MonthBadge } from './MonthBadge'
import { isPeakSeason, isInSeason } from '../utils/seasonality'

interface FruitCardProps {
  fruit: Fruit
  currentMonth: Month
  onClick?: () => void
}

export function FruitCard({ fruit, currentMonth, onClick }: FruitCardProps) {
  const inSeason = isInSeason(fruit, currentMonth)
  const isPeak = isPeakSeason(fruit, currentMonth)

  return (
    <div
      onClick={onClick}
      className={clsx(
        'p-4 rounded-xl border-2 transition-all bg-white shadow-sm hover:shadow-md',
        onClick && 'cursor-pointer',
        {
          'border-emerald-400 bg-emerald-50/50': isPeak,
          'border-amber-300 bg-amber-50/50': inSeason && !isPeak,
          'border-gray-200': !inSeason
        }
      )}
    >
      {/* Top row: fruit info left, months right */}
      <div className="flex items-start justify-between gap-2">
        {/* Fruit name and status */}
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-4xl flex-shrink-0">{fruit.emoji}</span>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{fruit.name}</h3>
            {isPeak && (
              <span className="text-xs font-medium text-emerald-600">Peak season!</span>
            )}
            {inSeason && !isPeak && (
              <span className="text-xs font-medium text-amber-600">Available now</span>
            )}
            {!inSeason && (
              <span className="text-xs font-medium text-gray-400">Out of season</span>
            )}
          </div>
        </div>

        {/* Month badges - 3x4 grid on right */}
        <div className="grid grid-cols-3 gap-0.5 flex-shrink-0">
          {MONTHS.map((month) => {
            const isPeak = fruit.seasonality.peak.includes(month)
            const isAvailable = fruit.seasonality.available.includes(month)
            return (
              <MonthBadge
                key={month}
                month={month}
                isPeak={isPeak}
                isAvailable={isAvailable}
                isCurrent={month === currentMonth}
                compact
              />
            )
          })}
        </div>
      </div>

      {/* Quick info preview - bottom */}
      {fruit.pairings && fruit.pairings.length > 0 && (
        <p className="mt-3 text-xs text-gray-500 truncate">
          Pairs with: {fruit.pairings.slice(0, 3).join(', ')}
          {fruit.pairings.length > 3 && '...'}
        </p>
      )}
    </div>
  )
}
