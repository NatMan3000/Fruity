// Now page hero: this month's peak fruit tumble into a sorbet-coloured sundae dish, bounce and settle;
// then the scene sleeps (render on demand). Drag sideways to spin the dish. Tap or swipe across a
// fruit to cut it open: the halves fall apart, show the flesh, seeds or stone, and a little juice
// flies. Tap a cut fruit to put it back together. Bunches and stalks hop instead.
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { planCut, screenPoint, stepCut, useJuice, useSliceGesture, type Cut, type CutNews } from './cutting'
import { juiceOf } from './flesh'
import { buildFruit, cutParts } from './models'
import { reducedMotion, useAnimation, useSpin, type FruitLike } from './motion'
import { ShadowFloor, Stage } from './stage'

export type { CutNews } from './cutting'

interface HeroDishProps {
  fruits: FruitLike[]
  dish: string       // the dish's glaze (the season's pop)
  rim: string        // its lip (the season's light)
  shade: string      // shadow tint (the season's ink)
  slice: number      // bumped by the Slice button: cut the next whole fruit (or rejoin all)
  onCut: (news: CutNews) => void
  className?: string
}

// Where each fruit comes to rest in the dish: [x, z], the first (top) fruit in the middle, last to land.
const SLOTS: [number, number][] = [[0, 0.06], [-0.68, 0.32], [0.7, 0.34], [-0.42, -0.5], [0.46, -0.46]]
const RIM = 1.42

// Height of the dish's inside surface at radius rho (matches the lathe below).
const insideY = (rho: number) => {
  const t = (2 / Math.PI) * Math.asin(Math.min(1, rho / (RIM - 0.08)))
  return 0.56 + 0.44 * Math.pow(t, 1.8)
}

export default function HeroDish({ className, fruits, ...props }: HeroDishProps) {
  const few = useMemo(() => fruits.slice(0, SLOTS.length), [fruits])
  return (
    <Stage className={className} camera={{ position: [0, 2.75, 4.6], fov: 33, target: [0, 0.78, 0] }}>
      <Scene {...props} fruits={few} />
    </Stage>
  )
}

interface Drop { y: number; vy: number; delay: number; squash: number; axis: THREE.Vector3; rest: THREE.Euler; hop: number; hopV: number }

