import type { Month } from '../types/fruit'
import { FRUITS } from '../assets/fruits'
import { STATE_NAMES, useAusState } from '../hooks/useAusState'
import { fruitStatus, sortBySeason } from '../utils/seasonality'
import { FruitIcon } from '../components/FruitIcon'
import { Link } from '../components/Link'
import { PageHeader } from '../components/PageHeader'
import { RecipeIdeas } from '../components/RecipeIdeas'
import { StatusLabel } from '../components/StatusLabel'

// Recipe ideas grouped by fruit in season now, peak first. Phase 3 replaces the content with full recipes.
export function CookPage({ month }: { month: Month }) {
  const { state } = useAusState()
  const groups = sortBySeason(FRUITS, month, state).filter(f => fruitStatus(f, month, state) !== 'off' && f.recipes?.length)

  return (
    <div className="flex flex-col pb-6">
      <PageHeader title="Cook" />
      <div className="flex flex-col gap-6 px-4">
        <p className="text-body text-ink-2">Ideas for fruit in season in {STATE_NAMES[state]} now, best first.</p>
        {groups.map(f => (
          <section key={f.id} aria-labelledby={`cook-${f.id}`} className="flex flex-col gap-2">
            <Link to={{ name: 'fruit', id: f.id }} morph className="-mx-1 flex min-h-11 items-center gap-3 rounded-control px-1 active:bg-tile">
              <FruitIcon fruit={f} size="md" morph />
              <span className="flex flex-1 flex-wrap items-baseline justify-between gap-x-3">
                <h2 id={`cook-${f.id}`} className="font-display text-title font-semibold">{f.name}</h2>
                <StatusLabel status={fruitStatus(f, month, state)} />
              </span>
            </Link>
            <RecipeIdeas recipes={f.recipes!} />
          </section>
        ))}
      </div>
    </div>
  )
}
