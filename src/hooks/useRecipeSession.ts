import { useCallback, useSyncExternalStore } from 'react'

// What you are doing with a recipe right now: the serves you picked and the ingredients you have ticked.
// Shared by the recipe page and cook mode, and kept for this browser session (sessionStorage), so a
// reload in the kitchen does not lose your ticks, but tomorrow starts fresh.
export interface RecipeSession {
  serves: number | null // null: the recipe's own
  ticked: number[]      // ingredient indexes
}

const KEY = 'fruity.cooking'
const listeners = new Set<() => void>()
const EMPTY: RecipeSession = { serves: null, ticked: [] }

function read(): Record<string, RecipeSession> {
  try {
    const raw = sessionStorage.getItem(KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : {}
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) return parsed as Record<string, RecipeSession>
  } catch {
    // unreadable: start fresh
  }
  return {}
}

let sessions: Record<string, RecipeSession> = typeof window === 'undefined' ? {} : read()

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => { listeners.delete(cb) }
}

export function useRecipeSession(id: string): [RecipeSession, (change: (s: RecipeSession) => RecipeSession) => void] {
  const session = useSyncExternalStore(subscribe, () => sessions[id] ?? EMPTY, () => EMPTY)
  const update = useCallback((change: (s: RecipeSession) => RecipeSession) => {
    sessions = { ...sessions, [id]: change(sessions[id] ?? EMPTY) }
    try {
      sessionStorage.setItem(KEY, JSON.stringify(sessions))
    } catch {
      // private mode: kept in memory only
    }
    listeners.forEach(l => l())
  }, [id])
  return [session, update]
}
