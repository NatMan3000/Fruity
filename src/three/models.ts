// Stylised procedural fruit. No model files: each fruit is a lathe-style body (a profile swept round
// the vertical axis, with optional ribs, bumps and vertex colour) plus a few parts (stems, leaves,
// seeds, crowns). Every model is built once, normalised to fit a unit sphere (diameter 1) sitting
// on y = 0, and cloned per use, so clones share geometry and materials.
//
// Cutting open (the Now dish and a fruit's page): a round fruit's body is built in PARTS, each a closed
// piece whose cut faces are textured with the fruit's flesh (./flesh.ts). Halves split lengthways or
// across; a starfruit splits into star slices; a banana finger into coins. Whole, the parts touch and
// the faces are hidden inside; cut, ./cutting.tsx lays them out with their faces up. Stems, leaves and
// crowns ride on one part. `cutParts` finds the parts on a clone.
import * as THREE from 'three'
import { fleshMaterial, stoneMesh } from './flesh'

const TAU = Math.PI * 2
const C = (hex: string) => new THREE.Color(hex)
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

// ---------------------------------------------------------------------------
// Shared textures: a tiny noise bump map (peel pores, seeds, fuzz) and a diamond map (pineapple).

const noiseCache = new Map<string, THREE.CanvasTexture>()
function noise(rx = 6, ry = 3): THREE.CanvasTexture {
  const key = `${rx}x${ry}`
  const hit = noiseCache.get(key)
  if (hit) return hit
  const size = 128
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')!
  const img = g.createImageData(size, size)
  for (let i = 0; i < size * size; i++) {
    const x = Math.sin(i * 12.9898) * 43758.5453
    const v = 140 + (x - Math.floor(x)) * 115
    img.data.set([v, v, v, 255], i * 4)
  }
  g.putImageData(img, 0, 0)
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(rx, ry)
  noiseCache.set(key, t)
  return t
}

// ---------------------------------------------------------------------------
// The body: points at polar angle phi (0 bottom pole, PI top pole) and turn theta.

interface BodyOpts {
  rings?: number
  segs?: number
  thetaFrom?: number // build part of the turn (a lengthways half); default the whole turn
  thetaTo?: number
  phiFrom?: number   // build part of the length (an across half or a slice); default end to end
  phiTo?: number
  // radius and height at (phi, theta); default is a unit sphere
  shape?: (phi: number, theta: number) => { r: number; y: number }
  colour: (phi: number, theta: number, out: THREE.Color) => void
}

function body({ rings = 40, segs = 48, thetaFrom = 0, thetaTo = TAU, phiFrom = 0, phiTo = Math.PI, shape, colour }: BodyOpts): THREE.BufferGeometry {
  const whole = thetaFrom === 0 && thetaTo === TAU
  rings = Math.max(4, Math.round(rings * (phiTo - phiFrom) / Math.PI))
  const pos: number[] = []
  const col: number[] = []
  const uv: number[] = []
  const idx: number[] = []
  const tmp = new THREE.Color()
  for (let i = 0; i <= rings; i++) {
    const phi = phiFrom + (i / rings) * (phiTo - phiFrom)
    for (let j = 0; j <= segs; j++) {
      const theta = thetaFrom + (j / segs) * (thetaTo - thetaFrom)
      const { r, y } = shape ? shape(phi, theta) : { r: Math.sin(phi), y: -Math.cos(phi) }
      pos.push(r * Math.cos(theta), y, r * Math.sin(theta))
      colour(phi, theta, tmp)
      col.push(tmp.r, tmp.g, tmp.b)
      uv.push(j / segs, phi / Math.PI)
    }
  }
  const row = segs + 1
  for (let i = 0; i < rings; i++) {
    for (let j = 0; j < segs; j++) {
      const a = i * row + j, b = a + row
      // Counter-clockwise seen from outside, so the outside is the front face. (comp-3d wound these
      // inward, so every fruit drew its far inside wall; it only showed once the cut faces existed.)
      idx.push(a, b, a + 1, b, b + 1, a + 1)
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
  g.setIndex(idx)
  g.computeVertexNormals()
  // Weld the normals along the seam (theta 0 and TAU) and at the poles, so no crease shows.
  const n = g.getAttribute('normal') as THREE.BufferAttribute
  const v = new THREE.Vector3()
  for (let i = 0; i <= rings; i++) {
    const a = i * row, b = a + segs
    const pole = (i === 0 && phiFrom === 0) || (i === rings && phiTo === Math.PI)
    if (pole) {
      v.set(0, i === 0 ? -1 : 1, 0)
      for (let j = 0; j <= segs; j++) n.setXYZ(a + j, v.x, v.y, v.z)
    } else if (whole) {
      v.set(n.getX(a) + n.getX(b), n.getY(a) + n.getY(b), n.getZ(a) + n.getZ(b)).normalize()
      n.setXYZ(a, v.x, v.y, v.z)
      n.setXYZ(b, v.x, v.y, v.z)
    }
  }
  return g
}

interface SkinOpts {
  roughness?: number
  clearcoat?: number
  clearcoatRoughness?: number
  sheen?: number
  sheenColor?: string
  bump?: number
  bumpRepeat?: [number, number] // how fine the pores are
  colour?: string // flat colour instead of vertex colour
}

function skin({ roughness = 0.45, clearcoat = 0, clearcoatRoughness = 0.2, sheen = 0, sheenColor = '#ffffff', bump = 0, bumpRepeat = [6, 3], colour }: SkinOpts = {}) {
  return new THREE.MeshPhysicalMaterial({
    vertexColors: !colour,
    color: colour ? C(colour) : 0xffffff,
    roughness,
    clearcoat,
    clearcoatRoughness,
    sheen,
    sheenColor: C(sheenColor),
    sheenRoughness: 0.6,
    bumpMap: bump ? noise(...bumpRepeat) : null,
    bumpScale: bump,
  })
}

function mesh(geo: THREE.BufferGeometry, mat: THREE.Material): THREE.Mesh {
  const m = new THREE.Mesh(geo, mat)
  m.castShadow = true
  m.receiveShadow = true
  return m
}

// ---------------------------------------------------------------------------
// Cutting: a body in parts with flesh faces

type Shape = (phi: number, theta: number) => { r: number; y: number }
const unitSphere: Shape = phi => ({ r: Math.sin(phi), y: -Math.cos(phi) })

// The cross-section in the lengthways cut plane (z = 0): down the theta = 0 side, back up theta = PI.
function lengthOutline(shape: Shape, rings = 48): THREE.Vector2[] {
  const pts: THREE.Vector2[] = []
  const push = (x: number, y: number) => {
    const last = pts[pts.length - 1]
    if (!last || Math.hypot(last.x - x, last.y - y) > 1e-4) pts.push(new THREE.Vector2(x, y))
  }
  for (let i = 0; i <= rings; i++) {
    const { r, y } = shape((i / rings) * Math.PI, 0)
    push(r, y)
  }
  for (let i = rings; i >= 0; i--) {
    const { r, y } = shape((i / rings) * Math.PI, Math.PI)
    push(-r, y)
  }
  if (pts.length > 2 && pts[0].distanceTo(pts[pts.length - 1]) < 1e-4) pts.pop()
  return pts
}

// The cross-section across the body at phi, as (x, -z) so that the shape, turned flat, lands at +z.
function acrossOutline(shape: Shape, phi: number, segs = 72): { pts: THREE.Vector2[]; y: number } {
  const pts: THREE.Vector2[] = []
  let y = 0
  for (let j = 0; j < segs; j++) {
    const theta = (j / segs) * TAU
    const s = shape(phi, theta)
    pts.push(new THREE.Vector2(s.r * Math.cos(theta), -s.r * Math.sin(theta)))
    y += s.y / segs
  }
  return { pts, y }
}

// A flat face on an outline, its UVs spread over the outline's box (the flesh painter draws to it).
function faceGeometry(line: THREE.Vector2[]): { geo: THREE.BufferGeometry; box: THREE.Box2 } {
  const geo = new THREE.ShapeGeometry(new THREE.Shape(line), 1)
  const box = new THREE.Box2().setFromPoints(line)
  const size = box.getSize(new THREE.Vector2())
  const pos = geo.getAttribute('position') as THREE.BufferAttribute
  const uv = geo.getAttribute('uv') as THREE.BufferAttribute
  for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) - box.min.x) / size.x, (pos.getY(i) - box.min.y) / size.y)
  return { geo, box }
}

