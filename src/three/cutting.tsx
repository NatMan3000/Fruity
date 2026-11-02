// Cutting a fruit open, shared by the Now dish (HeroDish) and a fruit's own page (SpinFruit): where the
// halves go, the bouncy spring that moves them, the juice, and the press that decides between a cut
// and a turn. Models are built in halves by ./models.ts `cutBody`; their faces are painted by ./flesh.ts.
import { useEffect, useMemo, useRef, type ReactElement, type RefObject } from 'react'
import * as THREE from 'three'
import { ConvexHull } from 'three/examples/jsm/math/ConvexHull.js'
import type { ThreeEvent } from '@react-three/fiber'
import type { CutPart } from './models'

export interface CutNews {
  name: string
  open: boolean      // true: cut open; false: put back together
  x: number          // where it happened, in CSS px inside the canvas
  y: number
  angle: number      // the knife stroke's angle, degrees
}

interface PartMotion { obj: THREE.Object3D; from: THREE.Vector3; to: THREE.Vector3; fromQ: THREE.Quaternion; toQ: THREE.Quaternion; fromScale: THREE.Vector3; toScale: THREE.Vector3; up: THREE.Vector3 }
export interface Cut { target: 0 | 1; p: number; v: number; parts: PartMotion[] }


// ---------------------------------------------------------------------------
// Overlap. A cut fruit's pieces must never pass through
// each other or through what is left of the fruit (DESIGN.md "The 3D heroes"). The layout below is
// built so they cannot, then checked exactly with convex hulls (`cutOverlaps`, also what the model
// sheet harness fails on).

interface Obb { centre: THREE.Vector3; axes: THREE.Vector3[]; half: number[] }

// An object's own (local) bounding box, as an oriented box in world space (for the layout's extents).
function obbOf(obj: THREE.Object3D): Obb {
  obj.updateWorldMatrix(true, true)
  const inv = obj.matrixWorld.clone().invert()
  const box = new THREE.Box3()
  const v = new THREE.Vector3()
  obj.traverse(o => {
    const mesh = o as THREE.Mesh
    if (!mesh.isMesh) return
    const geo = mesh.geometry
    if (!geo.boundingBox) geo.computeBoundingBox()
    const bb = geo.boundingBox!
    const m = inv.clone().multiply(mesh.matrixWorld)
    for (let i = 0; i < 8; i++) box.expandByPoint(v.set(i & 1 ? bb.max.x : bb.min.x, i & 2 ? bb.max.y : bb.min.y, i & 4 ? bb.max.z : bb.min.z).applyMatrix4(m))
  })
  const e = obj.matrixWorld.elements
  const cols = [0, 4, 8].map(k => new THREE.Vector3(e[k], e[k + 1], e[k + 2]))
  const size = box.getSize(new THREE.Vector3())
  return {
    centre: box.getCenter(new THREE.Vector3()).applyMatrix4(obj.matrixWorld),
    axes: cols.map(c => c.clone().normalize()),
    half: [size.x / 2 * cols[0].length(), size.y / 2 * cols[1].length(), size.z / 2 * cols[2].length()],
  }
}

// The meshes of a fruit that are not inside any cut piece (the banana's other fingers): pieces must
// keep clear of them too.
export function restMeshes(fruit: THREE.Object3D, parts: THREE.Object3D[]): THREE.Object3D[] {
  const inPart = new Set<THREE.Object3D>()
  for (const p of parts) p.traverse(o => inPart.add(o))
  const rest: THREE.Object3D[] = []
  fruit.traverse(o => { if ((o as THREE.Mesh).isMesh && !inPart.has(o)) rest.push(o) })
  return rest
}

