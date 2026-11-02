import { useState } from 'react'
import clsx from 'clsx'
import type { Fruit } from '../types/fruit'
import { fruitTints } from '../utils/colour'
import { fruitIconUrl } from '../utils/images'

// The one way a fruit is shown small (DESIGN.md "Fruit art"): the round art icon when the
// fruit has new art, otherwise its emoji, both on a circle washed in the fruit's own colour.
// The art's cream backdrop is multiplied onto the wash, so it takes the fruit's colour too.
// The emoji also sits under the art while it loads.
const SIZES = { sm: 32, md: 44, row: 48, lg: 56, xl: 96, '2xl': 144 } as const
export type FruitIconSize = keyof typeof SIZES

interface FruitIconProps {
  fruit: Fruit
  size?: FruitIconSize
  morph?: boolean // marks this icon as the one the detail hero morphs back into
  className?: string
}

export function FruitIcon({ fruit, size = 'md', morph = false, className }: FruitIconProps) {
  const src = fruitIconUrl(fruit)
  const [failed, setFailed] = useState(false)
  const px = SIZES[size]
  return (
    <span
      aria-hidden="true"
      data-morph={morph ? fruit.id : undefined}
      className={clsx('relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full select-none', className)}
      style={{ width: px, height: px, backgroundColor: fruitTints(fruit.colour).wash }}
    >
      <span style={{ fontSize: Math.round(px * 0.52), lineHeight: 1 }}>{fruit.emoji}</span>
      {src && !failed && (
        <img
          src={src}
          alt=""
          width={px}
          height={px}
          decoding="async"
          draggable={false}
          onError={() => setFailed(true)}
          className="absolute inset-0 size-full object-cover mix-blend-multiply"
        />
      )}
    </span>
  )
}
