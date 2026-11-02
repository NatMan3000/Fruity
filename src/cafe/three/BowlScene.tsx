import { createContext, Suspense, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  BallCollider, CapsuleCollider, CuboidCollider, CylinderCollider, Physics, RigidBody,
  type RapierRigidBody,
} from '@react-three/rapier'
import * as THREE from 'three'
import type { Fruit } from '../../types/fruit'
import { traitsOf } from '../logic/traits'
import { BOWL, bowlGeometry, bowlInner, pieceSpec, toon, wholeCollider, wholeParts } from './shapes'

// The 3D bowl: fruit drop in with real physics, a swipe chops, circles stir. Lazy-loaded with
// three and Rapier in their own chunk. It only renders while something moves: the frame loop
// runs on demand and wakes for a drop, a chop or a finger on the bowl, then sleeps again once
// every piece has settled (Rapier puts resting bodies to sleep).

export interface BowlItem {
  key: string
  fruitId: string
  chopped: boolean
  dropX: number // -1 to 1, where it was dropped across the bowl
}

export interface FaceAnchor {
  x: number // px within the stage
  y: number
  width: number
}

export interface BowlSceneProps {
  items: BowlItem[]
  fruits: Fruit[]
  reducedMotion: boolean
  onChop: (key: string, at: { x: number; y: number }) => void
  onStir: (radians: number) => void
  onLand: (key: string) => void
  onFaceAnchor: (a: FaceAnchor) => void
  onTrail: (points: { x: number; y: number }[] | null) => void
}

interface Whole {
  body: RapierRigidBody
  object: THREE.Object3D
  colour: string
}

interface Splash {
  start: number
  colour: THREE.Color
  pos: THREE.Vector3[]
  vel: THREE.Vector3[]
}

// Shared, mutable scene state (refs, not React state: it changes every frame).
class SceneStore {
  wholes = new Map<string, Whole>()
  chopAt = new Map<string, { pos: THREE.Vector3; vel: THREE.Vector3 }>()
  awake = new Set<string>()
  splashes: Splash[] = []
  spoonTarget: THREE.Vector3 | null = null
  gesture = false
  running = false
  holdUntil = 0
  hardStop = 0
  private setRunning: (on: boolean) => void = () => {}

  // Keep rendering for at least `ms`, and until every body sleeps (capped).
  kick(ms = 2500) {
    const now = performance.now()
    this.holdUntil = Math.max(this.holdUntil, now + ms)
    this.hardStop = this.holdUntil + 4000
    if (!this.running) {
      this.running = true
      this.setRunning(true)
    }
  }

  bindRunner(fn: (on: boolean) => void) {
    this.setRunning = fn
    if (this.running) fn(true) // kicked before the runner was bound
    return () => { this.setRunning = () => {} }
  }

  // Called every frame while running: stop once nothing moves.
  maybeStop() {
    if (!this.running || this.gesture) return
    const now = performance.now()
    if (now < this.holdUntil) return
    if ((this.awake.size === 0 && this.splashes.length === 0) || now > this.hardStop) {
      this.running = false
      this.setRunning(false)
    }
  }

  setGesture(on: boolean) {
    this.gesture = on
    if (!on) this.spoonTarget = null
  }

  moveSpoon(to: THREE.Vector3) {
    this.spoonTarget = (this.spoonTarget ?? new THREE.Vector3()).copy(to)
  }

  // Advance juice drops; `draw` gets each live drop.
  stepSplashes(dt: number, draw: (pos: THREE.Vector3, life: number, colour: THREE.Color) => void) {
    const now = performance.now() / 1000
    this.splashes = this.splashes.filter(s => now - s.start < SPLASH_LIFE)
    for (const s of this.splashes) {
      const life = (now - s.start) / SPLASH_LIFE
      for (let i = 0; i < s.pos.length; i++) {
        s.vel[i].y -= 12 * dt
        s.pos[i].addScaledVector(s.vel[i], dt)
        draw(s.pos[i], life, s.colour)
      }
    }
  }
}

const StoreContext = createContext<SceneStore | null>(null)
const useStore = () => useContext(StoreContext)!

// Look a little below the bowl's middle so it sits high in the stage, with room under it for
// the coach line and star pills, and a lower angle so the face on the front wall shows.
const TARGET = new THREE.Vector3(0, 0.05, 0)
const VIEW_DIR = new THREE.Vector3(0, 0.9, 1).normalize()
const FOV = 38

