import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import clsx from 'clsx'
import { ChevronRight, CookingPot, Flower2, Hourglass, Leaf, Citrus, Sparkles, Star, Sun, type LucideIcon } from 'lucide-react'
import type { Fruit, Month, RecipeSuggestion, Season } from '../types/fruit'
import { FRUITS } from '../assets/fruits'
import { isArriving, isEnding, isInSeason, monthOffset, nowSections, seasonOf, sortBySeason } from '../utils/seasonality'
import { MONTH_NAMES, weekOfYear } from '../utils/months'
import { glanceTip } from '../utils/tips'
import { seasonTones, toneVars, tonesOf } from '../utils/tones'
import { FruitSticker } from '../components/FruitSticker'
import { Link } from '../components/Link'
import { NowHero } from '../components/NowHero'
import { StatusSticker } from '../components/StatusSticker'
import { TopBar } from '../components/TopBar'

// "What should we buy right now?" on one screen, as a gelato counter: the page is the season's sorbet,
// the month's peak fruit drop into a dish you can cut them open in, and each fruit to buy is a chunky
// block in its own colour with the fruit stuck on inside it.
// Buy now shows up to 5; in a heavy month it shows fewer plus "See all", fewer still when both rails
// below need room.
const BUY_NOW_ROWS = 5

const SEASON_ICON: Record<Season, LucideIcon> = { Spring: Flower2, Summer: Sun, Autumn: Leaf, Winter: Citrus }

// The blocks pop in the first time Now opens in a session, not every time you come back to it.
let introPlayed = false

