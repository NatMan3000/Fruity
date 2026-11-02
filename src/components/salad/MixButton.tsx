import clsx from 'clsx'
import { LoaderCircle, RotateCcw, Shuffle } from 'lucide-react'

interface MixButtonProps {
  fruitCount: number
  isMixing: boolean
  hasBeenMixed: boolean
  onMix: () => void
  onReset: () => void
}

const base = 'inline-flex h-14 w-full items-center justify-center gap-2 rounded-control text-body font-semibold'

export function MixButton({
  fruitCount,
  isMixing,
  hasBeenMixed,
  onMix,
  onReset
}: MixButtonProps) {
  const canMix = fruitCount >= 2 && !isMixing && !hasBeenMixed

  if (hasBeenMixed) {
    return (
      <button type="button" onClick={onReset} className={clsx(base, 'bg-ink text-paper active:opacity-90')}>
        <RotateCcw aria-hidden="true" className="size-5" />
        Make another salad
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onMix}
      disabled={!canMix}
      className={clsx(
        base,
        canMix ? 'bg-ink text-paper active:opacity-90' : 'cursor-not-allowed bg-tile text-ink-2',
      )}
    >
      {isMixing ? (
        <>
          <LoaderCircle aria-hidden="true" className="size-5 motion-safe:animate-spin" />
          Mixing
        </>
      ) : fruitCount < 2 ? (
        <>Add {2 - fruitCount} more fruit to mix</>
      ) : (
        <>
          <Shuffle aria-hidden="true" className="size-5" />
          Mix it up
        </>
      )}
    </button>
  )
}
