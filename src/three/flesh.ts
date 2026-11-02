// What a fruit looks like inside, for the cut faces in the Now hero (./models.ts `cutBody`).
// Each face is a canvas texture drawn on the fruit's own cross-section: flesh with a glow towards the
// middle, the skin and pith as bands round the edge, then segments, rays, seeds, a hollow or a stone.
// Sizes are fractions of the face: widths of its smaller side, positions of its box.
import * as THREE from 'three'

interface Seeds {
  colour: string
  n: number
  r: number                      // seed radius
  ring?: number                  // seeds on an oval this far out (fraction of the half-size)
  spread?: number                // or scattered sunflower-style out to this far
  shape?: 'round' | 'drop'       // drops point outwards
  halo?: string                  // a pulp sac round each seed (passionfruit, pomegranate)
}

export interface FleshSpec {
  flesh: string
  core?: string                  // the colour the flesh glows to at the centre
  coreR?: number
  rind?: string                  // skin band
  rindW?: number
  pith?: string                  // the band inside the skin (watermelon white, citrus pith)
  pithW?: number
  centre?: [number, number]      // where the middle is, as a fraction of the face's box from the bottom left
  segments?: { n: number; colour: string }
  rays?: { n: number; colour: string; from: number; to: number }
  pit?: { colour: string; r: number }      // a hollow or stone bed
  stone?: { colour: string; r: number }    // a 3D stone sitting proud of one half (avocado, peach)
  seeds?: Seeds
  ghost?: { colour: string; scale: number } // the outline again, smaller, in the middle (starfruit's pale star)
  across?: Partial<FleshSpec>              // differences when the cut goes across instead of lengthways
}

export type CutKind = 'length' | 'across'

const CITRUS = (flesh: string, rind: string, core: string): FleshSpec => ({
  flesh, core, coreR: 0.5, rind, rindW: 0.035, pith: '#FFF1D8', pithW: 0.03, segments: { n: 10, colour: '#FFF1D8' },
})
const STONE = (flesh: string, core: string, rind: string, stone: string, r = 0.22): FleshSpec => ({
  flesh, core, coreR: 0.45, rind, rindW: 0.02, pit: { colour: core, r: r + 0.04 }, stone: { colour: stone, r },
})

