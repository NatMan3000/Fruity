// A game of "Guess the fruit" in progress: the clock, the question card, the 3D picture, the answers,
// the juicy feedback and the end screen. The rules live in ./logic (pure, tested); this file is the
// stage manager. The whole game covers the tab bar (.quiz-surface), like the cafe.
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import clsx from 'clsx'
import { ArrowRight, CalendarDays, Citrus, Heart, Moon, Shuffle, ZoomIn } from 'lucide-react'
import type { Fruit, Month } from '../types/fruit'
import { toneVars, tonesOf } from '../utils/tones'
import { FruitSticker } from '../components/FruitSticker'
import { sfx } from '../audio/sound'
import { activePlayer, advance, answer, current, dailyRng, startGame, turnOf, type GameState, type Mode } from './logic/game'
import type { Kind } from './logic/questions'
import { mulberry32, randomSeed } from './logic/rng'
import { QUESTION_MS } from './logic/scoring'
import { funFact } from './logic/traits'
import { Choices } from './components/Choices'
import { JuiceBurst, Milestone, PointsFloat } from './components/Burst'
import { Hearts, PassScores, PLAYER_COLOURS, QuitButton, Score, SoundToggle, StreakMeter } from './components/Hud'
import { Picture } from './components/Picture'
import { PassEnd, SoloEnd } from './components/EndScreen'

export interface GameSetup {
  mode: Mode
  names?: [string, string]
  date?: string // the daily's date
  month: Month
}

interface QuizGameProps {
  setup: GameSetup
  fruits: Fruit[]
  prevBest: number
  dayStreak?: number
  ink: string // the season's ink, as a colour value (3D shadows and silhouettes)
  sound: boolean
  onSound: () => void
  onFinish: (g: GameState) => void // the game ended or was quit part way (saves the result)
  onAgain?: () => void
  onExit: () => void
}

const KIND_LABEL: Record<Kind, { label: string; Icon: typeof Citrus }> = {
  inside: { label: 'Inside out', Icon: Citrus },
  silhouette: { label: 'Silhouette spin', Icon: Moon },
  closeup: { label: 'Close-up', Icon: ZoomIn },
  peakMonth: { label: 'Season sense', Icon: CalendarDays },
  season: { label: 'Season sense', Icon: CalendarDays },
  pairs: { label: 'Pairs', Icon: Heart },
  oddOne: { label: 'Odd one out', Icon: Shuffle },
}

const RIGHT_WORDS = ['Juicy!', 'Sweet!', 'Ripe!', 'Nailed it!', 'Fresh!']
const WRONG_WORDS = ['Squished!', 'Splat!', 'Not quite!', 'Bruised!']
const AUTO_NEXT_MS = 1700

interface Fx { key: number; x: number; y: number; colour: string; points: number; multiplier: number; milestone?: number }