function Scene({ fruits, dish, rim, shade, slice, onCut }: Omit<HeroDishProps, 'className'>) {
  const { camera, size, invalidate } = useThree()
  const spinGroup = useRef<THREE.Group>(null)
  const dishGroup = useRef<THREE.Group>(null)
  const slotRefs = useRef<(THREE.Group | null)[]>([])
  const held = useRef(false)
  const spin = useSpin(-0.3, 0, held)
  const juice = useJuice()
  const still = reducedMotion()

  const models = useMemo(() => fruits.map(f => buildFruit(f.id, f.colour)), [fruits])
  const parts = useMemo(() => models.map(m => cutParts(m)), [models])
  const order = useMemo(() => fruits.map((_, i) => i).reverse(), [fruits])
  const drops = useRef<Drop[]>(fruits.map((_, i) => ({
    y: still ? 0 : 2.8 + i * 0.25,
    vy: 0,
    delay: still ? 0 : order.indexOf(i) * 0.14,
    squash: 0,
    axis: new THREE.Vector3(Math.sin(i * 12.9), Math.cos(i * 7.3), Math.sin(i * 4.1 + 1)).normalize(), // a fixed tumble per slot
    rest: new THREE.Euler(0, (i * 1.7) % (Math.PI * 2), i === 0 ? 0 : (i % 2 ? 0.18 : -0.18)),
    hop: 0,
    hopV: 0,
  })))
  const cuts = useRef<(Cut | null)[]>(fruits.map(() => null))
  const wobble = useRef({ v: 0, x: 0 })
  const clock = useRef(0)
  const q = useMemo(() => new THREE.Quaternion(), [])
  const qRest = useMemo(() => new THREE.Quaternion(), [])

  const landed = (i: number) => drops.current[i].y === 0 && drops.current[i].vy === 0

  // Tap or swipe on fruit i (or the Slice button): cut it open or put it back.
  const act = (i: number, angle: number, wantOpen?: boolean) => {
    const slot = slotRefs.current[i]
    if (!slot || !landed(i)) return
    const halves = parts[i]
    if (!halves) {
      // Bunches, berries, bananas and stalks: a happy hop instead of a cut.
      if (!still) drops.current[i].hopV = 3.2
      return
    }
    const c = cuts.current[i] ?? (cuts.current[i] = planCut(slot, halves, camera))
    const open = wantOpen ?? c.target === 0
    if ((open ? 1 : 0) === c.target) return
    c.target = open ? 1 : 0
    if (still) c.p = c.target
    if (open && !still) juice.splash(slot, juiceOf(fruits[i].id, fruits[i].colour))
    onCut({ name: fruits[i].name, open, angle, ...screenPoint(slot, camera, size) })
    invalidate()
  }

  // The Slice button: cut the next whole fruit open, or put them all back once every one is open.
  const lastSlice = useRef(slice)
  useEffect(() => {
    if (slice === lastSlice.current) return
    lastSlice.current = slice
    const next = fruits.findIndex((_, i) => parts[i] && cuts.current[i]?.target !== 1 && landed(i))
    if (next >= 0) act(next, -18, true)
    else fruits.forEach((_, i) => { if (cuts.current[i]?.target === 1) act(i, 0, false) })
  })

  const press = useSliceGesture(held, (i, angle, swipe) => act(i, angle, swipe ? true : undefined))

  useAnimation(dt => {
    clock.current += dt
    let moving = spin.step(dt)
    drops.current.forEach((b, i) => {
      const obj = slotRefs.current[i]
      if (!obj) return
      if (clock.current > b.delay && (b.y > 0 || b.vy !== 0)) {
        b.vy -= 22 * dt
        b.y += b.vy * dt
        if (b.y <= 0) {
          const impact = Math.min(1, -b.vy / 9)
          b.y = 0
          b.vy = -b.vy * 0.34
          b.squash = Math.max(b.squash, impact)
          wobble.current.v += impact * 0.9
          if (b.vy < 1.2) b.vy = 0
        }
        moving = true
      }
      // A hop (tapped bunches): up, down, a squash.
      if (b.hopV !== 0 || b.hop > 0) {
        b.hopV -= 22 * dt
        b.hop += b.hopV * dt
        if (b.hop <= 0) {
          b.squash = Math.max(b.squash, 0.6)
          b.hop = 0
          b.hopV = 0
        }
        moving = true
      }
      b.squash *= Math.exp(-dt * 12)
      if (b.squash > 0.005) moving = true
      const [x, z] = SLOTS[i]
      const rest = i === 0 ? insideY(0.1) + 0.2 : insideY(Math.hypot(x, z)) - 0.04
      obj.position.set(x, rest + b.y + b.hop, z)
      qRest.setFromEuler(b.rest)
      q.setFromAxisAngle(b.axis, b.y * 2.2 + b.hop * 3)
      obj.quaternion.copy(qRest).premultiply(q)
      const s = i === 0 ? 1.45 : 1.26
      obj.scale.set(s * (1 + b.squash * 0.12), s * (1 - b.squash * 0.2), s * (1 + b.squash * 0.12))
      const c = cuts.current[i]
      if (c && stepCut(c, dt)) moving = true
    })
    if (juice.step(dt)) moving = true
    // The dish rocks a little on each landing, a damped spring.
    const w = wobble.current
    w.v += -w.x * 140 * dt
    w.v *= Math.exp(-dt * 7)
    w.x += w.v * dt
    if (Math.abs(w.x) > 0.0005 || Math.abs(w.v) > 0.005) moving = true
    if (dishGroup.current) dishGroup.current.rotation.set(w.x * 0.12, 0, -w.x * 0.08)
    if (spinGroup.current) spinGroup.current.rotation.y = spin.state.current.angle
    return moving
  })

  return (
    <>
      <group ref={spinGroup}>
        <group ref={dishGroup}>
          <Dish glaze={dish} rim={rim} />
          {fruits.map((f, i) => (
            <group key={f.id} ref={el => { slotRefs.current[i] = el }} onPointerDown={press(i)}>
              <primitive object={models[i]} />
            </group>
          ))}
        </group>
      </group>
      {juice.element}
      <ShadowFloor colour={shade} />
    </>
  )
}

// A sundae coupe: a foot, a short stem and a wide shallow glazed bowl with a cream lip. One lathe of
// the outside up to the rim and back down the inside.
function Dish({ glaze, rim }: { glaze: string; rim: string }) {
  const geo = useMemo(() => {
    const pts: THREE.Vector2[] = [
      new THREE.Vector2(0.001, 0), new THREE.Vector2(0.62, 0), new THREE.Vector2(0.66, 0.04), new THREE.Vector2(0.6, 0.09),
      new THREE.Vector2(0.22, 0.14), new THREE.Vector2(0.14, 0.2), new THREE.Vector2(0.13, 0.36),
    ]
    for (let i = 0; i <= 18; i++) {
      const t = i / 18
      pts.push(new THREE.Vector2(0.18 + (RIM - 0.18) * Math.sin(t * Math.PI * 0.5), 0.4 + 0.6 * Math.pow(t, 1.6)))
    }
    for (let i = 18; i >= 0; i--) {
      const t = i / 18
      pts.push(new THREE.Vector2(Math.max(0.001, (RIM - 0.08) * Math.sin(t * Math.PI * 0.5)), 0.56 + 0.44 * Math.pow(t, 1.8)))
    }
    const g = new THREE.LatheGeometry(pts, 72)
    g.computeVertexNormals()
    return g
  }, [])
  return (
    <group>
      <mesh geometry={geo} castShadow receiveShadow>
        <meshPhysicalMaterial color={glaze} roughness={0.22} clearcoat={1} clearcoatRoughness={0.06} side={THREE.DoubleSide} />
      </mesh>
      <mesh position-y={1.005} rotation-x={Math.PI / 2} castShadow>
        <torusGeometry args={[RIM - 0.035, 0.05, 12, 72]} />
        <meshPhysicalMaterial color={rim} roughness={0.3} clearcoat={0.8} />
      </mesh>
    </group>
  )
}
