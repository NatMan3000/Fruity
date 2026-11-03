import { beforeEach, describe, expect, it, vi } from 'vitest'
import { clearBag, restoreBag, updateBag } from './useBag'
import { addFruit, addOther } from '../utils/bag'

describe('clearBag / restoreBag', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => {} })
    updateBag(() => [])
  })

  it('empties the bag, returns what it held, and Undo puts it back without doubling', () => {
    updateBag(b => addOther(addFruit(b, { id: 'mango', name: 'Mango' }), 'Cream'))
    const held = clearBag()
    expect(held.map(i => i.name)).toEqual(['Mango', 'Cream'])
    expect(clearBag()).toEqual([]) // already empty
    updateBag(b => addFruit(b, { id: 'cherry', name: 'Cherry' })) // added while Undo was showing
    restoreBag(held)
    let after: string[] = []
    updateBag(b => { after = b.map(i => i.name); return b })
    expect(after).toEqual(['Mango', 'Cream', 'Cherry'])
  })
})
