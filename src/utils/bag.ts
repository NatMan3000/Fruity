import type { Fruit } from '../types/fruit'

// The shopping bag: plain items so Phase 3 can add recipe ingredients alongside fruit.
export interface BagItem {
  id: string        // 'fruit:<fruitId>' for fruit
  name: string
  fruitId?: string
  done: boolean     // ticked off in the aisle
}

export const fruitItemId = (fruitId: string) => `fruit:${fruitId}`

export function isBag(v: unknown): v is BagItem[] {
  return Array.isArray(v) && v.every(i =>
    typeof i === 'object' && i !== null &&
    typeof (i as BagItem).id === 'string' &&
    typeof (i as BagItem).name === 'string' &&
    typeof (i as BagItem).done === 'boolean' &&
    ((i as BagItem).fruitId === undefined || typeof (i as BagItem).fruitId === 'string'))
}

export function hasFruit(bag: BagItem[], fruitId: string): boolean {
  return bag.some(i => i.id === fruitItemId(fruitId))
}

export function addFruit(bag: BagItem[], fruit: Pick<Fruit, 'id' | 'name'>): BagItem[] {
  if (hasFruit(bag, fruit.id)) return bag
  return [...bag, { id: fruitItemId(fruit.id), name: fruit.name, fruitId: fruit.id, done: false }]
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
export function bagText(bag: BagItem[]): string {
  const left = bag.filter(i => !i.done)
  const items = left.length ? left : bag
  return ['Fruity shopping list', ...items.map(i => `- ${i.name}`)].join('\n')
}
