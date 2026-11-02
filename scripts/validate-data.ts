// Fails the build on bad fruit data. Run: bun run validate
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { FRUITS } from '../src/assets/fruits'
import { RECIPES } from '../src/assets/recipes'
import { AUS_STATES, MONTHS } from '../src/types/fruit'
import { RECIPE_TYPES } from '../src/types/recipe'

const IDEA_TYPES = ['smoothie', 'dessert', 'salad', 'preserve', 'snack', 'breakfast'] // fruits.ts quick ideas

type Loose = Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any

const MAX_AGE_MONTHS = 18

function monthsOld(iso: string, now: Date): number {
  const d = new Date(iso)
  return (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth()) +
    (now.getDate() < d.getDate() ? -1 : 0)
}

export function validateFruits(
  fruits: readonly unknown[],
  imageExists: (relPath: string) => boolean,
  now: Date = new Date(),
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

    if (typeof f?.colour !== 'string' || !/^#[0-9A-Fa-f]{6}$/.test(f.colour)) err('colour must be a #RRGGBB hex')

    if (!Array.isArray(f?.sources) || f.sources.length < 2) err('needs at least 2 sources')
    if (typeof f?.checkedOn !== 'string' || Number.isNaN(Date.parse(f.checkedOn))) {
      err('checkedOn must be an ISO date')
    } else if (monthsOld(f.checkedOn, now) > MAX_AGE_MONTHS) {
      err(`checkedOn ${f.checkedOn} is older than ${MAX_AGE_MONTHS} months`)
    }
    if (!['high', 'medium', 'low'].includes(f?.confidence)) err('confidence must be high, medium or low')

    if (f?.stateOverrides !== undefined) {
      for (const [state, o] of Object.entries((f.stateOverrides ?? {}) as Loose)) {
        if (!AUS_STATES.includes(state as never)) err(`stateOverrides has unknown state "${state}"`)
        const op: unknown = (o as Loose)?.peak
        const oa: unknown = (o as Loose)?.available
        if (!Array.isArray(op) || !Array.isArray(oa)) {
          err(`stateOverrides.${state} needs peak and available arrays`)
          continue
        }
        for (const m of [...op, ...oa]) {
          if (!MONTHS.includes(m as never)) err(`stateOverrides.${state} unknown month "${String(m)}"`)
        }
        for (const m of op) {
          if (oa.includes(m)) err(`stateOverrides.${state} month ${String(m)} is in both peak and available`)
        }
      }
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
          if (typeof r?.name !== 'string' || typeof r?.description !== 'string' || !IDEA_TYPES.includes(r?.type)) {
            err(`recipes[${j}] needs string name, string description and a valid type`)
          }
        }
      }
    }
  }
  return errors
}

// Unicode dashes (hyphen variants, figure, en, em, horizontal bar, minus): house style is " - ", a comma,
// a colon or brackets. A plain hyphen-minus is fine.
const DASHES = /[\u2010-\u2015\u2212]/
const MIN_PER_MONTH = 3

