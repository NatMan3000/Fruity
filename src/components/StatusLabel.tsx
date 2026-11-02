import clsx from 'clsx'
import { Check, CircleDashed, Hourglass, Repeat, Star, type LucideIcon } from 'lucide-react'
import type { FruitStatus } from '../utils/seasonality'
import { statusWord } from '../utils/status'

// Status is colour + word + icon, always (DESIGN.md "Colour"). Nothing else invents a status style.
const STATUS: Record<FruitStatus, { Icon: LucideIcon; tone: string }> = {
  peak: { Icon: Star, tone: 'text-peak-ink' },
  ending: { Icon: Hourglass, tone: 'text-ending-ink' },
  available: { Icon: Check, tone: 'text-season-ink' },
  always: { Icon: Repeat, tone: 'text-ink-2' },
  off: { Icon: CircleDashed, tone: 'text-off-ink' },
}

export function StatusLabel({ status, className }: { status: FruitStatus; className?: string }) {
  const { Icon, tone } = STATUS[status]
  const word = statusWord(status)
  // Inline (not flex) so the label sits on the text baseline of whatever row it is in.
  return (
    <span className={clsx('text-caption font-semibold whitespace-nowrap', tone, className)}>
      <Icon aria-hidden="true" className="mr-1 inline size-3.5 align-[-2px]" strokeWidth={2.5} fill={status === 'peak' ? 'currentColor' : 'none'} />
      {word}
    </span>
  )
}