export interface CutPart {
  part: THREE.Object3D
  normal: THREE.Vector3 // the face to show, outward, in the part's parent frame
  upright: boolean      // stands as it is (a crown piece) instead of turning its face up
}

// One piece of a cut fruit: an outer group sitting at the piece's own middle (so it turns about
// itself), holding an inner group in body coordinates (so stems and leaves can be added as built).
// The normal goes in userData as a plain array: Object3D.clone() copies userData through JSON.
function piece(meshes: THREE.Object3D[], normal: [number, number, number]): { outer: THREE.Group; inner: THREE.Group } {
  const inner = new THREE.Group()
  meshes.forEach(m => {
    m.userData.solid = true // the piece's own body (skin, cut faces, stone); stems and leaves added later are not
    inner.add(m)
  })
  const centre = new THREE.Box3().setFromObject(inner).getCenter(new THREE.Vector3())
  inner.position.copy(centre).negate()
  const outer = new THREE.Group()
  outer.position.copy(centre)
  outer.add(inner)
  outer.userData.cutPart = true
  outer.userData.capNormal = normal
  return { outer, inner }
}

// How a body comes apart: lengthways halves (stone fruit, avocado, strawberry, melons), across halves
// (citrus, kiwifruit: the round face everyone knows), or n slices across (starfruit stars).
// `uprightTop`: the top piece carries something to show off (the pineapple's crown), so it stands
// upright at the end of the row instead of turning its cut face up.
export type CutMode = { kind: 'length' } | { kind: 'across' } | { kind: 'slices'; n: number; uprightTop?: boolean }

// Find phi where the profile reaches height y (the profile rises from phi 0 to PI).
function phiAtY(shape: Shape, y: number): number {
  let lo = 0, hi = Math.PI
  for (let k = 0; k < 40; k++) {
    const mid = (lo + hi) / 2
    if (shape(mid, 0).y < y) lo = mid
    else hi = mid
  }
  return (lo + hi) / 2
}

// A body in parts. Returns the whole group and `a`, the inner group of the part that carries the
// stem end (half A, or the top slice), for stems, leaves and crowns.
function cutBody(opts: BodyOpts, mat: THREE.Material, fruitId: string, mode: CutMode = { kind: 'length' }): { group: THREE.Group; a: THREE.Group; parts: THREE.Group[] } {
  const shape = opts.shape ?? unitSphere
  const group = new THREE.Group()
  const parts: THREE.Group[] = []
  let a: THREE.Group
  if (mode.kind === 'length') {
    const { geo, box } = faceGeometry(lengthOutline(shape))
    const flesh = fleshMaterial(fruitId, lengthOutline(shape), box, buildColour, 'length')
    const faceA = mesh(geo, flesh), faceB = mesh(geo, flesh)
    const stone = stoneMesh(fruitId, box)
    const A = piece([mesh(body({ ...opts, thetaFrom: 0, thetaTo: Math.PI }), mat), faceA, ...(stone ? [stone] : [])], [0, 0, -1])
    const B = piece([mesh(body({ ...opts, thetaFrom: Math.PI, thetaTo: TAU }), mat), faceB], [0, 0, 1])
    parts.push(A.outer, B.outer)
    a = A.inner
  } else {
    // Cuts across, at equal steps of height (two halves: one cut through the middle).
    const n = mode.kind === 'across' ? 2 : mode.n
    const yLo = shape(0, 0).y, yHi = shape(Math.PI, 0).y
    const cuts = Array.from({ length: n - 1 }, (_, k) => phiAtY(shape, yLo + ((k + 1) / n) * (yHi - yLo)))
    const bounds = [0, ...cuts, Math.PI]
    let flesh: THREE.Material | null = null
    const face = (phi: number) => {
      const { pts, y } = acrossOutline(shape, phi)
      const { geo, box } = faceGeometry(pts)
      flesh ??= fleshMaterial(fruitId, pts, box, buildColour, 'across')
      geo.rotateX(-Math.PI / 2)
      geo.translate(0, y, 0)
      return mesh(geo, flesh) // double-sided: the same face serves the piece above and below
    }
    let top: THREE.Group | null = null
    for (let k = 0; k < n; k++) {
      const meshes: THREE.Object3D[] = [mesh(body({ ...opts, phiFrom: bounds[k], phiTo: bounds[k + 1] }), mat)]
      if (k > 0) meshes.push(face(bounds[k]))
      if (k < n - 1) meshes.push(face(bounds[k + 1]))
      // Show the face looking up (a slice's top), or down for the top piece, which has only that one.
      const p = piece(meshes, k < n - 1 ? [0, 1, 0] : [0, -1, 0])
      if (k === n - 1 && mode.kind === 'slices' && mode.uprightTop) p.outer.userData.upright = true
      parts.push(p.outer)
      if (k === n - 1) top = p.inner
    }
    a = top!
  }
  parts.forEach(p => group.add(p))
  return { group, a, parts }
}

// The parts of a built (and cloned) fruit, or null for fruit that cannot be cut open.
export function cutParts(root: THREE.Object3D): CutPart[] | null {
  const parts: CutPart[] = []
  root.traverse(o => {
    if (o.userData.cutPart) parts.push({ part: o, normal: new THREE.Vector3(...(o.userData.capNormal as [number, number, number])), upright: !!o.userData.upright })
  })
  return parts.length >= 2 ? parts : null
}

// ---------------------------------------------------------------------------
// Parts

const stemMat = skin({ colour: '#5B3A1E', roughness: 0.8 })
const leafMat = new THREE.MeshPhysicalMaterial({ color: C('#3F8A2E'), roughness: 0.5, clearcoat: 0.4, side: THREE.DoubleSide })

function stem(len = 0.25, radius = 0.025, bend = 0.08, mat: THREE.Material = stemMat): THREE.Mesh {
  const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(bend * 0.3, len * 0.6, 0), new THREE.Vector3(bend, len, 0))
  return mesh(new THREE.TubeGeometry(curve, 8, radius, 6, false), mat)
}

// A leaf lying along +y from its base, curled a little toward +z.
function leafGeo(len = 0.5, width = 0.22, curl = 0.12): THREE.BufferGeometry {
  const s = new THREE.Shape()
  s.moveTo(0, 0)
  s.bezierCurveTo(width, len * 0.25, width * 0.9, len * 0.75, 0, len)
  s.bezierCurveTo(-width * 0.9, len * 0.75, -width, len * 0.25, 0, 0)
  const g = new THREE.ShapeGeometry(s, 10)
  const p = g.getAttribute('position') as THREE.BufferAttribute
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i) / len, x = p.getX(i) / width
    p.setZ(i, curl * y * y - Math.abs(x) * width * 0.25)
  }
  g.computeVertexNormals()
  return g
}

function leaf(len?: number, width?: number, curl?: number, mat: THREE.Material = leafMat): THREE.Mesh {
  return mesh(leafGeo(len, width, curl), mat)
}

