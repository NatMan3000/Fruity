// Reads originals from images-src/fruits and writes 480 (grid) and 960 (detail) WebP files
// to public/images/fruits. Generated files are committed; deploy does not run this.
import sharp from 'sharp'
import { readdirSync, mkdirSync } from 'node:fs'
import { join, basename } from 'node:path'

const SRC = 'images-src/fruits'
const OUT = 'public/images/fruits'
const SIZES = [480, 960] as const
const QUALITY = 75

mkdirSync(OUT, { recursive: true })
const files = readdirSync(SRC).filter(f => /\.(jpe?g|png|webp)$/i.test(f))

for (const file of files) {
  const id = basename(file).replace(/\.[^.]+$/, '')
  for (const w of SIZES) {
    // 4:3 cover crop
    await sharp(join(SRC, file))
      .rotate()
      .resize(w, Math.round((w * 3) / 4), { fit: 'cover', position: 'attention' })
      .webp({ quality: QUALITY })
      .toFile(join(OUT, `${id}-${w}.webp`))
  }
  console.log(`ok ${id}`)
}
console.log(`${files.length} images built`)
