import { useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import { ArrowRightLeft, Check, ChefHat, Clock, Gauge, Heart, Lightbulb, Minus, PartyPopper, Plus, Refrigerator, ShoppingBag, Users } from 'lucide-react'
import type { Fruit, Month } from '../types/fruit'
import type { Recipe } from '../types/recipe'
import { FRUITS } from '../assets/fruits'
import { updateBag } from '../hooks/useBag'
import { isoDay, recordMade, toggleSaved, useRecipeBox } from '../hooks/useRecipeBox'
import { useRecipeSession } from '../hooks/useRecipeSession'
import { navigate } from '../hooks/useRoute'
import { addRecipe } from '../utils/bag'
import { formatMinutes, mainFruit, recipeStatus, totalMinutes, TYPE_LABEL } from '../utils/recipes'
import { scaleQty } from '../utils/scale'
import { statusWord } from '../utils/status'
import { dishUrl } from '../utils/images'
import { FruitSticker } from '../components/FruitSticker'
import { StatusSticker } from '../components/StatusSticker'
import { TopBar } from '../components/TopBar'

// A recipe's own screen, in its main fruit's colour edge to edge (App sets the screen tones, like a
// fruit's page). The fruit drops onto its blob, the facts, a serves stepper that rescales the
// ingredients, a tickable ingredient list that fills the bag, the method as big numbered cards, and
// "We made this". Lazy: its own chunk with cook mode's entry button.
const MIN_SERVES = 1
const MAX_SERVES = 12

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function RecipePage({ recipe, month }: { recipe: Recipe; month: Month }) {
  const main = mainFruit(recipe, FRUITS)
  const extras = recipe.fruitIds.slice(1).map(id => FRUITS.find(f => f.id === id)).filter((f): f is Fruit => !!f)
  const status = recipeStatus(recipe, FRUITS, month)
  const box = useRecipeBox()
  const saved = box.saved.includes(recipe.id)
  const [session, setSession] = useRecipeSession(recipe.id)
  const serves = session.serves ?? recipe.serves ?? null
  const factor = recipe.serves && serves ? serves / recipe.serves : 1
  const ticked = new Set(session.ticked)

  return (
    <article className="flex flex-col pb-8 text-(--ink)">
      {/* The finished dish, edge to edge under the top bar (its discs carry their own colour, so no text
          sits on the photo); the main fruit drops onto its lower edge, any other fruit slap on beside it */}
      <div className="relative">
        <DishHero key={recipe.id} recipe={recipe} />
        <div className="absolute inset-x-0 top-0 z-10">
          <TopBar back={{ name: 'cook' }} right={<SaveDisc saved={saved} onToggle={() => toggleSaved(recipe.id)} name={recipe.name} />} />
        </div>
        <div className="pointer-events-none absolute right-3 -bottom-16 z-10 flex items-end" aria-hidden="true">
          {/* One tight bunch in the corner (Nathan, 3 Nov 2026: two or more fruit sat spread up the photo):
              the other fruit tuck in against the main one, overlapping it, all straddling the photo's edge. */}
          {extras.slice(0, 2).map((f, i) => (
            <span key={f.id} className={clsx('-mr-6', i ? 'mb-[44px]' : 'mb-[30px]')}>
              <FruitSticker fruit={f} size={i ? 60 : 72} slap delay={520 + i * 140} tilt={i ? -10 : 8} />
            </span>
          )).reverse()}
          {main && <div className="drop-squash"><FruitSticker fruit={main} size={132} tilt={-4} eager /></div>}
        </div>
      </div>

      <header className="relative flex flex-col items-start gap-3 px-5 pt-6">
        <div className="flex flex-wrap items-center gap-2 pr-[136px]">
          <span
            className="slap inline-flex h-8 items-center rounded-full bg-(--ink) px-3 text-[13px] font-extrabold tracking-[0.06em] text-(--light) uppercase"
            style={{ '--tilt': '-4deg', '--delay': '560ms', transform: 'rotate(var(--tilt))' } as CSSProperties}
          >
            {TYPE_LABEL[recipe.type]}
          </span>
          {main && (status === 'peak'
            ? <StatusSticker status="peak" label="In season" size="md" tilt={3} slap delay={660} />
            : <StatusSticker status={status} label={`${main.name}: ${statusWord(status)}`} size="md" tilt={3} slap delay={660} />)}
        </div>
        <h1 className="font-display text-[clamp(2.25rem,10.5vw,3rem)] leading-[1.04] break-words">{recipe.name}</h1>
        <p className="text-[18px] leading-snug font-semibold">{recipe.blurb}</p>
        <ul className="flex flex-wrap gap-2 pt-1">
          <Fact Icon={Clock}>{formatMinutes(totalMinutes(recipe))}{recipe.minutes.cook > 0 && <span className="font-semibold"> ({recipe.minutes.prep} prep, {recipe.minutes.cook} cook)</span>}</Fact>
          <Fact Icon={Users}>{recipe.makes ? `Makes ${recipe.makes}` : `Serves ${serves}`}</Fact>
          <Fact Icon={Gauge}>{recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}</Fact>
        </ul>
        {status === 'off' && main && recipe.swaps?.length ? (
          <a href="#swaps" onClick={e => { e.preventDefault(); document.getElementById('swaps')?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' }) }} className="inline-flex min-h-11 items-center text-body font-extrabold underline">
            <ArrowRightLeft aria-hidden="true" className="mr-2 size-5 shrink-0" strokeWidth={2.5} />
            See the swaps
          </a>
        ) : null}
      </header>

      <div className="flex flex-col gap-5 px-4 pt-6">
        <button
          type="button"
          onClick={() => navigate({ name: 'cookmode', id: recipe.id })}
          className="press block-shadow inline-flex h-16 items-center justify-center gap-2.5 rounded-full bg-(--ink) text-[19px] font-extrabold text-(--light)"
        >
          <ChefHat aria-hidden="true" className="size-6" strokeWidth={2.5} />
          Start cooking
          <span className="text-[14px] font-bold">(step by step)</span>
        </button>

        <section aria-labelledby="ingredients" className="flex flex-col gap-3 pt-2">
          <div className="flex flex-wrap items-end justify-between gap-x-3 gap-y-2 px-1">
            <h2 id="ingredients" className="font-display text-title">Ingredients</h2>
            {ticked.size > 0 && (
              <span className="flex items-center gap-2 pb-1 text-small font-bold tabular-nums">
                {ticked.size} of {recipe.ingredients.length} ticked
                <button type="button" onClick={() => setSession(s => ({ ...s, ticked: [] }))} className="inline-flex min-h-11 items-center underline">Clear</button>
              </span>
            )}
          </div>
          {recipe.serves && serves !== null && (
            <ServesStepper
              serves={serves}
              base={recipe.serves}
              onChange={n => setSession(s => ({ ...s, serves: n === recipe.serves ? null : n }))}
            />
          )}
          <ul className="flex flex-col gap-0.5 rounded-block bg-(--bright) p-2">
            {recipe.ingredients.map((ing, i) => {
              const on = ticked.has(i)
              const fruit = ing.fruitId ? FRUITS.find(f => f.id === ing.fruitId) : undefined
              return (
                <li key={i}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={on}
                    onClick={() => setSession(s => ({ ...s, ticked: on ? s.ticked.filter(t => t !== i) : [...s.ticked, i] }))}
                    className="flex min-h-14 w-full items-center gap-3 rounded-[20px] px-2 py-1.5 text-left active:bg-(--pop)"
                  >
                    <span className={clsx('inline-flex size-7 shrink-0 items-center justify-center rounded-full', on ? 'bg-peak text-peak-ink' : 'ring-[2.5px] ring-(--ink-soft) ring-inset')}>
                      {on && <Check aria-hidden="true" className="tick-in size-4" strokeWidth={3.25} />}
                    </span>
                    <span className={clsx('min-w-0 flex-1 text-body leading-snug', on && 'text-(--ink-soft) line-through')}>
                      <span className="font-extrabold tabular-nums">{scaleQty(ing.qty, factor)}</span>{' '}
                      <span className="font-medium">{ing.item}</span>
                    </span>
                    {fruit && <FruitSticker fruit={fruit} size={36} />}
                  </button>
                </li>
              )
            })}
          </ul>
          <BagButtons recipe={recipe} factor={factor} />
        </section>

        <section aria-labelledby="method" className="flex flex-col gap-3 pt-2">
          <h2 id="method" className="px-1 font-display text-title">Method</h2>
          <ol className="flex flex-col gap-3">
            {recipe.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3 rounded-block bg-(--bright) p-4">
                <span aria-hidden="true" className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-(--deep) font-display text-[1.5rem] text-(--light)" style={{ transform: `rotate(${i % 2 ? 5 : -5}deg)` }}>
                  {i + 1}
                </span>
                <p className="min-w-0 flex-1 pt-1.5 text-[18px] leading-[1.45] font-medium">
                  <span className="sr-only">Step {i + 1}. </span>{step}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {recipe.tip && <Note Icon={Lightbulb} title="Tip" text={recipe.tip} />}
        {recipe.keep && <Note Icon={Refrigerator} title="Keeping it" text={recipe.keep} />}

        {recipe.swaps && recipe.swaps.length > 0 && (
          <section id="swaps" aria-labelledby="swaps-title" className="flex scroll-mt-4 flex-col gap-3 pt-2">
            <h2 id="swaps-title" className="flex items-center gap-2.5 px-1 font-display text-title">
              <ArrowRightLeft aria-hidden="true" className="size-6" strokeWidth={2.5} />
              {status === 'off' ? 'Out of season? Try:' : 'Swap it for'}
            </h2>
            <ul className="flex flex-col gap-2">
              {recipe.swaps.map(s => (
                <li key={s} className="rounded-[22px] bg-(--deep) px-4 py-3 text-body font-bold text-(--light)">{s}</li>
              ))}
            </ul>
          </section>
        )}

        <MadeIt recipe={recipe} dates={box.made[recipe.id] ?? []} extras={[main, ...extras].filter((f): f is Fruit => !!f)} />

        <p className="px-1 text-small font-semibold text-(--ink-soft)">
          {recipe.reviewed ? 'Written for Fruity and tested in a home kitchen.' : 'Written for Fruity. Not yet tested in our kitchen, so trust your eyes and your oven.'}
        </p>
      </div>
    </article>
  )
}

// The 1200 hero is cached the first time a recipe is opened; offline before that, it falls back to the
// precached 720 card photo rather than a broken image.
function DishHero({ recipe }: { recipe: Recipe }) {
  const [small, setSmall] = useState(false)
  return (
    <img
      src={dishUrl(recipe.id, small ? 720 : 1200)}
      alt={`${recipe.name}, the finished dish`}
      width={1200}
      height={900}
      decoding="async"
      fetchPriority="high"
      onError={() => setSmall(true)}
      className="block aspect-[4/3] max-h-[60dvh] w-full rounded-b-[40px] bg-(--deep) object-cover object-[50%_60%]"
    />
  )
}

function Fact({ Icon, children }: { Icon: typeof Clock; children: ReactNode }) {
  return (
    <li className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-(--deep) px-3.5 py-1.5 text-small font-extrabold text-(--light) tabular-nums">
      <Icon aria-hidden="true" className="size-4 shrink-0" strokeWidth={2.5} />
      <span>{children}</span>
    </li>
  )
}

function SaveDisc({ saved, onToggle, name }: { saved: boolean; onToggle: () => void; name: string }) {
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Saved: ${name}. Tap to unsave` : `Save ${name}`}
      onClick={onToggle}
      className={clsx('press inline-flex size-12 shrink-0 items-center justify-center rounded-full', saved ? 'bg-(--ink) text-(--light)' : 'bg-(--bright) text-(--ink)')}
    >
      <Heart key={String(saved)} aria-hidden="true" className={clsx('size-[22px]', saved && 'badge-pop')} strokeWidth={2.5} fill={saved ? 'currentColor' : 'none'} />
    </button>
  )
}

function ServesStepper({ serves, base, onChange }: { serves: number; base: number; onChange: (n: number) => void }) {
  const step = (by: number) => onChange(Math.min(MAX_SERVES, Math.max(MIN_SERVES, serves + by)))
  return (
    <div className="flex items-center gap-3 rounded-full bg-(--ink) p-1.5 text-(--light)">
      <button type="button" onClick={() => step(-1)} disabled={serves <= MIN_SERVES} aria-label="Fewer serves" className="press inline-flex size-12 items-center justify-center rounded-full bg-(--pop) text-(--ink) disabled:opacity-40">
        <Minus aria-hidden="true" className="size-5" strokeWidth={3} />
      </button>
      <p className="flex flex-1 flex-col items-center leading-tight" aria-live="polite">
        <span className="font-display text-[1.5rem] tabular-nums">Serves {serves}</span>
        <span className="text-caption font-bold">{serves === base ? 'as written' : `scaled from ${base}; times and dish sizes are for ${base}`}</span>
      </p>
      <button type="button" onClick={() => step(1)} disabled={serves >= MAX_SERVES} aria-label="More serves" className="press inline-flex size-12 items-center justify-center rounded-full bg-(--pop) text-(--ink) disabled:opacity-40">
        <Plus aria-hidden="true" className="size-5" strokeWidth={3} />
      </button>
    </div>
  )
}

interface Flyer { key: string; x: number; y: number; dx: number; dy: number; delay: number; fruit?: Fruit; label?: string }

// "Add fruit to bag" and "Add all to bag". The button swells and turns peak green, the fruit hop one
// after another into the bag in the header (whose count pops), the extra items follow as one pill.
function BagButtons({ recipe, factor }: { recipe: Recipe; factor: number }) {
  const [flyers, setFlyers] = useState<Flyer[]>([])
  const [done, setDone] = useState<'fruit' | 'all' | null>(null)
  const fruitBtn = useRef<HTMLButtonElement>(null)
  const allBtn = useRef<HTMLButtonElement>(null)
  const fruits = [...new Set(recipe.ingredients.map(i => i.fruitId).filter((id): id is string => !!id))]
    .map(id => FRUITS.find(f => f.id === id)).filter((f): f is Fruit => !!f)
  const others = recipe.ingredients.filter(i => !i.fruitId).length

  const add = (which: 'fruit' | 'all') => {
    updateBag(b => addRecipe(b, recipe, FRUITS, factor, which))
    setDone(which)
    if (reducedMotion()) return
    const btn = (which === 'fruit' ? fruitBtn : allBtn).current
    btn?.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.06)', offset: 0.35 }, { transform: 'scale(1)' }],
      { duration: 420, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
    )
    const from = btn?.getBoundingClientRect()
    const to = document.querySelector('[data-bag-disc]')?.getBoundingClientRect()
    if (!from || !to) return
    const x = from.left + from.width / 2, y = from.top + from.height / 2
    const dx = to.left + to.width / 2 - x, dy = to.top + to.height / 2 - y
    const stamp = Date.now()
    const list: Flyer[] = fruits.slice(0, 4).map((f, i) => ({ key: `${stamp}-${f.id}`, x: x + (i - 1.5) * 30, y, dx: dx - (i - 1.5) * 30, dy, delay: i * 110, fruit: f }))
    if (which === 'all' && others) list.push({ key: `${stamp}-more`, x, y, dx, dy, delay: list.length * 110, label: `+${others}` })
    setFlyers(list)
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        ref={fruitBtn}
        type="button"
        onClick={() => add('fruit')}
        className={clsx('press block-shadow inline-flex min-h-14 items-center justify-center gap-2.5 rounded-full px-5 text-[18px] font-extrabold', done === 'fruit' ? 'bg-peak text-peak-ink' : 'bg-(--ink) text-(--light)')}
      >
        {done === 'fruit'
          ? <span className="tick-spin inline-flex size-8 items-center justify-center rounded-full bg-peak-ink text-peak"><Check aria-hidden="true" className="size-5" strokeWidth={3.25} /></span>
          : <ShoppingBag aria-hidden="true" className="size-5" strokeWidth={2.5} />}
        {done === 'fruit' ? 'Fruit in your bag' : `Add fruit to bag (${fruits.length})`}
      </button>
      <button
        ref={allBtn}
        type="button"
        onClick={() => add('all')}
        className={clsx('press block-shadow inline-flex min-h-14 items-center justify-center gap-2.5 rounded-full px-5 text-[18px] font-extrabold', done === 'all' ? 'bg-peak text-peak-ink' : 'bg-(--bright) text-(--ink)')}
      >
        {done === 'all'
          ? <span className="tick-spin inline-flex size-8 items-center justify-center rounded-full bg-peak-ink text-peak"><Check aria-hidden="true" className="size-5" strokeWidth={3.25} /></span>
          : <Plus aria-hidden="true" className="size-5" strokeWidth={3} />}
        {done === 'all' ? 'Everything in your bag' : 'Add all to bag'}
      </button>
      <p aria-live="polite" className="sr-only">{done === 'fruit' ? 'Fruit added to your bag.' : done === 'all' ? 'All ingredients added to your bag.' : ''}</p>
      {flyers.length > 0 && createPortal(
        flyers.map((f, i) => (
          <span
            key={f.key}
            aria-hidden="true"
            className="fly-to-bag pointer-events-none fixed z-50"
            style={{ left: f.x - 26, top: f.y - 26, '--fly-x': `${f.dx}px`, '--fly-y': `${f.dy}px`, animationDelay: `${f.delay}ms`, animationFillMode: 'both' } as CSSProperties}
            onAnimationEnd={() => { if (i === flyers.length - 1) setFlyers([]) }}
          >
            {f.fruit
              ? <FruitSticker fruit={f.fruit} size={52} />
              : <span className="inline-flex h-11 min-w-11 items-center justify-center rounded-full bg-(--ink) px-3 text-[15px] font-extrabold text-(--light) shadow-[0_0_0_3px_var(--color-sticker)]">{f.label}</span>}
          </span>
        )),
        document.body,
      )}
    </div>
  )
}

const dayName = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })

// "We made this": records today and throws a little party of the recipe's fruit (once, one-shot).
function MadeIt({ recipe, dates, extras }: { recipe: Recipe; dates: string[]; extras: Fruit[] }) {
  const [party, setParty] = useState(0)
  const madeToday = dates.length > 0 && dates[dates.length - 1] === isoDay()
  const make = () => {
    recordMade(recipe.id)
    if (!reducedMotion()) setParty(Date.now())
  }
  const line = dates.length === 0
    ? 'Made it? Tap to keep a note of when.'
    : dates.length === 1
      ? `You made this on ${dayName(dates[0])}.`
      : `Made ${dates.length} times, last on ${dayName(dates[dates.length - 1])}.`
  const bits = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2 + 0.3
    const dist = 90 + (i % 3) * 28
    return { dx: Math.cos(angle) * dist, dy: Math.sin(angle) * dist - 40, rot: (i % 2 ? 1 : -1) * (120 + i * 20), fruit: extras[i % extras.length], i }
  })

  return (
    <section aria-labelledby="made" className="relative flex flex-col items-stretch gap-2 rounded-block bg-(--deep) p-4 text-(--light)">
      <h2 id="made" className="sr-only">We made this</h2>
      <button
        type="button"
        onClick={make}
        disabled={madeToday}
        className={clsx('press relative inline-flex min-h-14 items-center justify-center gap-2.5 rounded-full px-5 text-[18px] font-extrabold', madeToday ? 'bg-peak text-peak-ink' : 'bg-(--pop) text-(--ink)')}
      >
        <PartyPopper aria-hidden="true" className={clsx('size-6', party > 0 && 'tick-spin')} key={party} strokeWidth={2.5} />
        {madeToday ? 'Made it today!' : 'We made this'}
        {party > 0 && (
          <span aria-hidden="true" className="pointer-events-none absolute top-1/2 left-1/2" key={`p${party}`}>
            {bits.map(b => (
              <span
                key={b.i}
                className="confetti absolute"
                style={{ '--dx': `${b.dx}px`, '--dy': `${b.dy}px`, '--rot': `${b.rot}deg`, animationDelay: `${b.i * 18}ms` } as CSSProperties}
              >
                {b.i % 3 === 2 || !b.fruit
                  ? <span className="block size-3.5 rounded-full shadow-[0_0_0_2px_var(--color-sticker)]" style={{ background: ['var(--color-peak)', 'var(--color-ending)', 'var(--color-always)', 'var(--color-off)'][b.i % 4] }} />
                  : <FruitSticker fruit={b.fruit} size={34} tilt={false} />}
              </span>
            ))}
          </span>
        )}
      </button>
      <p aria-live="polite" className="text-center text-small font-bold">{line}</p>
    </section>
  )
}

function Note({ Icon, title, text }: { Icon: typeof Lightbulb; title: string; text: string }) {
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
