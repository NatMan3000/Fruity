// Fruit page hero (comp-3d's drop-in): the fruit drops in spinning, bounces, coasts to a stop; then the
// scene sleeps. Drag sideways to turn it, a flick coasts. Tap it, or swipe quickly across it, to cut it
// open (./cutting.tsx, the same cut as the Now dish); tap again to put it back. Bunches and stalks hop.
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { planCut, screenPoint, stepCut, useJuice, useSliceGesture, type Cut, type CutNews } from './cutting'
import { juiceOf } from './flesh'
import { buildFruit, cutParts } from './models'
import { reducedMotion, useAnimation, useSpin, type FruitLike } from './motion'
import { ShadowFloor, Stage } from './stage'

interface SpinFruitProps {
  fruit: FruitLike
  shade: string       // shadow tint (the fruit's ink)
  slice: number       // bumped by the Slice button: cut open, or put back
  onCut: (news: CutNews) => void
  className?: string
}

const SIZE = 1.9

export default function SpinFruit({ className, ...props }: SpinFruitProps) {
  return (
    <Stage className={className} camera={{ position: [0, 1.9, 4.6], fov: 30, target: [0, 0.86, 0] }}>
      <Scene {...props} />
    </Stage>
  )
}

function Scene({ fruit, shade, slice, onCut }: Omit<SpinFruitProps, 'className'>) {
  const { camera, size, invalidate } = useThree()
  const obj = useRef<THREE.Group>(null)
  const held = useRef(false)
  const still = reducedMotion()
  const spin = useSpin(-0.5, 9, held) // arrives spinning one way, coasting to a stop
  const juice = useJuice()
  const fall = useRef({ y: still ? 0 : 2.4, vy: 0, squash: 0, hop: 0, hopV: 0 })
  const model = useMemo(() => buildFruit(fruit.id, fruit.colour), [fruit.id, fruit.colour])
  const halves = useMemo(() => cutParts(model), [model])
  const cut = useRef<Cut | null>(null)

  const act = (angle: number, wantOpen?: boolean) => {
    const o = obj.current
    const f = fall.current
    if (!o || f.y > 0 || f.vy !== 0) return
    if (!halves) {
      if (!still) f.hopV = 3.4
      invalidate()
      return
    }
    const c = cut.current ?? (cut.current = planCut(o, halves, camera, 0.42))
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

  const press = useSliceGesture(held, (_i, angle, swipe) => act(angle, swipe ? true : undefined))

  useAnimation(dt => {
    let moving = spin.step(dt)
    const f = fall.current
    if (f.y > 0 || f.vy !== 0) {
      f.vy -= 20 * dt
      f.y += f.vy * dt
      if (f.y <= 0) {
        f.squash = Math.min(1, -f.vy / 8)
        f.y = 0
        f.vy = -f.vy * 0.32
        if (f.vy < 1) f.vy = 0
      }
      moving = true
    }
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
      o.position.y = f.y + f.hop
      o.rotation.y = spin.state.current.angle
      o.scale.set(SIZE * (1 + f.squash * 0.1), SIZE * (1 - f.squash * 0.18), SIZE * (1 + f.squash * 0.1))
    }
    if (cut.current && stepCut(cut.current, dt)) moving = true
    if (juice.step(dt)) moving = true
    return moving
  })

  return (
    <>
      <group ref={obj} onPointerDown={press(0)}>
        <primitive object={model} />
      </group>
      {juice.element}
      <ShadowFloor colour={shade} opacity={0.45} />
    </>
  )
}
