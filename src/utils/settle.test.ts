import { describe, expect, it } from 'vitest'
import { settlesOnBack } from './settle'

const effect = (pseudoElement: string | null = null) => ({ pseudoElement }) as unknown as AnimationEffect

describe('settlesOnBack', () => {
  it('finishes a CSS entrance animation or transition on an element', () => {
    expect(settlesOnBack({ effect: effect(), animationName: 'pop-in' })).toBe(true)
    expect(settlesOnBack({ effect: effect(), transitionProperty: 'transform' })).toBe(true)
  })

  it('leaves the View Transition pseudo-elements and our own Web Animations running', () => {
    expect(settlesOnBack({ effect: effect('::view-transition-new(root)'), animationName: 'nav-from-left-part' })).toBe(false)
    expect(settlesOnBack({ effect: effect() })).toBe(false)
    expect(settlesOnBack({ effect: null, animationName: 'pop-in' })).toBe(false)
  })
})
