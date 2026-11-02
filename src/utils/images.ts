import type { Fruit } from '../types/fruit'
import artManifest from '../assets/art-manifest.json'

// Ids with new generated art (written by scripts/build-images.ts). Every one of them also has a die-cut
// sticker with a white edge (scripts/build-stickers.ts): <id>-sticker.webp (640px) and
// <id>-sticker-sm.webp (256px), transparent, square. Fruit without art show their emoji as a sticker.
const withArt = new Set<string>(artManifest)
export const hasArt = (fruit: Fruit) => withArt.has(fruit.id)

export function stickerUrl(fruit: Fruit, size: 'sm' | 'lg'): string | undefined {
  if (!withArt.has(fruit.id)) return undefined
  return `${import.meta.env.BASE_URL}images/fruits/${fruit.id}-sticker${size === 'sm' ? '-sm' : ''}.webp`
}
