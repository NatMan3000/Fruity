import type { Customer } from '../customers'

export type CustomerMood = 'neutral' | 'happy' | 'delighted' | 'thinking' | 'surprised'

// One drawn rig for every customer: head, ears, eyes, nose or beak and mouth, swapped per animal.
// Moods change the eyes and mouth only, so a reaction reads instantly at small sizes.
export function CustomerFace({ customer: c, mood = 'neutral', size = 112 }: { customer: Customer; mood?: CustomerMood; size?: number }) {
  const beak = c.nose === 'beak'
  const happy = mood === 'happy' || mood === 'delighted'
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden="true" className="cafe-face">
      {/* Spikes and crest sit behind the head */}
      {c.extra === 'spikes' && (
        <g fill="#5A4632" stroke="#F3E3C8" strokeWidth="1.5" strokeLinejoin="round">
          {Array.from({ length: 13 }, (_, i) => {
            const a = Math.PI * (1.05 + (i / 12) * 0.9)
            const x = 60 + Math.cos(a) * 36
            const y = 66 + Math.sin(a) * 36
            const tx = 60 + Math.cos(a) * 56
            const ty = 66 + Math.sin(a) * 56
            const nx = Math.cos(a + Math.PI / 2) * 6
            const ny = Math.sin(a + Math.PI / 2) * 6
            return <path key={i} d={`M${x - nx} ${y - ny} L${tx} ${ty} L${x + nx} ${y + ny} Z`} />
          })}
        </g>
      )}
      {c.extra === 'crest' && (
        <g fill={c.accent}>
          <path d="M58 32 C50 14 44 6 34 4 C44 14 46 22 50 32 Z" />
          <path d="M62 30 C60 12 60 4 56 -2 C66 8 70 18 68 32 Z" />
          <path d="M66 32 C74 16 82 10 92 10 C82 18 78 26 74 34 Z" />
        </g>
      )}
      {c.extra === 'shaggy' && (
        <g fill={c.fur}>
          {Array.from({ length: 9 }, (_, i) => (
            <ellipse key={i} cx={34 + i * 6.5} cy={34 + Math.abs(4 - i) * 2.5} rx="6" ry="10" />
          ))}
        </g>
      )}

      {/* Ears */}
      {c.ears === 'koala' && (
        <g>
          <circle cx="24" cy="40" r="20" fill={c.fur} />
          <circle cx="96" cy="40" r="20" fill={c.fur} />
          <circle cx="25" cy="41" r="12" fill={c.face} />
          <circle cx="95" cy="41" r="12" fill={c.face} />
        </g>
      )}
      {c.ears === 'pointy' && (
        <g>
          <path d="M28 46 L30 14 L52 34 Z" fill={c.fur} />
          <path d="M92 46 L90 14 L68 34 Z" fill={c.fur} />
          <path d="M33 40 L34 22 L46 34 Z" fill={c.accent} />
          <path d="M87 40 L86 22 L74 34 Z" fill={c.accent} />
        </g>
      )}
      {c.ears === 'tall' && (
        <g>
          <ellipse cx="38" cy="22" rx="9" ry="22" transform="rotate(-14 38 22)" fill={c.fur} />
          <ellipse cx="82" cy="22" rx="9" ry="22" transform="rotate(14 82 22)" fill={c.fur} />
          <ellipse cx="38" cy="24" rx="4.5" ry="15" transform="rotate(-14 38 24)" fill={c.face} />
          <ellipse cx="82" cy="24" rx="4.5" ry="15" transform="rotate(14 82 24)" fill={c.face} />
        </g>
      )}
      {c.ears === 'small' && (
        <g>
          <circle cx="32" cy="38" r="10" fill={c.fur} />
          <circle cx="88" cy="38" r="10" fill={c.fur} />
          <circle cx="32" cy="38" r="5" fill={c.face} />
          <circle cx="88" cy="38" r="5" fill={c.face} />
        </g>
      )}

      {/* Head */}
      <ellipse cx="60" cy="68" rx="40" ry="38" fill={c.fur} />
      {c.extra === 'stripe' && <path d="M24 60 Q40 54 54 62 M66 62 Q80 54 96 60" stroke={c.accent} strokeWidth="6" strokeLinecap="round" fill="none" />}
      {/* Muzzle */}
      {!beak && c.nose !== 'bill' && <ellipse cx="60" cy="86" rx="24" ry="17" fill={c.face} />}
      {beak && c.extra !== 'stripe' && <ellipse cx="60" cy="80" rx="28" ry="22" fill={c.face} opacity={c.id === 'emu' ? 1 : 0.6} />}

      {/* Blush */}
      {happy && (
        <g fill="#FF7E9D" opacity="0.55">
          <ellipse cx="32" cy="82" rx="7" ry="4.5" />
          <ellipse cx="88" cy="82" rx="7" ry="4.5" />
        </g>
      )}

      <Eyes mood={mood} />
      <Mouth mood={mood} customer={c} />
    </svg>
  )
}

