import type { ReactNode } from 'react'
import clsx from 'clsx'
import { ChevronLeft, ShoppingBag } from 'lucide-react'
import { goBack } from '../hooks/useRoute'
import { useBag } from '../hooks/useBag'
import { useUi } from '../hooks/useUi'
import { remainingCount } from '../utils/bag'
import type { Route } from '../utils/route'

// The top of every screen (DESIGN.md "Components"): a back disc on deep screens, the page title in
// Shrikhand, any extra controls, and the bag. Discs are the screen's `bright` with `ink` icons, so they
// sit on any season or fruit colour.
interface TopBarProps {
  title?: string
  back?: Route        // show Back; this is where it goes on a deep-link entry
  right?: ReactNode   // controls before the bag (the List / Year toggle)
  bag?: boolean
  intro?: boolean     // the title rises into place (first visit)
}

export function TopBar({ title, back, right, bag = true, intro = false }: TopBarProps) {
  return (
    <header className="flex items-center gap-2 px-4 pt-[calc(env(safe-area-inset-top)+12px)] pb-2">
      {back && (
        <button
          type="button"
          onClick={() => goBack(back)}
          className="press inline-flex h-11 shrink-0 items-center gap-0.5 rounded-full bg-(--bright) pr-4 pl-2 text-small font-bold text-(--ink)"
        >
          <ChevronLeft aria-hidden="true" className="size-6" strokeWidth={2.5} />
          Back
        </button>
      )}
      {title ? (
        <h1 className={clsx('min-w-0 flex-1 font-display text-[clamp(2.5rem,13vw,3.5rem)] leading-none text-(--on-screen)', intro && 'rise')}>{title}</h1>
      ) : (
        <span className="flex-1" />
      )}
      {right}
      {bag && <BagDisc />}
    </header>
  )
}

function BagDisc() {
  const { openBag } = useUi()
  const left = remainingCount(useBag())
  return (
    <button
      type="button"
      onClick={openBag}
      data-bag-disc=""
      aria-label={left ? `Bag, ${left} to get` : 'Bag'}
      className="press relative inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-(--bright) text-(--ink)"
    >
      <ShoppingBag aria-hidden="true" className="size-[22px]" strokeWidth={2.25} />
      {left > 0 && (
        <span
          key={left}
          className="badge-pop absolute -top-1 -right-1 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-(--ink) px-1.5 text-[13px] font-extrabold text-(--light) tabular-nums ring-2 ring-(--bright)"
        >
          {left}
        </span>
      )}
    </button>
  )
}
