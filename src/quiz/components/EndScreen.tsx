// The end of a game. Solo (quick play, daily): the score counting up, 1 to 3 stars slapping in, a "New
// record!" sticker when you beat your best, best streak and right answers, the fruit you missed as
// stickers that open their page, and Play again / Share / Done. Pass the phone: the winner, both scores.
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import clsx from 'clsx'
import { Crown, Flame, RotateCcw, Share2, Star, Trophy } from 'lucide-react'
import type { Fruit } from '../../types/fruit'
import { navigate } from '../../hooks/useRoute'
import { toneVars, tonesOf } from '../../utils/tones'
import { FruitSticker } from '../../components/FruitSticker'
import { sfx } from '../../audio/sound'
import { starsFor } from '../logic/scoring'
import { winner, type GameState } from '../logic/game'
import { PLAYER_COLOURS } from './Hud'

const still = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// The score counts up once (a second), then stays.
function useCountUp(to: number): number {
  const [n, setN] = useState(() => (still() ? to : 0))
  useEffect(() => {
    if (still() || to === 0) return
    let raf = 0
    const start = performance.now()
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / 1000)
      setN(Math.round(to * (1 - Math.pow(1 - k, 3))))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to])
  return n
}

const primary = 'press block-shadow inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-(--ink) px-5 text-body font-extrabold text-(--light)'
const secondary = 'press inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-(--pop) px-5 text-body font-extrabold text-(--ink)'

interface SoloProps {
  game: GameState
  fruitsById: Map<string, Fruit>
  prevBest: number
  dayStreak?: number
  onAgain?: () => void
  onDone: () => void
}

