import { useSyncExternalStore } from 'react'
import { isBag, type BagItem } from '../utils/bag'

// One bag shared by every screen (badge, sheet, fruit page), persisted in localStorage and kept
// in step across tabs. Offline by nature.
const KEY = 'fruity.bag'
const listeners = new Set<() => void>()

function read(): BagItem[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw !== null) {
      const parsed: unknown = JSON.parse(raw)
      if (isBag(parsed)) return parsed
    }
  } catch {
    // unreadable storage or bad JSON: start empty
  }
  return []
}

let bag: BagItem[] = typeof window === 'undefined' ? [] : read()

function subscribe(cb: () => void) {
  listeners.add(cb)
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) { bag = read(); cb() }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(cb)
    window.removeEventListener('storage', onStorage)
  }
}

export function updateBag(change: (current: BagItem[]) => BagItem[]) {
  bag = change(bag)
  try {
    localStorage.setItem(KEY, JSON.stringify(bag))
  } catch (err) {
    // private mode or quota: the bag still works for this session
    console.warn('fruity: could not save the bag', err)
  }
  listeners.forEach(l => l())
}

export function useBag(): BagItem[] {
  return useSyncExternalStore(subscribe, () => bag, () => bag)
}
