import type { Fruit } from '../types/fruit'

export type ImageSize = 480 | 960

// `fruit.image` is a stem such as 'images/fruits/mango'; the build script writes <stem>-480.webp and <stem>-960.webp.
export function fruitImageUrl(fruit: Fruit, size: ImageSize): string | undefined {
  if (!fruit.image) return undefined
  return `${import.meta.env.BASE_URL}${fruit.image.replace(/^\//, '')}-${size}.webp`
}
