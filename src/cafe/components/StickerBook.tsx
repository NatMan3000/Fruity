import { useState, type CSSProperties } from 'react'
import type { AusState, Fruit } from '../../types/fruit'
import { FruitIcon } from '../../components/FruitIcon'
import { describeMonths, getSeasonality } from '../../utils/seasonality'
import { CUSTOMERS } from '../customers'
import { friendSticker, fruitSticker } from '../logic/progress'
import { CustomerFace } from './CustomerFace'

interface StickerBookProps {
  stickers: string[]
  fruits: Fruit[]
  state: AusState
  onClose: () => void
}

// A tiny tilt per sticker, the same every time, so the page looks hand-stuck.
const tilt = (id: string) => ([...id].reduce((a, c) => a + c.charCodeAt(0), 0) % 9) - 4

export function StickerBook({ stickers, fruits, state, onClose }: StickerBookProps) {
  const [tab, setTab] = useState<'fruit' | 'friends'>('fruit')
  const have = new Set(stickers)
  const fruitCount = fruits.filter(f => have.has(fruitSticker(f.id))).length
  const friendCount = CUSTOMERS.filter(c => have.has(friendSticker(c.id))).length

  return (
    <div className="cafe-overlay cafe-book" role="dialog" aria-modal="true" aria-labelledby="cafe-book-title">
      <header className="cafe-overlay__bar">
        <h2 id="cafe-book-title">Sticker book</h2>
        <button type="button" className="cafe-iconbtn" onClick={onClose} aria-label="Close the sticker book">✕</button>
      </header>
      <div className="cafe-tabs" role="tablist">
        <button type="button" role="tab" aria-selected={tab === 'fruit'} onClick={() => setTab('fruit')}>Fruit {fruitCount}/{fruits.length}</button>
        <button type="button" role="tab" aria-selected={tab === 'friends'} onClick={() => setTab('friends')}>Friends {friendCount}/{CUSTOMERS.length}</button>
      </div>
      <p className="cafe-book__tip">
        {tab === 'fruit' ? 'Serve a fruit to get its sticker.' : 'Get three stars for a friend to get their sticker.'}
      </p>
      <ul className="cafe-book__grid">
        {tab === 'fruit' && fruits.map(f => {
          const got = have.has(fruitSticker(f.id))
          const peak = getSeasonality(f, state).peak
          return (
            <li key={f.id} className={`cafe-sticker${got ? '' : ' cafe-sticker--locked'}`} style={{ '--tilt': `${tilt(f.id)}deg`, '--fruit': f.colour } as CSSProperties}>
              <span className="cafe-sticker__art">
                {got ? <FruitIcon fruit={f} size="lg" /> : <span className="cafe-sticker__mystery" aria-hidden="true">?</span>}
              </span>
              <span className="cafe-sticker__name">{got ? f.name : 'Not yet'}</span>
              {got && <span className="cafe-sticker__fact">{peak.length ? `Best ${describeMonths(peak)}` : 'All year'}</span>}
            </li>
          )
        })}
        {tab === 'friends' && CUSTOMERS.map(c => {
          const got = have.has(friendSticker(c.id))
          return (
            <li key={c.id} className={`cafe-sticker${got ? '' : ' cafe-sticker--locked'}`} style={{ '--tilt': `${tilt(c.id)}deg`, '--fruit': c.fur } as CSSProperties}>
              <span className="cafe-sticker__art"><CustomerFace customer={c} mood={got ? 'delighted' : 'neutral'} size={60} /></span>
              <span className="cafe-sticker__name">{got ? c.name : 'Not yet'}</span>
              {got && <span className="cafe-sticker__fact">{c.about}</span>}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
