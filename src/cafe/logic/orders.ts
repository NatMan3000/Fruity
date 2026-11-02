import type { Fruit, Month, Season } from '../../types/fruit'
import { SEASONS } from '../../types/fruit'
import { fruitStatus, getSeasonality } from '../../utils/seasonality'
import { traitsOf, type ColourFamily, type Group, type Shape } from './traits'

// Customer orders: what a customer asks for, how hard it is at each level, and whether a bowl
// matches. Pure functions; the game and the tests both drive them with a seeded random.

export type Trait =
  | { kind: 'fruit'; id: string }
  | { kind: 'colour'; colour: ColourFamily }
  | { kind: 'shape'; shape: Shape }
  | { kind: 'group'; group: Group }
  | { kind: 'season'; season: Season }
  | { kind: 'fresh' }  // in season this month (not the year-round fruit)
  | { kind: 'pips' }   // only ever an "avoid"
  | { kind: 'stone' }  // only ever an "avoid"
  | { kind: 'any' }

export interface Want {
  trait: Trait
  count: number // how many different fruits must match
}

export interface Order {
  wants: Want[]
  avoid?: Trait  // no fruit in the bowl may match this
  shelf: string[] // fruit ids offered on the shelf; always holds at least one answer
}

export interface OrderContext {
  month: Month
}

export type Rng = () => number

