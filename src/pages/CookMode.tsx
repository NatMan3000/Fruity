import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import clsx from 'clsx'
import { BellRing, Check, ChevronLeft, ChevronRight, Pause, Play, RotateCcw, Sun, Timer, X } from 'lucide-react'
import type { Recipe } from '../types/recipe'
import { FRUITS } from '../assets/fruits'
import { useRecipeSession } from '../hooks/useRecipeSession'
import { goBack } from '../hooks/useRoute'
import { canWakeLock, useWakeLock } from '../hooks/useWakeLock'
import { mainFruit, stepIngredients, stepTimers } from '../utils/recipes'
import { scaleQty } from '../utils/scale'
import { FruitSticker } from '../components/FruitSticker'

// Cook mode: the recipe one step at a time in big type, full screen over the tab bar, on the main fruit's
// colour. Swipe or tap Next and Back; the dots show where you are. The ingredients a step mentions sit
// above it at your serves. Any time in a step ("simmer for 20 minutes") is a tap-to-start timer with a
// countdown and a gentle chime; timers keep running when you move on. The screen stays awake.
const SWIPE = 60 // px sideways to turn the page

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

interface RunningTimer {
  id: string        // step index + label
  step: number
  label: string
  total: number     // seconds
  endsAt: number | null // ms; null while paused
  left: number      // seconds left when paused
  rang: boolean
}

// A soft three-note chime, twice, made on the fly (no audio file). The context is made in the tap that
// starts a timer, which is what lets iOS play it later.
let audio: AudioContext | null = null
function primeAudio() {
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AC) return
  audio ??= new AC()
  if (audio.state === 'suspended') void audio.resume()
}
function chime() {
  if (!audio) return
  const t0 = audio.currentTime + 0.05
  for (const [i, f] of [784, 988, 1175, 784, 988, 1175].entries()) {
    const t = t0 + i * 0.22 + (i >= 3 ? 0.5 : 0)
    const osc = audio.createOscillator()
    const g = audio.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(f, t)
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.22, t + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9)
    osc.connect(g).connect(audio.destination)
    osc.start(t)
    osc.stop(t + 0.95)
  }
  navigator.vibrate?.([180, 90, 180])
}

