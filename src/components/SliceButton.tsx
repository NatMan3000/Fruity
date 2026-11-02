import clsx from 'clsx'
import { Slice } from 'lucide-react'

// The knife: cuts a fruit open (or puts it back) for anyone who cannot or will not tap the 3D fruit.
export function SliceButton({ onSlice, label = 'Slice', className }: { onSlice: () => void; label?: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={onSlice}
      className={clsx('press block-shadow inline-flex h-11 items-center gap-1.5 rounded-full bg-(--bright) pr-4 pl-3 text-small font-extrabold text-(--ink)', className)}
    >
      <Slice aria-hidden="true" className="size-5" strokeWidth={2.5} />
      {label}
    </button>
  )
}
