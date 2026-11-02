// The top of a game: quit, lives (three strawberry hearts), the score, sound; the streak meter (a juice
// meter that fills with the streak, changes colour with the combo, and a flame that jumps); in pass
// the phone, both players' scores as bars instead.
import { type CSSProperties } from 'react'
import clsx from 'clsx'
import { Flame, Volume2, VolumeX, X } from 'lucide-react'
import type { Fruit } from '../../types/fruit'
import { toneVars, tonesOf } from '../../utils/tones'
import { FruitSticker } from '../../components/FruitSticker'
import { LIVES, multiplierFor } from '../logic/scoring'
import type { Player } from '../logic/game'

export const PLAYER_COLOURS = ['#FF9F1C', '#E8378E'] as const // mango and dragon fruit

const disc = 'press inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-(--bright) text-(--ink)'

export function SoundToggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  const Icon = on ? Volume2 : VolumeX
  return (
    <button type="button" onClick={onToggle} aria-pressed={on} aria-label={on ? 'Sound on' : 'Sound off'} className={disc}>
      <Icon aria-hidden="true" className="size-[22px]" strokeWidth={2.4} />
    </button>
  )
}

export function QuitButton({ onQuit }: { onQuit: () => void }) {
  return (
    <button type="button" onClick={onQuit} aria-label="Quit the game" className={disc}>
      <X aria-hidden="true" className="size-6" strokeWidth={2.75} />
    </button>
  )
}

export function Hearts({ lives, strawberry }: { lives: number; strawberry: Fruit }) {
  return (
    <span className="flex items-center gap-0.5" role="img" aria-label={`${lives} of ${LIVES} lives left`}>
      {Array.from({ length: LIVES }, (_, i) => (
        <span key={i} className={clsx('inline-flex', i >= lives && 'quiz-heart-lost')}>
          <FruitSticker fruit={strawberry} size={34} tilt={i * 6 - 6} eager />
        </span>
      ))}
    </span>
  )
}

export function Score({ score }: { score: number }) {
  return (
    <span className="flex flex-col items-end leading-none">
      <span className="text-[13px] font-extrabold tracking-[0.12em] uppercase">Score</span>
      <span key={score} className={clsx('font-display text-[2rem] tabular-nums', score > 0 && 'badge-pop')}>{score.toLocaleString('en-AU')}</span>
    </span>
  )
}

const METER_FILL = ['bg-season', 'bg-peak', 'bg-ending', 'bg-off']

export function StreakMeter({ streak }: { streak: number }) {
  const mult = multiplierFor(streak)
  const fill = Math.min(1, streak / 10)
  return (
    <div className="flex items-center gap-2.5 rounded-full bg-(--ink) py-1.5 pr-3 pl-2 text-(--light)" role="status" aria-label={`Streak ${streak}, times ${mult}`}>
      <span key={streak} className={clsx('inline-flex size-8 items-center justify-center rounded-full', streak > 0 && 'quiz-flame', streak >= 3 ? 'bg-ending text-ending-ink' : 'bg-(--deep) text-(--light)')}>
        <Flame aria-hidden="true" className="size-5" strokeWidth={2.5} fill={streak >= 3 ? 'currentColor' : 'none'} />
      </span>
      <span className="relative h-3.5 flex-1 overflow-hidden rounded-full bg-(--deep)">
        <span className={clsx('quiz-meter-fill absolute inset-0 rounded-full', METER_FILL[mult - 1])} style={{ transform: `scaleX(${fill})` }} />
        {[3, 6].map(m => <span key={m} aria-hidden="true" className="absolute inset-y-0 w-0.5 bg-(--ink) opacity-60" style={{ left: `${m * 10}%` }} />)}
      </span>
      <span className="min-w-[4.6rem] text-right text-small font-extrabold tabular-nums">
        {streak} in a row
      </span>
      <span className={clsx('inline-flex h-7 min-w-10 items-center justify-center rounded-full px-2 font-display text-[1.05rem] tabular-nums', mult > 1 ? 'bg-ending text-ending-ink' : 'bg-(--deep) text-(--light) opacity-70')}>
        x{mult}
      </span>
    </div>
  )
}

export function PassScores({ players, turn }: { players: Player[]; turn: number }) {
  const top = Math.max(1, ...players.map(p => p.score))
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
      {players.map((p, i) => (
        <div
          key={i}
          className={clsx('flex items-center gap-2 rounded-full py-1 pr-3 pl-1 transition-transform duration-300', i === turn ? 'scale-100 bg-(--pop) text-(--ink)' : 'scale-95 bg-(--ink) text-(--light) opacity-80')}
          style={toneVars(tonesOf(PLAYER_COLOURS[i]))}
        >
          <span className={clsx('inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-caption font-extrabold', i === turn ? 'bg-(--ink) text-(--light)' : 'bg-(--pop) text-(--ink)')}>{i + 1}</span>
          <span className="min-w-0 text-small font-extrabold break-words">{p.name}</span>
          <span className="relative h-2.5 min-w-8 flex-1 overflow-hidden rounded-full bg-(--deep)">
            <span className="quiz-meter-fill absolute inset-0 rounded-full bg-(--bright)" style={{ transform: `scaleX(${p.score / top})` } as CSSProperties} />
          </span>
          <span className="font-display text-[1.1rem] tabular-nums">{p.score.toLocaleString('en-AU')}</span>
        </div>
      ))}
    </div>
  )
}
