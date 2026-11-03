// What a fruit looks like inside, for the cut faces (./models.ts `cutBody`). Each face is a canvas
// texture drawn on the fruit's own cross-section, painted from photos of the real cut fruit (or, for
// the few without one, its well-known look): the flesh, a deeper or paler band just under the skin, the
// fruit's own inside (a strawberry's pale core and fibres, an apple's seed chambers, a peach's stone
// bed, a pomegranate's packed seeds), then the skin and pith as bands round the edge.
// Sizes are fractions of the face: widths of its smaller side, positions of its box. The canvas is
// at most 512 px on its long side and painted once per fruit and cut direction.
import * as THREE from 'three'

interface Seeds {
  colour: string
  n: number
  r: number                      // seed radius
  ring?: number                  // seeds on an oval this far out (fraction of the half-size)
  spread?: number                // or scattered sunflower-style out to this far
  shape?: 'round' | 'drop'       // drops point outwards
  halo?: string                  // a pulp sac round each seed (passionfruit)
}

// The hollow the stone sat in, or a seed cavity. `ry` makes it an oval along the fruit's length.
interface Pit {
  colour: string
  r: number
  ry?: number
  glow?: string                  // the flesh round it takes this colour, fading out (a peach's red)
  fibres?: string                // short strands out from its edge into the flesh
  wrinkle?: string               // the stone's ridges pressed into it
}

// A stone sitting proud of one half: an oval (`ry` along the length), `depth` of its smaller radius,
// `point` tapering it to a tip at the blossom end, and a surface: a peach's ridges, a mango's fibres.
interface Stone { colour: string; r: number; ry?: number; depth?: number; point?: number; surface?: 'ridged' | 'fibrous' | 'smooth' }

export interface FleshSpec {
  flesh: string
  core?: string                  // the colour the flesh glows to at the centre
  coreR?: number
  rim?: { colour: string; w: number } // a band just inside the skin fading into the flesh
  rind?: string                  // skin band
  rindW?: number
  pith?: string                  // the band inside the skin (watermelon white, citrus pith)
  pithW?: number
  centre?: [number, number]      // where the middle is, as a fraction of the face's box from the bottom left
  segments?: { n: number; colour: string }
  rays?: { n: number; colour: string; from: number; to: number }
  pit?: Pit
  stone?: Stone
  seeds?: Seeds
  ghost?: { colour: string; scale: number } // the outline again, smaller, in the middle (starfruit's pale star)
  draw?: (p: Painter) => void    // the fruit's own inside, drawn after the flesh and before the skin
  juice?: string                 // the colour its juice flies (default the flesh)
  across?: Partial<FleshSpec>    // differences when the cut goes across instead of lengthways
}

export type CutKind = 'length' | 'across'

// ---------------------------------------------------------------------------
// Painting helpers

export interface Painter {
  g: CanvasRenderingContext2D
  W: number
  H: number
  min: number                    // the canvas's smaller side
  cx: number                     // the middle (spec.centre) in canvas px
  cy: number
  hw: number                     // half the canvas's width and height
  hh: number
  pts: [number, number][]        // the outline in canvas px
  top: number                    // canvas y where the outline crosses the middle line at the top (stem end)
  bottom: number                 // and at the bottom (blossom end)
}

// A steady pseudo-random number per index, so marks land in the same places every time.
const rand = (i: number, k = 1) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453
  return x - Math.floor(x)
}

// The outline scaled about (ax, ay): a strawberry's core is its own shape, smaller.
function scaled(p: Painter, sx: number, sy: number, ax = p.cx, ay = p.cy): Path2D {
  const path = new Path2D()
  p.pts.forEach(([x, y], i) => {
    const X = ax + (x - ax) * sx, Y = ay + (y - ay) * sy
    if (i) path.lineTo(X, Y)
    else path.moveTo(X, Y)
  })
  path.closePath()
  return path
}

function oval(x: number, y: number, rx: number, ry: number, rot = 0): Path2D {
  const path = new Path2D()
  path.ellipse(x, y, Math.max(0.5, rx), Math.max(0.5, ry), rot, 0, Math.PI * 2)
  return path
}

