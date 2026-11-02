import type { CSSProperties } from 'react'
import clsx from 'clsx'
import { Clock, Heart, Users } from 'lucide-react'
import type { Month } from '../types/fruit'
import type { Recipe } from '../types/recipe'
import { FRUITS } from '../assets/fruits'
import { atPeak, formatMinutes, mainFruit, totalMinutes, TYPE_LABEL } from '../utils/recipes'
import { toneVars, tonesOf } from '../utils/tones'
import { FruitSticker } from './FruitSticker'
import { Link } from './Link'
import { StatusSticker } from './StatusSticker'

// A recipe as a colour block in its main fruit's colour (DESIGN.md "Components"): the fruit stuck on
// inside, the name in Shrikhand, the time and serves, and an In season sticker when the main fruit is
// at its peak. `pop` on a season screen (Cook, Now); `bright` on a fruit's own page, which is already
// that fruit's pop.
interface RecipeCardProps {
  recipe: Recipe
  month: Month
  surface?: 'pop' | 'bright'
  saved?: boolean
  stack?: boolean // the sticker above the words: a narrow card on a sideways rail
  className?: string
  style?: CSSProperties
}

export function RecipeCard({ recipe, month, surface = 'pop', saved = false, stack = false, className, style }: RecipeCardProps) {
  const fruit = mainFruit(recipe, FRUITS)
  const peak = atPeak(recipe, FRUITS, month)
  return (
    <Link
      to={{ name: 'recipe', id: recipe.id }}
      className={clsx(
        'press block-shadow flex rounded-block text-(--ink)',
        stack ? 'flex-col items-start gap-2 p-4 pt-3' : 'items-center gap-3 py-3 pr-4 pl-3',
        surface === 'pop' ? 'bg-(--pop)' : 'bg-(--bright)',
        className,
      )}
      style={{ ...(fruit ? toneVars(tonesOf(fruit.colour)) : {}), ...style }}
    >
      {fruit && <FruitSticker fruit={fruit} size={stack ? 64 : 76} />}
      <span className="flex min-w-0 flex-1 flex-col items-start gap-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-caption font-extrabold tracking-[0.06em] text-(--ink-soft) uppercase">{TYPE_LABEL[recipe.type]}</span>
          {peak && <StatusSticker status="peak" label="In season" size="sm" tilt={-3} />}
        </span>
        <span className="font-display text-name break-words">{recipe.name}</span>
        <span className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-small font-bold text-(--ink-soft) tabular-nums">
          <span className="inline-flex items-center gap-1">
            <Clock aria-hidden="true" className="size-4" strokeWidth={2.5} />
            {formatMinutes(totalMinutes(recipe))}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users aria-hidden="true" className="size-4" strokeWidth={2.5} />
            {recipe.makes ? `Makes ${recipe.makes}` : `Serves ${recipe.serves}`}
          </span>
          {saved && (
            <span className="inline-flex items-center gap-1">
              <Heart aria-hidden="true" className="size-4" strokeWidth={2.5} fill="currentColor" />
              Saved
            </span>
          )}
        </span>
      </span>
    </Link>
  )
}
