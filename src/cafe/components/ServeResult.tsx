import type { Fruit } from '../../types/fruit'
import { FruitIcon } from '../../components/FruitIcon'
import type { Customer } from '../customers'
import type { ServeScore } from '../logic/progress'
import { CustomerFace } from './CustomerFace'

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
    <section className="cafe-result" aria-labelledby="cafe-result-title">
      <div className="cafe-result__head">
        <CustomerFace customer={customer} mood={score.stars === 3 ? 'delighted' : 'happy'} size={84} />
        <div>
          <h2 id="cafe-result-title" className="cafe-result__thanks">{thanks}</h2>
          <p className="cafe-result__who">{customer.name}</p>
        </div>
      </div>

      <div className="cafe-stars" role="img" aria-label={`${score.stars} out of 3 stars`}>
        {[0, 1, 2].map(i => (
          <svg key={i} viewBox="0 0 48 48" className={`cafe-star${i < score.stars ? ' cafe-star--on' : ''}`} style={{ animationDelay: `${200 + i * 260}ms` }} aria-hidden="true">
            <path d="M24 3 L30 17 L45 18 L33 28 L37 44 L24 35 L11 44 L15 28 L3 18 L18 17 Z" strokeLinejoin="round" />
          </svg>
        ))}
      </div>

      <ul className="cafe-reasons">
        {reasons.map((r, i) => (
          <li key={i} className={r.done ? 'is-done' : ''}>
            <span aria-hidden="true">{r.done ? '★' : '☆'}</span> {r.done ? r.yes : r.no}
          </li>
        ))}
      </ul>

      {levelUp && <p className="cafe-levelup">Level {levelUp.level}! You're a {levelUp.name}!</p>}

      {stickers.length > 0 && (
        <div className="cafe-newstickers">
          <p>New {stickers.length === 1 ? 'sticker' : 'stickers'}!</p>
          <ul>
            {stickers.map(s => {
              const [kind, id] = s.split(':')
              const f = kind === 'fruit' ? fruits.find(x => x.id === id) : undefined
              return (
                <li key={s} className="cafe-sticker cafe-sticker--mini">
                  {f ? <FruitIcon fruit={f} size="sm" /> : <CustomerFace customer={customer} mood="delighted" size={32} />}
                </li>
              )
            })}
          </ul>
        </div>
      )}

      <div className="cafe-result__actions">
        <button type="button" className="cafe-btn cafe-btn--go" onClick={onNext} autoFocus>Next customer</button>
        <button type="button" className="cafe-btn cafe-btn--grownup" onClick={onRecipe}>
          <span>Make it for real</span>
          <small>recipe for grown-ups</small>
        </button>
      </div>
    </section>
  )
}
