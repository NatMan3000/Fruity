import type { Fruit } from '../types/fruit'
import { FruitSticker } from './FruitSticker'

// The Fruit Salad Cafe's name for a small fruit picture. It is the app's sticker, so the cafe's
// shelf, bowl and sticker book show the same die-cut fruit as everywhere else.
const SIZES = { sm: 32, md: 44, row: 48, lg: 56, xl: 96, '2xl': 144 } as const
export type FruitIconSize = keyof typeof SIZES

export function FruitIcon({ fruit, size = 'md', className }: { fruit: Fruit; size?: FruitIconSize; className?: string }) {
  return <FruitSticker fruit={fruit} size={SIZES[size]} tilt={false} className={className} />
}