export const FLESH: Record<string, FleshSpec> = {
  watermelon: { flesh: '#F23A4F', core: '#FF6B78', rind: '#24572C', rindW: 0.05, pith: '#E9F2C9', pithW: 0.05, seeds: { colour: '#1E1414', n: 16, r: 0.028, ring: 0.55, shape: 'drop' } },
  kiwifruit: { flesh: '#7DBB3A', core: '#F2F0C6', coreR: 0.34, rind: '#7A5630', rindW: 0.03, rays: { n: 30, colour: '#C9E39A', from: 0.22, to: 0.78 }, seeds: { colour: '#1A1A10', n: 46, r: 0.018, ring: 0.4, shape: 'drop' } },
  orange: CITRUS('#FF9520', '#FF7A10', '#FFC870'),
  mandarin: CITRUS('#FF961E', '#FF7A10', '#FFC060'),
  tangelo: CITRUS('#FF7A1E', '#F5601A', '#FFAE6A'),
  grapefruit: CITRUS('#F25C5A', '#F6A03A', '#FF9A8A'),
  lemon: CITRUS('#FFE45A', '#F5C81E', '#FFF2A0'),
  lime: CITRUS('#B8E05A', '#3F8A2A', '#E2F2A0'),
  'dragon-fruit': { flesh: '#FBF5EC', core: '#FFFDF8', rind: '#E8336E', rindW: 0.04, seeds: { colour: '#151010', n: 150, r: 0.012, spread: 0.86 } },
  passionfruit: { flesh: '#F5B21E', core: '#FFD25A', rind: '#4A1D44', rindW: 0.06, pith: '#F2E6CC', pithW: 0.07, seeds: { colour: '#1C140C', n: 34, r: 0.03, spread: 0.62, halo: '#FFE08A' } },
  avocado: { flesh: '#9AC84A', core: '#F0E58A', coreR: 0.7, rind: '#26381A', rindW: 0.025, centre: [0.5, 0.38], pit: { colour: '#E2D27A', r: 0.3 }, stone: { colour: '#7A4A2A', r: 0.26 } },
  peach: STONE('#FFB24A', '#E8603A', '#E8483A', '#8A4A2E'),
  nectarine: STONE('#FFB03A', '#E8503A', '#C8202E', '#8A4A2E'),
  apricot: STONE('#FFA53A', '#FF8A2A', '#F26A2A', '#9A5A30', 0.25),
  plum: STONE('#F2C43A', '#E8A030', '#5B1E5E', '#9A6A3A', 0.24),
  mango: { flesh: '#FF9A12', core: '#FFB52E', rind: '#8FB03A', rindW: 0.025, pit: { colour: '#F9E7B0', r: 0.3 } },
  strawberry: { flesh: '#E8303E', core: '#FFC9C4', coreR: 0.5, rind: '#C81A30', rindW: 0.03, centre: [0.5, 0.55], rays: { n: 14, colour: '#FF9A9A', from: 0.15, to: 0.8 } },
  apple: { flesh: '#FFF1CC', core: '#F7E7B0', rind: '#C8182A', rindW: 0.02, seeds: { colour: '#4A2A14', n: 5, r: 0.05, ring: 0.14, shape: 'drop' } },
  pear: { flesh: '#F7F3CF', core: '#EFE8B8', rind: '#B5CC3A', rindW: 0.02, centre: [0.5, 0.38], seeds: { colour: '#4A2A14', n: 4, r: 0.04, ring: 0.12, shape: 'drop' } },
  quince: { flesh: '#F6EBC2', core: '#EFDDA0', rind: '#E8C83A', rindW: 0.025, centre: [0.5, 0.38], seeds: { colour: '#5A341A', n: 5, r: 0.04, ring: 0.14, shape: 'drop' } },
  pineapple: {
    flesh: '#FFD84A', core: '#FFF0A0', coreR: 0.25, rind: '#A87A1E', rindW: 0.06, rays: { n: 22, colour: '#FFE98A', from: 0.25, to: 0.9 },
    // A ring: golden flesh with fibres, the darker skin edge dotted with eyes, and the paler core.
    across: { flesh: '#FFC928', core: '#FFD94A', coreR: 0.8, rind: '#8A5A14', rindW: 0.075, pith: '#E8B030', pithW: 0.02, pit: { colour: '#FFF1A8', r: 0.24 }, rays: { n: 26, colour: '#FFE680', from: 0.28, to: 0.86 }, seeds: { colour: '#6A4410', n: 18, r: 0.02, ring: 0.84 } },
  },
  papaya: { flesh: '#FF7A3A', core: '#FF9A50', rind: '#7FA83A', rindW: 0.025, pit: { colour: '#E8552E', r: 0.42 }, seeds: { colour: '#1A1210', n: 44, r: 0.03, spread: 0.36 } },
  // Cut across, a starfruit is a star: a pale inner star and a few seeds round the middle.
  starfruit: { flesh: '#FFD93A', core: '#FFEB8A', coreR: 0.7, rind: '#C8A41E', rindW: 0.03, ghost: { colour: '#FFF4B8', scale: 0.34 }, seeds: { colour: '#7A5A20', n: 5, r: 0.035, ring: 0.24, shape: 'drop' } },
  // A banana coin: pale cream flesh, a yellow skin ring, and the faint brown seed dots in the middle.
  banana: { flesh: '#FFF1C4', core: '#FBE3A0', coreR: 0.4, rind: '#F2CC2E', rindW: 0.07, seeds: { colour: '#9A7A4A', n: 6, r: 0.03, ring: 0.16 } },
  persimmon: { flesh: '#FF8A2A', core: '#FFB060', rind: '#F2711A', rindW: 0.02, rays: { n: 8, colour: '#FFC890', from: 0.05, to: 0.4 } },
  pomegranate: { flesh: '#FFF0DA', rind: '#B3132F', rindW: 0.05, seeds: { colour: '#D8193A', n: 70, r: 0.055, spread: 0.78, halo: '#FF6A80' } },
  honeydew: { flesh: '#C4E8A0', core: '#E6F2C8', rind: '#D7E0A0', rindW: 0.03, pit: { colour: '#E8EFC8', r: 0.32 }, seeds: { colour: '#F2E6B8', n: 24, r: 0.03, ring: 0.3, shape: 'drop' } },
  rockmelon: { flesh: '#FF9A4A', core: '#FFB870', rind: '#B8A27A', rindW: 0.045, pith: '#D8E0A0', pithW: 0.02, pit: { colour: '#F2A050', r: 0.34 }, seeds: { colour: '#F7E2B0', n: 26, r: 0.03, ring: 0.3, shape: 'drop' } },
  lychee: { flesh: '#F7F2E8', core: '#EFE6D0', rind: '#C8283A', rindW: 0.03, pit: { colour: '#E4D8C0', r: 0.36 }, stone: { colour: '#4A2414', r: 0.3 } },
  feijoa: { flesh: '#F2EED2', core: '#E5DFAE', coreR: 0.5, rind: '#3E6B2A', rindW: 0.03, seeds: { colour: '#9A8A5A', n: 30, r: 0.012, ring: 0.3 } },
  fig: { flesh: '#F2DFC0', core: '#D8304E', coreR: 0.65, rind: '#5A2A55', rindW: 0.04, centre: [0.5, 0.42], seeds: { colour: '#F7E7A8', n: 60, r: 0.014, spread: 0.5 } },
  coconut: { flesh: '#F7F2E6', rind: '#5A3A1E', rindW: 0.07, pit: { colour: '#DCD6C8', r: 0.62 } },
  'custard-apple': { flesh: '#F7F1E2', core: '#FFFBF2', rind: '#7FA04A', rindW: 0.03, seeds: { colour: '#1A1410', n: 14, r: 0.035, spread: 0.7, shape: 'drop' } },
}

