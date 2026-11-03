// Fruit page hero (comp-3d's drop-in): the fruit drops in spinning, bounces, coasts to a stop; then the
// scene sleeps. Drag the fruit in any direction to turn it freely (./motion.ts useTrackball), a flick
// coasts. Tap it, or swipe quickly across it, to cut it open (./cutting.tsx, the same cut as the Now
// dish); tap again to put it back. Bunches and stalks hop.
// Framing (Nathan, 3 Nov 2026: the fruit sat low in its blob with the top third empty): each fruit is
// sized to fill about two thirds of the blob (FruitHero's BLOB), and the camera looks at its middle, so
// it sits in the blob's centre; when cut, the camera eases to the middle of the pieces (pulling back a
// little if they spread wider than the blob).
import { useEffect, useMemo, useRef, type CSSProperties } from 'react'
import * as THREE from 'three'
import { useThree, type ThreeEvent } from '@react-three/fiber'
import { planCut, screenPoint, stepCut, useJuice, useSliceGesture, type Cut, type CutNews } from './cutting'
import { juiceOf } from './flesh'
import { buildFruit, cutParts } from './models'
import { reducedMotion, useAnimation, useTopFade, useTrackball, type FruitLike } from './motion'
import { BLOB } from './framing'
import { ShadowFloor, Stage } from './stage'
import { sfx } from '../audio/sound'

interface SpinFruitProps {
  fruit: FruitLike
  shade: string       // shadow tint (the fruit's ink)
  slice: number       // bumped by the Slice button: cut open, or put back
  onCut: (news: CutNews) => void
  settled?: boolean   // start at rest, as it was left (the page was returned to by a back move)
  className?: string
  style?: CSSProperties
}

const FILL = 0.66 // of the blob (./framing.ts)
const VIEW = new THREE.Vector3(0, 1.04, 4.6) // camera offset from what it looks at
const FOV = 30

export default function SpinFruit({ className, style, ...props }: SpinFruitProps) {
  return (
    <Stage className={className} style={style} keyLight={[1.4, 6, 2.2]} camera={{ position: [0, 1.9, 4.6], fov: FOV, target: [0, 0.86, 0] }}>
      <Scene {...props} />
    </Stage>
  )
}

// While the fruit drops in from above the canvas, the canvas's top fades in over this many CSS px, so the
// fruit appears through a soft edge instead of a hard line just under the top bar; the fade comes off
// once it has landed, so nothing at rest or turned is ever faded.
const DROP_FADE = 56

