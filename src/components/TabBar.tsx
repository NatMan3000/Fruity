import clsx from 'clsx'
import { Apple, CookingPot, Puzzle, Sun, type LucideIcon } from 'lucide-react'
import type { Route, Tab } from '../utils/route'
import { Link } from './Link'

const TABS: { tab: Tab; label: string; to: Route; Icon: LucideIcon }[] = [
  { tab: 'now', label: 'Now', to: { name: 'now' }, Icon: Sun },
  { tab: 'fruit', label: 'Fruit', to: { name: 'browse' }, Icon: Apple },
  { tab: 'cook', label: 'Cook', to: { name: 'cook' }, Icon: CookingPot },
  { tab: 'play', label: 'Play', to: { name: 'play' }, Icon: Puzzle },
]

// A floating dark pill (DESIGN.md "Components"). The current tab sits in a scoop of the screen's colour
// that slides across with an overshoot when you switch tabs (CSS only). It sits out of the page moves
// (index.css), so it stays put while the screens slide and its scoop slides live.
export function TabBar({ active }: { active: Tab }) {
  const index = TABS.findIndex(t => t.tab === active)
  return (
    <nav aria-label="Main" className="pointer-events-none fixed inset-x-0 bottom-0 z-30 px-3 [view-transition-name:tab-bar] pb-[calc(env(safe-area-inset-bottom)+10px)]">
      <ul className="pointer-events-auto relative mx-auto flex max-w-md rounded-full bg-(--ink) p-1.5 shadow-[0_10px_30px_-8px_rgb(20_6_14/0.55)]">
        <li
          aria-hidden="true"
          role="presentation"
          className="tab-scoop absolute top-1.5 bottom-1.5 left-1.5 rounded-full bg-(--scoop)"
          style={{ width: 'calc((100% - 12px) / 4)', transform: `translateX(${Math.max(0, index) * 100}%)` }}
        />
        {TABS.map(({ tab, label, to, Icon }) => {
          const current = tab === active
          return (
            <li key={tab} className="relative flex-1">
              <Link
                to={to}
                ariaCurrent={current ? 'page' : undefined}
                onNavigate={() => { if (current) window.scrollTo(0, 0) }}
                className={clsx('relative flex h-14 flex-col items-center justify-center gap-0.5 rounded-full text-[12.5px]', current ? 'font-extrabold text-(--ink)' : 'font-semibold text-(--bright)')}
              >
                <Icon aria-hidden="true" className="size-[22px]" strokeWidth={current ? 2.5 : 2} />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
