// App icons, drawn here as SVG and rendered to PNG with sharp. Run: bun run icons
//
// iOS uses apple-touch-icon.png (180, opaque, square: iOS rounds the corners itself). The web
// manifest lists PNGs only (iOS cannot use an SVG home-screen icon): 192 and 512 for `any`, and a
// 512 `maskable` with the apple inside the central 80% safe zone so Android's mask never clips it.
// favicon.svg is the browser-tab icon only. DESIGN.md "App icon".
import sharp from 'sharp'

const BG = '#22B04F'     // bright juicy green, the peak green family
const APPLE = '#E5233B'  // red apple
const SHADE = '#B8172D'  // the apple's shadow side
const LEAF = '#C4F27A'   // light lime, so the leaf reads against the green
const STEM = '#5A3418'
const SHINE = '#FFF4E8'

// The apple, drawn on a 512 canvas centred near (256, 258), about 65% of the width.
const apple = `
  <path d="M256 170 C 220 138, 128 140, 108 232 C 90 312, 140 412, 200 422 C 226 426, 240 412, 256 412 C 272 412, 286 426, 312 422 C 372 412, 422 312, 404 232 C 384 140, 292 138, 256 170 Z" fill="${APPLE}"/>
  <path d="M404 232 C 422 312, 372 412, 312 422 C 286 426, 272 412, 256 412 C 300 392, 352 330, 360 250 C 364 210, 352 178, 330 160 C 368 166, 396 192, 404 232 Z" fill="${SHADE}"/>
  <path d="M256 172 C 254 140, 246 118, 236 100" stroke="${STEM}" stroke-width="18" stroke-linecap="round" fill="none"/>
  <path d="M264 150 C 270 104, 318 80, 368 90 C 358 138, 310 164, 264 150 Z" fill="${LEAF}"/>
  <ellipse cx="170" cy="250" rx="20" ry="42" transform="rotate(-24 170 250)" fill="${SHINE}" opacity="0.9"/>`

// scale < 1 shrinks the apple about the centre (maskable safe zone).
function svg({ scale = 1, radius = 0 }: { scale?: number; radius?: number }) {
  const t = (1 - scale) * 256
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="${radius}" fill="${BG}"/>
  <g transform="translate(${t} ${t}) scale(${scale})">${apple}
  </g>
</svg>
`
}

const square = svg({})                       // full bleed: apple-touch-icon, `any` icons
const maskable = svg({ scale: 0.8 })         // apple inside the 80% safe circle
const favicon = svg({ radius: 112 })         // rounded tile for the browser tab

await Bun.write('public/icons/favicon.svg', favicon)
console.log('wrote public/icons/favicon.svg')

const targets: [string, string, number][] = [
  ['apple-touch-icon.png', square, 180],
  ['icon-192.png', square, 192],
  ['icon-512.png', square, 512],
  ['icon-maskable-512.png', maskable, 512],
]
for (const [name, source, size] of targets) {
  // Opaque PNGs: iOS renders transparent corners black
  await sharp(Buffer.from(source), { density: 384 })
    .resize(size, size)
    .flatten({ background: BG })
    .png()
    .toFile(`public/icons/${name}`)
  console.log(`wrote public/icons/${name} (${size}px)`)
}
