import { useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import { Check, ChevronDown, Hand, Plus, Refrigerator } from 'lucide-react'
import type { Fruit, Month } from '../types/fruit'
import { updateBag, useBag } from '../hooks/useBag'
import { addFruit, fruitItemId, hasFruit, removeItem } from '../utils/bag'
import { fruitStatus } from '../utils/seasonality'
import { statusSentence } from '../utils/status'
import { FruitHero } from '../components/FruitHero'
import { FruitSticker } from '../components/FruitSticker'
import { RecipeIdeas } from '../components/RecipeIdeas'
import { SeasonLegend, SeasonStrip } from '../components/SeasonStrip'
import { StatusSticker } from '../components/StatusSticker'
import { TopBar } from '../components/TopBar'

// A fruit's own screen is its colour, edge to edge (App sets the screen tones from the fruit). The blob
// springs in, the 3D fruit drops onto it spinning (FruitHero; cut it open with a tap), the status is
// slapped on, and the year's bars bounce up one by one.
export function FruitDetailPage({ fruit, month }: { fruit: Fruit; month: Month }) {
  const bag = useBag()
  const inBag = hasFruit(bag, fruit.id)
  const status = fruitStatus(fruit, month)
  const pairTilt = [-2, 1.5, -1, 2, 0]

  return (
    <article className="flex flex-col pb-8 text-(--ink)">
      <TopBar back={{ name: 'browse' }} />

      <FruitHero fruit={fruit} />

      <div className="relative z-10 flex flex-col items-start gap-3 px-5 pt-1">
        <StatusSticker status={status} size="lg" tilt={-6} slap delay={620} />
        <h1 className="font-display text-hero break-words">{fruit.name}</h1>
        <p className="text-[18px] leading-snug font-bold">{statusSentence(fruit, month)}</p>
      </div>

      <div className="flex flex-col gap-5 px-4 pt-6">
        {/* The year, as twelve scoops on the fruit's deep tone (the bouncy Market Sticker entrance) */}
        <section aria-labelledby="year" className="block-shadow rounded-[30px] bg-(--deep) p-4 pb-3 text-(--light)">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-1">
            <h2 id="year" className="font-display text-[1.5rem] leading-tight">The year</h2>
            <SeasonLegend short />
          </div>
          <SeasonStrip fruit={fruit} month={month} size="lg" initials animate />
        </section>

        <AddToBag fruit={fruit} inBag={inBag} />

        {(fruit.pick || fruit.storage) && (
          <div className="flex flex-col gap-3">
            {fruit.pick && <Tip Icon={Hand} title="How to pick" text={fruit.pick} />}
            {fruit.storage && <Tip Icon={Refrigerator} title="How to store" text={fruit.storage} />}
          </div>
        )}

        {fruit.recipes && fruit.recipes.length > 0 && (
          <section aria-labelledby="ideas" className="flex flex-col gap-3 pt-2">
            <h2 id="ideas" className="px-1 font-display text-title">Recipe ideas</h2>
            <RecipeIdeas recipes={fruit.recipes} />
          </section>
        )}

        {fruit.pairings && fruit.pairings.length > 0 && (
          <section aria-labelledby="pairs" className="flex flex-col gap-3 pt-2">
            <h2 id="pairs" className="px-1 font-display text-title">Goes with</h2>
            <ul className="flex flex-wrap gap-2">
              {fruit.pairings.map((p, i) => (
                <li key={p} className="rounded-full bg-(--deep) px-4 py-2 text-body font-bold text-(--light)" style={{ transform: `rotate(${pairTilt[i % 5]}deg)` }}>
                  {p}
                </li>
              ))}
            </ul>
          </section>
        )}

        {(fruit.notes || fruit.origin || fruit.history || fruit.nutrition) && (
        <details className="group mt-2 rounded-block bg-(--bright)">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-5 py-3 [&::-webkit-details-marker]:hidden">
            <span className="font-display text-[1.375rem]">More about it</span>
            <ChevronDown aria-hidden="true" className="size-6 transition-transform duration-200 group-open:rotate-180" strokeWidth={2.5} />
          </summary>
          <div className="flex flex-col gap-4 px-5 pb-5 text-body">
            {fruit.notes && <p className="font-medium">{fruit.notes}</p>}
            {fruit.origin && <Fact title="Origin" text={fruit.origin} />}
            {fruit.history && <Fact title="History" text={fruit.history} />}
            {fruit.nutrition && (
              <div className="flex flex-col gap-2">
                <h3 className="text-caption font-extrabold tracking-[0.06em] text-(--ink-soft) uppercase">Nutrition, per 100 g</h3>
                <dl className="grid grid-cols-3 gap-2">
                  <Figure label="Energy" value={`${fruit.nutrition.calories} cal`} />
                  {fruit.nutrition.vitaminC !== undefined && <Figure label="Vitamin C" value={`${fruit.nutrition.vitaminC} mg`} />}
                  {fruit.nutrition.fiber !== undefined && <Figure label="Fibre" value={`${fruit.nutrition.fiber} g`} />}
                </dl>
                <p className="text-small font-medium text-(--ink-soft)">{fruit.nutrition.highlights.join('. ')}.</p>
              </div>
            )}
          </div>
        </details>
        )}
      </div>
    </article>
  )
}

// Add to bag: a fat dark pill. Adding swells it, turns it peak green, spins the tick in, and a small
// sticker of the fruit hops up into the bag in the header (whose count then pops).
function AddToBag({ fruit, inBag }: { fruit: Fruit; inBag: boolean }) {
  const button = useRef<HTMLButtonElement>(null)
  const [fly, setFly] = useState<{ x: number; y: number; dx: number; dy: number; key: number } | null>(null)

  const toggle = () => {
    if (inBag) {
      updateBag(b => removeItem(b, fruitItemId(fruit.id)))
      return
    }
    updateBag(b => addFruit(b, fruit))
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // Swell once (Web Animations, so the button is not remounted and keeps keyboard focus).
    button.current?.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.07)', offset: 0.35 }, { transform: 'scale(1)' }],
      { duration: 420, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
    )
    const from = button.current?.getBoundingClientRect()
    const to = document.querySelector('[data-bag-disc]')?.getBoundingClientRect()
    if (from && to) {
      const x = from.left + from.width / 2, y = from.top + from.height / 2
      setFly({ x, y, dx: to.left + to.width / 2 - x, dy: to.top + to.height / 2 - y, key: Date.now() })
    }
  }

  return (
    <>
      <button
        ref={button}
        type="button"
        aria-pressed={inBag}
        onClick={toggle}
        className={clsx(
          'press block-shadow inline-flex h-16 items-center justify-center gap-2.5 rounded-full text-[19px] font-extrabold',
          inBag ? 'bg-peak text-peak-ink' : 'bg-(--ink) text-(--light)',
        )}
      >
        {inBag ? (
          <span className="tick-spin inline-flex size-9 items-center justify-center rounded-full bg-peak-ink text-peak">
            <Check aria-hidden="true" className="size-6" strokeWidth={3.25} />
          </span>
        ) : (
          <Plus aria-hidden="true" className="size-6" strokeWidth={3} />
        )}
        {inBag ? 'In your bag' : 'Add to bag'}
        {inBag && <span className="text-[14px] font-bold">(tap to remove)</span>}
      </button>
      {fly && createPortal(
        <span
          key={fly.key}
          aria-hidden="true"
          className="fly-to-bag pointer-events-none fixed z-50"
          style={{ left: fly.x - 28, top: fly.y - 28, '--fly-x': `${fly.dx}px`, '--fly-y': `${fly.dy}px` } as CSSProperties}
          onAnimationEnd={() => setFly(null)}
        >
          <FruitSticker fruit={fruit} size={56} />
        </span>,
        document.body,
      )}
    </>
  )
}

function Tip({ Icon, title, text }: { Icon: typeof Hand; title: string; text: string }) {
  return (
    <section className="flex items-start gap-3 rounded-block bg-(--bright) p-4">
      <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-(--pop)">
        <Icon aria-hidden="true" className="size-6" strokeWidth={2.25} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h2 className="font-display text-[1.25rem] leading-tight">{title}</h2>
        <p className="text-body leading-snug font-medium text-(--ink-soft)">{text}</p>
      </div>
    </section>
  )
}

function Fact({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="text-caption font-extrabold tracking-[0.06em] text-(--ink-soft) uppercase">{title}</h3>
      <p className="font-medium">{text}</p>
    </div>
  )
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-[18px] bg-(--pop) p-3">
      <dt className="text-caption font-bold text-(--ink-soft)">{label}</dt>
      <dd className="text-[1.125rem] font-extrabold tabular-nums">{value}</dd>
    </div>
  )
}
