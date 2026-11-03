import type { Route } from './route'

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