export function QuizGame({ setup, fruits, prevBest, dayStreak, ink, sound, onSound, onFinish, onAgain, onExit }: QuizGameProps) {
  const fruitsById = useMemo(() => new Map(fruits.map(f => [f.id, f])), [fruits])
  const [rng] = useState(() => (setup.mode === 'daily' && setup.date ? dailyRng(setup.date) : mulberry32(randomSeed())))
  const [game, setGame] = useState<GameState>(() =>
    startGame({ mode: setup.mode, fruits, month: setup.month, rng, names: setup.names, date: setup.date }))
  const [bestBefore] = useState(prevBest) // the best before this game, for the New record! moment
  const [fx, setFx] = useState<Fx | null>(null)
  const [said, setSaid] = useState('')
  const [quitting, setQuitting] = useState(false)
  const bar = useRef<HTMLSpanElement>(null)
  const clock = useRef<Animation | null>(null)
  const latest = useRef(game)
  useEffect(() => { latest.current = game })

  const q = current(game)
  const player = activePlayer(game)
  const turn = turnOf(game)
  const solo = game.mode !== 'pass'
  const subject = fruitsById.get(q.subject)!
  const hero = q.hero ? fruitsById.get(q.hero) ?? null : null
  const answered = game.phase === 'answered'
  const outcome = !answered || !game.last ? 'asking' : game.last.correct ? 'right' : 'wrong'

  // How much of the question's time has gone, read straight off the clock bar's animation.
  const progress = useCallback(() => {
    const a = clock.current
    return a ? Math.min(1, Number(a.currentTime ?? 0) / QUESTION_MS) : 0
  }, [])

  const respond = useCallback((choice: string | null, at?: { x: number; y: number }) => {
    const s = latest.current
    if (s.phase !== 'asking') return
    const a = clock.current
    const elapsed = a ? Number(a.currentTime ?? 0) : QUESTION_MS
    a?.pause()
    const next = answer(s, choice, elapsed)
    latest.current = next
    setGame(next)
    const last = next.last!
    const qq = current(s)
    const f = fruitsById.get(qq.subject)!
    if (last.correct) {
      sfx.chop()
      const where = at ?? { x: window.innerWidth / 2, y: window.innerHeight * 0.35 }
      setFx({ key: Date.now(), ...where, colour: f.colour, points: last.points, multiplier: last.multiplier, milestone: last.milestone })
      if (last.milestone) setTimeout(() => sfx.yay(), 220)
      setSaid(`Right! ${last.points} points.${last.milestone ? ` ${last.milestone} in a row!` : ''}`)
    } else {
      sfx.nope()
      setSaid(`${choice === null ? 'Out of time.' : 'Not quite.'} ${qq.reveal}`)
    }
  }, [fruitsById])

  const goNext = useCallback(() => {
    const s = latest.current
    if (s.phase !== 'answered' && s.phase !== 'handoff') return
    const next = advance(s, fruits, setup.month, rng)
    latest.current = next
    setGame(next)
    setFx(null)
    if (next.phase === 'done') onFinish(next)
  }, [fruits, setup.month, rng, onFinish])

  // The clock: the bar drains over the question's time (Web Animations, so it is also the timer). It
  // pauses when the app is in the background; running out counts as a wrong answer.
  useEffect(() => {
    if (game.phase !== 'asking' || !bar.current) return
    const a = bar.current.animate([{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }], { duration: QUESTION_MS, fill: 'forwards' })
    clock.current = a
    a.onfinish = () => respond(null)
    const onVisible = () => (document.hidden ? a.pause() : a.play())
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      a.onfinish = null
      a.pause()
    }
  }, [game.index, game.phase, respond])

  // A right answer moves on by itself; a wrong one waits so the answer and its fact can be read.
  useEffect(() => {
    if (!answered || !game.last?.correct) return
    const t = setTimeout(goNext, AUTO_NEXT_MS)
    return () => clearTimeout(t)
  }, [answered, game.last, goNext])

  // Effects clear themselves once played.
  useEffect(() => {
    if (!fx) return
    const t = setTimeout(() => setFx(null), fx.milestone ? 1600 : 1150)
    return () => clearTimeout(t)
  }, [fx])

  // Quit asks once: the X turns into "Quit?" for a few seconds.
  useEffect(() => {
    if (!quitting) return
    const t = setTimeout(() => setQuitting(false), 3000)
    return () => clearTimeout(t)
  }, [quitting])
  const quit = () => {
    if (!quitting && game.phase !== 'done') return setQuitting(true)
    onFinish(latest.current)
    onExit()
  }

  const toggleSound = onSound // the tap itself lets iOS start audio

  if (game.phase === 'done') {
    return (
      <div className="quiz-surface">
        <div className="mx-auto w-full max-w-xl">
          {solo
            ? <SoloEnd game={game} fruitsById={fruitsById} prevBest={bestBefore} dayStreak={dayStreak} onAgain={onAgain} onDone={onExit} />
            : <PassEnd game={game} onAgain={onAgain ?? onExit} onDone={onExit} />}
        </div>
      </div>
    )
  }

  const { label, Icon } = KIND_LABEL[q.kind]
  const last = game.last
  const isLast = game.index + 1 >= game.total || (solo && player.lives !== null && player.lives <= 0)
  const nextName = game.mode === 'pass' ? game.players[(turn + 1) % 2].name : ''
  const word = last ? (last.choice === null && !last.correct ? 'Too slow!' : (last.correct ? RIGHT_WORDS : WRONG_WORDS)[game.index % (last.correct ? RIGHT_WORDS : WRONG_WORDS).length]) : ''
  const roundNo = game.mode === 'pass' ? Math.floor(game.index / 2) + 1 : game.index + 1
  const roundOf = game.mode === 'pass' ? game.total / 2 : game.total

  return (
    <div className="quiz-surface">
      <div className={clsx('mx-auto flex w-full max-w-xl flex-col gap-3 px-4 pt-[calc(env(safe-area-inset-top)+10px)]', answered ? 'pb-[calc(env(safe-area-inset-bottom)+240px)]' : 'pb-[calc(env(safe-area-inset-bottom)+20px)]')}>
        <header className="flex items-center gap-2.5">
          {quitting ? (
            <button type="button" onClick={quit} className="press inline-flex h-11 shrink-0 items-center rounded-full bg-off px-4 text-small font-extrabold text-off-ink">Quit?</button>
          ) : (
            <QuitButton onQuit={quit} />
          )}
          {solo ? (
            <>
              <Hearts lives={player.lives ?? 0} strawberry={fruitsById.get('strawberry')!} />
              <span className="flex-1" />
              <Score score={player.score} />
            </>
          ) : (
            <PassScores players={game.players} turn={turn} />
          )}
          <SoundToggle on={sound} onToggle={toggleSound} />
        </header>

        {solo ? <StreakMeter streak={player.streak} /> : null}

        <section
          className={clsx('block-shadow flex flex-col gap-3 rounded-block bg-(--bright) p-4 text-(--ink)', outcome === 'wrong' && 'quiz-squish')}
          aria-labelledby="quiz-prompt"
        >
          <div key={`h${game.index}`} className="quiz-deal flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-(--ink) py-1 pr-3 pl-2 text-caption font-extrabold tracking-[0.06em] text-(--light) uppercase">
                <Icon aria-hidden="true" className="size-4" strokeWidth={2.5} />
                {label}
              </span>
              <span className="text-small font-extrabold tabular-nums text-(--ink-soft)">
                {game.mode === 'pass' ? `${player.name}, round ${roundNo} of ${roundOf}` : `${roundNo} of ${roundOf}`}
              </span>
            </div>
            <h2 id="quiz-prompt" className="font-display text-name">{q.prompt}</h2>
          </div>
          <span className="relative block h-3 overflow-hidden rounded-full bg-(--ink)" role="presentation">
            <span key={`t${game.index}-${game.phase === 'handoff'}`} ref={bar} className={clsx('absolute inset-0 origin-left rounded-full', answered ? 'bg-(--ink-soft)' : 'bg-(--pop)')} />
          </span>
          <Picture
            fruit={game.phase === 'handoff' ? null : hero}
            look={q.look ?? 'hero'}
            outcome={outcome}
            progress={progress}
            shade={ink}
            qKey={game.index}
          />
          <div key={`c${game.index}`}>
            <Choices
              q={q}
              fruitsById={fruitsById}
              picked={answered ? (last?.choice ?? null) : undefined}
              big={!hero && q.kind !== 'peakMonth'}
              onPick={respond}
            />
          </div>
        </section>
      </div>

      {answered && last && (
        <ResultBar
          right={last.correct}
          word={word}
          points={last.points}
          multiplier={last.multiplier}
          reveal={q.reveal}
          fruit={subject}
          auto={last.correct}
          nextLabel={isLast ? (solo ? 'See your score' : 'See who won') : game.mode === 'pass' ? `Pass to ${nextName}` : 'Next'}
          onNext={goNext}
        />
      )}

      {game.phase === 'handoff' && (
        <Handoff
          name={player.name}
          colour={PLAYER_COLOURS[turn]}
          round={roundNo}
          rounds={roundOf}
          first={game.index === 0}
          kind={label}
          onGo={goNext}
        />
      )}

      {fx && (
        <div key={fx.key}>
          <JuiceBurst x={fx.x} y={fx.y} colour={fx.colour} />
          <PointsFloat x={fx.x} y={fx.y} points={fx.points} multiplier={fx.multiplier} />
          {fx.milestone && <Milestone streak={fx.milestone} />}
        </div>
      )}
      <p aria-live="polite" className="sr-only">{said}</p>
    </div>
  )
}

