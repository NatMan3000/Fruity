import clsx from 'clsx'
import { Check, Search, X } from 'lucide-react'
import type { Month } from '../types/fruit'
import { FRUITS } from '../assets/fruits'
import { useAusState } from '../hooks/useAusState'
import { BROWSE_FILTERS, browseFruits, type BrowseFilter } from '../utils/browse'
import { fruitStatus } from '../utils/seasonality'
import { FruitIcon } from '../components/FruitIcon'
import { Link } from '../components/Link'
import { SeasonBar, SeasonLegend } from '../components/SeasonBar'
import { StatusLabel } from '../components/StatusLabel'
import { FruitTabHeader } from './FruitTabHeader'

interface BrowsePageProps {
  month: Month
  query: string
  onQuery: (q: string) => void
  filter: BrowseFilter | null
  onFilter: (f: BrowseFilter | null) => void
}

export function BrowsePage({ month, query, onQuery, filter, onFilter }: BrowsePageProps) {
  const { state } = useAusState()
  const fruits = browseFruits(FRUITS, query, filter, month, state)
  const filtered = query.trim() !== '' || filter !== null

  return (
    <div className="flex flex-col pb-6">
      <FruitTabHeader view="list" />

      {/* Pinned: search and filter chips stay put while the list scrolls */}
      <div className="sticky top-0 z-20 flex flex-col gap-2 bg-paper pt-[calc(env(safe-area-inset-top)+8px)] pb-3">
        <div className="px-4">
          <label className="flex h-12 items-center gap-2 rounded-control bg-card px-3 ring-1 ring-line ring-inset focus-within:ring-2 focus-within:ring-ink">
            <Search aria-hidden="true" className="size-5 shrink-0 text-ink-3" />
            <input
              type="search"
              value={query}
              onChange={e => onQuery(e.target.value)}
              placeholder="Search fruit"
              aria-label="Search fruit"
              enterKeyHint="search"
              autoComplete="off"
              className="h-full min-w-0 flex-1 bg-transparent text-body text-ink outline-none placeholder:text-ink-3 [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => onQuery('')}
                aria-label="Clear search"
                className="-mr-2 inline-flex size-11 items-center justify-center rounded-full text-ink-2"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            )}
          </label>
        </div>
        <div role="group" aria-label="Filter" className="flex gap-2 overflow-x-auto px-4 scrollbar-hide">
          {BROWSE_FILTERS.map(({ id, label }) => {
            const on = filter === id
            return (
              <button
                key={id}
                type="button"
                aria-pressed={on}
                onClick={() => onFilter(on ? null : id)}
                className={clsx(
                  'inline-flex h-11 shrink-0 items-center gap-1 rounded-full px-4 text-small whitespace-nowrap',
                  on ? 'bg-ink font-semibold text-paper' : 'bg-card font-medium text-ink active:bg-tile',
                )}
              >
                {on && <Check aria-hidden="true" className="-ml-1 size-4" strokeWidth={2.5} />}
                {label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3 px-4">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="text-caption text-ink-2 tabular-nums" aria-live="polite">
            {filtered ? `${fruits.length} of ${FRUITS.length} fruit` : `${FRUITS.length} fruit, peak first`}
          </p>
          <SeasonLegend />
        </div>

        {fruits.length === 0 ? (
          <div className="flex flex-col items-start gap-3 rounded-card bg-card p-4">
            <p className="text-body text-ink-2">No fruit matches{query.trim() ? ` "${query.trim()}"` : ''}{filter ? ' with that filter' : ''}.</p>
            <button
              type="button"
              onClick={() => { onQuery(''); onFilter(null) }}
              className="inline-flex h-11 items-center rounded-control bg-ink px-4 font-semibold text-paper"
            >
              Show all fruit
            </button>
          </div>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {fruits.map(f => (
              <li key={f.id} className="flex">
                <Link to={{ name: 'fruit', id: f.id }} morph className="flex w-full items-center gap-3 rounded-card bg-card p-3 active:bg-tile">
                  <FruitIcon fruit={f} size="lg" morph />
                  <span className="flex min-w-0 flex-1 flex-col gap-2">
                    <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <span className="font-display text-name font-semibold">{f.name}</span>
                      <StatusLabel status={fruitStatus(f, month, state)} />
                    </span>
                    <SeasonBar fruit={f} month={month} state={state} size="sm" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
