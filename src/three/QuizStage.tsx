// "Guess the fruit" 3D stage (lazy, shares the three.js chunk with the heroes). One canvas for the
// whole game; each question remounts the scene inside it. How the question's fruit is shown:
//   inside      already cut open (./cutting.tsx layout), its cross-sections swaying gently
//   silhouette  a dark shape spinning slowly that takes on its colour, then its shine, as time runs
//   closeup     a tight zoom on the skin that pulls back as time runs
//   hero        the whole fruit dropped in (season and pairs rounds)
// On a right answer the fruit is sliced open with a juice burst (an inside-out fruit closes back up
// and hops); on a wrong one it squishes and wobbles and shows itself in full. The scene only renders
// while something moves (frameloop demand): once answered and settled it sleeps. Reduced motion: no
// spin, sway or drop; the zoom steps instead of gliding.
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { planCut, stepCut, useJuice, type Cut } from './cutting'
import { juiceOf } from './flesh'
import { buildFruit, cutParts } from './models'
import { reducedMotion, useAnimation, type FruitLike } from './motion'
import { ShadowFloor, Stage } from './stage'

export type StageLook = 'inside' | 'silhouette' | 'closeup' | 'hero'
export type StageOutcome = 'asking' | 'right' | 'wrong'

export interface QuizStageProps {
  fruit: FruitLike | null
  look: StageLook
  outcome: StageOutcome
  progress: () => number // 0..1, how much of the question's time has gone
  shade: string          // the shadow and silhouette tint (the season's ink)
  qKey: number           // a new question: a fresh scene
  className?: string
}

const CAMERA = { position: [0, 1.6, 5.4] as [number, number, number], fov: 30, target: [0, 0.78, 0] as [number, number, number] }
const ZOOM_FOV = 2.4 // close-up start: a patch of skin about an eighth of the fruit across

