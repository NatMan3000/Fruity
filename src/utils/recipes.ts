import type { Fruit, Month } from '../types/fruit'
import type { Ingredient, Recipe, RecipeType } from '../types/recipe'
import { fruitStatus, isPeakSeason, type FruitStatus } from './seasonality'

// Pure recipe helpers: the data is passed in, so tests and the validator use them without the app.

export const TYPE_LABEL: Record<RecipeType, string> = {
  breakfast: 'Breakfast', salad: 'Salad', main: 'Main', dessert: 'Dessert', drink: 'Drink', preserve: 'Preserve', snack: 'Snack',
}

export const KID_FRIENDLY = 'kid-friendly'

export function mainFruit(recipe: Recipe, fruits: readonly Fruit[]): Fruit | undefined {
  return fruits.find(f => f.id === recipe.fruitIds[0])
}

// The main fruit is at its Victorian peak this month.
export function atPeak(recipe: Recipe, fruits: readonly Fruit[], month: Month): boolean {
  const f = mainFruit(recipe, fruits)
  return !!f && isPeakSeason(f, month)
}

export function recipeStatus(recipe: Recipe, fruits: readonly Fruit[], month: Month): FruitStatus {
  const f = mainFruit(recipe, fruits)
  return f ? fruitStatus(f, month) : 'off'
}

// "25 min", "1 hr 15 min", "3 hr"
export function formatMinutes(total: number): string {
  if (total < 60) return `${total} min`
  const h = Math.floor(total / 60), m = total % 60
  return m ? `${h} hr ${m} min` : `${h} hr`
}

export const totalMinutes = (r: Recipe) => r.minutes.prep + r.minutes.cook

export const yieldText = (r: Recipe) => (r.makes ? `Makes ${r.makes}` : `Serves ${r.serves}`)

export type CookView = 'season' | 'all' | 'saved'

export interface CookFilter {
  view: CookView
  type: RecipeType | null
  kids: boolean
}

const STATUS_ORDER: Record<FruitStatus, number> = { peak: 0, ending: 1, available: 2, always: 3, off: 4 }

// The Cook tab's list. In season: the main fruit is in the shops (peak first, then ending, in season,
// all year). All: everything, in-season first. Saved: the hearted ones, in the order they were saved.
export function filterRecipes(recipes: readonly Recipe[], fruits: readonly Fruit[], month: Month, filter: CookFilter, saved: readonly string[]): Recipe[] {
  let list = filter.view === 'saved'
    ? saved.map(id => recipes.find(r => r.id === id)).filter((r): r is Recipe => !!r)
    : [...recipes]
  if (filter.view === 'season') list = list.filter(r => recipeStatus(r, fruits, month) !== 'off')
  if (filter.type) list = list.filter(r => r.type === filter.type)
  if (filter.kids) list = list.filter(r => r.tags.includes(KID_FRIENDLY))
  if (filter.view === 'saved') return list
  const rank = (r: Recipe) => STATUS_ORDER[recipeStatus(r, fruits, month)]
  return list.sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name))
}

// Every recipe that uses this fruit, the ones where it is the main fruit first.
export function recipesForFruit(recipes: readonly Recipe[], fruitId: string): Recipe[] {
  return recipes
    .filter(r => r.fruitIds.includes(fruitId))
    .sort((a, b) => Number(b.fruitIds[0] === fruitId) - Number(a.fruitIds[0] === fruitId) || a.name.localeCompare(b.name))
}

