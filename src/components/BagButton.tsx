import { ShoppingBag } from 'lucide-react'
import { useBag } from '../hooks/useBag'
import { useUi } from '../hooks/useUi'
import { remainingCount } from '../utils/bag'

// Top right on Now, Fruit, fruit pages and Cook. The badge counts what is still to get.
export function BagButton() {
  const { openBag } = useUi()
  const left = remainingCount(useBag())
  return (
    <button
      type="button"
      onClick={openBag}
      aria-label={left ? `Bag, ${left} to get` : 'Bag'}
      className="relative inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-card text-ink hover:bg-tile active:bg-tile-strong"
    >
      <ShoppingBag aria-hidden="true" className="size-5" />
      {left > 0 && (
        <span className="absolute -top-0.5 -right-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-caption font-semibold text-paper tabular-nums">
          {left}
        </span>
      )}
    </button>
  )
}
