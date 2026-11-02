// PNG icons from public/icons/icon-512.svg: apple-touch-icon (180) and manifest 192/512.
import sharp from 'sharp'

const SRC = 'public/icons/icon-512.svg'
const targets: [string, number][] = [
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
]
for (const [name, size] of targets) {
  // iOS masks the touch icon itself: fill the corners so they do not render black
  const img = sharp(SRC, { density: 384 }).resize(size, size)
  await (name.startsWith('apple') ? img.flatten({ background: '#10b981' }) : img).png().toFile(`public/icons/${name}`)
  console.log(`wrote public/icons/${name}`)
}
