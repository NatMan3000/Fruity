// A sideways row (filter chips) whose last visible item must be visibly cut by the screen edge: at
// least 24px of it showing and at least 16px of it hidden, the cue that the row scrolls (a row that
// ends flush with the edge hides the rest with no cue). Given the items' widths at their usual side
// padding, where the first one starts and how wide the visible strip is: the usual gap and padding if
// they already give a clear cut, otherwise the gap (6 to 20px) and side padding (10 to 20px) closest
// to usual that do, preferring about 32px showing. The usual values when everything fits.
const clearCut = (show: number, w: number) => show >= 24 && w - show >= 16
export function peekFit(widths: number[], start: number, visible: number, usual = { gap: 8, pad: 16 }): { gap: number; pad: number } {
  if (widths.reduce((s, w) => s + w, start) + usual.gap * Math.max(0, widths.length - 1) <= visible) return usual
  const now = peekShows(widths, start, visible, usual, usual.pad)
  const cutIndex = (() => { let x = start; for (let i = 0; i < widths.length; i++) { if (x + widths[i] > visible) return i; x += widths[i] + usual.gap } return -1 })()
  if (now !== null && cutIndex >= 0 && clearCut(now, widths[cutIndex])) return usual
  let best = usual, score = Infinity
  for (let gap = 6; gap <= 20; gap += 0.5) {
    for (let pad = 10; pad <= 20; pad += 0.5) {
      let x = start
      for (const base of widths) {
        const w = base + 2 * (pad - usual.pad)
        if (x + w > visible) {
          const show = visible - x
          const s = Math.abs(show - 32) + Math.abs(gap - usual.gap) * 0.5 + Math.abs(pad - usual.pad)
          if (clearCut(show, w) && s < score) { score = s; best = { gap, pad } }
          break
        }
        x += w + gap
      }
    }
  }
  return best
}

// What the cut item shows with a given fit (null when everything fits).
export function peekShows(widths: number[], start: number, visible: number, fit: { gap: number; pad: number }, usualPad = 16): number | null {
  let x = start
  for (const base of widths) {
    const w = base + 2 * (fit.pad - usualPad)
    if (x + w > visible) return visible - x
    x += w + fit.gap
  }
  return null
}
