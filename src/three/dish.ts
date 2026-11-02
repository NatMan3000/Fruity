// The Now page's sundae dish, without React: where each fruit rests in it, the bowl's shape, and the
// dish-wide cut (`planDish`), shared by the hero (HeroDish.tsx) and the model sheet's dish check
// (src/dev/model-sheet.ts), so the check tests exactly what the app draws.
//
// Cutting every fruit in the dish at once (the Slice button): each fruit is cut as on its own page
// (`planCut`: halves side by side, rounds in a row, pieces never meeting), then the dish fits the
// open fruit together. Seen from above, each open fruit (all its pieces, as one rigid group) is a
// convex outline; the outlines are pushed apart until no two meet and each sits inside the bowl, clear
// of the rim. If they cannot all fit, every open fruit shrinks a little (about its own middle) and the
// fit runs again. Last, each group drops to rest on the bowl's inside. Outlines that do not meet from
// above cannot meet in 3D, so nothing passes through anything.
import * as THREE from 'three'
import { cutOverlaps, planCut, solidsMeet, stepCut, type Cut } from './cutting'
import type { CutPart } from './models'

// Where each fruit comes to rest in the dish: [x, z], the first (top) fruit in the middle, last to land.
export const SLOTS: [number, number][] = [[0, 0.06], [-0.68, 0.32], [0.7, 0.34], [-0.42, -0.5], [0.46, -0.46]]
export const RIM = 1.42
const INNER = RIM - 0.08          // the bowl's inside radius at its lip
const RIM_INNER = RIM - 0.085     // the inner edge of the rim's tube (radius RIM - 0.035, tube 0.05)
export const BOWL_KEEP = RIM - 0.15 // cut pieces stay inside this radius: a clear gap inside the rim

// Height of the dish's inside surface at radius rho (matches the lathe below).
export const insideY = (rho: number) => {
  const t = (2 / Math.PI) * Math.asin(Math.min(1, rho / INNER))
  return 0.56 + 0.44 * Math.pow(t, 1.8)
}

// A fruit's resting pose in slot i: the top fruit sits higher, on the others, and a little bigger.
export function slotRest(i: number): { x: number; y: number; z: number; scale: number; rest: THREE.Euler } {
  const [x, z] = SLOTS[i]
  return {
    x,
    y: i === 0 ? insideY(0.1) + 0.2 : insideY(Math.hypot(x, z)) - 0.04,
    z,
    scale: i === 0 ? 1.45 : 1.26,
    rest: new THREE.Euler(0, (i * 1.7) % (Math.PI * 2), i === 0 ? 0 : (i % 2 ? 0.18 : -0.18)),
  }
}

export type RestPose = ReturnType<typeof slotRest>

// Where each fruit (`models[i]`, built at unit size) rests in the dish, whole: every one inside the
// bowl, clear of the rim and of each other (audit follow-up, 3 Nov 2026: a rhubarb stalk and a grape
// bunch leaned over the rim, and the fruit sat inside one another). Each starts at its slot; a fruit
// that would reach the rim there (a long stalk) is turned about the vertical to the nearest angle that
// keeps it in, or the one that comes closest. Then, seen from above, the fruit are pushed apart and
// pulled in like the cut pieces (`pack`), all shrinking together a little if five will not fit, and
// each settles onto the bowl's inside.
export function restPoses(models: THREE.Object3D[]): RestPose[] {
  const q = new THREE.Quaternion()
  const m = new THREE.Matrix4()
  const items = models.map((model, i) => {
    const base = slotRest(i)
    model.updateMatrixWorld(true)
    const local = pointsIn([model], model.matrixWorld.clone().invert())
    const posed = (yaw: number) => {
      const rest = new THREE.Euler(base.rest.x, yaw, base.rest.z)
      m.compose(new THREE.Vector3(base.x, base.y, base.z), q.setFromEuler(rest), new THREE.Vector3(base.scale, base.scale, base.scale))
      const pts = local.map(p => p.clone().applyMatrix4(m))
      return { rest, pts, far: Math.max(...pts.map(p => Math.hypot(p.x, p.z))) }
    }
    // The slot's own turn first, then turns ever further from it either way; else the best of them.
    let pick = posed(base.rest.y)
    for (let k = 1; k <= 36 && pick.far > BOWL_KEEP; k++) {
      const t = posed(base.rest.y + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * (Math.PI / 18))
      if (t.far < pick.far) pick = t
    }
    return { base, rest: pick.rest, pts: pick.pts, outline: hull2(pick.pts.map(p => [p.x, p.z] as P2)), pivot: [base.x, base.z] as P2, d: [0, 0] as P2 }
  })
  const s = pack(items, [], 0.02)
  return items.map(({ base, rest, pts, pivot, d }) => {
    // Scaled about the slot's own origin, moved by the fit, then lowered or raised to rest on the bowl.
    let dy = -Infinity
    for (const p of pts) {
      const x = pivot[0] + s * (p.x - pivot[0]) + d[0], z = pivot[1] + s * (p.z - pivot[1]) + d[1]
      const y = base.y + s * (p.y - base.y)
      dy = Math.max(dy, insideY(Math.hypot(x, z)) - REST_NESTLE - y)
    }
    return { x: base.x + d[0], y: base.y + dy, z: base.z + d[1], scale: base.scale * s, rest }
  })
}
// How far a resting fruit may sit into the glaze (so it reads as resting in it, not hovering).
const REST_NESTLE = 0.02

