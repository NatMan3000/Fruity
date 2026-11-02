import type { ReactNode } from 'react'
import { ChevronLeft } from 'lucide-react'
import { goBack } from '../hooks/useRoute'
import type { Route } from '../utils/route'
import { BagButton } from './BagButton'

interface PageHeaderProps {
  title?: string
  children?: ReactNode // extra content beside the title (the state chip on Now)
  back?: Route         // show a back button; this is where it goes on a deep-link entry
  bag?: boolean
}

export function PageHeader({ title, children, back, bag = true }: PageHeaderProps) {
  return (
    <header className="flex items-center gap-2 px-4 pt-[calc(env(safe-area-inset-top)+12px)] pb-3">
      {back && (
        <button
          type="button"
          onClick={() => goBack(back)}
          className="-ml-2 inline-flex h-11 items-center gap-0.5 rounded-full pr-3 pl-1 text-small font-medium text-ink-2 hover:bg-tile active:bg-tile-strong"
        >
          <ChevronLeft aria-hidden="true" className="size-6" />
          Back
        </button>
      )}
      <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-3 gap-y-1">
        {title && <h1 className="font-display text-display font-semibold text-ink">{title}</h1>}
        {children}
      </div>
      {bag && <BagButton />}
    </header>
  )
}
