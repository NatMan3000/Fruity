import clsx from 'clsx'
import { useRef, useState, type PointerEvent } from 'react'
import { Apple, CookingPot, Puzzle, Sun, type LucideIcon } from 'lucide-react'
import type { Route, Tab } from '../utils/route'
import { navigate } from '../hooks/useRoute'
import { dragIntent, nearestTab, scoopX } from '../utils/tabDrag'
import { Link } from './Link'

const TABS: { tab: Tab; label: string; to: Route; Icon: LucideIcon }[] = [
  { tab: 'now', label: 'Now', to: { name: 'now' }, Icon: Sun },
  { tab: 'fruit', label: 'Fruit', to: { name: 'browse' }, Icon: Apple },
  { tab: 'cook', label: 'Cook', to: { name: 'cook' }, Icon: CookingPot },
  { tab: 'play', label: 'Play', to: { name: 'play' }, Icon: Puzzle },
]

// A floating dark pill (DESIGN.md "Components"). The current tab sits in a scoop of the screen's colour
// that glides across in step with the page slide when you switch tabs (CSS only). It sits out of the page
// moves (index.css), so it stays put while the screens slide and its scoop slides live.
//
// The scoop can also be dragged (Nathan, 3 Nov 2026: "it'd be good if you could also slide the selector
// left and right"): press anywhere on the bar and move sideways past DRAG_SLOP, and the scoop follows the
// finger, lighting the tab under it; let go and it snaps to that tab and goes there with the same slide as
// a tap (or back where it was, if that is the current tab). A tap, or a press that moves up or down, is
// left alone, so tapping and keyboard use work exactly as before. The bar takes only sideways touch
// (touch-action: pan-y), so a vertical swipe on it still scrolls the page.
const INSET = 6 // the bar's padding (p-1.5): the scoop's track starts and ends 6px in

interface Press { id: number; x0: number; y0: number; left: number; width: number; drag: boolean; x: number }

export function TabBar({ active }: { active: Tab }) {
  const index = Math.max(0, TABS.findIndex(t => t.tab === active))
  const bar = useRef<HTMLUListElement>(null)
  const press = useRef<Press | null>(null)
  const dragged = useRef(false) // swallow the click a mouse fires after a drag
  const [drag, setDrag] = useState<{ x: number; lit: number } | null>(null)
  // A drag let go on another tab holds the scoop there until the route (and so `active`) catches up.
  const [sent, setSent] = useState<number | null>(null)
  const [seen, setSeen] = useState(index)
  if (seen !== index) {
    setSeen(index)
    setSent(null)
  }
  const settled = sent ?? index
  const lit = drag ? drag.lit : settled

  const onPointerDown = (e: PointerEvent<HTMLUListElement>) => {
    dragged.current = false
    if (!e.isPrimary || (e.pointerType === 'mouse' && e.button !== 0) || !bar.current) return
    const r = bar.current.getBoundingClientRect()
    const width = (r.width - INSET * 2) / TABS.length
    press.current = { id: e.pointerId, x0: e.clientX, y0: e.clientY, left: r.left + INSET, width, drag: false, x: settled * width }
  }
  const onPointerMove = (e: PointerEvent<HTMLUListElement>) => {
    const p = press.current
    if (!p || p.id !== e.pointerId) return
    if (!p.drag) {
      const intent = dragIntent(e.clientX - p.x0, e.clientY - p.y0)
      if (intent === 'wait') return
      if (intent === 'none') {
        press.current = null
        return
      }
      p.drag = true
      bar.current?.setPointerCapture(e.pointerId)
    }
    p.x = scoopX(e.clientX - p.left, p.width, TABS.length)
    setDrag({ x: p.x, lit: nearestTab(p.x, p.width, TABS.length) })
  }
  const onPointerUp = (e: PointerEvent<HTMLUListElement>) => {
    const p = press.current
    if (!p || p.id !== e.pointerId) return
    press.current = null
    if (!p.drag) return
    dragged.current = true
    setDrag(null)
    const to = nearestTab(p.x, p.width, TABS.length)
    if (to === index) return // back to where it was
    setSent(to)
    navigate(TABS[to].to)
  }
  const onPointerCancel = (e: PointerEvent<HTMLUListElement>) => {
    if (press.current?.id !== e.pointerId) return
    press.current = null
    setDrag(null)
  }

  return (
    <nav aria-label="Main" className="pointer-events-none fixed inset-x-0 bottom-0 z-30 px-3 [view-transition-name:tab-bar] pb-[calc(env(safe-area-inset-bottom)+10px)]">
      <ul
        ref={bar}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onClickCapture={e => {
          if (!dragged.current) return
          dragged.current = false
          e.preventDefault()
          e.stopPropagation()
        }}
        onDragStart={e => e.preventDefault()} // a mouse drag must not pick up the link
        className="pointer-events-auto relative mx-auto flex max-w-md touch-pan-y rounded-full bg-(--ink) p-1.5 shadow-[0_10px_30px_-8px_rgb(20_6_14/0.55)] select-none"
      >
        <li
          aria-hidden="true"
          role="presentation"
          data-dragging={drag ? '' : undefined}
          className="tab-scoop absolute top-1.5 bottom-1.5 left-1.5 rounded-full bg-(--scoop)"
          style={{ width: `calc((100% - ${INSET * 2}px) / ${TABS.length})`, transform: drag ? `translateX(${drag.x}px)` : `translateX(${settled * 100}%)` }}
        />
        {TABS.map(({ tab, label, to, Icon }, i) => {
          const current = tab === active
          const on = i === lit
          return (
            <li key={tab} className="relative flex-1">
              <Link
                to={to}
                ariaCurrent={current ? 'page' : undefined}
                onNavigate={() => { if (current) window.scrollTo(0, 0) }}
                className={clsx('relative flex h-14 flex-col items-center justify-center gap-0.5 rounded-full text-[12.5px]', on ? 'font-extrabold text-(--ink)' : 'font-semibold text-(--bright)')}
              >
                <Icon aria-hidden="true" className="size-[22px]" strokeWidth={on ? 2.5 : 2} />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
