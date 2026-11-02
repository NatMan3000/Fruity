// Reads originals from images-src/fruits and writes WebP files to public/images/fruits:
//   <id>-480.webp (grid) and <id>-960.webp (detail), 4:3, for every fruit;
//   <id>-icon.webp (160x160, square, centred on the fruit) for fruits with new art (<id>.png).
// A <id>.png (generated studio art) wins over <id>.jpg/.webp (the old photo, kept as the fallback).
// Also writes src/assets/art-manifest.json: the ids that have new art and an icon.
// Generated files are committed; deploy does not run this.
import sharp from 'sharp'
import { readdirSync, mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const SRC = 'images-src/fruits'
const OUT = 'public/images/fruits'
const MANIFEST = 'src/assets/art-manifest.json'
const SIZES = [480, 960] as const
const ICON = 160
const QUALITY = 75

mkdirSync(OUT, { recursive: true })

// One source per id, preferring the new art.
const sources = new Map<string, string>()
for (const file of readdirSync(SRC).sort()) {
  const m = /^(.+)\.(png|jpe?g|webp)$/i.exec(file)
  if (!m) continue
  const [, id, ext] = m
  if (ext.toLowerCase() === 'png' || !sources.has(id)) sources.set(id, file)
}

interface Box { left: number; top: number; width: number; height: number }

// Bounding box of the fruit: trim the flat studio background (sampled from the top-left pixel).
async function subjectBox(path: string, width: number, height: number): Promise<Box> {
  const { info } = await sharp(path).trim({ threshold: 24 }).toBuffer({ resolveWithObject: true })
  const left = -(info.trimOffsetLeft ?? 0), top = -(info.trimOffsetTop ?? 0)
  if (info.width < width * 0.1 || info.height < height * 0.1) return { left: 0, top: 0, width, height }
  return { left, top, width: info.width, height: info.height }
}

// A w x h crop centred on the box centre, kept inside the image.
function cropAround(box: Box, w: number, h: number, imgW: number, imgH: number) {
  const cx = box.left + box.width / 2, cy = box.top + box.height / 2
  const left = Math.round(Math.min(Math.max(cx - w / 2, 0), imgW - w))
  const top = Math.round(Math.min(Math.max(cy - h / 2, 0), imgH - h))
  return { left, top, width: Math.round(w), height: Math.round(h) }
}

const withArt: string[] = []

for (const [id, file] of [...sources].sort(([a], [b]) => a.localeCompare(b))) {
  const path = join(SRC, file)
  const isArt = file.toLowerCase().endsWith('.png')

  if (isArt) {
    const { width = 0, height = 0 } = await sharp(path).metadata()
    const box = await subjectBox(path, width, height)

    // 4:3 crop at full width (or full height for a wide source), centred on the fruit.
    const cw = Math.min(width, (height * 4) / 3), ch = (cw * 3) / 4
    const wide = cropAround(box, cw, ch, width, height)
    for (const w of SIZES) {
      await sharp(path).extract(wide).resize(w, Math.round((w * 3) / 4)).webp({ quality: QUALITY })
        .toFile(join(OUT, `${id}-${w}.webp`))
    }

    // Square icon: the fruit's box plus a little air, at least 60% of the short side so small fruit is not blown up.
    const side = Math.min(Math.max(Math.max(box.width, box.height) * 1.08, Math.min(width, height) * 0.6), width, height)
    await sharp(path).extract(cropAround(box, side, side, width, height)).resize(ICON, ICON)
      .webp({ quality: 80 }).toFile(join(OUT, `${id}-icon.webp`))
    withArt.push(id)
  } else {
    for (const w of SIZES) {
      // 4:3 cover crop
      await sharp(path)
        .rotate()
        .resize(w, Math.round((w * 3) / 4), { fit: 'cover', position: 'attention' })
        .webp({ quality: QUALITY })
        .toFile(join(OUT, `${id}-${w}.webp`))
    }
  }
  console.log(`ok ${id}${isArt ? ' (art + icon)' : ''}`)
}

const manifest = JSON.stringify(withArt, null, 2) + '\n'
if (!existsSync(MANIFEST) || readFileSync(MANIFEST, 'utf8') !== manifest) writeFileSync(MANIFEST, manifest)
console.log(`${sources.size} images built, ${withArt.length} with new art (${MANIFEST})`)