// A fill with a soft edge, as layers shrinking to the shape (no canvas filter: older Safari lacks it).
// `make(k)` gives the shape grown by k (k = 1 is the shape itself); the middle reaches `alpha`.
function soft(g: CanvasRenderingContext2D, make: (k: number) => Path2D, colour: string, alpha = 1, spread = 0.2, steps = 12) {
  const a = 1 - Math.pow(1 - Math.min(alpha, 0.995), 1 / steps)
  g.save()
  g.fillStyle = colour
  g.globalAlpha = a
  for (let i = 0; i < steps; i++) g.fill(make(1 + spread * (1 - i / (steps - 1))))
  g.restore()
}

// A band inside the skin, strongest at the edge and fading inwards over `w` of the face.
function rimBand(p: Painter, path: Path2D, colour: string, w: number) {
  const { g, min } = p
  const steps = 8
  g.save()
  g.strokeStyle = colour
  g.globalAlpha = 0.24
  g.lineJoin = 'round'
  for (let i = 1; i <= steps; i++) {
    g.lineWidth = 2 * w * min * (i / steps)
    g.stroke(path)
  }
  g.restore()
}

// A fibre from (x0, y0) to (x1, y1), bowed by `bend` (px, towards -y), fading towards its outer end.
function fibre(g: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, colour: string, width: number, alpha: number, bend = 0) {
  const grad = g.createLinearGradient(x0, y0, x1, y1)
  const c = new THREE.Color(colour)
  const rgba = (a: number) => `rgba(${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)},${a})`
  grad.addColorStop(0, rgba(alpha))
  grad.addColorStop(1, rgba(alpha * 0.25))
  g.strokeStyle = grad
  g.lineWidth = width
  g.lineCap = 'round'
  g.beginPath()
  g.moveTo(x0, y0)
  g.quadraticCurveTo((x0 + x1) / 2, (y0 + y1) / 2 - bend, x1, y1)
  g.stroke()
}

// ---------------------------------------------------------------------------
// Insides with a shape of their own

// Strawberry, cut lengthways: a deep red rim under the skin, the flesh paling inwards to pink, a pale
// whitish-pink core in the berry's own shape hanging from the calyx down the middle, and faint pale
// strands running from the core out to each seed at the skin. No glow, no rays from a point.
function strawberryInside(p: Painter) {
  const { g, min, cx, pts, top, bottom } = p
  const ax = cx, ay = top + (bottom - top) * 0.02 // everything hangs from just under the calyx
  soft(g, k => scaled(p, 0.64 * k, 0.86 * k, ax, ay), '#F06A76', 0.7, 0.3)
  soft(g, k => scaled(p, 0.46 * k, 0.8 * k, ax, ay), '#F6939A', 0.55, 0.35)
  // Strands: from the core's edge to the skin, bowing up towards the calyx
  const core = { sx: 0.32, sy: 0.72 }
  pts.forEach(([x, y], i) => {
    if (i % 3 || y < top + (bottom - top) * 0.06) return
    const x0 = ax + (x - ax) * core.sx, y0 = ay + (y - ay) * core.sy
    fibre(g, x0, y0, x, y, '#FFD6D2', min * 0.011, 0.55, (bottom - top) * 0.035)
  })
  soft(g, k => scaled(p, core.sx * k, core.sy * k, ax, ay), '#FAC8C4', 0.95, 0.35)
  soft(g, k => scaled(p, 0.15 * k, 0.6 * k, ax, ay), '#FFE8E2', 0.6, 0.5)
}

