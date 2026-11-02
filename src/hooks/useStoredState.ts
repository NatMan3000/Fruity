import { useEffect, useState } from 'react'

// useState persisted in localStorage. `validate` rejects stale or tampered values.
export function useStoredState<T>(key: string, initial: T, validate: (v: unknown) => v is T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw !== null) {
        const parsed: unknown = JSON.parse(raw)
        if (validate(parsed)) return parsed
      }
    } catch {
      // unreadable storage or bad JSON: fall back to the default
    }
    return initial
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // private mode or quota: persistence is best-effort
    }
  }, [key, value])

  return [value, setValue] as const
}