// A sundae coupe: a foot, a short stem and a wide shallow glazed bowl with a cream lip. One lathe of
// the outside up to the rim and back down the inside.
export function dishGeometry(): THREE.LatheGeometry {
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
    pts.push(new THREE.Vector2(Math.max(0.001, INNER * Math.sin(t * Math.PI * 0.5)), 0.56 + 0.44 * Math.pow(t, 1.8)))
  }
  const g = new THREE.LatheGeometry(pts, 72)
  g.computeVertexNormals()
  return g
}

// ---------------------------------------------------------------------------
// 2D outlines (x, z as seen from above)

type P2 = [number, number]

// Every vertex of the meshes under `objs` (a sample of big ones), in `frame`'s coordinates.
function pointsIn(objs: THREE.Object3D[], frame: THREE.Matrix4): THREE.Vector3[] {
  const pts: THREE.Vector3[] = []
  const m = new THREE.Matrix4()
  for (const root of objs) root.traverse(o => {
    const mesh = o as THREE.Mesh
    if (!mesh.isMesh) return
    mesh.updateWorldMatrix(true, false)
    m.multiplyMatrices(frame, mesh.matrixWorld)
    for (const sub of solidPoints(mesh, m)) pts.push(...sub)
  })
  return pts
}

// A mesh's vertices (a sample of big ones) through `m`: one list, or one per instance for an instanced
// mesh (a grape bunch is one sphere drawn 22 times; its geometry alone is a single berry).
function solidPoints(mesh: THREE.Mesh, m: THREE.Matrix4): THREE.Vector3[][] {
  const pos = mesh.geometry.getAttribute('position')
  const every = Math.max(1, Math.floor(pos.count / 300))
  const inst = mesh as THREE.InstancedMesh
  const each = (mm: THREE.Matrix4) => {
    const out: THREE.Vector3[] = []
    for (let i = 0; i < pos.count; i += every) out.push(new THREE.Vector3().fromBufferAttribute(pos, i).applyMatrix4(mm))
    return out
  }
  if (!inst.isInstancedMesh) return [each(m)]
  const im = new THREE.Matrix4()
  return Array.from({ length: inst.count }, (_, k) => { inst.getMatrixAt(k, im); return each(m.clone().multiply(im)) })
}

// Each convex-ish solid under `root` in world space: every mesh, every instance on its own.
function meshSolids(root: THREE.Object3D): THREE.Vector3[][] {
  const out: THREE.Vector3[][] = []
  root.traverse(o => {
    const mesh = o as THREE.Mesh
    if (!mesh.isMesh) return
    mesh.updateWorldMatrix(true, false)
    out.push(...solidPoints(mesh, mesh.matrixWorld))
  })
  return out
}

// Convex hull (monotone chain), counter-clockwise.
function hull2(points: P2[]): P2[] {
  const p = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1])
  if (p.length < 3) return p
  const cross = (o: P2, a: P2, b: P2) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const lower: P2[] = [], upper: P2[] = []
  for (const q of p) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], q) <= 0) lower.pop()
    lower.push(q)
  }
  for (let i = p.length - 1; i >= 0; i--) {
    const q = p[i]
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], q) <= 0) upper.pop()
    upper.push(q)
  }
  return lower.slice(0, -1).concat(upper.slice(0, -1))
}

