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
import { lazy, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import clsx from 'clsx'
import { Citrus, Flower2, Leaf, Sun, type LucideIcon } from 'lucide-react'
import type { Month, Season } from '../types/fruit'
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
import { cutLine } from '../utils/welcome'
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
  const others = dish.slice(1, 5)
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

  const dialog = useRef<HTMLDialogElement>(null)
  const halves = useRef<(HTMLDivElement | null)[]>([])
  const pieces3d = useRef<HTMLDivElement>(null)
  const leaving = useRef(false)
  const [ready3d, setReady3d] = useState(false)
  const [failed3d, setFailed3d] = useState(false) // the scene threw: the sticker is the fruit after all
  const [cut, setCut] = useState<'whole' | 'cut' | 'cut2d'>('whole')
  const [slash, showSlash] = useSlash()
  const like = useMemo(() => ({ id: lead.id, name: lead.name, colour: lead.colour }), [lead.id, lead.name, lead.colour])

  // Modal, so the app underneath can be neither reached nor heard until the tap; up before first paint.
  useLayoutEffect(() => {
    const d = dialog.current
    if (d && !d.open) d.showModal()
    overrideThemeColour(tones.page)
    return () => overrideThemeColour(null)
  }, [tones.page])

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
      <header className="absolute inset-x-0 top-[calc(env(safe-area-inset-top)+6vh)] flex flex-col items-center gap-2 px-4 text-center">
        <span
          className="welcome-rise inline-flex h-8 items-center gap-1.5 rounded-full bg-(--pop) px-3 text-[14px] font-extrabold tracking-[0.04em] text-(--ink) uppercase shadow-[0_0_0_2px_var(--color-sticker)]"
          style={{ transform: 'rotate(-3deg)' }}
        >
          <SeasonIcon aria-hidden="true" className="size-4" strokeWidth={2.75} />
          {MONTH_NAMES[month]} · {season}
        </span>
        <span className={clsx('welcome-word font-display leading-[0.95] text-(--light)', fontReady ? 'slap' : 'invisible')} style={{ '--tilt': '-4deg', '--delay': '80ms' } as CSSProperties}>
          Fruity
        </span>
      </header>
      {others.map((f, i) => (
        <span key={f.id} className="absolute" style={CORNERS[i]}>
          {/* 3d-fallback-ok: art, not a 3D stand-in (the month's other fruit as stickers round the edge) */}
          <FruitSticker fruit={f} size={Math.round(size * 0.34)} slap delay={260 + i * 90} tilt={TILTS[i]} eager />
        </span>
      ))}
      {/* The fruit's juicy blob, and the sticker until the 3D fruit takes its place */}
      <span
        className="welcome-blob absolute rounded-[58%_42%_49%_51%/46%_55%_45%_54%] bg-(--pop)"
        style={{ left: cx - size * 0.62, top: cy - size * 0.55, width: size * 1.24, height: size * 1.1 }}
      />
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

// The month's other dish fruit, stuck on round the edges, partly off the screen.
const CORNERS: CSSProperties[] = [
  { left: '-4%', top: '29%' },
  { right: '-3%', top: '25%' },
  { left: '5%', bottom: '17%' },
  { right: '4%', bottom: '21%' },
]
const TILTS = [-14, 12, 9, -10]

// The 3D scene failed: tell the welcome, which then shows the fruit's sticker in its place.
function Failed({ onFail }: { onFail: () => void }) {
  useEffect(() => { onFail() }, [onFail])
  return null
}
