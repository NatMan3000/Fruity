// Reads the fruit art originals (images-src/fruits/<id>-art.jpg, imported by scripts/import-art.ts) and
// writes public/images/fruits/<id>-photo-720.webp: the whole studio picture on its cream background,
// 720x720, for the fruit page's "More about it". Also writes src/assets/art-manifest.json, the ids with
// art (FruitSticker draws those as stickers; scripts/build-stickers.ts reads the same list).
// Generated files are committed; deploy does not run this.
import sharp from 'sharp'
import { readdirSync, mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const SRC = 'images-src/fruits'
const OUT = 'public/images/fruits'
const MANIFEST = 'src/assets/art-manifest.json'
const PHOTO = 720
const QUALITY = 75

mkdirSync(OUT, { recursive: true })

const withArt: string[] = []
for (const file of readdirSync(SRC).sort()) {
  const art = /^(.+)-art\.jpg$/.exec(file)
  if (!art) continue
  const id = art[1]
  // Square as generated; a non-square source is centre-cropped
  await sharp(join(SRC, file)).resize(PHOTO, PHOTO, { fit: 'cover', position: 'centre' })
    .webp({ quality: QUALITY }).toFile(join(OUT, `${id}-photo-${PHOTO}.webp`))
  withArt.push(id)
}

const manifest = JSON.stringify(withArt, null, 2) + '\n'
if (!existsSync(MANIFEST) || readFileSync(MANIFEST, 'utf8') !== manifest) writeFileSync(MANIFEST, manifest)
console.log(`images: ${withArt.length} studio photos built (${MANIFEST})`)
