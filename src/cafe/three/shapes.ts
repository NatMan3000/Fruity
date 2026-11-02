import * as THREE from 'three'
import type { Body, Cut } from '../logic/traits'

// Low-poly procedural fruit: whole shapes and chopped pieces. Geometries and materials are made
// once and shared, so 40 pieces cost a handful of GPU buffers.

const geoCache = new Map<string, THREE.BufferGeometry>()
function cached(key: string, make: () => THREE.BufferGeometry): THREE.BufferGeometry {
  let g = geoCache.get(key)
  if (!g) {
    g = make()
    g.computeBoundingSphere()
    geoCache.set(key, g)
  }
  return g
}

// Three-step toon shading: bright, flat and cheap, like a picture book.
let gradient: THREE.DataTexture | null = null
function toonGradient(): THREE.DataTexture {
  if (!gradient) {
    gradient = new THREE.DataTexture(new Uint8Array([110, 190, 255]), 3, 1, THREE.RedFormat)
    gradient.minFilter = THREE.NearestFilter
    gradient.magFilter = THREE.NearestFilter
    gradient.needsUpdate = true
  }
  return gradient
}

const matCache = new Map<string, THREE.Material>()
export function toon(colour: string): THREE.Material {
  let m = matCache.get(colour)
  if (!m) {
    m = new THREE.MeshToonMaterial({ color: colour, gradientMap: toonGradient() })
    matCache.set(colour, m)
  }
  return m
}

const round = (n: number) => Math.round(n * 100) / 100

// ---------- Whole fruit ----------

export interface WholePart {
  geometry: THREE.BufferGeometry
  colour: string
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number]
}

const LEAF = '#4CAF50'
const STEM = '#6B4A2B'

function leafParts(size: number): WholePart[] {
  return [
    { geometry: cached('stem', () => new THREE.CylinderGeometry(0.025, 0.03, 0.12, 6)), colour: STEM, position: [0, size * 0.98, 0], scale: [1, Math.max(0.6, size * 3), 1] },
    { geometry: cached('leaf', () => new THREE.SphereGeometry(0.1, 8, 4)), colour: LEAF, position: [0.07, size * 0.98 + 0.02, 0], rotation: [0, 0, -0.6], scale: [1, 0.25, 0.55] },
  ]
}

export function wholeParts(body: Body, size: number, skin: string, fruitId: string): WholePart[] {
  const s = round(size)
  switch (body) {
    case 'ball': {
      const parts: WholePart[] = [{ geometry: cached(`ball-${s}`, () => new THREE.SphereGeometry(s, 18, 12)), colour: skin }]
      // Big, bumpy or tiny fruit have no leaf; the rest get a stem and leaf so they read as fruit.
      if (s >= 0.18 && s < 0.4 && !['passionfruit', 'pomegranate', 'custard-apple', 'coconut'].includes(fruitId)) parts.push(...leafParts(s))
      if (fruitId === 'pomegranate') parts.push({ geometry: cached('crown', () => new THREE.CylinderGeometry(0.08, 0.05, 0.1, 6)), colour: skin, position: [0, s * 1.02, 0] })
      if (fruitId === 'cherry') parts.push({ geometry: cached('cherry-stem', () => new THREE.CylinderGeometry(0.012, 0.012, 0.3, 4)), colour: '#5F8A3A', position: [0.03, s + 0.13, 0], rotation: [0, 0, -0.25] })
      return parts
    }
    case 'oval': {
      const parts: WholePart[] = [{ geometry: cached(`ball-${s}`, () => new THREE.SphereGeometry(s, 18, 12)), colour: skin, scale: [1.3, 0.88, 0.88] }]
      if (fruitId === 'watermelon') {
        for (let i = 0; i < 6; i++) {
          // Rings through the long (x) axis, squashed to the oval's outline before they turn.
          parts.push({ geometry: cached(`stripe-${s}`, () => new THREE.TorusGeometry(s, s * 0.06, 4, 28)), colour: '#2A6B2E', rotation: [(i * Math.PI) / 6, 0, 0], scale: [1.32, 0.9, 1] })
        }
      }
      if (fruitId === 'dragon-fruit') {
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2
          parts.push({ geometry: cached('fin', () => new THREE.ConeGeometry(0.06, 0.18, 4)), colour: '#7CC25A', position: [Math.cos(a) * s * 0.9, 0.05, Math.sin(a) * s * 0.75], rotation: [Math.sin(a) * 1.2, 0, -Math.cos(a) * 1.2] })
        }
      }
      return parts
    }
    case 'pear':
      return [
        { geometry: cached(`pear-${s}`, () => pearGeometry(s)), colour: skin },
        ...leafParts(s * 1.15),
      ]
    case 'cone':
      return [
        { geometry: cached(`berry-${s}`, () => strawberryGeometry(s)), colour: skin, rotation: [Math.PI, 0, 0] },
        { geometry: cached(`calyx-${s}`, () => new THREE.ConeGeometry(s * 0.75, s * 0.25, 7)), colour: LEAF, position: [0, s * 0.95, 0], rotation: [Math.PI, 0, 0] },
      ]
    case 'long':
      return [
        { geometry: cached(`banana-${s}`, () => bananaGeometry(s)), colour: skin },
        { geometry: cached('tip', () => new THREE.SphereGeometry(0.05, 6, 4)), colour: '#5B4630', position: [-s * 1.05, s * 0.5, 0] },
      ]
    case 'stalk':
      return [
        { geometry: cached(`stalk-${s}`, () => new THREE.CylinderGeometry(0.075, 0.09, s * 2.4, 8)), colour: skin, rotation: [0, 0, Math.PI / 2] },
        { geometry: cached('rhubarb-leaf', () => new THREE.SphereGeometry(0.18, 8, 4)), colour: LEAF, position: [s * 1.25, 0.04, 0], scale: [1, 0.3, 1.2] },
      ]
    case 'star':
      return [{ geometry: cached(`star-whole-${s}`, () => starGeometry(s, s * 0.45, s * 1.6)), colour: skin, rotation: [0, Math.PI / 2, 0] }]
    case 'pineapple': {
      const parts: WholePart[] = [{ geometry: cached(`ball-${s}`, () => new THREE.SphereGeometry(s, 18, 12)), colour: skin, scale: [0.82, 1.15, 0.82] }]
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2
        parts.push({ geometry: cached('crown-leaf', () => new THREE.ConeGeometry(0.06, 0.34, 4)), colour: '#3E8E41', position: [Math.cos(a) * 0.06, s * 1.2, Math.sin(a) * 0.06], rotation: [Math.sin(a) * 0.5, 0, -Math.cos(a) * 0.5] })
      }
      return parts
    }
  }
}

