import { useMemo, useEffect, useRef } from 'react'
import type { Fruit } from '../../types/fruit'

interface SaladBowlProps {
  fruits: Fruit[]
  isMixing: boolean
  hasBeenMixed?: boolean
}

// Shape types for cut fruit pieces
type FruitShape = 'wedge' | 'chunk' | 'dice' | 'slice' | 'crescent'

// Generate random positions for fruit pieces inside the bowl
function getMixedFruitPieces(fruits: Fruit[], count: number = 20) {
  const shapes: FruitShape[] = ['wedge', 'chunk', 'dice', 'slice', 'crescent']
  const pieces: Array<{
    color: string
    x: number
    y: number
    size: number
    rotation: number
    shape: FruitShape
  }> = []

  const colors = fruits.length > 0
    ? fruits.flatMap(f => {
        // Flesh colours for the cut pieces (illustration, not UI colour; Phase 4 reworks the bowl)
        const colorMap: Record<string, string[]> = {
          '🍎': ['#dc2626', '#ef4444'],
          '🍐': ['#84cc16', '#a3e635'],
          '🍊': ['#f97316', '#fb923c'],
          '🍋': ['#facc15', '#fde047'],
          '🍇': ['#7c3aed', '#a78bfa'],
          '🍓': ['#dc2626', '#f87171'],
          '🍒': ['#dc2626', '#b91c1c'],
          '🫐': ['#3b82f6', '#60a5fa'],
          '🍑': ['#fb923c', '#fdba74'],
          '🍌': ['#facc15', '#fef08a'],
          '🥭': ['#f97316', '#fbbf24'],
          '🍍': ['#facc15', '#a3e635'],
          '🥝': ['#22c55e', '#86efac'],
          '🍈': ['#a3e635', '#d9f99d'],
          '🍉': ['#dc2626', '#4ade80'],
        }
        return colorMap[f.emoji] || ['#f87171', '#fbbf24']
      })
    : ['#E4D8BF'] // tile-strong: an empty bowl

  for (let i = 0; i < count; i++) {
    // Bowl interior ellipse is at cx=100, cy=40, rx=72, ry=20
    // Rendering applies: cx = 8 + x*1.5, cy = 8 + y*0.4
    // To fill bowl (cx: 38-158, cy: 24-56), we need x: 20-100, y: 40-120
    const randomX = 20 + Math.random() * 80   // 20-100 → renders to cx 38-158
    const randomY = 40 + Math.random() * 80   // 40-120 → renders to cy 24-56
    pieces.push({
      color: colors[i % colors.length],
      x: randomX,
      y: randomY,
      size: 5 + Math.random() * 5,
      rotation: Math.random() * 360,
      shape: shapes[Math.floor(Math.random() * shapes.length)]
    })
  }

  return pieces
}

// Simple sound generation using Web Audio API
function playMixingSound(audioContext: AudioContext) {
  const now = audioContext.currentTime

  for (let i = 0; i < 3; i++) {
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    const baseFreq = 150 + Math.random() * 100
    oscillator.frequency.setValueAtTime(baseFreq, now)
    oscillator.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, now + 0.15)

    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.08, now)
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15)

    oscillator.start(now + i * 0.05)
    oscillator.stop(now + 0.2 + i * 0.05)
  }
}

