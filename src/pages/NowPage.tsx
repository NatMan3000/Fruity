import { ChevronDown, ChevronRight, MapPin } from 'lucide-react'
import type { Fruit, Month, RecipeSuggestion } from '../types/fruit'
import { FRUITS } from '../assets/fruits'
import { useAusState, STATE_NAMES } from '../hooks/useAusState'
import { useUi } from '../hooks/useUi'
import { isArriving, isEnding, isInSeason, monthOffset, nowSections } from '../utils/seasonality'
import { MONTH_NAMES, weekOfYear } from '../utils/months'
import { glanceTip } from '../utils/tips'
import { FruitIcon } from '../components/FruitIcon'
import { Link } from '../components/Link'
import { PageHeader } from '../components/PageHeader'

// "What should we buy right now?" answered on one screen: no search, no filters, no entrance motion.
// Buy now shows up to 5 rows; in a heavy month it shows fewer plus "See all", fewer still when both
// rails below need room, so all three answers fit an iPhone screen.
const BUY_NOW_ROWS = 5

export function NowPage({ month, onSeeAllPeak, onSeeInSeason }: { month: Month; onSeeAllPeak: () => void; onSeeInSeason: () => void }) {
  const { state } = useAusState()
  const { openStates } = useUi()
  const { buyNow, justLanded, endingSoon } = nowSections(FRUITS, month, state)
  const overflow = buyNow.length > BUY_NOW_ROWS
  const bothRails = justLanded.length > 0 && endingSoon.length > 0
  const rows = overflow ? buyNow.slice(0, bothRails ? BUY_NOW_ROWS - 2 : BUY_NOW_ROWS - 1) : buyNow
  const ideas = cookThisWeek(buyNow)

  return (
    <div className="flex flex-col pb-6">
      <PageHeader title={MONTH_NAMES[month]}>
        <button
          type="button"
          onClick={openStates}
          aria-label={`Seasons for ${STATE_NAMES[state]}. Change state`}
          className="inline-flex h-9 items-center gap-1 self-center rounded-full bg-card pr-2.5 pl-2 text-small font-semibold text-ink hover:bg-tile active:bg-tile-strong"
        >
          <MapPin aria-hidden="true" className="size-4 text-ink-2" />
          {state}
          <ChevronDown aria-hidden="true" className="size-4 text-ink-2" />
        </button>
      </PageHeader>

      <div className="flex flex-col gap-5 px-4">
        <section aria-labelledby="buy-now" className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="buy-now" className="font-display text-title font-semibold">Buy now</h2>
            <span className="text-caption text-ink-2 tabular-nums">{buyNow.length} at peak</span>
          </div>
          {buyNow.length === 0 ? (
            <p className="rounded-card bg-card p-4 text-body text-ink-2">
              Nothing is at its peak in {STATE_NAMES[state]} this month.{' '}
              <button type="button" onClick={onSeeInSeason} className="font-semibold text-ink underline">See what is in season</button>
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {rows.map(f => (
                <li key={f.id}>
                  <Link to={{ name: 'fruit', id: f.id }} morph className="flex items-center gap-3 rounded-card bg-card px-3 py-2.5 active:bg-tile">
                    <FruitIcon fruit={f} size="lg" morph />
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="flex flex-wrap items-baseline gap-x-2">
                        <span className="font-display text-name font-semibold">{f.name}</span>
                        <PeakTag fruit={f} month={month} />
                      </span>
                      {f.pick && <span className="text-small text-ink-2">{glanceTip(f.pick)}</span>}
                    </span>
                  </Link>
                </li>
              ))}
              {overflow && (
                <li>
                  <button
                    type="button"
                    onClick={onSeeAllPeak}
                    className="flex min-h-11 w-full items-center justify-between rounded-card bg-card px-4 text-small font-semibold text-ink active:bg-tile"
                  >
                    See all {buyNow.length} at peak
                    <ChevronRight aria-hidden="true" className="size-5 text-ink-2" />
                  </button>
                </li>
              )}
            </ul>
          )}
        </section>

        {justLanded.length > 0 && <Rail id="just-landed" title="Just landed" note="New this month" fruits={justLanded} />}
        {endingSoon.length > 0 && <Rail id="ending-soon" title="Ending soon" note="Last month" fruits={endingSoon} />}

        {ideas.length > 0 && (
          <section aria-labelledby="cook-week" className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-3">
              <h2 id="cook-week" className="font-display text-title font-semibold">Cook this week</h2>
              <Link to={{ name: 'cook' }} className="inline-flex min-h-11 items-center text-small font-semibold text-ink-2">All ideas</Link>
            </div>
            <ul className="-mx-4 flex snap-x gap-2 overflow-x-auto scroll-px-4 px-4 scrollbar-hide sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
              {ideas.map(({ fruit, recipe }) => (
                <li key={`${fruit.id}-${recipe.name}`} className="flex w-60 shrink-0 snap-start sm:w-auto">
                  <Link to={{ name: 'fruit', id: fruit.id }} morph className="flex w-full items-start gap-3 rounded-card bg-card p-3 active:bg-tile">
                    <FruitIcon fruit={fruit} size="sm" morph />
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="text-small font-semibold">{recipe.name}</span>
                      <span className="text-caption text-ink-2">{recipe.description}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}

function PeakTag({ fruit, month }: { fruit: Fruit; month: Month }) {
  const { state } = useAusState()
  if (isEnding(fruit, month, state)) return <span className="text-caption font-semibold text-mango-deep">Last month</span>
  if (isArriving(fruit, month, state)) {
    // New in shops this month, or in shops already and newly at its best
    const word = isInSeason(fruit, monthOffset(month, -1), state) ? 'New at peak' : 'Just landed'
    return <span className="text-caption font-semibold text-leaf-deep">{word}</span>
  }
  return null
}

function Rail({ id, title, note, fruits }: { id: string; title: string; note: string; fruits: Fruit[] }) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id={id} className="font-display text-title font-semibold">{title}</h2>
        <span className="text-caption text-ink-2">{note}</span>
      </div>
      <ul className="-mx-4 flex snap-x gap-1 overflow-x-auto scroll-px-4 px-4 scrollbar-hide sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        {fruits.map(f => (
          <li key={f.id} className="w-20 shrink-0 snap-start">
            <Link to={{ name: 'fruit', id: f.id }} morph className="flex flex-col items-center gap-1 rounded-card px-1 py-1 text-center active:bg-tile">
              <FruitIcon fruit={f} size="lg" morph />
              <span className="text-caption font-medium text-ink">{f.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

// Up to 3 recipe ideas from fruit at peak, rotating weekly.
function cookThisWeek(peak: Fruit[]): { fruit: Fruit; recipe: RecipeSuggestion }[] {
  const week = weekOfYear()
  return peak
    .filter(f => f.recipes?.length)
    .slice(0, 3)
    .map(f => ({ fruit: f, recipe: f.recipes![week % f.recipes!.length] }))
}