// Apple, pear and quince, cut lengthways: a faint heart-shaped core line, the flesh a touch more
// translucent inside it, a slit of seed chambers down the middle with seeds pointing to the stem,
// the stem channel up to the top and the dried calyx at the bottom.
function pomeInside(o: { w: number; h: number; tint: string; line: string; seed: string; seeds: number; calyx: string; grit?: boolean }) {
  return (p: Painter) => {
    const { g, min, cx, cy, hw, hh, top, bottom } = p
    const rx = hw * o.w, ry = hh * o.h
    const heart = (k: number) => {
      const path = new Path2D()
      for (let i = 0; i <= 64; i++) {
        const t = (i / 64) * Math.PI * 2
        const d = Math.atan2(Math.sin(t), Math.cos(t))
        const x = cx + rx * k * Math.sin(t) * (1 - 0.12 * Math.cos(t))
        const y = cy - ry * k * Math.cos(t) + ry * k * 0.28 * Math.exp(-(d * d) / 0.12)
        if (i) path.lineTo(x, y)
        else path.moveTo(x, y)
      }
      path.closePath()
      return path
    }
    soft(g, heart, o.tint, 0.75, 0.15)
    g.save()
    g.strokeStyle = o.line
    g.globalAlpha = 0.6
    g.lineWidth = min * 0.009
    g.stroke(heart(1))
    // Stem channel and calyx channel
    g.globalAlpha = o.grit ? 0.45 : 0.3
    g.lineWidth = min * (o.grit ? 0.016 : 0.01)
    g.beginPath()
    g.moveTo(cx, top + min * 0.01)
    g.lineTo(cx, cy - ry * 0.7)
    g.moveTo(cx, bottom - min * 0.01)
    g.lineTo(cx, cy + ry * 0.75)
    g.stroke()
    g.restore()
    // The dried calyx: a few dark spikes at the blossom end
    g.save()
    g.strokeStyle = o.calyx
    g.lineWidth = min * 0.012
    g.lineCap = 'round'
    for (let k = -2; k <= 2; k++) {
      g.beginPath()
      g.moveTo(cx + k * min * 0.008, bottom)
      g.lineTo(cx + k * min * 0.02, bottom - min * (0.045 - Math.abs(k) * 0.008))
      g.stroke()
    }
    g.restore()
    // Seed chambers: two papery slits either side of the middle, seeds inside pointing up
    for (const side of [-1, 1]) {
      const sx = cx + side * rx * 0.24
      const chamber = oval(sx, cy + ry * 0.05, rx * 0.2, ry * 0.55)
      g.fillStyle = '#FFFBEF'
      g.fill(chamber)
      g.strokeStyle = o.line
      g.lineWidth = min * 0.005
      g.stroke(chamber)
      for (let j = 0; j < o.seeds; j++) {
        const sy = cy + ry * 0.05 + (j - (o.seeds - 1) / 2) * ry * (0.75 / Math.max(1, o.seeds))
        const seed = new Path2D()
        const L = ry * Math.min(0.3, 0.8 / o.seeds) * 0.95, Wd = rx * 0.15
        seed.moveTo(sx, sy - L)
        seed.bezierCurveTo(sx + Wd * 1.3, sy - L * 0.2, sx + Wd, sy + L, sx, sy + L)
        seed.bezierCurveTo(sx - Wd, sy + L, sx - Wd * 1.3, sy - L * 0.2, sx, sy - L)
        g.save()
        g.translate(sx, sy)
        g.rotate(side * 0.18)
        g.translate(-sx, -sy)
        g.fillStyle = o.seed
        g.fill(seed)
        g.restore()
      }
    }
  }
}

// Fig, cut lengthways: purple skin, a thick creamy band, then the rose-red heart of tiny flowers in
// strands running in to a pale hollow down the middle, flecked with tiny seeds.
function figInside(p: Painter) {
  const { g, min, cx, cy, hh } = p
  rimBand(p, scaled(p, 1, 1), '#C89AB0', 0.035)
  soft(g, k => scaled(p, 0.76 * k, 0.74 * k), '#C42E48', 1, 0.08)
  soft(g, k => scaled(p, 0.5 * k, 0.55 * k), '#D84A4A', 0.5, 0.4)
  const inner = 0.74
  p.pts.forEach(([x, y], i) => {
    const X = cx + (x - cx) * inner * 0.95, Y = cy + (y - cy) * inner * 0.95
    for (const f of [0, 0.5]) {
      const xs = cx + (X - cx) * 0.12, ys = cy + (Y - cy) * 0.12
      const xe = cx + (X - cx) * (0.94 - f * 0.25), ye = cy + (Y - cy) * (0.94 - f * 0.25)
      fibre(g, xs + rand(i, 7) * 4, ys, xe, ye, '#F59A78', min * 0.01, 0.75, (rand(i + f, 5) - 0.5) * min * 0.06)
      // seeds along the strand
      for (let s = 0; s < 2; s++) {
        const t = 0.15 + rand(i * 3 + s, 9) * 0.8
        g.fillStyle = '#EED29A'
        g.beginPath()
        g.arc(xs + (xe - xs) * t, ys + (ye - ys) * t, min * 0.006, 0, Math.PI * 2)
        g.fill()
      }
    }
  })
  soft(g, k => oval(cx, cy + hh * 0.02, min * 0.03 * k, hh * 0.2 * k), '#E89080', 0.55, 0.6)
}