// n leaves round the top, splayed out and drooping (strawberry calyx, persimmon cap).
function calyx(n: number, len: number, width: number, droop: number, mat: THREE.Material = leafMat): THREE.Group {
  const g = new THREE.Group()
  const geo = leafGeo(len, width, -0.05)
  for (let i = 0; i < n; i++) {
    const l = mesh(geo, mat)
    l.rotation.order = 'YXZ'
    l.rotation.y = (i / n) * TAU
    l.rotation.x = Math.PI / 2 + droop
    g.add(l)
  }
  return g
}

// Points spread evenly over a band of the body (Fibonacci spiral), for seeds and drupelets.
function surfacePoints(count: number, phiFrom: number, phiTo: number, shape: (phi: number, theta: number) => { r: number; y: number }) {
  const pts: { p: THREE.Vector3; n: THREE.Vector3 }[] = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i++) {
    const t = (i + 0.5) / count
    const phi = Math.acos(Math.cos(phiFrom) + (Math.cos(phiTo) - Math.cos(phiFrom)) * t)
    const theta = i * golden
    const a = shape(phi, theta), b = shape(phi + 0.01, theta)
    const p = new THREE.Vector3(a.r * Math.cos(theta), a.y, a.r * Math.sin(theta))
    const q = new THREE.Vector3(b.r * Math.cos(theta), b.y, b.r * Math.sin(theta))
    const tangent = q.sub(p).normalize()
    const around = new THREE.Vector3(-Math.sin(theta), 0, Math.cos(theta))
    pts.push({ p, n: new THREE.Vector3().crossVectors(around, tangent).normalize() })
  }
  return pts
}

function scatter(geo: THREE.BufferGeometry, mat: THREE.Material, pts: { p: THREE.Vector3; n: THREE.Vector3 }[], lift = 0, jitter?: (i: number) => THREE.Color): THREE.InstancedMesh {
  const im = new THREE.InstancedMesh(geo, mat, pts.length)
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), one = new THREE.Vector3(1, 1, 1)
  pts.forEach(({ p, n }, i) => {
    q.setFromUnitVectors(up, n)
    m.compose(p.clone().addScaledVector(n, lift), q, one)
    im.setMatrixAt(i, m)
    if (jitter) im.setColorAt(i, jitter(i))
  })
  im.castShadow = true
  return im
}

// ---------------------------------------------------------------------------
// Colour helpers for vertex colouring

const lerpC = (out: THREE.Color, a: THREE.Color, b: THREE.Color, t: number) => out.copy(a).lerp(b, Math.min(1, Math.max(0, t)))
// Blush on one side (theta near `at`), strength 0..1
const sideness = (theta: number, at = Math.PI) => 0.5 + 0.5 * Math.cos(theta - at)

// The body-coordinate group inside a cut part (see `piece`).
const innerOf = (part: THREE.Object3D) => part.children[0] as THREE.Group

// ---------------------------------------------------------------------------
// Fruit. A builder gets the fruit id (for its flesh) and returns the model before normalising.

type Builder = (id: string) => THREE.Object3D

function sphereish(sx = 1, sy = 1): Shape {
  return (phi: number) => ({ r: Math.sin(phi) * sx, y: -Math.cos(phi) * sy })
}

// A round fruit lying on its side: the body's axis turned to horizontal, cut lengthways.
function lying(id: string, opts: BodyOpts, mat: THREE.Material, tilt = Math.PI / 2, mode: CutMode = { kind: 'length' }, extras?: (a: THREE.Group) => void): THREE.Group {
  const g = new THREE.Group()
  const { group, a } = cutBody(opts, mat, id, mode)
  extras?.(a)
  group.rotation.z = tilt
  g.add(group)
  return g
}

// A short green stem button with a star of sepals, on top (y = top) of a round fruit.
function stemButton(a: THREE.Group, top: number, colour = '#5E7A2A', size = 1) {
  const disc = mesh(new THREE.CylinderGeometry(0.07 * size, 0.09 * size, 0.04 * size, 10), skin({ colour, roughness: 0.6 }))
  disc.position.y = top
  a.add(disc)
  const s = stem(0.07 * size, 0.022 * size, 0.01, skin({ colour: '#6B5A2A', roughness: 0.7 }))
  s.position.y = top + 0.01
  a.add(s)
}

function apple(id: string): THREE.Object3D {
  const red = C('#C8182A'), dark = C('#7E0A1C'), yellow = C('#F3C64A')
  const shape: Shape = phi => {
    const u = phi / Math.PI
    let y = -Math.cos(phi) * 0.9
    y -= 0.32 * Math.exp(-((Math.PI - phi) ** 2) / 0.09) // stem dimple
    y += 0.14 * Math.exp(-(phi ** 2) / 0.06)            // base dimple
    return { r: Math.sin(phi) * (0.94 + 0.12 * u), y }
  }
  const g = new THREE.Group()
  const { group, a } = cutBody({
    shape,
    colour: (phi, theta, out) => {
      const streak = 0.5 + 0.5 * Math.sin(theta * 11 + Math.sin(phi * 5) * 1.5)
      lerpC(out, red, dark, sideness(theta, 0.6) * 0.45 + streak * 0.12)
      out.lerp(yellow, Math.max(0, (1 - phi / Math.PI) * 0.5 - 0.15) * sideness(theta, 3.6))
    },
  }, skin({ roughness: 0.35, clearcoat: 0.8, clearcoatRoughness: 0.15 }), id)
  g.add(group)
  const s = stem(0.3, 0.025, 0.06)
  s.position.y = 0.62
  a.add(s)
  const l = leaf(0.42, 0.17, 0.15)
  l.position.set(0.04, 0.78, 0.02)
  l.rotation.set(0.3, 0.4, -1.1)
  a.add(l)
  return g
}

interface CitrusOpts { squash?: number; navel?: string; neck?: number; tint?: string; bump?: number; leaf?: boolean; pucker?: number; mode?: CutMode }

// Citrus and other round fruit: a slightly squashed ball with fine peel pores, a stem button (and a
// leaf on oranges and mandarins), cut into rounds so every face is the wheel everyone knows.
function citrusBody(id: string, colour: string, opts: CitrusOpts = {}): { g: THREE.Group; a: THREE.Group } {
  const base = C(colour), tint = C(opts.tint ?? colour), navel = C(opts.navel ?? '#7A6A1A')
  const squash = opts.squash ?? 0.92, neck = opts.neck ?? 0, pucker = opts.pucker ?? 0
  const g = new THREE.Group()
  const { group, a } = cutBody({
    rings: 44,
    segs: 56,
    shape: (phi, theta) => ({
      r: Math.sin(phi) * (1 + pucker * Math.cos(theta * 9) * smooth(0.6, 1, phi / Math.PI)),
      y: -Math.cos(phi) * squash + neck * Math.exp(-((Math.PI - phi) ** 2) / 0.12),
    }),
    colour: (phi, theta, out) => {
      lerpC(out, base, tint, sideness(theta, 2) * 0.5)
      out.lerp(navel, Math.exp(-(phi ** 2) / 0.01) * 0.7)
    },
  }, skin({ roughness: 0.5, clearcoat: 0.35, bump: opts.bump ?? 0.03, bumpRepeat: [16, 8] }), id, opts.mode ?? { kind: 'slices', n: 4 })
  g.add(group)
  const top = squash + neck - 0.02
  stemButton(a, top)
  if (opts.leaf) {
    const l = leaf(0.5, 0.2, 0.12)
    l.position.set(0.02, top + 0.04, 0)
    l.rotation.set(0.35, 0.6, -1.25)
    a.add(l)
  }
  return { g, a }
}

function citrus(colour: string, opts: CitrusOpts = {}): Builder {
  return id => citrusBody(id, colour, opts).g
}

