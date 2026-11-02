import type { Fruit } from '../../types/fruit'
import type { Trait } from './orders'

// The word under each picture in an order bubble.
const GROUP_WORD = { berry: 'berry', citrus: 'citrus', tropical: 'tropical', stonefruit: 'stone fruit', melon: 'melon' } as const

export function traitWord(trait: Trait, fruits: Fruit[]): string {
  switch (trait.kind) {
    case 'fruit': return fruits.find(f => f.id === trait.id)?.name ?? 'fruit'
    case 'colour': return trait.colour
    case 'shape': return trait.shape === 'small' ? 'little' : trait.shape
    case 'group': return GROUP_WORD[trait.group]
    case 'season': return trait.season.toLowerCase()
    case 'fresh': return 'fresh now'
    case 'pips': return 'pips'
    case 'stone': return 'stone'
    case 'any': return 'any fruit'
  }
}