// Exact check: each piece's solid body (a half, a slice, a coin) is convex, so a point of one inside
// the other's convex hull is a real overlap. Points are pulled 2% towards their own middle first, so
// pieces that merely touch pass.
function bodyPoints(objs: THREE.Object3D[], solidOnly: boolean): THREE.Vector3[] {
  const pts: THREE.Vector3[] = []
  const v = new THREE.Vector3()
  for (const root of objs) root.traverse(o => {
    const m = o as THREE.Mesh
    if (!m.isMesh || (solidOnly && !m.userData.solid)) return
    m.updateWorldMatrix(true, false)
    const pos = m.geometry.getAttribute('position')
    const every = Math.max(1, Math.floor(pos.count / 200))
    for (let i = 0; i < pos.count; i += every) pts.push(v.fromBufferAttribute(pos, i).applyMatrix4(m.matrixWorld).clone())
  })
  return pts
}
function inside(a: THREE.Vector3[], b: THREE.Vector3[]): boolean {
  if (a.length < 4 || b.length < 4) return false
  const hull = new ConvexHull().setFromPoints(b)
  const c = a.reduce((s, p) => s.add(p), new THREE.Vector3()).multiplyScalar(1 / a.length)
  return a.some(p => hull.containsPoint(p.clone().sub(c).multiplyScalar(0.98).add(c)))
}
const meet = (a: THREE.Vector3[], b: THREE.Vector3[]) => inside(a, b) || inside(b, a)

// What is left of the fruit is not convex (a curved banana finger), so it is checked in short runs of
// consecutive vertices (a few rings of a tube at a time), each close enough to convex.
function restChunks(mesh: THREE.Object3D, run = 64): THREE.Vector3[][] {
  const m = mesh as THREE.Mesh
  m.updateWorldMatrix(true, false)
  const pos = m.geometry.getAttribute('position')
  const chunks: THREE.Vector3[][] = []
  for (let start = 0; start < pos.count; start += run) {
    const pts: THREE.Vector3[] = []
    for (let i = start; i < Math.min(pos.count, start + run + 16); i++) pts.push(new THREE.Vector3().fromBufferAttribute(pos, i).applyMatrix4(m.matrixWorld))
    chunks.push(pts)
  }
  return chunks
}

// Every pair that overlaps as currently posed: piece with piece, and (unless `piecesOnly`) piece with
// the rest of the fruit.
export function cutOverlaps(fruit: THREE.Object3D, parts: THREE.Object3D[], piecesOnly = false): string[] {
  const bodies = parts.map(p => bodyPoints([p], true))
  const out: string[] = []
  for (let i = 0; i < bodies.length; i++) for (let j = i + 1; j < bodies.length; j++) if (meet(bodies[i], bodies[j])) out.push(`piece ${i} x piece ${j}`)
  if (piecesOnly) return out
  restMeshes(fruit, parts).forEach((r, j) => {
    const chunks = restChunks(r)
    bodies.forEach((b, i) => { if (chunks.some(c => meet(b, c))) out.push(`piece ${i} x rest ${j}`) })
  })
  return out
}

