import clsx from 'clsx'
import { CalendarRange, LayoutList } from 'lucide-react'
import { Link } from '../components/Link'
import { PageHeader } from '../components/PageHeader'

// Shared by the Fruit list and the Year view: title, bag, and the List / Year switch.
export function FruitTabHeader({ view }: { view: 'list' | 'year' }) {
  const option = (v: 'list' | 'year', label: string, Icon: typeof LayoutList) => (
    <Link
      to={v === 'list' ? { name: 'browse' } : { name: 'year' }}
      ariaCurrent={view === v ? 'page' : undefined}
      className={clsx(
        'inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-[6px] text-small',
        view === v ? 'bg-card font-semibold text-ink' : 'font-medium text-ink-2',
      )}
    >
      <Icon aria-hidden="true" className="size-4" />
      {label}
    </Link>
  )
  return (
    <>
      <PageHeader title="Fruit" />
      <nav aria-label="Fruit views" className="px-4 pb-2">
        <div className="flex gap-1 rounded-control bg-tile p-1">
          {option('list', 'List', LayoutList)}
          {option('year', 'Year', CalendarRange)}
        </div>
      </nav>
    </>
  )
}
