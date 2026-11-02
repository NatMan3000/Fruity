import { useEffect, useState, type CSSProperties } from 'react'
import clsx from 'clsx'
import { Check, Search, X } from 'lucide-react'
import type { Fruit, Month, Season } from '../types/fruit'
import { FRUITS } from '../assets/fruits'
import { BROWSE_FILTERS, browseFruits, type BrowseFilter } from '../utils/browse'
import { fruitStatus } from '../utils/seasonality'
import { SEASON_COLOUR, toneVars, tonesOf } from '../utils/tones'
import { ChipRow } from '../components/ChipRow'
import { FruitSticker } from '../components/FruitSticker'
import { Link } from '../components/Link'
import { SeasonLegend, SeasonStrip } from '../components/SeasonStrip'
import { StatusSticker } from '../components/StatusSticker'
import { FruitTabHeader } from './FruitTabHeader'

interface BrowsePageProps {
  month: Month
  query: string
  onQuery: (q: string) => void
  filter: BrowseFilter | null
  onFilter: (f: BrowseFilter | null) => void
}

// The first screenful of rows swings in the first time the list opens in a session.
let introPlayed = false
const INTRO_ROWS = 7

export function BrowsePage({ month, query, onQuery, filter, onFilter }: BrowsePageProps) {
  const fruits = browseFruits(FRUITS, query, filter, month)
  const filtered = query.trim() !== '' || filter !== null
  const [intro] = useState(() => !introPlayed)
  useEffect(() => { introPlayed = true }, [])

  return (
    <div className="flex flex-col pb-6">
      <FruitTabHeader view="list" intro={intro} />

      {/* Pinned: search and filter chips stay put while the list scrolls */}
      <div className="sticky top-0 z-20 flex flex-col gap-2.5 bg-(--screen) pt-[calc(env(safe-area-inset-top)+10px)] pb-3">
        <div className="px-4">
          <label className="flex h-13 items-center gap-2 rounded-full bg-(--bright) pr-1 pl-4 text-(--ink) focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-(--light)">
            <Search aria-hidden="true" className="size-5 shrink-0" strokeWidth={2.5} />
            <input
              type="search"
              value={query}
              onChange={e => onQuery(e.target.value)}
              placeholder="Search fruit"
              aria-label="Search fruit"
              enterKeyHint="search"
              autoComplete="off"
              className="h-full min-w-0 flex-1 bg-transparent text-body font-semibold text-(--ink) caret-(--ink) outline-none placeholder:text-(--ink-soft) [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button type="button" onClick={() => onQuery('')} aria-label="Clear search" className="inline-flex size-11 items-center justify-center rounded-full">
                <X aria-hidden="true" className="size-5" strokeWidth={2.5} />
              </button>
            )}
          </label>
        </div>
        <FilterChips filter={filter} onFilter={onFilter} />
      </div>

      <div className="flex flex-col gap-3 px-4">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 pb-1">
          <p className="text-small font-bold tabular-nums" aria-live="polite">
            {filtered ? `${fruits.length} of ${FRUITS.length} fruit` : `${FRUITS.length} fruit, peak first`}
          </p>
          <SeasonLegend />
        </div>

        {fruits.length === 0 ? (
          <div className="flex flex-col items-start gap-3 rounded-block bg-(--bright) p-5 text-(--ink)">
            <p className="text-body font-semibold">No fruit matches{query.trim() ? ` "${query.trim()}"` : ''}{filter ? ' with that filter' : ''}.</p>
            <button
              type="button"
              onClick={() => { onQuery(''); onFilter(null) }}
              className="press inline-flex h-12 items-center rounded-full bg-(--ink) px-5 font-extrabold text-(--light)"
            >
              Show all fruit
            </button>
          </div>
        ) : (
          <ul className="flex flex-col gap-4 pt-1">
            {fruits.map((f, i) => (
              <li
                key={f.id}
                className={clsx(intro && i < INTRO_ROWS && 'swing-in')}
                style={{ '--i': i, '--from-x': i % 2 ? '40px' : '-40px', '--from-tilt': i % 2 ? '2deg' : '-2deg' } as CSSProperties}
              >
                <Row fruit={f} month={month} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

// One fruit: a block in its own colour, the sticker inside on the left, then the name, its status
// sticker on a line of its own (so a long name never pushes it down a line and every row is one
// height), and the year below.
function Row({ fruit, month }: { fruit: Fruit; month: Month }) {
  const status = fruitStatus(fruit, month)
  return (
    <Link
      to={{ name: 'fruit', id: fruit.id }}
      className="press block-shadow flex items-center gap-3 rounded-block bg-(--pop) py-3 pr-3 pl-2.5 text-(--ink)"
      style={toneVars(tonesOf(fruit.colour))}
    >
      <FruitSticker fruit={fruit} size={68} />
      <span className="flex min-w-0 flex-1 flex-col gap-2">
        <span className="font-display text-name">{fruit.name}</span>
        <StatusSticker status={status} size="sm" tilt={status === 'peak' ? -5 : -3} className="self-start" />
        <SeasonStrip fruit={fruit} month={month} />
      </span>
    </Link>
  )
}

// Chip dots: the peak and in-season greens, and each season's own sorbet.
const chipDot = (id: BrowseFilter): string =>
  id === 'peak' ? 'var(--color-peak)'
    : id === 'inSeason' ? 'var(--color-season)'
      : id === 'yearRound' ? 'var(--color-always)'
        : tonesOf(SEASON_COLOUR[id as Season]).pop

// Single-select filter chips (ChipRow scrolls them sideways on a phone and wraps them on wider screens).
function FilterChips({ filter, onFilter }: { filter: BrowseFilter | null; onFilter: (f: BrowseFilter | null) => void }) {
  return (
    <ChipRow label="Filter">
      {BROWSE_FILTERS.map(({ id, label }) => {
        const on = filter === id
        return (
          <button
            key={id}
            type="button"
            aria-pressed={on}
            onClick={() => onFilter(on ? null : id)}
            className={clsx(
              'chip inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-[var(--chip-px,16px)] text-small font-bold whitespace-nowrap',
              on ? 'bg-(--pop) text-(--ink)' : 'bg-(--deep) text-(--light)',
            )}
          >
            {on
              ? <Check aria-hidden="true" className="-ml-1 size-4" strokeWidth={3} />
              : <span aria-hidden="true" className="size-3 rounded-full ring-2 ring-(--light)/40" style={{ backgroundColor: chipDot(id) }} />}
            {label}
          </button>
        )
      })}
    </ChipRow>
  )
}
