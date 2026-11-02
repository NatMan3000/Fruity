import { useEffect, useState, type CSSProperties } from 'react'
import clsx from 'clsx'
import { Check, Heart, Leaf, LayoutGrid, Smile } from 'lucide-react'
import type { Month } from '../types/fruit'
import { RECIPE_TYPES } from '../types/recipe'
import { FRUITS } from '../assets/fruits'
import { useRecipeBox } from '../hooks/useRecipeBox'
import { useRecipes } from '../hooks/useRecipes'
import { useStoredState } from '../hooks/useStoredState'
import { filterRecipes, TYPE_LABEL, type CookFilter, type CookView } from '../utils/recipes'
import { ChipRow } from '../components/ChipRow'
import { RecipeCard } from '../components/RecipeCard'
import { TopBar } from '../components/TopBar'

let introPlayed = false

const VIEWS: { view: CookView; label: string; Icon: typeof Leaf }[] = [
  { view: 'season', label: 'In season', Icon: Leaf },
  { view: 'all', label: 'All', Icon: LayoutGrid },
  { view: 'saved', label: 'Saved', Icon: Heart },
]

const DEFAULT: CookFilter = { view: 'season', type: null, kids: false }

const isCookFilter = (v: unknown): v is CookFilter => {
  const f = v as CookFilter
  return typeof f === 'object' && f !== null && VIEWS.some(x => x.view === f.view) &&
    (f.type === null || RECIPE_TYPES.includes(f.type)) && typeof f.kids === 'boolean'
}

// Fruity's own recipes: In season (the main fruit is in the shops, peak first), All, or Saved; narrowed
// by type and Kid-friendly. Each recipe is a block in its main fruit's colour.
export function CookPage({ month }: { month: Month }) {
  const recipes = useRecipes()
  const box = useRecipeBox()
  const [filter, setFilter] = useStoredState<CookFilter>('fruity.cook', DEFAULT, isCookFilter)
  const [intro] = useState(() => !introPlayed)
  useEffect(() => { introPlayed = true }, [])
  const list = recipes ? filterRecipes(recipes, FRUITS, month, filter, box.saved) : []
  const narrowed = filter.type !== null || filter.kids

  return (
    <div className="flex flex-col pb-6">
      <TopBar title="Cook" intro={intro} />
      <div className="flex flex-col gap-4">
        <div className="px-4">
          <div role="radiogroup" aria-label="Which recipes" className="flex rounded-full bg-(--ink) p-1">
            {VIEWS.map(({ view, label, Icon }) => {
              const on = filter.view === view
              return (
                <button
                  key={view}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setFilter(f => ({ ...f, view }))}
                  className={clsx(
                    'chip inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full text-small font-extrabold',
                    on ? 'bg-(--pop) text-(--ink)' : 'text-(--bright)',
                  )}
                >
                  <Icon aria-hidden="true" className="size-4" strokeWidth={2.5} fill={on && view === 'saved' ? 'currentColor' : 'none'} />
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        <ChipRow label="Recipe type" wrap>
          {RECIPE_TYPES.map(type => (
            <Chip key={type} on={filter.type === type} onClick={() => setFilter(f => ({ ...f, type: f.type === type ? null : type }))}>
              {TYPE_LABEL[type]}
            </Chip>
          ))}
          <Chip on={filter.kids} onClick={() => setFilter(f => ({ ...f, kids: !f.kids }))} Icon={Smile}>Kid-friendly</Chip>
        </ChipRow>

        <div className="flex flex-col gap-4 px-4 pt-1">
          {recipes && (
            <p aria-live="polite" className="text-small font-bold tabular-nums">
              {countLine(list.length, filter.view)}
              {narrowed && list.length > 0 && (
                <>
                  {' '}
                  <button type="button" onClick={() => setFilter(f => ({ ...f, type: null, kids: false }))} className="inline-flex min-h-11 items-center underline">
                    Clear filters
                  </button>
                </>
              )}
            </p>
          )}
          {recipes && list.length === 0 && <Empty view={filter.view} narrowed={narrowed} onClear={() => setFilter(f => ({ ...f, type: null, kids: false }))} onAll={() => setFilter(f => ({ ...f, view: 'all' }))} />}
          <ul className="flex flex-col gap-4">
            {list.map((r, i) => (
              <li key={r.id} className={clsx(intro && i < 6 && 'pop-in')} style={{ '--i': i, '--from-tilt': i % 2 ? '3deg' : '-3deg' } as CSSProperties}>
                <RecipeCard recipe={r} month={month} saved={filter.view !== 'saved' && box.saved.includes(r.id)} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function countLine(n: number, view: CookView): string {
  const word = n === 1 ? 'recipe' : 'recipes'
  if (view === 'season') return `${n} ${word} with fruit in the shops now`
  if (view === 'saved') return `${n} saved ${word}`
  return `${n} ${word}`
}

function Chip({ on, onClick, children, Icon }: { on: boolean; onClick: () => void; children: string; Icon?: typeof Smile }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={clsx(
        'chip inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-[var(--chip-px,16px)] text-small font-bold whitespace-nowrap',
        on ? 'bg-(--pop) text-(--ink)' : 'bg-(--deep) text-(--light)',
      )}
    >
      {on ? <Check aria-hidden="true" className="-ml-1 size-4" strokeWidth={3} /> : Icon && <Icon aria-hidden="true" className="-ml-1 size-4" strokeWidth={2.5} />}
      {children}
    </button>
  )
}

function Empty({ view, narrowed, onClear, onAll }: { view: CookView; narrowed: boolean; onClear: () => void; onAll: () => void }) {
  const text = view === 'saved' && !narrowed
    ? 'Nothing saved yet. Tap the heart on a recipe to keep it here.'
    : narrowed
      ? 'No recipes match those filters.'
      : 'No recipes for fruit in the shops right now.'
  return (
    <div className="flex flex-col items-start gap-3 rounded-block bg-(--bright) p-5 text-(--ink)">
      <p className="text-body font-semibold">{text}</p>
      <div className="flex flex-wrap gap-2">
        {narrowed && (
          <button type="button" onClick={onClear} className="press inline-flex h-11 items-center rounded-full bg-(--ink) px-5 font-extrabold text-(--light)">Clear filters</button>
        )}
        {view !== 'all' && (
          <button type="button" onClick={onAll} className="press inline-flex h-11 items-center rounded-full bg-(--pop) px-5 font-extrabold text-(--ink)">See all recipes</button>
        )}
      </div>
    </div>
  )
}
