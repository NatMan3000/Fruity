import { useMemo } from 'react'
import clsx from 'clsx'
import { Check, ShoppingBag } from 'lucide-react'
import type { Fruit, Month } from '../../types/fruit'
import { FruitIcon } from '../../components/FruitIcon'
import { updateBag, useBag } from '../../hooks/useBag'
import { useRecipes } from '../../hooks/useRecipes'
import { addFruit, hasFruit } from '../../utils/bag'
import { realRecipeFor } from '../../utils/recipes'
import { Link } from '../../components/Link'
import { buildRecipe } from '../logic/recipe'
import { OVERLAY, pill } from '../ui'
import { CloseDisc } from './Controls'

interface RecipeCardProps {
  fruits: Fruit[]       // what is in the bowl
  allFruits: Fruit[]
  month: Month
  onClose: () => void
  closeLabel: string
}

// "Make it for real": the bowl as a fruit salad a grown-up can make, with one tap to put the
// fruit in the shopping bag.
export function RecipeCard({ fruits, allFruits, month, onClose, closeLabel }: RecipeCardProps) {
  const recipe = useMemo(() => buildRecipe(fruits, month, allFruits), [fruits, month, allFruits])
  const bag = useBag()
  const missing = fruits.filter(f => !hasFruit(bag, f.id))
  const addAll = () => updateBag(b => fruits.reduce((acc, f) => addFruit(acc, f), b))
  const recipes = useRecipes()
  const real = recipes ? realRecipeFor(recipes, fruits.map(f => f.id)) : undefined

  return (
    <div className={clsx(OVERLAY, 'select-text')} role="dialog" aria-modal="true" aria-labelledby="cafe-recipe-title">
      <header className="flex items-center justify-between gap-2 px-4 pt-[calc(env(safe-area-inset-top)+12px)] pb-3">
        <span className="rounded-full bg-(--ink) px-3 py-1.5 text-caption font-extrabold tracking-[0.06em] text-(--light) uppercase">For grown-ups</span>
        <CloseDisc label={closeLabel} onClick={onClose} />
      </header>
      {/* A recipe card like the Cook tab's: a `bright` block, the name in Shrikhand, numbered ink discs. */}
      <article className="block-shadow mx-4 flex flex-col gap-1 rounded-block bg-(--bright) px-5 pt-4 pb-5 text-(--ink)">
        <ul className="flex justify-center -space-x-1.5" aria-hidden="true">
          {fruits.map(f => <li key={f.id} className="leading-none"><FruitIcon fruit={f} size="lg" /></li>)}
        </ul>
        <h2 id="cafe-recipe-title" className="text-center font-display text-title">{recipe.title}</h2>
        <p className="text-center text-small font-semibold text-(--ink-soft)">Serves {recipe.serves} · 15 minutes · {recipe.dressing}</p>

        <h3 className="mt-3 font-display text-name">You need</h3>
        <ul className="flex list-disc flex-col gap-0.5 pl-5 text-body marker:text-(--ink-soft)">
          {recipe.ingredients.map((ing, i) => <li key={i}>{ing.line}</li>)}
        </ul>

        <h3 className="mt-3 font-display text-name">Method</h3>
        <ol className="flex flex-col gap-2 text-body">
          {recipe.steps.map((s, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-(--ink) text-small font-extrabold text-(--light) tabular-nums" aria-hidden="true">{i + 1}</span>
              <span className="pt-0.5">{s}</span>
            </li>
          ))}
        </ol>

        {recipe.outOfSeason.length > 0 && (
          <div className="mt-3 flex flex-col gap-1 rounded-2xl bg-ending px-3.5 py-2.5 text-small font-semibold text-ending-ink">
            {recipe.outOfSeason.map(({ fruit, swap }) => (
              <p key={fruit.id}>
                {fruit.name} is out of season in {month}{swap ? `: try ${swap.name.toLowerCase()} instead, it's in season now.` : '.'}
              </p>
            ))}
          </div>
        )}
      </article>
      <div className="mt-auto flex flex-col gap-2.5 px-4 pt-5 pb-[calc(env(safe-area-inset-bottom)+16px)]">
        {missing.length === 0 ? (
          <p className="block-shadow inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-peak px-5 text-[1.125rem] font-extrabold text-peak-ink" role="status">
            <span className="tick-spin inline-flex size-8 items-center justify-center rounded-full bg-peak-ink text-peak"><Check aria-hidden="true" className="size-5" strokeWidth={3.25} /></span>
            All in the bag
          </p>
        ) : (
          <button type="button" className={pill('ink')} onClick={addAll}>
            <ShoppingBag aria-hidden="true" className="size-5" strokeWidth={2.5} />
            {`Add ${missing.length === fruits.length ? 'fruit' : `${missing.length} more`} to bag`}
          </button>
        )}
        {real && (
          <Link to={{ name: 'recipe', id: real.id }} className={pill('bright', 'px-5 py-2 text-body text-center')}>
            Try our {real.name.toLowerCase()} recipe
          </Link>
        )}
        <button type="button" className={pill('bright')} onClick={onClose}>{closeLabel}</button>
      </div>
    </div>
  )
}
