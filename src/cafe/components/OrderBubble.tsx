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

// The customer's speech bubble: pictures with a word under each, a tick as each want is met,
// and a crossed-out picture for the "no ..." rule.
export function OrderBubble({ order, fruits, filled, avoidHit, hello, hint, sentence, onHear }: OrderBubbleProps) {
  return (
    <div className="cafe-bubble" role="status" aria-live="polite">
      <div className="cafe-bubble__top">
        <p className={hint ? 'cafe-bubble__hint' : 'cafe-bubble__hello'}>{hint ?? hello}</p>
        <button type="button" className="cafe-iconbtn cafe-iconbtn--small" onClick={onHear} aria-label="Read the order out loud">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
            <path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" />
          </svg>
        </button>
      </div>
      <ul className="cafe-bubble__wants">
        {order.wants.map((w, i) => {
          const have = filled[i] ?? 0
          const met = have >= w.count
          return (
            <li key={i} className={`cafe-want${met ? ' cafe-want--met' : ''}`} data-filled={have} data-count={w.count}>
              <span className="cafe-want__pic">
                <TraitIcon trait={w.trait} fruits={fruits} />
                {w.count > 1 && <span className="cafe-want__count">×{w.count}</span>}
                {met && <span className="cafe-want__tick" aria-hidden="true">✓</span>}
              </span>
              {w.count > 1 ? (
                <span className="cafe-want__dots" aria-label={`${have} of ${w.count}`}>
                  {Array.from({ length: w.count }, (_, k) => <span key={k} className={k < have ? 'is-on' : ''} />)}
                </span>
              ) : null}
              <span className="cafe-want__word">{traitWord(w.trait, fruits)}</span>
            </li>
          )
        })}
        {order.avoid && (
          <li className={`cafe-want cafe-want--avoid${avoidHit ? ' cafe-want--broken' : ''}`}>
            <span className="cafe-want__pic">
              <TraitIcon trait={order.avoid} fruits={fruits} />
              <svg className="cafe-want__no" viewBox="0 0 44 44" aria-hidden="true">
                <circle cx="22" cy="22" r="19" fill="none" stroke="#E53945" strokeWidth="4" />
                <path d="M9 35 L35 9" stroke="#E53945" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
            <span className="cafe-want__word">no {traitWord(order.avoid, fruits)}</span>
          </li>
        )}
      </ul>
      <p className="cafe-sr">Order: {sentence}.</p>
    </div>
  )
}