// Fruit without a spec: flesh a pale tone of the fruit's colour, its skin the colour itself.
function genericSpec(colour: string): FleshSpec {
  const c = new THREE.Color(colour)
  const flesh = c.clone().lerp(new THREE.Color('#FFF4DC'), 0.55)
  const core = c.clone().lerp(new THREE.Color('#FFF4DC'), 0.8)
  return { flesh: `#${flesh.getHexString()}`, core: `#${core.getHexString()}`, rind: colour, rindW: 0.035 }
}

export function fleshOf(id: string, colour = '#E8607A', kind: CutKind = 'length'): FleshSpec {
  const spec = FLESH[id] ?? genericSpec(colour)
  return kind === 'across' && spec.across ? { ...spec, ...spec.across } : spec
}

// A steady pseudo-random number per index, so seeds land in the same places every time.
const rand = (i: number, k = 1) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453
  return x - Math.floor(x)
}

function paint(spec: FleshSpec, outline: THREE.Vector2[], box: THREE.Box2): HTMLCanvasElement {
  const size = box.getSize(new THREE.Vector2())
  const scale = 512 / Math.max(size.x, size.y)
  const W = Math.max(8, Math.round(size.x * scale)), H = Math.max(8, Math.round(size.y * scale))
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const g = c.getContext('2d')!
  const min = Math.min(W, H)
  const toX = (x: number) => ((x - box.min.x) / size.x) * W
  const toY = (y: number) => (1 - (y - box.min.y) / size.y) * H
  const path = new Path2D()
  outline.forEach((p, i) => (i ? path.lineTo(toX(p.x), toY(p.y)) : path.moveTo(toX(p.x), toY(p.y))))
  path.closePath()
  const [fx, fy] = spec.centre ?? [0.5, 0.5]
  const cx = fx * W, cy = (1 - fy) * H
  const hw = W / 2, hh = H / 2

  g.save()
  g.clip(path)
  // Flesh, glowing to its core
  g.fillStyle = spec.flesh
  g.fillRect(0, 0, W, H)
  if (spec.core) {
    const r = (spec.coreR ?? 0.6) * Math.max(hw, hh)
    const grad = g.createRadialGradient(cx, cy, 0, cx, cy, r)
    grad.addColorStop(0, spec.core)
    grad.addColorStop(1, spec.flesh)
    g.fillStyle = grad
    g.beginPath()
    g.ellipse(cx, cy, r * (W / Math.max(W, H)) * 1.2, r * (H / Math.max(W, H)) * 1.2, 0, 0, Math.PI * 2)
    g.fill()
  }
  // Citrus segments and kiwi/pineapple rays: lines out from the middle
  if (spec.segments) {
    g.strokeStyle = spec.segments.colour
    g.lineWidth = min * 0.014
    for (let k = 0; k < spec.segments.n; k++) {
      const a = (k / spec.segments.n) * Math.PI * 2
      g.beginPath()
      g.moveTo(cx + Math.cos(a) * hw * 0.08, cy + Math.sin(a) * hh * 0.08)
      g.lineTo(cx + Math.cos(a) * hw, cy + Math.sin(a) * hh)
      g.stroke()
    }
  }
  if (spec.rays) {
    const { n, colour, from, to } = spec.rays
    g.strokeStyle = colour
    g.lineWidth = min * 0.01
    g.lineCap = 'round'
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2 + rand(k, 3) * 0.1
      g.beginPath()
      g.moveTo(cx + Math.cos(a) * hw * from, cy + Math.sin(a) * hh * from)
      g.lineTo(cx + Math.cos(a) * hw * to, cy + Math.sin(a) * hh * to)
      g.stroke()
    }
  }
  if (spec.pit) {
    g.fillStyle = spec.pit.colour
    g.beginPath()
    g.ellipse(cx, cy, hw * spec.pit.r, hh * spec.pit.r, 0, 0, Math.PI * 2)
    g.fill()
  }
  if (spec.ghost) {
    g.save()
    g.translate(cx, cy)
    g.scale(spec.ghost.scale, spec.ghost.scale)
    g.translate(-cx, -cy)
    g.fillStyle = spec.ghost.colour
    g.fill(path)
    g.restore()
  }
  if (spec.seeds) drawSeeds(g, spec.seeds, cx, cy, hw, hh, min)
  // Skin and pith: bands drawn by stroking the outline (half of each stroke falls inside the clip)
  if (spec.pith) {
    g.strokeStyle = spec.pith
    g.lineWidth = ((spec.rindW ?? 0) + (spec.pithW ?? 0.03)) * min * 2
    g.stroke(path)
  }
  if (spec.rind) {
    g.strokeStyle = spec.rind
    g.lineWidth = (spec.rindW ?? 0.03) * min * 2
    g.stroke(path)
  }
  g.restore()
  return c
}

