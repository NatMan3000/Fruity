import { useEffect, useState } from 'react'
import { pageMove } from './useRoute'
import { welcomeGone } from './useWelcome'

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
// useRoute.ts). While the welcome screen is up it waits for that to go, then starts at once: the hero's
// entrance (the Now bowl's drop and clunk) must happen where it can be seen and heard, after the tap
// that unlocks sound (useWelcome.ts). `now` (a hero returned to by a back move, whose chunk is already
// loaded) skips the wait, so the scene is there as it was left.
export function useAfterPaint(now = false): boolean {
  const [ready, setReady] = useState(now)
  useEffect(() => {
    if (now) return
    let live = true
    // Checked again when the wait ends, in case the welcome came up meanwhile (back from the background)
    const go = () => {
      if (!live) return
      const welcome = welcomeGone()
      if (welcome) void welcome.then(go)
      else setReady(true)
    }
    const welcome = welcomeGone()
    if (welcome) {
      void welcome.then(go)
      return () => { live = false }
    }
    const move = pageMove()
    if (move) {
      void move.then(go)
      return () => { live = false }
    }
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(go, { timeout: 700 })
      return () => { live = false; window.cancelIdleCallback(id) }
    }
    const t = setTimeout(go, 250)
    return () => { live = false; clearTimeout(t) }
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

