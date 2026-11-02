import clsx from 'clsx'
import { Check } from 'lucide-react'
import type { Fruit, Month } from '../../types/fruit'
import { useAusState } from '../../hooks/useAusState'
import { isPeakSeason, isInSeason } from '../../utils/seasonality'
import { FruitIcon } from '../FruitIcon'

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
  const { state } = useAusState()
  // Filter to in-season if enabled
  const displayFruits = showOnlyInSeason
    ? fruits.filter(f => isInSeason(f, currentMonth, state))
    : fruits

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between px-1">
        <h3 className="text-small font-semibold text-ink">Pick your fruit</h3>
        <span className="text-caption text-ink-2 tabular-nums">{selectedIds.length} picked</span>
      </div>

      <div className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-1 scrollbar-hide">
        {displayFruits.map(fruit => {
          const isSelected = selectedIds.includes(fruit.id)
          const isPeak = isPeakSeason(fruit, currentMonth, state)
          const available = isInSeason(fruit, currentMonth, state)

          return (
            <button
              key={fruit.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggle(fruit.id)}
              className={clsx(
                'flex w-[72px] shrink-0 flex-col items-center gap-1 rounded-control p-1.5 text-center',
                isSelected ? 'bg-tile' : 'active:bg-tile',
                !available && !isSelected && 'opacity-60',
              )}
            >
              <span className="relative">
                <FruitIcon fruit={fruit} size="md" />
                {isSelected && (
                  <span className="absolute -top-1 -right-1 inline-flex size-5 items-center justify-center rounded-full bg-ink text-paper">
                    <Check aria-hidden="true" className="tick-in size-3.5" strokeWidth={3} />
                  </span>
                )}
              </span>
              <span className="text-caption text-ink">{fruit.name}</span>
              {isPeak && <span className="text-caption font-semibold text-peak-ink">Peak</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
