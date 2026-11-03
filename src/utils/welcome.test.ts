import { describe, expect, it } from 'vitest'
import { FRUITS } from '../assets/fruits'
import type { Month } from '../types/fruit'
import { dishFruits } from './dishFruits'
import { hasArt } from './images'
import { cutCrosses, cutLine, cutThrough, EDGE_MIN, EDGE_SHARE, FLICKER_MS, sideOfCut, sprinkleField, stickerRing, welcomeFruits, welcomeOnHide, welcomeOnReturn, welcomeStage, type Stage } from './welcome'

describe('when the welcome shows on a return', () => {
  it('goes up as the app is hidden, over any screen but Cook mode', () => {
    expect(welcomeOnHide({ name: 'now' })).toBe(true)
    expect(welcomeOnHide({ name: 'fruit', id: 'apple' })).toBe(true)
    expect(welcomeOnHide({ name: 'recipe', id: 'peach-crumble' })).toBe(true)
    expect(welcomeOnHide({ name: 'cookmode', id: 'peach-crumble' })).toBe(false)
  })

  it('stays for a real time away, and a quick flicker of hidden (the notification shade) takes it down', () => {
    expect(welcomeOnReturn(FLICKER_MS)).toBe(true)
    expect(welcomeOnReturn(5 * 3600_000)).toBe(true)
    expect(welcomeOnReturn(0)).toBe(false)
    expect(welcomeOnReturn(FLICKER_MS - 1)).toBe(false)
  })
})