// The collider that stands in for the whole fruit.
export function wholeCollider(body: Body, size: number): { kind: 'ball'; r: number } | { kind: 'capsule'; half: number; r: number } {
  if (body === 'long') return { kind: 'capsule', half: size * 0.7, r: size * 0.42 }
  if (body === 'stalk') return { kind: 'capsule', half: size * 1.1, r: 0.1 }
  if (body === 'star') return { kind: 'capsule', half: size * 0.55, r: size * 0.7 }
  if (body === 'oval') return { kind: 'ball', r: size * 1.05 }
  return { kind: 'ball', r: size }
}

function pearGeometry(s: number) {
  const pts: THREE.Vector2[] = []
  for (let i = 0; i <= 12; i++) {
    const t = i / 12
    const y = -s + t * s * 2.1
    const bulge = Math.sin(Math.PI * t) * (1 - 0.45 * t)
    pts.push(new THREE.Vector2(Math.max(0.001, s * 1.05 * bulge + (t > 0.95 ? 0 : 0.0)), y))
  }
  return new THREE.LatheGeometry(pts, 14)
}

function strawberryGeometry(s: number) {
  const pts: THREE.Vector2[] = []
  for (let i = 0; i <= 10; i++) {
    const t = i / 10
    const r = Math.sin(Math.PI * Math.pow(t, 0.75)) * s * (0.55 + 0.45 * t)
    pts.push(new THREE.Vector2(Math.max(0.001, r), -s + t * s * 1.9))
  }
  return new THREE.LatheGeometry(pts, 12)
}

function bananaGeometry(s: number) {
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-s * 1.05, s * 0.45, 0),
    new THREE.Vector3(0, -s * 0.55, 0),
    new THREE.Vector3(s * 1.05, s * 0.45, 0),
  )
  return new THREE.TubeGeometry(curve, 14, s * 0.4, 7, false)
}

function starShape(outer: number, inner: number): THREE.Shape {
  const shape = new THREE.Shape()
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner
    const a = (i / 10) * Math.PI * 2 + Math.PI / 2
    const x = Math.cos(a) * r
    const y = Math.sin(a) * r
    if (i === 0) shape.moveTo(x, y)
    else shape.lineTo(x, y)
  }
  shape.closePath()
  return shape
}

function starGeometry(outer: number, inner: number, depth: number) {
  const g = new THREE.ExtrudeGeometry(starShape(outer, inner), { depth, bevelEnabled: false })
  g.center()
  return g
}

// ---------- Chopped pieces ----------

export interface PieceSpec {
  geometry: THREE.BufferGeometry
  collider: 'cuboid' | 'ball' | 'hull'
  count: number
}