export function SoloEnd({ game, fruitsById, prevBest, dayStreak, onAgain, onDone }: SoloProps) {
  const p = game.players[0]
  const stars = starsFor(p.correct, game.total)
  const record = p.score > prevBest && p.score > 0
  const shown = useCountUp(p.score)
  const [shared, setShared] = useState('')
  const outOfLives = p.lives !== null && p.lives <= 0
  const daily = game.mode === 'daily'

  useEffect(() => {
    const ids = [0, 1, 2].map(i => setTimeout(() => (i < stars ? sfx.star(i) : null), 1000 + i * 260))
    if (record) ids.push(setTimeout(() => sfx.bell(), 1900))
    return () => ids.forEach(clearTimeout)
  }, [stars, record])

  const share = async () => {
    const text = `Fruity ${daily ? `daily ${game.date}` : 'quiz'}: ${p.score.toLocaleString('en-AU')} points ${'⭐'.repeat(stars)} (${p.correct}/${game.total} right, best streak ${p.bestStreak})`
    try {
      if (navigator.share) await navigator.share({ text })
      else {
        await navigator.clipboard.writeText(text)
        setShared('Copied, paste it anywhere.')
      }
    } catch {
      // Share sheet dismissed: nothing to do.
    }
  }

  const missed = p.missed.map(id => fruitsById.get(id)).filter((f): f is Fruit => !!f)

  return (
    <div className="flex flex-col gap-5 px-4 pt-[calc(env(safe-area-inset-top)+20px)] pb-[calc(env(safe-area-inset-bottom)+24px)]">
      <div className="pop-in relative flex flex-col items-center gap-2 overflow-hidden rounded-block bg-(--bright) px-5 pt-6 pb-6 text-center text-(--ink) block-shadow">
        <h1 className="font-display text-[2.5rem] leading-none">
          {daily ? 'Daily done!' : outOfLives ? 'Out of hearts!' : 'All done!'}
        </h1>
        {daily && <p className="text-small font-bold text-(--ink-soft)">{game.date && new Date(`${game.date}T12:00`).toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })}</p>}
        <p className="font-display text-[4.5rem] leading-none tabular-nums" aria-label={`${p.score} points`}>{shown.toLocaleString('en-AU')}</p>
        <p className="-mt-1 text-small font-extrabold tracking-[0.14em] uppercase">points</p>
        <div className="mt-2 flex items-end gap-2" role="img" aria-label={`${stars} of 3 stars`}>
          {[0, 1, 2].map(i => (
            <span key={i} className="quiz-star inline-flex" style={{ '--delay': `${1000 + i * 260}ms`, '--tilt': `${(i - 1) * 12}deg`, transform: `rotate(${(i - 1) * 12}deg) translateY(${i === 1 ? -10 : 0}px)` } as CSSProperties}>
              <Star
                aria-hidden="true"
                className={clsx(i === 1 ? 'size-16' : 'size-13', i < stars ? 'text-ending' : 'text-(--ink) opacity-25')}
                fill={i < stars ? 'currentColor' : 'none'}
                stroke={i < stars ? 'var(--ink)' : 'currentColor'}
                strokeWidth={1.6}
              />
            </span>
          ))}
        </div>
        {record && (
          <span className="relative mt-3 inline-flex items-center justify-center">
            <span
              aria-hidden="true"
              className="quiz-rays absolute size-64 rounded-full"
              style={{ animationDelay: '1900ms', background: 'repeating-conic-gradient(from 0deg, rgb(43 217 99 / 0.5) 0deg 10deg, transparent 10deg 24deg)' }}
            />
            <span
              className="slap relative inline-flex items-center gap-2 rounded-full bg-peak px-5 py-2.5 font-display text-[1.5rem] text-peak-ink shadow-[0_0_0_4px_var(--color-sticker),0_5px_0_4px_rgb(30_8_20/0.3)]"
              style={{ '--tilt': '-4deg', '--delay': '1900ms', transform: 'rotate(-4deg)' } as CSSProperties}
            >
              <Trophy aria-hidden="true" className="size-6" strokeWidth={2.5} />
              New record!
            </span>
          </span>
        )}
      </div>

      <ul className="grid grid-cols-3 gap-2.5 text-center">
        <Stat i={1} label="Best streak" value={p.bestStreak} icon={<Flame aria-hidden="true" className="size-4" strokeWidth={2.5} />} />
        <Stat i={2} label="Right" value={`${p.correct}/${game.total}`} />
        {daily && dayStreak !== undefined
          ? <Stat i={3} label={dayStreak === 1 ? 'Day streak' : 'Days in a row'} value={dayStreak} />
          : prevBest > 0
            ? <Stat i={3} label={record ? 'Old best' : 'Your best'} value={prevBest.toLocaleString('en-AU')} />
            : <Stat i={3} label="Hearts left" value={p.lives ?? 0} />}
      </ul>

      {missed.length > 0 && (
        <section className="pop-in flex flex-col gap-3 rounded-block bg-(--ink) p-4 text-(--light)" style={{ '--i': 4 } as CSSProperties}>
          <h2 className="font-display text-name">Fruit to get to know</h2>
          <ul className="flex flex-wrap gap-2.5">
            {missed.map((f, i) => (
              <li key={f.id}>
                <button
                  type="button"
                  onClick={() => navigate({ name: 'fruit', id: f.id })}
                  className="press flex flex-col items-center gap-1 rounded-[20px] bg-(--pop) px-2.5 pt-2 pb-1.5 text-caption font-extrabold text-(--ink)"
                  style={toneVars(tonesOf(f.colour))}
                >
                  <FruitSticker fruit={f} size={58} slap delay={1200 + i * 90} eager />
                  {f.name}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {daily && <p className="text-center text-body font-semibold">A new daily challenge lands at midnight.</p>}
      {shared && <p role="status" className="text-center text-small font-bold">{shared}</p>}

      <div className="flex flex-col gap-2.5">
        <div className="flex gap-2.5">
          {onAgain && (
            <button type="button" onClick={onAgain} className={primary}>
              <RotateCcw aria-hidden="true" className="size-5" strokeWidth={2.5} />
              Play again
            </button>
          )}
          <button type="button" onClick={share} className={onAgain ? secondary : primary}>
            <Share2 aria-hidden="true" className="size-5" strokeWidth={2.5} />
            Share
          </button>
        </div>
        <button type="button" onClick={onDone} className="press inline-flex h-12 items-center justify-center rounded-full bg-(--bright) text-body font-extrabold text-(--ink)">
          Done
        </button>
      </div>
    </div>
  )
}

function Stat({ i, label, value, icon }: { i: number; label: string; value: string | number; icon?: ReactNode }) {
  return (
    <li className="pop-in flex flex-col items-center justify-center gap-0.5 rounded-[22px] bg-(--deep) px-2 py-3 text-(--light)" style={{ '--i': i } as CSSProperties}>
      <span className="flex items-center gap-1 font-display text-[1.6rem] leading-none tabular-nums">{icon}{value}</span>
      <span className="text-caption font-bold">{label}</span>
    </li>
  )
}

export function PassEnd({ game, onAgain, onDone }: { game: GameState; onAgain: () => void; onDone: () => void }) {
  const win = winner(game)
  const top = Math.max(1, ...game.players.map(p => p.score))
  useEffect(() => {
    const t = setTimeout(() => sfx.yay(), 500)
    return () => clearTimeout(t)
  }, [])
  return (
    <div className="flex flex-col gap-5 px-4 pt-[calc(env(safe-area-inset-top)+20px)] pb-[calc(env(safe-area-inset-bottom)+24px)]">
      <div
        className="pop-in flex flex-col items-center gap-2 overflow-hidden rounded-block bg-(--pop) px-5 py-7 text-center text-(--ink) block-shadow"
        style={win ? toneVars(tonesOf(PLAYER_COLOURS[game.players.indexOf(win)])) : undefined}
      >
        <span className="relative inline-flex items-center justify-center">
          <span
            aria-hidden="true"
            className="quiz-rays absolute size-72 rounded-full"
            style={{ animationDelay: '200ms', background: 'repeating-conic-gradient(from 0deg, rgb(255 253 248 / 0.55) 0deg 10deg, transparent 10deg 24deg)' }}
          />
          <span className="slap relative inline-flex size-20 items-center justify-center rounded-full bg-ending text-ending-ink shadow-[0_0_0_5px_var(--color-sticker)]" style={{ '--tilt': '-8deg', '--delay': '200ms', transform: 'rotate(-8deg)' } as CSSProperties}>
            <Crown aria-hidden="true" className="size-11" strokeWidth={2.25} fill="currentColor" />
          </span>
        </span>
        <h1 className="font-display text-[2.6rem] leading-none break-words">{win ? `${win.name} wins!` : "It's a draw!"}</h1>
        <p className="text-body font-semibold">{win ? 'Fruit champion of the couch.' : 'Evenly matched. Rematch?'}</p>
      </div>
      <ul className="flex flex-col gap-3">
        {game.players.map((p, i) => (
          <li key={i} className="pop-in flex flex-col gap-2 rounded-block bg-(--pop) p-4 text-(--ink) block-shadow" style={{ ...toneVars(tonesOf(PLAYER_COLOURS[i])), '--i': i + 1 } as CSSProperties}>
            <span className="flex items-baseline justify-between gap-3">
              <span className="font-display text-name break-words">{p.name}</span>
              <span className="font-display text-[2rem] leading-none tabular-nums">{p.score.toLocaleString('en-AU')}</span>
            </span>
            <span className="relative h-4 overflow-hidden rounded-full bg-(--ink)">
              <span className="quiz-meter-fill absolute inset-0 rounded-full bg-(--bright)" style={{ transform: `scaleX(${p.score / top})` }} />
            </span>
            <span className="text-small font-bold">{p.correct} of {p.answered} right · best streak {p.bestStreak}</span>
          </li>
        ))}
      </ul>
      <div className="flex gap-2.5">
        <button type="button" onClick={onAgain} className={primary}>
          <RotateCcw aria-hidden="true" className="size-5" strokeWidth={2.5} />
          Rematch
        </button>
        <button type="button" onClick={onDone} className={secondary}>Done</button>
      </div>
    </div>
  )
}
