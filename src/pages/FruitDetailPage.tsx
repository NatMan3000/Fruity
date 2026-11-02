import { useState } from 'react'
import clsx from 'clsx'
import { Check, ChevronDown, Hand, MapPin, Plus, Refrigerator } from 'lucide-react'
import type { Fruit, Month } from '../types/fruit'
import { STATE_NAMES, useAusState } from '../hooks/useAusState'
import { updateBag, useBag } from '../hooks/useBag'
import { canMorph } from '../hooks/useRoute'
import { addFruit, fruitItemId, hasFruit, removeItem } from '../utils/bag'
import { fruitImageUrl } from '../utils/images'
import { fruitStatus } from '../utils/seasonality'
import { statusSentence } from '../utils/status'
import { PageHeader } from '../components/PageHeader'
import { RecipeIdeas } from '../components/RecipeIdeas'
import { SeasonBar } from '../components/SeasonBar'
import { StatusLabel } from '../components/StatusLabel'

const checkedOn = (iso: string) =>
  new Date(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })

export function FruitDetailPage({ fruit, month }: { fruit: Fruit; month: Month }) {
  const { state } = useAusState()
  const bag = useBag()
  const inBag = hasFruit(bag, fruit.id)
  const [heroFailed, setHeroFailed] = useState(false)
  // Without View Transitions the page fades in instead of morphing (DESIGN.md "Motion").
  const [fade] = useState(() => !canMorph())
  const hasOverride = !!fruit.stateOverrides?.[state]

  return (
    <article className={clsx('flex flex-col pb-8', fade && 'route-fade')}>
      <PageHeader back={{ name: 'browse' }} />

      <div className="flex flex-col gap-6 px-4">
        <div className="flex flex-col gap-4">
          <div className="aspect-[4/3] overflow-hidden rounded-card bg-tile" style={{ viewTransitionName: 'fruit-hero' }}>
            {fruit.image && !heroFailed ? (
              <img
                src={fruitImageUrl(fruit, 960)}
                alt={fruit.name}
                width={960}
                height={720}
                onError={() => setHeroFailed(true)}
                className="size-full object-cover"
              />
            ) : (
              <span role="img" aria-label={fruit.name} className="flex size-full items-center justify-center text-[96px]">{fruit.emoji}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <h1 className="font-display text-hero font-semibold">{fruit.name}</h1>
            <p className="flex flex-wrap items-baseline gap-x-2 text-small text-ink-2">
              <StatusLabel status={fruitStatus(fruit, month, state)} />
              <span>in {STATE_NAMES[state]}{hasOverride ? ' (its own season here)' : ''}</span>
            </p>
            <p className="text-body text-ink">{statusSentence(fruit, month, state)}</p>
          </div>

          <SeasonBar fruit={fruit} month={month} state={state} size="lg" marker initials animate />

          <button
            type="button"
            aria-pressed={inBag}
            onClick={() => updateBag(b => (inBag ? removeItem(b, fruitItemId(fruit.id)) : addFruit(b, fruit)))}
            className={clsx(
              'inline-flex h-12 items-center justify-center gap-2 rounded-control font-semibold',
              inBag ? 'bg-tile text-ink active:bg-tile-strong' : 'bg-ink text-paper active:opacity-90',
            )}
          >
            {inBag ? <Check aria-hidden="true" className="tick-in size-5" strokeWidth={2.5} /> : <Plus aria-hidden="true" className="size-5" />}
            {inBag ? 'In your bag (tap to remove)' : 'Add to bag'}
          </button>
        </div>

        {(fruit.pick || fruit.storage) && (
          <div className="flex flex-col gap-2">
            {fruit.pick && <TipBlock Icon={Hand} title="How to pick" text={fruit.pick} />}
            {fruit.storage && <TipBlock Icon={Refrigerator} title="How to store" text={fruit.storage} />}
          </div>
        )}

        {fruit.stateNote && <TipBlock Icon={MapPin} title="Varies by state" text={fruit.stateNote} />}

        {fruit.recipes && fruit.recipes.length > 0 && (
          <section aria-labelledby="ideas" className="flex flex-col gap-2">
            <h2 id="ideas" className="font-display text-title font-semibold">Recipe ideas</h2>
            <RecipeIdeas recipes={fruit.recipes} />
          </section>
        )}

        {fruit.pairings && fruit.pairings.length > 0 && (
          <section aria-labelledby="pairs" className="flex flex-col gap-2">
            <h2 id="pairs" className="font-display text-title font-semibold">Goes well with</h2>
            <ul className="flex flex-wrap gap-2">
              {fruit.pairings.map(p => (
                <li key={p} className="rounded-full bg-card px-3 py-1.5 text-small text-ink">{p}</li>
              ))}
            </ul>
          </section>
        )}

        <details className="group rounded-card bg-card">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
            <span className="font-display text-title font-semibold">More about it</span>
            <ChevronDown aria-hidden="true" className="size-5 text-ink-2 transition-transform duration-200 group-open:rotate-180" />
          </summary>
          <div className="flex flex-col gap-4 px-4 pb-4">
            {fruit.notes && <p className="text-body">{fruit.notes}</p>}
            {fruit.origin && <Fact title="Origin" text={fruit.origin} />}
            {fruit.history && <Fact title="History" text={fruit.history} />}
            {fruit.nutrition && (
              <div className="flex flex-col gap-2">
                <h3 className="text-small font-semibold text-ink">Nutrition, per 100 g</h3>
                <dl className="grid grid-cols-3 gap-2">
                  <Figure label="Energy" value={`${fruit.nutrition.calories} cal`} />
                  {fruit.nutrition.vitaminC !== undefined && <Figure label="Vitamin C" value={`${fruit.nutrition.vitaminC} mg`} />}
                  {fruit.nutrition.fiber !== undefined && <Figure label="Fibre" value={`${fruit.nutrition.fiber} g`} />}
                </dl>
                <p className="text-small text-ink-2">{fruit.nutrition.highlights.join('. ')}.</p>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <h3 className="text-small font-semibold text-ink">Where the season comes from</h3>
              <ul className="flex flex-col gap-1">
                {fruit.sources.map(s => (
                  <li key={s.url} className="text-small text-ink-2">
                    <a href={s.url} target="_blank" rel="noreferrer" className="text-ink underline">{s.name}</a>
                  </li>
                ))}
              </ul>
              <p className="text-caption text-ink-3">Checked {checkedOn(fruit.checkedOn)}</p>
            </div>
          </div>
        </details>
      </div>
    </article>
  )
}

function TipBlock({ Icon, title, text }: { Icon: typeof Hand; title: string; text: string }) {
  return (
    <section className="flex items-start gap-3 rounded-card bg-card p-4">
      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-tile text-ink-2">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <h2 className="text-body font-semibold">{title}</h2>
        <p className="text-body text-ink-2">{text}</p>
      </div>
    </section>
  )
}

function Fact({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="text-small font-semibold text-ink">{title}</h3>
      <p className="text-body text-ink-2">{text}</p>
    </div>
  )
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-control bg-tile p-3">
      <dt className="text-caption text-ink-2">{label}</dt>
      <dd className="text-body font-semibold tabular-nums">{value}</dd>
    </div>
  )
}
