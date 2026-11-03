import { useEffect, useState } from 'react'
import { pageMove } from './useRoute'

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

// Ask for the 3D chunk only when the browser is idle after first paint, or, on a screen a page move
// brought in, once the slide has finished (building the scene mid-slide stalled it: pageMove in
// useRoute.ts). `now` (a hero returned to by a back move, whose chunk is already loaded) skips the wait,
// so the scene is there as it was left.
export function useAfterPaint(now = false): boolean {
  const [ready, setReady] = useState(now)
  useEffect(() => {
    if (now) return
    const go = () => setReady(true)
    const move = pageMove()
    if (move) {
      let live = true
      void move.then(() => { if (live) go() })
      return () => { live = false }
    }
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(go, { timeout: 700 })
      return () => window.cancelIdleCallback(id)
    }
    const t = setTimeout(go, 250)
    return () => clearTimeout(t)
  }, [now])
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

