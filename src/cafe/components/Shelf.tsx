import { useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import type { Fruit } from '../../types/fruit'
import { FruitIcon } from '../../components/FruitIcon'

interface ShelfProps {
  fruits: Fruit[]
  inBowl: Set<string>
  fresh: Set<string>          // in season now: sparkle and a "fresh now!" tag
  stageRef: RefObject<HTMLElement | null>
  scroll?: boolean            // grown-up mode: every fruit, scrolling sideways
  onAdd: (fruitId: string, dropX: number) => void
  onDragging: (over: boolean | null) => void // null when no drag is happening
}

const DRAG_START = 10 // px of movement before a press becomes a drag

// A tapped fruit lands somewhere near the middle of the bowl.
const tapDrop = () => (Math.random() - 0.5) * 0.8

// The fruit shelf. Tap a fruit to drop it in, or pick it up and drag it over the bowl.
export function Shelf({ fruits, inBowl, fresh, stageRef, scroll = false, onAdd, onDragging }: ShelfProps) {
  const [ghost, setGhost] = useState<Fruit | null>(null)
  const ghostEl = useRef<HTMLDivElement | null>(null)
  const ghostAt = useRef({ x: 0, y: 0 })
  const press = useRef<{ id: string; x: number; y: number; dragging: boolean } | null>(null)

  const overStage = (x: number, y: number) => {
    const r = stageRef.current?.getBoundingClientRect()
    if (!r) return null
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom ? ((x - r.left) / r.width) * 2 - 1 : null
  }

  const placeGhost = (el: HTMLDivElement | null) => {
    ghostEl.current = el
    if (el) el.style.transform = `translate(${ghostAt.current.x - 48}px, ${ghostAt.current.y - 60}px)`
  }
  const moveGhost = (x: number, y: number) => {
    ghostAt.current = { x, y }
    placeGhost(ghostEl.current)
  }

  const onDown = (e: ReactPointerEvent<HTMLButtonElement>, fruit: Fruit) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    press.current = { id: fruit.id, x: e.clientX, y: e.clientY, dragging: false }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onMove = (e: ReactPointerEvent<HTMLButtonElement>, fruit: Fruit) => {
    const p = press.current
    if (!p || p.id !== fruit.id) return
    if (!p.dragging) {
      const dx = e.clientX - p.x
      const dy = e.clientY - p.y
      // In the sideways-scrolling shelf, a sideways move is a scroll, not a drag.
      if (Math.hypot(dx, dy) < DRAG_START || (scroll && Math.abs(dx) > Math.abs(dy))) return
      p.dragging = true
      setGhost(fruit)
    }
    moveGhost(e.clientX, e.clientY)
    onDragging(overStage(e.clientX, e.clientY) !== null)
  }

  const onUp = (e: ReactPointerEvent<HTMLButtonElement>, fruit: Fruit) => {
    const p = press.current
    press.current = null
    if (!p || p.id !== fruit.id) return
    if (p.dragging) {
      const dropX = overStage(e.clientX, e.clientY)
      setGhost(null)
      onDragging(null)
      if (dropX !== null) onAdd(fruit.id, dropX)
    } else {
      onAdd(fruit.id, tapDrop())
    }
  }

  const onCancel = () => {
    press.current = null
    setGhost(null)
    onDragging(null)
  }

  return (
    <>
      <ul className={`cafe-shelf${scroll ? ' cafe-shelf--scroll' : ''}`} aria-label="Fruit shelf">
        {fruits.map((f, i) => {
          const isFresh = fresh.has(f.id)
          const added = inBowl.has(f.id)
          return (
            <li key={f.id} className="cafe-shelf__slot">
              <button
                type="button"
                className={`cafe-tile${added ? ' cafe-tile--added' : ''}${isFresh ? ' cafe-tile--fresh' : ''}`}
                style={{ '--fruit': f.colour, animationDelay: `${i * 40}ms` } as CSSProperties}
                onPointerDown={e => onDown(e, f)}
                onPointerMove={e => onMove(e, f)}
                onPointerUp={e => onUp(e, f)}
                onPointerCancel={onCancel}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onAdd(f.id, 0) } }}
                aria-label={`${added ? 'In the bowl: ' : 'Add '}${f.name}${isFresh ? ', fresh now' : ''}`}
                aria-pressed={added}
              >
                <span className="cafe-tile__icon">
                  <FruitIcon fruit={f} size="lg" />
                  {isFresh && <Sparkles />}
                  {added && <span className="cafe-tile__tick" aria-hidden="true">✓</span>}
                </span>
                <span className={`cafe-tile__name${f.name.length > 12 ? ' is-long' : ''}`}>{f.name}</span>
                {isFresh && <span className="cafe-tile__fresh">fresh now!</span>}
              </button>
            </li>
          )
        })}
      </ul>
      {ghost && createPortal(
        <div ref={placeGhost} className="cafe-ghost" aria-hidden="true">
          <FruitIcon fruit={ghost} size="xl" />
        </div>,
        document.body,
      )}
    </>
  )
}

function Sparkles() {
  return (
    <svg className="cafe-sparkles" viewBox="0 0 64 64" aria-hidden="true">
      <path className="cafe-sparkle cafe-sparkle--1" d="M52 2 L54 9 L61 11 L54 13 L52 20 L50 13 L43 11 L50 9 Z" />
      <path className="cafe-sparkle cafe-sparkle--2" d="M8 40 L9.5 45 L14 46.5 L9.5 48 L8 53 L6.5 48 L2 46.5 L6.5 45 Z" />
      <path className="cafe-sparkle cafe-sparkle--3" d="M58 44 L59 47 L62 48 L59 49 L58 52 L57 49 L54 48 L57 47 Z" />
    </svg>
  )
}
