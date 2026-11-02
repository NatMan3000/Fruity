import type { Fruit } from '../types/fruit'
import artManifest from '../assets/art-manifest.json'

export type ImageSize = 480 | 960

// Ids with new generated art (written by scripts/build-images.ts).
const withArt = new Set<string>(artManifest)

// `fruit.image` is a stem such as 'images/fruits/mango'; the build script writes <stem>-480.webp and <stem>-960.webp.
export function fruitImageUrl(fruit: Fruit, size: ImageSize): string | undefined {
  if (!fruit.image) return undefined
  return `${import.meta.env.BASE_URL}${fruit.image.replace(/^\//, '')}-${size}.webp`
}

// The round icon (160px square webp), only for fruits with new art; otherwise FruitIcon shows the emoji.
export function fruitIconUrl(fruit: Fruit): string | undefined {
  if (!fruit.image || !withArt.has(fruit.id)) return undefined
  return `${import.meta.env.BASE_URL}${fruit.image.replace(/^\//, '')}-icon.webp`
}