// Feijoa, cut across: cream flesh with a gritty greenish band under the skin, and in the middle the
// translucent jelly in four lobes, flecked with tiny seeds.
function feijoaInside(p: Painter) {
  const { g, min, cx, cy, hw, hh } = p
  rimBand(p, scaled(p, 1, 1), '#D9E2B0', 0.12)
  const lobes = (k: number, size: number) => {
    const path = new Path2D()
    for (let q = 0; q < 4; q++) {
      const a = (q / 4) * Math.PI * 2 + Math.PI / 4
      const x = cx + Math.cos(a) * hw * 0.3, y = cy + Math.sin(a) * hh * 0.3, r = hw * size * k
      path.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r) // a new subpath, or each lobe joins the last with a line
      path.ellipse(x, y, r, r * 0.62, a, 0, Math.PI * 2)
    }
    return path
  }
  soft(g, k => lobes(k, 0.19), '#D6C998', 0.9, 0.2)
  soft(g, k => lobes(k, 0.11), '#E6DBB2', 0.6, 0.4)
  soft(g, k => oval(cx, cy, hw * 0.08 * k, hh * 0.08 * k), '#CDBE8C', 0.9, 0.3)
  for (let i = 0; i < 36; i++) {
    const a = (Math.floor(i / 9) / 4) * Math.PI * 2 + Math.PI / 4 + (rand(i, 2) - 0.5) * 0.9
    const d = 0.16 + rand(i, 3) * 0.28
    g.fillStyle = '#8E7A4E'
    g.beginPath()
    g.arc(cx + Math.cos(a) * hw * d, cy + Math.sin(a) * hh * d, min * 0.008, 0, Math.PI * 2)
    g.fill()
  }
}

// Persimmon (Fuyu, seedless), cut across: deep orange flesh, slightly glassy, with a soft paler flower
// of eight petals in the middle. Not citrus lines.
function persimmonInside(p: Painter) {
  const { g, cx, cy, hw, hh } = p
  rimBand(p, scaled(p, 1, 1), '#F0661A', 0.08)
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + 0.2
    soft(g, k => oval(cx + Math.cos(a) * hw * 0.2, cy + Math.sin(a) * hh * 0.2, hw * 0.17 * k, hw * 0.05 * k, a), '#FFBE80', 0.45, 0.7)
  }
  soft(g, k => oval(cx, cy, hw * 0.06 * k, hh * 0.06 * k), '#FFCB98', 0.6, 0.6)
}

// Pomegranate, cut across: a red rind over a pale yellow-white pith, cream membranes splitting it into
// chambers, every chamber packed tight with glossy ruby seeds.
function pomegranateInside(p: Painter) {
  const { g, min, cx, cy, hw, hh } = p
  const R = Math.min(hw, hh)
  const n = 6, r = min * 0.04
  const walls = Array.from({ length: n }, (_, k) => (k / n) * Math.PI * 2 + 0.3 + (rand(k, 4) - 0.5) * 0.3)
  // Dark red shadow between the seeds, then the cream membranes and the hub over it
  g.fillStyle = '#7E0A22'
  g.fill(oval(cx, cy, R * 0.86, R * 0.86))
  g.save()
  g.strokeStyle = '#F4E2BC'
  g.lineCap = 'round'
  walls.forEach((w, k) => {
    g.lineWidth = min * (0.022 + rand(k, 8) * 0.012)
    g.beginPath()
    g.moveTo(cx, cy)
    g.quadraticCurveTo(cx + Math.cos(w + 0.12) * R * 0.5, cy + Math.sin(w + 0.12) * R * 0.5, cx + Math.cos(w) * R * 0.9, cy + Math.sin(w) * R * 0.9)
    g.stroke()
  })
  g.restore()
  g.fillStyle = '#F4E2BC'
  g.fill(oval(cx, cy, R * 0.12, R * 0.12))
  // Seeds packed edge to edge in each chamber, a little irregular, each with its glint
  const step = r * 1.95
  let i = 0
  for (let y = -R; y <= R; y += step * 0.87) {
    const row = Math.round((y + R) / (step * 0.87))
    for (let x = -R + (row % 2) * step * 0.5; x <= R; x += step) {
      i++
      const jx = x + (rand(i, 1) - 0.5) * r * 0.3, jy = y + (rand(i, 2) - 0.5) * r * 0.3
      const d = Math.hypot(jx, jy)
      if (d > R * 0.82 || d < R * 0.16) continue
      const a = Math.atan2(jy, jx)
      if (walls.some(w => Math.abs(Math.sin(a - w)) * d < r * 0.7 && Math.cos(a - w) > 0)) continue
      const X = cx + jx, Y = cy + jy
      const tone = new THREE.Color('#9E0B28').lerp(new THREE.Color('#D81C40'), rand(i, 3))
      g.fillStyle = `#${tone.getHexString()}`
      g.beginPath()
      g.ellipse(X, Y, r * 1.02, r * 0.88, rand(i, 5) * Math.PI, 0, Math.PI * 2)
      g.fill()
      g.fillStyle = 'rgba(255,170,180,0.75)'
      g.beginPath()
      g.ellipse(X - r * 0.32, Y - r * 0.32, r * 0.26, r * 0.18, -0.6, 0, Math.PI * 2)
      g.fill()
    }
  }
}

