import clsx from 'clsx'
import type { Month } from '../types/fruit'

interface MonthBadgeProps {
  month: Month
  isPeak?: boolean
  isAvailable?: boolean
  isCurrent?: boolean
  compact?: boolean
}

export function MonthBadge({ month, isPeak = false, isAvailable = false, isCurrent = false, compact = false }: MonthBadgeProps) {
  const inSeason = isPeak || isAvailable

  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center rounded font-medium transition-colors',
        compact ? 'w-6 h-5 text-[10px]' : 'px-2 py-0.5 text-xs rounded-full',
        // Base colors by season status
        {
          'bg-emerald-100 text-emerald-700': isPeak,
          'bg-amber-100 text-amber-700': isAvailable && !isPeak,
          'bg-gray-100 text-gray-400': !inSeason
        },
        // Current month gets matching dark border
        {
          'ring-2 ring-emerald-600': isCurrent && isPeak,
          'ring-2 ring-amber-600': isCurrent && isAvailable && !isPeak,
          'ring-2 ring-gray-500': isCurrent && !inSeason
        }
      )}
    >
      {month}
    </span>
  )
}