// ---------------------------------------------------------------------------
// Layout. Two halves go side by side (left and right as you look at it), `spread` fruit-widths each
// way. More pieces (rings, rounds, stars, coins) all turn the same way, cut face up to you, thin out a
// little, and lie in a shingled row: each one sits on top of the last, raised along the face direction
// by at least its own thickness, so parallel pieces can never meet. A piece marked upright (the
// pineapple's crown) stands at the end of the row. The row moves towards you if it would touch what
// is left of the fruit. Everything rests on whatever the whole fruit rested on.
export function planCut(fruit: THREE.Object3D, parts: CutPart[], camera: THREE.Camera, spread = 0.5): Cut {
  fruit.updateWorldMatrix(true, true)
  const restBox = new THREE.Box3().setFromObject(fruit)
  const centre = restBox.getCenter(new THREE.Vector3())
  const diameter = restBox.getSize(new THREE.Vector3()).length() / Math.sqrt(3)
  const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion).setY(0).normalize()
  const toward = camera.position.clone().sub(centre).setY(0).normalize()
  const face = camera.position.clone().sub(centre).normalize().add(new THREE.Vector3(0, 1.1, 0)).normalize()
  const n = parts.length
  const keep = parts.map(({ part }) => ({ p: part.position.clone(), q: part.quaternion.clone(), s: part.scale.clone() }))
  const world = parts.map(({ part }) => part.getWorldPosition(new THREE.Vector3()))

  // Turn each piece (and thin it) and find where it is: everything below is in world space.
  const pose = (k: number, toQ: THREE.Quaternion, toScale: THREE.Vector3, worldPos: THREE.Vector3) => {
    const { part } = parts[k]
    part.quaternion.copy(toQ)
    part.scale.copy(toScale)
    part.position.copy(part.parent!.worldToLocal(worldPos.clone()))
    part.updateWorldMatrix(true, true)
  }
  const plans = parts.map(({ part, normal, upright }) => {
    const parent = part.parent!
    const parentQ = parent.getWorldQuaternion(new THREE.Quaternion())
    const nWorld = normal.clone().applyQuaternion(parentQ).normalize()
    const toQWorld = upright ? part.getWorldQuaternion(new THREE.Quaternion()) : new THREE.Quaternion().setFromUnitVectors(nWorld, face).multiply(part.getWorldQuaternion(new THREE.Quaternion()))
    const toQ = parentQ.clone().invert().multiply(toQWorld)
    // Slices thin out as they fall (only along their own axis, when it is a box axis).
    const axisAligned = Math.max(Math.abs(normal.x), Math.abs(normal.y), Math.abs(normal.z)) > 0.99
    const thin = n > 2 && !upright && axisAligned ? 0.5 : 1
    const toScale = new THREE.Vector3(Math.abs(normal.x) > 0.99 ? thin : 1, Math.abs(normal.y) > 0.99 ? thin : 1, Math.abs(normal.z) > 0.99 ? thin : 1).multiply(part.scale)
    return { toQ, toScale, nWorld, target: new THREE.Vector3() }
  })

  if (n === 2) {
    let firstSide = 0
    plans.forEach((pl, k) => {
      let side = Math.sign(-pl.nWorld.dot(right)) || 1
      if (k === 0) firstSide = side
      else side = -firstSide
      pl.target = centre.clone().addScaledVector(right, side * diameter * spread)
    })
  } else {
    // Order along the fruit, so pieces lie in the order they were cut.
    const axis = world[n - 1].clone().sub(world[0])
    const flip = axis.dot(right) < 0
    const order = parts.map((_, i) => i).sort((i, j) => (world[i].dot(axis) - world[j].dot(axis)) * (flip ? -1 : 1))
    const flat = order.filter(k => !parts[k].upright), standing = order.filter(k => parts[k].upright)
    const lateral = right.clone().addScaledVector(face, -right.dot(face)).normalize()
    // Extents of each posed piece along the face direction and across.
    const extent = (k: number, dir: THREE.Vector3) => {
      pose(k, plans[k].toQ, plans[k].toScale, centre)
      const o = obbOf(parts[k].part)
      const c = o.centre.dot(dir), r = o.axes.reduce((s, ax, i) => s + Math.abs(ax.dot(dir)) * o.half[i], 0)
      return [c - r - centre.dot(dir), c + r - centre.dot(dir)]
    }
    const widths = flat.map(k => extent(k, lateral))
    const maxW = Math.max(...widths.map(([a, b]) => b - a))
    const step = Math.min(maxW * 0.5, (diameter * 0.9) / Math.max(1, flat.length - 1 + standing.length))
    let lift = 0
    let along = 0
    const gap = diameter * 0.04
    const total = widths.reduce((sum, [a, b]) => sum + (b - a), 0) + gap * (flat.length - 1)
    if (total <= diameter * 1.3) {
      // Small pieces (banana coins) fit side by side: a flat row with gaps, nothing stacked.
      flat.forEach((k, r) => {
        const [lo, hi] = widths[r]
        along += r === 0 ? -lo : -lo + gap
        plans[k].target = centre.clone().addScaledVector(lateral, along)
        along += hi
      })
      along -= widths[widths.length - 1][1] - step // so an upright piece below lands just past the row
    } else {
      flat.forEach((k, r) => {
        const [lo, hi] = extent(k, face)
        const raise = r === 0 ? -lo : lift - lo
        lift = raise + hi + diameter * 0.015
        plans[k].target = centre.clone().addScaledVector(lateral, along).addScaledVector(face, raise)
        along += step
      })
    }
    // An upright piece stands just past the last one, clear of it.
    standing.forEach(k => {
      const [lo] = extent(k, lateral)
      const lastW = widths[widths.length - 1]
      along += (lastW[1] - lastW[0]) * 0.5 - step + Math.max(0, -lo) + diameter * 0.06
      plans[k].target = centre.clone().addScaledVector(lateral, along)
    })
    // Centre the row across, and pull it back by half its climb so it stays over the fruit's spot.
    const shift = lateral.clone().multiplyScalar(-along / 2).addScaledVector(toward, -lift * 0.35)
    plans.forEach(pl => pl.target.add(shift))
  }

  // Pose all, centre the whole layout where the fruit was (across and in depth), rest it on the floor.
  // `anchor` moves it towards you when it has to clear what is left of the fruit.
  const anchor = new THREE.Vector3()
  const settle = () => {
    plans.forEach((pl, k) => pose(k, pl.toQ, pl.toScale, pl.target))
    const box = new THREE.Box3()
    parts.forEach(({ part }) => box.expandByObject(part))
    const mid = box.getCenter(new THREE.Vector3())
    const shift = new THREE.Vector3()
      .addScaledVector(right, centre.clone().sub(mid).dot(right))
      .addScaledVector(toward, centre.clone().sub(mid).dot(toward))
      .add(anchor)
    shift.y = restBox.min.y - box.min.y
    plans.forEach(pl => pl.target.add(shift))
    plans.forEach((pl, k) => pose(k, pl.toQ, pl.toScale, pl.target))
  }
  settle()
  // What is left of the fruit (the banana's other fingers) eases back as the pieces come forward, half
  // each, until they are clear: both stay in frame.
  const restObjs = restMeshes(fruit, parts.map(p => p.part))
  const restKeep = restObjs.map(o => o.position.clone())
  const restShift = new THREE.Vector3()
  const toLocal = (o: THREE.Object3D, v: THREE.Vector3) => {
    const parent = o.parent!
    const origin = parent.worldToLocal(new THREE.Vector3())
    return parent.worldToLocal(v.clone()).sub(origin)
  }
  const applyRest = () => restObjs.forEach((o, i) => {
    o.position.copy(restKeep[i]).add(toLocal(o, restShift))
    o.updateWorldMatrix(false, true)
  })
  // Fast form of the rest check for this loop (a phone runs it on a tap): the rest's hulls are built
  // once where it starts, and pieces are tested against them shifted back, with a bounding-sphere
  // test first so far-apart pairs cost nothing.
  const chunks = restObjs.flatMap(o => restChunks(o)).map(pts => ({ pts, hull: new ConvexHull().setFromPoints(pts), sphere: new THREE.Sphere().setFromPoints(pts) }))
  const hitsRest = () => parts.some(({ part }) => {
    const pts = bodyPoints([part], true).map(p => p.sub(restShift))
    const sphere = new THREE.Sphere().setFromPoints(pts)
    const near = chunks.filter(c => c.sphere.intersectsSphere(sphere))
    if (!near.length) return false
    const c = sphere.center
    const hull = new ConvexHull().setFromPoints(pts)
    return near.some(ch =>
      pts.some(p => ch.hull.containsPoint(p.clone().sub(c).multiplyScalar(0.98).add(c))) ||
      ch.pts.some(p => hull.containsPoint(p)))
  })
  for (let tries = 0; tries < 20 && chunks.length && hitsRest(); tries++) {
    anchor.addScaledVector(toward, diameter * 0.04)
    restShift.addScaledVector(toward, -diameter * 0.04)
    settle()
  }
  applyRest()

  // Last, the exact check: if any two pieces would still touch (two big halves can meet at their
  // edges), stagger them in depth, one back and one forward, and spread the row, until they are clear.
  for (let tries = 0; tries < 12 && cutOverlaps(fruit, parts.map(p => p.part), true).length; tries++) {
    plans.forEach((pl, k) => {
      const sign = k % 2 ? 1 : -1
      pl.target.addScaledVector(toward, sign * diameter * 0.05)
      if (n === 2) pl.target.addScaledVector(right, (Math.sign(pl.target.clone().sub(centre).dot(right)) || 1) * diameter * 0.015)
    })
    settle()
  }

  const motions = plans.map((pl, k): PartMotion => {
    const { part } = parts[k]
    const parent = part.parent!
    const to = parent.worldToLocal(pl.target.clone())
    const parentQ = parent.getWorldQuaternion(new THREE.Quaternion())
    const parentS = parent.getWorldScale(new THREE.Vector3()).x
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(parentQ.clone().invert()).multiplyScalar(1 / parentS)
    return { obj: part, from: keep[k].p.clone(), to, fromQ: keep[k].q.clone(), toQ: pl.toQ, fromScale: keep[k].s.clone(), toScale: pl.toScale, up }
  })
  restObjs.forEach((o, i) => {
    const to = restKeep[i].clone().add(toLocal(o, restShift))
    motions.push({ obj: o, from: restKeep[i].clone(), to, fromQ: o.quaternion.clone(), toQ: o.quaternion.clone(), fromScale: o.scale.clone(), toScale: o.scale.clone(), up: new THREE.Vector3() })
    o.position.copy(restKeep[i])
    o.updateWorldMatrix(false, true)
  })
  // Put everything back as it was: the cut animates from here.
  parts.forEach(({ part }, k) => {
    part.position.copy(keep[k].p)
    part.quaternion.copy(keep[k].q)
    part.scale.copy(keep[k].s)
    part.updateWorldMatrix(false, true)
  })
  return { target: 0, p: 0, v: 0, parts: motions }
}

