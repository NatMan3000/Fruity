// Motion helpers for the 3D scenes: render-on-demand animation and drag-to-spin.
import { useEffect, useRef, type RefObject } from 'react'
import * as THREE from 'three'
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

// Free rotation for a single model (a fruit's page), like a model viewer: a drag that STARTS on the
// fruit (`grab`, from the fruit's own pointerdown, so it is a raycast hit) turns it about the screen axis
// at right angles to the drag, in any direction (quaternions: no gimbal lock, no limits), and a flick
// coasts. That press owns the gesture: its touchmoves are cancelled so the page does not scroll under it.
// A drag that starts on empty canvas only turns it about the vertical, and a vertical one there scrolls
// the page as usual (touch-action: pan-y). No drift back to upright: it stays as you leave it, like a
// model viewer, and cutting lays the pieces out from wherever it is. Reduced motion: no arrival spin
// and no coast; dragging still turns it directly.
// `held` is true while a press on the fruit is deciding whether it is a cut (a quick flick or a tap)
// or a turn; nothing turns until it decides.
export function useTrackball(startYaw = 0, kick = 0, held?: RefObject<boolean>) {
  const { gl, camera, invalidate } = useThree()
  const s = useRef({
    q: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), startYaw),
    w: new THREE.Vector3(0, reducedMotion() ? 0 : kick, 0), // angular velocity, rad/s, world axes
    dragging: false,
    free: false,
    grabbedAt: -1,
    lastX: 0,
    lastY: 0,
    lastT: 0,
  })
  useEffect(() => {
    const el = gl.domElement
    const axis = new THREE.Vector3(), turn = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0)
    const down = (e: PointerEvent) => {
      const st = s.current
      st.dragging = true
      st.free = st.grabbedAt === e.timeStamp // the fruit's own handler ran first for this press
      st.lastX = e.clientX
      st.lastY = e.clientY
      st.lastT = e.timeStamp
      st.w.set(0, 0, 0)
    }
    const move = (e: PointerEvent) => {
      const st = s.current
      if (!st.dragging) return
      const dx = e.clientX - st.lastX, dy = e.clientY - st.lastY
      const dt = Math.max(1, e.timeStamp - st.lastT) / 1000
      st.lastX = e.clientX
      st.lastY = e.clientY
      st.lastT = e.timeStamp
      if (held?.current) return // still deciding: keep in step, hold still
      let angle: number
      if (st.free) {
        // Drag right turns about the screen's up axis, drag down about its right axis
        angle = Math.hypot(dx, dy) * 0.012
        if (angle === 0) return
        axis.set(dy, dx, 0).normalize().applyQuaternion(camera.quaternion)
      } else {
        angle = Math.abs(dx) * 0.012
        if (angle === 0) return
        axis.copy(up).multiplyScalar(Math.sign(dx))
      }
      st.q.premultiply(turn.setFromAxisAngle(axis, angle)).normalize()
      st.w.multiplyScalar(0.5).addScaledVector(axis, (angle / dt) * 0.5)
      invalidate()
    }
    const end = () => {
      const st = s.current
      st.dragging = false
      st.free = false
      if (reducedMotion()) st.w.set(0, 0, 0)
      invalidate()
    }
    // The press that started on the fruit keeps the page still (iOS and Chrome scroll on touchmove).
    const touchmove = (e: TouchEvent) => { if (s.current.free && e.cancelable) e.preventDefault() }
    el.addEventListener('pointerdown', down)
    el.addEventListener('touchmove', touchmove, { passive: false })
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', end)
    window.addEventListener('pointercancel', end)
    return () => {
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('touchmove', touchmove)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', end)
      window.removeEventListener('pointercancel', end)
    }
  }, [gl, camera, invalidate, held])
  const turn = new THREE.Quaternion()
  return {
    state: s,
    // From the fruit's onPointerDown: this press began on the fruit, so it turns it freely.
    grab(e: { timeStamp: number }) {
      s.current.grabbedAt = e.timeStamp
      s.current.free = true
      s.current.dragging = true
    },
    // Coast with friction; returns true while still moving.
    step(dt: number): boolean {
      const st = s.current
      if (st.dragging) return false
      const speed = st.w.length()
      if (speed < 0.03) {
        st.w.set(0, 0, 0)
        return false
      }
      st.q.premultiply(turn.setFromAxisAngle(st.w.clone().divideScalar(speed), speed * dt)).normalize()
      st.w.multiplyScalar(Math.exp(-dt * 2.6))
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

// While something drops in from above the canvas, the canvas's top fades in over `px` CSS px, so it appears
// through a soft edge instead of a hard line under the top bar. `clear()` takes the fade off once it has
// landed, so nothing at rest or turned is ever faded. Nothing is faded when `active` is false.
export function useTopFade(active: boolean, px: number) {
  const gl = useThree(s => s.gl)
  const on = useRef(active)
  useEffect(() => {
    const el = gl.domElement
    const set = (v: string) => { el.style.setProperty('mask-image', v); el.style.setProperty('-webkit-mask-image', v) }
    if (on.current) set(`linear-gradient(to bottom, transparent 0, #000 ${px}px)`)
    return () => set('')
  }, [gl, px])
  return {
    fading: on,
    clear() {
      if (!on.current) return
      on.current = false
      gl.domElement.style.setProperty('mask-image', '')
      gl.domElement.style.setProperty('-webkit-mask-image', '')
    },
  }
}
