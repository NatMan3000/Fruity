import { useEffect, useState } from 'react'

// For the two 3D heroes (NowHero, FruitHero): can this device draw WebGL, wait for first paint before
// asking for the 3D chunk, and the knife stroke's position.
export const webgl = (() => {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
})()

// Ask for the 3D chunk only when the browser is idle after first paint.
export function useAfterPaint(): boolean {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const go = () => setReady(true)
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(go, { timeout: 700 })
      return () => window.cancelIdleCallback(id)
    }
    const t = setTimeout(go, 250)
    return () => clearTimeout(t)
  }, [])
  return ready
}

export interface SlashAt { x: number; y: number; angle: number; key: number }

// The knife stroke. Clears itself on a timer (not animationend, so it also clears under reduced motion).
export function useSlash(): [SlashAt | null, (s: Omit<SlashAt, 'key'>) => void] {
  const [slash, setSlash] = useState<SlashAt | null>(null)
  useEffect(() => {
    if (!slash) return
    const t = setTimeout(() => setSlash(null), 420)
    return () => clearTimeout(t)
  }, [slash])
  return [slash, s => setSlash({ ...s, key: Date.now() })]
}