// One frame of the pieces' bouncy spring towards open or shut, with a little hop on the way.
// Returns true while still moving.
export function stepCut(c: Cut, dt: number): boolean {
  let moving = false
  if (c.p !== c.target || Math.abs(c.v) > 0.001) {
    c.v += ((c.target - c.p) * 170 - c.v * 13) * dt
    c.p += c.v * dt
    if (Math.abs(c.target - c.p) < 0.001 && Math.abs(c.v) < 0.01) { c.p = c.target; c.v = 0 }
    moving = true
  }
  const t = Math.max(0, Math.min(1.12, c.p))
  const arc = Math.sin(Math.PI * Math.min(1, Math.max(0, c.p))) * 0.32
  const s = Math.min(1, t) // never overshoot the thinning: pieces must not grow past themselves
  for (const h of c.parts) {
    h.obj.position.lerpVectors(h.from, h.to, t).addScaledVector(h.up, arc)
    h.obj.quaternion.slerpQuaternions(h.fromQ, h.toQ, t)
    h.obj.scale.lerpVectors(h.fromScale, h.toScale, s)
  }
  return moving
}

// Where an object is on screen, in CSS px inside the canvas (for the knife stroke).
export function screenPoint(obj: THREE.Object3D, camera: THREE.Camera, size: { width: number; height: number }) {
  const ndc = new THREE.Box3().setFromObject(obj).getCenter(new THREE.Vector3()).project(camera)
  return { x: (ndc.x * 0.5 + 0.5) * size.width, y: (-ndc.y * 0.5 + 0.5) * size.height }
}

