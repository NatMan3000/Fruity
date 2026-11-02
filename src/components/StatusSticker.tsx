import type { CSSProperties } from 'react'
import clsx from 'clsx'
import { Check, CircleDashed, Hourglass, Repeat, Sparkles, Star, type LucideIcon } from 'lucide-react'
import type { FruitStatus } from '../utils/seasonality'
import { statusWord } from '../utils/status'

// Status as a slapped-on sticker (DESIGN.md "Colour"): colour + word + icon, always, with a white
// die-cut edge and a slight tilt. Nathan's mapping: peak bright green, in season lighter green, out of
// season red family; amber for the last month, lilac for all year. Nothing else invents a status style.
const STYLE: Record<FruitStatus, { Icon: LucideIcon; tone: string }> = {
  peak: { Icon: Star, tone: 'bg-peak text-peak-ink' },
  available: { Icon: Check, tone: 'bg-season text-season-ink' },
  ending: { Icon: Hourglass, tone: 'bg-ending text-ending-ink' },
  always: { Icon: Repeat, tone: 'bg-always text-always-ink' },
  off: { Icon: CircleDashed, tone: 'bg-off text-off-ink' },
}

const SIZE = {
  sm: 'h-6 gap-1 px-2 text-[11px] [&_svg]:size-3',
  md: 'h-7 gap-1 px-2.5 text-[12.5px] [&_svg]:size-3.5',
  lg: 'h-9 gap-1.5 px-3.5 text-[15px] [&_svg]:size-4',
} as const

interface StatusStickerProps {
  status: FruitStatus
  label?: string      // a different word for the same status ("New at peak", "Last month")
  icon?: 'new'
  tilt?: number
  size?: keyof typeof SIZE
  slap?: boolean
  delay?: number
  className?: string
}

export function StatusSticker({ status, label, icon, tilt = -4, size = 'md', slap = false, delay = 0, className }: StatusStickerProps) {
  const { Icon: StatusIcon, tone } = STYLE[status]
  const Icon = icon === 'new' ? Sparkles : StatusIcon
  return (
    <span
      className={clsx(
        'inline-flex shrink-0 items-center rounded-full font-extrabold tracking-[0.04em] whitespace-nowrap uppercase',
        'shadow-[0_0_0_2px_var(--color-sticker),0_3px_0_2px_rgb(30_8_20/0.25)]',
        tone, SIZE[size], slap && 'slap', className,
      )}
      style={{ '--tilt': `${tilt}deg`, '--delay': `${delay}ms`, transform: 'rotate(var(--tilt))' } as CSSProperties}
    >
      <Icon aria-hidden="true" strokeWidth={2.75} fill={status === 'peak' && icon !== 'new' ? 'currentColor' : 'none'} />
      {label ?? statusWord(status)}
    </span>
  )
}
