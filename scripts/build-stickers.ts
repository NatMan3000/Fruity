// Die-cut stickers for every fruit with new art (DESIGN.md "Fruit art"): lifts the fruit off its cream
// studio backdrop (images-src/fruits/<id>-art.jpg) and bakes a white sticker edge round it. Writes public/images/fruits/<id>-sticker.webp
// (640px, the fruit page) and <id>-sticker-sm.webp (256px, rows, rails, the bag), square and transparent.
// The cut-out matte comes from Apple Vision's "lift subject" (scripts/subject-mask.swift, macOS only),
// compiled once into ~/.cache/kai-tmp. Generated files are committed; deploy does not run this.
// Run: bun run stickers [--force]   (part of `bun run art`)
import sharp from 'sharp'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import { join } from 'node:path'

const SRC = 'images-src/fruits'
const OUT = 'public/images/fruits'
const SIZE = 1024
const LARGE = 640
const SMALL = 256
const BORDER = 28 // white sticker edge, px at 1024
const PAD = 48
const force = process.argv.includes('--force')

const ids: string[] = JSON.parse(readFileSync('src/assets/art-manifest.json', 'utf8'))

const BIN_DIR = join(homedir(), '.cache', 'kai-tmp', 'fruity-sticker')
const BIN = join(BIN_DIR, 'subject-mask')
const SWIFT = 'scripts/subject-mask.swift'
if (!existsSync(BIN) || statSync(BIN).mtimeMs < statSync(SWIFT).mtimeMs) {
  mkdirSync(BIN_DIR, { recursive: true })
  execFileSync('swiftc', ['-O', SWIFT, '-o', BIN], { stdio: 'inherit' })
}
mkdirSync(OUT, { recursive: true })

const fresh = (src: string, out: string) => existsSync(out) && statSync(out).mtimeMs >= statSync(src).mtimeMs

async function sticker(id: string) {
  const src = join(SRC, `${id}-art.jpg`)
  const large = join(OUT, `${id}-sticker.webp`), small = join(OUT, `${id}-sticker-sm.webp`)
  if (!force && fresh(src, large) && fresh(src, small)) return 'unchanged'
  const maskPath = join(tmpdir(), `fruity-mask-${id}.png`)
  execFileSync(BIN, [src, maskPath])

  // A padded canvas, so fruit that touch the frame still get a full edge.
  const P = SIZE + PAD * 2
  const pad = { top: PAD, bottom: PAD, left: PAD, right: PAD }
  const rgb = await sharp(src).resize(SIZE, SIZE).removeAlpha().extend({ ...pad, extendWith: 'copy' }).raw().toBuffer()
  const mask = await sharp(maskPath).resize(SIZE, SIZE).extractChannel(0)
    .extend({ ...pad, background: { r: 0, g: 0, b: 0 } }).extractChannel(0).raw().toBuffer()
  // The edge: grow the mask (blur, then a hard threshold here, since sharp thresholds before it blurs
  // whatever the call order), then soften the cut a touch.
  const rawP = { raw: { width: P, height: P, channels: 1 as const } }
  const blurred = await sharp(mask, rawP).blur(BORDER / 2).extractChannel(0).raw().toBuffer()
  const grown = Buffer.alloc(P * P)
  for (let i = 0; i < P * P; i++) grown[i] = blurred[i] > 10 ? 255 : 0
  const outline = await sharp(grown, rawP).blur(1.1).extractChannel(0).raw().toBuffer()

  const n = P * P
  const rgba = Buffer.alloc(n * 4)
  for (let i = 0; i < n; i++) {
    const a = mask[i] / 255
    // Fruit over white sticker paper; the sticker's alpha is the edge's.
    for (let k = 0; k < 3; k++) rgba[i * 4 + k] = Math.round(rgb[i * 3 + k] * a + 255 * (1 - a))
    rgba[i * 4 + 3] = Math.max(outline[i], mask[i])
  }

  // Crop to the sticker's alpha bounds, then square it so every sticker fills its box the same way.
  let x0 = P, y0 = P, x1 = 0, y1 = 0
  for (let y = 0; y < P; y++) for (let x = 0; x < P; x++) {
    if (rgba[(y * P + x) * 4 + 3] > 8) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y }
  }
  if (x1 <= x0 || y1 <= y0) throw new Error(`${id}: the subject mask is empty`)
  const w = x1 - x0 + 1, h = y1 - y0 + 1
  const side = Math.max(w, h)
  const square = await sharp(rgba, { raw: { width: P, height: P, channels: 4 } })
    .extract({ left: x0, top: y0, width: w, height: h })
    .extend({
      top: Math.floor((side - h) / 2), bottom: Math.ceil((side - h) / 2),
      left: Math.floor((side - w) / 2), right: Math.ceil((side - w) / 2),
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer()
  await sharp(square).resize(LARGE, LARGE).webp({ quality: 82, alphaQuality: 90 }).toFile(large)
  await sharp(square).resize(SMALL, SMALL).webp({ quality: 80, alphaQuality: 90 }).toFile(small)
  return 'built'
}

let built = 0, unchanged = 0
const failed: string[] = []
for (const id of ids) {
  try {
    const r = await sticker(id)
    if (r === 'built') { built++; console.log(`sticker ${id}`) } else unchanged++
  } catch (err) {
    failed.push(id)
    console.error(`sticker ${id} FAILED:`, err instanceof Error ? err.message : err)
  }
}
console.log(`stickers: ${built} built, ${unchanged} unchanged${failed.length ? `, ${failed.length} failed (${failed.join(', ')})` : ''}`)
if (failed.length) process.exit(1)