// Melons, cut lengthways: the seed cavity is an oval along the fruit, flat seeds clinging to its walls;
// a rockmelon's has orange stringy pulp, a honeydew's is clean.
function melonCavity(o: { rx: number; ry: number; colour: string; strings?: string; seed: string; n: number }) {
  return (p: Painter) => {
    const { g, min, cx, cy, hw, hh } = p
    const rx = hw * o.rx, ry = hh * o.ry
    soft(g, k => oval(cx, cy, rx * k, ry * k), o.colour, 1, 0.12)
    if (o.strings) {
      g.save()
      g.clip(oval(cx, cy, rx, ry))
      for (let i = 0; i < 22; i++) {
        const x = cx + (rand(i, 1) - 0.5) * rx * 1.6
        fibre(g, x, cy - ry, x + (rand(i, 2) - 0.5) * rx * 0.8, cy + ry, o.strings, min * 0.01, 0.6, (rand(i, 3) - 0.5) * rx)
      }
      g.restore()
    }
    // Seeds cling to the cavity walls in rows, pointing in towards the middle line
    for (let i = 0; i < o.n; i++) {
      const a = (i / o.n) * Math.PI * 2 + rand(i, 5) * 0.2
      const k = 0.62 + rand(i, 6) * 0.3
      const x = cx + Math.cos(a) * rx * k, y = cy + Math.sin(a) * ry * k
      g.fillStyle = o.seed
      g.beginPath()
      g.ellipse(x, y, min * 0.018, min * 0.042, Math.atan2(Math.sin(a) * ry, Math.cos(a) * rx) - Math.PI / 2 + (rand(i, 4) - 0.5) * 0.5, 0, Math.PI * 2)
      g.fill()
    }
  }
}

// ---------------------------------------------------------------------------
// The specs

const CITRUS = (flesh: string, rind: string, core: string): FleshSpec => ({
  flesh, core, coreR: 0.5, rind, rindW: 0.035, pith: '#FFF1D8', pithW: 0.03, segments: { n: 10, colour: '#FFF1D8' },
})

