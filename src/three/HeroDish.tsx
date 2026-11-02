// Now page hero: this month's peak fruit tumble into a sorbet-coloured sundae dish, bounce and settle;
// then the scene sleeps (render on demand). Drag sideways to spin the dish. Tap or swipe across a
// fruit to cut it open: the halves fall apart, show the flesh, seeds or stone, and a little juice
// flies. Tap a cut fruit to put it back together. Bunches and stalks hop instead. The Slice button
// cuts every fruit at once (laid out together inside the bowl by ./dish.ts), and puts them all back.
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { screenPoint, stepCut, useJuice, useSliceGesture, type Cut, type CutNews } from './cutting'
import { dishGeometry, planDish, restPoses, RIM } from './dish'
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
  slice: number      // bumped by the Slice button: cut every fruit open, or put them all back
  onCut: (news: CutNews) => void
  onOpen: (count: number) => void // how many fruit are cut open now (the button reads Put back while any are)
  className?: string
}

export default function HeroDish({ className, fruits, ...props }: HeroDishProps) {
  const few = useMemo(() => fruits.slice(0, 5), [fruits])
  return (
    <Stage className={className} camera={{ position: [0, 2.75, 4.6], fov: 33, target: [0, 0.78, 0] }}>
      <Scene {...props} fruits={few} />
    </Stage>
  )
}

interface Drop { y: number; vy: number; delay: number; squash: number; axis: THREE.Vector3; rest: THREE.Euler; hop: number; hopV: number }

function Scene({ fruits, dish, rim, shade, slice, onCut, onOpen }: Omit<HeroDishProps, 'className'>) {
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
  const poses = useMemo(() => restPoses(models), [models]) // each fruit inside the bowl, clear of the rim
  const order = useMemo(() => fruits.map((_, i) => i).reverse(), [fruits])
  const drops = useRef<Drop[]>(fruits.map((_, i) => ({
    y: still ? 0 : 2.8 + i * 0.25,
    vy: 0,
    delay: still ? 0 : order.indexOf(i) * 0.14,
    squash: 0,
    axis: new THREE.Vector3(Math.sin(i * 12.9), Math.cos(i * 7.3), Math.sin(i * 4.1 + 1)).normalize(), // a fixed tumble per slot
    rest: poses[i].rest,
    hop: 0,
    hopV: 0,
  })))
  const cuts = useRef<(Cut | null)[]>(fruits.map(() => null))
  const wobble = useRef({ v: 0, x: 0 })
  const clock = useRef(0)
  const q = useMemo(() => new THREE.Quaternion(), [])
  const qRest = useMemo(() => new THREE.Quaternion(), [])

  const landed = (i: number) => drops.current[i].y === 0 && drops.current[i].vy === 0

  // Every fruit's cut, planned together (so a fruit tapped open goes where the Slice button would put
  // it), afresh each time one is cut from a whole dish, from wherever the dish has been turned to.
  // Planned from each fruit's resting pose, whatever hop or squash it is in the middle of.
  // Planning all five takes a moment on a phone, so it is done once the dish has settled (idle time)
  // and only redone if the dish has been turned since.
  const plannedAt = useRef<number | null>(null)
  const planQueued = useRef(false)
  const plan = () => {
    const idle = cuts.current.every(c => !c || (c.target === 0 && c.p === 0 && c.v === 0))
    const slots = slotRefs.current
    if (!idle || !slots.every(Boolean) || !fruits.every((_, i) => landed(i))) return
    const angle = spin.state.current.angle
    if (plannedAt.current !== null && Math.abs(plannedAt.current - angle) < 0.01) return
    plannedAt.current = angle
    const keep = slots.map(o => ({ p: o!.position.clone(), q: o!.quaternion.clone(), s: o!.scale.clone() }))
    slots.forEach((o, i) => {
      const r = poses[i]
      o!.position.set(r.x, r.y, r.z)
      o!.quaternion.setFromEuler(r.rest)
      o!.scale.setScalar(r.scale)
    })
    cuts.current = planDish(slots as THREE.Group[], parts, camera)
    slots.forEach((o, i) => { o!.position.copy(keep[i].p); o!.quaternion.copy(keep[i].q); o!.scale.copy(keep[i].s) })
  }
  const openCount = () => cuts.current.filter(c => c?.target === 1).length

  // Cut fruit i open or put it back (`wantOpen` undefined: toggle). Returns whether anything changed.
  const turn = (i: number, wantOpen?: boolean): boolean => {
    const slot = slotRefs.current[i]
    if (!slot || !landed(i)) return false
    if (!parts[i]) {
      // Bunches, berries, bananas and stalks: a happy hop instead of a cut.
      if (!still && wantOpen !== false) drops.current[i].hopV = 3.2
      return false
    }
    const c = cuts.current[i]
    if (!c) return false
    const open = wantOpen ?? c.target === 0
    if ((open ? 1 : 0) === c.target) return false
    c.target = open ? 1 : 0
    if (still) c.p = c.target
    if (open && !still) juice.splash(slot, juiceOf(fruits[i].id, fruits[i].colour))
    return true
  }

  // Tap or swipe on fruit i: cut it open or put it back.
  const act = (i: number, angle: number, wantOpen?: boolean) => {
    plan()
    const was = cuts.current[i]?.target === 1
    if (!turn(i, wantOpen)) return
    onCut({ name: fruits[i].name, open: !was, angle, ...screenPoint(slotRefs.current[i]!, camera, size) })
    onOpen(openCount())
    invalidate()
  }

  // The Slice button: cut every fruit open at once, or put them all back if any are open.
  const lastSlice = useRef(slice)
  useEffect(() => {
    if (slice === lastSlice.current) return
    lastSlice.current = slice
    plan()
    const open = openCount() === 0
    let changed = false
    fruits.forEach((_, i) => { if (turn(i, open)) changed = true })
    if (!changed) return
    const centre = { x: size.width / 2, y: size.height * 0.55 }
    onCut({ name: 'Every fruit', open, angle: -18, ...centre })
    onOpen(openCount())
    invalidate()
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
      const r = poses[i]
      obj.position.set(r.x, r.y + b.y + b.hop, r.z)
      qRest.setFromEuler(b.rest)
      q.setFromAxisAngle(b.axis, b.y * 2.2 + b.hop * 3)
      obj.quaternion.copy(qRest).premultiply(q)
      const s = poses[i].scale
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
    if (!moving && plannedAt.current === null && !planQueued.current) {
      planQueued.current = true
      const later = window.requestIdleCallback ?? ((f: () => void) => setTimeout(f, 200))
      later(() => { planQueued.current = false; plan() })
    }
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

// A sundae coupe (./dish.ts) with a cream lip.
function Dish({ glaze, rim }: { glaze: string; rim: string }) {
  const geo = useMemo(() => dishGeometry(), [])
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