function lemonLike(colour: string, tip: number): Builder {
  return id => {
    const base = C(colour), light = new THREE.Color(colour).lerp(C('#ffffff'), 0.25)
    return lying(id, {
      rings: 44,
      segs: 56,
      shape: phi => {
        const s = Math.sin(phi)
        return { r: s * 0.78, y: -Math.cos(phi) * 1.0 - Math.sign(Math.cos(phi)) * tip * Math.exp(-(s * s) / 0.03) }
      },
      colour: (_phi, theta, out) => lerpC(out, base, light, sideness(theta, 1) * 0.4),
    }, skin({ roughness: 0.42, clearcoat: 0.5, bump: 0.025, bumpRepeat: [16, 8] }), Math.PI / 2, { kind: 'slices', n: 5 })
  }
}

function strawberry(id: string): THREE.Object3D {
  // The shoulders under the calyx go a deeper red, never orange (the old pale-gold shoulder showed as an
  // orange underside on the half without the calyx; Nathan, 2 Nov 2026).
  const red = C('#E01E35'), deep = C('#A50E25'), shoulder = C('#B8142C')
  // Broad shoulders at the top, tapering to a soft point at the bottom.
  const shape: Shape = phi => {
    const u = phi / Math.PI
    return { r: Math.pow(Math.sin(phi), 0.85) * (0.12 + 0.88 * Math.pow(u, 0.9)), y: -Math.cos(phi) * 1.1 - 0.16 * Math.exp(-((Math.PI - phi) ** 2) / 0.1) }
  }
  const g = new THREE.Group()
  const { group, a } = cutBody({
    shape,
    colour: (phi, theta, out) => {
      lerpC(out, red, deep, sideness(theta, 0.4) * 0.5)
      out.lerp(shoulder, smooth(0.88, 0.98, phi / Math.PI) * 0.7)
    },
  }, skin({ roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.08 }), id)
  g.add(group)
  // Seeds sit in little pits: flat discs, half sunk. Each half carries its own.
  const seed = new THREE.SphereGeometry(0.026, 6, 4)
  seed.scale(0.8, 0.45, 1.1)
  const seedMat = skin({ colour: '#F2C94A', roughness: 0.4 })
  const pts = surfacePoints(110, 0.3, Math.PI * 0.86, shape)
  a.add(scatter(seed, seedMat, pts.filter(p => p.p.z >= 0), -0.004))
  innerOf(group.children[1]).add(scatter(seed, seedMat, pts.filter(p => p.p.z < 0), -0.004))
  const cap = calyx(8, 0.62, 0.15, 0.18)
  cap.position.y = 0.94
  a.add(cap)
  const s = stem(0.22, 0.03, 0.05, leafMat)
  s.position.y = 0.92
  a.add(s)
  return g
}

function cherries(): THREE.Object3D {
  const g = new THREE.Group()
  const mat = skin({ colour: '#8E0B22', roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.05 })
  const geo = body({
    shape: phi => ({ r: Math.sin(phi), y: -Math.cos(phi) * 0.92 - 0.2 * Math.exp(-((Math.PI - phi) ** 2) / 0.1) }),
    colour: (_p, _t, out) => out.set('#ffffff'),
  })
  const stemGreen = skin({ colour: '#5E8A2A', roughness: 0.6 })
  for (const side of [-1, 1]) {
    const c = mesh(geo, mat)
    c.scale.setScalar(0.42)
    c.position.set(side * 0.4, 0.42, side * 0.05)
    g.add(c)
    const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(side * 0.4, 0.74, side * 0.05), new THREE.Vector3(side * 0.32, 1.25, 0), new THREE.Vector3(0.02, 1.55, 0))
    g.add(mesh(new THREE.TubeGeometry(curve, 12, 0.022, 6, false), stemGreen))
  }
  const l = leaf(0.5, 0.17, 0.1)
  l.position.set(0.02, 1.52, 0)
  l.rotation.set(0.2, 0, -1.2)
  g.add(l)
  return g
}

// A hand of four bananas: separate curved fingers that meet only at the crown, fanned so they never
// pass through each other. Each finger is a ridged tube (five soft ridges, like the real thing). The
// front finger is built in coins, so cutting a banana slices it into rounds with pale flesh.
function banana(id: string): THREE.Object3D {
  const g = new THREE.Group()
  const yellow = C('#F6D23C'), green = C('#9DB83A'), brown = C('#4A3218')
  const mat = skin({ roughness: 0.42, clearcoat: 0.3 })
  const R = (t: number) => 0.035 + 0.17 * smooth(0.02, 0.3, t) - 0.15 * smooth(0.82, 1, t)
  const colour = (t: number, out: THREE.Color) => {
    lerpC(out, yellow, green, smooth(0.22, 0.04, t) * 0.8 + smooth(0.85, 0.97, t) * 0.25)
    out.lerp(brown, smooth(0.965, 1, t) + smooth(0.03, 0, t) * 0.6)
  }
  for (let k = 0; k < 4; k++) {
    const yaw = (k - 1.5) * 0.6
    const lift = k * 0.12 + (k % 2) * 0.08
    const pts = [[0, 0], [0.4, 0.02 + lift * 0.4], [1.0, 0.14 + lift], [1.55, 0.42 + lift], [1.9, 0.86 + lift]]
      .map(([x, y]) => new THREE.Vector3(x * Math.cos(yaw), y, -x * Math.sin(yaw)))
    const curve = new THREE.CatmullRomCurve3(pts)
    const frames = curve.computeFrenetFrames(200, false)
    if (k !== 1) {
      g.add(mesh(tube(curve, frames, 0, 1, R, colour, 48), mat))
      continue
    }
    // The front finger: a stalk end, three coins, and its tip, which stands at the end of the row.
    g.add(mesh(tube(curve, frames, 0, 0.4, R, colour, 16), mat))
    const cuts = [0.4, 0.55, 0.7, 0.85, 1]
    for (let c = 0; c < cuts.length - 1; c++) {
      const t0 = cuts[c], t1 = cuts[c + 1]
      const tip = t1 === 1
      const meshes: THREE.Object3D[] = [mesh(tube(curve, frames, t0, t1, R, colour, 10), mat), coinFace(id, curve, frames, t0, R)]
      if (!tip) meshes.push(coinFace(id, curve, frames, t1, R))
      const tan = curve.getTangentAt(t1)
      const p = piece(meshes, [tan.x, tan.y, tan.z])
      if (tip) p.outer.userData.upright = true
      g.add(p.outer)
    }
  }
  // The crown the fingers grow from
  const crown = mesh(new THREE.CylinderGeometry(0.09, 0.12, 0.3, 10), skin({ colour: '#6B6A2A', roughness: 0.7 }))
  crown.rotation.z = Math.PI / 2
  crown.position.x = -0.12
  g.add(crown)
  return g
}