function drawSeeds(g: CanvasRenderingContext2D, s: Seeds, cx: number, cy: number, hw: number, hh: number, min: number) {
  const r = s.r * min
  for (let i = 0; i < s.n; i++) {
    let x: number, y: number, a: number
    if (s.ring !== undefined) {
      a = (i / s.n) * Math.PI * 2 + rand(i) * 0.25
      const k = s.ring * (0.92 + rand(i, 2) * 0.16)
      x = cx + Math.cos(a) * hw * k
      y = cy + Math.sin(a) * hh * k
    } else {
      // Sunflower spread: even cover without clumps
      a = i * 2.39996
      const k = Math.sqrt((i + 0.5) / s.n) * (s.spread ?? 0.7)
      x = cx + Math.cos(a) * hw * k
      y = cy + Math.sin(a) * hh * k
    }
    if (s.halo) {
      g.fillStyle = s.halo
      g.beginPath()
      g.arc(x, y, r * 1.9, 0, Math.PI * 2)
      g.fill()
    }
    g.fillStyle = s.colour
    g.beginPath()
    if (s.shape === 'drop') g.ellipse(x, y, r * 0.65, r * 1.25, a + Math.PI / 2, 0, Math.PI * 2)
    else g.arc(x, y, r, 0, Math.PI * 2)
    g.fill()
  }
}

const cache = new Map<string, THREE.Material>()

// One material per fruit and cut direction, shared by every face of every clone. Double-sided: one face
// serves the pieces either side of it. The texture also lights itself a little (emissive), so the flesh
// keeps its own colour whichever way the face turns to the light: the inside is the payoff.
export function fleshMaterial(id: string, outline: THREE.Vector2[], box: THREE.Box2, colour?: string, kind: CutKind = 'length'): THREE.Material {
  const key = `${id}:${kind}`
  let m = cache.get(key)
  if (!m) {
    const tex = new THREE.CanvasTexture(paint(fleshOf(id, colour, kind), outline, box))
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 4
    m = new THREE.MeshStandardMaterial({
      map: tex, color: 0x7a7a7a, emissiveMap: tex, emissive: 0xffffff, emissiveIntensity: 0.58,
      roughness: 0.55, envMapIntensity: 0.35, side: THREE.DoubleSide,
    })
    cache.set(key, m)
  }
  return m
}

// The stone that stays in one half (avocado, peach, lychee), sitting proud of the cut face.
export function stoneMesh(id: string, box: THREE.Box2): THREE.Mesh | null {
  const spec = FLESH[id]
  if (!spec?.stone) return null
  const size = box.getSize(new THREE.Vector2())
  const [fx, fy] = spec.centre ?? [0.5, 0.5]
  const rx = (size.x / 2) * spec.stone.r, ry = (size.y / 2) * spec.stone.r
  const geo = new THREE.SphereGeometry(1, 24, 16)
  geo.scale(rx, ry, Math.min(rx, ry) * 0.8)
  const m = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ color: spec.stone.colour, roughness: 0.45, clearcoat: 0.5 }))
  m.position.set(box.min.x + fx * size.x, box.min.y + fy * size.y, 0)
  m.castShadow = true
  return m
}
