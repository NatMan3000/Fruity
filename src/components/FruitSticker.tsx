import { useState, type CSSProperties } from 'react'
import clsx from 'clsx'
import type { Fruit } from '../types/fruit'
import { stickerUrl } from '../utils/images'
import { tiltOf } from '../utils/tones'

// The one way a fruit's picture is shown (DESIGN.md "Fruit art"): a die-cut sticker with a white edge,
// sitting INSIDE whatever holds it. New art comes with its edge baked in; a fruit without art shows its
// emoji with the same edge traced round it. Only one of the two is ever drawn, so nothing doubles up.
interface FruitStickerProps {
  fruit: Fruit
  size: number
  tilt?: number | false // degrees; default the fruit's own steady angle, false for none
  slap?: boolean        // slaps down with an overshoot as it appears
  delay?: number        // ms, for the slap
  eager?: boolean
  className?: string
  style?: CSSProperties
}

export function FruitSticker({ fruit, size, tilt, slap = false, delay = 0, eager = false, className, style }: FruitStickerProps) {
  const src = stickerUrl(fruit, size > 128 ? 'lg' : 'sm')
  const [failed, setFailed] = useState(false)
  const angle = tilt === false ? 0 : (tilt ?? tiltOf(fruit.id))
  return (
    <span
      aria-hidden="true"
      className={clsx('pointer-events-none relative inline-flex shrink-0 items-center justify-center select-none', slap && 'slap', className)}
      style={{ width: size, height: size, '--tilt': `${angle}deg`, '--delay': `${delay}ms`, transform: 'rotate(var(--tilt))', ...style } as CSSProperties}
    >
      {src && !failed ? (
        <img
          src={src}
          alt=""
          width={size}
          height={size}
          decoding="async"
          loading={eager ? 'eager' : 'lazy'}
          draggable={false}
          onError={() => setFailed(true)}
          className="sticker-art size-full object-contain"
        />
      ) : (
        <span className={size >= 72 ? 'sticker-emoji' : 'sticker-emoji-sm'} style={{ fontSize: Math.round(size * 0.72), lineHeight: 1 }}>
          {fruit.emoji}
        </span>
      )}
    </span>
  )
}