// A section of a ridged tube along a curve, t0 to t1, using precomputed (parallel transport) frames.
function tube(curve: THREE.Curve<THREE.Vector3>, frames: { normals: THREE.Vector3[]; binormals: THREE.Vector3[] }, t0: number, t1: number, R: (t: number) => number, colour: (t: number, out: THREE.Color) => void, lengthSegs: number, radial = 15): THREE.BufferGeometry {
  const pos: number[] = [], col: number[] = [], idx: number[] = []
  const tmp = new THREE.Color(), P = new THREE.Vector3()
  for (let i = 0; i <= lengthSegs; i++) {
    const t = t0 + ((t1 - t0) * i) / lengthSegs
    curve.getPointAt(t, P)
    const f = Math.round(t * (frames.normals.length - 1))
    const N = frames.normals[f], B = frames.binormals[f]
    colour(t, tmp)
    for (let j = 0; j <= radial; j++) {
      const a = (j / radial) * TAU
      const r = R(t) * (1 + 0.06 * Math.cos(a * 5))
      pos.push(P.x + (N.x * Math.cos(a) + B.x * Math.sin(a)) * r, P.y + (N.y * Math.cos(a) + B.y * Math.sin(a)) * r, P.z + (N.z * Math.cos(a) + B.z * Math.sin(a)) * r)
      col.push(tmp.r, tmp.g, tmp.b)
    }
  }
  const row = radial + 1
  for (let i = 0; i < lengthSegs; i++) {
    for (let j = 0; j < radial; j++) {
      const a = i * row + j, b = a + row
      idx.push(a, a + 1, b, b, a + 1, b + 1)
    }
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
  geo.setIndex(idx)
  geo.computeVertexNormals()
  return geo
}

// A banana coin's cut face at t: the ridged ring filled with the flesh texture.
function coinFace(id: string, curve: THREE.Curve<THREE.Vector3>, frames: { normals: THREE.Vector3[]; binormals: THREE.Vector3[]; tangents: THREE.Vector3[] }, t: number, R: (t: number) => number): THREE.Mesh {
  const pts: THREE.Vector2[] = []
  for (let j = 0; j < 30; j++) {
    const a = (j / 30) * TAU
    const r = R(t) * (1 + 0.06 * Math.cos(a * 5))
    pts.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r))
  }
  const { geo, box } = faceGeometry(pts)
  const f = Math.round(t * (frames.normals.length - 1))
  const m = new THREE.Matrix4().makeBasis(frames.normals[f], frames.binormals[f], frames.tangents[f]).setPosition(curve.getPointAt(t))
  geo.applyMatrix4(m)
  return mesh(geo, fleshMaterial(id, pts, box, buildColour, 'across'))
}

function cluster(colour: string, count: number, size: number, opts: { bloom?: boolean; elongate?: number } = {}): Builder {
  return () => {
    const g = new THREE.Group()
    const geo = new THREE.SphereGeometry(size, 20, 14)
    if (opts.elongate) geo.scale(1, opts.elongate, 1)
    const mat = skin({ colour: '#ffffff', roughness: opts.bloom ? 0.5 : 0.25, clearcoat: opts.bloom ? 0.2 : 0.8, sheen: opts.bloom ? 0.8 : 0, sheenColor: '#C9C9E8' })
    const im = new THREE.InstancedMesh(geo, mat, count)
    const m = new THREE.Matrix4(), base = C(colour), tmp = new THREE.Color()
    // An upside-down cone of berries: wide at the top, narrowing to a point.
    for (let i = 0; i < count; i++) {
      const layer = Math.floor(Math.sqrt(i * 1.6))
      const t = i / count
      const ang = i * 2.4
      const radius = (1 - t) * size * 3.2
      m.setPosition(Math.cos(ang) * radius, 2.2 * size + (1 - t) * size * 5.5 - layer * 0.02, Math.sin(ang) * radius)
      im.setMatrixAt(i, m)
      im.setColorAt(i, tmp.copy(base).offsetHSL(0, 0, ((i * 0.618) % 1 - 0.5) * 0.12))
    }
    im.castShadow = true
    g.add(im)
    const s = stem(0.3, 0.03, 0.05, skin({ colour: '#6B7A2E', roughness: 0.7 }))
    s.position.y = 2.2 * size + size * 6
    g.add(s)
    return g
  }
}

function stoneFruit(base: string, blush: string, opts: { fuzz?: number; gloss?: number; tall?: number; bloom?: boolean } = {}): Builder {
  return id => {
    const a = C(base), b = C(blush)
    const tall = opts.tall ?? 1
    const g = new THREE.Group()
    const { group, a: half } = cutBody({
      shape: (phi, theta) => {
        // The crease runs down the side the knife follows (theta = PI / 2, the middle of half A).
        const crease = 0.07 * Math.exp(-(Math.atan2(Math.sin(theta - Math.PI / 2), Math.cos(theta - Math.PI / 2)) ** 2) / 0.02) * Math.sin(phi)
        return { r: Math.sin(phi) * (1 - crease), y: -Math.cos(phi) * tall - 0.12 * Math.exp(-((Math.PI - phi) ** 2) / 0.08) }
      },
      colour: (phi, theta, out) => lerpC(out, a, b, sideness(theta, 2.2) * 0.85 + (phi / Math.PI) * 0.15),
    }, skin({
      roughness: opts.fuzz ? 0.7 : 0.3,
      clearcoat: opts.gloss ?? 0,
      sheen: opts.fuzz ?? (opts.bloom ? 0.7 : 0),
      sheenColor: opts.bloom ? '#B8B4D8' : '#FFE0C8',
    }), id)
    g.add(group)
    const s = stem(0.12, 0.022, 0.02)
    s.position.y = tall - 0.12
    half.add(s)
    return g
  }
}

function watermelon(id: string): THREE.Object3D {
  const dark = C('#1C4D2A'), light = C('#7DB04E')
  return lying(id, {
    rings: 44,
    segs: 64,
    shape: phi => ({ r: Math.sin(phi) * 0.78, y: -Math.cos(phi) * 1.0 }),
    colour: (phi, theta, out) => {
      const stripe = Math.sin(theta * 9 + Math.sin(phi * 14) * 0.35)
      lerpC(out, light, dark, smooth(-0.2, 0.3, stripe))
    },
  }, skin({ roughness: 0.35, clearcoat: 0.6 }))
}

function pear(colour: string, blush: string, opts: { neck?: number; rough?: number; gloss?: number; bump?: number } = {}): Builder {
  return id => {
    const a = C(colour), b = C(blush)
    const neck = opts.neck ?? 0.45
    const g = new THREE.Group()
    const { group, a: half } = cutBody({
      shape: phi => {
        const u = phi / Math.PI
        return { r: Math.sin(phi) * (1 - neck * smooth(0.35, 1, u)), y: -Math.cos(phi) * 1.3 + 0.1 * u }
      },
      colour: (phi, theta, out) => lerpC(out, a, b, sideness(theta, 2.5) * 0.6 * (1 - phi / Math.PI)),
    }, skin({ roughness: opts.rough ?? 0.5, clearcoat: opts.gloss ?? 0.3, bump: opts.bump ?? 0.008 }), id)
    g.add(group)
    const s = stem(0.28, 0.028, 0.1)
    s.position.y = 1.36
    half.add(s)
    return g
  }
}

function pineapple(id: string): THREE.Object3D {
  const gold = C('#E0A526'), groove = C('#6A4A12'), green = C('#8A9A2A')
  const pattern = (phi: number, theta: number) => {
    const a = Math.sin(theta * 8 + phi * 9), b = Math.sin(theta * 8 - phi * 9)
    return Math.abs(a * b)
  }
  const g = new THREE.Group()
  const { group, a } = cutBody({
    rings: 56,
    segs: 32,
    shape: (phi, theta) => {
      const d = pattern(phi, theta)
      return { r: Math.sin(phi) * 0.82 * (0.94 + 0.08 * d), y: -Math.cos(phi) * 1.25 }
    },
    colour: (phi, theta, out) => {
      lerpC(out, groove, gold, smooth(0.05, 0.5, pattern(phi, theta)))
      out.lerp(green, 0.3 * (1 - phi / Math.PI))
    },
  }, skin({ roughness: 0.55, clearcoat: 0.25 }), id, { kind: 'slices', n: 5, uprightTop: true }) // rings; the crown piece stands at the end
  g.add(group)
  const crownMat = new THREE.MeshPhysicalMaterial({ color: C('#3E7D34'), roughness: 0.45, clearcoat: 0.3, side: THREE.DoubleSide })
  const geo = leafGeo(1, 0.13, 0.25)
  for (let ring = 0; ring < 3; ring++) {
    const n = 9 - ring * 2
    for (let i = 0; i < n; i++) {
      const l = mesh(geo, crownMat)
      l.rotation.order = 'YXZ'
      l.rotation.y = (i / n) * TAU + ring * 0.4
      l.rotation.x = 0.55 - ring * 0.22
      l.scale.setScalar(1 - ring * 0.2)
      l.position.y = 1.15 + ring * 0.05
      a.add(l)
    }
  }
  return g
}