interface Droplet { pos: THREE.Vector3; vel: THREE.Vector3; life: number }
const DROPS = 18

// A small pool of juice droplets in world space, thrown out when a fruit is cut. `element` goes in the
// scene; `step` runs each frame and returns true while drops are still flying.
export function useJuice(): { element: ReactElement; splash: (from: THREE.Object3D, colour: string) => void; step: (dt: number) => boolean } {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const drops = useRef<Droplet[]>([])
  const geo = useMemo(() => new THREE.SphereGeometry(0.035, 8, 6), [])
  const mat = useMemo(() => new THREE.MeshPhysicalMaterial({ roughness: 0.15, clearcoat: 1 }), [])
  const m = useMemo(() => new THREE.Matrix4(), [])
  const s = useMemo(() => new THREE.Vector3(), [])
  const q = useMemo(() => new THREE.Quaternion(), [])
  return {
    element: <instancedMesh ref={mesh} args={[geo, mat, DROPS]} count={0} frustumCulled={false} />,
    splash(from, colour) {
      const centre = new THREE.Box3().setFromObject(from).getCenter(new THREE.Vector3())
      mat.color.set(colour)
      drops.current = Array.from({ length: DROPS }, (_, k) => {
        const a = (k / DROPS) * Math.PI * 2
        return {
          pos: centre.clone(),
          vel: new THREE.Vector3(Math.cos(a) * (1.2 + (k % 3) * 0.5), 2.2 + (k % 4) * 0.6, Math.sin(a) * (1.2 + (k % 2) * 0.5)),
          life: 0,
        }
      })
    },
    step(dt) {
      const im = mesh.current
      if (!im || !drops.current.length) return false
      drops.current.forEach((d, k) => {
        d.life += dt
        d.vel.y -= 9.8 * dt
        d.pos.addScaledVector(d.vel, dt)
        m.compose(d.pos, q, s.setScalar(Math.max(0, 1 - d.life / 0.75)))
        im.setMatrixAt(k, m)
      })
      im.instanceMatrix.needsUpdate = true
      im.count = drops.current.length
      if (drops.current.every(d => d.life > 0.75)) drops.current = []
      return true
    },
  }
}

