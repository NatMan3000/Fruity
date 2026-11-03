import { Component, lazy, Suspense, useCallback, useState, type ReactNode, type RefObject } from 'react'
import clsx from 'clsx'
import { X } from 'lucide-react'
import type { Fruit } from '../../types/fruit'
import { FruitIcon } from '../../components/FruitIcon'
import type { BowlItem, FaceAnchor } from '../three/BowlScene'
import { BowlFace, type BowlMood } from './BowlFace'
import { pill } from '../ui'

// The 3D scene (three + Rapier) is its own chunk, fetched while the counter is already showing.
const BowlScene = lazy(() => import('../three/BowlScene'))

interface BowlStageProps {
  stageRef: RefObject<HTMLDivElement | null>
  items: BowlItem[]
  fruits: Fruit[]
  mood: BowlMood
  caption: string | null      // what the bowl says (sour, needs cooking...)
  coach: string               // what to do next
  dropping: boolean | null    // a fruit is being dragged (true when over the bowl)
  reducedMotion: boolean
  onChop: (key: string) => void
  onStir: (radians: number) => void
  onLand: (key: string) => void
  onRemove: (key: string) => void
  children?: ReactNode        // star hints and other overlays
  locked?: boolean            // served: no more changes
}

interface Pop { id: number; x: number; y: number; word: string }

const CHOP_WORDS = ['Chop!', 'Slice!', 'Swish!', 'Chop chop!', 'Yum!']

export function BowlStage(props: BowlStageProps) {
  const { stageRef, items, fruits, mood, caption, coach, dropping, reducedMotion } = props
  const [anchor, setAnchor] = useState<FaceAnchor | null>(null)
  const [trail, setTrail] = useState<{ x: number; y: number }[] | null>(null)
  const [pops, setPops] = useState<Pop[]>([])
  const [webgl] = useState(hasWebGL)

  const onFaceAnchor = useCallback((a: FaceAnchor) => setAnchor(a), [])
  const { onChop: chop } = props
  const onChop = useCallback((key: string, at: { x: number; y: number }) => {
    const id = Date.now() + Math.random()
    setPops(p => [...p.slice(-2), { id, x: at.x, y: at.y, word: CHOP_WORDS[Math.floor(Math.random() * CHOP_WORDS.length)] }])
    setTimeout(() => setPops(p => p.filter(x => x.id !== id)), 700)
    chop(key)
  }, [chop])

  const scene = (
    <BowlScene
      items={items}
      fruits={fruits}
      reducedMotion={reducedMotion}
      onChop={onChop}
      onStir={props.onStir}
      onLand={props.onLand}
      onFaceAnchor={onFaceAnchor}
      onTrail={setTrail}
    />
  )

  return (
    <div
      ref={stageRef}
      className={clsx(
        'block-shadow relative mx-4 mt-1 min-h-0 flex-1 overflow-hidden rounded-block bg-(--bright) text-(--ink) transition-shadow',
        dropping && 'ring-5 ring-peak ring-inset',
        dropping === false && 'ring-4 ring-(--ink-soft) ring-inset',
      )}
    >
      {webgl ? (
        <SceneBoundary fallback={<FlatBowl {...props} />}>
          {/* 3d-fallback-ok: a flat bowl outline and "Warming up", no fruit photo */}
          <Suspense fallback={<div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 font-extrabold text-(--ink-soft)"><FlatBowlShape /><span>Warming up the bowl...</span></div>}>
            {scene}
          </Suspense>
        </SceneBoundary>
      ) : <FlatBowl {...props} />}

      {webgl && anchor && (
        <div className="pointer-events-none absolute -translate-1/2 leading-none" style={{ left: anchor.x, top: anchor.y }}>
          <BowlFace mood={mood} width={Math.max(64, anchor.width)} />
        </div>
      )}
      {caption && (
        <p className="cafe-caption-in pointer-events-none absolute top-14 left-1/2 max-w-[calc(100%-24px)] -translate-x-1/2 rounded-3xl bg-(--ink) px-4 py-1.5 text-center text-body leading-snug font-extrabold text-(--light)" key={caption}>
          {caption}
        </p>
      )}

      {trail && trail.length > 1 && (
        <svg className="pointer-events-none absolute inset-0 size-full" aria-hidden="true">
          <polyline points={trail.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="var(--pop)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
        </svg>
      )}
      {pops.map(p => (
        <span key={p.id} className="cafe-pop pointer-events-none absolute font-display text-[1.75rem] whitespace-nowrap text-ending" style={{ left: p.x, top: p.y }} aria-hidden="true">{p.word}</span>
      ))}

      <p className="pointer-events-none absolute inset-x-3 bottom-12 text-center text-small font-extrabold" aria-live="polite">{coach}</p>
      {props.children}

      {items.length > 0 && !props.locked && (
        <ul className="absolute inset-x-2.5 top-2.5 flex flex-wrap gap-1.5" aria-label="In the bowl">
          {items.map(item => {
            const f = fruits.find(x => x.id === item.fruitId)
            if (!f) return null
            return (
              <li key={item.key}>
                {/* The invisible ::before widens the hit area for small fingers. */}
                <button type="button" className="cafe-pop-in relative inline-flex rounded-full bg-(--pop) p-1 shadow-[0_3px_0_var(--ink)] before:absolute before:-inset-1 before:content-['']" onClick={() => props.onRemove(item.key)} aria-label={`Take out the ${f.name}`}>
                  <FruitIcon fruit={f} size="sm" />
                  <span aria-hidden="true" className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-(--ink) text-(--light)">
                    <X className="size-3.5" strokeWidth={3.25} />
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') ?? c.getContext('webgl'))
  } catch {
    return false
  }
}

// If WebGL or the physics engine fails on a phone, the game still works with a flat bowl.
class SceneBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(err: unknown) {
    console.warn('fruity cafe: 3D bowl failed, using the flat bowl', err)
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

// The bowl in 2D, drawn like the 3D one (art: its own pale blue with the coral rim).
function FlatBowlShape() {
  return (
    <svg className="w-[62%]" viewBox="0 0 200 110" aria-hidden="true">
      <ellipse cx="100" cy="22" rx="92" ry="18" fill="#BFD9EE" />
      <path d="M8 22 Q14 104 100 104 Q186 104 192 22 Q186 40 100 40 Q14 40 8 22 Z" fill="#D6EEFF" stroke="#FF6B6B" strokeWidth="5" />
    </svg>
  )
}

// The no-3D bowl: tap a fruit to chop it, and a Stir button.
function FlatBowl({ items, fruits, mood, onChop, onStir }: BowlStageProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
      <div className="relative z-1 -mb-12 flex max-w-[70%] flex-wrap justify-center gap-1">
        {items.map(item => {
          const f = fruits.find(x => x.id === item.fruitId)
          if (!f) return null
          return (
            <button key={item.key} type="button" className={clsx('p-0.5', item.chopped && 'rotate-[18deg]')} onClick={() => onChop(item.key)} aria-label={item.chopped ? `${f.name}, chopped` : `Chop the ${f.name}`}>
              <FruitIcon fruit={f} size={item.chopped ? 'md' : 'lg'} />
            </button>
          )
        })}
      </div>
      <FlatBowlShape />
      <div className="-mt-15 leading-none"><BowlFace mood={mood} width={96} /></div>
      <button type="button" className={pill('ink', 'px-6 text-body')} onClick={() => onStir(Math.PI)}>Stir</button>
    </div>
  )
}
