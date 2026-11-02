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

// The whole generated studio picture (cream background), 720 px square, shown inside a fruit page's
// "More about it". Lazy-loaded and runtime-cached, not precached; offline the page falls back to the sticker.
export const photoUrl = (fruit: Fruit) => `${import.meta.env.BASE_URL}images/fruits/${fruit.id}-photo-720.webp`

// The finished dish for every recipe (scripts/build-dishes.ts; the validator fails the build without
// them): <id>-720.webp for cards and thumbnails (precached, so they work offline), <id>-1200.webp for the
// recipe page hero (cached the first time it is opened). Both 4:3.
export type DishSize = 720 | 1200
export const dishUrl = (recipeId: string, size: DishSize) => `${import.meta.env.BASE_URL}images/dishes/${recipeId}-${size}.webp`