export default function QuizStage({ className, ...props }: QuizStageProps) {
  return (
    <Stage className={className} camera={CAMERA}>
      {props.fruit && <FruitScene key={props.qKey} {...props} fruit={props.fruit} />}
    </Stage>
  )
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

// Silhouette: the fruit gets its own copies of its materials (models share theirs between clones), so
// they can start as a flat dark shape and fade to the real colour, then the shine, bumps and glow.
type Paintable = THREE.Material & {
  color?: THREE.Color; emissive?: THREE.Color; envMapIntensity?: number; clearcoat?: number; sheen?: number; emissiveIntensity?: number; bumpScale?: number; roughness?: number
}
interface Snap { m: Paintable; colour?: THREE.Color; glow?: THREE.Color; env: number; clearcoat: number; sheen: number; emissive: number; bump: number; roughness: number }

function ownMaterials(root: THREE.Object3D, ink: string) {
  const copies = new Map<THREE.Material, Paintable>()
  const snaps: Snap[] = []
  const swap = (mat: THREE.Material) => {
    let c = copies.get(mat)
    if (!c) {
      c = mat.clone() as Paintable
      copies.set(mat, c)
      snaps.push({ m: c, colour: c.color?.clone(), glow: c.emissive?.clone(), env: c.envMapIntensity ?? 1, clearcoat: c.clearcoat ?? 0, sheen: c.sheen ?? 0, emissive: c.emissiveIntensity ?? 0, bump: c.bumpScale ?? 0, roughness: c.roughness ?? 1 })
    }
    return c
  }
  root.traverse(o => {
    const mesh = o as THREE.Mesh
    if (mesh.isMesh) mesh.material = Array.isArray(mesh.material) ? mesh.material.map(swap) : swap(mesh.material)
  })
  // The shadow is the material's own glow in the season's ink with its lit colour at black: flat, no
  // shading, no pattern, just the outline.
  const dark = new THREE.Color(ink)
  const black = new THREE.Color(0, 0, 0)
  return {
    paint(p: number) {
      // Stays a shadow for the first few seconds, then colour, then shine and detail.
      const colour = smooth(0.38, 0.8, p), detail = smooth(0.68, 1, p)
      for (const s of snaps) {
        if (s.colour && s.m.color) s.m.color.copy(black).lerp(s.colour, colour)
        if (s.glow && s.m.emissive) s.m.emissive.copy(dark).lerp(s.glow, colour)
        if (s.m.envMapIntensity !== undefined) s.m.envMapIntensity = s.env * detail
        if (s.m.clearcoat !== undefined) s.m.clearcoat = s.clearcoat * detail
        if (s.m.sheen !== undefined) s.m.sheen = s.sheen * detail
        if (s.m.emissiveIntensity !== undefined) s.m.emissiveIntensity = THREE.MathUtils.lerp(1, s.emissive, colour)
        if (s.m.bumpScale !== undefined) s.m.bumpScale = s.bump * detail
        if (s.m.roughness !== undefined) s.m.roughness = THREE.MathUtils.lerp(1, s.roughness, detail)
      }
    },
    dispose() {
      copies.forEach(m => m.dispose())
    },
  }
}

function FruitScene({ fruit, look, outcome, progress, shade }: Omit<QuizStageProps, 'className' | 'fruit'> & { fruit: FruitLike }) {
  const { camera, invalidate } = useThree()
  const get = useThree(st => st.get)
  // The camera's zoom is changed through the store (a close-up narrows it, every question resets it).
  const setFov = useCallback((fov: number) => {
    const cam = get().camera as THREE.PerspectiveCamera
    cam.fov = fov
    cam.updateProjectionMatrix()
  }, [get])
  const still = reducedMotion()
  const obj = useRef<THREE.Group>(null)
  const juice = useJuice()
  const model = useMemo(() => buildFruit(fruit.id, fruit.colour), [fruit.id, fruit.colour])
  const parts = useMemo(() => cutParts(model), [model])
  const paint = useMemo(() => (look === 'silhouette' ? ownMaterials(model, shade) : null), [model, look, shade])
  useEffect(() => () => paint?.dispose(), [paint])
  const size = look === 'inside' ? 1.55 : 1.75
  const cut = useRef<Cut | null>(null)
  const s = useRef({
    t: 0,
    angle: look === 'inside' ? 0 : -0.6,
    y: still || look !== 'hero' ? 0 : 2.6, vy: 0, squash: 0, hop: 0, hopV: 0,
    wobble: 0, reveal: look === 'silhouette' ? 0 : 1, fov: look === 'closeup' ? ZOOM_FOV : CAMERA.fov,
    aimed: false,
  })

  // Every question starts from the stage's own camera (a close-up narrows it).
  useLayoutEffect(() => {
    setFov(s.current.fov)
    get().camera.lookAt(...CAMERA.target)
    paint?.paint(s.current.reveal)
    invalidate()
    return () => {
      setFov(CAMERA.fov)
      get().camera.lookAt(...CAMERA.target)
    }
  }, [get, setFov, invalidate, paint])

  // The answer: slice it open (or close an inside-out fruit back up), juice; or squish and wobble.
  useEffect(() => {
    if (outcome === 'asking') return
    const st = s.current
    const o = obj.current
    if (!o) return
    if (outcome === 'right') {
      if (parts && cut.current && look === 'inside') {
        cut.current.target = 0
        if (still) cut.current.p = 0
        st.hopV = still ? 0 : 3
      } else if (parts) {
        o.updateWorldMatrix(true, true)
        cut.current = planCut(o, parts, camera, 0.42)
        cut.current.target = 1
        if (still) cut.current.p = 1
      } else if (!still) {
        st.hopV = 3.6
      }
      if (!still) juice.splash(o, juiceOf(fruit.id, fruit.colour))
    } else {
      st.wobble = still ? 0 : 1
    }
    invalidate()
  }, [outcome]) // eslint-disable-line react-hooks/exhaustive-deps -- once per answer

  useAnimation(dt => {
    const st = s.current
    const o = obj.current
    if (!o) return false
    const asking = outcome === 'asking'
    st.t += dt
    let moving = false

    // An inside-out question starts cut open, laid out facing the camera.
    if (look === 'inside' && parts && !cut.current) {
      o.scale.setScalar(size)
      o.rotation.y = 0
      o.position.y = 0
      o.updateWorldMatrix(true, true)
      cut.current = planCut(o, parts, camera, 0.42)
      cut.current.target = 1
      cut.current.p = 1
      stepCut(cut.current, 0)
    }

    // A close-up looks at the middle of this fruit (a lying papaya is lower than a standing pear).
    if (look === 'closeup' && !st.aimed) {
      o.scale.setScalar(size)
      o.updateWorldMatrix(true, true)
      const mid = new THREE.Box3().setFromObject(o).getCenter(new THREE.Vector3())
      get().camera.lookAt(mid)
      st.aimed = true
    }

    // Turning: a slow spin (silhouette, close-up), a gentle sway (inside out) while asking; once
    // answered, ease back to face the camera so the slice reads.
    if (asking && !still) {
      if (look === 'silhouette') st.angle += dt * 0.75
      else if (look === 'closeup') st.angle += dt * 0.22
      else if (look === 'inside') st.angle = Math.sin(st.t * 0.7) * 0.35
      if (look !== 'hero') moving = true
    } else if (!asking && look === 'inside' && Math.abs(st.angle) > 0.002) {
      st.angle *= Math.exp(-dt * 8)
      moving = true
    }

    // Time reveals: the silhouette's colour, the close-up's pull-back.
    const p = progress()
    if (look === 'silhouette') {
      const want = asking ? Math.min(1, p / 0.8) : 1
      const next = asking ? want : st.reveal + (1 - st.reveal) * Math.min(1, dt * 7)
      if (Math.abs(next - st.reveal) > 0.0005) moving = true
      st.reveal = Math.abs(1 - next) < 0.002 ? 1 : next
      paint?.paint(st.reveal)
      if (asking) moving = true
    }
    if (look === 'closeup') {
      // Zoom out at an even pace to the eye (exponential in field of view); stepped under reduced motion.
      const steps = still ? Math.floor(Math.min(0.99, p) * 4) / 3 : smooth(0.08, 0.95, p)
      const want = asking ? ZOOM_FOV * Math.pow(CAMERA.fov / ZOOM_FOV, steps) : CAMERA.fov
      const next = asking ? want : st.fov + (want - st.fov) * Math.min(1, dt * 6)
      if (Math.abs(next - st.fov) > 0.01) {
        st.fov = next
        setFov(st.fov)
        moving = true
      } else if (!asking && st.fov !== CAMERA.fov) {
        st.fov = CAMERA.fov
        setFov(st.fov)
      }
      if (asking) moving = true
    }

    // Drop in (hero), hop (right answer on a fruit that does not cut, or an inside-out one closing).
    if (st.y > 0 || st.vy !== 0) {
      st.vy -= 20 * dt
      st.y += st.vy * dt
      if (st.y <= 0) {
        st.squash = Math.min(1, -st.vy / 8)
        st.y = 0
        st.vy = -st.vy * 0.32
        if (st.vy < 1) st.vy = 0
      }
      moving = true
    }
    if (st.hopV !== 0 || st.hop > 0) {
      st.hopV -= 20 * dt
      st.hop += st.hopV * dt
      if (st.hop <= 0) {
        st.squash = 0.6
        st.hop = 0
        st.hopV = 0
      }
      moving = true
    }
    st.squash *= Math.exp(-dt * 10)
    if (st.squash > 0.004) moving = true
    let wx = 0
    if (st.wobble > 0.01) {
      st.wobble *= Math.exp(-dt * 3.2)
      wx = Math.sin(st.t * 26) * st.wobble
      moving = true
    } else st.wobble = 0

    o.position.y = st.y + st.hop
    o.rotation.y = st.angle
    o.rotation.z = wx * 0.12
    const sq = st.squash + Math.abs(wx) * 0.5
    o.scale.set(size * (1 + sq * 0.1 + wx * 0.06), size * (1 - sq * 0.18 - wx * 0.06), size * (1 + sq * 0.1))

    if (cut.current && stepCut(cut.current, dt)) moving = true
    if (juice.step(dt)) moving = true
    return moving
  })

  return (
    <>
      <group ref={obj} scale={size}>
        <primitive object={model} />
      </group>
      {juice.element}
      <ShadowFloor colour={shade} opacity={look === 'silhouette' ? 0.3 : 0.4} />
    </>
  )
}
