import type { CSSProperties, ReactNode } from 'react'
import clsx from 'clsx'
import type { Fruit, Month } from '../types/fruit'
import { MONTHS } from '../types/fruit'
import { monthLevel } from '../utils/seasonality'
import { seasonLabel } from '../utils/status'

// The 12-month season bar (DESIGN.md "Season bar"): twelve scoops in a dark track (the block's ink), so
// the greens and reds read on any fruit or season colour. Peak, in season and out differ in SHAPE as
// well as colour: a full-height pill, a half-height pill, a small red dot. This month is ringed.
interface SeasonStripProps {
  fruit: Fruit
  month: Month
  size?: 'sm' | 'md' | 'lg'
  initials?: boolean // J F M ... under the strip, this month in a pill
  animate?: boolean  // the bouncy entrance (fruit page): bars spring up one after another
  ring?: boolean     // ring this month's slot (off in the Year view, which marks the column instead)
}

const TRACK = {
  sm: 'h-[22px] gap-[3px] px-[5px] py-[4px]',
  md: 'h-[20px] gap-[2px] px-[4px] py-[3px]',
  lg: 'h-14 gap-1 p-2',
} as const

export function SeasonStrip({ fruit, month, size = 'sm', initials = false, animate = false, ring = true }: SeasonStripProps) {
  const lg = size === 'lg'
  return (
    <div role="img" aria-label={seasonLabel(fruit, month)} className="w-full">
      <div className={clsx('flex items-end rounded-full bg-(--ink)', TRACK[size])}>
        {MONTHS.map((m, i) => {
          const level = monthLevel(fruit, m)
          const now = ring && m === month
          return (
            <div
              key={m}
              className={clsx('relative flex h-full flex-1 items-end justify-center rounded-full', now && (lg ? 'ring-[2.5px] ring-(--light)' : 'ring-[1.5px] ring-(--light)'))}
            >
              {level === 'off' ? (
                <span
                  className={clsx('mb-[2px] rounded-full bg-off', lg ? 'size-2' : 'size-[5px]', animate && 'dot-in')}
                  style={{ '--i': i } as CSSProperties}
                />
              ) : (
                <span
                  className={clsx('w-full rounded-full', level === 'peak' ? 'h-full bg-peak' : 'h-[52%] bg-season', animate && 'bar-up')}
                  style={{ '--i': i } as CSSProperties}
                />
              )}
            </div>
          )
        })}
      </div>
      {initials && (
        <div className={clsx('mt-1.5 flex', lg ? 'gap-1 px-2' : 'gap-[3px] px-[5px]')} aria-hidden="true">
          {MONTHS.map(m => (
            <span
              key={m}
              className={clsx(
                'flex-1 rounded-full text-center tabular-nums',
                lg ? 'text-[13px] leading-5' : 'text-[12px]',
                m === month ? 'bg-(--light) font-extrabold text-(--deep)' : 'font-semibold',
              )}
            >
              {m[0]}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// The key, drawn in the strip's own shapes so it reads without colour too.
export function SeasonLegend({ className, short = false }: { className?: string; short?: boolean }) {
  const item = (swatch: ReactNode, label: string) => (
    <span className="inline-flex items-center gap-1.5">
      <span className="flex h-4 w-3 items-end justify-center rounded-full bg-(--ink) p-[2px]">{swatch}</span>
      <span className="text-caption font-bold">{label}</span>
    </span>
  )
  return (
    <div className={clsx('flex flex-wrap gap-x-3.5 gap-y-1', className)}>
      {item(<span className="h-full w-full rounded-full bg-peak" />, 'Peak')}
      {item(<span className="h-1/2 w-full rounded-full bg-season" />, short ? 'In' : 'In season')}
      {item(<span className="mb-px size-[4px] rounded-full bg-off" />, short ? 'Out' : 'Out of season')}
    </div>
  )
}