function Scene({ fruit, shade, slice, onCut, settled = false }: Omit<SpinFruitProps, 'className' | 'style'>) {
  const { camera, size, invalidate } = useThree()
  const obj = useRef<THREE.Group>(null)
  const held = useRef(false)
  const still = reducedMotion()
  const atRest = still || settled
  const spin = useTrackball(-0.5, atRest ? 0 : 9, held) // arrives spinning one way, coasting to a stop
  const pivot = useRef<THREE.Group>(null)
  const juice = useJuice()
  const fall = useRef({ y: atRest ? 0 : 2.4, vy: 0, squash: 0, hop: 0, hopV: 0, plopped: atRest })
  const fade = useTopFade(!atRest, DROP_FADE)
  const model = useMemo(() => buildFruit(fruit.id, fruit.colour), [fruit.id, fruit.colour])
  const halves = useMemo(() => cutParts(model), [model])
  const cut = useRef<Cut | null>(null)
  // The fruit's size (so it fills FILL of the blob as it rests) and its middle (what it turns about)
  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(model)
    const dims = box.getSize(new THREE.Vector3())
    const ppu = size.height / (2 * VIEW.length() * Math.tan((FOV * Math.PI) / 360)) // CSS px per unit at the fruit
    const across = Math.max(dims.x, dims.z), tall = dims.y
    // ...and never so big that, turned any way, it leaves the canvas (the model fits a unit sphere)
    const scale = Math.min((FILL * Math.min(BLOB.width / across, BLOB.height / tall)) / ppu, (0.92 * size.height) / ppu)
    return { scale, mid: box.getCenter(new THREE.Vector3()).y, ppu }
  }, [model, size.height])
  const frame = useRef({ whole: 0, cut: 0, cutPull: 1 }) // camera target heights and pull-back for whole and cut

  // Where the camera looks: the middle of the fruit, or of the laid-out pieces once cut
  const frameCut = (c: Cut) => {
    const keep = c.parts.map(h => [h.obj.position.clone(), h.obj.quaternion.clone(), h.obj.scale.clone()] as const)
    c.parts.forEach(h => { h.obj.position.copy(h.to); h.obj.quaternion.copy(h.toQ); h.obj.scale.copy(h.toScale) })
    obj.current!.updateWorldMatrix(true, true)
    const box = new THREE.Box3().setFromObject(obj.current!)
    c.parts.forEach((h, k) => { h.obj.position.copy(keep[k][0]); h.obj.quaternion.copy(keep[k][1]); h.obj.scale.copy(keep[k][2]) })
    obj.current!.updateWorldMatrix(true, true)
    const dims = box.getSize(new THREE.Vector3())
    frame.current.cut = box.getCenter(new THREE.Vector3()).y
    frame.current.cutPull = Math.max(1, (dims.x * fit.ppu) / (0.84 * BLOB.width), (dims.y * fit.ppu) / (0.84 * BLOB.height))
  }
  const look = (p: number) => {
    const f = frame.current
    const t = Math.max(0, Math.min(1, p))
    const y = f.whole + (f.cut - f.whole) * t
    const pull = 1 + (f.cutPull - 1) * t
    camera.position.set(0, y, 0).addScaledVector(VIEW, pull)
    camera.lookAt(0, y, 0)
  }
  const act = (angle: number, wantOpen?: boolean) => {
    const o = obj.current
    const f = fall.current
    if (!o || f.y > 0 || f.vy !== 0) return
    if (!halves) {
      if (!still) f.hopV = 3.4
      invalidate()
      return
    }
    // Plan the cut afresh from wherever it has been turned to (only while it is whole and still)
    if (!cut.current || (cut.current.target === 0 && cut.current.p === 0)) {
      cut.current = planCut(o, halves, camera, 0.42)
      frameCut(cut.current)
    }
    const c = cut.current
    const open = wantOpen ?? c.target === 0
    if ((open ? 1 : 0) === c.target) return
    c.target = open ? 1 : 0
    if (still) c.p = c.target
    if (open && !still) juice.splash(o, juiceOf(fruit.id, fruit.colour))
    onCut({ name: fruit.name, open, angle, ...screenPoint(o, camera, size) })
    invalidate()
  }

  const lastSlice = useRef(slice)
  useEffect(() => {
    if (slice === lastSlice.current) return
    lastSlice.current = slice
    act(-18)
  })

  const slicePress = useSliceGesture(held, (_i, angle, swipe) => act(angle, swipe ? true : undefined))
  const press = (e: ThreeEvent<PointerEvent>) => {
    spin.grab(e.nativeEvent)
    slicePress(0)(e)
  }

  useEffect(() => {
    frame.current.whole = fit.mid * fit.scale
    look(cut.current?.p ?? 0)
    invalidate()
  })

  useAnimation(dt => {
    let moving = spin.step(dt)
    const f = fall.current
    if (f.y > 0 || f.vy !== 0) {
      f.vy -= 20 * dt
      f.y += f.vy * dt
      if (f.y <= 0) {
        f.squash = Math.min(1, -f.vy / 8)
        f.y = 0
        if (!f.plopped) { f.plopped = true; sfx.plop() } // the same plop as a fruit landing in the Now dish, first touch only
        f.vy = -f.vy * 0.32
        if (f.vy < 1) f.vy = 0
      }
      moving = true
    } else fade.clear() // landed and settled: the top fade comes off
    if (f.hopV !== 0 || f.hop > 0) {
      f.hopV -= 20 * dt
      f.hop += f.hopV * dt
      if (f.hop <= 0) {
        f.squash = 0.6
        f.hop = 0
        f.hopV = 0
      }
      moving = true
    }
    f.squash *= Math.exp(-dt * 10)
    if (f.squash > 0.004) moving = true
    const o = obj.current
    if (o) {
      const k = fit.scale
      o.position.y = f.y + f.hop
      o.scale.set(k * (1 + f.squash * 0.1), k * (1 - f.squash * 0.18), k * (1 + f.squash * 0.1))
    }
    pivot.current?.quaternion.copy(spin.state.current.q)
    if (cut.current && stepCut(cut.current, dt)) moving = true
    look(cut.current?.p ?? 0)
    if (juice.step(dt)) moving = true
    return moving
  })

  return (
    <>
      {/* squash and drop (world-aligned, from the floor) > turn (about the fruit's middle) > the model */}
      <group ref={obj} onPointerDown={press}>
        <group ref={pivot} position-y={fit.mid}>
          <group position-y={-fit.mid}>
            <primitive object={model} />
          </group>
        </group>
      </group>
      {juice.element}
      <ShadowFloor colour={shade} opacity={0.45} />
    </>
  )
}
