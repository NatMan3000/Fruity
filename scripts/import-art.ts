// Imports generated fruit art (<id>.png in the source folder) as images-src/fruits/<id>-art.jpg for known
// fruit ids (scripts/originals.ts: JPEG q85, re-imported only when the PNG's bytes change).
// Run: bun run art:import [sourceDir]   (default ~/.cache/kai-tmp/fruity-art)
// Then: bun run images && bun run stickers   (`bun run art` does all of it)
import { existsSync, readdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { FRUITS } from '../src/assets/fruits'
import { importOriginal, readSources, writeSources } from './originals'

const SRC = process.argv[2] ?? join(homedir(), '.cache/kai-tmp/fruity-art')
const DEST = 'images-src/fruits'

if (!existsSync(SRC)) {
  console.error(`art:import: source folder not found: ${SRC}`)
  process.exit(1)
}

const known = new Set(FRUITS.map(f => f.id))
const sources = readSources(DEST)
let imported = 0, unchanged = 0
const unknown: string[] = []

for (const file of readdirSync(SRC).sort()) {
  if (!file.endsWith('.png') || file.includes('sheet')) continue
  const id = file.slice(0, -'.png'.length)
  if (!known.has(id)) { unknown.push(id); continue }
  if (await importOriginal(join(SRC, file), join(DEST, `${id}-art.jpg`), id, sources) === 'unchanged') { unchanged++; continue }
  imported++
  console.log(`imported ${id}`)
}
writeSources(DEST, sources)

console.log(`art:import: ${imported} imported, ${unchanged} unchanged${unknown.length ? `, ignored unknown ids: ${unknown.join(', ')}` : ''}`)
