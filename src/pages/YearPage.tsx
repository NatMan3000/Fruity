import clsx from 'clsx'
import type { Month } from '../types/fruit'
import { MONTHS } from '../types/fruit'
import { FRUITS } from '../assets/fruits'
import { useAusState } from '../hooks/useAusState'
import { FruitIcon } from '../components/FruitIcon'
import { Link } from '../components/Link'
import { SeasonBar, SeasonLegend } from '../components/SeasonBar'
import { FruitTabHeader } from './FruitTabHeader'

// The year at a glance: every fruit's season bar, the current month's column tinted.
export function YearPage({ month }: { month: Month }) {
  const { state } = useAusState()
  const fruits = [...FRUITS].sort((a, b) => a.name.localeCompare(b.name))
  const nameCol = 'w-32 shrink-0 sm:w-44'

  return (
    <div className="flex flex-col pb-6">
      <FruitTabHeader view="year" />
      <div className="px-4 pb-2">
        <SeasonLegend />
      </div>

      <div className="sticky top-0 z-20 bg-paper px-4 pt-[calc(env(safe-area-inset-top)+8px)] pb-1">
        <div className="flex items-center gap-2 px-2" aria-hidden="true">
          <span className={nameCol} />
          <div className="flex flex-1 gap-0.5">
            {MONTHS.map(m => (
              <span
                key={m}
                className={clsx(
                  'flex-1 rounded-[3px] py-0.5 text-center text-caption',
                  m === month ? 'bg-tile-strong/60 font-bold text-ink' : 'text-ink-3',
                )}
              >
                {m[0]}
              </span>
            ))}
          </div>
        </div>
      </div>

      <ul className="flex flex-col px-4">
        {fruits.map(f => (
          <li key={f.id}>
            <Link to={{ name: 'fruit', id: f.id }} morph className="flex items-center gap-2 rounded-control px-2 py-1.5 active:bg-tile">
              <span className={clsx('flex items-center gap-2', nameCol)}>
                <FruitIcon fruit={f} size="sm" morph />
                <span className="text-small font-medium text-ink">{f.name}</span>
              </span>
              <span className="flex-1">
                <SeasonBar fruit={f} month={month} state={state} size="md" marker={false} band />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
