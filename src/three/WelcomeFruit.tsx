// The welcome screen's fruit (src/components/Welcome.tsx): this month's lead fruit floating and slowly
// turning in the middle of the screen, laid so its cut runs along the knife's line. On a tap whose stroke
// crosses it, it is cut there and then (through its own middle, parallel to the stroke: its pieces are
// built as halves about the middle, so a stroke nearer its rim still opens it in two halves): the pieces
// fly apart along the cut's normal, each turning its cut face to you, juice
// flies, and the welcome's two halves of the screen pull apart the same way. The canvas covers the whole
// screen (transparent) so the pieces can fly anywhere; nothing in it takes a press (the welcome's button
// does).
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useJuice } from './cutting'
import { juiceOf } from './flesh'
import { buildFruit, cutParts } from './models'
import { reducedMotion, useAnimation, type FruitLike } from './motion'
import { Stage } from './stage'

interface WelcomeFruitProps {
  fruit: FruitLike
  size: number              // CSS px: the box the fruit fills (the sticker it replaces is this size)
  angle: number             // the knife's line, CSS degrees (negative rises to the right)
  cut: boolean              // the tap: cut it open and throw the pieces apart
  // Its first frame is on screen (the sticker can go), with a way to read where the fruit is on screen
  // right now: its outline's points in CSS px from the canvas's top left (for the knife: Welcome.tsx).
  onReady: (outline: () => { x: number; y: number }[]) => void
  className?: string
}

const CAMERA: [number, number, number] = [0, 1.1, 4.6]
const FOV = 30
const FILL = 1 // of `size` (its longest way across)

export default function WelcomeFruit({ className, ...props }: WelcomeFruitProps) {
  return (
    <Stage className={className} camera={{ position: CAMERA, fov: FOV, target: [0, 0, 0] }} keyLight={[1.6, 5, 3.4]}>
      <Scene {...props} />
    </Stage>
  )
}

// The fruit's outline for the knife: its outermost points (the hull's support points in 64 directions,
// from up to about 4,000 of its vertices), in its own space, taken once behind the sticker's crossfade.
// At the tap these are put where the fruit is in that frame and projected, so the welcome can tell
// whether the stroke crossed the fruit as it was on screen (it turns, and seen from a little above a
// long fruit like the papaya reaches further across the line end-on than side-on).
function outlineOf(model: THREE.Object3D): THREE.Vector3[] {
  const verts: THREE.Vector3[] = []
  const toModel = new THREE.Matrix4()
  model.updateWorldMatrix(true, true)
  const fromWorld = model.matrixWorld.clone().invert()
  let total = 0
  model.traverse(o => { if ((o as THREE.Mesh).isMesh) total += (o as THREE.Mesh).geometry.getAttribute('position')?.count ?? 0 })
  const stride = Math.max(1, Math.ceil(total / 4000))
  model.traverse(o => {
    const pos = (o as THREE.Mesh).isMesh ? (o as THREE.Mesh).geometry.getAttribute('position') : undefined
    if (!pos) return
    toModel.multiplyMatrices(fromWorld, o.matrixWorld)
    for (let i = 0; i < pos.count; i += stride) verts.push(new THREE.Vector3().fromBufferAttribute(pos, i).applyMatrix4(toModel))
  })
  const out = new Set<THREE.Vector3>()
  const dir = new THREE.Vector3()
  for (let k = 0; k < 64; k++) { // directions spread evenly over a sphere
    const y = 1 - (2 * (k + 0.5)) / 64, r = Math.sqrt(1 - y * y), a = k * Math.PI * (3 - Math.sqrt(5))
    dir.set(Math.cos(a) * r, y, Math.sin(a) * r)
    let best: THREE.Vector3 | undefined, most = -Infinity
    for (const v of verts) { const d = v.dot(dir); if (d > most) { most = d; best = v } }
    if (best) out.add(best)
  }
  return [...out]
}

interface Flying { obj: THREE.Object3D; v: THREE.Vector3; a: THREE.Vector3; axis: THREE.Vector3; w: number }