// Stone fruit, cut lengthways: the flesh richer under the skin, the hollow the stone sat in (stained,
// with the stone's ridges pressed in), and a big ridged stone, pointed at the blossom end, in one half.
const STONE = (flesh: string, rim: string, rind: string, pit: Pit, stone: Stone): FleshSpec => ({
  flesh, rim: { colour: rim, w: 0.1 }, rind, rindW: 0.02, pit, stone,
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
  'dragon-fruit': { flesh: '#FBF5EC', core: '#FFFDF8', rind: '#E8336E', rindW: 0.05, seeds: { colour: '#151010', n: 210, r: 0.012, spread: 0.84, shape: 'drop' } },
  passionfruit: { flesh: '#F5B21E', core: '#FFD25A', rind: '#4A1D44', rindW: 0.06, pith: '#F2E6CC', pithW: 0.07, seeds: { colour: '#1C140C', n: 34, r: 0.03, spread: 0.62, halo: '#FFE08A' } },
  // Hass: pale yellow round the stone, greening outwards to a bright green band under the dark skin.
  avocado: {
    flesh: '#BCD65E', core: '#F2EC9C', coreR: 0.8, rim: { colour: '#5E9A2E', w: 0.09 }, rind: '#1E2E14', rindW: 0.02, centre: [0.5, 0.38],
    pit: { colour: '#EEE6A2', r: 0.5, ry: 0.52 }, stone: { colour: '#7A4A2A', r: 0.46, ry: 0.48, point: 0.12, surface: 'smooth' },
  },
  peach: STONE('#FFC64A', '#FF9A2A', '#E8483A',
    { colour: '#B4503A', r: 0.38, ry: 0.48, glow: '#EC5A3A', fibres: '#D8402E', wrinkle: '#7A3020' },
    { colour: '#8A5434', r: 0.36, ry: 0.46, point: 0.5, surface: 'ridged' }),
  nectarine: STONE('#FFC23E', '#FF962A', '#C8202E',
    { colour: '#B04A36', r: 0.38, ry: 0.48, glow: '#E84A36', fibres: '#D0302A', wrinkle: '#76301E' },
    { colour: '#8A5434', r: 0.36, ry: 0.46, point: 0.5, surface: 'ridged' }),
  apricot: STONE('#FFA82E', '#FF8A1A', '#F26A2A',
    { colour: '#C86A2A', r: 0.36, ry: 0.44, glow: '#F08A28', wrinkle: '#8A4A20' },
    { colour: '#7A4E30', r: 0.34, ry: 0.42, point: 0.3, surface: 'ridged' }),
  // Blood plum (the photo): deep red flesh, darker under the skin, paling round a small stone.
  plum: {
    ...STONE('#B81C3C', '#6A0A2E', '#4A1050',
      { colour: '#B84A52', r: 0.3, ry: 0.36, glow: '#E06A82', wrinkle: '#7A1E30' },
      { colour: '#B07A4A', r: 0.28, ry: 0.34, point: 0.3, surface: 'ridged' }),
    core: '#E05470', coreR: 0.6, juice: '#B81C3C',
  },
  // Deep golden-orange flesh and the big flat pale stone (husk) lying along it.
  mango: {
    flesh: '#FFA21A', rim: { colour: '#FF8A0E', w: 0.08 }, rind: '#D8A030', rindW: 0.015,
    pit: { colour: '#FFC45C', r: 0.48, ry: 0.68, glow: '#FFB84A', fibres: '#F7D890' }, stone: { colour: '#EEDDA8', r: 0.44, ry: 0.64, depth: 0.16, point: 0.15, surface: 'fibrous' },
  },
  strawberry: { flesh: '#EA3E4C', rim: { colour: '#B8102A', w: 0.15 }, rind: '#B8122C', rindW: 0.016, draw: strawberryInside },
  apple: { flesh: '#FBF3D8', rind: '#C8182A', rindW: 0.018, draw: pomeInside({ w: 0.36, h: 0.42, tint: '#F2E6B8', line: '#D8C690', seed: '#4A2A14', seeds: 2, calyx: '#5A3A1E' }) },
  pear: { flesh: '#F8F5DA', rind: '#B5CC3A', rindW: 0.018, centre: [0.5, 0.36], draw: pomeInside({ w: 0.3, h: 0.3, tint: '#EFE8C0', line: '#D6CB98', seed: '#2E1A0C', seeds: 2, calyx: '#5A3A1E', grit: true }) },
  quince: { flesh: '#F6E9BC', rind: '#E8C83A', rindW: 0.022, centre: [0.5, 0.38], draw: pomeInside({ w: 0.38, h: 0.38, tint: '#EAD79A', line: '#CDB878', seed: '#5A341A', seeds: 4, calyx: '#5A3A1E', grit: true }) },
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
  persimmon: { flesh: '#FF8A26', core: '#FFA24A', coreR: 0.5, rind: '#F2711A', rindW: 0.02, draw: persimmonInside },
  pomegranate: { flesh: '#F6E4C0', rind: '#B3132F', rindW: 0.045, pith: '#F2D8A8', pithW: 0.035, draw: pomegranateInside, juice: '#C8163A' },
  honeydew: {
    flesh: '#C6E8A0', core: '#E4F2C2', coreR: 0.6, rim: { colour: '#9ED27E', w: 0.08 }, rind: '#D7E0A0', rindW: 0.03,
    draw: melonCavity({ rx: 0.34, ry: 0.6, colour: '#E6EDC0', seed: '#EFE0AC', n: 40 }),
  },
  rockmelon: {
    flesh: '#FFA565', core: '#FF9548', coreR: 0.55, rind: '#B8A27A', rindW: 0.045, pith: '#D8E0A0', pithW: 0.02,
    draw: melonCavity({ rx: 0.34, ry: 0.62, colour: '#EE7E2A', strings: '#D8641A', seed: '#F4D89C', n: 46 }),
  },
  lychee: { flesh: '#F7F2E8', core: '#EFE6D0', rind: '#C8283A', rindW: 0.03, pit: { colour: '#E4D8C0', r: 0.34, ry: 0.42 }, stone: { colour: '#4A2414', r: 0.28, ry: 0.36, surface: 'smooth' } },
  feijoa: { flesh: '#F2EED4', rind: '#3E6B2A', rindW: 0.035, draw: feijoaInside },
  fig: { flesh: '#F4E8D0', rind: '#5A2A55', rindW: 0.035, centre: [0.5, 0.42], draw: figInside, juice: '#D23A50' },
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

// The colour a fruit's juice flies when it is cut.
export function juiceOf(id: string, colour?: string): string {
  const spec = fleshOf(id, colour)
  return spec.juice ?? spec.flesh
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
  const pts = outline.map(v => [toX(v.x), toY(v.y)] as [number, number])
  const path = new Path2D()
  pts.forEach(([x, y], i) => (i ? path.lineTo(x, y) : path.moveTo(x, y)))
  path.closePath()
  const [fx, fy] = spec.centre ?? [0.5, 0.5]
  const cx = fx * W, cy = (1 - fy) * H
  const hw = W / 2, hh = H / 2
  // Where the outline meets the middle line, top and bottom (the stem and blossom ends of a lengthways face)
  const onAxis = pts.filter(([x]) => Math.abs(x - toX(0)) < W * 0.02).map(([, y]) => y)
  const p: Painter = { g, W, H, min, cx, cy, hw, hh, pts, top: onAxis.length ? Math.min(...onAxis) : 0, bottom: onAxis.length ? Math.max(...onAxis) : H }

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
  if (spec.rim) rimBand(p, path, spec.rim.colour, spec.rim.w)
  spec.draw?.(p)
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
  if (spec.pit) drawPit(p, spec.pit)
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

// The hollow a stone sat in: the flesh round it stained (`glow`), strands out into the flesh, and the
// stone's ridges pressed into it. Its shape matches the stone (pointed at the blossom end).
function drawPit(p: Painter, pit: Pit) {
  const { g, min, cx, cy, hw, hh } = p
  const rx = hw * pit.r, ry = hh * (pit.ry ?? pit.r)
  if (pit.glow) soft(g, k => oval(cx, cy, rx * k, ry * k), pit.glow, 0.7, 0.55)
  if (pit.fibres) {
    for (let i = 0; i < 40; i++) {
      const a = (i / 40) * Math.PI * 2 + rand(i, 6) * 0.15
      const x0 = cx + Math.cos(a) * rx * 0.9, y0 = cy + Math.sin(a) * ry * 0.9
      const L = 0.25 + rand(i, 8) * 0.35
      fibre(g, x0, y0, cx + Math.cos(a) * rx * (1 + L), cy + Math.sin(a) * ry * (1 + L * 0.7), pit.fibres, min * 0.008, 0.7)
    }
  }
  const grad = g.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry))
  const deep = new THREE.Color(pit.colour).multiplyScalar(0.85)
  grad.addColorStop(0, `#${deep.getHexString()}`)
  grad.addColorStop(1, pit.colour)
  g.fillStyle = grad
  g.fill(oval(cx, cy, rx, ry))
  if (pit.wrinkle) {
    g.save()
    g.clip(oval(cx, cy, rx, ry))
    g.strokeStyle = pit.wrinkle
    g.globalAlpha = 0.55
    g.lineWidth = min * 0.01
    g.lineCap = 'round'
    for (let i = 0; i < 26; i++) {
      const x = cx + (rand(i, 11) - 0.5) * rx * 1.8, y = cy + (rand(i, 12) - 0.5) * ry * 1.8
      g.beginPath()
      g.moveTo(x, y)
      g.quadraticCurveTo(x + rx * 0.15, y + (rand(i, 13) - 0.5) * ry * 0.3, x + rx * (0.15 + rand(i, 14) * 0.2), y + (rand(i, 15) - 0.5) * ry * 0.2)
      g.stroke()
    }
    g.restore()
  }
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

// The stone's surface (128 px, once per fruit): a peach's deep ridges or a mango husk's fibres.
function stoneTexture(stone: Stone): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')!
  g.fillStyle = stone.colour
  g.fillRect(0, 0, 128, 128)
  const dark = `#${new THREE.Color(stone.colour).multiplyScalar(0.55).getHexString()}`
  const light = `#${new THREE.Color(stone.colour).lerp(new THREE.Color('#ffffff'), 0.3).getHexString()}`
  const deep = `#${new THREE.Color(stone.colour).multiplyScalar(0.38).getHexString()}`
  g.lineCap = 'round'
  if (stone.surface === 'fibrous') {
    for (let i = 0; i < 160; i++) {
      const x = rand(i, 21) * 128, y = rand(i, 22) * 128
      g.strokeStyle = i % 2 ? dark : light
      g.globalAlpha = 0.35
      g.lineWidth = 1 + rand(i, 23) * 1.5
      g.beginPath()
      g.moveTo(x, y)
      g.lineTo(x + (rand(i, 24) - 0.5) * 6, y + 14 + rand(i, 25) * 20)
      g.stroke()
    }
  } else {
    // Furrows and pits, the way a peach stone is pocked all over
    for (let i = 0; i < 140; i++) {
      const x = rand(i, 31) * 128, y = rand(i, 32) * 128
      g.strokeStyle = i % 3 ? deep : light
      g.globalAlpha = 0.75
      g.lineWidth = 2 + rand(i, 33) * 3
      g.beginPath()
      g.moveTo(x, y)
      g.quadraticCurveTo(x + 6, y + (rand(i, 34) - 0.5) * 14, x + 8 + rand(i, 35) * 14, y + (rand(i, 36) - 0.5) * 10)
      g.stroke()
    }
    g.fillStyle = deep
    for (let i = 0; i < 60; i++) {
      g.beginPath()
      g.arc(rand(i, 37) * 128, rand(i, 38) * 128, 1.5 + rand(i, 39) * 2.5, 0, Math.PI * 2)
      g.fill()
    }
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

const stoneMats = new Map<string, THREE.Material>()

// The stone that stays in one half (avocado, peach, mango, lychee), sitting proud of the cut face:
// an oval along the fruit, tapered to a point at the blossom end, ridged, fibrous or glossy.
export function stoneMesh(id: string, box: THREE.Box2): THREE.Mesh | null {
  const spec = FLESH[id]
  if (!spec?.stone) return null
  const st = spec.stone
  const size = box.getSize(new THREE.Vector2())
  const [fx, fy] = spec.centre ?? [0.5, 0.5]
  const rx = (size.x / 2) * st.r, ry = (size.y / 2) * (st.ry ?? st.r)
  const geo = new THREE.SphereGeometry(1, 32, 20)
  const pos = geo.getAttribute('position') as THREE.BufferAttribute
  const point = st.point ?? 0
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i)
    const k = 1 - point * Math.pow(Math.max(0, -y), 1.6) // narrower towards the bottom tip
    pos.setXYZ(i, pos.getX(i) * k * rx, y * ry, pos.getZ(i) * k * Math.min(rx, ry) * (st.depth ?? 0.8))
  }
  geo.computeVertexNormals()
  let mat = stoneMats.get(id)
  if (!mat) {
    if (st.surface === 'smooth' || !st.surface) {
      mat = new THREE.MeshPhysicalMaterial({ color: st.colour, roughness: 0.4, clearcoat: 0.6 })
    } else {
      const tex = stoneTexture(st)
      mat = new THREE.MeshPhysicalMaterial({ map: tex, bumpMap: tex, bumpScale: st.surface === 'ridged' ? 4 : 1.5, roughness: 0.8 })
    }
    stoneMats.set(id, mat)
  }
  const m = new THREE.Mesh(geo, mat)
  m.position.set(box.min.x + fx * size.x, box.min.y + fy * size.y, 0)
  m.castShadow = true
  return m
}