export default function BowlScene(props: BowlSceneProps) {
  const store = useMemo(() => new SceneStore(), [])
  // Physics only steps while the scene is awake. Paused, Rapier stops asking for frames too, so a
  // piece that never quite settles cannot keep the phone rendering.
  const [running, setRunning] = useState(false)
  return (
    <Canvas
      className="cafe-canvas"
      frameloop="demand"
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'default' }}
      camera={{ fov: FOV, near: 0.1, far: 40, position: [0, 3.4, 5] }}
      aria-hidden="true"
    >
      <StoreContext.Provider value={store}>
        <ambientLight intensity={1.4} />
        <directionalLight position={[2.5, 6, 4]} intensity={2.2} />
        <CameraRig onFaceAnchor={props.onFaceAnchor} />
        <LoopGovernor onRunning={setRunning} />
        <Suspense fallback={null}>
          <Physics gravity={[0, props.reducedMotion ? -9 : -14, 0]} timeStep={1 / 60} paused={!running}>
            <BowlBody />
            {props.items.map(item => {
              const fruit = props.fruits.find(f => f.id === item.fruitId)
              if (!fruit) return null
              return item.chopped
                ? <Pieces key={`${item.key}-pieces`} item={item} fruit={fruit} reduced={props.reducedMotion} />
                : <WholeFruit key={`${item.key}-whole`} item={item} fruit={fruit} reduced={props.reducedMotion} onLand={props.onLand} />
            })}
            <Spoon />
          </Physics>
        </Suspense>
        <Splashes reduced={props.reducedMotion} />
        <Gestures onChop={props.onChop} onStir={props.onStir} onTrail={props.onTrail} reduced={props.reducedMotion} />
      </StoreContext.Provider>
    </Canvas>
  )
}

// Fit the bowl and the drop space above it to the stage, then tell the page where the
// bowl's face sits (an SVG overlay drawn by the page).
function CameraRig({ onFaceAnchor }: { onFaceAnchor: (a: FaceAnchor) => void }) {
  const camera = useThree(s => s.camera) as THREE.PerspectiveCamera
  const size = useThree(s => s.size)
  const invalidate = useThree(s => s.invalidate)
  useLayoutEffect(() => {
    const aspect = size.width / Math.max(1, size.height)
    const tan = Math.tan(THREE.MathUtils.degToRad(FOV / 2))
    const dist = Math.max(2.1 / tan, 2.55 / (tan * aspect))
    camera.position.copy(TARGET).addScaledVector(VIEW_DIR, dist)
    camera.lookAt(TARGET)
    camera.updateProjectionMatrix()
    camera.updateMatrixWorld()
    const toPx = (v: THREE.Vector3) => {
      const p = v.clone().project(camera)
      return { x: (p.x * 0.5 + 0.5) * size.width, y: (-p.y * 0.5 + 0.5) * size.height }
    }
    const [x0, y0] = bowlInner(0.55)
    const mid = toPx(new THREE.Vector3(0, y0 - 0.16, x0 + BOWL.wall + 0.02))
    const side = toPx(new THREE.Vector3(x0 * 0.5, y0 - 0.16, (x0 + BOWL.wall) * 0.87))
    onFaceAnchor({ x: mid.x, y: mid.y, width: Math.abs(side.x - mid.x) * 2 })
    invalidate()
  }, [camera, size, onFaceAnchor, invalidate])
  return null
}

function LoopGovernor({ onRunning }: { onRunning: (on: boolean) => void }) {
  const store = useStore()
  const setFrameloop = useThree(s => s.setFrameloop)
  const invalidate = useThree(s => s.invalidate)
  const clock = useThree(s => s.clock)
  useEffect(() => store.bindRunner(on => {
    // Reset the clock first: the first frame after a long rest would otherwise carry the whole
    // idle gap as its time step and fast-forward a falling fruit.
    if (on) clock.getDelta()
    onRunning(on)
    setFrameloop(on ? 'always' : 'demand')
    if (!on) invalidate()
  }), [store, setFrameloop, invalidate, clock, onRunning])
  useFrame(() => store.maybeStop())
  return null
}

// ---------- Bowl ----------

const BOWL_SEGMENTS = 18

