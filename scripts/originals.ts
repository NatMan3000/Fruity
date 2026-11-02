// Generated art arrives as big PNGs in ~/.cache/kai-tmp (fruity-art, fruity-dishes). The repo keeps each
// original as a JPEG (quality 85, native size) in images-src/<kind>/, and every build reads those.
// images-src/<kind>/sources.json records the SHA-256 of the PNG each JPEG came from, so a regenerated PNG
// (any change to its bytes, whatever its mtime) is re-imported, and the new JPEG's mtime then makes the
// stickers and webps built from it rebuild. An unchanged PNG leaves its JPEG, and everything after it, alone.
import sharp from 'sharp'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

export const ORIGINAL_QUALITY = 85

type Sources = Record<string, string>

export function readSources(dir: string): Sources {
  const path = join(dir, 'sources.json')
  return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) as Sources : {}
}

export function writeSources(dir: string, sources: Sources) {
  const sorted = Object.fromEntries(Object.entries(sources).sort(([a], [b]) => a.localeCompare(b)))
  writeFileSync(join(dir, 'sources.json'), JSON.stringify(sorted, null, 2) + '\n')
}

// Writes `dest` (a .jpg) from the PNG at `src` unless it already came from these exact bytes.
export async function importOriginal(src: string, dest: string, id: string, sources: Sources): Promise<'imported' | 'unchanged'> {
  const hash = createHash('sha256').update(readFileSync(src)).digest('hex')
  if (existsSync(dest) && sources[id] === hash) return 'unchanged'
  await sharp(src).flatten({ background: '#ffffff' }).jpeg({ quality: ORIGINAL_QUALITY, mozjpeg: true }).toFile(dest)
  sources[id] = hash
  return 'imported'
}