// Fails the build on bad recipe data: unknown fruit, 3 to 8 steps, serves or makes, no Unicode dashes,
// "Ai" not "AI", an oven temperature without its fan-forced figure, and at least 3 recipes a month whose
// main fruit is at its Victorian peak.
export function validateRecipes(recipes: readonly unknown[], fruits: readonly unknown[]): string[] {
  const errors: string[] = []
  const fruitById = new Map((fruits as Loose[]).map(f => [f?.id as string, f]))
  const seen = new Set<string>()
  const perMonth = new Map<string, number>(MONTHS.map(m => [m, 0]))

  for (const [i, raw] of recipes.entries()) {
    const r = raw as Loose
    const id = typeof r?.id === 'string' && r.id ? r.id : `recipe #${i}`
    const err = (msg: string) => errors.push(`${id}: ${msg}`)

    if (typeof r?.id !== 'string' || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(r.id)) err('id must be kebab-case')
    else if (seen.has(r.id)) err('duplicate recipe id')
    else seen.add(r.id)

    for (const key of ['name', 'blurb']) if (typeof r?.[key] !== 'string' || !r[key].trim()) err(`missing ${key}`)
    if (!RECIPE_TYPES.includes(r?.type)) err(`unknown type "${String(r?.type)}"`)
    if (!['easy', 'medium', 'hard'].includes(r?.difficulty)) err('difficulty must be easy, medium or hard')
    if (typeof r?.minutes?.prep !== 'number' || typeof r?.minutes?.cook !== 'number') err('minutes needs prep and cook numbers')
    if (typeof r?.reviewed !== 'boolean') err('reviewed must be true or false')
    if (!Array.isArray(r?.tags)) err('tags must be an array')

    const hasServes = Number.isInteger(r?.serves) && r.serves >= 1 && r.serves <= 24
    const hasMakes = typeof r?.makes === 'string' && r.makes.trim() !== ''
    if (!hasServes && !hasMakes) err('needs serves (1 to 24) or makes')

    if (!Array.isArray(r?.fruitIds) || r.fruitIds.length === 0) {
      err('fruitIds must list at least the main fruit')
    } else {
      for (const f of r.fruitIds) if (!fruitById.has(f)) err(`unknown fruitId "${String(f)}"`)
    }

    if (!Array.isArray(r?.ingredients) || r.ingredients.length === 0) {
      err('no ingredients')
    } else {
      for (const [j, ing] of r.ingredients.entries()) {
        if (typeof ing?.item !== 'string' || typeof ing?.qty !== 'string') err(`ingredients[${j}] needs item and qty strings`)
        if (ing?.fruitId !== undefined && !fruitById.has(ing.fruitId)) err(`ingredients[${j}] unknown fruitId "${String(ing.fruitId)}"`)
      }
      for (const f of r.fruitIds ?? []) {
        if (!r.ingredients.some((ing: Loose) => ing?.fruitId === f)) err(`fruit "${String(f)}" has no ingredient line`)
      }
    }

    if (!Array.isArray(r?.steps) || r.steps.length < 3 || r.steps.length > 8) err('needs 3 to 8 steps')

    const texts: string[] = [r?.name, r?.blurb, r?.makes, r?.tip, r?.keep, ...(r?.steps ?? []), ...(r?.swaps ?? []),
      ...(r?.ingredients ?? []).flatMap((ing: Loose) => [ing?.item, ing?.qty])].filter((t): t is string => typeof t === 'string')
    for (const t of texts) {
      if (DASHES.test(t)) err(`Unicode dash in "${t.slice(0, 60)}"`)
      if (/\bAI\b/.test(t)) err(`write "Ai", not "AI": "${t.slice(0, 60)}"`)
    }
    for (const step of r?.steps ?? []) {
      if (typeof step === 'string' && /\d\s?°C oven|oven to \d+\s?°C/.test(step) && !/fan-forced/.test(step)) {
        err(`oven temperature without its fan-forced figure: "${step.slice(0, 60)}"`)
      }
    }

    const main = fruitById.get(r?.fruitIds?.[0])
    for (const m of main?.seasonality?.peak ?? []) perMonth.set(m, (perMonth.get(m) ?? 0) + 1)
  }

  for (const [m, n] of perMonth) {
    if (n < MIN_PER_MONTH) errors.push(`${m}: only ${n} recipe(s) whose main fruit is at its Victorian peak (need ${MIN_PER_MONTH})`)
  }
  return errors
}

if (import.meta.main) {
  const root = join(import.meta.dir, '..')
  const errors = [...validateFruits(FRUITS, rel => existsSync(join(root, rel))), ...validateRecipes(RECIPES, FRUITS)]
  console.log(`validate-data: ${FRUITS.length} fruits, ${RECIPES.length} recipes`)
  if (errors.length) {
    for (const e of errors) console.error(`  ERROR ${e}`)
    process.exit(1)
  }
  console.log('validate-data: ok')
}
