import clsx from 'clsx'
import { Check, Volume2 } from 'lucide-react'
import type { Fruit } from '../../types/fruit'
import type { Order } from '../logic/orders'
import { traitWord } from '../logic/words'
import { TraitIcon } from './TraitIcon'

interface OrderBubbleProps {
  order: Order
  fruits: Fruit[]
  filled: number[]        // per want: how many fruits in the bowl count towards it
  avoidHit: boolean       // a fruit in the bowl breaks the "no ..." rule
  hello: string
  hint: string | null     // replaces the hello when the bowl is not right yet
  sentence: string
  onHear: () => void
}

// The customer's speech bubble, a `bright` block like the quiz's question card: pictures on `pop`
// tiles with a word under each, a `peak` tick as each want is met, and a crossed-out picture for the
// "no ..." rule. A hint (the bowl is not right yet) shows in `off`, the quiz's "not quite".
export function OrderBubble({ order, fruits, filled, avoidHit, hello, hint, sentence, onHear }: OrderBubbleProps) {
  return (
    <div className="cafe-bubble cafe-pop-in block-shadow relative mb-4 min-w-0 flex-1 rounded-3xl bg-(--bright) p-2.5 pb-3 text-(--ink)" role="status" aria-live="polite">
      <div className="flex items-start justify-between gap-1.5">
        {hint
          ? <p key={hint} className="cafe-shake rounded-2xl bg-off px-2.5 py-1 text-small leading-snug font-extrabold text-off-ink">{hint}</p>
          : <p className="pt-2 pl-1 text-small leading-snug font-bold text-(--ink-soft)">{hello}</p>}
        <button type="button" className="press inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-(--ink) text-(--light)" onClick={onHear} aria-label="Read the order out loud">
          <Volume2 aria-hidden="true" className="size-5" strokeWidth={2.5} />
        </button>
      </div>
      <ul className="mt-1 flex flex-wrap gap-x-1.5 gap-y-1">
        {order.wants.map((w, i) => {
          const have = filled[i] ?? 0
          const met = have >= w.count
          return (
            <li key={i} className="flex w-[62px] flex-col items-center" data-filled={have} data-count={w.count}>
              <span className={clsx('relative flex size-[52px] items-center [@media(max-height:700px)]:size-11 justify-center rounded-2xl bg-(--pop)', met && 'ring-3 ring-peak')}>
                <TraitIcon trait={w.trait} fruits={fruits} />
                {w.count > 1 && <span className="absolute -top-1.5 -right-2 rounded-full bg-(--ink) px-1.5 text-small font-extrabold text-(--light) ring-2 ring-(--bright)">×{w.count}</span>}
                {met && (
                  <span className="cafe-pop-in absolute -right-1.5 -bottom-1.5 flex size-6 items-center justify-center rounded-full bg-peak text-peak-ink ring-2 ring-(--bright)" aria-hidden="true">
                    <Check className="size-4" strokeWidth={3.25} />
                  </span>
                )}
              </span>
              {w.count > 1 ? (
                <span className="mt-1 flex gap-1" aria-label={`${have} of ${w.count}`}>
                  {Array.from({ length: w.count }, (_, k) => <span key={k} className={clsx('size-2.5 rounded-full', k < have ? 'bg-(--ink)' : 'ring-2 ring-(--ink-soft) ring-inset')} />)}
                </span>
              ) : null}
              <span className="mt-0.5 text-center text-caption leading-tight font-extrabold">{traitWord(w.trait, fruits)}</span>
            </li>
          )
        })}
        {order.avoid && (
          <li className="flex w-[62px] flex-col items-center" data-broken={avoidHit}>
            <span className={clsx('relative flex size-[52px] items-center [@media(max-height:700px)]:size-11 justify-center rounded-2xl bg-(--pop)', avoidHit && 'cafe-shake ring-3 ring-off')}>
              <TraitIcon trait={order.avoid} fruits={fruits} />
              <svg className="absolute inset-1" viewBox="0 0 44 44" aria-hidden="true">
                {/* The red "no" sign, outlined in ink so it reads on any season's colour. */}
                <g fill="none" strokeLinecap="round">
                  <circle cx="22" cy="22" r="19" stroke="var(--ink)" strokeWidth="6.5" />
                  <path d="M9 35 L35 9" stroke="var(--ink)" strokeWidth="6.5" />
                  <circle cx="22" cy="22" r="19" stroke="var(--color-off)" strokeWidth="3.5" />
                  <path d="M9 35 L35 9" stroke="var(--color-off)" strokeWidth="3.5" />
                </g>
              </svg>
            </span>
            <span className="mt-0.5 text-center text-caption leading-tight font-extrabold">no {traitWord(order.avoid, fruits)}</span>
          </li>
        )}
      </ul>
      <p className="sr-only">Order: {sentence}.</p>
    </div>
  )
}
