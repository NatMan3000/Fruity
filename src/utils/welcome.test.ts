import { describe, expect, it } from 'vitest'
import { cutLine, FLICKER_MS, welcomeOnHide, welcomeOnReturn } from './welcome'

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
