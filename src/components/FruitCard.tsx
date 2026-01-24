import { useState } from 'react'
import clsx from 'clsx'
import { Info } from 'lucide-react'
import type { Fruit, Month } from '../types/fruit'
import { MonthBadge } from './MonthBadge'
import { isPeakSeason, isInSeason } from '../utils/seasonality'

interface FruitCardProps {
  fruit: Fruit
  currentMonth: Month
}

export function FruitCard({ fruit, currentMonth }: FruitCardProps) {
  const [expanded, setExpanded] = useState(false)

  const inSeason = isInSeason(fruit, currentMonth)
  const isPeak = isPeakSeason(fruit, currentMonth)

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className={clsx(
        'p-4 rounded-xl border-2 transition-all cursor-pointer bg-white shadow-sm hover:shadow-md',
        {
          'border-emerald-400 bg-emerald-50/50': isPeak,
          'border-amber-300 bg-amber-50/50': inSeason && !isPeak,
          'border-gray-200': !inSeason
        }
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{fruit.emoji}</span>
          <div>
            <h3 className="font-semibold text-gray-900">{fruit.name}</h3>
            {isPeak && (
              <span className="text-xs font-medium text-emerald-600">Peak season!</span>
            )}
            {inSeason && !isPeak && (
              <span className="text-xs font-medium text-amber-600">Available now</span>
            )}
          </div>
        </div>
        {fruit.notes && (
          <Info className="h-5 w-5 text-gray-400" />
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
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
            isCurrent={month === currentMonth}
          />
        ))}
      </div>

      {expanded && fruit.notes && (
        <p className="mt-3 text-sm text-gray-600 border-t border-gray-100 pt-3">
          {fruit.notes}
        </p>
      )}
    </div>
  )
}
