// Motion helpers for the 3D scenes: render-on-demand animation and drag-to-spin.
import { useEffect, useRef, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'

export interface FruitLike {
  id: string
  name: string
  colour: string
}

export const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Drag sideways to spin, with a flick that coasts to a stop. Vertical drags stay page scrolls
// (touch-action: pan-y). Calls invalidate only while something moves, so an idle scene costs nothing.
// `held` is true while a press on a fruit is deciding whether it is a cut (a quick sideways swipe) or a
// turn (a slower drag, which then spins as usual).
export function useSpin(start = 0, kick = 0, held?: RefObject<boolean>) {
  const s = useRef({ angle: start, vel: reducedMotion() ? 0 : kick, dragging: false, lastX: 0, lastT: 0 })
  const { gl, invalidate } = useThree()
  useEffect(() => {
    const el = gl.domElement
    const down = (e: PointerEvent) => {
      s.current.dragging = true
      s.current.lastX = e.clientX
      s.current.lastT = e.timeStamp
      s.current.vel = 0
    }
    const move = (e: PointerEvent) => {
      const st = s.current
      if (!st.dragging) return
      // While a press on a fruit is still deciding (cut or turn), keep the pointer in step but hold still,
      // so a drag that turns out to be a turn does not jump.
      if (held?.current) {
        st.lastX = e.clientX
        st.lastT = e.timeStamp
        return
      }
      const dx = e.clientX - st.lastX
      const dt = Math.max(1, e.timeStamp - st.lastT) / 1000
      st.angle += dx * 0.012
      st.vel = st.vel * 0.5 + ((dx * 0.012) / dt) * 0.5
      st.lastX = e.clientX
      st.lastT = e.timeStamp
      invalidate()
    }
    const up = () => {
      s.current.dragging = false
      if (reducedMotion()) s.current.vel = 0
      invalidate()
    }
    el.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    return () => {
      el.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
  }, [gl, invalidate, held])
  // Coast: friction on the flick; returns true while still moving.
  return {
    state: s,
    step(dt: number): boolean {
      const st = s.current
      if (st.dragging) return false
      if (Math.abs(st.vel) < 0.03) {
        st.vel = 0
        return false
      }
      st.angle += st.vel * dt
      st.vel *= Math.exp(-dt * 2.6)
      return true
    },
  }
}

// Run `step` every frame while it returns true; the scene then sleeps until something invalidates it.
export function useAnimation(step: (dt: number) => boolean) {
  const invalidate = useThree(s => s.invalidate)
  useFrame((_, dt) => {
    if (step(Math.min(dt, 1 / 30))) invalidate()
  })
}