// A small, seeded shuffle (mulberry32), so a week's picks are the same on every phone.
function seeded(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6D2B79F5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// "Cook this week" on Now: up to 3 recipes whose main fruit is at peak this month, dealt from the year
// and week so both phones show the same three, changing each week. Different main fruit where it can.
export function cookThisWeek(recipes: readonly Recipe[], fruits: readonly Fruit[], month: Month, year: number, week: number, count = 3): Recipe[] {
  const pool = recipes.filter(r => atPeak(r, fruits, month)).sort((a, b) => a.id.localeCompare(b.id))
  const rand = seeded(year * 100 + week)
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  const picks: Recipe[] = []
  const fruitsUsed = new Set<string>()
  for (const r of pool) {
    if (picks.length < count && !fruitsUsed.has(r.fruitIds[0])) {
      picks.push(r)
      fruitsUsed.add(r.fruitIds[0])
    }
  }
  for (const r of pool) if (picks.length < count && !picks.includes(r)) picks.push(r)
  return picks
}

// Words that name what an ingredient is, for spotting it in a step: "yellow peaches, halved" gives
// peach and peaches; "sage leaves" gives sage; "salt flakes and black pepper" gives salt and pepper.
const CONTAINERS = new Set(['flakes', 'leaves', 'leaf', 'seeds', 'stick', 'sticks', 'clove', 'cloves', 'piece', 'juice', 'zest', 'bunch', 'fillets', 'breasts', 'thighs', 'cutlets', 'meal', 'extract', 'paste', 'sauce', 'powder', 'pods', 'sprigs', 'cubes'])

function forms(word: string): string[] {
  const w = word.toLowerCase()
  const out = new Set([w])
  if (w.endsWith('ies')) out.add(w.slice(0, -3) + 'y')
  else if (w.endsWith('es')) { out.add(w.slice(0, -2)); out.add(w.slice(0, -1)) }
  else if (w.endsWith('s')) out.add(w.slice(0, -1))
  else { out.add(w + 's'); out.add(w + 'es') }
  return [...out].filter(x => x.length > 2)
}

export function ingredientWords(ing: Ingredient): string[] {
  const head = ing.item.split(/[,(]/)[0].toLowerCase()
  const words: string[] = []
  for (const part of head.split(/\s+(?:and|or)\s+/)) {
    const ws = part.trim().split(/\s+/).filter(Boolean)
    if (!ws.length) continue
    const last = ws[ws.length - 1]
    words.push(...forms(last))
    if (CONTAINERS.has(last) && ws.length > 1) words.push(...forms(ws[ws.length - 2]))
  }
  return words
}

// The ingredients a step mentions, in recipe order (shown above the step in cook mode).
export function stepIngredients(step: string, ingredients: readonly Ingredient[]): number[] {
  const text = step.toLowerCase()
  const hits: number[] = []
  ingredients.forEach((ing, i) => {
    if (ingredientWords(ing).some(w => new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(text))) hits.push(i)
  })
  return hits
}

export interface StepTimer {
  label: string   // "20 minutes", "1 1/2 to 2 1/2 hours" as written
  seconds: number // the low end of a range: check early, add more if it needs it
}

const DURATION = /(\d+(?: \d\/\d)?|\d\/\d)(?: to (\d+(?: \d\/\d)?|\d\/\d))? (seconds?|minutes?|mins?|hours?|hrs?)\b/g

const num = (s: string) => {
  const m = s.match(/^(?:(\d+) )?(\d+)\/(\d+)$/)
  return m ? (+(m[1] ?? 0) + +m[2] / +m[3]) : +s
}

// The times in a step ("simmer for 15 to 20 minutes"), each becomes a tap-to-start timer in cook mode.
export function stepTimers(step: string): StepTimer[] {
  const out: StepTimer[] = []
  for (const m of step.matchAll(DURATION)) {
    const unit = m[3].startsWith('s') ? 1 : m[3].startsWith('h') ? 3600 : 60
    const seconds = Math.round(num(m[1]) * unit)
    if (seconds > 0 && !out.some(t => t.label === m[0])) out.push({ label: m[0], seconds })
  }
  return out
}

// The cafe's "make it for real" card: a real recipe built on a fruit from the bowl, if there is one.
// Fresh, fruit-salad-style dishes first (salad, breakfast, dessert, drink), then the most bowl fruit used.
const SALADISH: RecipeType[] = ['salad', 'breakfast', 'dessert', 'drink', 'snack']
export function realRecipeFor(recipes: readonly Recipe[], bowl: readonly string[]): Recipe | undefined {
  const score = (r: Recipe) => r.fruitIds.filter(id => bowl.includes(id)).length * 10 - SALADISH.indexOf(r.type)
  return recipes
    .filter(r => bowl.includes(r.fruitIds[0]) && SALADISH.includes(r.type))
    .sort((a, b) => score(b) - score(a) || a.name.localeCompare(b.name))[0]
}
