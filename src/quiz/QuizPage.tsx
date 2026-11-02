// "Guess the fruit" (#/play/quiz): its own lazy chunk. The menu picks a mode (Quick play, Pass the
// phone, Daily fruit challenge), then the game runs full screen (./QuizGame.tsx). The 3D stage's chunk
// is asked for while the menu is up, so the first picture round is ready when the game starts.
import { useCallback, useEffect, useMemo, useState, type CSSProperties, type FormEvent } from 'react'
import clsx from 'clsx'
import { ArrowRight, CalendarDays, Check, ChevronRight, Flame, Smartphone, Zap } from 'lucide-react'
import type { Fruit, Month } from '../types/fruit'
import { MONTHS } from '../types/fruit'
import { FRUITS } from '../assets/fruits'
import { useStoredState } from '../hooks/useStoredState'
import { seasonOf } from '../utils/seasonality'
import { seasonTones, toneVars, tonesOf } from '../utils/tones'
import { FruitSticker } from '../components/FruitSticker'
import { TopBar } from '../components/TopBar'
import { setSound } from '../cafe/sound'
import { QuizGame, type GameSetup } from './QuizGame'
import { SoundToggle } from './components/Hud'
import { webgl } from '../hooks/useLazy3D'
import type { GameState } from './logic/game'
import { QUESTIONS } from './logic/game'
import { isProgress, NEW_PROGRESS, PROGRESS_KEY, type QuizProgress } from './logic/progress'
import { bumpDayStreak, dateKey, liveDayStreak, starsFor } from './logic/scoring'
import './quiz.css'

const pick = (...ids: string[]) => ids.map(id => FRUITS.find(f => f.id === id)).filter((f): f is Fruit => !!f)
const NAME_MAX = 14

export default function QuizPage({ month }: { month: Month }) {
  const [progress, setProgress] = useStoredState<QuizProgress>(PROGRESS_KEY, NEW_PROGRESS, isProgress)
  const [view, setView] = useState<'menu' | 'names' | 'game'>('menu')
  const [setup, setSetup] = useState<GameSetup | null>(null)
  const [round, setRound] = useState(0) // a new key per game, so Play again starts fresh
  const [today] = useState(() => dateKey())
  const ink = useMemo(() => seasonTones(seasonOf(month)).ink, [month])

  useEffect(() => { setSound(progress.sound) }, [progress.sound])
  useEffect(() => {
    const t = setTimeout(() => { if (webgl) import('../three/QuizStage').catch(() => undefined) }, 300) // fails quietly: the game falls back to stickers
    return () => clearTimeout(t)
  }, [])

  const playedToday = progress.daily?.date === today

  const start = (s: GameSetup) => {
    if (s.mode === 'daily') {
      // One go a day: the day counts (and the streak grows) as soon as the daily starts.
      setProgress(p => ({
        ...p,
        daily: { date: today, score: 0, correct: 0, total: QUESTIONS.daily, stars: 1, bestStreak: 0 },
        dayStreak: bumpDayStreak(p.dayStreak, today),
      }))
    }
    setSetup(s)
    setRound(r => r + 1)
    setView('game')
    window.scrollTo(0, 0)
  }

  const finish = useCallback((g: GameState) => {
    const p = g.players[0]
    if (g.mode === 'quick') setProgress(prev => ({ ...prev, best: { ...prev.best, quick: Math.max(prev.best.quick, p.score) } }))
    if (g.mode === 'daily') {
      setProgress(prev => ({
        ...prev,
        best: { ...prev.best, daily: Math.max(prev.best.daily, p.score) },
        daily: { date: g.date ?? today, score: p.score, correct: p.correct, total: g.total, stars: starsFor(p.correct, g.total), bestStreak: p.bestStreak },
      }))
    }
  }, [setProgress, today])

  const toggleSound = () => setProgress(p => ({ ...p, sound: !p.sound }))

  if (view === 'game' && setup) {
    return (
      <QuizGame
        key={round}
        setup={setup}
        fruits={FRUITS}
        prevBest={setup.mode === 'pass' ? 0 : progress.best[setup.mode]}
        dayStreak={liveDayStreak(progress.dayStreak, today)}
        ink={ink}
        sound={progress.sound}
        onSound={toggleSound}
        onFinish={finish}
        onAgain={setup.mode === 'daily' ? undefined : () => start(setup)}
        onExit={() => setView('menu')}
      />
    )
  }

  if (view === 'names') {
    return (
      <Names
        names={progress.names}
        onBack={() => setView('menu')}
        onStart={names => {
          setProgress(p => ({ ...p, names }))
          start({ mode: 'pass', names, month })
        }}
      />
    )
  }

  const streak = liveDayStreak(progress.dayStreak, today)
  return (
    <div className="flex flex-col pb-6">
      <TopBar back={{ name: 'play' }} bag={false} right={<SoundToggle on={progress.sound} onToggle={() => { setSound(!progress.sound); toggleSound() }} />} />
      <h1 className="rise px-5 pb-1 font-display text-[clamp(2.5rem,13vw,3.5rem)] leading-none">Guess the fruit</h1>
      <p className="px-5 pb-5 text-body font-semibold">Cut-open fruit, spinning shadows, close-ups, seasons and pairs. Fast answers score more; three wrong and you're out.</p>
      <ul className="flex flex-col gap-4 px-4">
        <ModeCard
          i={0}
          colour="#FF9F1C"
          Icon={Zap}
          title="Quick play"
          text={`${QUESTIONS.quick} questions, 3 lives. Gets harder as your streak grows.`}
          badge={progress.best.quick > 0 ? `Best ${progress.best.quick.toLocaleString('en-AU')}` : undefined}
          fruits={pick('watermelon', 'kiwifruit', 'orange')}
          onClick={() => start({ mode: 'quick', month })}
        />
        <ModeCard
          i={1}
          colour="#E8378E"
          Icon={Smartphone}
          title="Pass the phone"
          text={`Two players, one phone, ${QUESTIONS.pass / 2} questions each. Same kind of question, turn about.`}
          fruits={pick('dragon-fruit', 'passionfruit', 'lychee')}
          onClick={() => setView('names')}
        />
        <ModeCard
          i={2}
          colour="#8DB33A"
          Icon={CalendarDays}
          title="Daily fruit challenge"
          text={playedToday
            ? `Done today: ${progress.daily!.score.toLocaleString('en-AU')} points and ${progress.daily!.stars} star${progress.daily!.stars === 1 ? '' : 's'}. A new one lands at midnight.`
            : `The same ${QUESTIONS.daily} questions on every phone today. One go each.`}
          badge={streak > 0 ? `${streak} day${streak === 1 ? '' : 's'}` : undefined}
          badgeIcon
          fruits={pick('pineapple', 'avocado', 'pomegranate')}
          disabled={playedToday}
          onClick={() => start({ mode: 'daily', month: MONTHS[new Date(`${today}T12:00`).getMonth()], date: today })}
        />
      </ul>
    </div>
  )
}

