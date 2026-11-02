// Writes /tmp/fruity-contact-sheet.png: every grid image, labelled by id.
import sharp from 'sharp'
import { readdirSync } from 'node:fs'
import { join } from 'node:path'

const DIR = 'public/images/fruits'
const files = readdirSync(DIR).filter(f => f.endsWith('-480.webp')).sort()
const COLS = 6, W = 320, H = 240, LABEL = 28
const rows = Math.ceil(files.length / COLS)

const composites = []
for (const [i, f] of files.entries()) {
  const x = (i % COLS) * W, y = Math.floor(i / COLS) * (H + LABEL)
  const id = f.replace('-480.webp', '')
  composites.push({ input: await sharp(join(DIR, f)).resize(W, H).toBuffer(), left: x, top: y })
  const svg = `<svg width="${W}" height="${LABEL}" xmlns="http://www.w3.org/2000/svg"><text x="8" y="20" font-family="Helvetica" font-size="16" fill="#222">${id}</text></svg>`
  composites.push({ input: Buffer.from(svg), left: x, top: y + H })
}
await sharp({ create: { width: COLS * W, height: rows * (H + LABEL), channels: 3, background: '#fff' } })
  .composite(composites).png().toFile('/tmp/fruity-contact-sheet.png')
console.log(`wrote /tmp/fruity-contact-sheet.png (${files.length} images)`)