// How far two convex outlines overlap (with `gap` of clearance wanted): the shortest push that
// separates them, pointing from a to b, or null when they are already that far apart.
function push(a: P2[], b: P2[], gap: number): P2 | null {
  let best = Infinity
  let axis: P2 = [0, 0]
  for (const poly of [a, b]) {
    for (let i = 0; i < poly.length; i++) {
      const [x1, z1] = poly[i], [x2, z2] = poly[(i + 1) % poly.length]
      const len = Math.hypot(x2 - x1, z2 - z1)
      if (len < 1e-9) continue
      const n: P2 = [(z2 - z1) / len, -(x2 - x1) / len]
      let aMin = Infinity, aMax = -Infinity, bMin = Infinity, bMax = -Infinity
      for (const [x, z] of a) { const d = x * n[0] + z * n[1]; aMin = Math.min(aMin, d); aMax = Math.max(aMax, d) }
      for (const [x, z] of b) { const d = x * n[0] + z * n[1]; bMin = Math.min(bMin, d); bMax = Math.max(bMax, d) }
      const over = Math.min(aMax, bMax) - Math.max(aMin, bMin) + gap
      if (over <= 0) return null
      if (over < best) {
        best = over
        // Push b the way that takes the shorter route out.
        axis = (aMax + aMin) / 2 <= (bMax + bMin) / 2 ? n : [-n[0], -n[1]]
      }
    }
  }
  return [axis[0] * best, axis[1] * best]
}

// ---------------------------------------------------------------------------
// The dish-wide cut

interface Group { cut: Cut | null; outline: P2[]; centre: THREE.Vector3; pts: THREE.Vector3[]; d: P2 }

// Fit outlines into the bowl, seen from above: each item (an outline, scaled by s about its pivot and
// moved by its offset d) is pushed apart from the others (half each) and from the fixed outlines, and
// pulled back inside BOWL_KEEP along its farthest point, until nothing moves; if that does not settle,
// every item shrinks by 8% and it runs again. Writes each item's d; returns s.
function pack(items: { outline: P2[]; pivot: P2; d: P2 }[], fixed: P2[][], gap: number): number {
  const shape = (it: { outline: P2[]; pivot: P2; d: P2 }, s: number): P2[] =>
    it.outline.map(([x, z]) => [it.pivot[0] + s * (x - it.pivot[0]) + it.d[0], it.pivot[1] + s * (z - it.pivot[1]) + it.d[1]])
  let s = 1
  for (let attempt = 0; attempt < 14; attempt++) {
    for (let iter = 0; iter < 120; iter++) {
      let worst = 0
      for (let a = 0; a < items.length; a++) {
        for (let b = a + 1; b < items.length; b++) {
          const v = push(shape(items[a], s), shape(items[b], s), gap)
          if (!v) continue
          worst = Math.max(worst, Math.hypot(...v))
          items[a].d[0] -= v[0] / 2; items[a].d[1] -= v[1] / 2
          items[b].d[0] += v[0] / 2; items[b].d[1] += v[1] / 2
        }
        for (const f of fixed) {
          const v = push(f, shape(items[a], s), gap)
          if (!v) continue
          worst = Math.max(worst, Math.hypot(...v))
          items[a].d[0] += v[0]; items[a].d[1] += v[1]
        }
      }
      for (const it of items) {
        let far = 0, fx = 0, fz = 0
        for (const [x, z] of shape(it, s)) { const r = Math.hypot(x, z); if (r > far) { far = r; fx = x; fz = z } }
        if (far <= BOWL_KEEP) continue
        const k = (far - BOWL_KEEP) / far
        worst = Math.max(worst, far - BOWL_KEEP)
        it.d[0] -= fx * k; it.d[1] -= fz * k
      }
      if (worst < 1e-4) return s
    }
    s *= 0.92
  }
  return s
}

// Open (p = 1) or shut (p = 0) a cut's pieces right now, with no animation.
function poseCut(c: Cut, p: 0 | 1) {
  c.p = p
  c.v = 0
  stepCut(c, 0)
  for (const m of c.parts) m.obj.updateWorldMatrix(false, true)
}