// Five clear ridges: a star cross-section along a tapered length, lying on its side. Cut, it falls
// into star slices (the thing everyone knows it for).
function starfruit(id: string): THREE.Object3D {
  const yellow = C('#F4C430'), ridge = C('#B9A22A'), tipC = C('#8A7A2A')
  const star = (theta: number) => 0.34 + 0.66 * Math.pow(0.5 + 0.5 * Math.cos(5 * theta), 1.3)
  return lying(id, {
    rings: 44,
    segs: 100,
    shape: (phi, theta) => ({ r: Math.pow(Math.sin(phi), 0.7) * 0.6 * star(theta), y: -Math.cos(phi) * 1.15 }),
    colour: (phi, theta, out) => {
      lerpC(out, yellow, ridge, Math.pow(0.5 + 0.5 * Math.cos(5 * theta), 10) * 0.7)
      out.lerp(tipC, smooth(0.9, 1, Math.abs(Math.cos(phi))) * 0.6)
    },
  }, skin({ roughness: 0.28, clearcoat: 0.9 }), Math.PI / 2, { kind: 'slices', n: 5 })
}

function kiwifruit(id: string): THREE.Object3D {
  return lying(id, {
    rings: 40,
    segs: 48,
    shape: sphereish(0.78, 1.0),
    colour: (_p, theta, out) => lerpC(out, C('#8A6438'), C('#6B4A28'), sideness(theta) * 0.5),
  }, skin({ roughness: 0.95, sheen: 1, sheenColor: '#C8A87A', bump: 0.03, bumpRepeat: [20, 10] }), Math.PI / 2, { kind: 'slices', n: 4 })
}

// A kidney-shaped, flattened mango: green round the stem, yellow-orange, a red blush on one cheek.
function mango(id: string): THREE.Object3D {
  const green = C('#6E9A2E'), yellow = C('#FFC23A'), red = C('#E23A4A')
  return lying(id, {
    rings: 44,
    segs: 56,
    shape: (phi, theta) => {
      const s = Math.sin(phi)
      return { r: s * (0.66 + 0.1 * Math.cos(theta)) * (1 - 0.22 * Math.sin(theta) ** 2), y: -Math.cos(phi) * 1.0 + 0.26 * s * s * Math.cos(theta) - 0.08 * Math.exp(-((Math.PI - phi) ** 2) / 0.15) }
    },
    colour: (phi, theta, out) => {
      // Green shoulders round the stem, golden body, a big red-pink blush on one cheek.
      lerpC(out, yellow, green, smooth(0.45, 0.95, phi / Math.PI) * 0.95)
      out.lerp(red, Math.pow(sideness(theta, 0.6), 1.2) * smooth(0.15, 0.65, phi / Math.PI) * 0.95)
    },
  }, skin({ roughness: 0.3, clearcoat: 0.8 }), Math.PI / 2.4, { kind: 'length' }, a => {
    const s = stem(0.1, 0.03, 0.02)
    s.position.y = 0.98
    a.add(s)
  })
}

// A papaya: pear-shaped and long, five soft ribs, yellow-orange ripening from green streaks at the stem.
function papaya(id: string): THREE.Object3D {
  const orange = C('#FFB43A'), green = C('#5E8A2A')
  return lying(id, {
    rings: 44,
    segs: 60,
    shape: (phi, theta) => {
      const u = phi / Math.PI
      return { r: Math.pow(Math.sin(phi), 0.9) * (0.66 - 0.26 * smooth(0.4, 1, u)) * (1 + 0.035 * Math.cos(5 * theta)), y: -Math.cos(phi) * 1.4 }
    },
    colour: (phi, theta, out) => {
      const u = phi / Math.PI
      const streak = Math.pow(Math.max(0, Math.sin(theta * 5 + Math.sin(phi * 3))), 3)
      lerpC(out, orange, green, smooth(0.6, 1, u) * 0.8 + streak * 0.75 * smooth(0.15, 0.85, u))
    },
  }, skin({ roughness: 0.32, clearcoat: 0.6 }), Math.PI / 2.15, { kind: 'length' }, a => stemButton(a, 1.38, '#6E8A2E'))
}

function berryCluster(body1: string, drupe: string, elongate = 1): Builder {
  return () => {
    const g = new THREE.Group()
    const shape = (phi: number) => ({ r: Math.sin(phi) * 0.8 * (0.6 + 0.4 * Math.pow(phi / Math.PI, 0.5)), y: -Math.cos(phi) * elongate })
    g.add(mesh(body({ shape, colour: (_p, _t, out) => out.set(body1) }), skin({ roughness: 0.6 })))
    const geo = new THREE.SphereGeometry(0.17, 12, 10)
    const base = C(drupe), tmp = new THREE.Color()
    g.add(scatter(geo, skin({ colour: '#ffffff', roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.05 }), surfacePoints(70, 0.1, Math.PI * 0.85, shape), -0.02,
      i => tmp.copy(base).offsetHSL(0, 0, ((i * 0.618) % 1 - 0.5) * 0.1)))
    return g
  }
}

function rhubarb(): THREE.Object3D {
  const g = new THREE.Group()
  const red = C('#C8203A'), pink = C('#E86A7A'), green = C('#7FA83A')
  for (let k = 0; k < 4; k++) {
    const geo = new THREE.CylinderGeometry(0.11, 0.13, 2.4, 10, 12)
    geo.scale(1, 1, 0.7)
    const p = geo.getAttribute('position') as THREE.BufferAttribute
    const cols: number[] = []
    const tmp = new THREE.Color()
    for (let i = 0; i < p.count; i++) {
      const t = (p.getY(i) + 1.2) / 2.4
      lerpC(tmp, red, pink, t * 0.6)
      tmp.lerp(green, smooth(0.65, 1, t) * 0.8)
      cols.push(tmp.r, tmp.g, tmp.b)
    }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3))
    const m = mesh(geo, skin({ roughness: 0.35, clearcoat: 0.6 }))
    m.rotation.z = Math.PI / 2 + (k - 1.5) * 0.06
    m.rotation.y = (k - 1.5) * 0.12
    m.position.set((k % 2) * 0.1, 0.13 + (k > 1 ? 0.2 : 0), (k - 1.5) * 0.22)
    g.add(m)
  }
  const l = leaf(0.9, 0.45, 0.2)
  l.position.set(1.15, 0.3, 0)
  l.rotation.set(-0.6, 0, -1.4)
  g.add(l)
  return g
}

function blueberries(): THREE.Object3D {
  const g = new THREE.Group()
  const geo = body({
    shape: phi => ({ r: Math.sin(phi), y: -Math.cos(phi) * 0.85 - 0.12 * Math.exp(-((Math.PI - phi) ** 2) / 0.05) }),
    colour: (phi, _t, out) => lerpC(out, C('#3A4C98'), C('#1E2350'), Math.exp(-((Math.PI - phi) ** 2) / 0.03)),
  })
  const mat = skin({ roughness: 0.55, sheen: 1, sheenColor: '#B7C2EE' })
  const spots: [number, number, number][] = [[-0.38, 0, 0.1], [0.38, 0, -0.05], [0, 0, -0.38], [0.02, 0, 0.36], [0, 0.48, 0]]
  spots.forEach(([x, y, z], i) => {
    const b = mesh(geo, mat)
    b.scale.setScalar(0.34)
    b.position.set(x, y + 0.29, z)
    b.rotation.set(i * 0.7, i * 1.9, (i % 3) * 0.15)
    g.add(b)
  })
  return g
}

