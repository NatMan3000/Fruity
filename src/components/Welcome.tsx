// The welcome screen (DESIGN.md "Welcome", Nathan's D21, 3 Nov 2026): "Fruity" in big Shrikhand over
// this month's lead fruit, floating and slowly turning in 3D on the season's colour. No "Tap to slice"
// cue: it is obvious what to do (Nathan, 3 Nov 2026).
// The whole screen is one button. The tap cuts the fruit along a knife stroke (the slice sound, juice),
// the pieces fly apart and the screen itself splits along the same line, its two halves pulling apart to
// show the app underneath (Now on a launch, the linked screen on a deep link, whatever was there on a
// return), in about 0.8 s. The tap is also the gesture iOS needs to start sound, so the Now bowl that
// drops in after it is heard (the heroes wait for the welcome to go: useWelcome.ts).
//
// Paints at once from the main bundle (colour, wordmark, the fruit's blob); the 3D fruit is a lazy chunk
// that appears in the empty blob when its first frame is up. Never the fruit's photo first and then the 3D
// (DESIGN.md "3D", rule 1: the third time it happened, 3 Nov 2026). No WebGL, or the scene fails: the
// sticker is the fruit, and is cut with the screen. Reduced motion: still there, still needs the tap, then a short fade.
//
// While it waits it is alive (Nathan, 3 Nov 2026: "This feels a little plain now"): the month's other fruit
// stuck round the edge each bob and jiggle on their own rhythm, one at a time hopping or wiggling, sundae
// sprinkles drift behind everything, sparkles twinkle by the fruit, and the letters of "Fruity" hop in a
// wave every few seconds, the pill wiggling on the same beat. All of it is CSS transform and opacity (the
// hops Web Animations), it all freezes the moment the tap starts the split, and none of it runs under
// reduced motion. Everything is drawn in both halves of the screen, so it splits with it.
import { lazy, memo, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import clsx from 'clsx'
import { Citrus, Flower2, Leaf, Sun, type LucideIcon } from 'lucide-react'
import type { Fruit, Month, Season } from '../types/fruit'
import { FRUITS } from '../assets/fruits'
import { prepareAudio, sfx, unlockAudio } from '../audio/sound'
import { useSlash, webgl } from '../hooks/useLazy3D'
import { overrideThemeColour } from '../hooks/useScreen'
import { finishWelcome, leaveWelcome, useWelcome } from '../hooks/useWelcome'
import { MODELLED } from '../three/modelled'
import { dishFruits } from '../utils/dishFruits'
import { MONTH_NAMES } from '../utils/months'
import { parseRoute } from '../utils/route'
import { seasonOf } from '../utils/seasonality'
import { seasonTones, toneVars } from '../utils/tones'
import { cutLine, seeded, sprinkleField, stickerRing, welcomeFruits, welcomeStage, type Sprinkle, type StickerSpot } from '../utils/welcome'
import { FruitSticker } from './FruitSticker'
import { Fallback, Slash } from './Lazy3D'
import { HeroDish, SpinFruit } from './heroScenes'

const WelcomeFruit = lazy(() => import('../three/WelcomeFruit'))

const SEASON_ICON: Record<Season, LucideIcon> = { Spring: Flower2, Summer: Sun, Autumn: Leaf, Winter: Citrus }

// The knife's line (CSS degrees: rising to the right), and the exit's beats in ms from the tap.
const ANGLE = -16
const PART_DELAY = 50   // the halves start to part just after the stroke starts
const PART_MS = 700     // ...and are off the screen by about 750
const FADE_3D_AT = 420  // the flying pieces fade over the revealed screen
const FADE_3D_MS = 300
const STILL_FADE_MS = 220 // reduced motion: the whole welcome fades
const GUARD_MS = 1600   // the welcome goes by then whatever happens to the animations

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function Welcome({ month }: { month: Month }) {
  const state = useWelcome()
  if (state === 'gone') return null
  return <WelcomeScreen month={month} />
}

function useViewport() {
  const read = () => ({ w: window.innerWidth, h: window.innerHeight })
  const [v, setV] = useState(read)
  useEffect(() => {
    const on = () => setV(read())
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return v
}

// The 3D fruit is built only while the page is on screen (the welcome also goes up as the app is hidden).
function useVisible() {
  const [visible, setVisible] = useState(() => document.visibilityState === 'visible')
  useEffect(() => {
    const on = () => setVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', on)
    return () => document.removeEventListener('visibilitychange', on)
  }, [])
  return visible
}

// The wordmark waits (briefly) for Shrikhand, so it never shows in the fallback face and then jumps.
function useDisplayFont() {
  const [ready, setReady] = useState(() => !document.fonts || document.fonts.check('1em Shrikhand'))
  useEffect(() => {
    if (ready) return
    let live = true
    const go = () => { if (live) setReady(true) }
    const t = setTimeout(go, 350)
    document.fonts.load('1em Shrikhand').then(go, go)
    return () => { live = false; clearTimeout(t) }
  }, [ready])
  return ready
}

function WelcomeScreen({ month }: { month: Month }) {
  const season = seasonOf(month)
  const tones = useMemo(() => seasonTones(season), [season])
  const dish = useMemo(() => dishFruits(FRUITS, month), [month])
  const lead = dish[0] ?? FRUITS[0]
  const others = useMemo(() => welcomeFruits(FRUITS, month, dish, 9), [month, dish])
  const SeasonIcon = SEASON_ICON[season]
  const { w, h } = useViewport()
  const visible = useVisible()
  const fontReady = useDisplayFont()
  const three = webgl && MODELLED.has(lead.id)

  // Layout: the fruit's middle a little below the screen's, the cut through it
  const size = Math.round(Math.min(w * 0.66, h * 0.36, 320))
  const cx = w / 2, cy = Math.round(h * 0.52)
  const line = useMemo(() => cutLine(w, h, cx, cy, ANGLE), [w, h, cx, cy])
  const canvasH = h + 2 * Math.abs(cy - h / 2) // centred on the fruit, still covering the whole screen

  // The life round the fruit is laid out once the title's place is known (measured before the first
  // paint; it does not depend on the font, since the wordmark's line height is fixed).
  const header = useRef<HTMLElement>(null)
  const [titleBottom, setTitleBottom] = useState<number | null>(null)
  const stage = useMemo(() => (titleBottom === null ? null : welcomeStage(w, h, cx, cy, size, titleBottom)), [w, h, cx, cy, size, titleBottom])
  const spots = useMemo(() => (stage ? stickerRing(stage, others.length) : []), [stage, others.length])
  const sprinkles = useMemo(() => (stage ? sprinkleField(stage, spots, MONTH_SEED[month]) : []), [stage, spots, month])
  const sparkles = useMemo(() => SPARKLES.map(p => {
    const t = (p.a * Math.PI) / 180
    return { ...p, x: cx + Math.cos(t) * size * 0.62 * p.r, y: cy + Math.sin(t) * size * 0.55 * p.r }
  }), [cx, cy, size])

  const dialog = useRef<HTMLDialogElement>(null)
  const halves = useRef<(HTMLDivElement | null)[]>([])
  const pieces3d = useRef<HTMLDivElement>(null)
  const leaving = useRef(false)
  const [ready3d, setReady3d] = useState(false)
  const [failed3d, setFailed3d] = useState(false) // the scene threw: the sticker is the fruit after all
  const [cut, setCut] = useState<'whole' | 'cut' | 'cut2d'>('whole')
  const [slash, showSlash] = useSlash()
  const like = useMemo(() => ({ id: lead.id, name: lead.name, colour: lead.colour }), [lead.id, lead.name, lead.colour])

  // Now and then one sticker hops or wiggles (in both halves at once, so they match at the cut): one at a
  // time, every couple of seconds, round them all in a shuffled order. Stopped by the tap (freeze()).
  const hops = useRef<(HTMLSpanElement | null)[][]>([[], []])
  const hopping = useRef<Animation[]>([])
  const hopTimer = useRef(0)
  const placed = spots.length
  useEffect(() => {
    if (!placed || reducedMotion()) return
    const rnd = seeded(placed * 7919 + MONTH_SEED[month])
    let order: number[] = []
    let last = -1
    const next = () => {
      if (!order.length) {
        order = Array.from({ length: placed }, (_, i) => i).sort(() => rnd() - 0.5)
        if (order[0] === last && placed > 1) order.push(order.shift()!)
      }
      return (last = order.shift()!)
    }
    const hop = () => {
      hopTimer.current = window.setTimeout(hop, 1900 + rnd() * 900)
      if (document.visibilityState !== 'visible' || leaving.current) return
      const i = next()
      const frames = rnd() < 0.5 ? HOP : WIGGLE
      hopping.current = hops.current.map(row => row[i]?.animate(frames, { duration: frames === HOP ? 620 : 680, easing: 'ease-out' })).filter((a): a is Animation => !!a)
    }
    hopTimer.current = window.setTimeout(hop, 1500)
    return () => clearTimeout(hopTimer.current)
  }, [placed, month])

  // The tap: everything idle stops where it is, so the two halves fly apart as one still picture. Each
  // loop's pose at that instant is written onto its element and the loop removed (not just paused): a
  // half full of live compositor animations under a fresh clip-path cost WebKit a dropped frame or two
  // at the start of the split; with still pictures it is as smooth as before the welcome came alive.
  const freeze = () => {
    clearTimeout(hopTimer.current)
    const d = dialog.current
    if (!d) return
    // All the reads first, then all the writes, so this costs one style pass, not one per loop (commit and
    // cancel in turn added ~10 ms to the tap in WebKit; this way the whole tap is ~1 ms more than before).
    const loops = [...d.getAnimations({ subtree: true }), ...hopping.current].flatMap(a => {
      const el = (a.effect as KeyframeEffect | null)?.target
      return el instanceof HTMLElement || el instanceof SVGElement ? (el.closest('.welcome-idle') ? [{ a, el }] : []) : []
    })
    const poses = loops.map(({ el }) => { const cs = getComputedStyle(el); return { el, transform: cs.transform, opacity: cs.opacity } })
    for (const { el, transform, opacity } of poses) {
      el.style.transform = transform
      el.style.opacity = opacity
    }
    for (const { a } of loops) a.cancel()
    d.setAttribute('data-cut', '') // and the CSS loops stay off
  }

  // Modal, so the app underneath can be neither reached nor heard until the tap; up before first paint.
  useLayoutEffect(() => {
    const d = dialog.current
    if (d && !d.open) d.showModal()
    overrideThemeColour(tones.page)
    return () => overrideThemeColour(null)
  }, [tones.page])
  // (after showModal: a closed dialog has no layout to measure)
  useLayoutEffect(() => {
    const r = header.current?.getBoundingClientRect()
    if (r?.height) setTitleBottom(Math.round(r.bottom))
  }, [w, h])

  // While the welcome waits, get the hero under it ready, so it starts soon after the tap: its scene's
  // chunk, and its fruit models (buildFruit keeps each fruit it has built), one per idle moment so the
  // floating fruit never stutters.
  useEffect(() => {
    prepareAudio() // so the tap only has to resume it
  }, [])
  useEffect(() => {
    if (!ready3d) return
    const route = parseRoute(location.hash)
    const ids = route.name === 'fruit' ? [route.id] : route.name === 'now' ? dish.map(f => f.id) : []
    void (route.name === 'fruit' ? SpinFruit : HeroDish).preload()
    let live = true
    let handle = 0
    const idle = (fn: () => void) => ('requestIdleCallback' in window ? window.requestIdleCallback(fn, { timeout: 1000 }) : globalThis.setTimeout(fn, 120))
    void import('../three/models').then(({ buildFruit }) => {
      const next = (k: number) => {
        if (!live || k >= ids.length) return
        const f = FRUITS.find(x => x.id === ids[k])
        if (f) buildFruit(f.id, f.colour)
        handle = idle(() => next(k + 1))
      }
      handle = idle(() => next(0))
    })
    return () => {
      live = false
      if ('cancelIdleCallback' in window) window.cancelIdleCallback(handle)
      else clearTimeout(handle)
    }
  }, [ready3d, dish])

  const finish = () => {
    dialog.current?.close()
    finishWelcome()
  }

  const enter = () => {
    if (leaving.current) return
    leaving.current = true
    unlockAudio() // in the gesture itself: iOS starts (or resumes) Web Audio only here
    freeze() // before leaveWelcome, whose page-wide restyle its reads would otherwise pull into the tap
    leaveWelcome()
    const guard = setTimeout(finish, GUARD_MS)
    const done = (anims: (Animation | undefined)[]) =>
      void Promise.all(anims.map(a => a?.finished)).catch(() => {}).then(() => { clearTimeout(guard); finish() })

    if (reducedMotion()) {
      done([dialog.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: STILL_FADE_MS, easing: 'ease-out', fill: 'forwards' })])
      return
    }
    sfx.slice()
    const [top, bottom] = halves.current
    if (top && bottom) {
      top.style.clipPath = line.top
      top.style.visibility = 'visible'
      bottom.style.clipPath = line.bottom
    }
    setCut(ready3d ? 'cut' : 'cut2d')
    showSlash({ x: cx, y: cy, angle: ANGLE })
    // Each half moves off along the cut's normal (top up and left, bottom down and right), a quick
    // little parting first, then pulled away faster and faster, hinging a few degrees about the cut.
    const part = (el: HTMLDivElement | null, sign: number) => el?.animate([
      { transform: 'none', easing: 'cubic-bezier(0.2, 0.8, 0.3, 1)' },
      { transform: `translate(${sign * line.nx * 26}px, ${sign * line.ny * 26}px) rotate(${sign * 1.5}deg)`, offset: 0.2, easing: 'cubic-bezier(0.5, 0, 0.75, 0.45)' },
      { transform: `translate(${sign * line.nx * line.travel}px, ${sign * line.ny * line.travel}px) rotate(${sign * 9}deg)` },
    ], { duration: PART_MS, delay: PART_DELAY, fill: 'forwards' })
    const fade = pieces3d.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: FADE_3D_MS, delay: FADE_3D_AT, easing: 'ease-in', fill: 'forwards' })
    done([part(halves.current[0], -1), part(halves.current[1], 1), fade])
  }

  // One half of the screen: everything drawn on the welcome, clipped to its side of the cut. Until the
  // cut only the second is shown, whole: two clipped halves left a hairline along the line at rest
  // (WebKit clips each painted layer, not the half as one picture, so the edge let the page colour in).
  const half = (k: 0 | 1): ReactNode => (
    <div
      key={k}
      ref={el => { halves.current[k] = el }}
      aria-hidden="true"
      className={clsx('absolute inset-0 bg-(--page)', k === 0 && 'invisible')}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    >
      {/* Sundae sprinkles drifting behind everything */}
      <Sprinkles sprinkles={sprinkles} />
      <header ref={k === 1 ? header : undefined} className="absolute inset-x-0 top-[calc(env(safe-area-inset-top)+6vh)] flex flex-col items-center gap-2 px-4 text-center">
        <span className="welcome-pill welcome-idle inline-flex">
        <span
          className="welcome-rise inline-flex h-8 items-center gap-1.5 rounded-full bg-(--pop) px-3 text-[14px] font-extrabold tracking-[0.04em] text-(--ink) uppercase shadow-[0_0_0_2px_var(--color-sticker)]"
          style={{ transform: 'rotate(-3deg)' }}
        >
          <SeasonIcon aria-hidden="true" className="size-4" strokeWidth={2.75} />
          {MONTH_NAMES[month]} · {season}
        </span>
        </span>
        <span className={clsx('welcome-word font-display leading-[0.95] text-(--light)', fontReady ? 'slap' : 'invisible')} style={{ '--tilt': '-4deg', '--delay': '80ms' } as CSSProperties}>
          {/* Each letter hops in turn, a wave every few seconds; together they still read "Fruity" */}
          {'Fruity'.split('').map((c, i) => (
            <span key={i} className="welcome-letter welcome-idle" style={{ '--i': i } as CSSProperties}>{c}</span>
          ))}
        </span>
      </header>
      <Stickers spots={spots} fruits={others} row={hops.current[k]} />
      {/* The fruit's juicy blob, and the sticker until the 3D fruit takes its place */}
      <span
        className="welcome-blob absolute rounded-[58%_42%_49%_51%/46%_55%_45%_54%] bg-(--pop)"
        style={{ left: cx - size * 0.62, top: cy - size * 0.55, width: size * 1.24, height: size * 1.1 }}
      />
      {/* A few sparkles twinkling by the fruit, one after another */}
      <Sparkles sparkles={sparkles} />
      {(!three || failed3d) && (
        <span className="absolute flex items-center justify-center" style={{ left: cx - size / 2, top: cy - size / 2, width: size, height: size }}>
          <FruitSticker fruit={lead} size={Math.round(size * 0.9)} tilt={-6} eager />
        </span>
      )}
      {/* The cut's own face along each half's edge, once it is cut */}
      <span
        className={clsx('absolute bg-(--bright)', cut === 'whole' && 'opacity-0')}
        style={{ left: cx - line.travel * 2, top: cy - 9, width: line.travel * 4, height: 18, transform: `rotate(${ANGLE}deg)`, transformOrigin: '50% 50%' }}
      />
    </div>
  )

  return (
    <dialog
      ref={dialog}
      aria-label="Welcome to Fruity"
      className="welcome fixed inset-0 m-0 size-full max-h-none max-w-none overflow-hidden border-0 bg-transparent p-0 text-(--light) backdrop:bg-transparent"
      style={{ ...toneVars(tones), '--shadow': tones.ink } as CSSProperties}
      onCancel={e => { e.preventDefault(); enter() }}
    >
      {half(0)}
      {half(1)}
      {three && visible && cut !== 'cut2d' && (
        <div ref={pieces3d} aria-hidden="true" className="pointer-events-none absolute inset-x-0" style={{ top: cy - canvasH / 2, height: canvasH }}>
          <Fallback poster={<Failed onFail={() => setFailed3d(true)} />}>
            <Suspense fallback={null}>
              <WelcomeFruit fruit={like} size={size} angle={ANGLE} cut={cut === 'cut'} onReady={() => setReady3d(true)} className={clsx('absolute inset-0 transition-opacity duration-200', !ready3d && 'opacity-0')} />
            </Suspense>
          </Fallback>
        </div>
      )}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Slash at={slash} length={Math.hypot(w, h) * 1.1} />
      </div>
      {/* The whole screen is the button: a tap, a click, Enter or Space (Escape too) all go in */}
      <button
        type="button"
        onClick={enter}
        className="absolute inset-0 touch-none outline-none select-none focus-visible:outline-3 focus-visible:-outline-offset-8 focus-visible:outline-(--light)"
      >
        <span className="sr-only">Enter Fruity</span>
      </button>
    </dialog>
  )
}

