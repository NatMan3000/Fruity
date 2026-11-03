// Gate for DESIGN.md "3D" rule 1: where a 3D fruit or dish is coming, its place waits EMPTY until the
// scene's first frame, never the fruit's photo or sticker first and then the 3D. It happened three times
// (the fruit page, the Now dish, the welcome; Nathan, 3 Nov 2026: "I'm not sure why this is not some sort
// of standard thing to keep an eye out for"), so a source scan now fails the build's tests when a file that
// renders a lazy 3D scene:
//   1. gives a <Suspense> a fallback other than {null}, or
//   2. renders a <FruitSticker> or <img> outside a `const poster` (the no-WebGL / scene-failed still) and
//      not under a `!three` / `!webgl` / `failed3d` condition.
// A deliberate exception carries a `3d-fallback-ok: <why>` comment on the line or the line above.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'

const ROOT = join(__dirname, '..')

function tsxFiles(dir: string): string[] {
  return readdirSync(dir).flatMap(name => {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) return tsxFiles(p)
    return p.endsWith('.tsx') && !p.endsWith('.test.tsx') ? [p] : []
  })
}

// Files that render a lazy 3D scene: a <Suspense> plus a three.js scene import.
const heroFiles = () => tsxFiles(join(ROOT, 'src')).filter(f => {
  const s = readFileSync(f, 'utf8')
  return s.includes('<Suspense') && /heroScenes|three\//.test(s)
})

const WAIVER = /3d-fallback-ok:/
const GUARD = /!three|!webgl|failed3d/

export function findings(file: string, src: string): string[] {
  const lines = src.split('\n')
  const out: string[] = []
  const waived = (i: number) => WAIVER.test(lines[i]) || (i > 0 && WAIVER.test(lines[i - 1]))
  let posterDepth = -1 // inside `const poster = (`...`)` while >= 0
  lines.forEach((line, i) => {
    if (/const poster\b/.test(line)) posterDepth = 0
    const inPoster = posterDepth >= 0
    if (inPoster) {
      posterDepth += (line.match(/\(/g) ?? []).length - (line.match(/\)/g) ?? []).length
      if (posterDepth <= 0 && !/const poster\b.*\($/.test(line)) posterDepth = -1
    }
    const fallback = line.match(/<Suspense fallback=\{(.*?)\}>/)
    if (fallback && fallback[1] !== 'null' && !waived(i)) out.push(`${file}:${i + 1} Suspense fallback is not {null}`)
    if (/<FruitSticker\b|<img\b/.test(line) && !inPoster && !waived(i)) {
      const guarded = lines.slice(Math.max(0, i - 3), i + 1).some(l => GUARD.test(l))
      if (!guarded) out.push(`${file}:${i + 1} sticker or photo shown where a 3D scene is coming`)
    }
  })
  return out
}

describe('no photo before the 3D (DESIGN.md "3D" rule 1)', () => {
  it('finds the hero files', () => {
    expect(heroFiles().length).toBeGreaterThanOrEqual(3)
  })

  it('every 3D hero waits empty for its scene', () => {
    const all = heroFiles().flatMap(f => findings(relative(ROOT, f), readFileSync(f, 'utf8')))
    expect(all).toEqual([])
  })

  it('catches the regressions it exists for', () => {
    const suspense = `const S = lazy(() => import('../three/X'))\nreturn <Suspense fallback={poster}><S /></Suspense>`
    expect(findings('a.tsx', suspense)).toHaveLength(1)
    const sticker = `<span>\n  <FruitSticker fruit={lead} size={90} />\n</span>`
    expect(findings('b.tsx', sticker)).toHaveLength(1)
    const ok = `const poster = (\n  <div>\n    <FruitSticker fruit={f} size={9} />\n  </div>\n)\n{(!three || failed3d) && (\n  <FruitSticker fruit={f} size={9} />\n)}`
    expect(findings('c.tsx', ok)).toEqual([])
  })
})