// Plan every cuttable fruit in the dish (`parts[i]` null: a fruit that hops instead, which stays
// where it is and is kept clear of). Slots must be at rest and children of the dish group. Returns
// each fruit's cut, shut, ready to animate.
export function planDish(slots: THREE.Object3D[], parts: (CutPart[] | null)[], camera: THREE.Camera): (Cut | null)[] {
  const dish = slots[0].parent!
  dish.updateWorldMatrix(true, true)
  const toDish = dish.matrixWorld.clone().invert()
  const cuts = slots.map((slot, i) => (parts[i] ? planCut(slot, parts[i]!, camera) : null))

  const groups: Group[] = slots.map((slot, i) => {
    const c = cuts[i]
    if (c) poseCut(c, 1)
    const pts = pointsIn(c ? c.parts.map(m => m.obj) : [slot], toDish)
    if (c) poseCut(c, 0)
    const box = new THREE.Box3().setFromPoints(pts)
    return { cut: c, outline: hull2(pts.map(p => [p.x, p.z])), centre: box.getCenter(new THREE.Vector3()), pts, d: [0, 0] }
  })
  const moving = groups.filter(g => g.cut).map(g => ({ g, outline: g.outline, pivot: [g.centre.x, g.centre.z] as P2, d: g.d }))
  const fixed = groups.filter(g => !g.cut).map(g => g.outline)
  const s = pack(moving, fixed, 0.03)

  // Move each open fruit's pieces (and its other parts) to the fitted spot, at the fitted size,
  // resting on the bowl.
  for (const { g } of moving) {
    const c = g.cut!
    const place = (p: THREE.Vector3) => new THREE.Vector3(g.centre.x + s * (p.x - g.centre.x) + g.d[0], g.centre.y + s * (p.y - g.centre.y), g.centre.z + s * (p.z - g.centre.z) + g.d[1])
    let dy = -Infinity
    for (const p of g.pts) {
      const q = place(p)
      dy = Math.max(dy, insideY(Math.hypot(q.x, q.z)) + 0.005 - q.y)
    }
    for (const m of c.parts) {
      const parent = m.obj.parent!
      parent.updateWorldMatrix(true, false)
      const inDish = parent.localToWorld(m.to.clone()).applyMatrix4(toDish)
      const there = dish.localToWorld(place(inDish).setY(place(inDish).y + dy))
      m.to.copy(parent.worldToLocal(there))
      m.toScale.multiplyScalar(s)
    }
  }
  return cuts
}

// For the model sheet: everything wrong with the dish as currently posed (`cuts[i]` null: fruit i is
// whole). Pieces of one fruit meeting; any two fruit (whole or in pieces) meeting; any part reaching the
// rim's tube or sinking into the bowl.
export function dishProblems(slots: THREE.Object3D[], cuts: (Cut | null)[], names: string[]): string[] {
  const dish = slots[0].parent!
  dish.updateWorldMatrix(true, true)
  const toDish = dish.matrixWorld.clone().invert()
  const out: string[] = []
  // Each mesh (and each instance of an instanced one) on its own: a piece's skin, its face, a leaf, a berry.
  const solids = slots.map((slot, i) => (cuts[i] ? cuts[i]!.parts.map(m => m.obj) : [slot]).flatMap(meshSolids))
  // Within one fruit: the same exact check as the fruit page.
  cuts.forEach((c, i) => {
    if (!c) return
    const pieces = c.parts.filter(m => m.obj.userData.cutPart).map(m => m.obj)
    cutOverlaps(slots[i], pieces).forEach(o => out.push(`${names[i]}: ${o}`))
  })
  // Between fruit: convex hulls of each piece (or the whole fruit) against the other fruit's.
  for (let i = 0; i < slots.length; i++) for (let j = i + 1; j < slots.length; j++) {
    if (solids[i].some(a => solids[j].some(b => solidsMeet(a, b)))) out.push(`${names[i]} x ${names[j]}`)
  }
  // The rim and the bowl, for the open fruit and for the whole ones (which hop) alike.
  cuts.forEach((c, i) => {
    if (!c) {
      const pts = pointsIn([slots[i]], toDish)
      const far = Math.max(...pts.map(p => Math.hypot(p.x, p.z)))
      if (far > RIM_INNER) out.push(`${names[i]} (whole): reaches the rim (radius ${far.toFixed(3)})`)
      const sunk = Math.max(...pts.map(p => insideY(Math.hypot(p.x, p.z)) - p.y))
      if (sunk > REST_NESTLE + 0.01) out.push(`${names[i]} (whole): sinks ${sunk.toFixed(3)} into the bowl`)
      return
    }
    const pts = pointsIn(c.parts.map(m => m.obj), toDish)
    const far = Math.max(...pts.map(p => Math.hypot(p.x, p.z)))
    if (far > RIM_INNER) out.push(`${names[i]}: reaches the rim (radius ${far.toFixed(3)})`)
    const sunk = Math.max(...pts.map(p => insideY(Math.hypot(p.x, p.z)) - p.y))
    if (sunk > 0.01) out.push(`${names[i]}: sinks ${sunk.toFixed(3)} into the bowl`)
  })
  return out
}
