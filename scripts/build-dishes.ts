// Recipe dish photos (the finished plate, one per recipe): imports <recipe-id>.png from the generated set as
// images-src/dishes/<id>.jpg (scripts/originals.ts: JPEG q85 at native size, re-imported only when the
// PNG's bytes change), then writes public/images/dishes/<id>-720.webp (cards and thumbnails, precached)
// and <id>-1200.webp (the recipe page hero, runtime-cached), both 4:3 cover crops, rebuilt when their
// original is newer. Only recipe ids are taken; a recipe without a photo fails here and in `bun run validate`.
// Without the source folder (another machine) it builds from the committed originals.
// Generated files are committed; deploy does not run this.
// Run: bun scripts/build-dishes.ts [sourceDir] [--force]   (part of `bun run art`; default ~/.cache/kai-tmp/fruity-dishes)
import sharp from 'sharp'
import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { RECIPES } from '../src/assets/recipes'
import { importOriginal, readSources, writeSources } from './originals'

const args = process.argv.slice(2)
const force = args.includes('--force')
const SRC = args.find(a => !a.startsWith('--')) ?? join(homedir(), '.cache/kai-tmp/fruity-dishes')
const ORIG = 'images-src/dishes'
const OUT = 'public/images/dishes'
// Cards are drawn up to about 360 CSS px wide, so 720 keeps them sharp on 2x and close on 3x screens.
const SIZES = [{ w: 720, quality: 72 }, { w: 1200, quality: 78 }] as const

mkdirSync(ORIG, { recursive: true })
mkdirSync(OUT, { recursive: true })
const haveSrc = existsSync(SRC)
if (!haveSrc) console.warn(`dishes: source folder not found (${SRC}), building from ${ORIG}`)

const fresh = (src: string, out: string) => existsSync(out) && statSync(out).mtimeMs >= statSync(src).mtimeMs

const sources = readSources(ORIG)
let imported = 0, built = 0, unchanged = 0
const missing: string[] = []
const ids = new Set(RECIPES.map(r => r.id))
for (const id of ids) {
  const from = join(SRC, `${id}.png`)
  const orig = join(ORIG, `${id}.jpg`)
  if (haveSrc && existsSync(from) && await importOriginal(from, orig, id, sources) === 'imported') imported++
  if (!existsSync(orig)) { missing.push(id); continue }
  const outs = SIZES.map(({ w }) => join(OUT, `${id}-${w}.webp`))
  if (!force && outs.every(o => fresh(orig, o))) { unchanged++; continue }
  for (const [i, { w, quality }] of SIZES.entries()) {
    await sharp(orig).resize(w, Math.round((w * 3) / 4), { fit: 'cover', position: 'centre' })
      .webp({ quality }).toFile(outs[i])
  }
  built++
}
writeSources(ORIG, sources)

// Anything left over from a renamed recipe or an old card size
const wanted = new Set([...ids].flatMap(id => SIZES.map(({ w }) => `${id}-${w}.webp`)))
const stale = readdirSync(OUT).filter(f => f.endsWith('.webp') && !wanted.has(f))
if (stale.length) console.warn(`dishes: ${stale.length} stale file(s) in ${OUT} (remove them): ${stale.join(', ')}`)

console.log(`dishes: ${imported} imported, ${built} built, ${unchanged} unchanged${missing.length ? `, MISSING ${missing.length}: ${missing.join(', ')}` : ''}`)
if (missing.length) process.exit(1)
