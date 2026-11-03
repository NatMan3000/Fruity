import type { Fruit, Month } from '../types/fruit'
import { hasArt } from './images'
import type { Route } from './route'
import { isInSeason, nowSections, sortBySeason } from './seasonality'

// The welcome screen (src/components/Welcome.tsx, DESIGN.md "Welcome"): when it shows, and the geometry
// of the cut that opens it. Every launch shows it, a shared deep link included (the tap then opens that
// link's screen), so a cold start has no rule of its own; these are the rules for a return.

// A return to the app after being hidden for less than this is a flicker (the notification shade, the
// control centre, a quick look at another app), not a fresh visit: the welcome stays away.
export const FLICKER_MS = 2000

// Going into the background: put the welcome up now, so the first picture on the way back (the iPhone
// shows its snapshot, then the page's next frame) is the welcome and never a flash of the old screen.
// Not over Cook mode: someone mid-recipe with messy hands and the screen held awake.
export function welcomeOnHide(route: Route): boolean {
  return route.name !== 'cookmode'
}

// Back again: keep the welcome that went up on the way out only if it was a real time away. A flicker
// takes it down before the first frame is painted.
export function welcomeOnReturn(awayMs: number): boolean {
  return awayMs >= FLICKER_MS
}

export interface CutLine {
  nx: number      // the cut's normal (unit, screen px, y down): the bottom half moves this way, the top the other
  ny: number
  top: string     // clip-path polygons for the two halves of the screen, either side of the line
  bottom: string
  travel: number  // how far each half moves to be clear off the screen
}

// A straight cut across the whole screen through (cx, cy) at `angle` degrees (CSS rotate: positive turns
// clockwise, so a negative angle rises to the right). Each half is a big polygon on its own side of the
// line, so the two meet exactly along it and cover the screen between them.
export function cutLine(width: number, height: number, cx: number, cy: number, angle: number): CutLine {
  const a = (angle * Math.PI) / 180
  const dx = Math.cos(a), dy = Math.sin(a)
  const nx = -dy, ny = dx // the line's normal, pointing down the screen
  const far = 2 * (width + height)
  const pt = (along: number, across: number) => `${round(cx + dx * along + nx * across)}px ${round(cy + dy * along + ny * across)}px`
  const top = `polygon(${pt(-far, 0)}, ${pt(far, 0)}, ${pt(far, -far)}, ${pt(-far, -far)})`
  const bottom = `polygon(${pt(-far, 0)}, ${pt(far, 0)}, ${pt(far, far)}, ${pt(-far, far)})`
  // Any point on the screen moved by the screen's diagonal is off it, whichever way it goes.
  return { nx, ny, top, bottom, travel: Math.ceil(Math.hypot(width, height)) + 40 }
}

const round = (v: number) => Math.round(v * 10) / 10

// Where the knife goes (Nathan, 3 Nov 2026: "wherever I touch the finger is where it slices from"): the cut
// runs through the point the finger touched, at the knife's angle. A touch so near the top or bottom that
// the line would leave one half a scrap (or nothing) is moved in just far enough that the line stays at
// least `EDGE_SHARE` of the screen's height (and `EDGE_MIN` px) inside the top and bottom edges right
// across the screen, so both halves read as a slice; the point returned is the one on that line nearest
// the touch (the touch itself when it needed no moving).
export const EDGE_SHARE = 0.04
export const EDGE_MIN = 24

export interface CutPoint { x: number; y: number }

export function cutThrough(width: number, height: number, x: number, y: number, angle: number): CutPoint {
  const a = (angle * Math.PI) / 180
  const dx = Math.cos(a), dy = Math.sin(a)
  const slope = dy / dx
  const mid = y + (width / 2 - x) * slope // the line's height in the middle of the screen
  const reach = (width / 2) * Math.abs(slope) // how far it rises or falls from there to either side
  const edge = Math.max(EDGE_MIN, height * EDGE_SHARE)
  const lo = edge + reach, hi = height - edge - reach
  const at = lo > hi ? height / 2 : Math.min(hi, Math.max(lo, mid))
  if (at === mid) return { x, y }
  // The nearest point to the touch on the line through (width / 2, at), kept on the screen (a corner
  // touch's nearest point can lie just past the side)
  const along = (x - width / 2) * dx + (y - at) * dy
  const px = Math.min(width, Math.max(0, width / 2 + dx * along))
  return { x: px, y: at + (px - width / 2) * slope }
}

// Which side of the cut through `p` at `angle` the point (x, y) is on, in px: negative is the top half,
// positive the bottom (the cut's normal points down the screen, as in cutLine).
export function sideOfCut(p: CutPoint, angle: number, x: number, y: number): number {
  const a = (angle * Math.PI) / 180
  return (x - p.x) * -Math.sin(a) + (y - p.y) * Math.cos(a)
}

