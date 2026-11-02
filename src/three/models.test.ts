import { describe, expect, it } from 'vitest'
import { FRUITS } from '../assets/fruits'
import { MODEL_IDS } from './models'
import { MODELLED } from './modelled'

describe('3D models', () => {
  it('the main bundle\'s list matches the models that exist', () => {
    expect([...MODELLED].sort()).toEqual([...MODEL_IDS].sort())
  })

  it('every fruit in the data has a model (otherwise its page falls back to the sticker)', () => {
    expect(FRUITS.map(f => f.id).filter(id => !MODELLED.has(id))).toEqual([])
  })
})