function melon(colour: string, under: string, net: boolean): Builder {
  return id => {
    const a = C(colour), b = C(under)
    const g = new THREE.Group()
    const { group } = cutBody({
      shape: sphereish(1, 0.92),
      colour: (phi, theta, out) => lerpC(out, a, b, net ? 0.5 + 0.5 * Math.sin(theta * 10) * Math.sin(phi * 8) : sideness(theta) * 0.3),
    }, skin({ roughness: net ? 0.85 : 0.3, clearcoat: net ? 0 : 0.6, bump: net ? 0.06 : 0.004 }), id)
    g.add(group)
    return g
  }
}

function pomegranate(id: string): THREE.Object3D {
  const { g, a } = citrusBody(id, '#B3132F', { squash: 0.9, navel: '#5A0A16', tint: '#E0503A', bump: 0.01, mode: { kind: 'across' } })
  const mat = skin({ colour: '#8E1428', roughness: 0.5 })
  const geo = new THREE.ConeGeometry(0.08, 0.24, 5)
  for (let i = 0; i < 6; i++) {
    const c = mesh(geo, mat)
    c.position.set(Math.cos((i / 6) * TAU) * 0.13, 0.98, Math.sin((i / 6) * TAU) * 0.13)
    c.rotation.set(Math.sin((i / 6) * TAU) * 0.4, 0, -Math.cos((i / 6) * TAU) * 0.4)
    a.add(c)
  }
  return g
}

function persimmon(id: string): THREE.Object3D {
  const base = C('#F2711A'), tint = C('#FF8A2A')
  const g = new THREE.Group()
  const { group, a } = cutBody({
    rings: 40,
    segs: 56,
    shape: (phi, theta) => ({ r: Math.sin(phi) * (1 + 0.05 * Math.cos(4 * theta)), y: -Math.cos(phi) * 0.74 }),
    colour: (_phi, theta, out) => lerpC(out, base, tint, sideness(theta, 2) * 0.5),
  }, skin({ roughness: 0.25, clearcoat: 0.9 }), id, { kind: 'across' })
  g.add(group)
  // A big four-leaf cap, flat on top, and its stem
  const cap = calyx(4, 0.5, 0.26, -0.55, skin({ colour: '#5E6A2A', roughness: 0.6 }))
  cap.position.y = 0.72
  a.add(cap)
  const s = stem(0.1, 0.03, 0.01)
  s.position.y = 0.73
  a.add(s)
  return g
}

// --- The eight comp-3d drew as flat stickers, now modelled so every fruit can sit in the dish and be cut.

// A dragon fruit: a pink oval covered in big leafy scales, pink at the base and green at the curling
// tips, lying along the skin and flaring out towards the top, with a tuft at the top.
function dragonFruit(id: string): THREE.Object3D {
  const pink = C('#E8336E'), deep = C('#B81A55')
  const shape: Shape = phi => ({ r: Math.sin(phi) * 0.8, y: -Math.cos(phi) * 1.05 })
  const g = new THREE.Group()
  const { group, a, parts } = cutBody({ rings: 40, segs: 48, shape, colour: (_p, theta, out) => lerpC(out, pink, deep, sideness(theta, 1) * 0.35) },
    skin({ roughness: 0.3, clearcoat: 0.7 }), id, { kind: 'length' })
  g.add(group)
  const bract = bractGeo(0.5, 0.2)
  const mat = new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.4, clearcoat: 0.5, side: THREE.DoubleSide })
  const at = (phi: number, theta: number) => {
    const s = shape(phi, theta)
    return new THREE.Vector3(s.r * Math.cos(theta), s.y, s.r * Math.sin(theta))
  }
  const rows = 4
  for (let r = 0; r < rows; r++) {
    const n = 6
    for (let k = 0; k < n; k++) {
      const phi = 0.55 + (r / rows) * 2.1
      const theta = (k / n) * TAU + r * 0.5
      const p = at(phi, theta)
      const up = at(phi + 0.05, theta).sub(p).normalize()
      const out = new THREE.Vector3(Math.cos(theta), 0, Math.sin(theta)).sub(up.clone().multiplyScalar(up.y * 0)).normalize()
      const normal = out.sub(up.clone().multiplyScalar(out.dot(up))).normalize()
      const side = new THREE.Vector3().crossVectors(up, normal)
      const l = mesh(bract, mat)
      l.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(side, up, normal))
      l.position.copy(p).addScaledVector(normal, -0.02)
      ;(Math.sin(theta) >= 0 ? a : innerOf(parts[1])).add(l)
    }
  }
  // The tuft at the top
  for (let k = 0; k < 5; k++) {
    const l = mesh(bract, mat)
    l.rotation.order = 'YXZ'
    l.rotation.y = (k / 5) * TAU
    l.rotation.x = -0.35
    l.position.y = 1.0
    l.scale.setScalar(0.7)
    a.add(l)
  }
  return g
}

// A scale for the dragon fruit: a leaf shape that curls outwards, pink at its base and green at its tip.
function bractGeo(len: number, width: number): THREE.BufferGeometry {
  const geo = leafGeo(len, width, 0.2)
  const p = geo.getAttribute('position') as THREE.BufferAttribute
  const cols: number[] = []
  const base = C('#E8417A'), tip = C('#8CC63E'), tmp = new THREE.Color()
  for (let i = 0; i < p.count; i++) {
    lerpC(tmp, base, tip, smooth(0.45, 0.95, p.getY(i) / len))
    cols.push(tmp.r, tmp.g, tmp.b)
  }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3))
  return geo
}

// A passionfruit: deep purple, gently dented and wrinkled, freckled with paler spots.
function passionfruit(id: string): THREE.Object3D {
  const dark = C('#3E1238'), mid = C('#6A2860'), speck = C('#A0789A')
  const g = new THREE.Group()
  const { group, a } = cutBody({
    rings: 44,
    segs: 56,
    shape: (phi, theta) => ({ r: Math.sin(phi) * (1 + 0.025 * Math.sin(theta * 7 + phi * 3) * Math.sin(phi * 6)), y: -Math.cos(phi) * 0.96 }),
    colour: (phi, theta, out) => {
      lerpC(out, mid, dark, 0.4 + 0.35 * Math.sin(theta * 5 + phi * 7))
      const dots = Math.sin(theta * 31) * Math.sin(phi * 27)
      out.lerp(speck, smooth(0.55, 0.95, dots) * 0.75)
    },
  }, skin({ roughness: 0.5, clearcoat: 0.35, bump: 0.03, bumpRepeat: [10, 5] }), id, { kind: 'across' })
  g.add(group)
  stemButton(a, 0.95, '#6A7A2A')
  return g
}

// A lychee: knobbly red skin (raised bumps in rows, darker in the grooves), cut to the white flesh and
// its glossy brown stone.
function lychee(id: string): THREE.Object3D {
  const red = C('#E0384A'), groove = C('#8A1426')
  const knob = (phi: number, theta: number) => Math.pow(Math.abs(Math.sin(theta * 9 + (Math.floor(phi * 4) % 2) * 0.35) * Math.sin(phi * 9)), 0.6)
  const g = new THREE.Group()
  const { group, a } = cutBody({
    rings: 48,
    segs: 64,
    shape: (phi, theta) => ({ r: Math.sin(phi) * (1 + 0.04 * knob(phi, theta)), y: -Math.cos(phi) * 1.02 }),
    colour: (phi, theta, out) => lerpC(out, groove, red, knob(phi, theta)),
  }, skin({ roughness: 0.55, clearcoat: 0.2 }), id, { kind: 'length' })
  g.add(group)
  const s = stem(0.12, 0.022, 0.03)
  s.position.y = 1.0
  a.add(s)
  return g
}

