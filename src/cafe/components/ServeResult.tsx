import type { CSSProperties } from 'react'
import clsx from 'clsx'
import { Star } from 'lucide-react'
import type { Fruit } from '../../types/fruit'
import { FruitIcon } from '../../components/FruitIcon'
import type { Customer } from '../customers'
import type { ServeScore } from '../logic/progress'
import { CustomerFace } from './CustomerFace'
import { pill } from '../ui'

interface ServeResultProps {
  customer: Customer
  thanks: string
  score: ServeScore
  stickers: string[]
  fruits: Fruit[]
  levelUp: { level: number; name: string } | null
  onNext: () => void
  onRecipe: () => void
}

// After serving: the customer's verdict, 1 to 3 stars with the reason for each, any new
// stickers, and the grown-up "make it for real" button.
export function ServeResult({ customer, thanks, score, stickers, fruits, levelUp, onNext, onRecipe }: ServeResultProps) {
  const reasons = [
    { done: true, yes: 'Just what I ordered', no: '' },
    { done: score.chopped, yes: 'All chopped up', no: 'Chop every fruit for a star' },
    { done: score.stirred, yes: 'Stirred round and round', no: 'Stir the bowl for a star' },
  ]
  return (
    <section className="cafe-slide-up block-shadow mx-4 mt-3 mb-[calc(env(safe-area-inset-bottom)+12px)] flex flex-none flex-col gap-2 rounded-block bg-(--bright) p-4 text-(--ink) [@media(max-height:700px)]:gap-1 [@media(max-height:700px)]:py-3" aria-labelledby="cafe-result-title">
      <div className="flex items-center gap-2.5">
        <CustomerFace customer={customer} mood={score.stars === 3 ? 'delighted' : 'happy'} size={76} />
        <div className="min-w-0">
          <h2 id="cafe-result-title" className="font-display text-name">{thanks}</h2>
          <p className="text-small font-bold text-(--ink-soft)">{customer.name}</p>
        </div>
      </div>

      {/* The quiz's stars: amber with an ink edge when earned, a faint ink outline when not. */}
      <div className="flex items-end justify-center gap-2" role="img" aria-label={`${score.stars} out of 3 stars`}>
        {[0, 1, 2].map(i => (
          <Star
            key={i}
            aria-hidden="true"
            className={clsx('cafe-star-pop', i === 1 ? 'size-14 [@media(max-height:700px)]:size-10' : 'size-12 [@media(max-height:700px)]:size-9', i < score.stars ? 'text-ending' : 'text-(--ink) opacity-25')}
            fill={i < score.stars ? 'currentColor' : 'none'}
            stroke={i < score.stars ? 'var(--ink)' : 'currentColor'}
            strokeWidth={2}
            style={{ animationDelay: `${200 + i * 260}ms` }}
          />
        ))}
      </div>

      <ul className="flex flex-col gap-0.5 text-small font-bold">
        {reasons.map((r, i) => (
          <li key={i} className={clsx('flex items-center gap-1.5', !r.done && 'text-(--ink-soft)')}>
            <Star aria-hidden="true" className={clsx('size-4 shrink-0', r.done && 'text-ending')} fill={r.done ? 'currentColor' : 'none'} stroke={r.done ? 'var(--ink)' : 'currentColor'} strokeWidth={2.25} />
            {r.done ? r.yes : r.no}
          </li>
        ))}
      </ul>

      {levelUp && <p className="cafe-pop-in rounded-2xl bg-(--ink) px-3 py-1.5 text-center font-extrabold text-(--light) [animation-delay:900ms]">Level {levelUp.level}! You're a {levelUp.name}!</p>}

      {stickers.length > 0 && (
        <div className="flex items-center gap-2">
          <p className="flex-none font-extrabold whitespace-nowrap">New {stickers.length === 1 ? 'sticker' : 'stickers'}!</p>
          <ul className="flex flex-wrap gap-1.5">
            {stickers.map((s, k) => {
              const [kind, id] = s.split(':')
              const f = kind === 'fruit' ? fruits.find(x => x.id === id) : undefined
              return (
                <li key={s} className="slap leading-none" style={{ '--tilt': '-6deg', '--delay': `${700 + k * 120}ms` } as CSSProperties}>
                  {f
                    ? <FruitIcon fruit={f} size="sm" />
                    : <span className="inline-flex rounded-full bg-(--pop) shadow-[0_0_0_2px_var(--color-sticker)]"><CustomerFace customer={customer} mood="delighted" size={32} /></span>}
                </li>
              )
            })}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <button type="button" className={pill('ink', 'px-3 text-[1.125rem]')} onClick={onNext} autoFocus>Next customer</button>
        <button type="button" className={pill('pop', 'px-3 text-body')} onClick={onRecipe}>
          <span className="flex flex-col items-center">
            Make it for real
            <span className="text-caption font-bold">recipe for grown-ups</span>
          </span>
        </button>
      </div>
    </section>
  )
}
