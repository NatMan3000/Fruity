import { useState, type ReactNode } from 'react'
import clsx from 'clsx'
import type { Fruit } from '../../types/fruit'
import { FruitIcon } from '../../components/FruitIcon'
import { TAB_CONTROL } from '../../components/TabControls'
import { toneVars, tonesOf } from '../../utils/tones'
import { describeMonths, getSeasonality } from '../../utils/seasonality'
import { CUSTOMERS } from '../customers'
import { friendSticker, fruitSticker } from '../logic/progress'
import { CustomerFace } from './CustomerFace'
import { CloseDisc } from './Controls'
import { OVERLAY } from '../ui'

interface StickerBookProps {
  stickers: string[]
  fruits: Fruit[]
  onClose: () => void
}

// A tiny tilt per sticker, the same every time, so the page looks hand-stuck.
const tilt = (id: string) => ([...id].reduce((a, c) => a + c.charCodeAt(0), 0) % 9) - 4

export function StickerBook({ stickers, fruits, onClose }: StickerBookProps) {
  const [tab, setTab] = useState<'fruit' | 'friends'>('fruit')
  const have = new Set(stickers)
  const fruitCount = fruits.filter(f => have.has(fruitSticker(f.id))).length
  const friendCount = CUSTOMERS.filter(c => have.has(friendSticker(c.id))).length

  const tabs = [
    { id: 'fruit', label: `Fruit ${fruitCount}/${fruits.length}` },
    { id: 'friends', label: `Friends ${friendCount}/${CUSTOMERS.length}` },
  ] as const

  return (
    <div className={OVERLAY} role="dialog" aria-modal="true" aria-labelledby="cafe-book-title">
      <header className="flex items-center gap-2 px-4 pt-[calc(env(safe-area-inset-top)+12px)] pb-2">
        <h2 id="cafe-book-title" className="min-w-0 flex-1 font-display text-[clamp(2.25rem,11vw,3rem)] leading-none">Sticker book</h2>
        <CloseDisc label="Close the sticker book" onClick={onClose} />
      </header>
      {/* The Cook tab's segmented control: an ink pill, the current side in the season's pop. */}
      <div className={`mx-4 mt-2 flex ${TAB_CONTROL} bg-(--ink) p-0.5`} role="tablist">
        {tabs.map(t => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={clsx('chip inline-flex h-full flex-1 items-center justify-center rounded-full text-small font-extrabold tabular-nums', tab === t.id ? 'bg-(--pop) text-(--ink)' : 'text-(--bright)')}
          >
            {t.label}
          </button>
        ))}
      </div>
      <p className="px-5 pt-3 pb-1 text-body font-semibold">
        {tab === 'fruit' ? 'Serve a fruit to get its sticker.' : 'Get three stars for a friend to get their sticker.'}
      </p>
      <ul className="grid grid-cols-3 gap-x-2.5 gap-y-3.5 px-4 pt-2.5 pb-[calc(env(safe-area-inset-bottom)+24px)]">
        {tab === 'fruit' && fruits.map(f => {
          const got = have.has(fruitSticker(f.id))
          const peak = getSeasonality(f).peak
          return (
            <StickerCard key={f.id} got={got} colour={f.colour} tilt={tilt(f.id)} name={f.name} fact={peak.length ? `Best ${describeMonths(peak)}` : 'All year'}>
              {got
                ? <FruitIcon fruit={f} size="lg" />
                : <span className="inline-flex size-14 items-center justify-center rounded-[46%_54%_50%_50%/55%_50%_50%_45%] bg-(--pop) font-display text-[1.75rem] text-(--ink)" style={toneVars(tonesOf(f.colour))} aria-hidden="true">?</span>}
            </StickerCard>
          )
        })}
        {tab === 'friends' && CUSTOMERS.map(c => {
          const got = have.has(friendSticker(c.id))
          return (
            <StickerCard key={c.id} got={got} colour={c.fur} tilt={tilt(c.id)} name={c.name} fact={c.about}>
              <span className={got ? undefined : 'opacity-35 brightness-0 invert'}><CustomerFace customer={c} mood={got ? 'delighted' : 'neutral'} size={60} /></span>
            </StickerCard>
          )
        })}
      </ul>
    </div>
  )
}

// A sticker you have is a block in its own colour, slapped on at a tilt with the white die-cut edge;
// one you don't is a dashed space on the page with a hint of its colour.
function StickerCard({ got, colour, tilt, name, fact, children }: { got: boolean; colour: string; tilt: number; name: string; fact: string; children: ReactNode }) {
  return (
    <li
      className={clsx(
        'flex flex-col items-center gap-1 rounded-3xl px-1.5 pt-2.5 pb-2 text-center',
        got ? 'bg-(--pop) text-(--ink) shadow-[0_0_0_3px_var(--color-sticker),0_5px_0_3px_var(--shadow)]' : 'border-[3px] border-dashed border-(--light)/45',
      )}
      style={got ? { ...toneVars(tonesOf(colour)), transform: `rotate(${tilt}deg)` } : undefined}
    >
      <span className="leading-none">{children}</span>
      <span className="font-display text-[1.0625rem] leading-tight">{got ? name : 'Not yet'}</span>
      {got && <span className="text-caption leading-tight font-bold text-(--ink-soft)">{fact}</span>}
    </li>
  )
}