function BowlBody() {
  // Physics: a floor disc plus two rings of tilted slabs following the curved wall, and a tall
  // invisible fence above the rim so a flying piece always lands back in the bowl.
  const slabs = useMemo(() => {
    const out: { pos: [number, number, number]; rot: [number, number, number]; half: [number, number, number] }[] = []
    const bands: [number, number][] = [[0, 0.45], [0.45, 1]]
    for (let i = 0; i < BOWL_SEGMENTS; i++) {
      const theta = (i / BOWL_SEGMENTS) * Math.PI * 2
      for (const [t0, t1] of bands) {
        const [x0, y0] = bowlInner(t0)
        const [x1, y1] = bowlInner(t1)
        const rMid = (x0 + x1) / 2
        const len = Math.hypot(x1 - x0, y1 - y0)
        const tilt = Math.atan2(y1 - y0, x1 - x0)
        const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, theta, 0))
          .multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, tilt)))
        const e = new THREE.Euler().setFromQuaternion(q)
        // Push the slab outward by half its thickness so its inner face is the bowl's inside.
        const nx = -Math.sin(tilt) * 0.08
        const ny = Math.cos(tilt) * 0.08
        const r = rMid - nx
        out.push({
          pos: [Math.cos(theta) * r, (y0 + y1) / 2 - ny, -Math.sin(theta) * r],
          rot: [e.x, e.y, e.z],
          half: [len / 2 + 0.04, 0.08, (Math.PI * 2 * x1) / BOWL_SEGMENTS / 2 + 0.05],
        })
      }
    }
    return out
  }, [])

  const fence = useMemo(() => Array.from({ length: 14 }, (_, i) => {
    const theta = (i / 14) * Math.PI * 2
    const r = BOWL.rim + 0.15
    return { pos: [Math.cos(theta) * r, 2.6, -Math.sin(theta) * r] as [number, number, number], rot: [0, theta, 0] as [number, number, number] }
  }), [])

  const shadow = useMemo(() => shadowTexture(), [])
  const bowlMat = useMemo(() => {
    // Pale sky blue, so white and cream pieces (coconut, banana, lychee) still stand out.
    const m = (toon('#FFFFFF') as THREE.MeshToonMaterial).clone()
    m.color.set('#D6EEFF')
    m.side = THREE.DoubleSide
    return m
  }, [])

  return (
    <>
      <RigidBody type="fixed" colliders={false} friction={0.9} restitution={0.2}>
        <CylinderCollider args={[0.08, BOWL.floor + 0.05]} position={[0, BOWL.base - 0.08, 0]} />
        {slabs.map((s, i) => <CuboidCollider key={i} args={s.half} position={s.pos} rotation={s.rot} />)}
        {fence.map((f, i) => <CuboidCollider key={`f${i}`} args={[0.06, 1.6, 0.42]} position={f.pos} rotation={f.rot} />)}
      </RigidBody>
      <mesh geometry={bowlGeometry()} material={bowlMat} />
      {/* Coloured band round the outside and a juicy rim */}
      <mesh position={[0, BOWL.base + BOWL.depth + 0.01, 0]} rotation={[Math.PI / 2, 0, 0]} material={toon('#FF6B6B')}>
        <torusGeometry args={[BOWL.rim + BOWL.wall * 0.55, 0.06, 8, 48]} />
      </mesh>
      <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.6, 4.6]} />
        <meshBasicMaterial map={shadow} transparent depthWrite={false} />
      </mesh>
    </>
  )
}

function shadowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(64, 64, 10, 64, 64, 64)
  grad.addColorStop(0, 'rgba(60,30,20,0.35)')
  grad.addColorStop(0.55, 'rgba(60,30,20,0.18)')
  grad.addColorStop(1, 'rgba(60,30,20,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 128, 128)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

// ---------- Fruit ----------

const rand = (a: number, b: number) => a + Math.random() * (b - a)

function spawnPoint(dropX: number, reduced: boolean): [number, number, number] {
  return [THREE.MathUtils.clamp(dropX, -1, 1) * 0.65, reduced ? 1.7 : 2.9, rand(-0.35, 0.35)]
}

function useAwakeTracking(id: string) {
  const store = useStore()
  useEffect(() => {
    store.awake.add(id)
    store.kick(2200)
    return () => { store.awake.delete(id) }
  }, [store, id])
  return {
    onSleep: () => { store.awake.delete(id) },
    // No kick here: a piece that keeps jiggling awake must not keep the loop running forever.
    onWake: () => { store.awake.add(id) },
  }
}

function WholeFruit({ item, fruit, reduced, onLand }: { item: BowlItem; fruit: Fruit; reduced: boolean; onLand: (key: string) => void }) {
  const store = useStore()
  const t = traitsOf(fruit.id)
  const body = useRef<RapierRigidBody>(null)
  const group = useRef<THREE.Group>(null)
  const landed = useRef(false)
  const awake = useAwakeTracking(`${item.key}-w`)
  const parts = useMemo(() => wholeParts(t.body, t.size, t.skin ?? fruit.colour, fruit.id), [t, fruit])
  const collider = wholeCollider(t.body, t.size)
  const [start] = useMemo(() => [spawnPoint(item.dropX, reduced)], [item.dropX, reduced])

  useEffect(() => {
    if (!body.current || !group.current) return
    group.current.userData.wholeKey = item.key
    store.wholes.set(item.key, { body: body.current, object: group.current, colour: t.flesh ?? fruit.colour })
    return () => { store.wholes.delete(item.key) }
  }, [store, item.key, t, fruit])

  return (
    <RigidBody
      ref={body}
      colliders={false}
      position={start}
      rotation={[rand(-0.4, 0.4), rand(0, Math.PI), rand(-0.4, 0.4)]}
      linearVelocity={[0, reduced ? -0.5 : -1.5, 0]}
      angularVelocity={reduced ? [0, 0, 0] : [rand(-3, 3), rand(-2, 2), rand(-3, 3)]}
      restitution={reduced ? 0.05 : 0.38}
      friction={0.8}
      linearDamping={reduced ? 1.5 : 0.15}
      angularDamping={0.7}
      onSleep={awake.onSleep}
      onWake={awake.onWake}
      onCollisionEnter={() => {
        if (landed.current) return
        landed.current = true
        onLand(item.key)
      }}
    >
      {collider.kind === 'ball'
        ? <BallCollider args={[collider.r]} density={1} />
        : <CapsuleCollider args={[collider.half, collider.r]} rotation={[0, 0, Math.PI / 2]} density={1} />}
      <group ref={group}>
        {parts.map((p, i) => (
          <mesh key={i} geometry={p.geometry} material={toon(p.colour)} position={p.position} rotation={p.rotation} scale={p.scale} />
        ))}
      </group>
    </RigidBody>
  )
}

function Pieces({ item, fruit, reduced }: { item: BowlItem; fruit: Fruit; reduced: boolean }) {
  const store = useStore()
  const t = traitsOf(fruit.id)
  const spec = useMemo(() => pieceSpec(t.cut, t.size, fruit.id), [t, fruit.id])
  const colour = t.cut === 'small' ? (t.skin ?? fruit.colour) : (t.flesh ?? fruit.colour)
  const awake = useAwakeTracking(`${item.key}-p`)
  // Chopped from a whole fruit: burst out from where it was. A small fruit: a handful drops in.
  const starts = useMemo(() => {
    const from = store.chopAt.get(item.key)
    const origin = from?.pos ?? new THREE.Vector3(...spawnPoint(item.dropX, reduced))
    return Array.from({ length: spec.count }, (_, i) => {
      const a = (i / spec.count) * Math.PI * 2 + rand(-0.3, 0.3)
      const spread = from ? 0.18 : 0.22
      const pos: [number, number, number] = [origin.x + Math.cos(a) * spread, origin.y + (from ? 0.05 : i * 0.12), origin.z + Math.sin(a) * spread]
      const burst = reduced ? 0.4 : from ? 2.2 : 0.3
      const vel: [number, number, number] = [Math.cos(a) * burst, from ? (reduced ? 0.5 : rand(2.5, 4)) : -1, Math.sin(a) * burst]
      const rot: [number, number, number] = [rand(0, Math.PI), rand(0, Math.PI), rand(0, Math.PI)]
      const spin: [number, number, number] = reduced ? [0, 0, 0] : [rand(-8, 8), rand(-8, 8), rand(-8, 8)]
      return { pos, vel, rot, spin }
    })
  }, [store, item.key, item.dropX, spec.count, reduced])

  return (
    <>
      {starts.map((s, i) => (
        <RigidBody
          key={i}
          colliders={spec.collider}
          position={s.pos}
          rotation={s.rot}
          linearVelocity={s.vel}
          angularVelocity={s.spin}
          restitution={reduced ? 0.05 : 0.25}
          friction={0.9}
          // Little balls (berries, seeds) would roll round the curved bowl for ages: damp them more.
          linearDamping={reduced ? 1.2 : spec.collider === 'ball' ? 0.6 : 0.2}
          angularDamping={spec.collider === 'ball' ? 2.5 : 0.8}
          onSleep={i === 0 ? awake.onSleep : undefined}
          onWake={i === 0 ? awake.onWake : undefined}
        >
          <mesh geometry={spec.geometry} material={toon(colour)} />
        </RigidBody>
      ))}
    </>
  )
}

// ---------- Spoon ----------

function Spoon() {
  const store = useStore()
  const body = useRef<RapierRigidBody>(null)
  const visual = useRef<THREE.Group>(null)
  const current = useRef(new THREE.Vector3(0, -6, 0))
  const parked = useMemo(() => new THREE.Vector3(0, -6, 0), [])
  useFrame(() => {
    const target = store.spoonTarget ?? parked
    // Ease toward the finger so a fast flick does not teleport through the fruit.
    if (store.spoonTarget && current.current.y < -1) current.current.copy(target)
    else current.current.lerp(target, store.spoonTarget ? 0.45 : 1)
    body.current?.setNextKinematicTranslation(current.current)
    if (visual.current) {
      visual.current.visible = !!store.spoonTarget
      visual.current.position.copy(current.current)
    }
  })
  return (
    <>
      <RigidBody ref={body} type="kinematicPosition" colliders={false} position={[0, -6, 0]}>
        <BallCollider args={[0.2]} />
      </RigidBody>
      <group ref={visual} visible={false}>
        <mesh scale={[1, 0.45, 1.25]} material={toon('#E0A86A')}>
          <sphereGeometry args={[0.2, 12, 8]} />
        </mesh>
        <mesh position={[0, 0.85, 0.45]} rotation={[0.5, 0, 0]} material={toon('#C98A4B')}>
          <cylinderGeometry args={[0.045, 0.06, 1.8, 8]} />
        </mesh>
      </group>
    </>
  )
}

// ---------- Juice ----------

const MAX_PARTICLES = 60
const SPLASH_LIFE = 0.75

function Splashes({ reduced }: { reduced: boolean }) {
  const store = useStore()
  const mesh = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const geometry = useMemo(() => new THREE.SphereGeometry(0.05, 6, 4), [])
  const material = useMemo(() => new THREE.MeshBasicMaterial({ toneMapped: false }), [])
  useFrame((_, delta) => {
    const m = mesh.current
    if (!m) return
    let n = 0
    store.stepSplashes(Math.min(delta, 0.05), (pos, life, colour) => {
      if (n >= MAX_PARTICLES) return
      dummy.position.copy(pos)
      dummy.scale.setScalar((1 - life) * (reduced ? 0.8 : 1.3))
      dummy.updateMatrix()
      m.setMatrixAt(n, dummy.matrix)
      m.setColorAt(n, colour)
      n++
    })
    m.count = n
    m.instanceMatrix.needsUpdate = true
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  })
  return <instancedMesh ref={mesh} args={[geometry, material, MAX_PARTICLES]} frustumCulled={false} />
}

// ---------- Gestures: swipe to chop, circle to stir ----------

const STIR_PLANE = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.5)

