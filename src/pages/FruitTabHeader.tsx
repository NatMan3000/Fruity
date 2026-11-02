import clsx from 'clsx'
import { CalendarRange, LayoutList, type LucideIcon } from 'lucide-react'
import { Link } from '../components/Link'
import { TopBar } from '../components/TopBar'

// Shared by the Fruit list and the Year view: title, the List / Year toggle and the bag. The toggle is
// two round icon buttons (comp-3d's), no words on screen; each still says its name to a screen reader.
export function FruitTabHeader({ view, intro = false }: { view: 'list' | 'year'; intro?: boolean }) {
  const option = (v: 'list' | 'year', label: string, Icon: LucideIcon) => {
    const on = view === v
    return (
      <Link
        to={v === 'list' ? { name: 'browse' } : { name: 'year' }}
        ariaCurrent={on ? 'page' : undefined}
        ariaLabel={label}
        className={clsx(
          'inline-flex size-11 items-center justify-center rounded-full transition-colors',
          on ? 'bg-(--bright) text-(--ink)' : 'text-(--bright)',
        )}
      >
        <Icon aria-hidden="true" className="size-5" strokeWidth={2.25} />
      </Link>
    )
  }
  return (
    <TopBar
      title="Fruit"
      intro={intro}
      right={
        <nav aria-label="Fruit views" className="flex shrink-0 gap-0.5 rounded-full bg-(--ink) p-0.5">
          {option('list', 'List', LayoutList)}
          {option('year', 'Year', CalendarRange)}
        </nav>
      }
    />
  )
}