function Eyes({ mood }: { mood: CustomerMood }) {
  if (mood === 'delighted') {
    return (
      <g stroke="#1E1E24" strokeWidth="4" strokeLinecap="round" fill="none">
        <path d="M36 64 Q44 54 52 64" />
        <path d="M68 64 Q76 54 84 64" />
      </g>
    )
  }
  const r = mood === 'surprised' ? 8 : 6.5
  const look = mood === 'thinking' ? { x: 3, y: -4 } : { x: 0, y: 0 }
  return (
    <g>
      <circle cx="44" cy="64" r={r + 3} fill="#FFFFFF" />
      <circle cx="76" cy="64" r={r + 3} fill="#FFFFFF" />
      <circle cx={44 + look.x} cy={64 + look.y} r={r} fill="#1E1E24" />
      <circle cx={76 + look.x} cy={64 + look.y} r={r} fill="#1E1E24" />
      <circle cx={46 + look.x} cy={61 + look.y} r="2.2" fill="#FFFFFF" />
      <circle cx={78 + look.x} cy={61 + look.y} r="2.2" fill="#FFFFFF" />
      {mood === 'thinking' && <path d="M68 50 L86 48" stroke="#1E1E24" strokeWidth="3" strokeLinecap="round" />}
    </g>
  )
}

function Mouth({ mood, customer: c }: { mood: CustomerMood; customer: Customer }) {
  if (c.nose === 'beak') {
    const open = mood === 'delighted' || mood === 'surprised'
    return (
      <g fill={c.id === 'cockatoo' ? '#5E6670' : c.accent}>
        <path d={`M48 76 Q60 70 72 76 L60 ${open ? 90 : 96} Z`} />
        {open && <path d="M51 92 L60 104 L69 92 Q60 96 51 92 Z" />}
      </g>
    )
  }
  if (c.nose === 'bill') {
    const open = mood === 'delighted' || mood === 'surprised'
    return (
      <g>
        <ellipse cx="60" cy={open ? 86 : 88} rx="30" ry="12" fill={c.accent} />
        {open && <ellipse cx="60" cy="98" rx="22" ry="7" fill={c.accent} />}
        <circle cx="52" cy="84" r="2" fill="#000" opacity="0.5" />
        <circle cx="68" cy="84" r="2" fill="#000" opacity="0.5" />
      </g>
    )
  }
  const nose = {
    koala: <ellipse cx="60" cy="78" rx="11" ry="13" fill={c.accent} />,
    button: <ellipse cx="60" cy="78" rx="6" ry="4.5" fill={c.accent} />,
    snout: <ellipse cx="60" cy="79" rx="12" ry="8" fill={c.accent} />,
    long: <path d="M54 76 Q60 72 66 76 L62 100 Q60 104 58 100 Z" fill={c.accent} />,
  }[c.nose]
  const mouthY = c.nose === 'long' ? 96 : 92
  const mouth = {
    neutral: <path d={`M52 ${mouthY} Q60 ${mouthY + 5} 68 ${mouthY}`} />,
    happy: <path d={`M48 ${mouthY - 1} Q60 ${mouthY + 10} 72 ${mouthY - 1}`} />,
    delighted: <path d={`M47 ${mouthY - 2} Q60 ${mouthY + 16} 73 ${mouthY - 2} Z`} fill="#7A2531" />,
    thinking: <path d={`M52 ${mouthY + 2} Q56 ${mouthY - 1} 60 ${mouthY + 2} T68 ${mouthY + 2}`} />,
    surprised: <ellipse cx="60" cy={mouthY + 2} rx="5" ry="6" fill="#7A2531" />,
  }[mood]
  return (
    <g>
      <g stroke="#1E1E24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">{mouth}</g>
      {nose}
    </g>
  )
}
