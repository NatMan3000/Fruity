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
import { sfx } from '../audio/sound'
import { juiceOf } from './flesh'
import { buildFruit, cutParts } from './models'
import { reducedMotion, useAnimation, useTopFade, useSpin, type FruitLike } from './motion'
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
  settled?: boolean  // start with the fruit already in the dish (Now was returned to by a back move)
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

// The entrance: the bowl drops in first (from BOWL_FROM above rest, a soft landing), and FRUIT_BEAT
// seconds after it lands the fruit drop into it, FRUIT_GAP apart. Its shadow grows as it comes down, and the
// canvas's top fades in (DROP_FADE px) while anything is falling, so nothing is cut off by a hard edge.
const BOWL_FROM = 2.3
const FRUIT_BEAT = 0.15
const FRUIT_GAP = 0.09
const DROP_FADE = 56
const SHADOW = 0.4
const BLOB_OPACITY = 0.5

// A soft round shadow under the falling bowl. The light's real shadow is the bowl's size however high it is
// (and slid sideways), so it reads as a stain; this one is small and faint while the bowl is high and grows
// in size and darkness as it comes down, handing over to the real shadow over the last of the fall.
function blobTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0, '#fff')
  grad.addColorStop(0.55, '#aaa')
  grad.addColorStop(1, '#000')
  g.fillStyle = grad
  g.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(c)
}
const smooth = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t) }

interface Drop { y: number; vy: number; delay: number; squash: number; axis: THREE.Vector3; rest: THREE.Euler; hop: number; hopV: number; plopped: boolean }

function Scene({ fruits, dish, rim, shade, slice, onCut, onOpen, settled = false }: Omit<HeroDishProps, 'className'>) {
  const { camera, size, invalidate } = useThree()
  const spinGroup = useRef<THREE.Group>(null)
  const dishGroup = useRef<THREE.Group>(null)
  const slotRefs = useRef<(THREE.Group | null)[]>([])
  const held = useRef(false)
  const spin = useSpin(-0.3, 0, held)
  const juice = useJuice()
  const still = reducedMotion()
  const atRest = still || settled
  const bowlGroup = useRef<THREE.Group>(null)
  const shadow = useRef<THREE.ShadowMaterial>(null)
  const blob = useRef<THREE.Mesh>(null)
  const blobMap = useMemo(() => blobTexture(), [])
  const bowl = useRef({ y: atRest ? 0 : BOWL_FROM, vy: 0, squash: 0, landedAt: atRest ? 0 : -1 })
  const fade = useTopFade(!atRest, DROP_FADE)

  const models = useMemo(() => fruits.map(f => buildFruit(f.id, f.colour)), [fruits])
  const parts = useMemo(() => models.map(m => cutParts(m)), [models])
  const poses = useMemo(() => restPoses(models), [models]) // each fruit inside the bowl, clear of the rim
  const order = useMemo(() => fruits.map((_, i) => i).reverse(), [fruits])
  const drops = useRef<Drop[]>(fruits.map((_, i) => ({
    y: atRest ? 0 : 1.6 + i * 0.1,
    vy: 0,
    delay: atRest ? 0 : FRUIT_BEAT + order.indexOf(i) * FRUIT_GAP, // after the bowl lands
    squash: 0,
    axis: new THREE.Vector3(Math.sin(i * 12.9), Math.cos(i * 7.3), Math.sin(i * 4.1 + 1)).normalize(), // a fixed tumble per slot
    rest: poses[i].rest,
    hop: 0,
    hopV: 0,
    plopped: false,
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
    // The bowl drops first: a soft landing (one small bounce, a squash), the dish rocks, the shadow grows.
    const bw = bowl.current
    if (bw.y > 0 || bw.vy !== 0) {
      bw.vy -= 22 * dt
      bw.y += bw.vy * dt
      if (bw.y <= 0) {
        const impact = Math.min(1, -bw.vy / 9)
        bw.y = 0
        bw.vy = -bw.vy * 0.25
        bw.squash = Math.max(bw.squash, impact * 0.8)
        wobble.current.v += impact * 0.5
        if (bw.landedAt < 0) { bw.landedAt = clock.current; sfx.clunk(impact) } // the landing itself, not a timer
        if (bw.vy < 1) bw.vy = 0
      }
      moving = true
    }
    bw.squash *= Math.exp(-dt * 12)
    if (bw.squash > 0.005) moving = true
    if (bowlGroup.current) {
      bowlGroup.current.position.y = bw.y
      bowlGroup.current.scale.set(1 + bw.squash * 0.1, 1 - bw.squash * 0.16, 1 + bw.squash * 0.1)
    }
    const near = 1 - Math.min(1, bw.y / BOWL_FROM) // 0 high up, 1 landed
    const handover = smooth(0.7, 1, near)
    if (shadow.current) shadow.current.opacity = SHADOW * handover
    if (blob.current) {
      const m = blob.current.material as THREE.MeshBasicMaterial
      m.opacity = BLOB_OPACITY * near ** 1.5 * (1 - handover)
      blob.current.scale.setScalar(0.45 + 0.55 * near)
      blob.current.visible = m.opacity > 0.002
    }
    const started = bw.landedAt >= 0 ? clock.current - bw.landedAt : -1
    drops.current.forEach((b, i) => {
      const obj = slotRefs.current[i]
      if (!obj) return
      const falling = b.y > 0 || b.vy !== 0
      obj.visible = !falling || started > b.delay // waiting fruit are not hanging in the air
      if (falling && started <= b.delay) moving = true // keep frames coming through the beat after the bowl lands
      if (started > b.delay && falling) {
        b.vy -= 22 * dt
        b.y += b.vy * dt
        if (b.y <= 0) {
          const impact = Math.min(1, -b.vy / 9)
          b.y = 0
          b.vy = -b.vy * 0.34
          b.squash = Math.max(b.squash, impact)
          if (!b.plopped || impact > 0.15) { b.plopped = true; sfx.plop(i, Math.sqrt(impact)) } // every touch-down, the bounce softer
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
    if (bw.y === 0 && fruits.every((_, i) => landed(i))) fade.clear() // everything is down: the top fade comes off
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
          <group ref={bowlGroup} position-y={atRest ? 0 : BOWL_FROM}>
            <Dish glaze={dish} rim={rim} />
          </group>
          {fruits.map((f, i) => (
            <group key={f.id} ref={el => { slotRefs.current[i] = el }} onPointerDown={press(i)}>
              <primitive object={models[i]} />
            </group>
          ))}
        </group>
      </group>
      {juice.element}
      {!atRest && (
        <mesh ref={blob} rotation-x={-Math.PI / 2} position-y={0.004} scale={0.45}>
          <circleGeometry args={[RIM * 1.25, 48]} />
          <meshBasicMaterial color={shade} alphaMap={blobMap} transparent opacity={0} depthWrite={false} />
        </mesh>
      )}
      <ShadowFloor colour={shade} opacity={SHADOW} material={shadow} />
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
