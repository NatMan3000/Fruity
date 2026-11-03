import { useLayoutEffect, useRef, type ReactNode } from 'react'
import clsx from 'clsx'
import { peekFit } from '../utils/peek'

// A row of filter chips. On a phone it scrolls sideways, and the gap between chips and their side
// padding (`--chip-px`, which the chips read) are nudged so the chip at the screen's edge is always
// visibly cut (src/utils/peek.ts): an obvious "more this way", never a row that happens to end flush
// with the edge and hides the rest. From the sm
// breakpoint up the chips wrap, so none is ever out of reach.
export function ChipRow({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  const row = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const el = row.current
    if (!el) return
    const fit = () => {
      el.style.columnGap = ''
      el.style.removeProperty('--chip-px')
      if (getComputedStyle(el).flexWrap === 'wrap') return
      const widths = [...el.children].map(c => c.getBoundingClientRect().width)
      const { gap, pad } = peekFit(widths, parseFloat(getComputedStyle(el).paddingLeft) || 0, el.clientWidth)
      el.style.columnGap = `${gap}px`
      el.style.setProperty('--chip-px', `${pad}px`)
    }
    fit()
    document.fonts?.ready.then(fit) // chip widths change once the font lands
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [children])
  return (
    <div
      ref={row}
      role="group"
      aria-label={label}
      className={clsx('flex gap-2 overflow-x-auto px-4 py-1 scrollbar-hide sm:flex-wrap sm:overflow-visible', className)}
    >
      {children}
    </div>
  )
}
