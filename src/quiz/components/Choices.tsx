// The answers: fruit stickers with names, ingredient pictures, or the twelve months. Big targets
// (kids), pictures as well as words. Before answering they are the card's `deep`; after, the right one
// turns peak green and swells, a wrong pick turns red and squishes, the rest step back.
import type { CSSProperties, MouseEvent } from 'react'
import clsx from 'clsx'
import { Check, X } from 'lucide-react'
import type { Fruit } from '../../types/fruit'
import { MONTH_NAMES } from '../../utils/months'
import type { Month } from '../../types/fruit'
import { FruitSticker } from '../../components/FruitSticker'
import type { Choice, Question } from '../logic/questions'

interface ChoicesProps {
  q: Question
  fruitsById: Map<string, Fruit>
  picked: string | null | undefined // undefined: not answered yet; null: time ran out
  big: boolean                      // no picture this round: the stickers are the picture
  onPick: (id: string, at: { x: number; y: number }) => void
}

export function Choices({ q, fruitsById, picked, big, onPick }: ChoicesProps) {
  const answered = picked !== undefined
  const tap = (id: string) => (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    onPick(id, { x: r.left + r.width / 2, y: r.top + r.height / 2 })
  }
  const state = (c: Choice) => {
    if (!answered) return 'open'
    if (q.correct.includes(c.id)) return 'right'
    return c.id === picked ? 'wrong' : 'rest'
  }
  const tone = (s: string) => clsx(
    'chip relative flex items-center rounded-[22px] text-left font-extrabold',
    s === 'open' && 'press block-shadow bg-(--deep) text-(--light)',
    s === 'right' && 'quiz-swell bg-peak text-peak-ink',
    s === 'wrong' && 'quiz-squish bg-off text-off-ink',
    s === 'rest' && 'bg-(--deep) text-(--light) opacity-45',
  )
  const mark = (s: string) =>
    s === 'right' ? <Check aria-label="Right answer" className="tick-in absolute top-2 right-2 size-6" strokeWidth={3.25} />
      : s === 'wrong' ? <X aria-label="Your answer" className="absolute top-2 right-2 size-6" strokeWidth={3.25} />
        : null

  if (q.kind === 'peakMonth') {
    return (
      <div className="grid grid-cols-4 gap-2" role="group" aria-label="Months">
        {q.choices.map((c, i) => {
          const s = state(c)
          return (
            <button
              key={c.id}
              type="button"
              disabled={answered}
              onClick={tap(c.id)}
              aria-label={MONTH_NAMES[c.id as Month]}
              className={clsx(tone(s), 'pop-in h-14 justify-center rounded-full text-body')}
              style={{ '--i': i * 0.5 } as CSSProperties}
            >
              {c.label}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {q.choices.map((c, i) => {
        const s = state(c)
        const fruit = c.fruitId ? fruitsById.get(c.fruitId) : undefined
        return (
          <button
            key={c.id}
            type="button"
            disabled={answered}
            onClick={tap(c.id)}
            className={clsx(
              tone(s),
              'pop-in',
              big ? 'min-h-[150px] flex-col justify-center gap-2 px-3 py-3 text-center text-name font-display font-normal' : 'min-h-[88px] flex-col items-start justify-end gap-1 px-3 pt-2 pb-2.5 text-body leading-tight',
            )}
            style={{ '--i': i } as CSSProperties}
          >
            {fruit ? (
              <FruitSticker fruit={fruit} size={big ? 92 : 44} tilt={big ? undefined : -4} eager />
            ) : c.emoji ? (
              <span aria-hidden="true" className={clsx('sticker-emoji-sm inline-flex shrink-0 items-center justify-center leading-none', big ? 'text-[56px]' : 'size-[44px] text-[32px]')}>{c.emoji}</span>
            ) : null}
            <span className="min-w-0">{c.label}</span>
            {mark(s)}
          </button>
        )
      })}
    </div>
  )
}