// The life drawn in each half (memoised: the tap re-renders the welcome, and these never change with it).
const Sprinkles = memo(function Sprinkles({ sprinkles }: { sprinkles: Sprinkle[] }) {
  return sprinkles.map((p, i) => (
    <span
      key={i}
      className={clsx('welcome-sprinkle welcome-idle absolute', p.rod ? 'h-[4px] w-[13px] rounded-full' : 'size-[6px] rounded-full')}
      style={{
        left: p.x - (p.rod ? 6.5 : 3), top: p.y - (p.rod ? 2 : 3), background: `var(--${p.tone})`,
        '--rot': `${p.rot}deg`, '--dx': `${p.dx}px`, '--dy': `${p.dy}px`, '--spin': `${p.spin}deg`, '--dur': `${p.dur}ms`, '--delay': `${p.delay}ms`,
      } as CSSProperties}
    />
  ))
})

// The month's other fruit round the edge: each bobs on its own rhythm (.welcome-bob), and its inner span
// (kept in `row`) is the one the occasional hop or wiggle moves.
const Stickers = memo(function Stickers({ spots, fruits, row }: { spots: StickerSpot[]; fruits: Fruit[]; row: (HTMLSpanElement | null)[] }) {
  return spots.map((p, i) => {
    const f = fruits[i]
    const bob = BOBS[i % BOBS.length]
    return (
      <span key={f.id} className="absolute" style={{ left: p.x - p.size / 2, top: p.y - p.size / 2 }}>
        <span className="welcome-bob welcome-idle block" style={{ '--dur': `${bob.dur}ms`, '--delay': `${bob.delay}ms`, '--amp': `${bob.amp}px`, '--wob': `${bob.wob}deg` } as CSSProperties}>
          <span ref={el => { row[i] = el }} className="block">
            {/* 3d-fallback-ok: art, not a 3D stand-in (the month's other fruit as stickers round the edge, never the lead fruit) */}
            <FruitSticker fruit={f} size={p.size} slap delay={260 + i * 70} tilt={p.tilt} eager />
          </span>
        </span>
      </span>
    )
  })
})

