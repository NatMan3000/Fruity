import { useRef, useState, type PointerEvent as ReactPointerEvent, type RefObject } from 'react'
import clsx from 'clsx'
import { Check } from 'lucide-react'
import { createPortal } from 'react-dom'
import type { Fruit } from '../../types/fruit'
import { FruitIcon } from '../../components/FruitIcon'
import { StatusSticker } from '../../components/StatusSticker'
import { toneVars, tonesOf } from '../../utils/tones'

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
      <ul
        className={clsx(
          'grid flex-none gap-x-2 gap-y-3 px-4 pt-4 pb-2 [@media(max-height:700px)]:gap-y-2.5 [@media(max-height:700px)]:pt-3',
          scroll ? 'scrollbar-hide auto-cols-[84px] grid-flow-col grid-rows-2 overflow-x-auto' : 'grid-cols-4',
        )}
        aria-label="Fruit shelf"
      >
        {fruits.map((f, i) => {
          const isFresh = fresh.has(f.id)
          const added = inBowl.has(f.id)
          return (
            <li key={f.id} className="min-w-0">
              {/* Each fruit is a block in its own colours, like the app's fruit rows. */}
              <button
                type="button"
                className={clsx(
                  'cafe-tile-in press block-shadow relative flex h-[92px] w-full [@media(max-height:700px)]:h-[84px] flex-col items-center justify-center gap-0.5 rounded-3xl bg-(--pop) px-1 pt-1 pb-1.5 text-(--ink)',
                  scroll ? 'touch-pan-x' : 'touch-none',
                  added && 'opacity-60',
                )}
                style={{ ...toneVars(tonesOf(f.colour)), animationDelay: `${i * 40}ms` }}
                onPointerDown={e => onDown(e, f)}
                onPointerMove={e => onMove(e, f)}
                onPointerUp={e => onUp(e, f)}
                onPointerCancel={onCancel}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onAdd(f.id, 0) } }}
                aria-label={`${added ? 'In the bowl: ' : 'Add '}${f.name}${isFresh ? ', fresh now' : ''}`}
                aria-pressed={added}
              >
                <span className="relative leading-none">
                  <FruitIcon fruit={f} size="row" />
                  {isFresh && <Sparkles />}
                  {added && (
                    <span className="absolute -right-1.5 -bottom-0.5 flex size-6 items-center justify-center rounded-full bg-peak text-peak-ink ring-2 ring-(--pop)" aria-hidden="true">
                      <Check className="size-4" strokeWidth={3.25} />
                    </span>
                  )}
                </span>
                <span className="w-full text-center text-caption leading-[1.05] font-extrabold break-words hyphens-auto">{f.name}</span>
                {isFresh && <StatusSticker status="peak" label="Fresh" icon="new" size="sm" tilt={-3} className="absolute -top-3.5 left-1/2 -translate-x-1/2" />}
              </button>
            </li>
          )
        })}
      </ul>
      {ghost && createPortal(
        <div ref={placeGhost} className="pointer-events-none fixed top-0 left-0 z-80 drop-shadow-[0_10px_8px_rgb(30_8_20/0.3)] will-change-transform" aria-hidden="true">
          <FruitIcon fruit={ghost} size="xl" />
        </div>,
        document.body,
      )}
    </>
  )
}

// Three twinkles round a fresh fruit (twice, then still), in the status amber outlined in ink.
function Sparkles() {
  return (
    <svg className="pointer-events-none absolute -inset-2 size-[calc(100%+16px)] fill-ending stroke-(--ink) stroke-1" viewBox="0 0 64 64" aria-hidden="true">
      <path className="cafe-sparkle cafe-sparkle--1" d="M52 2 L54 9 L61 11 L54 13 L52 20 L50 13 L43 11 L50 9 Z" />
      <path className="cafe-sparkle cafe-sparkle--2" d="M8 40 L9.5 45 L14 46.5 L9.5 48 L8 53 L6.5 48 L2 46.5 L6.5 45 Z" />
      <path className="cafe-sparkle cafe-sparkle--3" d="M58 44 L59 47 L62 48 L59 49 L58 52 L57 49 L54 48 L57 47 Z" />
    </svg>
  )
}
