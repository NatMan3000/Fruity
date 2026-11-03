import { describe, expect, it } from 'vitest'
import { FRUITS } from '../assets/fruits'
import type { Month } from '../types/fruit'
import { dishFruits } from './dishFruits'
import { hasArt } from './images'
import { cutLine, FLICKER_MS, sprinkleField, stickerRing, welcomeFruits, welcomeOnHide, welcomeOnReturn, welcomeStage, type Stage } from './welcome'

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
