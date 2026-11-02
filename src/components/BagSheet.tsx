import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { Check, Copy, Share, X } from 'lucide-react'
import { FRUITS } from '../assets/fruits'
import { updateBag, useBag } from '../hooks/useBag'
import { bagText, clearDone, removeItem, toggleDone } from '../utils/bag'
import { FruitIcon } from './FruitIcon'
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
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-control bg-ink font-semibold text-paper active:opacity-90"
        >
          {canShare ? <Share aria-hidden="true" className="size-5" /> : <Copy aria-hidden="true" className="size-5" />}
          {copyState === 'copied' ? 'Copied' : canShare ? 'Share list' : 'Copy list'}
        </button>
        {anyDone && (
          <button
            type="button"
            onClick={() => updateBag(clearDone)}
            className="inline-flex h-12 items-center justify-center rounded-control bg-tile px-4 font-semibold text-ink active:bg-tile-strong"
          >
            Clear ticked
          </button>
        )}
      </div>
      <p aria-live="polite" className="text-caption text-ink-2 empty:hidden">
        {copyState === 'copied' ? 'List copied as plain text.' : copyState === 'failed' ? 'Could not copy. Try again, or long-press to select.' : ''}
      </p>
    </div>
  )

  return (
    <Sheet open={open} onClose={onClose} title="Bag" footer={footer || undefined}>
      {bag.length === 0 ? (
        <p className="py-6 text-body text-ink-2">Your bag is empty. Open a fruit and tap Add to bag.</p>
      ) : (
        <ul className="flex flex-col gap-1">
          {bag.map(item => {
            const fruit = item.fruitId ? FRUITS.find(f => f.id === item.fruitId) : undefined
            return (
              <li key={item.id} className="flex items-center gap-1">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={item.done}
                  onClick={() => updateBag(b => toggleDone(b, item.id))}
                  className="flex min-h-12 flex-1 items-center gap-3 rounded-control px-1 text-left active:bg-tile"
                >
                  <span
                    className={clsx(
                      'inline-flex size-6 shrink-0 items-center justify-center rounded-full',
                      item.done ? 'bg-leaf text-card' : 'bg-card ring-2 ring-tile-strong ring-inset',
                    )}
                  >
                    {item.done && <Check aria-hidden="true" className="tick-in size-4" strokeWidth={3} />}
                  </span>
                  {fruit && <FruitIcon fruit={fruit} size="sm" />}
                  <span className={clsx('text-body', item.done ? 'text-ink-3 line-through' : 'text-ink')}>{item.name}</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateBag(b => removeItem(b, item.id))}
                  aria-label={`Remove ${item.name}`}
                  className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-ink-3 hover:bg-tile active:bg-tile-strong"
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