function feijoa(id: string): THREE.Object3D {
  return lying(id, { rings: 40, segs: 48, shape: sphereish(0.72, 1), colour: (_p, theta, out) => lerpC(out, C('#4E7A30'), C('#33561E'), sideness(theta) * 0.4) },
    skin({ roughness: 0.6, clearcoat: 0.2, bump: 0.025, bumpRepeat: [14, 7] }), Math.PI / 2, { kind: 'across' }, a => {
      // The dried flower tuft at the blossom end
      const tuft = calyx(4, 0.2, 0.08, -0.2, skin({ colour: '#6A5A30', roughness: 0.8 }))
      tuft.position.y = 0.98
      a.add(tuft)
    })
}

function fig(id: string): THREE.Object3D {
  const g = new THREE.Group()
  const { group, a } = cutBody({
    shape: phi => {
      const u = phi / Math.PI
      return { r: Math.sin(phi) * (1 - 0.55 * smooth(0.45, 1, u)), y: -Math.cos(phi) * 1.05 + 0.08 * u }
    },
    colour: (phi, _t, out) => lerpC(out, C('#5A2A55'), C('#8A6A3A'), smooth(0.7, 1, phi / Math.PI)),
  }, skin({ roughness: 0.5, sheen: 0.6, sheenColor: '#B89AC8' }), id)
  g.add(group)
  const s = stem(0.16, 0.035, 0.03)
  s.position.y = 1.08
  a.add(s)
  return g
}

// A brown coconut: a slightly three-sided ball of hairy husk (fibre streaks) with its three dark eyes.
function coconut(id: string): THREE.Object3D {
  const light = C('#8A6038'), dark = C('#4A2E18')
  const g = new THREE.Group()
  const { group, a } = cutBody({
    rings: 40,
    segs: 64,
    shape: (phi, theta) => ({ r: Math.sin(phi) * (1 + 0.04 * Math.cos(3 * theta)), y: -Math.cos(phi) * 0.96 }),
    colour: (phi, theta, out) => lerpC(out, light, dark, 0.5 + 0.5 * Math.sin(theta * 45 + Math.sin(phi * 9) * 2.5)),
  }, skin({ roughness: 1, sheen: 0.8, sheenColor: '#B89060', bump: 0.06, bumpRepeat: [24, 6] }), id, { kind: 'across' })
  g.add(group)
  const eyeMat = skin({ colour: '#2A180C', roughness: 0.6 })
  for (let k = 0; k < 3; k++) {
    const ang = (k / 3) * TAU
    const e = mesh(new THREE.SphereGeometry(0.07, 10, 8), eyeMat)
    e.scale.set(1, 0.4, 1)
    e.position.set(Math.cos(ang) * 0.17, 0.94, Math.sin(ang) * 0.17)
    a.add(e)
  }
  return g
}

// A custard apple: a green heart covered in rounded scales in offset rows, darker where they meet.
function custardApple(id: string): THREE.Object3D {
  const green = C('#A8C46A'), edge = C('#4E6A28')
  const scale = (phi: number, theta: number) => {
    const b = (phi / Math.PI) * 7
    const row = Math.floor(b)
    const a = (theta / TAU) * 9 + (row % 2) * 0.5
    const d = Math.hypot(a - Math.floor(a) - 0.5, b - row - 0.5)
    return 1 - smooth(0.22, 0.5, d)
  }
  const g = new THREE.Group()
  const { group, a } = cutBody({
    rings: 56,
    segs: 72,
    shape: (phi, theta) => ({ r: Math.sin(phi) * (0.78 + 0.22 * phi / Math.PI) * (1 + 0.05 * scale(phi, theta)), y: -Math.cos(phi) }),
    colour: (phi, theta, out) => lerpC(out, edge, green, scale(phi, theta)),
  }, skin({ roughness: 0.65, clearcoat: 0.15 }), id, { kind: 'length' })
  g.add(group)
  const s = stem(0.12, 0.035, 0.02)
  s.position.y = 0.98
  a.add(s)
  return g
}

function quince(id: string): THREE.Object3D {
  return pear('#E8C83A', '#C8A030', { neck: 0.3, rough: 0.6, gloss: 0.15, bump: 0.03 })(id)
}

// Every fruit in fruits.ts. Round ones are built in halves and can be cut open; bunches, berries,
// bananas and stalks hop when tapped instead.
const BUILDERS: Record<string, Builder> = {
  apple,
  orange: citrus('#FF8A1E', { tint: '#FF6A12', leaf: true }),
  mandarin: citrus('#FF8E1E', { squash: 0.76, tint: '#FF7010', leaf: true, pucker: 0.03 }),
  tangelo: citrus('#FF6F1E', { neck: 0.18, tint: '#F5501A' }),
  grapefruit: citrus('#F7C04A', { tint: '#F58A6A', squash: 0.94 }),
  lemon: lemonLike('#F7D63A', 0.14),
  lime: lemonLike('#4E9A2E', 0.06),
  strawberry,
  cherry: cherries,
  banana,
  grape: cluster('#6E3FA8', 22, 0.16, { bloom: true, elongate: 1.12 }),
  pear: pear('#B5CC3A', '#E2A63A'),
  peach: stoneFruit('#FFB27A', '#E8483A', { fuzz: 1 }),
  nectarine: stoneFruit('#F7A23A', '#C8202E', { gloss: 0.7 }),
  apricot: stoneFruit('#FFA94D', '#F26A2A', { fuzz: 0.6, tall: 0.95 }),
  plum: stoneFruit('#5B1E5E', '#3A0E3A', { bloom: true, tall: 0.95 }),
  watermelon,
  blueberry: blueberries,
  raspberry: berryCluster('#B0204A', '#D6305C'),
  mulberry: berryCluster('#2A0A20', '#4A0E36', 1.5),
  pineapple,
  starfruit,
  kiwifruit,
  avocado: pear('#2E4A1C', '#1A2A12', { neck: 0.38, rough: 0.7, gloss: 0.4, bump: 0.05 }),
  mango,
  papaya,
  rhubarb,
  honeydew: melon('#DDE6A8', '#C8D890', false),
  rockmelon: melon('#C2AE82', '#8A9A5A', true),
  pomegranate,
  persimmon,
  'dragon-fruit': dragonFruit,
  passionfruit,
  lychee,
  feijoa,
  fig,
  coconut,
  'custard-apple': custardApple,
  quince,
}

export const hasModel = (id: string) => id in BUILDERS
export const MODEL_IDS = Object.keys(BUILDERS)

// Any fruit we have not modelled (a new one added to fruits.ts): a plain round body in its colour,
// still cuttable, so the hero never shows a gap.
function generic(colour: string): Builder {
  return citrus(colour, { navel: colour, bump: 0.004 })
}

// Long or flat fruit fill less of their bounding sphere, so they are drawn a little larger.
const FIT: Record<string, number> = { banana: 1.45, rhubarb: 1.35, starfruit: 1.12, papaya: 1.08, mango: 1.05 }

const built = new Map<string, THREE.Object3D>()
let buildColour = '#E8607A' // the fruit's own colour while it builds, for generic flesh

// A fresh copy of the fruit, centred on x/z, resting on y = 0, fitting a sphere of diameter 1.
// Clones share geometry and materials; cut halves are moved per clone, never the prototype.
export function buildFruit(id: string, colour = '#E8607A'): THREE.Object3D {
  let proto = built.get(id)
  if (!proto) {
    buildColour = colour
    const raw = (BUILDERS[id] ?? generic(colour))(id)
    const box = new THREE.Box3().setFromObject(raw)
    const sphere = box.getBoundingSphere(new THREE.Sphere())
    const k = (0.5 / sphere.radius) * (FIT[id] ?? 1)
    raw.scale.multiplyScalar(k)
    raw.position.set(-sphere.center.x * k, -box.min.y * k, -sphere.center.z * k)
    proto = new THREE.Group().add(raw)
    built.set(id, proto)
  }
  return proto.clone()
}
