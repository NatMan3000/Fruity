import { Component, lazy, Suspense, useCallback, useState, type ReactNode, type RefObject } from 'react'
import type { Fruit } from '../../types/fruit'
import { FruitIcon } from '../../components/FruitIcon'
import type { BowlItem, FaceAnchor } from '../three/BowlScene'
import { BowlFace, type BowlMood } from './BowlFace'

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
    <div ref={stageRef} className={`cafe-stage${dropping ? ' cafe-stage--drop' : ''}${dropping === false ? ' cafe-stage--dragging' : ''}`}>
      {webgl ? (
        <SceneBoundary fallback={<FlatBowl {...props} />}>
          <Suspense fallback={<div className="cafe-stage__loading"><FlatBowlShape /><span>Warming up the bowl...</span></div>}>
            {scene}
          </Suspense>
        </SceneBoundary>
      ) : <FlatBowl {...props} />}

      {webgl && anchor && (
        <div className="cafe-stage__face" style={{ left: anchor.x, top: anchor.y }}>
          <BowlFace mood={mood} width={Math.max(64, anchor.width)} />
        </div>
      )}
      {caption && <p className="cafe-stage__caption" key={caption}>{caption}</p>}

      {trail && trail.length > 1 && (
        <svg className="cafe-trail" aria-hidden="true">
          <polyline points={trail.map(p => `${p.x},${p.y}`).join(' ')} />
        </svg>
      )}
      {pops.map(p => (
        <span key={p.id} className="cafe-pop" style={{ left: p.x, top: p.y }} aria-hidden="true">{p.word}</span>
      ))}

      <p className="cafe-stage__coach" aria-live="polite">{coach}</p>
      {props.children}

      {items.length > 0 && !props.locked && (
        <ul className="cafe-contents" aria-label="In the bowl">
          {items.map(item => {
            const f = fruits.find(x => x.id === item.fruitId)
            if (!f) return null
            return (
              <li key={item.key}>
                <button type="button" className="cafe-chip" onClick={() => props.onRemove(item.key)} aria-label={`Take out the ${f.name}`}>
                  <FruitIcon fruit={f} size="sm" />
                  <span aria-hidden="true" className="cafe-chip__x">×</span>
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

function FlatBowlShape() {
  return (
    <svg className="cafe-flatbowl__shape" viewBox="0 0 200 110" aria-hidden="true">
      <ellipse cx="100" cy="22" rx="92" ry="18" fill="#F3E6D0" />
      <path d="M8 22 Q14 104 100 104 Q186 104 192 22 Q186 40 100 40 Q14 40 8 22 Z" fill="#FFF7EA" stroke="#FF6B6B" strokeWidth="5" />
    </svg>
  )
}

// The no-3D bowl: tap a fruit to chop it, and a Stir button.
function FlatBowl({ items, fruits, mood, onChop, onStir }: BowlStageProps) {
  return (
    <div className="cafe-flatbowl">
      <div className="cafe-flatbowl__fruit">
        {items.map(item => {
          const f = fruits.find(x => x.id === item.fruitId)
          if (!f) return null
          return (
            <button key={item.key} type="button" className={`cafe-flatbowl__piece${item.chopped ? ' is-chopped' : ''}`} onClick={() => onChop(item.key)} aria-label={item.chopped ? `${f.name}, chopped` : `Chop the ${f.name}`}>
              <FruitIcon fruit={f} size={item.chopped ? 'md' : 'lg'} />
            </button>
          )
        })}
      </div>
      <FlatBowlShape />
      <div className="cafe-flatbowl__face"><BowlFace mood={mood} width={96} /></div>
      <button type="button" className="cafe-btn cafe-btn--small" onClick={() => onStir(Math.PI)}>Stir</button>
    </div>
  )
}