describe('cutLine', () => {
  // Which side of the cut a point is on: <0 the top half, >0 the bottom half.
  const side = (c: ReturnType<typeof cutLine>, cx: number, cy: number, x: number, y: number) => (x - cx) * c.nx + (y - cy) * c.ny

  it('splits the screen along the knife stroke, the top half above the line', () => {
    const c = cutLine(393, 852, 196, 426, -18)
    expect(side(c, 196, 426, 196, 100)).toBeLessThan(0) // the wordmark goes up with the top half
    expect(side(c, 196, 426, 196, 800)).toBeGreaterThan(0) // the cue goes down with the bottom half
    // The line rises to the right (at x 390 it is at y 363, at x 0 at y 490), so (390, 380) is below it
    // and (0, 470) is above it.
    expect(side(c, 196, 426, 390, 380)).toBeGreaterThan(0)
    expect(side(c, 196, 426, 0, 470)).toBeLessThan(0)
    expect(Math.hypot(c.nx, c.ny)).toBeCloseTo(1)
    expect(c.ny).toBeGreaterThan(0)
  })

  it('moves each half far enough to clear the screen', () => {
    const c = cutLine(393, 852, 196, 426, -18)
    expect(c.travel).toBeGreaterThanOrEqual(Math.hypot(393, 852))
    expect(c.top).toMatch(/^polygon\(/)
    expect(c.bottom).toMatch(/^polygon\(/)
  })
})

describe('the cut goes where the finger touched', () => {
  const W = 393, H = 852, A = -16
  const slope = Math.tan((A * Math.PI) / 180)
  const edge = Math.max(EDGE_MIN, H * EDGE_SHARE)
  // The cut line's height at screen x, for a line through p
  const yAt = (p: { x: number; y: number }, x: number) => p.y + (x - p.x) * slope

  it('runs through the touch itself anywhere away from the top and bottom edges', () => {
    for (const [x, y] of [[196, 443], [40, 200], [360, 700], [10, 426], [383, 150], [196, 760]]) {
      expect(cutThrough(W, H, x, y, A)).toEqual({ x, y })
    }
  })

  it('moves a touch at the very top or bottom in, so each half is still a slice right across the screen', () => {
    for (const [x, y] of [[196, 2], [0, 0], [393, 10], [196, 850], [0, 852], [393, 830], [20, 40]]) {
      const p = cutThrough(W, H, x, y, A)
      // still on screen, on a line at the knife's angle that stays inside both edges all the way across
      expect(p.x).toBeGreaterThanOrEqual(0)
      expect(p.x).toBeLessThanOrEqual(W)
      for (const sx of [0, W / 2, W]) {
        expect(yAt(p, sx)).toBeGreaterThanOrEqual(edge - 1e-6)
        expect(yAt(p, sx)).toBeLessThanOrEqual(H - edge + 1e-6)
      }
      // and as near the finger as that allows: the line just touches the edge allowance at one side
      const ends = [yAt(p, 0), yAt(p, W)]
      expect(Math.min(Math.abs(Math.min(...ends) - edge), Math.abs(Math.max(...ends) - (H - edge)))).toBeLessThan(1e-6)
      // the point is the touch's nearest point on that line (the move is along the cut's normal), unless
      // that lies past a side, when it is where the line meets that side
      const n = { x: -Math.sin((A * Math.PI) / 180), y: Math.cos((A * Math.PI) / 180) }
      const mx = x - p.x, my = y - p.y
      if (p.x > 0 && p.x < W) expect(Math.abs(mx * n.y - my * n.x)).toBeLessThan(1e-6)
      else expect(Math.abs(mx * n.y - my * n.x)).toBeLessThan(40)
    }
  })

  it('a touch on the fruit cuts it; one well above or below it misses, on the side the fruit is on', () => {
    // The fruit as it is on screen: points round a circle of radius 60 at (196.5, 443)
    const cx = 196.5, cy = 443, r = 60
    const fruit = Array.from({ length: 48 }, (_, i) => ({ x: cx + r * Math.cos((i / 48) * 2 * Math.PI), y: cy + r * Math.sin((i / 48) * 2 * Math.PI) }))
    expect(cutCrosses(fruit, cutThrough(W, H, 100, 450, A), A, 4)).toBe(true) // left of it, the line still crosses it
    expect(cutCrosses(fruit, { x: cx, y: cy }, A, 4)).toBe(true)
    const high = cutThrough(W, H, 196, 160, A) // through the title
    expect(cutCrosses(fruit, high, A, 4)).toBe(false)
    expect(sideOfCut(high, A, cx, cy)).toBeGreaterThan(0) // the fruit is below the cut: it goes down with the bottom half
    const low = cutThrough(W, H, 196, 760, A) // through the bottom stickers
    expect(cutCrosses(fruit, low, A, 4)).toBe(false)
    expect(sideOfCut(low, A, cx, cy)).toBeLessThan(0) // above it: up with the top half
    // Grazing: the distance across the cut decides (along its normal, not straight down), with the margin
    const across = (d: number) => ({ x: cx, y: cy - d / Math.cos((A * Math.PI) / 180) })
    expect(cutCrosses(fruit, across(r + 3), A, 4)).toBe(true)
    expect(cutCrosses(fruit, across(r + 5), A, 4)).toBe(false)
    expect(cutCrosses(fruit, across(-(r + 3)), A, 4)).toBe(true)
    expect(cutCrosses(fruit, across(-(r + 5)), A, 4)).toBe(false)
    // A long fruit lying along the knife's line is crossed by a stroke near its end only if the stroke
    // reaches it: its outline, not a circle round its middle, decides
    const rad = (A * Math.PI) / 180
    const long = Array.from({ length: 48 }, (_, i) => {
      const u = 120 * Math.cos((i / 48) * 2 * Math.PI), v = 30 * Math.sin((i / 48) * 2 * Math.PI) // 30 px either side of its cut
      return { x: cx + u * Math.cos(rad) - v * Math.sin(rad), y: cy + u * Math.sin(rad) + v * Math.cos(rad) }
    })
    expect(cutCrosses(long, across(40), A, 4)).toBe(false)
    expect(cutCrosses(long, across(20), A, 4)).toBe(true)
  })

  it('agrees with cutLine about which half a point is in', () => {
    const p = cutThrough(W, H, 300, 250, A)
    const c = cutLine(W, H, p.x, p.y, A)
    for (const [x, y] of [[0, 0], [393, 852], [196, 300], [50, 320]]) {
      expect(Math.sign(sideOfCut(p, A, x, y))).toBe(Math.sign((x - p.x) * c.nx + (y - p.y) * c.ny))
    }
  })
})

// The welcome's stage as Welcome.tsx lays it out, with the title's bottom as measured in WebKit (no
// safe area): the pill and the wordmark's line box end at 6vh + 40 + 0.95 of the wordmark's size.
function stageFor(w: number, h: number): Stage {
  const size = Math.round(Math.min(w * 0.66, h * 0.36, 320))
  const font = Math.min(128, Math.max(72, w * 0.24))
  return welcomeStage(w, h, w / 2, Math.round(h * 0.52), size, Math.round(h * 0.06 + 40 + font * 0.95))
}

// Distance from (x, y) to the blob's ellipse outline (an independent check: 720 points round it).
function toBlob(s: Stage, x: number, y: number): number {
  let best = Infinity
  for (let i = 0; i < 720; i++) {
    const t = (i / 720) * 2 * Math.PI
    best = Math.min(best, Math.hypot(x - s.cx - s.rx * Math.cos(t), y - s.cy - s.ry * Math.sin(t)))
  }
  return ((x - s.cx) / s.rx) ** 2 + ((y - s.cy) / s.ry) ** 2 < 1 ? -best : best
}

describe("the welcome's stickers", () => {
  it('are the month\'s other fruit with art, the rest of the dish first, never the lead fruit, no repeats', () => {
    for (const month of ['Jan', 'Apr', 'Jul', 'Nov'] as Month[]) {
      const dish = dishFruits(FRUITS, month)
      const picks = welcomeFruits(FRUITS, month, dish, 9)
      expect(picks).toHaveLength(9)
      expect(picks.map(f => f.id)).not.toContain(dish[0].id)
      expect(new Set(picks.map(f => f.id)).size).toBe(picks.length)
      expect(picks.every(hasArt)).toBe(true)
      expect(picks.slice(0, dish.length - 1).map(f => f.id)).toEqual(dish.slice(1).filter(hasArt).map(f => f.id))
    }
  })

  for (const [w, h] of [[375, 667], [393, 852], [430, 932]]) {
    it(`ring the fruit and title at ${w}x${h}: 7 to 9, clear of the blob, the title and each other, mostly on screen`, () => {
      const s = stageFor(w, h)
      const spots = stickerRing(s, 9)
      expect(spots.length).toBeGreaterThanOrEqual(7)
      for (const [i, p] of spots.entries()) {
        const r = p.size * 0.42
        expect(toBlob(s, p.x, p.y)).toBeGreaterThan(r + 8)
        const beside = p.x + r < s.title.left || p.x - r > s.title.right
        expect(beside || p.y - r > s.title.bottom).toBe(true)
        for (const o of spots.slice(i + 1)) expect(Math.hypot(o.x - p.x, o.y - p.y)).toBeGreaterThan(r + o.size * 0.42)
        // at least 65% of the sticker's width on the screen, never off the top, at most 30% off the bottom
        expect(p.x).toBeGreaterThanOrEqual(p.size * 0.15 - 0.01)
        expect(p.x).toBeLessThanOrEqual(w - p.size * 0.15 + 0.01)
        expect(p.y - p.size / 2).toBeGreaterThan(0)
        expect(p.y + p.size / 2).toBeLessThanOrEqual(h + p.size * 0.3)
      }
      // some in the bottom third, which used to be empty
      expect(spots.filter(p => p.y > s.cy + s.ry).length).toBeGreaterThanOrEqual(3)
    })
  }
})

describe("the welcome's sprinkles", () => {
  it('are a light scatter, the same every time, clear of the blob and the title', () => {
    const s = stageFor(393, 852)
    const spots = stickerRing(s, 9)
    const a = sprinkleField(s, spots, 113)
    expect(sprinkleField(s, spots, 113)).toEqual(a)
    expect(a.length).toBeGreaterThanOrEqual(12)
    expect(a.length).toBeLessThanOrEqual(36)
    for (const [i, p] of a.entries()) {
      expect(toBlob(s, p.x, p.y)).toBeGreaterThan(6)
      expect(p.x < s.title.left || p.x > s.title.right || p.y > s.title.bottom).toBe(true)
      for (const o of a.slice(i + 1)) expect(Math.hypot(o.x - p.x, o.y - p.y)).toBeGreaterThanOrEqual(30)
      expect(['pop', 'bright', 'deep', 'light']).toContain(p.tone)
    }
    expect(sprinkleField(s, spots, 127)).not.toEqual(a) // another month falls another way
  })
})
