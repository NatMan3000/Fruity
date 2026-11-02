import { useEffect, useState, type CSSProperties } from 'react'
import clsx from 'clsx'
import type { Month } from '../types/fruit'
import { FRUITS } from '../assets/fruits'
import { fruitStatus, sortBySeason } from '../utils/seasonality'
import { toneVars, tonesOf } from '../utils/tones'
import { FruitSticker } from '../components/FruitSticker'
import { Link } from '../components/Link'
import { RecipeIdeas } from '../components/RecipeIdeas'
import { StatusSticker } from '../components/StatusSticker'
import { TopBar } from '../components/TopBar'

let introPlayed = false

// Recipe ideas grouped by fruit in season now, peak first: each fruit is a block in its own colour with
// its ideas inside. Phase 3 replaces the content with full recipes.
export function CookPage({ month }: { month: Month }) {
  const groups = sortBySeason(FRUITS, month).filter(f => fruitStatus(f, month) !== 'off' && f.recipes?.length)
  const [intro] = useState(() => !introPlayed)
  useEffect(() => { introPlayed = true }, [])

  return (
    <div className="flex flex-col pb-6">
      <TopBar title="Cook" intro={intro} />
      <div className="flex flex-col gap-6 px-4">
        <p className="text-body font-bold">Ideas for fruit in season in Victoria now, best first.</p>
        {groups.length === 0 && (
          <p className="rounded-block bg-(--bright) p-5 text-body font-semibold text-(--ink)">Nothing with recipe ideas is in season this month. Try the Fruit list for what is around.</p>
        )}
        {groups.map((f, i) => (
          <section
            key={f.id}
            aria-labelledby={`cook-${f.id}`}
            className={clsx('block-shadow flex flex-col gap-3 rounded-block bg-(--pop) p-3 pb-4 text-(--ink)', intro && i < 4 && 'pop-in')}
            style={{ ...toneVars(tonesOf(f.colour)), '--i': i } as CSSProperties}
          >
            <Link to={{ name: 'fruit', id: f.id }} className="flex min-h-11 items-center gap-3 rounded-full pr-2">
              <FruitSticker fruit={f} size={60} />
              <span className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <h2 id={`cook-${f.id}`} className="font-display text-name">{f.name}</h2>
                <StatusSticker status={fruitStatus(f, month)} size="sm" />
              </span>
            </Link>
            <RecipeIdeas recipes={f.recipes!} />
          </section>
        ))}
      </div>
    </div>
  )
}