function Scene({ fruit, size, angle, cut, onReady }: Omit<WelcomeFruitProps, 'className'>) {
  const { size: view, scene, camera, gl } = useThree()
  const still = reducedMotion()
  const tilt = useRef<THREE.Group>(null)
  const float = useRef<THREE.Group>(null)
  const spin = useRef<THREE.Group>(null)
  const juice = useJuice()
  const model = useMemo(() => buildFruit(fruit.id, fruit.colour), [fruit.id, fruit.colour])
  const pieces = useMemo(() => cutParts(model), [model])
  // Lay the fruit so its cut is level (the first piece's face normal straight up): the turn is about
  // that same axis, so the cut stays on the knife's line however far it has turned.
  const lay = useMemo(() => {
    model.updateWorldMatrix(true, true)
    const p = pieces?.[0]
    if (!p) return new THREE.Quaternion()
    const n = p.normal.clone().applyQuaternion(p.part.parent!.getWorldQuaternion(new THREE.Quaternion())).normalize()
    return new THREE.Quaternion().setFromUnitVectors(n, new THREE.Vector3(0, 1, 0))
  }, [model, pieces])
  // Its size (fills FILL of `size`, turned any way: the model fits a unit sphere) and its middle
  const fit = useMemo(() => {
    const dist = new THREE.Vector3(...CAMERA).length()
    const ppu = view.height / (2 * dist * Math.tan((FOV * Math.PI) / 360))
    const mid = new THREE.Box3().setFromObject(model).getCenter(new THREE.Vector3())
    return { scale: (FILL * size) / ppu, mid }
  }, [model, size, view.height])

  const viewNow = useRef(view) // the canvas's size at the tap, not at mount
  viewNow.current = view
  const t = useRef(0)
  const arrive = useRef({ s: still ? 1 : 0.55, v: 0 })
  const flying = useRef<Flying[] | null>(null)

  // Once its first frame is up: get the cut ready now, while the sticker hands over, so the tap itself
  // costs nothing. The cut faces' and the juice's shaders compile and their painted textures upload on
  // first use, which held the first frames after the tap (about 60 ms twice in WebKit, 600 ms on
  // Chromium's software GL). Then say it is ready.
  useEffect(() => {
    let b = 0
    const a = requestAnimationFrame(() => {
      b = requestAnimationFrame(() => {
        const faces: THREE.Object3D[] = []
        model.traverse(o => { if (o.userData.face && !o.visible) { faces.push(o); o.visible = true } })
        try {
          gl.compile(scene, camera)
          model.traverse(o => {
            const m = (o as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined
            for (const mat of m ? [m].flat() : []) {
              for (const v of Object.values(mat)) if (v instanceof THREE.Texture) gl.initTexture(v)
            }
          })
        } catch (error) {
          console.warn('[Fruity] could not warm the welcome fruit up; the cut will compile as it goes', error)
        }
        faces.forEach(f => { f.visible = false })
        const points = outlineOf(model)
        const v = new THREE.Vector3()
        onReady(() => {
          model.updateWorldMatrix(true, false)
          return points.map(p => {
            v.copy(p).applyMatrix4(model.matrixWorld).project(camera)
            return { x: ((v.x + 1) / 2) * viewNow.current.width, y: ((1 - v.y) / 2) * viewNow.current.height }
          })
        })
      })
    })
    return () => { cancelAnimationFrame(a); cancelAnimationFrame(b) }
    // once, on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // The cut: every piece (or, for a fruit that is not cut in pieces, the whole of it) leaves along the
  // cut's normal, away from the middle, speeding up as the screen pulls apart; each turns its cut face
  // to the camera as it goes.
  useEffect(() => {
    if (!cut || flying.current || still) return
    const centre = new THREE.Box3().setFromObject(model).getCenter(new THREE.Vector3())
    const normal = new THREE.Vector3(0, 1, 0).applyQuaternion(tilt.current!.getWorldQuaternion(new THREE.Quaternion()))
    const toCamera = camera.position.clone().sub(centre).normalize()
    const objs = pieces ? pieces.map(p => p.part) : [model]
    model.traverse(o => { if (o.userData.face) o.visible = true })
    juice.splash(model, juiceOf(fruit.id, fruit.colour))
    flying.current = objs.map((obj, k) => {
      const at = new THREE.Box3().setFromObject(obj).getCenter(new THREE.Vector3())
      const off = at.clone().sub(centre).dot(normal)
      const side = Math.abs(off) > 1e-3 ? Math.sign(off) : k % 2 ? -1 : 1
      const speed = 1.5 + 2.2 * Math.min(1, Math.abs(off) / (0.5 * fit.scale))
      const dir = normal.clone().multiplyScalar(side)
      const p = pieces?.[k]
      const face = p ? p.normal.clone().applyQuaternion(p.part.parent!.getWorldQuaternion(new THREE.Quaternion())).normalize() : dir
      const axis = face.clone().cross(toCamera)
      if (axis.lengthSq() < 1e-6) axis.set(1, 0, 0)
      scene.attach(obj) // world space from here on
      return { obj, v: dir.clone().multiplyScalar(speed * fit.scale), a: dir.clone().multiplyScalar(7 * fit.scale), axis: axis.normalize(), w: 3 + (k % 3) * 0.6 }
    })
  }, [cut, still, model, pieces, camera, scene, juice, fruit.id, fruit.colour, fit.scale])

  useAnimation(dt => {
    const f = flying.current
    if (f) {
      for (const p of f) {
        p.v.addScaledVector(p.a, dt)
        p.obj.position.addScaledVector(p.v, dt)
        p.obj.rotateOnWorldAxis(p.axis, p.w * dt)
      }
      juice.step(dt)
      return true
    }
    t.current += dt
    // Arrives with a small spring from the sticker's size, then floats: a slow bob and a slow turn
    const ar = arrive.current
    if (!still) {
      ar.v += ((1 - ar.s) * 120 - ar.v * 11) * dt
      ar.s += ar.v * dt
    }
    const k = fit.scale * ar.s
    float.current?.scale.setScalar(k)
    if (float.current) float.current.position.y = still ? 0 : Math.sin(t.current * 1.6) * 0.045 * fit.scale
    if (spin.current) {
      spin.current.rotation.y = still ? 0.5 : 0.5 + t.current * 0.55
      spin.current.rotation.z = still ? 0 : Math.sin(t.current * 0.9) * 0.08
    }
    return !still || Math.abs(1 - ar.s) > 0.001
  })

  // tilt (the knife's line) > float (bob, size) > turn (about the cut's normal) > lay (cut level) > the
  // model about its middle
  return (
    <>
      <group ref={tilt} rotation-z={(-angle * Math.PI) / 180}>
        <group ref={float}>
          <group ref={spin}>
            <group quaternion={lay}>
              <group position={[-fit.mid.x, -fit.mid.y, -fit.mid.z]}>
                <primitive object={model} />
              </group>
            </group>
          </group>
        </group>
      </group>
      {juice.element}
    </>
  )
}