// Does the cut through `p` cross a shape given by points round its outline (the fruit as it is on screen),
// or pass within `margin` px of it? It does when the points are not all clear on one side.
export function cutCrosses(outline: CutPoint[], p: CutPoint, angle: number, margin: number): boolean {
  let lo = Infinity, hi = -Infinity
  for (const q of outline) {
    const s = sideOfCut(p, angle, q.x, q.y)
    lo = Math.min(lo, s)
    hi = Math.max(hi, s)
  }
  return lo < margin && hi > -margin
}

// ---- The welcome's life (DESIGN.md "Welcome": the stickers, sprinkles and sparkles round the fruit) ----

// The month's fruit stuck round the welcome: the rest of the Now dish first, then what has just landed,
// the rest of Buy now, what is ending, and anything else in season. Never the lead fruit (it is the 3D
// one in the blob: DESIGN.md "3D" rule 1), only fruit with sticker art, no repeats.
export function welcomeFruits(fruits: Fruit[], month: Month, dish: Fruit[], max: number): Fruit[] {
  const lead = dish[0]?.id
  const { buyNow, justLanded, endingSoon } = nowSections(fruits, month)
  const rest = sortBySeason(fruits.filter(f => isInSeason(f, month)), month)
  const out: Fruit[] = []
  for (const f of [...dish.slice(1), ...justLanded, ...buyNow, ...endingSoon, ...rest]) {
    if (out.length >= max) break
    if (f.id !== lead && hasArt(f) && !out.some(o => o.id === f.id)) out.push(f)
  }
  return out
}

// Where things are on the welcome, in screen px: the screen, the fruit's blob (an ellipse round the
// fruit's middle) and the box the pill and wordmark take at the top.
export interface Stage {
  w: number
  h: number
  cx: number
  cy: number
  rx: number
  ry: number
  title: { left: number; right: number; bottom: number }
}

// The stage for a screen w x h with the fruit's middle at (cx, cy), its blob sized for a fruit of `size`
// (Welcome.tsx: the blob is 1.24 x 1.1 of it) and the title's box ending at `titleBottom` (measured).
export function welcomeStage(w: number, h: number, cx: number, cy: number, size: number, titleBottom: number): Stage {
  const font = Math.min(128, Math.max(72, w * 0.24)) // .welcome-word's clamp()
  const half = Math.min(w - 16, font * 3.35) / 2 + 12 // "Fruity" is about 3.3 em wide
  const bottom = titleBottom + 6 + font * 0.2 // its hard shadow, and the y's tail below the line
  return { w, h, cx, cy, rx: size * 0.62, ry: size * 0.55, title: { left: w / 2 - half, right: w / 2 + half, bottom } }
}

export interface StickerSpot {
  x: number    // centre
  y: number
  size: number
  tilt: number // degrees
}

// Slots round the blob in the order they are filled: the angle out from the fruit's middle (screen
// degrees, 0 right, 90 down), the sticker's size against the others, its tilt, and how far it goes into
// the free room past the blob in that direction (0 hugging the blob, 1 at the screen's edge). Left and
// right alternate, sizes vary, and the lower ones reach down into the bottom third.
const SLOTS: { a: number; k: number; tilt: number; e: number }[] = [
  { a: 232, k: 1.0, tilt: -14, e: 0.35 },
  { a: 308, k: 0.92, tilt: 12, e: 0.35 },
  { a: 116, k: 1.12, tilt: -8, e: 0.3 },
  { a: 64, k: 1.04, tilt: 13, e: 0.9 },
  { a: 92, k: 0.84, tilt: 6, e: 0.7 },
  { a: 150, k: 0.8, tilt: 10, e: 0 },
  { a: 28, k: 0.82, tilt: -11, e: 0 },
  { a: 120, k: 0.78, tilt: -16, e: 1 },
  { a: 58, k: 0.72, tilt: 18, e: 0.25 },
  { a: 155, k: 0.7, tilt: 7, e: 0.5 },
]

const GAP = 10          // px kept clear between a sticker and the blob, the title or another sticker
const ART = 0.42        // a sticker's art fills about this radius of its square
const OFF_SIDE = 0.35   // a sticker may hang this much of itself off the left or right edge...
const OFF_BOTTOM = 0.2  // ...and this much off the bottom

// How far the point (x, y) is outside the blob's ellipse (negative inside), close enough for spacing:
// the distance to the nearest of 90 points round it.
function blobClearance(s: Stage, x: number, y: number): number {
  const inside = ((x - s.cx) / s.rx) ** 2 + ((y - s.cy) / s.ry) ** 2 < 1
  let best = Infinity
  for (let i = 0; i < 90; i++) {
    const t = (i / 90) * 2 * Math.PI
    best = Math.min(best, Math.hypot(x - s.cx - s.rx * Math.cos(t), y - s.cy - s.ry * Math.sin(t)))
  }
  return inside ? -best : best
}

// How far a circle at (x, y) of radius r is clear of the title box (negative: overlapping).
function titleClearance(s: Stage, x: number, y: number, r: number): number {
  const dx = Math.max(s.title.left - x, 0, x - s.title.right)
  const dy = Math.max(0, y - s.title.bottom) // the box runs up off the top of the screen
  return (dy === 0 && dx === 0 ? -r : Math.hypot(dx, dy) - r)
}

