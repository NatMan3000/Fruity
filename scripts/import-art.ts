// Copies generated fruit art (<id>.png) into images-src/fruits for known fruit ids.
// Run: bun run art:import [sourceDir]   (default ~/.cache/kai-tmp/fruity-art)
// Then: bun run images   (rebuilds the webp files and src/assets/art-manifest.json)
import { copyFileSync, existsSync, readdirSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { FRUITS } from '../src/assets/fruits'

const SRC = process.argv[2] ?? join(homedir(), '.cache/kai-tmp/fruity-art')
const DEST = 'images-src/fruits'

if (!existsSync(SRC)) {
  console.error(`art:import: source folder not found: ${SRC}`)
  process.exit(1)
}

const known = new Set(FRUITS.map(f => f.id))
let copied = 0, unchanged = 0
const unknown: string[] = []

for (const file of readdirSync(SRC).sort()) {
  if (!file.endsWith('.png') || file.includes('sheet')) continue
  const id = file.slice(0, -'.png'.length)
  if (!known.has(id)) { unknown.push(id); continue }
  const from = join(SRC, file)
  const to = join(DEST, `${id}.png`)
  if (existsSync(to) && readFileSync(to).equals(readFileSync(from))) { unchanged++; continue }
  copyFileSync(from, to)
  copied++
  console.log(`copied ${id}`)
}

console.log(`art:import: ${copied} copied, ${unchanged} unchanged${unknown.length ? `, ignored unknown ids: ${unknown.join(', ')}` : ''}`)
if (copied) console.log('next: bun run images')
