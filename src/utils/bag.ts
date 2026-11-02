import type { Fruit } from '../types/fruit'
import type { Recipe } from '../types/recipe'
import { scaleQty } from './scale'

// The shopping bag: plain items, fruit and anything else a recipe needs, shown grouped Fruit / Other.
export interface BagItem {
  id: string        // 'fruit:<fruitId>' for fruit, 'item:<name>' for anything else
  name: string
  fruitId?: string
  note?: string     // how much, and for what: "3, for Cherry clafoutis"
  done: boolean     // ticked off in the aisle
}

export const fruitItemId = (fruitId: string) => `fruit:${fruitId}`
export const otherItemId = (name: string) => `item:${name.trim().toLowerCase()}`

export function isBag(v: unknown): v is BagItem[] {
  return Array.isArray(v) && v.every(i =>
    typeof i === 'object' && i !== null &&
    typeof (i as BagItem).id === 'string' &&
    typeof (i as BagItem).name === 'string' &&
    typeof (i as BagItem).done === 'boolean' &&
    ((i as BagItem).fruitId === undefined || typeof (i as BagItem).fruitId === 'string') &&
    ((i as BagItem).note === undefined || typeof (i as BagItem).note === 'string'))
}

export function hasFruit(bag: BagItem[], fruitId: string): boolean {
  return bag.some(i => i.id === fruitItemId(fruitId))
}

export function addFruit(bag: BagItem[], fruit: Pick<Fruit, 'id' | 'name'>, note?: string): BagItem[] {
  if (hasFruit(bag, fruit.id)) return bag
  return [...bag, { id: fruitItemId(fruit.id), name: fruit.name, fruitId: fruit.id, ...(note ? { note } : {}), done: false }]
}

// Anything that is not a fruit ("Caster sugar"), once per name.
export function addOther(bag: BagItem[], name: string, note?: string): BagItem[] {
  const id = otherItemId(name)
  if (bag.some(i => i.id === id)) return bag
  return [...bag, { id, name, ...(note ? { note } : {}), done: false }]
}

// Things every kitchen has on tap: never worth a line on a shopping list.
const ON_TAP = /^(water|boiling water|cold water|warm water|ice|ice cubes)$/

// An ingredient's shopping name: the part before any comma or bracket, with a capital letter.
export function shoppingName(item: string): string {
  const head = item.split(/[,(]/)[0].trim()
  return head.charAt(0).toUpperCase() + head.slice(1)
}

// A recipe's ingredients into the bag, at the chosen serves (factor). 'fruit' adds only the fruit, each
// once with what it is needed for; 'all' adds everything else too, as plain items. Anything already in
// the bag stays as it is.
export function addRecipe(bag: BagItem[], recipe: Recipe, fruits: readonly Pick<Fruit, 'id' | 'name'>[], factor: number, which: 'fruit' | 'all'): BagItem[] {
  const fruitNotes = new Map<string, string[]>()
  const others: [string, string][] = []
  for (const ing of recipe.ingredients) {
    const qty = scaleQty(ing.qty, factor)
    if (ing.fruitId) {
      const notes = fruitNotes.get(ing.fruitId) ?? []
      notes.push(qty)
      fruitNotes.set(ing.fruitId, notes)
    } else if (which === 'all') {
      const name = shoppingName(ing.item)
      if (!ON_TAP.test(name.toLowerCase())) others.push([name, qty])
    }
  }
  let next = bag
  for (const [id, notes] of fruitNotes) {
    const fruit = fruits.find(f => f.id === id)
    if (fruit) next = addFruit(next, fruit, `${notes.join(' + ')}, for ${recipe.name}`)
  }
  for (const [name, qty] of others) next = addOther(next, name, qty)
  return next
}

export interface BagGroups { fruit: BagItem[]; other: BagItem[] }

export function groupBag(bag: BagItem[]): BagGroups {
  return { fruit: bag.filter(i => i.fruitId), other: bag.filter(i => !i.fruitId) }
}

export function toggleDone(bag: BagItem[], id: string): BagItem[] {
  return bag.map(i => (i.id === id ? { ...i, done: !i.done } : i))
}

export function removeItem(bag: BagItem[], id: string): BagItem[] {
  return bag.filter(i => i.id !== id)
}

export function clearDone(bag: BagItem[]): BagItem[] {
  return bag.filter(i => !i.done)
}

export function remainingCount(bag: BagItem[]): number {
  return bag.filter(i => !i.done).length
}

// Plain text for the share sheet or clipboard: what is still to get (everything, if all ticked).
// Grouped Fruit / Other when there is some of each.
export function bagText(bag: BagItem[]): string {
  const left = bag.filter(i => !i.done)
  const { fruit, other } = groupBag(left.length ? left : bag)
  const line = (i: BagItem) => `- ${i.name}${i.note ? ` (${i.note})` : ''}`
  if (!fruit.length || !other.length) return ['Fruity shopping list', ...[...fruit, ...other].map(line)].join('\n')
  return ['Fruity shopping list', '', 'Fruit', ...fruit.map(line), '', 'Other', ...other.map(line)].join('\n')
}
