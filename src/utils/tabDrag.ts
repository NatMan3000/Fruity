// The tab bar's scoop can be dragged between tabs (TabBar.tsx). The geometry and the tap-or-drag call are
// here, pure, so they are tested on their own (tabDrag.test.ts).

// How far a finger moves sideways before a press on the bar becomes a drag. Below it, the press is still
// a tap (a slight wobble as you tap must not drag), and a press that moves mostly up or down is never one.
export const DRAG_SLOP = 10

// 'drag' once the press has moved past the slop mostly sideways, 'none' once it has gone past it mostly
// up or down (a scroll, or a tap that slid: leave it to the browser), 'wait' while it is still inside.
export function dragIntent(dx: number, dy: number, slop = DRAG_SLOP): 'drag' | 'none' | 'wait' {
  const ax = Math.abs(dx)
  const ay = Math.abs(dy)
  if (Math.max(ax, ay) < slop) return 'wait'
  return ax > ay ? 'drag' : 'none'
}

// Where the scoop's left edge sits, in px from the start of its track, while a finger at `fingerX` (same
// origin) drags it: centred under the finger and kept inside the bar.
export function scoopX(fingerX: number, width: number, count: number): number {
  const max = width * (count - 1)
  return Math.min(max, Math.max(0, fingerX - width / 2))
}

// The tab whose slot the scoop's middle is over: where it snaps to on release, and the one lit meanwhile.
export function nearestTab(x: number, width: number, count: number): number {
  if (!(width > 0)) return 0
  return Math.min(count - 1, Math.max(0, Math.round(x / width)))
}
