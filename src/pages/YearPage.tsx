import { useEffect, useState, type CSSProperties } from 'react'
import clsx from 'clsx'
import type { Month } from '../types/fruit'
import { MONTHS } from '../types/fruit'
import { FRUITS } from '../assets/fruits'
import { FruitSticker } from '../components/FruitSticker'
import { Link } from '../components/Link'
import { SeasonLegend, SeasonStrip } from '../components/SeasonStrip'
import { FruitTabHeader } from './FruitTabHeader'

let introPlayed = false

// The year at a glance: every fruit's season strip on the season's page, this month's column marked.
export function YearPage({ month }: { month: Month }) {
  const fruits = [...FRUITS].sort((a, b) => a.name.localeCompare(b.name))
  // Wide enough for the longest name (Custard Apple) on one line with a clear gap before the bar,
  // which takes the rest.
  const nameCol = 'w-[9.75rem] shrink-0 sm:w-44'
  const [intro] = useState(() => !introPlayed)
  useEffect(() => { introPlayed = true }, [])

  return (
    <div className="flex flex-col pb-6">
      <FruitTabHeader view="year" intro={intro} />
      <div className="px-4 pb-1">
        <SeasonLegend />
      </div>

      <div className="sticky top-0 z-20 bg-(--screen) px-4 pt-[calc(env(safe-area-inset-top)+8px)] pb-1.5">
        <div className="flex items-center gap-2 px-2" aria-hidden="true">
          <span className={nameCol} />
          <div className="flex flex-1 gap-[2px] px-[4px]">
            {MONTHS.map(m => (
              <span
                key={m}
                className={clsx(
                  'flex-1 rounded-full py-0.5 text-center text-caption tabular-nums',
                  m === month ? 'bg-(--bright) font-extrabold text-(--ink)' : 'font-semibold',
                )}
              >
                {m[0]}
              </span>
            ))}
          </div>
        </div>
      </div>

      <ul className="flex flex-col gap-1 px-4">
        {fruits.map((f, i) => (
          <li key={f.id} className={clsx(intro && i < 12 && 'swing-in')} style={{ '--i': i, '--from-x': '-24px', '--from-tilt': '0deg' } as CSSProperties}>
            <Link to={{ name: 'fruit', id: f.id }} className="flex min-h-12 items-center gap-2 rounded-full px-2 py-1 active:bg-(--deep)">
              <span className={clsx('flex items-center gap-2', nameCol)}>
                <FruitSticker fruit={f} size={34} tilt={false} />
                <span className="text-small leading-tight font-bold">{f.name}</span>
              </span>
              <span className="flex-1">
                <SeasonStrip fruit={f} month={month} size="md" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
