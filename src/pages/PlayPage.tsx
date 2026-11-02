import { ChevronRight } from 'lucide-react'
import { type CSSProperties } from 'react'
import clsx from 'clsx'
import type { Fruit } from '../types/fruit'
import { FRUITS } from '../assets/fruits'
import { toneVars, tonesOf } from '../utils/tones'
import { FruitSticker } from '../components/FruitSticker'
import { Link } from '../components/Link'
import { TopBar } from '../components/TopBar'
import type { Route } from '../utils/route'

const pick = (...ids: string[]) => ids.map(id => FRUITS.find(f => f.id === id)).filter((f): f is Fruit => !!f)

export function PlayPage() {
  return (
    <div className="flex flex-col pb-6">
      <TopBar title="Play" bag={false} />
      <ul className="flex flex-col gap-5 px-4 pt-2">
        <PlayEntry
          i={0}
          to={{ name: 'quiz' }}
          colour="#7E57C2"
          title="Guess the fruit"
          text="Five rounds. A blurred fruit, four names, and clues if you need them."
          fruits={pick('dragon-fruit', 'starfruit', 'feijoa')}
          blur
        />
        <PlayEntry
          i={1}
          to={{ name: 'salad' }}
          colour="#FFD93B"
          title="Fruit Salad Cafe"
          text="Customers order by picture. Drop, chop and stir their bowl for stars and stickers, then make it for real."
          fruits={pick('strawberry', 'banana', 'kiwifruit')}
        />
      </ul>
    </div>
  )
}

function PlayEntry({ i, to, colour, title, text, fruits, blur = false }: { i: number; to: Route; colour: string; title: string; text: string; fruits: Fruit[]; blur?: boolean }) {
  return (
    <li className="pop-in" style={{ '--i': i } as CSSProperties}>
      <Link
        to={to}
        className="press block-shadow flex flex-col gap-3 rounded-block bg-(--pop) p-5 text-(--ink)"
        style={toneVars(tonesOf(colour))}
      >
        <span className="flex items-end -space-x-2" aria-hidden="true">
          {fruits.map((f, k) => (
            <FruitSticker key={f.id} fruit={f} size={k === 1 ? 84 : 68} slap delay={180 + k * 90 + i * 120} className={clsx(blur && 'blur-[3px]')} />
          ))}
        </span>
        <span className="flex items-end justify-between gap-3">
          <span className="flex flex-col gap-1">
            <span className="font-display text-title">{title}</span>
            <span className="text-small font-semibold text-(--ink-soft)">{text}</span>
          </span>
          <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-(--ink) text-(--light)">
            <ChevronRight aria-hidden="true" className="size-6" strokeWidth={2.75} />
          </span>
        </span>
      </Link>
    </li>
  )
}
