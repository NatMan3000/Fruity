import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import type { Fruit, Month } from '../types/fruit'
import { FRUITS } from '../assets/fruits'
import { useAusState } from '../hooks/useAusState'
import { goBack } from '../hooks/useRoute'
import { useStoredState } from '../hooks/useStoredState'
import { fruitStatus } from '../utils/seasonality'
import { BowlStage } from './components/BowlStage'
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
import { setSound, sfx, speak } from './sound'
import './cafe.css'

// Fruit Salad Cafe: customers order by pictures, the kid fills a 3D bowl (drop, chop, stir),
// serves it for stars and stickers, and a grown-up can turn the bowl into a real recipe.
// Lazy-loaded from App.tsx; its look lives in cafe.css so it is its own bright world.

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
  const { state } = useAusState()
  const ctx: OrderContext = useMemo(() => ({ month, state }), [month, state])
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

  // The game owns the whole screen: no page scroll or rubber-banding under a drag.
  useEffect(() => {
    const html = document.documentElement
    const before = html.style.overflow
    html.style.overflow = 'hidden'
    return () => { html.style.overflow = before }
  }, [])

  useEffect(() => { setSound(progress.sound) }, [progress.sound])
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
    const on = !progress.sound
    setSound(on) // inside the tap, so iOS lets audio start
    setProgress(p => ({ ...p, sound: on }))
    if (on) sfx.boop()
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
        .sort((a, b) => order[fruitStatus(a, month, state)] - order[fruitStatus(b, month, state)] || a.name.localeCompare(b.name))
    }
    return round ? round.order.shelf.map(id => fruitsById.get(id)).filter((f): f is Fruit => !!f) : []
  }, [mode, round, fruitsById, month, state])

  // ---------- Screens ----------

  const topBar = (onBack: () => void, backLabel: string) => (
    <header className="cafe-top">
      <button type="button" className="cafe-iconbtn" onClick={onBack} aria-label={backLabel}>
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
      </button>
      <div className="cafe-level" aria-label={`Level ${level}, ${progress.stars} stars`}>
        <span className="cafe-level__badge">Lv {level}</span>
        <span className="cafe-level__bar"><span style={{ width: `${Math.round(levelProgress(progress.stars) * 100)}%` }} /></span>
        <span className="cafe-level__stars">★ {progress.stars}</span>
      </div>
      <button type="button" className="cafe-iconbtn" onClick={() => setOverlay('stickers')} aria-label="Sticker book">
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round"><path d="M5 4h11l3 3v13H5z" /><path d="M9 13l2 2 4-4" strokeLinecap="round" /></svg>
      </button>
      <SoundButton on={progress.sound} onToggle={toggleSound} />
    </header>
  )

  let body
  if (mode === 'menu') {
    body = (
      <div className="cafe-menu">
        <header className="cafe-top cafe-top--menu">
          <button type="button" className="cafe-iconbtn" onClick={() => goBack({ name: 'play' })} aria-label="Back to Play">
            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <span />
          <SoundButton on={progress.sound} onToggle={toggleSound} />
        </header>
        <div className="cafe-awning" aria-hidden="true" />
        <h1 className="cafe-sign">Fruit Salad <span>Cafe</span></h1>
        <ul className="cafe-menu__queue" aria-hidden="true">
          {CUSTOMERS.slice(0, 4).map((c, i) => (
            <li key={c.id} style={{ animationDelay: `${i * 90}ms` }}><CustomerFace customer={c} mood={i % 2 ? 'happy' : 'neutral'} size={i === 1 || i === 2 ? 92 : 76} /></li>
          ))}
        </ul>
        <div className="cafe-menu__level">
          <span className="cafe-level__badge">Level {level}</span>
          <strong>{LEVEL_NAMES[level - 1]}</strong>
          <span className="cafe-level__bar cafe-level__bar--wide"><span style={{ width: `${Math.round(levelProgress(progress.stars) * 100)}%` }} /></span>
          <span className="cafe-menu__stats">★ {progress.stars} stars · {progress.served} bowls served</span>
        </div>
        <div className="cafe-menu__actions">
          <button type="button" className="cafe-btn cafe-btn--go cafe-btn--huge" onClick={openCafe}>Open the cafe!</button>
          <button type="button" className="cafe-btn cafe-btn--sun" onClick={() => setOverlay('stickers')}>
            Sticker book <span className="cafe-count">{progress.stickers.length}</span>
          </button>
          <button type="button" className="cafe-btn cafe-btn--grownup" onClick={openFree}>
            <span>Make a fruit salad</span>
            <small>pick any fruit, get the recipe</small>
          </button>
        </div>
      </div>
    )
  } else {
    body = (
      <div className={`cafe-play${mode === 'free' ? ' cafe-play--free' : ''}`}>
        <h1 className="cafe-sr">{mode === 'free' ? 'Make a fruit salad' : 'Fruit Salad Cafe'}</h1>
        {topBar(() => { setMode('menu'); setOverlay(null) }, 'Back to the cafe door')}
        {mode === 'cafe' && round && (
          <section className="cafe-counter" key={round.order.shelf.join()}>
            <div className={`cafe-customer cafe-customer--${customerMood}`}>
              <CustomerFace customer={round.customer} mood={customerMood} size={92} />
              <span className="cafe-customer__name">{round.customer.name}</span>
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
          <section className="cafe-freehead">
            <h2>Make a fruit salad</h2>
            <p>Pick up to {MAX_IN_BOWL} fruit. The sparkly ones are fresh now.</p>
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
            <ul className="cafe-goals" aria-label="Stars to earn">
              {mode === 'cafe' && <li className={allMet && !avoidHit ? 'is-done' : ''}><span aria-hidden="true">★</span> Order</li>}
              <li className={allChopped ? 'is-done' : ''}><span aria-hidden="true">★</span> Chop</li>
              <li className={stirred ? 'is-done' : ''}>
                <span aria-hidden="true">★</span> Stir
                <span className="cafe-goals__meter" aria-hidden="true"><span style={{ width: `${Math.min(100, (stir / STIR_TARGET) * 100)}%` }} /></span>
              </li>
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
            <div className="cafe-actions">
              <button type="button" className="cafe-btn cafe-btn--plain" onClick={() => { resetBowl(); sfx.boop() }} disabled={bowl.length === 0}>Empty</button>
              <button type="button" className="cafe-btn cafe-btn--go cafe-btn--serve" onClick={serve} disabled={bowl.length === 0}>
                {mode === 'free' ? 'Make the recipe' : 'Serve!'}
              </button>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className={`cafe${reducedMotion ? ' cafe--calm' : ''}`}>
      {body}
      {overlay === 'stickers' && <StickerBook stickers={progress.stickers} fruits={FRUITS} state={state} onClose={() => setOverlay(null)} />}
      {overlay === 'recipe' && bowlFruits.length > 0 && (
        <RecipeCard
          fruits={bowlFruits}
          allFruits={FRUITS}
          month={month}
          state={state}
          onClose={() => setOverlay(null)}
          closeLabel={mode === 'free' ? 'Back to the bowl' : 'Back to the cafe'}
        />
      )}
    </div>
  )
}

function SoundButton({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button type="button" className={`cafe-iconbtn${on ? ' is-on' : ''}`} onClick={onToggle} aria-pressed={on} aria-label={on ? 'Sound on' : 'Sound off'}>
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
        {on ? <path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" /> : <path d="M17 9l5 6M22 9l-5 6" />}
      </svg>
    </button>
  )
}
