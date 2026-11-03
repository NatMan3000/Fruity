import { describe, expect, it } from 'vitest'
import { navMotion } from './navMotion'
import type { Route } from './route'

const now: Route = { name: 'now' }
const browse: Route = { name: 'browse' }
const year: Route = { name: 'year' }
const cook: Route = { name: 'cook' }
const play: Route = { name: 'play' }
const mango: Route = { name: 'fruit', id: 'mango' }
const apple: Route = { name: 'fruit', id: 'apple' }
const tart: Route = { name: 'recipe', id: 'tart' }
const steps: Route = { name: 'cookmode', id: 'tart' }

describe('navMotion', () => {
  it('pushes into a deeper screen and pops back out', () => {
    expect(navMotion(browse, mango, 'forward')).toBe('push')
    expect(navMotion(now, mango, 'forward')).toBe('push')
    expect(navMotion(tart, steps, 'forward')).toBe('push')
    expect(navMotion(mango, browse, 'back')).toBe('pop')
    expect(navMotion(steps, tart, 'back')).toBe('pop')
  })

  it('pops when a forward link goes up within the same tab (a deep link Back)', () => {
    expect(navMotion(mango, browse, 'forward')).toBe('pop')
    expect(navMotion(tart, cook, 'forward')).toBe('pop')
  })

  it('moves sideways between tabs in tab bar order', () => {
    expect(navMotion(now, cook, 'forward')).toBe('next')
    expect(navMotion(cook, now, 'forward')).toBe('prev')
    expect(navMotion(browse, play, 'forward')).toBe('next')
    expect(navMotion(browse, year, 'forward')).toBe('next')
    expect(navMotion(year, browse, 'forward')).toBe('prev')
    expect(navMotion(mango, cook, 'forward')).toBe('next') // a tab tapped from inside another tab
    expect(navMotion(tart, now, 'forward')).toBe('prev')
  })

  it('pushes across at the same depth and does nothing for the same screen', () => {
    expect(navMotion(mango, tart, 'forward')).toBe('push')
    expect(navMotion(tart, apple, 'forward')).toBe('push')
    expect(navMotion(mango, mango, 'forward')).toBe('none')
    expect(navMotion(mango, mango, 'back')).toBe('none')
    expect(navMotion(mango, apple, 'back')).toBe('pop')
  })
})
