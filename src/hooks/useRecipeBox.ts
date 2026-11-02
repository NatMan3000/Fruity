import { useSyncExternalStore } from 'react'

// The user's side of the recipes: which are saved (hearted, newest first) and the dates each was
// made. Kept in localStorage on this phone and in step across tabs, like the bag. Recipe data itself
// stays in src/assets/recipes.ts.
export interface RecipeBox {
  saved: string[]
  made: Record<string, string[]> // recipe id -> ISO dates, oldest first
}

const KEY = 'fruity.recipes'
const EMPTY: RecipeBox = { saved: [], made: {} }
const listeners = new Set<() => void>()

export function isRecipeBox(v: unknown): v is RecipeBox {
  if (typeof v !== 'object' || v === null) return false
  const b = v as RecipeBox
  return Array.isArray(b.saved) && b.saved.every(s => typeof s === 'string') &&
    typeof b.made === 'object' && b.made !== null && !Array.isArray(b.made) &&
    Object.values(b.made).every(d => Array.isArray(d) && d.every(x => typeof x === 'string'))
}

function read(): RecipeBox {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw !== null) {
      const parsed: unknown = JSON.parse(raw)
      if (isRecipeBox(parsed)) return parsed
    }
  } catch {
    // unreadable storage or bad JSON: start empty
  }
  return EMPTY
}

let box: RecipeBox = typeof window === 'undefined' ? EMPTY : read()

function subscribe(cb: () => void) {
  listeners.add(cb)
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) { box = read(); cb() }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(cb)
    window.removeEventListener('storage', onStorage)
  }
}

function update(change: (b: RecipeBox) => RecipeBox) {
  box = change(box)
  try {
    localStorage.setItem(KEY, JSON.stringify(box))
  } catch (err) {
    console.warn('fruity: could not save your recipes', err) // private mode or quota: works this session
  }
  listeners.forEach(l => l())
}

export function toggleSaved(id: string) {
  update(b => ({ ...b, saved: b.saved.includes(id) ? b.saved.filter(s => s !== id) : [id, ...b.saved] }))
}

// The local date as YYYY-MM-DD (the phone's own day, not UTC's).
export const isoDay = (d: Date = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export function recordMade(id: string, when: Date = new Date()) {
  const day = isoDay(when)
  update(b => ({ ...b, made: { ...b.made, [id]: [...(b.made[id] ?? []), day] } }))
}

export function useRecipeBox(): RecipeBox {
  return useSyncExternalStore(subscribe, () => box, () => box)
}
