import { describe, expect, it } from 'vitest'
import { DRAG_SLOP, dragIntent, nearestTab, scoopX } from './tabDrag'

describe('dragIntent', () => {
  it('keeps a wobble inside the slop a tap', () => {
    expect(dragIntent(0, 0)).toBe('wait')
    expect(dragIntent(DRAG_SLOP - 1, -(DRAG_SLOP - 1))).toBe('wait')
  })
  it('turns a mostly sideways move past the slop into a drag, either way', () => {
    expect(dragIntent(DRAG_SLOP, 0)).toBe('drag')
    expect(dragIntent(-14, 6)).toBe('drag')
  })
  it('leaves a mostly vertical move to the browser', () => {
    expect(dragIntent(4, DRAG_SLOP)).toBe('none')
    expect(dragIntent(10, -12)).toBe('none')
  })
})

describe('scoopX', () => {
  const w = 90
  it('centres the scoop under the finger', () => {
    expect(scoopX(135, w, 4)).toBe(90)
  })
  it('keeps the scoop inside the bar at both ends', () => {
    expect(scoopX(-50, w, 4)).toBe(0)
    expect(scoopX(10, w, 4)).toBe(0)
    expect(scoopX(1000, w, 4)).toBe(270)
  })
})

describe('nearestTab', () => {
  const w = 90
  it('snaps to the slot the scoop is mostly over', () => {
    expect(nearestTab(0, w, 4)).toBe(0)
    expect(nearestTab(44, w, 4)).toBe(0)
    expect(nearestTab(46, w, 4)).toBe(1)
    expect(nearestTab(200, w, 4)).toBe(2)
    expect(nearestTab(270, w, 4)).toBe(3)
  })
  it('stays on a real tab whatever it is given', () => {
    expect(nearestTab(-30, w, 4)).toBe(0)
    expect(nearestTab(999, w, 4)).toBe(3)
    expect(nearestTab(100, 0, 4)).toBe(0)
  })
})
