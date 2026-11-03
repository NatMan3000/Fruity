import type { Fruit } from '../../types/fruit'
import { FruitIcon } from '../../components/FruitIcon'
import type { Trait } from '../logic/orders'
import { COLOUR_SWATCH } from '../logic/traits'

// The picture half of an order: every want is a picture first and a word second, so kids who
// can't read yet can still fill it. The pictures are art (their own colours); outlines are the
// screen's ink, so each reads on any season's tile.

const GROUP_EMOJI = { berry: '🫐', citrus: '🍋', tropical: '🌴', stonefruit: '🍑', melon: '🍉' } as const
const SEASON_EMOJI = { Summer: '☀️', Autumn: '🍂', Winter: '❄️', Spring: '🌸' } as const

export function TraitIcon({ trait, fruits, size = 44 }: { trait: Trait; fruits: Fruit[]; size?: number }) {
  switch (trait.kind) {
    case 'fruit': {
      const f = fruits.find(x => x.id === trait.id)
      return f ? <FruitIcon fruit={f} size={size >= 50 ? 'lg' : 'md'} /> : null
    }
    case 'colour':
      return (
        <svg viewBox="0 0 44 44" width={size} height={size} aria-hidden="true">
          <path d="M22 4 C33 4 40 12 40 22 C40 33 32 40 22 40 C11 40 4 33 5 22 C6 12 12 4 22 4 Z" fill={COLOUR_SWATCH[trait.colour]} stroke="var(--ink)" strokeWidth="2.5" />
          <ellipse cx="15" cy="14" rx="5" ry="3.5" fill="#fff" opacity="0.55" transform="rotate(-30 15 14)" />
        </svg>
      )
    case 'shape':
      return (
        <svg viewBox="0 0 44 44" width={size} height={size} aria-hidden="true" fill="#FFB547" stroke="var(--ink)" strokeWidth="2.5">
          {trait.shape === 'round' && <circle cx="22" cy="22" r="15" />}
          {trait.shape === 'long' && <path d="M6 16 Q22 40 38 16 Q36 30 22 32 Q8 30 6 16 Z" strokeLinejoin="round" />}
          {trait.shape === 'small' && <g><circle cx="13" cy="27" r="6" /><circle cx="27" cy="29" r="5" /><circle cx="21" cy="15" r="5.5" /></g>}
          {trait.shape === 'big' && <g><circle cx="25" cy="23" r="17" /><circle cx="5.5" cy="35" r="4" fill="#FFD9A0" /></g>}
        </svg>
      )
    case 'group':
      return <span className="inline-flex items-center justify-center leading-none" style={{ fontSize: size * 0.72 }} aria-hidden="true">{GROUP_EMOJI[trait.group]}</span>
    case 'season':
      return <span className="inline-flex items-center justify-center leading-none" style={{ fontSize: size * 0.72 }} aria-hidden="true">{SEASON_EMOJI[trait.season]}</span>
    case 'fresh':
      return (
        <svg viewBox="0 0 44 44" width={size} height={size} aria-hidden="true">
          <path d="M22 3 L26 17 L40 21 L26 25 L22 40 L18 25 L4 21 L18 17 Z" fill="#FFD23F" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" />
          <path d="M36 4 L37.5 9 L42 10.5 L37.5 12 L36 17 L34.5 12 L30 10.5 L34.5 9 Z" fill="#7BD88F" />
        </svg>
      )
    case 'pips':
      return (
        <svg viewBox="0 0 44 44" width={size} height={size} aria-hidden="true" fill="#5A3B22">
          <path d="M12 12 Q18 18 14 26 Q8 22 12 12 Z" />
          <path d="M26 8 Q33 13 30 22 Q23 18 26 8 Z" />
          <path d="M22 26 Q29 30 26 38 Q19 35 22 26 Z" />
        </svg>
      )
    case 'stone':
      return (
        <svg viewBox="0 0 44 44" width={size} height={size} aria-hidden="true">
          <ellipse cx="22" cy="22" rx="11" ry="15" fill="#A0663B" stroke="#6E4122" strokeWidth="2" />
          <path d="M22 9 Q19 22 22 35" stroke="#6E4122" strokeWidth="1.5" fill="none" />
        </svg>
      )
    case 'any':
      return (
        <svg viewBox="0 0 44 44" width={size} height={size} aria-hidden="true" stroke="var(--ink)" strokeWidth="2">
          <circle cx="14" cy="26" r="9" fill="#E53945" />
          <circle cx="30" cy="26" r="9" fill="#FFD23F" />
          <circle cx="22" cy="13" r="9" fill="#5DBB46" />
        </svg>
      )
  }
}
