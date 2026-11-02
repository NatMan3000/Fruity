export type BowlMood = 'hungry' | 'happy' | 'yum' | 'surprised' | 'sour' | 'yuck' | 'dizzy' | 'proud'

// The bowl's face, drawn over the front of the 3D bowl. It reacts to what goes in: a sour lemon
// gets a pucker, raw rhubarb a "yuck", a good stir a dizzy grin.
export function BowlFace({ mood, width }: { mood: BowlMood; width: number }) {
  return (
    <svg viewBox="0 0 120 56" width={width} height={(width * 56) / 120} aria-hidden="true" className={`cafe-bowlface cafe-bowlface--${mood}`} key={mood}>
      <g fill="#FF8FAB" opacity="0.6">
        <ellipse cx="16" cy="34" rx="9" ry="5" />
        <ellipse cx="104" cy="34" rx="9" ry="5" />
      </g>
      <Eyes mood={mood} />
      <Mouth mood={mood} />
    </svg>
  )
}

const INK = '#2B2340'

function Eyes({ mood }: { mood: BowlMood }) {
  const stroke = { stroke: INK, strokeWidth: 4, strokeLinecap: 'round' as const, fill: 'none' }
  switch (mood) {
    case 'yum':
    case 'proud':
      return <g {...stroke}><path d="M28 22 Q36 12 44 22" /><path d="M76 22 Q84 12 92 22" /></g>
    case 'sour':
    case 'yuck':
      return <g {...stroke}><path d="M28 14 L42 20 L28 26" /><path d="M92 14 L78 20 L92 26" /></g>
    case 'dizzy':
      return (
        <g {...stroke} strokeWidth={3}>
          <path d="M36 20 m-7 0 a7 7 0 1 0 7 -7 a4 4 0 1 0 4 4" />
          <path d="M84 20 m-7 0 a7 7 0 1 0 7 -7 a4 4 0 1 0 4 4" />
        </g>
      )
    default: {
      const r = mood === 'surprised' ? 8 : 6.5
      const dy = mood === 'hungry' ? -3 : 0
      return (
        <g>
          <circle cx="36" cy="20" r={r} fill={INK} />
          <circle cx="84" cy="20" r={r} fill={INK} />
          <circle cx={38.5} cy={17 + dy} r="2.4" fill="#fff" />
          <circle cx={86.5} cy={17 + dy} r="2.4" fill="#fff" />
        </g>
      )
    }
  }
}

function Mouth({ mood }: { mood: BowlMood }) {
  switch (mood) {
    case 'hungry':
      return <ellipse cx="60" cy="38" rx="7" ry="6" fill="#7A2531" />
    case 'happy':
      return <path d="M46 34 Q60 46 74 34" stroke={INK} strokeWidth="4" strokeLinecap="round" fill="none" />
    case 'yum':
    case 'proud':
      return (
        <g>
          <path d="M44 32 Q60 52 76 32 Z" fill="#7A2531" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <ellipse cx="66" cy="41" rx="6" ry="4" fill="#FF7E9D" />
        </g>
      )
    case 'surprised':
      return <ellipse cx="60" cy="40" rx="8" ry="10" fill="#7A2531" stroke={INK} strokeWidth="3" />
    case 'sour':
      return <path d="M55 38 Q60 34 65 38 Q60 44 55 38 Z" fill="#7A2531" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    case 'yuck':
      return (
        <g>
          <path d="M44 38 Q50 33 56 38 T68 38 T78 37" stroke={INK} strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M60 39 Q60 50 66 50 Q70 48 68 39" fill="#FF7E9D" stroke={INK} strokeWidth="2" />
        </g>
      )
    case 'dizzy':
      return <path d="M44 34 Q52 44 60 36 Q68 44 76 34" stroke={INK} strokeWidth="4" strokeLinecap="round" fill="none" />
  }
}