export function NowPage({ month, onSeeAllPeak, onSeeInSeason }: { month: Month; onSeeAllPeak: () => void; onSeeInSeason: () => void }) {
  const { buyNow, justLanded, endingSoon } = nowSections(FRUITS, month)
  const overflow = buyNow.length > BUY_NOW_ROWS
  const bothRails = justLanded.length > 0 && endingSoon.length > 0
  const rows = overflow ? buyNow.slice(0, bothRails ? BUY_NOW_ROWS - 2 : BUY_NOW_ROWS - 1) : buyNow
  const ideas = cookThisWeek(buyNow)
  const season = seasonOf(month)
  const s = seasonTones(season)
  const SeasonIcon = SEASON_ICON[season]
  const [intro] = useState(() => !introPlayed)
  useEffect(() => { introPlayed = true }, [])
  // The dish holds the month's peak fruit; in a month with none at peak, what is in season. Keyed on
  // the ids so the scene is not rebuilt (and the fruit dropped again) every time the page re-renders.
  const pool = buyNow.length ? buyNow : sortBySeason(FRUITS.filter(f => isInSeason(f, month)), month)
  const heroIds = [...pool].sort((x, y) => showpiece(x) - showpiece(y)).slice(0, 5).map(f => f.id).join()
  const heroFruits = heroList(heroIds)

  return (
    <div className="flex flex-col pb-6">
      <TopBar title={MONTH_NAMES[month]} intro={intro} />
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 pt-1">
        <span
          className="inline-flex h-8 items-center gap-1.5 rounded-full bg-(--pop) px-3 text-[14px] font-extrabold tracking-[0.04em] text-(--ink) uppercase shadow-[0_0_0_2px_var(--color-sticker)]"
          style={{ transform: 'rotate(-3deg)' }}
        >
          <SeasonIcon aria-hidden="true" className="size-4" strokeWidth={2.75} />
          {season}
        </span>
        <span className="text-small font-bold">What's good in Victoria</span>
      </div>

      {heroFruits.length > 0 && <NowHero fruits={heroFruits} tones={s} />}

      <div className="flex flex-col gap-9 px-4 pt-5">
        <section aria-labelledby="buy-now" className="flex flex-col gap-4">
          <SectionTitle id="buy-now" Icon={Star} title="Buy now" note={`${buyNow.length} at their peak`} />
          {buyNow.length === 0 ? (
            <p className="rounded-block bg-(--bright) p-5 text-body font-semibold text-(--ink)">
              Nothing is at its peak in Victoria this month.{' '}
              <button type="button" onClick={onSeeInSeason} className="inline-flex min-h-11 items-center font-extrabold underline">See what is in season</button>
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {rows.map((f, i) => (
                <li key={f.id} className={clsx(intro && 'pop-in')} style={{ '--i': i, '--from-tilt': i % 2 ? '3deg' : '-3deg' } as CSSProperties}>
                  <BuyRow fruit={f} month={month} />
                </li>
              ))}
              {overflow && (
                <li>
                  <button
                    type="button"
                    onClick={onSeeAllPeak}
                    className="press block-shadow flex min-h-14 w-full items-center justify-between rounded-full bg-(--bright) pr-4 pl-6 text-body font-extrabold text-(--ink)"
                  >
                    See all {buyNow.length} at their peak
                    <ChevronRight aria-hidden="true" className="size-6" strokeWidth={2.75} />
                  </button>
                </li>
              )}
            </ul>
          )}
        </section>

        {justLanded.length > 0 && <Rail id="just-landed" Icon={Sparkles} title="Just landed" note="New this month" fruits={justLanded} intro={intro} />}
        {endingSoon.length > 0 && <Rail id="ending-soon" Icon={Hourglass} title="Ending soon" note="Last month" fruits={endingSoon} intro={intro} ending />}

        {ideas.length > 0 && (
          <section aria-labelledby="cook-week" className="flex flex-col gap-4">
            <SectionTitle
              id="cook-week"
              Icon={CookingPot}
              title="Cook this week"
              action={<Link to={{ name: 'cook' }} className="inline-flex min-h-11 items-center text-small font-extrabold underline">All ideas</Link>}
            />
            <ul className="-mx-4 flex snap-x gap-3 overflow-x-auto scroll-px-4 px-4 pb-2 scrollbar-hide">
              {ideas.map(({ fruit, recipe }, i) => <RecipeCard key={`${fruit.id}-${recipe.name}`} fruit={fruit} recipe={recipe} i={i} intro={intro} />)}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}

// A fruit to buy: a chunky block in its own colour, the fruit stuck on inside, its name, a tag when it
// is new or nearly gone, and a one-line pick tip for the shop.
function BuyRow({ fruit, month }: { fruit: Fruit; month: Month }) {
  const tip = glanceTip(fruit.pick)
  return (
    <Link
      to={{ name: 'fruit', id: fruit.id }}
      className="press block-shadow flex items-center gap-3 rounded-block bg-(--pop) py-3 pr-4 pl-3 text-(--ink)"
      style={toneVars(tonesOf(fruit.colour))}
    >
      <FruitSticker fruit={fruit} size={80} eager />
      <span className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
        <Tag fruit={fruit} month={month} />
        <span className="font-display text-name">{fruit.name}</span>
        {tip && <span className="text-small font-semibold text-(--ink-soft)">{tip}</span>}
      </span>
    </Link>
  )
}

// New at peak, Just landed or Last month, when that's true. Plain peak needs no tag in Buy now.
function Tag({ fruit, month }: { fruit: Fruit; month: Month }) {
  if (isEnding(fruit, month)) return <StatusSticker status="ending" label="Last month" size="sm" />
  if (isArriving(fruit, month)) {
    const word = isInSeason(fruit, monthOffset(month, -1)) ? 'New at peak' : 'Just landed'
    return <StatusSticker status="peak" icon="new" label={word} size="sm" tilt={3} />
  }
  return <StatusSticker status="peak" label="At its peak" size="sm" tilt={-3} />
}

function SectionTitle({ id, Icon, title, note, action }: { id: string; Icon: LucideIcon; title: string; note?: string; action?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-3">
      <h2 id={id} className="flex items-center gap-2.5 font-display text-title">
        <span aria-hidden="true" className="inline-flex size-9 shrink-0 -rotate-6 items-center justify-center rounded-full bg-(--bright) text-(--ink)">
          <Icon className="size-[18px]" strokeWidth={2.5} />
        </span>
        {title}
      </h2>
      {note && <span className="pb-1 text-small font-bold tabular-nums">{note}</span>}
      {action}
    </div>
  )
}

// Round scoops on a sideways rail, each fruit stuck on inside its own colour.
function Rail({ id, Icon, title, note, fruits, intro, ending = false }: { id: string; Icon: LucideIcon; title: string; note: string; fruits: Fruit[]; intro: boolean; ending?: boolean }) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <SectionTitle id={id} Icon={Icon} title={title} note={note} />
      <ul className="-mx-4 flex snap-x gap-2 overflow-x-auto scroll-px-4 px-4 pt-1 pb-2 scrollbar-hide">
        {fruits.map((f, i) => (
          <li key={f.id} className={clsx('w-[96px] shrink-0 snap-start', intro && 'pop-in')} style={{ '--i': i + 3 } as CSSProperties}>
            <Link to={{ name: 'fruit', id: f.id }} className="press flex flex-col items-center gap-2 text-center">
              <span
                className="relative flex size-[86px] items-center justify-center rounded-full bg-(--pop) shadow-[0_4px_0_0_var(--shadow)]"
                style={{ ...toneVars(tonesOf(f.colour)), transform: `rotate(${i % 2 ? 4 : -4}deg)` }}
              >
                <FruitSticker fruit={f} size={64} />
                {ending && <StatusSticker status="ending" label="Last" size="sm" className="absolute -right-2 -bottom-1" tilt={8} />}
              </span>
              <span className="text-small leading-tight font-bold">{f.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

function RecipeCard({ fruit, recipe, i, intro }: { fruit: Fruit; recipe: RecipeSuggestion; i: number; intro: boolean }) {
  return (
    <li className={clsx('flex w-64 shrink-0 snap-start', intro && 'pop-in')} style={{ '--i': i + 5 } as CSSProperties}>
      <Link
        to={{ name: 'fruit', id: fruit.id }}
        className="press block-shadow flex w-full items-start gap-3 rounded-block bg-(--bright) p-4 text-(--ink)"
        style={toneVars(tonesOf(fruit.colour))}
      >
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-caption font-extrabold tracking-[0.06em] text-(--ink-soft) uppercase">{fruit.name}</span>
          <span className="text-body leading-snug font-extrabold">{recipe.name}</span>
          <span className="text-small font-medium text-(--ink-soft)">{recipe.description}</span>
        </span>
        <FruitSticker fruit={fruit} size={56} />
      </Link>
    </li>
  )
}

// The dish shows off the fruit with the best insides first (a watermelon in summer, kiwi and citrus in
// winter), then the rest of the month's peak fruit in Buy now order (the sort is stable).
const SHOWPIECES = ['watermelon', 'dragon-fruit', 'kiwifruit', 'passionfruit', 'avocado', 'pomegranate', 'papaya', 'rockmelon', 'grapefruit', 'orange', 'peach', 'fig', 'mango', 'strawberry', 'pineapple']
const showpiece = (f: Fruit) => {
  const i = SHOWPIECES.indexOf(f.id)
  return i < 0 ? SHOWPIECES.length : i
}

// One array per set of ids, so the hero sees the same list (and keeps its scene) across re-renders.
const heroCache = new Map<string, Fruit[]>()
function heroList(ids: string): Fruit[] {
  let list = heroCache.get(ids)
  if (!list) {
    list = ids.split(',').map(id => FRUITS.find(f => f.id === id)).filter((f): f is Fruit => !!f)
    heroCache.set(ids, list)
  }
  return list
}

// Up to 3 recipe ideas from fruit at peak, rotating weekly.
function cookThisWeek(peak: Fruit[]): { fruit: Fruit; recipe: RecipeSuggestion }[] {
  const week = weekOfYear()
  return peak
    .filter(f => f.recipes?.length)
    .slice(0, 3)
    .map(f => ({ fruit: f, recipe: f.recipes![week % f.recipes!.length] }))
}