function Gestures({ onChop, onStir, onTrail, reduced }: Pick<BowlSceneProps, 'onChop' | 'onStir' | 'onTrail'> & { reduced: boolean }) {
  const store = useStore()
  const gl = useThree(s => s.gl)
  const camera = useThree(s => s.camera)
  const size = useThree(s => s.size)
  const handlers = useRef({ onChop, onStir, onTrail })
  useEffect(() => { handlers.current = { onChop, onStir, onTrail } })

  useEffect(() => {
    const el = gl.domElement
    const raycaster = new THREE.Raycaster()
    const ndc = new THREE.Vector2()
    const hitPoint = new THREE.Vector3()
    let down = false
    let last: { x: number; y: number } | null = null
    let lastAngle: number | null = null
    let swirl = 0     // signed turn this touch has made round the bowl
    let credited = 0  // how much of it has already counted as stirring
    let trail: { x: number; y: number }[] = []

    const local = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    const toNdc = (p: { x: number; y: number }) => {
      ndc.set((p.x / size.width) * 2 - 1, -(p.y / size.height) * 2 + 1)
      raycaster.setFromCamera(ndc, camera)
    }

    const chopAt = (p: { x: number; y: number }) => {
      if (store.wholes.size === 0) return
      toNdc(p)
      const objects = [...store.wholes.values()].map(w => w.object)
      const hit = raycaster.intersectObjects(objects, true)[0]
      if (!hit) return
      let o: THREE.Object3D | null = hit.object
      while (o && !o.userData.wholeKey) o = o.parent
      const key = o?.userData.wholeKey as string | undefined
      const whole = key ? store.wholes.get(key) : undefined
      if (!key || !whole) return
      const tr = whole.body.translation()
      const lv = whole.body.linvel()
      const pos = new THREE.Vector3(tr.x, tr.y, tr.z)
      store.chopAt.set(key, { pos, vel: new THREE.Vector3(lv.x, lv.y, lv.z) })
      store.wholes.delete(key)
      const count = reduced ? 8 : 16
      store.splashes.push({
        start: performance.now() / 1000,
        colour: new THREE.Color(whole.colour),
        pos: Array.from({ length: count }, () => pos.clone().add(new THREE.Vector3(rand(-0.1, 0.1), rand(0, 0.15), rand(-0.1, 0.1)))),
        vel: Array.from({ length: count }, () => new THREE.Vector3(rand(-2.2, 2.2), rand(2, reduced ? 3 : 5), rand(-2.2, 2.2))),
      })
      store.kick(1800)
      handlers.current.onChop(key, p)
    }

    // Swipes are sampled every few pixels so a fast flick still cuts what it crosses.
    const sweep = (a: { x: number; y: number }, b: { x: number; y: number }) => {
      const steps = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 8))
      for (let i = 1; i <= steps; i++) chopAt({ x: a.x + ((b.x - a.x) * i) / steps, y: a.y + ((b.y - a.y) * i) / steps })
    }

    const stirTo = (p: { x: number; y: number }) => {
      toNdc(p)
      if (!raycaster.ray.intersectPlane(STIR_PLANE, hitPoint)) return
      const r = Math.hypot(hitPoint.x, hitPoint.z)
      const maxR = 1.15
      if (r > maxR) hitPoint.multiplyScalar(maxR / r)
      hitPoint.y = 0.36
      store.moveSpoon(hitPoint)
      // A straight swipe across the bowl turns at most half a circle, and back-and-forth
      // wiggles cancel out, so only turning past half a circle in one direction counts.
      const angle = Math.atan2(hitPoint.z, hitPoint.x)
      if (lastAngle !== null && r > 0.3) {
        let d = angle - lastAngle
        if (d > Math.PI) d -= Math.PI * 2
        if (d < -Math.PI) d += Math.PI * 2
        swirl += THREE.MathUtils.clamp(d, -Math.PI / 3, Math.PI / 3)
        const earned = Math.max(0, Math.abs(swirl) - Math.PI)
        if (earned - credited > 0.4) {
          handlers.current.onStir(earned - credited)
          credited = earned
        }
      }
      lastAngle = angle
    }

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return
      el.setPointerCapture(e.pointerId)
      down = true
      store.setGesture(true)
      store.kick(1500)
      const p = local(e)
      last = p
      lastAngle = null
      swirl = 0
      credited = 0
      trail = [p]
      chopAt(p)
      stirTo(p)
      handlers.current.onTrail(trail)
    }
    const onMove = (e: PointerEvent) => {
      if (!down || !last) return
      const p = local(e)
      sweep(last, p)
      stirTo(p)
      last = p
      trail.push(p)
      if (trail.length > 14) trail.shift()
      handlers.current.onTrail([...trail])
    }
    const onUp = (e: PointerEvent) => {
      if (!down) return
      down = false
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId)
      store.setGesture(false)
      const earned = Math.max(0, Math.abs(swirl) - Math.PI)
      if (earned > credited) handlers.current.onStir(earned - credited)
      last = null
      store.kick(1200)
      handlers.current.onTrail(null)
    }

    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
    return () => {
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
    }
  }, [gl, camera, size, store, reduced])
  return null
}