function ResultBar({ right, word, points, multiplier, reveal, fruit, auto, nextLabel, onNext }: {
  right: boolean; word: string; points: number; multiplier: number; reveal: string; fruit: Fruit; auto: boolean; nextLabel: string; onNext: () => void
}) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(env(safe-area-inset-bottom)+12px)]">
      <div
        role="status"
        className={clsx('quiz-result pointer-events-auto mx-auto flex max-w-xl flex-col gap-3 rounded-block p-4 shadow-[0_0_0_4px_var(--color-sticker),0_8px_0_4px_rgb(30_8_20/0.35)]', right ? 'bg-peak text-peak-ink' : 'bg-off text-off-ink')}
      >
        <div className="flex items-center gap-3">
          <FruitSticker fruit={fruit} size={64} slap eager />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="flex flex-wrap items-baseline gap-x-2">
              <span className="font-display text-title">{word}</span>
              {right && <span className="font-display text-name tabular-nums">+{points}{multiplier > 1 ? ` (x${multiplier})` : ''}</span>}
            </span>
            <span className="text-small font-bold">{reveal}</span>
          </div>
        </div>
        {!right && <p className="rounded-[18px] bg-(--light)/70 px-3 py-2 text-small font-semibold text-off-ink"><span className="font-extrabold">Fun fact: </span>{funFact(fruit)}</p>}
        <button type="button" onClick={onNext} className="press relative inline-flex h-13 items-center justify-center gap-2 overflow-hidden rounded-full bg-(--ink) text-body font-extrabold text-(--light)">
          {auto && <span aria-hidden="true" className="quiz-autonext absolute inset-0 bg-(--deep)" style={{ '--wait': `${AUTO_NEXT_MS}ms` } as CSSProperties} />}
          <span className="relative">{nextLabel}</span>
          <ArrowRight aria-hidden="true" className="relative size-5" strokeWidth={2.75} />
        </button>
      </div>
    </div>
  )
}

