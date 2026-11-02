import { ChevronRight } from 'lucide-react'
import type { Fruit } from '../types/fruit'
import { FRUITS } from '../assets/fruits'
import { FruitIcon } from '../components/FruitIcon'
import { Link } from '../components/Link'
import { PageHeader } from '../components/PageHeader'
import type { Route } from '../utils/route'

const pick = (...ids: string[]) => ids.map(id => FRUITS.find(f => f.id === id)).filter((f): f is Fruit => !!f)

export function PlayPage() {
  return (
    <div className="flex flex-col pb-6">
      <PageHeader title="Play" bag={false} />
      <ul className="flex flex-col gap-3 px-4">
        <PlayEntry
          to={{ name: 'quiz' }}
          title="Guess the fruit"
          text="Five rounds. A blurred fruit, four names, and clues if you need them."
          fruits={pick('dragon-fruit', 'starfruit', 'feijoa')}
          blur
        />
        <PlayEntry
          to={{ name: 'salad' }}
          title="Fruit Salad Cafe"
          text="Customers order by picture. Drop, chop and stir their bowl for stars and stickers, then make it for real."
          fruits={pick('strawberry', 'banana', 'kiwifruit')}
        />
      </ul>
    </div>
  )
}

function PlayEntry({ to, title, text, fruits, blur = false }: { to: Route; title: string; text: string; fruits: Fruit[]; blur?: boolean }) {
  return (
    <li>
      <Link to={to} className="flex items-start gap-3 rounded-card bg-card p-4 active:bg-tile">
        <span className="flex min-w-0 flex-1 flex-col gap-3">
          <span className="flex -space-x-3" aria-hidden="true">
            {fruits.map(f => (
              <span key={f.id} className="rounded-full ring-2 ring-card">
                <FruitIcon fruit={f} size="lg" className={blur ? 'blur-[3px]' : undefined} />
              </span>
            ))}
          </span>
          <span className="flex flex-col gap-1">
            <span className="font-display text-title font-semibold">{title}</span>
            <span className="text-small text-ink-2">{text}</span>
          </span>
        </span>
        <ChevronRight aria-hidden="true" className="mt-4 size-5 shrink-0 text-ink-3" />
      </Link>
    </li>
  )
}
