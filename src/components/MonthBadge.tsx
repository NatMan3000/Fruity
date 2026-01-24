import clsx from 'clsx'
import type { Month } from '../types/fruit'

interface MonthBadgeProps {
  month: Month
  isPeak?: boolean
  isCurrent?: boolean
}

export function MonthBadge({ month, isPeak = false, isCurrent = false }: MonthBadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium transition-colors',
        {
          'bg-emerald-100 text-emerald-800 ring-2 ring-emerald-500': isCurrent && isPeak,
          'bg-emerald-100 text-emerald-700': isPeak && !isCurrent,
          'bg-amber-100 text-amber-700': !isPeak && isCurrent,
          'bg-gray-100 text-gray-600': !isPeak && !isCurrent
        }
      )}
    >
      {month}
    </span>
  )
}
