// Fails the build on bad fruit data. Run: bun run validate
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { FRUITS } from '../src/assets/fruits'
import { MONTHS } from '../src/types/fruit'

const RECIPE_TYPES = ['smoothie', 'dessert', 'salad', 'preserve', 'snack', 'breakfast']

type Loose = Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any

export function validateFruits(
  fruits: readonly unknown[],
  imageExists: (relPath: string) => boolean,
): string[] {
  const errors: string[] = []
  const seen = new Set<string>()

  for (const [i, raw] of fruits.entries()) {
    const f = raw as Loose
    const id = typeof f?.id === 'string' && f.id ? f.id : `#${i}`
    const err = (msg: string) => errors.push(`${id}: ${msg}`)

    if (typeof f?.id !== 'string' || !f.id) err('missing id')
    else if (seen.has(f.id)) err('duplicate id')
    else seen.add(f.id)

    const peak: unknown = f?.seasonality?.peak
    const available: unknown = f?.seasonality?.available
    if (!Array.isArray(peak) || !Array.isArray(available)) {
      err('seasonality.peak and seasonality.available must be arrays')
    } else {
      for (const m of [...peak, ...available]) {
        if (!MONTHS.includes(m as never)) err(`unknown month "${String(m)}"`)
      }
      for (const m of peak) {
        if (available.includes(m)) err(`month ${String(m)} is in both peak and available`)
      }
      if (peak.length === 0 && available.length === 0) err('no peak or available months')
    }

    if (typeof f?.image !== 'string' || !f.image) {
      err('missing image field')
    } else {
      for (const size of [480, 960]) {
        const rel = `public/${f.image.replace(/^\//, '')}-${size}.webp`
        if (!imageExists(rel)) err(`missing image file ${rel}`)
      }
    }

    if (f?.pairings !== undefined &&
      !(Array.isArray(f.pairings) && f.pairings.every((p: unknown) => typeof p === 'string'))) {
      err('pairings must be an array of strings')
    }
    if (f?.recipes !== undefined) {
      if (!Array.isArray(f.recipes)) err('recipes must be an array')
      else {
        for (const [j, r] of f.recipes.entries()) {
          if (typeof r?.name !== 'string' || typeof r?.description !== 'string' || !RECIPE_TYPES.includes(r?.type)) {
            err(`recipes[${j}] needs string name, string description and a valid type`)
          }
        }
      }
    }
  }
  return errors
}

if (import.meta.main) {
  const root = join(import.meta.dir, '..')
  const errors = validateFruits(FRUITS, rel => existsSync(join(root, rel)))
  console.log(`validate-data: ${FRUITS.length} fruits`)
  if (errors.length) {
    for (const e of errors) console.error(`  ERROR ${e}`)
    process.exit(1)
  }
  console.log('validate-data: ok')
}
