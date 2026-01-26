import { useMemo, useEffect, useRef } from 'react'
import type { Fruit } from '../../types/fruit'

interface SaladBowlProps {
  fruits: Fruit[]
  isMixing: boolean
  hasBeenMixed?: boolean
}

function getFruitPositions(count: number): Array<{ x: number; y: number; rotation: number; delay: number }> {
  const positions: Array<{ x: number; y: number; rotation: number; delay: number }> = []

  for (let i = 0; i < count; i++) {
    const seed = i * 137.5
    const angle = seed % 360
    const radius = 12 + (i % 4) * 6

    const x = 50 + Math.cos(angle * Math.PI / 180) * radius
    const y = 42 + Math.sin(angle * Math.PI / 180) * (radius * 0.3)

    positions.push({
      x: Math.max(25, Math.min(75, x)),
      y: Math.max(32, Math.min(52, y)),
      rotation: (seed * 2) % 30 - 15,
      delay: i * 0.08
    })
  }

  return positions
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

export function SaladBowl({ fruits, isMixing }: SaladBowlProps) {
  const fruitPositions = useMemo(() => getFruitPositions(fruits.length), [fruits.length])
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
      <div className="absolute -left-6 -top-2 z-10">
        <div
          className={`text-3xl origin-bottom transition-transform ${
            isMixing ? 'animate-stir-left' : ''
          }`}
          style={{ transform: 'rotate(-35deg)' }}
        >
          🥄
        </div>
      </div>
      <div className="absolute -right-6 -top-2 z-10">
        <div
          className={`text-3xl origin-bottom transition-transform ${
            isMixing ? 'animate-stir-right' : ''
          }`}
          style={{ transform: 'rotate(35deg) scaleX(-1)' }}
        >
          🍴
        </div>
      </div>

      {/* Bowl SVG */}
      <svg
        viewBox="0 0 200 150"
        className={`w-full h-auto ${isMixing ? 'animate-bowl-shake' : ''}`}
      >
        <defs>
          <linearGradient id="bowlGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="50%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>
        </defs>

        {/* Bowl shadow */}
        <ellipse cx="100" cy="140" rx="75" ry="8" fill="#00000020" />

        {/* Bowl back rim */}
        <ellipse cx="100" cy="45" rx="85" ry="25" fill="#22c55e" />
        <ellipse cx="100" cy="45" rx="80" ry="22" fill="#16a34a" />

        {/* Bowl interior */}
        <ellipse cx="100" cy="55" rx="75" ry="20" fill="#fef9c3" />
        <ellipse cx="100" cy="55" rx="70" ry="17" fill="#fefce8" />

        {/* Bowl front */}
        <path
          d="M 15 45 Q 15 120, 100 130 Q 185 120, 185 45"
          fill="url(#bowlGradient)"
          stroke="#15803d"
          strokeWidth="2"
        />

        {/* Bowl rim highlight */}
        <ellipse cx="100" cy="45" rx="85" ry="25" fill="none" stroke="#4ade80" strokeWidth="3" />

        {/* Decorative pattern */}
        <path
          d="M 35 70 Q 50 85, 70 75 Q 90 65, 100 75 Q 110 85, 130 75 Q 150 65, 165 80"
          fill="none"
          stroke="#a855f7"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.7"
        />
        <circle cx="50" cy="95" r="4" fill="#a855f7" opacity="0.6" />
        <circle cx="150" cy="95" r="4" fill="#a855f7" opacity="0.6" />
        <circle cx="100" cy="110" r="4" fill="#a855f7" opacity="0.6" />
      </svg>

      {/* Fruits inside bowl */}
      <div className="absolute inset-0 pointer-events-none" style={{ top: '15%', height: '35%' }}>
        {fruits.map((fruit, index) => {
          const pos = fruitPositions[index]
          if (!pos) return null

          return (
            <div
              key={fruit.id}
              className={`absolute text-2xl md:text-3xl ${
                isMixing ? 'animate-fruit-mix' : 'animate-fruit-drop'
              }`}
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: `translate(-50%, -50%) rotate(${pos.rotation}deg)`,
                animationDelay: isMixing ? `${index * 0.05}s` : `${pos.delay}s`,
                '--mix-offset-x': `${(index % 3 - 1) * 15}px`,
                '--mix-offset-y': `${(index % 2 === 0 ? 1 : -1) * 12}px`,
              } as React.CSSProperties}
            >
              {fruit.emoji}
            </div>
          )
        })}
      </div>

      {/* Empty bowl message */}
      {fruits.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ top: '-10%' }}>
          <p className="text-gray-500 text-sm font-medium">Add fruits to your salad!</p>
        </div>
      )}
    </div>
  )
}
