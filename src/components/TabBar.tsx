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

// Bottom tab bar. The current tab is neutral-selected (recessed tile pill), never an accent.
export function TabBar({ active }: { active: Tab }) {
  return (
    <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-30 bg-card pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto flex max-w-2xl">
        {TABS.map(({ tab, label, to, Icon }) => {
          const current = tab === active
          return (
            <li key={tab} className="flex-1">
              <Link
                to={to}
                ariaCurrent={current ? 'page' : undefined}
                onNavigate={() => { if (current) window.scrollTo(0, 0) }}
                className={clsx(
                  'flex min-h-14 flex-col items-center justify-center gap-0.5 pt-1.5 pb-1 text-caption',
                  current ? 'font-semibold text-ink' : 'font-medium text-ink-3',
                )}
              >
                <span className={clsx('inline-flex h-7 w-14 items-center justify-center rounded-full', current && 'bg-tile')}>
                  <Icon aria-hidden="true" className="size-5" strokeWidth={current ? 2.25 : 1.75} />
                </span>
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