// A press that starts on a fruit: a tap toggles it (cut or rejoin); a QUICK sideways swipe across it
// (22 px inside 100 ms, a knife flick)
// cuts it with the knife going the way you swiped; a slower drag is a turn, and is handed back to the
// spin. Vertical swipes never reach here as moves: the canvas is `touch-action: pan-y`, so the page
// scrolls and the press is cancelled.
export function useSliceGesture(held: RefObject<boolean>, onSlice: (i: number, angle: number, swipe: boolean) => void) {
  const grab = useRef<{ i: number; x: number; y: number; t: number; done: boolean } | null>(null)
  const latest = useRef(onSlice)
  useEffect(() => { latest.current = onSlice })
  useEffect(() => {
    const release = () => {
      grab.current = null
      held.current = false
    }
    const move = (e: PointerEvent) => {
      const g = grab.current
      if (!g || g.done) return
      const dx = e.clientX - g.x, dy = e.clientY - g.y
      if (Math.hypot(dx, dy) < 22) return
      if (Math.abs(dx) > Math.abs(dy) * 0.7 && performance.now() - g.t < 100) {
        g.done = true
        latest.current(g.i, (Math.atan2(dy, dx) * 180) / Math.PI, true)
      } else {
        g.done = true
        held.current = false // a turn: the spin takes over from here
      }
    }
    const up = (e: PointerEvent) => {
      const g = grab.current
      release()
      if (g && !g.done && Math.hypot(e.clientX - g.x, e.clientY - g.y) < 10) latest.current(g.i, -18, false)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', release)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', release)
    }
  }, [held])
  return (i: number) => (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    grab.current = { i, x: e.nativeEvent.clientX, y: e.nativeEvent.clientY, t: performance.now(), done: false }
    held.current = true
  }
}
