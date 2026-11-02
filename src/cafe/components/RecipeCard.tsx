import { useMemo } from 'react'
import type { Fruit, Month } from '../../types/fruit'
import { FruitIcon } from '../../components/FruitIcon'
import { updateBag, useBag } from '../../hooks/useBag'
import { addFruit, hasFruit } from '../../utils/bag'
import { buildRecipe } from '../logic/recipe'

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

  return (
    <div className="cafe-overlay cafe-recipe" role="dialog" aria-modal="true" aria-labelledby="cafe-recipe-title">
      <header className="cafe-overlay__bar">
        <span className="cafe-recipe__kicker">For grown-ups</span>
        <button type="button" className="cafe-iconbtn" onClick={onClose} aria-label={closeLabel}>✕</button>
      </header>
      <article className="cafe-recipe__card">
        <ul className="cafe-recipe__fruit" aria-hidden="true">
          {fruits.map(f => <li key={f.id}><FruitIcon fruit={f} size="lg" /></li>)}
        </ul>
        <h2 id="cafe-recipe-title">{recipe.title}</h2>
        <p className="cafe-recipe__meta">Serves {recipe.serves} · 15 minutes · {recipe.dressing}</p>

        <h3>You need</h3>
        <ul className="cafe-recipe__list">
          {recipe.ingredients.map((ing, i) => <li key={i}>{ing.line}</li>)}
        </ul>

        <h3>Method</h3>
        <ol className="cafe-recipe__steps">
          {recipe.steps.map((s, i) => <li key={i}>{s}</li>)}
        </ol>

        {recipe.outOfSeason.length > 0 && (
          <div className="cafe-recipe__season">
            {recipe.outOfSeason.map(({ fruit, swap }) => (
              <p key={fruit.id}>
                {fruit.name} is out of season in {month}{swap ? `: try ${swap.name.toLowerCase()} instead, it's in season now.` : '.'}
              </p>
            ))}
          </div>
        )}
      </article>
      <div className="cafe-recipe__actions">
        <button type="button" className="cafe-btn cafe-btn--go" onClick={addAll} disabled={missing.length === 0}>
          {missing.length === 0 ? 'All in the bag ✓' : `Add ${missing.length === fruits.length ? 'fruit' : `${missing.length} more`} to bag`}
        </button>
        <button type="button" className="cafe-btn cafe-btn--plain" onClick={onClose}>{closeLabel}</button>
      </div>
    </div>
  )
}