// Small fast seeded random (mulberry32), so a test can replay an order exactly.
export function seededRng(seed: number): Rng {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6D2B79F5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const pickOne = <T>(rng: Rng, list: readonly T[]): T => list[Math.floor(rng() * list.length)]

export function shuffle<T>(rng: Rng, list: readonly T[]): T[] {
  const out = [...list]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

// A "summer fruit" is one at its best (peak) in a summer month, so banana and stored apples
// never count as belonging to a season.
function inSeasonOf(fruit: Fruit, season: Season): boolean {
  const peak = getSeasonality(fruit).peak
  return SEASONS[season].some(m => peak.includes(m))
}

// Fresh now: in the shops because it is in season this month. Year-round fruit (banana) is
// not "fresh now", so the sparkle on the shelf teaches the seasons.
export function isFreshNow(fruit: Fruit, ctx: OrderContext): boolean {
  const s = fruitStatus(fruit, ctx.month)
  return s === 'peak' || s === 'ending' || s === 'available'
}

export function matches(trait: Trait, fruit: Fruit, ctx: OrderContext): boolean {
  const t = traitsOf(fruit.id)
  switch (trait.kind) {
    case 'fruit': return fruit.id === trait.id
    case 'colour': return t.colours.includes(trait.colour)
    case 'shape': return t.shapes.includes(trait.shape)
    case 'group': return t.groups.includes(trait.group)
    case 'season': return inSeasonOf(fruit, trait.season)
    case 'fresh': return isFreshNow(fruit, ctx)
    case 'pips': return t.pips
    case 'stone': return t.stone
    case 'any': return true
  }
}

export const sameTrait = (a: Trait, b: Trait) => JSON.stringify(a) === JSON.stringify(b)

// ---------- Checking a bowl ----------

export type BowlCheck =
  | { ok: true }
  | { ok: false; reason: 'empty' }
  | { ok: false; reason: 'cooking'; fruitId: string } // quince or rhubarb, raw
  | { ok: false; reason: 'avoid'; fruitId: string }
  | { ok: false; reason: 'missing'; want: Want }

// Each want needs its own fruit: "something red and something round" takes two fruits even if
// one apple is both. Finds the most wants we can fill with distinct fruits (bowls hold at most
// 6 fruit and orders at most 4 slots, so a plain backtracking search is instant).
function bestAssignment(slots: Trait[], fruits: Fruit[], ctx: OrderContext): { filled: number; firstUnfilled: number; flags: boolean[] } {
  const options = slots.map(s => fruits.map((f, i) => (matches(s, f, ctx) ? i : -1)).filter(i => i >= 0))
  const used = new Set<number>()
  let best = 0
  let bestMissing = 0
  const filledNow: boolean[] = slots.map(() => false)
  let bestFlags = [...filledNow]

  const search = (k: number, filled: number) => {
    if (best === slots.length) return
    if (k === slots.length) {
      if (filled > best) {
        best = filled
        bestMissing = filledNow.findIndex(x => !x)
        bestFlags = [...filledNow]
      }
      return
    }
    if (filled + (slots.length - k) <= best) return
    for (const i of options[k]) {
      if (used.has(i)) continue
      used.add(i)
      filledNow[k] = true
      search(k + 1, filled + 1)
      filledNow[k] = false
      used.delete(i)
      if (best === slots.length) return
    }
    search(k + 1, filled)
  }
  search(0, 0)
  if (best === 0 && slots.length > 0) bestMissing = 0
  return { filled: best, firstUnfilled: best === slots.length ? -1 : bestMissing, flags: bestFlags }
}

// How many fruits in the bowl count towards each want (each fruit used once), for the ticks
// and "2 of 3" counters on the order bubble.
export function wantsFilled(order: Pick<Order, 'wants'>, bowl: Fruit[], ctx: OrderContext): number[] {
  const distinct = bowl.filter((f, i) => bowl.findIndex(g => g.id === f.id) === i && traitsOf(f.id).rawOk)
  const { flags } = bestAssignment(slotsOf(order.wants), distinct, ctx)
  let k = 0
  return order.wants.map(w => {
    const filled = flags.slice(k, k + w.count).filter(Boolean).length
    k += w.count
    return filled
  })
}

const slotsOf = (wants: Want[]) => wants.flatMap(w => Array.from({ length: w.count }, () => w.trait))

export function checkBowl(order: Pick<Order, 'wants' | 'avoid'>, bowl: Fruit[], ctx: OrderContext): BowlCheck {
  const distinct = bowl.filter((f, i) => bowl.findIndex(g => g.id === f.id) === i)
  if (distinct.length === 0) return { ok: false, reason: 'empty' }
  const raw = distinct.find(f => !traitsOf(f.id).rawOk)
  if (raw) return { ok: false, reason: 'cooking', fruitId: raw.id }
  if (order.avoid) {
    const hit = distinct.find(f => matches(order.avoid!, f, ctx))
    if (hit) return { ok: false, reason: 'avoid', fruitId: hit.id }
  }
  const slots = slotsOf(order.wants)
  const { filled, firstUnfilled } = bestAssignment(slots, distinct, ctx)
  if (filled === slots.length) return { ok: true }
  // Report the want that owns the first empty slot.
  let n = firstUnfilled
  for (const w of order.wants) {
    if (n < w.count) return { ok: false, reason: 'missing', want: w }
    n -= w.count
  }
  return { ok: false, reason: 'missing', want: order.wants[0] }
}

// ---------- Making an order ----------

// Level 1 starts with one easy picture; later levels add colours, shapes, seasons, counts and
// finally "but no ..." rules.
export const MAX_LEVEL = 6
const SHELF_SIZE = 8

type Template = (rng: Rng, pool: Fruit[], ctx: OrderContext) => { wants: Want[]; avoid?: Trait }

const COLOURS: ColourFamily[] = ['red', 'orange', 'yellow', 'green', 'purple', 'pink']
const SHAPES: Shape[] = ['round', 'long', 'small', 'big']
const GROUPS: Group[] = ['berry', 'citrus', 'tropical', 'stonefruit', 'melon']

const one = (trait: Trait, count = 1): Want => ({ trait, count })
const colour = (rng: Rng): Trait => ({ kind: 'colour', colour: pickOne(rng, COLOURS) })
const shape = (rng: Rng): Trait => ({ kind: 'shape', shape: pickOne(rng, SHAPES) })
const group = (rng: Rng): Trait => ({ kind: 'group', group: pickOne(rng, GROUPS) })
const fruit = (rng: Rng, pool: Fruit[]): Trait => ({ kind: 'fruit', id: pickOne(rng, pool).id })
const season = (rng: Rng, ctx: OrderContext): Trait => {
  // Mostly the season we are in (that is what is in the shops), sometimes another.
  const current = (Object.keys(SEASONS) as Season[]).find(s => SEASONS[s].includes(ctx.month))!
  return { kind: 'season', season: rng() < 0.6 ? current : pickOne(rng, Object.keys(SEASONS) as Season[]) }
}
const avoidTrait = (rng: Rng): Trait => pickOne<Trait>(rng, [
  { kind: 'pips' }, { kind: 'stone' }, { kind: 'group', group: 'berry' }, { kind: 'group', group: 'citrus' },
  { kind: 'colour', colour: 'red' }, { kind: 'colour', colour: 'yellow' }, { kind: 'colour', colour: 'green' },
])

const TEMPLATES: Template[][] = [
  // Level 1
  [
    (r, p) => ({ wants: [one(fruit(r, p))] }),
    (r, p) => ({ wants: [one(fruit(r, p)), one(fruit(r, p))] }),
    r => ({ wants: [one(colour(r))] }),
  ],
  // Level 2
  [
    r => ({ wants: [one(colour(r)), one(colour(r))] }),
    r => ({ wants: [one(colour(r)), one(shape(r))] }),
    r => ({ wants: [one(colour(r), 2)] }),
    (r, p) => ({ wants: [one(fruit(r, p)), one(colour(r))] }),
    r => ({ wants: [one(group(r))] }),
  ],
  // Level 3
  [
    (r, _p, c) => ({ wants: [one(season(r, c), 2)] }),
    () => ({ wants: [one({ kind: 'fresh' })] }),
    r => ({ wants: [one(group(r)), one(colour(r))] }),
    r => ({ wants: [one({ kind: 'fresh' }), one(colour(r))] }),
    r => ({ wants: [one(shape(r)), one(group(r))] }),
    r => ({ wants: [one(colour(r), 2), one(shape(r))] }),
  ],
  // Level 4: the first "but no ..." rules
  [
    r => ({ wants: [one({ kind: 'any' }, 3)], avoid: avoidTrait(r) }),
    r => ({ wants: [one(colour(r)), one({ kind: 'fresh' })], avoid: avoidTrait(r) }),
    (r, _p, c) => ({ wants: [one(season(r, c), 3)] }),
    r => ({ wants: [one(group(r)), one(shape(r))], avoid: avoidTrait(r) }),
  ],
  // Level 5
  [
    r => ({ wants: [one(colour(r)), one(colour(r)), one(shape(r))], avoid: avoidTrait(r) }),
    (r, _p, c) => ({ wants: [one(season(r, c), 2), one(colour(r))], avoid: avoidTrait(r) }),
    r => ({ wants: [one({ kind: 'fresh' }, 2), one(group(r))], avoid: avoidTrait(r) }),
  ],
  // Level 6
  [
    r => ({ wants: [one(colour(r)), one(shape(r)), one(group(r))], avoid: avoidTrait(r) }),
    (r, _p, c) => ({ wants: [one({ kind: 'fresh' }, 2), one(season(r, c)), one(colour(r))], avoid: avoidTrait(r) }),
    r => ({ wants: [one({ kind: 'any' }, 4)], avoid: avoidTrait(r) }),
  ],
]

// Merge repeated wants ("red" and "red" become "two red").
function mergeWants(wants: Want[]): Want[] {
  const out: Want[] = []
  for (const w of wants) {
    const same = out.find(o => sameTrait(o.trait, w.trait))
    if (same) same.count += w.count
    else out.push({ ...w })
  }
  return out
}

// One answer (distinct fruit ids) drawn from `pool`, or null when the order cannot be made.
export function findAnswer(order: Pick<Order, 'wants' | 'avoid'>, pool: Fruit[], ctx: OrderContext, rng: Rng = Math.random): string[] | null {
  const allowed = shuffle(rng, pool.filter(f => traitsOf(f.id).rawOk && !(order.avoid && matches(order.avoid, f, ctx))))
  // Hardest slots first so the search finds an answer quickly.
  const slots = slotsOf(order.wants)
    .map(t => ({ t, n: allowed.filter(f => matches(t, f, ctx)).length }))
    .sort((a, b) => a.n - b.n)
    .map(s => s.t)
  const chosen: Fruit[] = []
  const search = (k: number): boolean => {
    if (k === slots.length) return true
    for (const f of allowed) {
      if (chosen.includes(f) || !matches(slots[k], f, ctx)) continue
      chosen.push(f)
      if (search(k + 1)) return true
      chosen.pop()
    }
    return false
  }
  return search(0) ? chosen.map(f => f.id) : null
}

// Wants that every fruit trivially meets would make a dull order; every want must rule out
// at least some of the shelf, apart from the deliberate "any three fruits, but no ..." orders.
function isInteresting(wants: Want[], avoid: Trait | undefined, pool: Fruit[], ctx: OrderContext): boolean {
  for (const w of wants) {
    if (w.trait.kind === 'any') {
      if (!avoid) return false
      continue
    }
    const n = pool.filter(f => matches(w.trait, f, ctx)).length
    if (n < Math.max(1, w.count) || n === pool.length) return false
    // An avoid that removes every fruit a want needs is impossible.
    if (avoid && pool.filter(f => matches(w.trait, f, ctx) && !matches(avoid, f, ctx)).length < w.count) return false
  }
  return true
}

export function levelTemplates(level: number): Template[] {
  const l = Math.max(1, Math.min(MAX_LEVEL, Math.floor(level)))
  return TEMPLATES[l - 1]
}

// A new order for `level`. Mostly this level's kind of order, sometimes an easier one so the
// game keeps a few quick wins. The shelf holds one full answer, a few "tricky" fruit that break
// the "no ..." rule, and fillers.
export function generateOrder(level: number, fruits: Fruit[], ctx: OrderContext, rng: Rng = Math.random): Order {
  const pool = fruits.filter(f => traitsOf(f.id).rawOk)
  for (let attempt = 0; attempt < 80; attempt++) {
    const l = Math.max(1, Math.min(MAX_LEVEL, level))
    const useLevel = l > 1 && rng() < 0.25 ? l - 1 : l
    const template = pickOne(rng, levelTemplates(useLevel))
    const draft = template(rng, pool, ctx)
    const wants = mergeWants(draft.wants)
    if (!isInteresting(wants, draft.avoid, pool, ctx)) continue
    const answer = findAnswer({ wants, avoid: draft.avoid }, pool, ctx, rng)
    if (!answer) continue
    return { wants, avoid: draft.avoid, shelf: buildShelf(answer, draft.avoid, fruits, ctx, rng) }
  }
  // Never stuck: fall back to asking for one fruit by name.
  const f = pickOne(rng, pool)
  return { wants: [one({ kind: 'fruit', id: f.id })], shelf: buildShelf([f.id], undefined, fruits, ctx, rng) }
}

function buildShelf(answer: string[], avoid: Trait | undefined, fruits: Fruit[], ctx: OrderContext, rng: Rng): string[] {
  const shelf = new Set(answer)
  const rest = shuffle(rng, fruits.filter(f => !shelf.has(f.id)))
  // Two tempting fruit that break the "no ..." rule, so reading the order matters.
  if (avoid) for (const f of rest.filter(g => matches(avoid, g, ctx)).slice(0, 2)) shelf.add(f.id)
  // Now and then a fruit that needs cooking first, to learn that quince and rhubarb are not eaten raw.
  if (rng() < 0.2) {
    const raw = rest.find(f => !traitsOf(f.id).rawOk)
    if (raw) shelf.add(raw.id)
  }
  for (const f of rest) {
    if (shelf.size >= SHELF_SIZE) break
    shelf.add(f.id)
  }
  return shuffle(rng, [...shelf].slice(0, Math.max(SHELF_SIZE, answer.length)))
}

// ---------- Words ----------

const NUMBER_WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six']
const PLURAL_GROUP: Record<Group, [string, string]> = {
  berry: ['a berry', 'berries'],
  citrus: ['a citrus fruit', 'citrus fruits'],
  tropical: ['a tropical fruit', 'tropical fruits'],
  stonefruit: ['a stone fruit', 'stone fruits'],
  melon: ['a melon', 'melons'],
}

export function fruitPhrase(f: Pick<Fruit, 'id' | 'name'>): string {
  const say = traitsOf(f.id).say
  if (say) return say
  const name = f.name.toLowerCase()
  return `${/^[aeiou]/.test(name) ? 'an' : 'a'} ${name}`
}

export function wantPhrase(w: Want, fruits: Fruit[]): string {
  const n = w.count
  const many = NUMBER_WORDS[n] ?? String(n)
  const t = w.trait
  switch (t.kind) {
    case 'fruit': {
      const f = fruits.find(x => x.id === t.id)
      return f ? fruitPhrase(f) : 'a fruit'
    }
    case 'colour': return n === 1 ? `something ${t.colour}` : `${many} ${t.colour} fruits`
    case 'shape': {
      const word = t.shape === 'small' ? 'little' : t.shape
      return n === 1 ? `something ${word}` : `${many} ${word} fruits`
    }
    case 'group': return n === 1 ? PLURAL_GROUP[t.group][0] : `${many} ${PLURAL_GROUP[t.group][1]}`
    case 'season': return n === 1 ? `${t.season === 'Autumn' ? 'an' : 'a'} ${t.season.toLowerCase()} fruit` : `${many} ${t.season.toLowerCase()} fruits`
    case 'fresh': return n === 1 ? 'a fruit that is fresh now' : `${many} fruits that are fresh now`
    case 'any': return n === 1 ? 'any fruit' : `${many} different fruits`
    case 'pips': return 'a fruit with pips'
    case 'stone': return 'a fruit with a stone'
  }
}

export function avoidPhrase(t: Trait): string {
  switch (t.kind) {
    case 'pips': return 'no fruit with pips'
    case 'stone': return 'nothing with a stone'
    case 'colour': return `nothing ${t.colour}`
    case 'group': return `no ${PLURAL_GROUP[t.group][1]}`
    case 'shape': return `nothing ${t.shape}`
    case 'season': return `no ${t.season.toLowerCase()} fruit`
    case 'fresh': return 'nothing fresh'
    case 'fruit': return `no ${t.id}`
    case 'any': return 'nothing'
  }
}

// "Something red and something round, but no fruit with pips"
export function orderSentence(order: Pick<Order, 'wants' | 'avoid'>, fruits: Fruit[]): string {
  const parts = order.wants.map(w => wantPhrase(w, fruits))
  const list = parts.length <= 1 ? parts.join('') : `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`
  const text = order.avoid ? `${list}, but ${avoidPhrase(order.avoid)}` : list
  return text.charAt(0).toUpperCase() + text.slice(1)
}

// Short hint when a bowl is not right yet, in the customer's voice.
export function hintFor(check: BowlCheck, order: Pick<Order, 'avoid'>, fruits: Fruit[]): string {
  if (check.ok) return ''
  const name = (id: string) => (fruits.find(f => f.id === id)?.name ?? 'that one').toLowerCase()
  switch (check.reason) {
    case 'empty': return 'The bowl is empty! Pop some fruit in.'
    case 'cooking': return `Ooh, ${name(check.fruitId)} needs cooking first. Can you take it out?`
    case 'avoid': return `Oops, I said ${order.avoid ? avoidPhrase(order.avoid) : 'not that one'}. Can you take out the ${name(check.fruitId)}?`
    case 'missing': return `Nearly! I still need ${wantPhrase(check.want, fruits)}.`
  }
}
