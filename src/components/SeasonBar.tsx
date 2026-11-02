import clsx from 'clsx'
import type { AusState, Fruit, Month } from '../types/fruit'
import { MONTHS } from '../types/fruit'
import { monthLevel } from '../utils/seasonality'
import { seasonLabel } from '../utils/status'

// The 12-segment season bar (DESIGN.md "Season bar"). Peak, in season and off differ in shape
// as well as colour: full-height bright green, half-height soft green, a thin soft-red line.
interface SeasonBarProps {
  fruit: Fruit
  month: Month
  state: AusState
  size?: 'sm' | 'md' | 'lg'
  marker?: boolean   // ink dot under the current month
  initials?: boolean // J F M ... under the bar, current month bold
  band?: boolean     // tinted column behind the current month (Year view)
  animate?: boolean  // segments fill upward (fruit detail open)
}

const HEIGHT = { sm: 'h-3', md: 'h-5', lg: 'h-8' } as const

export function SeasonBar({ fruit, month, state, size = 'sm', marker = true, initials = false, band = false, animate = false }: SeasonBarProps) {
  return (
    <div role="img" aria-label={seasonLabel(fruit, month, state)} className="w-full">
      <div className={clsx('flex items-end gap-0.5', HEIGHT[size])}>
        {MONTHS.map((m, i) => {
          const level = monthLevel(fruit, m, state)
          return (
            <div
              key={m}
              className={clsx('flex h-full flex-1 flex-col justify-end rounded-[3px]', band && m === month && 'bg-tile-strong/60')}
            >
              <div
                className={clsx(
                  'w-full rounded-[3px]',
                  level === 'peak' && 'h-full bg-peak',
                  level === 'available' && 'h-1/2 bg-season',
                  level === 'off' && 'h-[3px] bg-off',
                  animate && level !== 'off' && 'segment-fill',
                )}
                style={animate ? { animationDelay: `${i * 8}ms` } : undefined}
              />
            </div>
          )
        })}
      </div>
      {(marker || initials) && (
        <div className="mt-1 flex gap-0.5" aria-hidden="true">
          {MONTHS.map(m => (
            <span key={m} className="flex flex-1 flex-col items-center gap-0.5">
              {marker && <span className={clsx('size-1.5 rounded-full', m === month ? 'bg-ink' : 'bg-transparent')} />}
              {initials && (
                <span className={clsx('text-caption tabular-nums', m === month ? 'font-bold text-ink' : 'text-ink-3')}>{m[0]}</span>
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// Legend swatches shaped like the segments, so the key reads without colour too.
export function SeasonLegend({ className }: { className?: string }) {
  const item = (swatch: string, label: string) => (
    <span className="inline-flex items-end gap-1.5">
      <span className="flex h-4 w-2.5 items-end"><span className={clsx('w-full rounded-[2px]', swatch)} /></span>
      <span className="text-caption text-ink-2">{label}</span>
    </span>
  )
  return (
    <div className={clsx('flex flex-wrap gap-x-4 gap-y-1', className)}>
      {item('h-full bg-peak', 'Peak')}
      {item('h-1/2 bg-season', 'In season')}
      {item('h-[3px] bg-off', 'Out of season')}
    </div>
  )
}
