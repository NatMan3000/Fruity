import { useEffect, useId, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'

// Bottom sheet on the native <dialog> (focus trap, Esc, inert background), in the screen's `bright`
// with `ink` text. Springs up, slides down 180ms; appears without motion under reduced motion
// (DESIGN.md "Motion").
interface SheetProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function Sheet({ open, onClose, title, children, footer }: SheetProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) {
      d.removeAttribute('data-closing')
      d.showModal()
      document.documentElement.style.overflow = 'hidden'
    } else if (!open && d.open) {
      document.documentElement.style.overflow = ''
      if (reducedMotion()) return d.close()
      d.setAttribute('data-closing', '')
      const finish = () => {
        d.removeAttribute('data-closing')
        d.close()
      }
      d.addEventListener('animationend', finish, { once: true })
      // If the animation never runs (hidden tab), close anyway.
      const t = setTimeout(finish, 300)
      return () => clearTimeout(t)
    }
  }, [open])

  useEffect(() => () => { document.documentElement.style.overflow = '' }, [])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      className="sheet fixed inset-x-0 top-auto bottom-0 m-0 mx-auto max-h-[85dvh] w-full max-w-lg overflow-hidden rounded-t-block border-0 bg-(--bright) p-0 text-(--ink)"
      onCancel={e => { e.preventDefault(); onClose() }}
      onClick={e => { if (e.target === ref.current) onClose() }}
    >
      <div className="flex max-h-[85dvh] flex-col">
        <div className="flex items-center gap-3 pt-3 pr-3 pb-2 pl-5">
          <h2 id={titleId} className="flex-1 font-display text-title">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="press inline-flex size-11 items-center justify-center rounded-full bg-(--pop) text-(--ink)"
          >
            <X aria-hidden="true" className="size-5" strokeWidth={2.5} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-4">{children}</div>
        {footer && <div className="px-5 pt-2 pb-[calc(env(safe-area-inset-bottom)+16px)]">{footer}</div>}
        {!footer && <div className="pb-[env(safe-area-inset-bottom)]" />}
      </div>
    </dialog>
  )
}
