import { describe, expect, it } from 'vitest'
import { peekFit, peekShows } from './peek'

describe('peekFit', () => {
  // The Fruit list's chips at 393px, measured in the browser: at the usual 8px gap the third chip
  // ended at 392px and the fourth started past the edge, so nothing peeked (audit cook-F1 / now-F4).
  const widths = [123, 122, 115, 111, 102, 101, 134]

  // The chip cut by the edge at a fit: how much of it shows and how much is hidden.
  const cut = (width: number) => {
    const fit = peekFit(widths, 16, width)
    const show = peekShows(widths, 16, width, fit)!
    let x = 16, i = 0
    for (; i < widths.length; i++) { const w = widths[i] + 2 * (fit.pad - 16); if (x + w > width) break; x += w + fit.gap }
    return { show, hidden: widths[i] + 2 * (fit.pad - 16) - show }
  }

  it('cuts a chip clearly where the usual gap ended the row flush with the edge', () => {
    expect(peekShows(widths, 16, 393, { gap: 8, pad: 16 })).toBeLessThan(0)
    const { show, hidden } = cut(393)
    expect(show).toBeGreaterThanOrEqual(24)
    expect(hidden).toBeGreaterThanOrEqual(16)
  })

  it.each([320, 360, 375, 390, 414, 430])('cuts a chip clearly at %ipx too', width => {
    const { show, hidden } = cut(width)
    expect(show).toBeGreaterThanOrEqual(24)
    expect(hidden).toBeGreaterThanOrEqual(16)
  })

  it('keeps the usual gap and padding when every chip fits', () => {
    expect(peekFit([80, 80, 80], 16, 393)).toEqual({ gap: 8, pad: 16 })
  })
})
