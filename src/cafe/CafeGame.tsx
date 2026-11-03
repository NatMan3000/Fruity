import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react'
import clsx from 'clsx'
import { ChefHat, ChevronRight, Star, Sticker } from 'lucide-react'
import type { Fruit, Month } from '../types/fruit'
import { FRUITS } from '../assets/fruits'
import { TopBar } from '../components/TopBar'
import { useStoredState } from '../hooks/useStoredState'
import { fruitStatus } from '../utils/seasonality'
import { toneVars, tonesOf } from '../utils/tones'
import { BowlStage } from './components/BowlStage'
import { BackDisc, Disc, SoundButton } from './components/Controls'
import { MENU_COLOURS, pill } from './ui'
import type { BowlMood } from './components/BowlFace'
import { CustomerFace, type CustomerMood } from './components/CustomerFace'
import { OrderBubble } from './components/OrderBubble'
import { RecipeCard } from './components/RecipeCard'
import { ServeResult } from './components/ServeResult'
import { Shelf } from './components/Shelf'
import { StickerBook } from './components/StickerBook'
import { CUSTOMERS, type Customer } from './customers'
import { checkBowl, generateOrder, hintFor, isFreshNow, matches, orderSentence, wantsFilled, type Order, type OrderContext } from './logic/orders'
import {
  applyServe, isProgress, LEVEL_NAMES, levelFor, levelProgress, NEW_PROGRESS, newStickers, scoreServe, STIR_TARGET,
  type CafeProgress, type ServeScore,
} from './logic/progress'
import { traitsOf } from './logic/traits'
import type { BowlItem } from './three/BowlScene'
import { sfx, speak, useSound } from '../audio/sound'
import './cafe.css'

// Fruit Salad Cafe: customers order by pictures, the kid fills a 3D bowl (drop, chop, stir),
// serves it for stars and stickers, and a grown-up can turn the bowl into a real recipe.
// Lazy-loaded from App.tsx. It wears the app's look (DESIGN.md "Fruit Salad Cafe"): the season's page,
// the screen's tones, Shrikhand and Bricolage, chunky blocks; cafe.css holds only its one-shot motion.

const MAX_IN_BOWL = 6

type Mode = 'menu' | 'cafe' | 'free'
type Overlay = null | 'stickers' | 'recipe'

interface Round {
  customer: Customer
  order: Order
  hello: string
}

interface Served {
  score: ServeScore
  thanks: string
  stickers: string[]
  levelUp: { level: number; name: string } | null
}

const pick = <T,>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)]