const clock = (s: number) => {
  const sec = Math.max(0, Math.ceil(s))
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), r = sec % 60
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}` : `${m}:${String(r).padStart(2, '0')}`
}
// Where you were and your timers, per recipe, so popping back to the recipe page and returning keeps
// both (until the app is closed).
const memory = new Map<string, { step: number; timers: RunningTimer[] }>()

// The wall clock, read only in event handlers and the ticking effect.
const stamp = () => Date.now()

const leftOf = (t: RunningTimer, now: number) => (t.endsAt === null ? t.left : (t.endsAt - now) / 1000)

export default function CookMode({ recipe }: { recipe: Recipe }) {
  const main = mainFruit(recipe, FRUITS)
  const [session] = useRecipeSession(recipe.id)
  const factor = recipe.serves && session.serves ? session.serves / recipe.serves : 1
  const [step, setStep] = useState(() => Math.min(memory.get(recipe.id)?.step ?? 0, recipe.steps.length - 1))
  const [dir, setDir] = useState<'next' | 'back'>('next')
  const [timers, setTimers] = useState<RunningTimer[]>(() => memory.get(recipe.id)?.timers ?? [])
  useEffect(() => { memory.set(recipe.id, { step, timers }) }, [recipe.id, step, timers])
  const [now, setNow] = useState(stamp)
  const [said, setSaid] = useState('')
  const drag = useRef<{ x: number; y: number } | null>(null)
  const last = recipe.steps.length - 1
  useWakeLock(true)

  // Lock the page behind (the surface scrolls itself) and land at the top.
  useEffect(() => {
    const root = document.documentElement
    root.style.overflow = 'hidden'
    return () => { root.style.overflow = '' }
  }, [])

  // Tick only while a timer is counting down (nothing runs when nothing is running), and ring any timer
  // that reaches zero, once.
  const live = useRef(timers)
  useEffect(() => { live.current = timers }, [timers])
  const counting = timers.some(t => t.endsAt !== null && !t.rang)
  useEffect(() => {
    if (!counting) return
    const id = setInterval(() => {
      const n = stamp()
      setNow(n)
      const due = live.current.filter(t => t.endsAt !== null && !t.rang && t.endsAt <= n)
      if (!due.length) return
      chime()
      setSaid(`${due.map(t => t.label).join(', ')} timer done.`)
      setTimers(ts => ts.map(t => (due.some(d => d.id === t.id) ? { ...t, rang: true, left: 0 } : t)))
    }, 250)
    return () => clearInterval(id)
  }, [counting])

  const go = (to: number) => {
    if (to < 0 || to > last || to === step) return
    setDir(to > step ? 'next' : 'back')
    setStep(to)
    setSaid(`Step ${to + 1} of ${recipe.steps.length}.`)
  }

  // Keyboard: arrows turn the page, Escape leaves.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(step + 1)
      else if (e.key === 'ArrowLeft') go(step - 1)
      else if (e.key === 'Escape') goBack({ name: 'recipe', id: recipe.id })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const onPointerDown = (e: ReactPointerEvent) => { drag.current = { x: e.clientX, y: e.clientY } }
  const onPointerUp = (e: ReactPointerEvent) => {
    const d = drag.current
    drag.current = null
    if (!d) return
    const dx = e.clientX - d.x, dy = e.clientY - d.y
    if (Math.abs(dx) > SWIPE && Math.abs(dx) > Math.abs(dy) * 1.4) go(dx < 0 ? step + 1 : step - 1)
  }

  const startTimer = (label: string, seconds: number) => {
    primeAudio()
    const id = `${step}:${label}`
    setNow(stamp())
    setTimers(ts => [...ts.filter(t => t.id !== id), { id, step, label, total: seconds, endsAt: stamp() + seconds * 1000, left: seconds, rang: false }])
    setSaid(`${label} timer started.`)
  }
  const pause = (id: string) => setTimers(ts => ts.map(t => (t.id === id && t.endsAt !== null ? { ...t, left: leftOf(t, stamp()), endsAt: null } : t)))
  const resume = (id: string) => { primeAudio(); setNow(stamp()); setTimers(ts => ts.map(t => (t.id === id && t.endsAt === null ? { ...t, endsAt: stamp() + t.left * 1000 } : t))) }
  const clear = (id: string) => setTimers(ts => ts.filter(t => t.id !== id))

  const text = recipe.steps[step]
  const used = stepIngredients(text, recipe.ingredients)
  const stepTimes = stepTimers(text)
  const otherTimers = timers.filter(t => t.step !== step)

  return (
    <div className="fixed inset-0 z-40 flex flex-col overflow-y-auto overscroll-contain bg-(--screen) text-(--ink)" role="dialog" aria-modal="true" aria-label={`Cooking ${recipe.name}`}>
      <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col px-4 pt-[calc(env(safe-area-inset-top)+12px)] pb-[calc(env(safe-area-inset-bottom)+16px)]">
        <header className="flex items-center gap-3">
          <button type="button" onClick={() => goBack({ name: 'recipe', id: recipe.id })} aria-label="Close cook mode" className="press inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-(--bright)">
            <X aria-hidden="true" className="size-6" strokeWidth={2.5} />
          </button>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-caption font-extrabold tracking-[0.06em] text-(--ink-soft) uppercase">Cooking</span>
            <span className="font-display text-[1.25rem] leading-tight break-words">{recipe.name}</span>
          </div>
          {main && <FruitSticker fruit={main} size={52} />}
        </header>

        {/* Progress dots: one per step, each a button */}
        <ol className="flex flex-wrap items-center justify-center gap-1 pt-4" aria-label="Steps">
          {recipe.steps.map((_, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => go(i)}
                aria-label={`Step ${i + 1}${i === step ? ', current' : ''}`}
                aria-current={i === step ? 'step' : undefined}
                className="inline-flex size-11 items-center justify-center"
              >
                <span className={clsx('block rounded-full transition-all duration-300', i === step ? 'h-3.5 w-8 bg-(--ink)' : i < step ? 'size-3.5 bg-(--ink-soft)' : 'size-3.5 ring-2 ring-(--ink-soft) ring-inset')} />
              </button>
            </li>
          ))}
        </ol>

        {otherTimers.length > 0 && (
          <ul className="flex flex-col gap-2 pt-2" aria-label="Other timers">
            {otherTimers.map(t => <TimerRow key={t.id} t={t} now={now} onPause={pause} onResume={resume} onClear={clear} note={`Step ${t.step + 1}`} />)}
          </ul>
        )}

        <div
          className="flex flex-1 touch-pan-y flex-col pt-3"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => { drag.current = null }}
        >
          <article key={step} className={clsx('flex flex-col gap-4 rounded-block bg-(--bright) p-5 block-shadow', !reducedMotion() && (dir === 'next' ? 'step-in-next' : 'step-in-back'))}>
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="inline-flex size-14 shrink-0 -rotate-6 items-center justify-center rounded-full bg-(--deep) font-display text-[1.75rem] text-(--light)">{step + 1}</span>
              <h2 className="font-display text-title">Step {step + 1} <span className="text-(--ink-soft)">of {recipe.steps.length}</span></h2>
            </div>

            {used.length > 0 && (
              <ul className="flex flex-wrap gap-2" aria-label="You need">
                {used.map(i => {
                  const ing = recipe.ingredients[i]
                  const fruit = ing.fruitId ? FRUITS.find(f => f.id === ing.fruitId) : undefined
                  return (
                    <li key={i} className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-(--pop) py-1 pr-3.5 pl-2 text-small font-bold">
                      {fruit ? <FruitSticker fruit={fruit} size={28} tilt={false} /> : <span aria-hidden="true" className="size-2 rounded-full bg-(--ink)" />}
                      <span><span className="font-extrabold tabular-nums">{scaleQty(ing.qty, factor)}</span> {ing.item.split(',')[0]}</span>
                    </li>
                  )
                })}
              </ul>
            )}

            <p className="text-[clamp(1.375rem,6.2vw,1.875rem)] leading-[1.35] font-semibold">{text}</p>

            {stepTimes.length > 0 && (
              <ul className="flex flex-col gap-2 pt-1">
                {stepTimes.map(st => {
                  const t = timers.find(x => x.id === `${step}:${st.label}`)
                  return t
                    ? <TimerRow key={st.label} t={t} now={now} onPause={pause} onResume={resume} onClear={clear} />
                    : (
                      <li key={st.label}>
                        <button
                          type="button"
                          onClick={() => startTimer(st.label, st.seconds)}
                          className="press inline-flex min-h-14 w-full items-center justify-center gap-2.5 rounded-full bg-(--ink) px-5 text-[18px] font-extrabold text-(--light)"
                        >
                          <Timer aria-hidden="true" className="size-6" strokeWidth={2.5} />
                          Start {clock(st.seconds)} timer
                          {/ to /.test(st.label) && <span className="text-[14px] font-bold">(check then)</span>}
                        </button>
                      </li>
                    )
                })}
              </ul>
            )}
          </article>
        </div>

        <nav className="flex gap-3 pt-4" aria-label="Step">
          <button
            type="button"
            onClick={() => go(step - 1)}
            disabled={step === 0}
            className="press block-shadow inline-flex h-16 flex-1 items-center justify-center gap-1 rounded-full bg-(--bright) text-[18px] font-extrabold disabled:opacity-40"
          >
            <ChevronLeft aria-hidden="true" className="size-6" strokeWidth={2.75} />
            Back
          </button>
          {step < last ? (
            <button type="button" onClick={() => go(step + 1)} className="press block-shadow inline-flex h-16 flex-[1.4] items-center justify-center gap-1 rounded-full bg-(--ink) text-[18px] font-extrabold text-(--light)">
              Next
              <ChevronRight aria-hidden="true" className="size-6" strokeWidth={2.75} />
            </button>
          ) : (
            <button type="button" onClick={() => { setStep(0); goBack({ name: 'recipe', id: recipe.id }) }} className="press block-shadow inline-flex h-16 flex-[1.4] items-center justify-center gap-2 rounded-full bg-peak text-[18px] font-extrabold text-peak-ink">
              <Check aria-hidden="true" className="size-6" strokeWidth={3} />
              Done
            </button>
          )}
        </nav>
        <p className="flex items-center justify-center gap-1.5 pt-3 text-caption font-bold text-(--ink-soft)">
          <Sun aria-hidden="true" className="size-3.5" strokeWidth={2.5} />
          {canWakeLock ? 'Your screen stays on while you cook.' : 'Swipe or tap Next to move on.'}
        </p>
        <p aria-live="assertive" className="sr-only">{said}</p>
      </div>
    </div>
  )
}

function TimerRow({ t, now, onPause, onResume, onClear, note }: { t: RunningTimer; now: number; onPause: (id: string) => void; onResume: (id: string) => void; onClear: (id: string) => void; note?: string }) {
  const left = leftOf(t, now)
  const done = t.rang || left <= 0
  const paused = t.endsAt === null && !done
  return (
    <li className={clsx('flex items-center gap-2 rounded-full p-1.5 pl-4', done ? 'timer-ring bg-peak text-peak-ink' : 'bg-(--ink) text-(--light)')}>
      {done ? <BellRing aria-hidden="true" className="size-6 shrink-0" strokeWidth={2.5} /> : <Timer aria-hidden="true" className="size-6 shrink-0" strokeWidth={2.5} />}
      <span className="flex min-w-0 flex-1 flex-col leading-tight">
        <span className="font-display text-[1.625rem] tabular-nums" role="timer" aria-label={`${t.label} timer`}>{done ? 'Done!' : clock(left)}</span>
        <span className="text-caption font-bold">{note ? `${note}: ` : ''}{t.label}{paused ? ', paused' : ''}</span>
      </span>
      {!done && (
        <button type="button" onClick={() => (paused ? onResume(t.id) : onPause(t.id))} aria-label={paused ? 'Resume timer' : 'Pause timer'} className="press inline-flex size-11 items-center justify-center rounded-full bg-(--pop) text-(--ink)">
          {paused ? <Play aria-hidden="true" className="size-5" strokeWidth={2.75} /> : <Pause aria-hidden="true" className="size-5" strokeWidth={2.75} />}
        </button>
      )}
      <button type="button" onClick={() => onClear(t.id)} aria-label={done ? 'Dismiss timer' : 'Cancel timer'} className={clsx('press inline-flex size-11 items-center justify-center rounded-full', done ? 'bg-peak-ink text-peak' : 'bg-(--bright) text-(--ink)')}>
        {done ? <Check aria-hidden="true" className="size-5" strokeWidth={3} /> : <RotateCcw aria-hidden="true" className="size-5" strokeWidth={2.75} />}
      </button>
    </li>
  )
}
