import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import clsx from 'clsx'

// A row of filter chips. On a phone it scrolls sideways and its right edge fades while more chips are
// hidden past it; from the sm breakpoint up the chips wrap, so none is ever out of reach.
export function ChipRow({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  const row = useRef<HTMLDivElement>(null)
  const [more, setMore] = useState(false)
  const measure = () => {
    const el = row.current
    if (el) setMore(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }
  useLayoutEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])
  return (
    <div
      ref={row}
      role="group"
      aria-label={label}
      onScroll={measure}
      className={clsx('flex gap-2 overflow-x-auto px-4 py-1 scrollbar-hide sm:flex-wrap sm:overflow-visible', more && 'chip-fade', className)}
    >
      {children}
    </div>
  )
}