// A loose ring of stickers framing the fruit and the title: each slot goes out from the fruit's middle
// along its angle, past the blob, a share of the way to the edge; a slot that cannot fit clear of the
// blob, the title and the stickers already placed shrinks a little and tries again, then is skipped.
export function stickerRing(s: Stage, count: number): StickerSpot[] {
  const base = Math.max(50, Math.min(92, Math.min(s.w, s.h * 0.5) * 0.22))
  const spots: StickerSpot[] = []
  for (const slot of SLOTS) {
    if (spots.length >= count) break
    const t = (slot.a * Math.PI) / 180
    const dx = Math.cos(t), dy = Math.sin(t)
    for (let size = base * slot.k; size >= base * slot.k * 0.7; size *= 0.88) {
      const r = size * ART
      const fits = (x: number, y: number) =>
        blobClearance(s, x, y) >= r + GAP &&
        titleClearance(s, x, y, r) >= GAP &&
        spots.every(o => Math.hypot(o.x - x, o.y - y) >= r + o.size * ART + GAP)
      // The centre's bounds: partly off the sides and the bottom, never off the top
      const xLo = size * (0.5 - OFF_SIDE), xHi = s.w - xLo
      const yLo = s.title.bottom + r, yHi = s.h - size * (0.5 - OFF_BOTTOM)
      const inBounds = (x: number, y: number) => x >= xLo && x <= xHi && y >= yLo && y <= yHi
      // Along the ray: from the first spot clear of the blob to the last still on the screen, go the
      // slot's share of the way, then to the nearest spot there that is clear of everything
      let first = -1, last = -1
      for (let d = 0; d < Math.hypot(s.w, s.h); d += 2) {
        const x = s.cx + dx * d, y = s.cy + dy * d
        if (!inBounds(x, y)) { if (first >= 0) break; else continue }
        if (first < 0 && blobClearance(s, x, y) >= r + GAP) first = d
        if (first >= 0) last = d
      }
      if (first < 0) continue
      const want = first + slot.e * (last - first)
      let d = -1
      for (let step = 0; step <= last - first; step += 2) {
        if (want + step <= last && fits(s.cx + dx * (want + step), s.cy + dy * (want + step))) { d = want + step; break }
        if (want - step >= first && fits(s.cx + dx * (want - step), s.cy + dy * (want - step))) { d = want - step; break }
      }
      if (d < 0) continue
      spots.push({ x: s.cx + dx * d, y: s.cy + dy * d, size: Math.round(size), tilt: slot.tilt })
      break
    }
  }
  return spots
}

export type SprinkleTone = 'pop' | 'bright' | 'deep' | 'light'
export interface Sprinkle {
  x: number
  y: number
  rod: boolean   // a rod (a hundreds-and-thousands sprinkle) or a round dot
  tone: SprinkleTone
  rot: number    // resting angle, degrees
  dx: number     // how far it drifts, px, and turns, degrees
  dy: number
  spin: number
  dur: number    // one drift, ms (it drifts there and back)
  delay: number  // negative, so each starts part way through its drift
}

const TONES: SprinkleTone[] = ['pop', 'bright', 'deep', 'light']

// A small seeded random number source, so the sprinkles fall the same way every time (and in both of
// the welcome's halves).
export function seeded(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// A light scatter of sundae sprinkles on the screen's colour: about one per 8,500 px² of open screen
// (outside the blob, the title and the stickers), never closer than 30 px to each other, at most 36.
export function sprinkleField(s: Stage, stickers: StickerSpot[], seed: number): Sprinkle[] {
  const rnd = seeded(seed)
  const target = Math.min(36, Math.round((s.w * s.h - Math.PI * s.rx * s.ry - (s.title.right - s.title.left) * s.title.bottom) / 8500))
  const out: Sprinkle[] = []
  for (let tries = 0; out.length < target && tries < target * 40; tries++) {
    const x = 6 + rnd() * (s.w - 12), y = 6 + rnd() * (s.h - 12)
    if (blobClearance(s, x, y) < 8) continue
    if (titleClearance(s, x, y, 0) < 8) continue
    if (stickers.some(o => Math.hypot(o.x - x, o.y - y) < o.size * 0.5)) continue
    if (out.some(o => Math.hypot(o.x - x, o.y - y) < 30)) continue
    const rod = rnd() < 0.65
    out.push({
      x: Math.round(x), y: Math.round(y), rod,
      tone: TONES[Math.floor(rnd() * TONES.length)],
      rot: Math.round(rnd() * 180),
      dx: Math.round((rnd() - 0.5) * 16), dy: Math.round(4 + rnd() * 10),
      spin: Math.round((rnd() - 0.5) * 70),
      dur: Math.round(4200 + rnd() * 4200),
      delay: -Math.round(rnd() * 8000),
    })
  }
  return out
}