function Handoff({ name, colour, round, rounds, first, kind, onGo }: { name: string; colour: string; round: number; rounds: number; first: boolean; kind: string; onGo: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-center gap-5 bg-(--pop) px-6 text-(--ink)" style={toneVars(tonesOf(colour))} role="dialog" aria-modal="true" aria-labelledby="quiz-handoff">
      <p className="pop-in text-small font-extrabold tracking-[0.14em] uppercase">Round {round} of {rounds} · {kind}</p>
      <h2 id="quiz-handoff" className="slap font-display text-[clamp(3rem,16vw,4.5rem)] leading-[0.95] break-words" style={{ '--tilt': '-3deg', transform: 'rotate(-3deg)' } as CSSProperties}>
        {name}'s turn
      </h2>
      <p className="pop-in text-body font-semibold" style={{ '--i': 2 } as CSSProperties}>
        {first ? `${name} goes first. The clock starts when you tap.` : `Pass the phone to ${name}. No peeking at the answers!`}
      </p>
      <button type="button" onClick={onGo} className="press block-shadow pop-in inline-flex h-16 items-center justify-center gap-2 rounded-full bg-(--ink) text-[1.2rem] font-extrabold text-(--light)" style={{ '--i': 3 } as CSSProperties}>
        I'm ready
        <ArrowRight aria-hidden="true" className="size-6" strokeWidth={2.75} />
      </button>
    </div>
  )
}
