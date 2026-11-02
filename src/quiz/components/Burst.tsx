// One-shot effects over the game: a juice burst where a right answer was tapped (drops in the fruit's
// colour), the points floating up, and the streak milestone sticker. Each is drawn once and removed
// by the game after it has played; under reduced motion they never show (the result bar and the
// screen-reader line still say it all).
import type { CSSProperties } from 'react'
import { Flame } from 'lucide-react'

const DROPS = 16

export function JuiceBurst({ x, y, colour }: { x: number; y: number; colour: string }) {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed z-50" style={{ left: x, top: y }}>
      <span className="quiz-splat absolute size-36 rounded-full" style={{ background: colour, left: 0, top: 0 }} />
      {Array.from({ length: DROPS }, (_, k) => {
        const a = (k / DROPS) * Math.PI * 2 + (k % 3) * 0.2
        const dist = 70 + (k % 4) * 26
        const size = 9 + (k % 3) * 5
        return (
          <span
            key={k}
            className="quiz-drop absolute rounded-full"
            style={{
              left: 0, top: 0, width: size, height: size * 1.15, background: colour,
              boxShadow: 'inset -2px -3px 0 rgb(0 0 0 / 0.12), 0 0 0 2px var(--color-sticker)',
              '--dx': `${Math.cos(a) * dist}px`, '--dy': `${Math.sin(a) * dist + 30}px`,
              '--delay': `${(k % 4) * 18}ms`, '--life': `${560 + (k % 5) * 60}ms`,
            } as CSSProperties}
          />
        )
      })}
    </div>
  )
}

export function PointsFloat({ x, y, points, multiplier }: { x: number; y: number; points: number; multiplier: number }) {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed z-50" style={{ left: x, top: y - 30 }}>
      <span className="quiz-float absolute left-0 block font-display text-[2.4rem] leading-none whitespace-nowrap text-peak [text-shadow:0_3px_0_var(--ink),0_0_0_var(--ink),2px_2px_0_var(--ink),-2px_2px_0_var(--ink)]">
        +{points}{multiplier > 1 && <span className="ml-1 text-[1.4rem] text-ending">x{multiplier}</span>}
      </span>
    </div>
  )
}

const MILESTONE_WORDS: Record<number, string> = { 3: 'Juicy streak!', 5: 'On fire!', 10: 'Fruit legend!' }

export function Milestone({ streak }: { streak: number }) {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
      <span
        className="quiz-rays absolute size-[150vmin] rounded-full"
        style={{ background: 'repeating-conic-gradient(from 0deg, rgb(255 181 61 / 0.55) 0deg 10deg, transparent 10deg 24deg)' }}
      />
      <span className="quiz-milestone relative flex flex-col items-center gap-1 rounded-[32px] bg-ending px-8 py-5 text-ending-ink shadow-[0_0_0_6px_var(--color-sticker),0_10px_0_6px_rgb(30_8_20/0.35)]">
        <span className="flex items-center gap-2 font-display text-[3.2rem] leading-none tabular-nums">
          <Flame aria-hidden="true" className="size-12" strokeWidth={2.5} fill="currentColor" />
          {streak}
        </span>
        <span className="font-display text-title">{MILESTONE_WORDS[streak] ?? `${streak} in a row!`}</span>
      </span>
    </div>
  )
}