// A few sparkles twinkling by the fruit, one after another.
const Sparkles = memo(function Sparkles({ sparkles }: { sparkles: { x: number; y: number; s: number; delay: number }[] }) {
  return sparkles.map((p, i) => (
    <svg
      key={i}
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="welcome-sparkle welcome-idle absolute text-(--light)"
      style={{ left: p.x - p.s / 2, top: p.y - p.s / 2, width: p.s, height: p.s, '--delay': `${p.delay}ms` } as CSSProperties}
    >
      <path d="M12 0c.9 6.6 4.8 10.6 12 12-7.2 1.4-11.1 5.4-12 12-.9-6.6-4.8-10.6-12-12C7.2 10.6 11.1 6.6 12 0Z" fill="currentColor" />
    </svg>
  ))
})

// Each sticker's own idle rhythm (one drift there and back), so no two move together: how long, where in
// it each starts, how far it floats (px) and how far it rocks (degrees).
const BOBS = [
  { dur: 2600, delay: -300, amp: 4, wob: 3 },
  { dur: 3100, delay: -1700, amp: 3, wob: -4 },
  { dur: 2300, delay: -900, amp: 5, wob: 2.5 },
  { dur: 3400, delay: -2500, amp: 4, wob: -3 },
  { dur: 2800, delay: -1200, amp: 3, wob: 3.5 },
  { dur: 2450, delay: -2000, amp: 4, wob: -2.5 },
  { dur: 3250, delay: -600, amp: 5, wob: 3 },
  { dur: 2700, delay: -2300, amp: 3, wob: -3.5 },
  { dur: 2950, delay: -1400, amp: 4, wob: 2.5 },
]