export function pieceSpec(cut: Cut, size: number, fruitId: string): PieceSpec {
  const s = round(size)
  switch (cut) {
    case 'cube': {
      const e = round(Math.min(0.24, Math.max(0.15, s * 0.55)))
      return { geometry: cached(`cube-${e}`, () => new THREE.BoxGeometry(e, e, e)), collider: 'cuboid', count: s >= 0.4 ? 7 : 6 }
    }
    case 'disc': {
      const r = round(Math.min(0.24, Math.max(0.11, s * 0.72)))
      return { geometry: cached(`disc-${r}`, () => new THREE.CylinderGeometry(r, r, 0.07, 14)), collider: 'hull', count: 5 }
    }
    case 'star': {
      return { geometry: cached('star-slice', () => { const g = starGeometry(0.2, 0.09, 0.07); g.rotateX(-Math.PI / 2); return g }), collider: 'hull', count: 5 }
    }
    case 'wedge': {
      const r = round(Math.min(0.3, Math.max(0.16, s * 0.9)))
      return { geometry: cached(`wedge-${r}`, () => wedgeGeometry(r)), collider: 'hull', count: fruitId === 'mandarin' || fruitId === 'tangelo' ? 6 : 4 }
    }
    case 'half': {
      const r = round(Math.min(0.24, Math.max(0.12, s * 0.85)))
      return { geometry: cached(`half-${r}`, () => halfGeometry(r)), collider: 'hull', count: fruitId === 'passionfruit' ? 2 : 4 }
    }
    case 'seeds':
      return { geometry: cached('seed', () => new THREE.SphereGeometry(0.065, 8, 6)), collider: 'ball', count: 12 }
    case 'small': {
      const count = fruitId === 'blueberry' || fruitId === 'raspberry' || fruitId === 'mulberry' ? 6 : fruitId === 'lychee' ? 3 : 4
      const geometry = fruitId === 'raspberry' || fruitId === 'mulberry'
        ? cached(`drupe-${s}`, () => new THREE.DodecahedronGeometry(s, 0))
        : cached(`ball-${s}`, () => new THREE.SphereGeometry(s, 14, 10))
      return { geometry, collider: 'ball', count }
    }
  }
}

function wedgeGeometry(r: number) {
  const shape = new THREE.Shape()
  const a = Math.PI / 2.6
  shape.moveTo(0, 0)
  for (let i = 0; i <= 6; i++) {
    const t = -a / 2 + (a * i) / 6
    shape.lineTo(Math.cos(t) * r, Math.sin(t) * r)
  }
  shape.closePath()
  const g = new THREE.ExtrudeGeometry(shape, { depth: r * 0.45, bevelEnabled: false })
  g.center()
  return g
}

function halfGeometry(r: number) {
  const pts = [new THREE.Vector2(0.001, 0)]
  for (let i = 0; i <= 6; i++) {
    const t = (i / 6) * (Math.PI / 2)
    pts.push(new THREE.Vector2(Math.max(0.001, Math.cos(t) * r), Math.sin(t) * r))
  }
  const g = new THREE.LatheGeometry(pts, 12)
  g.center()
  return g
}

// ---------- The bowl ----------

export const BOWL = { floor: 0.95, rim: 1.65, depth: 0.8, base: 0.1, wall: 0.09 }

// A point on the inside wall, t from 0 (floor edge) to 1 (rim).
export function bowlInner(t: number): [number, number] {
  const a = t * (Math.PI / 2)
  return [BOWL.floor + (BOWL.rim - BOWL.floor) * Math.sin(a), BOWL.base + BOWL.depth * (1 - Math.cos(a))]
}

export function bowlGeometry(): THREE.LatheGeometry {
  return cached('bowl', () => {
    const pts: THREE.Vector2[] = [new THREE.Vector2(0.001, BOWL.base)]
    for (let i = 0; i <= 14; i++) {
      const [x, y] = bowlInner(i / 14)
      pts.push(new THREE.Vector2(x, y))
    }
    // Rounded lip, then down the outside to a foot.
    pts.push(new THREE.Vector2(BOWL.rim + BOWL.wall * 0.6, BOWL.base + BOWL.depth + 0.04))
    pts.push(new THREE.Vector2(BOWL.rim + BOWL.wall, BOWL.base + BOWL.depth - 0.04))
    for (let i = 14; i >= 0; i--) {
      const [x, y] = bowlInner(i / 14)
      pts.push(new THREE.Vector2(x + BOWL.wall, y - BOWL.wall * 0.9))
    }
    pts.push(new THREE.Vector2(0.75, -0.05))
    pts.push(new THREE.Vector2(0.001, -0.05))
    return new THREE.LatheGeometry(pts, 40)
  }) as THREE.LatheGeometry
}
