import clsx from 'clsx'
import { Slice } from 'lucide-react'

// The knife: cuts a fruit open (or puts it back) for anyone who cannot or will not tap the 3D fruit.
// `ink` where it sits over the fruit's blob (the fruit page), so it reads on the blob and the page alike.
export function SliceButton({ onSlice, label = 'Slice', tone = 'bright', className }: { onSlice: () => void; label?: string; tone?: 'bright' | 'ink'; className?: string }) {
  return (
    <button
      type="button"
      onClick={onSlice}
      className={clsx('press block-shadow inline-flex h-11 items-center gap-1.5 rounded-full pr-4 pl-3 text-small font-extrabold', tone === 'ink' ? 'bg-(--ink) text-(--light)' : 'bg-(--bright) text-(--ink)', className)}
    >
      <Slice aria-hidden="true" className="size-5" strokeWidth={2.5} />
      {label}
    </button>
  )
}