function ModeCard({ i, colour, Icon, title, text, badge, badgeIcon, fruits, disabled, onClick }: {
  i: number; colour: string; Icon: typeof Zap; title: string; text: string; badge?: string; badgeIcon?: boolean; fruits: Fruit[]; disabled?: boolean; onClick: () => void
}) {
  return (
    <li className="pop-in" style={{ '--i': i } as CSSProperties}>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={clsx('block-shadow relative flex w-full flex-col gap-3 rounded-block bg-(--pop) p-5 text-left text-(--ink)', !disabled && 'press')}
        style={toneVars(tonesOf(colour))}
      >
        <span className="flex items-start justify-between gap-3">
          <span className="flex items-end -space-x-2" aria-hidden="true">
            {fruits.map((f, k) => <FruitSticker key={f.id} fruit={f} size={k === 1 ? 74 : 60} slap delay={160 + k * 90 + i * 120} />)}
          </span>
          {badge && (
            <span className="inline-flex items-center gap-1 rounded-full bg-(--ink) px-3 py-1.5 text-small font-extrabold text-(--light) tabular-nums">
              {badgeIcon && <Flame aria-hidden="true" className="size-4" strokeWidth={2.5} fill="currentColor" />}
              {badge}
            </span>
          )}
        </span>
        <span className="flex items-end justify-between gap-3">
          <span className="flex flex-col gap-1">
            <span className="flex items-center gap-2 font-display text-title">
              <Icon aria-hidden="true" className="size-6 shrink-0" strokeWidth={2.5} />
              {title}
            </span>
            <span className="text-small font-semibold text-(--ink-soft)">{text}</span>
          </span>
          <span className={clsx('inline-flex size-11 shrink-0 items-center justify-center rounded-full', disabled ? 'bg-peak text-peak-ink' : 'bg-(--ink) text-(--light)')}>
            {disabled
              ? <Check aria-label="Done today" className="size-6" strokeWidth={3} />
              : <ChevronRight aria-hidden="true" className="size-6" strokeWidth={2.75} />}
          </span>
        </span>
      </button>
    </li>
  )
}

function Names({ names, onBack, onStart }: { names: [string, string]; onBack: () => void; onStart: (n: [string, string]) => void }) {
  const [a, setA] = useState(names[0])
  const [b, setB] = useState(names[1])
  const submit = (e: FormEvent) => {
    e.preventDefault()
    onStart([a.trim() || 'Player 1', b.trim() || 'Player 2'])
  }
  const field = 'h-14 w-full rounded-full bg-(--bright) px-5 text-body font-bold text-(--ink) placeholder:text-(--ink-soft) placeholder:font-semibold outline-none focus-visible:ring-4 focus-visible:ring-(--light)'
  return (
    <div className="flex flex-col pb-6">
      <header className="flex items-center gap-2 px-4 pt-[calc(env(safe-area-inset-top)+12px)] pb-2">
        <button type="button" onClick={onBack} className="press inline-flex h-11 items-center rounded-full bg-(--bright) px-4 text-small font-bold text-(--ink)">Back</button>
      </header>
      <h1 className="rise px-5 pb-2 font-display text-[clamp(2.5rem,13vw,3.5rem)] leading-none">Pass the phone</h1>
      <p className="px-5 pb-5 text-body font-semibold">Take turns. Each of you gets the same kind of question each round, and the clock only starts when you tap I'm ready.</p>
      <form onSubmit={submit} className="flex flex-col gap-4 px-4">
        {([[a, setA, 'Player 1', '#FF9F1C'], [b, setB, 'Player 2', '#E8378E']] as const).map(([value, set, label, colour], i) => (
          <label key={label} className="pop-in flex flex-col gap-2 rounded-block bg-(--pop) p-4 text-(--ink)" style={{ ...toneVars(tonesOf(colour)), '--i': i } as CSSProperties}>
            <span className="font-display text-name">{label}</span>
            <input value={value} onChange={e => set(e.target.value.slice(0, NAME_MAX))} placeholder="Name" autoComplete="off" enterKeyHint="next" className={field} maxLength={NAME_MAX} />
          </label>
        ))}
        <button type="submit" className="press block-shadow pop-in inline-flex h-16 items-center justify-center gap-2 rounded-full bg-(--bright) text-[1.2rem] font-extrabold text-(--ink)" style={{ '--i': 2 } as CSSProperties}>
          Let's play
          <ArrowRight aria-hidden="true" className="size-6" strokeWidth={2.75} />
        </button>
      </form>
    </div>
  )
}