function useReducedMotion(): boolean {
  return useSyncExternalStore(
    cb => {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
      mq.addEventListener('change', cb)
      return () => mq.removeEventListener('change', cb)
    },
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
}

export default function CafeGame({ month }: { month: Month }) {
  const ctx: OrderContext = useMemo(() => ({ month }), [month])
  const reducedMotion = useReducedMotion()
  const [progress, setProgress] = useStoredState<CafeProgress>('fruity.cafe', NEW_PROGRESS, isProgress)
  const level = levelFor(progress.stars)

  const [mode, setMode] = useState<Mode>('menu')
  const [overlay, setOverlay] = useState<Overlay>(null)
  const [round, setRound] = useState<Round | null>(null)
  const [bowl, setBowl] = useState<BowlItem[]>([])
  const [stir, setStir] = useState(0)
  const [hint, setHint] = useState<string | null>(null)
  const [served, setServed] = useState<Served | null>(null)
  const [customerMood, setCustomerMood] = useState<CustomerMood>('neutral')
  const [bowlMood, setBowlMood] = useState<BowlMood>('hungry')
  const [caption, setCaption] = useState<string | null>(null)
  const [dropping, setDropping] = useState<boolean | null>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const moodTimer = useRef<number | undefined>(undefined)
  const keySeq = useRef(0)
  const lastSwish = useRef(0)
  // Latest bowl and stir for timers and physics callbacks that outlive a render.
  const live = useRef({ bowl, stir })
  useEffect(() => { live.current = { bowl, stir } }, [bowl, stir])

  // The game and its overlays own the whole screen: no page scroll or rubber-banding under a drag.
  // The cafe door is an ordinary page and scrolls.
  const covered = mode !== 'menu' || overlay !== null
  useEffect(() => {
    if (!covered) return
    const html = document.documentElement
    const before = html.style.overflow
    html.style.overflow = 'hidden'
    return () => { html.style.overflow = before }
  }, [covered])

  const [sound, flipSound] = useSound()
  useEffect(() => () => window.clearTimeout(moodTimer.current), [])

  const fruitsById = useMemo(() => new Map(FRUITS.map(f => [f.id, f])), [])
  const bowlFruits = useMemo(() => bowl.map(b => fruitsById.get(b.fruitId)).filter((f): f is Fruit => !!f), [bowl, fruitsById])
  const fresh = useMemo(() => new Set(FRUITS.filter(f => isFreshNow(f, ctx)).map(f => f.id)), [ctx])
  const inBowl = useMemo(() => new Set(bowl.map(b => b.fruitId)), [bowl])

  // A reaction shows for a moment, then the bowl settles back to its resting face.
  const flashMood = useCallback((m: BowlMood, say: string | null, ms = 1600) => {
    setBowlMood(m)
    setCaption(say)
    window.clearTimeout(moodTimer.current)
    moodTimer.current = window.setTimeout(() => {
      const { bowl: items, stir: stirred } = live.current
      setBowlMood(items.length === 0 ? 'hungry' : stirred >= STIR_TARGET ? 'yum' : 'happy')
      setCaption(null)
    }, ms)
  }, [])

  const resetBowl = () => {
    setBowl([])
    setStir(0)
    setHint(null)
    setBowlMood('hungry')
    setCaption(null)
  }

  const nextCustomer = (currentLevel = level) => {
    const customer = pick(CUSTOMERS.filter(c => c.id !== round?.customer.id))
    setRound({ customer, order: generateOrder(currentLevel, FRUITS, ctx), hello: pick(customer.hellos) })
    resetBowl()
    setServed(null)
    setCustomerMood('neutral')
    sfx.bell()
  }

  const openCafe = () => {
    setMode('cafe')
    nextCustomer()
  }

  const openFree = () => {
    setMode('free')
    setRound(null)
    resetBowl()
    setServed(null)
  }

  const toggleSound = () => {
    const wasOn = sound
    flipSound() // inside the tap, so iOS lets audio start
    if (!wasOn) sfx.boop()
  }

  // ---------- Bowl actions ----------

  const addFruit = (fruitId: string, dropX: number) => {
    if (served) return
    const fruit = fruitsById.get(fruitId)
    if (!fruit) return
    if (inBowl.has(fruitId)) {
      flashMood('happy', `${fruit.name} is already in!`, 1200)
      return
    }
    if (bowl.length >= MAX_IN_BOWL) {
      flashMood('surprised', "The bowl's full! Serve it or take one out.")
      sfx.nope()
      return
    }
    const t = traitsOf(fruitId)
    const item: BowlItem = { key: `${fruitId}-${++keySeq.current}`, fruitId, chopped: t.cut === 'small', dropX }
    const next = [...bowl, item]
    setBowl(next)
    setHint(null)
    sfx.pop()
    if (!t.rawOk) flashMood('yuck', `Yuck! ${fruit.name} needs cooking first.`, 2200)
    else if (t.sour) flashMood('sour', `Sour ${fruit.name.toLowerCase()}! Just a little.`, 1800)
    else if (fruitId === 'avocado') flashMood('surprised', 'Avocado? How fancy!', 1800)
    else flashMood('yum', null, 900)
  }

  const removeFruit = (key: string) => {
    if (served) return
    const next = bowl.filter(b => b.key !== key)
    setBowl(next)
    setHint(null)
    sfx.boop()
    flashMood('surprised', null, 700)
  }

  const onChop = useCallback((key: string) => {
    sfx.chop()
    setBowl(prev => prev.map(b => (b.key === key ? { ...b, chopped: true } : b)))
    flashMood('surprised', null, 700)
  }, [flashMood])

  const onStir = useCallback((radians: number) => {
    const now = performance.now()
    if (now - lastSwish.current > 350) {
      lastSwish.current = now
      sfx.swish()
    }
    const prev = live.current.stir
    const next = prev + radians
    live.current = { ...live.current, stir: next }
    setStir(next)
    if (prev < STIR_TARGET && next >= STIR_TARGET) {
      flashMood('dizzy', 'Wheee! All stirred!', 1800)
      sfx.yay()
    }
  }, [flashMood])

  const onLand = useCallback(() => { sfx.thud() }, [])

  // ---------- Serving ----------

  const serve = () => {
    if (mode === 'free') {
      if (bowl.length === 0) {
        flashMood('hungry', 'Pop some fruit in first!')
        return
      }
      setOverlay('recipe')
      return
    }
    if (!round || served) return
    const check = checkBowl(round.order, bowlFruits, ctx)
    if (!check.ok) {
      setHint(hintFor(check, round.order, FRUITS))
      setCustomerMood('thinking')
      sfx.nope()
      return
    }
    const allChopped = bowl.every(b => b.chopped)
    const score = scoreServe(allChopped, stir >= STIR_TARGET)
    const stickers = newStickers(progress, [...inBowl], round.customer.id, score.stars)
    const nextProgress = applyServe(progress, score.stars, stickers)
    const newLevel = levelFor(nextProgress.stars)
    setProgress(nextProgress)
    setServed({
      score,
      thanks: pick(round.customer.thanks),
      stickers,
      levelUp: newLevel > level ? { level: newLevel, name: LEVEL_NAMES[newLevel - 1] } : null,
    })
    setHint(null)
    setCustomerMood(score.stars === 3 ? 'delighted' : 'happy')
    setBowlMood('proud')
    setCaption(null)
    sfx.bell()
    for (let i = 0; i < score.stars; i++) setTimeout(() => sfx.star(i), 250 + i * 260)
  }

  // ---------- Words ----------

  const sentence = round ? orderSentence(round.order, FRUITS) : ''
  const filled = round ? wantsFilled(round.order, bowlFruits, ctx) : []
  const allMet = !!round && round.order.wants.every((w, i) => filled[i] >= w.count)
  const avoidHit = !!round?.order.avoid && bowlFruits.some(f => matches(round.order.avoid!, f, ctx))
  const allChopped = bowl.length > 0 && bowl.every(b => b.chopped)
  const stirred = stir >= STIR_TARGET
  const coach =
    served ? '' :
    bowl.length === 0 ? (mode === 'free' ? 'Tap or drag fruit into the bowl.' : 'Tap a fruit, or drag it into the bowl.') :
    !allChopped ? 'Swipe across a fruit to chop it!' :
    !stirred ? 'Now draw circles in the bowl to stir!' :
    mode === 'free' ? 'Looks great! Make the recipe.' : 'Yum! Serve it up!'

  const shelfFruits = useMemo(() => {
    if (mode === 'free') {
      // Every fruit you'd eat raw, fresh ones first.
      const order = { peak: 0, ending: 1, available: 2, always: 3, off: 4 } as const
      return FRUITS.filter(f => traitsOf(f.id).rawOk)
        .sort((a, b) => order[fruitStatus(a, month)] - order[fruitStatus(b, month)] || a.name.localeCompare(b.name))
    }
    return round ? round.order.shelf.map(id => fruitsById.get(id)).filter((f): f is Fruit => !!f) : []
  }, [mode, round, fruitsById, month])

  // ---------- Screens ----------

  const stars = progress.stars
  const levelBar = Math.round(levelProgress(stars) * 100)

  let body
  if (mode === 'menu') {
    // The cafe door is a page like the quiz's menu: the season's page, the app's top bar, a title in
    // Shrikhand and chunky blocks. The tab bar stays; the game itself covers it.
    body = (
      <div className="flex flex-col pb-6">
        <TopBar back={{ name: 'play' }} bag={false} right={<SoundButton on={sound} onToggle={toggleSound} />} />
        <h1 className="rise px-5 pb-1 font-display text-[clamp(2.5rem,13vw,3.5rem)] leading-none">Fruit Salad Cafe</h1>
        <p className="px-5 pb-5 text-body font-semibold">Customers order by picture. Drop, chop and stir their bowl for stars and stickers.</p>
        <ul className="flex flex-col gap-4 px-4">
          <MenuCard i={0} colour={MENU_COLOURS.cafe} title="Open the cafe!" text="A customer is waiting at the counter." onClick={openCafe} big
            art={(
              <span className="flex items-end -space-x-3" aria-hidden="true">
                {CUSTOMERS.slice(0, 4).map((c, k) => (
                  <span key={c.id} className="cafe-hop-in" style={{ animationDelay: `${180 + k * 90}ms` }}>
                    <CustomerFace customer={c} mood={k % 2 ? 'happy' : 'neutral'} size={k === 1 || k === 2 ? 84 : 70} />
                  </span>
                ))}
              </span>
            )}
          />
          <li className="pop-in" style={{ '--i': 1 } as CSSProperties}>
            <div className="flex flex-col gap-2 rounded-block bg-(--bright) p-5 text-(--ink)">
              <span className="flex items-center justify-between gap-3">
                <span className="font-display text-name">{LEVEL_NAMES[level - 1]}</span>
                <span className="rounded-full bg-(--ink) px-3 py-1 text-small font-extrabold text-(--light)">Level {level}</span>
              </span>
              <span className="block h-3.5 overflow-hidden rounded-full bg-(--ink)" aria-hidden="true">
                <span className="block h-full rounded-full bg-(--pop)" style={{ width: `${levelBar}%` }} />
              </span>
              <span className="flex items-center gap-1.5 text-small font-bold text-(--ink-soft)">
                <Star aria-hidden="true" className="size-4 text-ending" fill="currentColor" stroke="var(--ink)" strokeWidth={2.25} />
                {stars} stars · {progress.served} bowls served
              </span>
            </div>
          </li>
          <MenuCard i={2} colour={MENU_COLOURS.stickers} title="Sticker book" text="Fruit and friends you've collected." onClick={() => setOverlay('stickers')}
            badge={`${progress.stickers.length}`}
            art={<Sticker aria-hidden="true" className="size-12" strokeWidth={2.25} />}
          />
          <MenuCard i={3} colour={MENU_COLOURS.free} title="Make a fruit salad" text="For grown-ups: pick any fruit, get the recipe." onClick={openFree}
            art={<ChefHat aria-hidden="true" className="size-12" strokeWidth={2.25} />}
          />
        </ul>
      </div>
    )
  } else {
    body = (
      <div className="cafe-game fixed inset-0 z-40 flex flex-col overflow-hidden bg-(--screen) pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)] text-(--on-screen) select-none">
        <div className="mx-auto flex min-h-0 w-full max-w-xl flex-1 flex-col">
          <h1 className="sr-only">{mode === 'free' ? 'Make a fruit salad' : 'Fruit Salad Cafe'}</h1>
          <header className="flex flex-none items-center gap-2 px-4 pt-2.5 pb-1">
            <BackDisc label="Back to the cafe door" onClick={() => { setMode('menu'); setOverlay(null) }} />
            <div className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-full bg-(--ink) py-1.5 pr-3 pl-1.5 text-(--light)" role="img" aria-label={`Level ${level}, ${stars} stars`}>
              <span className="flex-none rounded-full bg-(--pop) px-2.5 py-1 text-small leading-none font-extrabold text-(--ink)">Lv {level}</span>
              {/* Outlined in pop so an empty meter still reads as a meter on the ink pill. */}
              <span className="h-3 min-w-6 flex-1 overflow-hidden rounded-full bg-(--deep) ring-2 ring-(--pop) ring-inset">
                <span className="block h-full rounded-full bg-(--pop)" style={{ width: `${levelBar}%` }} />
              </span>
              <span className="flex flex-none items-center gap-1 text-small font-extrabold tabular-nums">
                <Star aria-hidden="true" className="size-4 text-ending" fill="currentColor" strokeWidth={0} />
                {stars}
              </span>
            </div>
            <Disc label="Sticker book" onClick={() => setOverlay('stickers')}><Sticker aria-hidden="true" className="size-[22px]" strokeWidth={2.4} /></Disc>
            <SoundButton on={sound} onToggle={toggleSound} />
          </header>

          {mode === 'cafe' && round && (
            <section className="flex flex-none items-end gap-2 px-4 pt-1 pb-1" key={round.order.shelf.join()}>
              <div className={`cafe-customer cafe-customer--${customerMood} relative flex w-24 flex-none flex-col items-center`}>
                <CustomerFace customer={round.customer} mood={customerMood} size={92} />
                <span className="-mt-2 rounded-full bg-(--ink) px-2 py-0.5 text-caption font-extrabold whitespace-nowrap text-(--light)">{round.customer.name}</span>
              </div>
              <OrderBubble
                order={round.order}
                fruits={FRUITS}
                filled={filled}
                avoidHit={avoidHit}
                hello={round.hello}
                hint={hint}
                sentence={sentence}
                onHear={() => speak(`${round.hello} ${hint ?? `${sentence}, please!`}`)}
              />
            </section>
          )}
          {mode === 'free' && (
            <section className="flex-none px-5 pt-1 pb-1">
              <h2 className="font-display text-title">Make a fruit salad</h2>
              <p className="text-small font-semibold">Pick up to {MAX_IN_BOWL} fruit. The sparkly ones are fresh now.</p>
            </section>
          )}

          <BowlStage
            stageRef={stageRef}
            items={bowl}
            fruits={FRUITS}
            mood={bowlMood}
            caption={caption}
            coach={coach}
            dropping={dropping}
            reducedMotion={reducedMotion}
            onChop={onChop}
            onStir={onStir}
            onLand={onLand}
            onRemove={removeFruit}
            locked={!!served}
          >
            {bowl.length > 0 && !served && (
              <ul className="pointer-events-none absolute bottom-2.5 left-1/2 flex -translate-x-1/2 gap-1.5" aria-label="Stars to earn">
                {mode === 'cafe' && <Goal done={allMet && !avoidHit}>Order</Goal>}
                <Goal done={allChopped}>Chop</Goal>
                <Goal done={stirred}>
                  Stir
                  <span className="inline-block h-2.5 w-9 overflow-hidden rounded-full bg-(--ink) ring-[1.5px] ring-(--light)" aria-hidden="true">
                    <span className="block h-full rounded-full bg-peak" style={{ width: `${Math.min(100, (stir / STIR_TARGET) * 100)}%` }} />
                  </span>
                </Goal>
              </ul>
            )}
          </BowlStage>

          {served && round ? (
            <ServeResult
              customer={round.customer}
              thanks={served.thanks}
              score={served.score}
              stickers={served.stickers}
              fruits={FRUITS}
              levelUp={served.levelUp}
              onNext={() => nextCustomer(levelFor(progress.stars))}
              onRecipe={() => setOverlay('recipe')}
            />
          ) : (
            <>
              <Shelf
                fruits={shelfFruits}
                inBowl={inBowl}
                fresh={fresh}
                stageRef={stageRef}
                scroll={mode === 'free'}
                onAdd={addFruit}
                onDragging={setDropping}
              />
              <div className="flex flex-none gap-2.5 px-4 pt-1 pb-[calc(env(safe-area-inset-bottom)+12px)]">
                <button type="button" className={clsx(pill('bright'), 'min-w-24')} onClick={() => { resetBowl(); sfx.boop() }} disabled={bowl.length === 0}>Empty</button>
                <button type="button" className={clsx(pill('ink', 'px-5 text-[1.375rem]'), 'flex-1')} onClick={serve} disabled={bowl.length === 0}>
                  {mode === 'free' ? 'Make the recipe' : 'Serve!'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      {body}
      {overlay === 'stickers' && <StickerBook stickers={progress.stickers} fruits={FRUITS} onClose={() => setOverlay(null)} />}
      {overlay === 'recipe' && bowlFruits.length > 0 && (
        <RecipeCard
          fruits={bowlFruits}
          allFruits={FRUITS}
          month={month}
          onClose={() => setOverlay(null)}
          closeLabel={mode === 'free' ? 'Back to the bowl' : 'Back to the cafe'}
        />
      )}
    </>
  )
}

function MenuCard({ i, colour, title, text, art, badge, big, onClick }: {
  i: number; colour: string; title: string; text: string; art: ReactNode; badge?: string; big?: boolean; onClick: () => void
}) {
  return (
    <li className="pop-in" style={{ '--i': i } as CSSProperties}>
      <button
        type="button"
        onClick={onClick}
        className="press block-shadow flex w-full flex-col gap-3 rounded-block bg-(--pop) p-5 text-left text-(--ink)"
        style={toneVars(tonesOf(colour))}
      >
        <span className="flex items-start justify-between gap-3">
          {art}
          {badge && <span className="rounded-full bg-(--ink) px-3 py-1.5 text-small font-extrabold text-(--light) tabular-nums" aria-hidden="true">{badge}</span>}
        </span>
        <span className="flex items-end justify-between gap-3">
          <span className="flex flex-col gap-1">
            <span className={clsx('font-display', big ? 'text-[2rem] leading-none' : 'text-title')}>{title}{badge && <span className="sr-only">, {badge} collected</span>}</span>
            <span className="text-small font-semibold text-(--ink-soft)">{text}</span>
          </span>
          <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-(--ink) text-(--light)">
            <ChevronRight aria-hidden="true" className="size-6" strokeWidth={2.75} />
          </span>
        </span>
      </button>
    </li>
  )
}

// A star to earn, as a pill under the bowl: `deep` until it is earned, then `peak`.
function Goal({ done, children }: { done: boolean; children: ReactNode }) {
  return (
    <li className={clsx('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-small font-extrabold whitespace-nowrap', done ? 'bg-peak text-peak-ink' : 'bg-(--deep) text-(--light)')}>
      <Star aria-hidden="true" className="size-4" fill={done ? 'currentColor' : 'none'} strokeWidth={2.5} />
      {children}
    </li>
  )
}