export function SaladBowl({ fruits, isMixing, hasBeenMixed }: SaladBowlProps) {
  const mixedPieces = useMemo(
    () => getMixedFruitPieces(fruits, Math.max(100, fruits.length * 20)),
    [fruits]
  )
  const audioContextRef = useRef<AudioContext | null>(null)
  const soundIntervalRef = useRef<number | null>(null)

  // Sound effects during mixing
  useEffect(() => {
    if (isMixing) {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      }

      const ctx = audioContextRef.current
      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      playMixingSound(ctx)
      soundIntervalRef.current = window.setInterval(() => {
        playMixingSound(ctx)
      }, 200)

      return () => {
        if (soundIntervalRef.current) {
          clearInterval(soundIntervalRef.current)
        }
      }
    }
  }, [isMixing])

  return (
    <div className="relative w-full max-w-xs mx-auto">
      {/* Utensils */}
      <div className="absolute -left-8 top-0 z-10">
        <div
          className={`text-4xl origin-bottom transition-transform ${
            isMixing ? 'animate-stir-left' : ''
          }`}
          style={{ transform: 'rotate(-30deg)' }}
        >
          🥄
        </div>
      </div>
      <div className="absolute -right-8 top-0 z-10">
        <div
          className={`text-4xl origin-bottom transition-transform ${
            isMixing ? 'animate-stir-right' : ''
          }`}
          style={{ transform: 'rotate(30deg) scaleX(-1)' }}
        >
          🍴
        </div>
      </div>


      {/* Bowl SVG */}
      <svg
        viewBox="0 0 200 140"
        className={`w-full h-auto ${isMixing ? 'animate-bowl-shake' : ''}`}
      >
        <defs>
          <linearGradient id="bowlGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--color-season)" />
            <stop offset="100%" stopColor="var(--color-season-ink)" />
          </linearGradient>
          <linearGradient id="bowlInnerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--color-season-soft)" />
            <stop offset="100%" stopColor="var(--color-tile-strong)" />
          </linearGradient>
          <clipPath id="bowlInteriorClip">
            <ellipse cx="100" cy="40" rx="72" ry="22" />
          </clipPath>
        </defs>

        {/* Bowl shadow */}
        <ellipse cx="100" cy="130" rx="70" ry="8" fill="var(--color-ink)" fillOpacity="0.1" />

        {/* Bowl body - main shape */}
        <path
          d="M 20 40 Q 20 120, 100 125 Q 180 120, 180 40"
          fill="url(#bowlGradient)"
        />

        {/* Bowl rim */}
        <ellipse cx="100" cy="40" rx="80" ry="24" fill="var(--color-season)" />
        <ellipse cx="100" cy="40" rx="72" ry="20" fill="url(#bowlInnerGradient)" />

        {/* Bowl interior with fruits */}
        <g clipPath="url(#bowlInteriorClip)">
          {/* Interior background */}
          <ellipse cx="100" cy="40" rx="72" ry="20" fill="url(#bowlInnerGradient)" />

          {/* Mixed fruit pieces - only show AFTER mixing completes */}
          {hasBeenMixed && fruits.length > 0 && mixedPieces.map((piece, i) => {
            const cx = 8 + piece.x * 1.5
            const cy = 8 + piece.y * 0.4
            const s = piece.size

            // Render different shapes based on piece type
            switch (piece.shape) {
              case 'wedge':
                // Triangle wedge shape (like a citrus segment)
                return (
                  <polygon
                    key={i}
                    points={`${cx},${cy - s} ${cx - s * 0.8},${cy + s * 0.6} ${cx + s * 0.8},${cy + s * 0.6}`}
                    fill={piece.color}
                    transform={`rotate(${piece.rotation} ${cx} ${cy})`}
                  />
                )
              case 'chunk':
                // Irregular chunk (pentagon-ish)
                return (
                  <polygon
                    key={i}
                    points={`${cx - s * 0.3},${cy - s * 0.7} ${cx + s * 0.6},${cy - s * 0.4} ${cx + s * 0.5},${cy + s * 0.5} ${cx - s * 0.4},${cy + s * 0.6} ${cx - s * 0.7},${cy}`}
                    fill={piece.color}
                    transform={`rotate(${piece.rotation} ${cx} ${cy})`}
                  />
                )
              case 'dice':
                // Square/rectangular dice cut
                return (
                  <rect
                    key={i}
                    x={cx - s * 0.5}
                    y={cy - s * 0.4}
                    width={s}
                    height={s * 0.8}
                    rx={s * 0.1}
                    fill={piece.color}
                    transform={`rotate(${piece.rotation} ${cx} ${cy})`}
                  />
                )
              case 'slice':
                // Semi-circle slice
                return (
                  <path
                    key={i}
                    d={`M ${cx - s * 0.7} ${cy} A ${s * 0.7} ${s * 0.5} 0 0 1 ${cx + s * 0.7} ${cy} Z`}
                    fill={piece.color}
                    transform={`rotate(${piece.rotation} ${cx} ${cy})`}
                  />
                )
              case 'crescent':
                // Crescent/curved piece
                return (
                  <path
                    key={i}
                    d={`M ${cx - s * 0.5} ${cy - s * 0.3} Q ${cx} ${cy - s * 0.8} ${cx + s * 0.5} ${cy - s * 0.3} Q ${cx} ${cy + s * 0.2} ${cx - s * 0.5} ${cy - s * 0.3}`}
                    fill={piece.color}
                    transform={`rotate(${piece.rotation} ${cx} ${cy})`}
                  />
                )
              default:
                return (
                  <ellipse
                    key={i}
                    cx={cx}
                    cy={cy}
                    rx={s * 0.6}
                    ry={s * 0.4}
                    fill={piece.color}
                    transform={`rotate(${piece.rotation} ${cx} ${cy})`}
                  />
                )
            }
          })}

          {/* Whole fruits - show before AND during mixing, animate during mixing */}
          {!hasBeenMixed && fruits.map((fruit, i) => {
            const angle = (i / fruits.length) * Math.PI * 2
            const radius = 25 + (i % 3) * 10
            const x = 100 + Math.cos(angle) * radius * 0.8
            const y = 38 + Math.sin(angle) * radius * 0.25
            return (
              <text
                key={fruit.id}
                x={x}
                y={y}
                fontSize="16"
                textAnchor="middle"
                dominantBaseline="middle"
                className={isMixing ? 'animate-fruit-mix' : ''}
                style={isMixing ? {
                  '--mix-offset-x': `${8 + ((i * 7) % 8)}px`,
                  '--mix-offset-y': `${4 + ((i * 5) % 4)}px`,
                  animationDelay: `${i * 0.05}s`,
                } as React.CSSProperties : undefined}
              >
                {fruit.emoji}
              </text>
            )
          })}
        </g>



        {/* Bowl highlight */}
        <ellipse cx="100" cy="40" rx="80" ry="24" fill="none" stroke="var(--color-season-soft)" strokeWidth="2" />
      </svg>

      {/* Empty bowl message */}
      {fruits.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ top: '10%' }}>
          <p className="rounded-full bg-card px-3 py-1 text-small font-medium text-ink-2">
            Add fruit to your salad
          </p>
        </div>
      )}
    </div>
  )
}