// The occasional bigger move: a hop with a squash as it lands, or a quick wiggle.
const HOP: Keyframe[] = [
  { transform: 'none', easing: 'cubic-bezier(0.2, 0.7, 0.4, 1)' },
  { transform: 'translateY(-18px) rotate(-7deg) scale(1.06)', offset: 0.38, easing: 'cubic-bezier(0.6, 0, 0.8, 0.4)' },
  { transform: 'translateY(0) scale(1.12, 0.88)', offset: 0.64 },
  { transform: 'scale(0.96, 1.04)', offset: 0.8 },
  { transform: 'none' },
]
const WIGGLE: Keyframe[] = [
  { transform: 'none' },
  { transform: 'rotate(13deg) scale(1.04)', offset: 0.18 },
  { transform: 'rotate(-11deg) scale(1.04)', offset: 0.4 },
  { transform: 'rotate(7deg)', offset: 0.6 },
  { transform: 'rotate(-3deg)', offset: 0.8 },
  { transform: 'none' },
]

// Sparkles at the blob's rim: the angle round it, how far out (1 = on the rim), size and when each twinkles.
const SPARKLES = [
  { a: 312, r: 0.88, s: 26, delay: 900 },
  { a: 168, r: 0.94, s: 18, delay: 2100 },
  { a: 38, r: 0.96, s: 20, delay: 3300 },
]

// The sprinkles fall the same way all month, a different way each month.
const MONTH_SEED: Record<Month, number> = { Jan: 11, Feb: 23, Mar: 37, Apr: 41, May: 53, Jun: 67, Jul: 71, Aug: 83, Sep: 97, Oct: 101, Nov: 113, Dec: 127 }

// The 3D scene failed: tell the welcome, which then shows the fruit's sticker in its place.
function Failed({ onFail }: { onFail: () => void }) {
  useEffect(() => { onFail() }, [onFail])
  return null
}
