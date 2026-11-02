import { useEffect, useState, type CSSProperties } from 'react'
import clsx from 'clsx'
import { Check, Copy, Share, X } from 'lucide-react'
import { FRUITS } from '../assets/fruits'
import { updateBag, useBag } from '../hooks/useBag'
import { bagText, clearDone, removeItem, toggleDone } from '../utils/bag'
import { FruitSticker } from './FruitSticker'
import { Sheet } from './Sheet'

type CopyState = 'idle' | 'copied' | 'failed'

export function BagSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const bag = useBag()
  const [copyState, setCopyState] = useState<CopyState>('idle')
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'
  const anyDone = bag.some(i => i.done)

  useEffect(() => {
    if (copyState === 'idle') return
    const t = setTimeout(() => setCopyState('idle'), 2500)
    return () => clearTimeout(t)
  }, [copyState])

  const shareList = async () => {
    const text = bagText(bag)
    if (canShare) {
      try {
        await navigator.share({ text })
        return
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return // closed the share sheet
        // anything else: fall through to the clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(text)
      setCopyState('copied')
    } catch (err) {
      console.warn('fruity: could not copy the list', err)
      setCopyState('failed')
    }
  }

  const footer = bag.length > 0 && (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={shareList}
          className="press inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-(--ink) font-extrabold text-(--light)"
        >
          {canShare ? <Share aria-hidden="true" className="size-5" /> : <Copy aria-hidden="true" className="size-5" />}
          {copyState === 'copied' ? 'Copied' : canShare ? 'Share list' : 'Copy list'}
        </button>
        {anyDone && (
          <button
            type="button"
            onClick={() => updateBag(clearDone)}
            className="press inline-flex h-12 items-center justify-center rounded-full bg-(--pop) px-5 font-extrabold text-(--ink)"
          >
            Clear ticked
          </button>
        )}
      </div>
      <p aria-live="polite" className="text-caption font-semibold text-(--ink-soft) empty:hidden">
        {copyState === 'copied' ? 'List copied as plain text.' : copyState === 'failed' ? 'Could not copy. Try again, or long-press to select.' : ''}
      </p>
    </div>
  )

  return (
    <Sheet open={open} onClose={onClose} title="Bag" footer={footer || undefined}>
      {bag.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <span aria-hidden="true" className="slap inline-flex size-20 items-center justify-center rounded-full bg-(--pop) text-[44px] leading-none" style={{ '--tilt': '-6deg', transform: 'rotate(var(--tilt))' } as CSSProperties}>
            <span className="sticker-emoji">🧺</span>
          </span>
          <p className="text-body font-semibold">Your bag is empty. Open a fruit and tap Add to bag.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-0.5">
          {bag.map(item => {
            const fruit = item.fruitId ? FRUITS.find(f => f.id === item.fruitId) : undefined
            return (
              <li key={item.id} className="flex items-center gap-1">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={item.done}
                  onClick={() => updateBag(b => toggleDone(b, item.id))}
                  className="flex min-h-14 flex-1 items-center gap-3 rounded-full px-1 text-left active:bg-(--pop)"
                >
                  <span
                    className={clsx(
                      'inline-flex size-6 shrink-0 items-center justify-center rounded-full',
                      item.done ? 'bg-peak text-peak-ink' : 'ring-[2.5px] ring-(--ink-soft) ring-inset',
                    )}
                  >
                    {item.done && <Check aria-hidden="true" className="tick-in size-4" strokeWidth={3} />}
                  </span>
                  {fruit && <FruitSticker fruit={fruit} size={40} />}
                  <span className={clsx('text-body font-bold', item.done ? 'text-(--ink-soft) line-through' : 'text-(--ink)')}>{item.name}</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateBag(b => removeItem(b, item.id))}
                  aria-label={`Remove ${item.name}`}
                  className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-(--ink-soft) active:bg-(--pop)"
                >
                  <X aria-hidden="true" className="size-4" />
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </Sheet>
  )
}
