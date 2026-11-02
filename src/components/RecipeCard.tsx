import type { CSSProperties } from 'react'
import clsx from 'clsx'
import { Clock, Heart, Users } from 'lucide-react'
import type { Month } from '../types/fruit'
import type { Recipe } from '../types/recipe'
import { FRUITS } from '../assets/fruits'
import { dishUrl } from '../utils/images'
import { atPeak, formatMinutes, mainFruit, totalMinutes, TYPE_LABEL } from '../utils/recipes'
import { blockTone, toneVars, tonesOf } from '../utils/tones'
import { FruitSticker } from './FruitSticker'
import { Link } from './Link'
import { StatusSticker } from './StatusSticker'

// A recipe as a colour block in its main fruit's colour (DESIGN.md "Cook"): the finished dish as the
// card's picture, the fruit's sticker slapped over the photo's lower edge so the fruit still leads, then
// the type, the name in Shrikhand, the time and serves, and an In season sticker when the main fruit is
// at its peak. `pop` on a season screen (Cook, Now); `bright` on a fruit's own page, which is already
// that fruit's pop. On a page in another fruit's colour (`page`), a card too close to it takes its other
// tone or a white die-cut edge (`blockTone`), so it never melts into the page. No text sits on the photo.
interface RecipeCardProps {
  recipe: Recipe
  month: Month
  surface?: 'pop' | 'bright'
  page?: string   // the colour the card sits on, when it is a fruit's colour (a fruit's page)
  saved?: boolean
  stack?: boolean // a narrow card on a sideways rail: a 4:3 photo and a smaller sticker
  className?: string
  style?: CSSProperties
}

export function RecipeCard({ recipe, month, surface = 'pop', page, saved = false, stack = false, className, style }: RecipeCardProps) {
  const fruit = mainFruit(recipe, FRUITS)
  const peak = atPeak(recipe, FRUITS, month)
  const tone = fruit && page ? blockTone(fruit.colour, page, surface) : { surface, edge: false }
  return (
    <Link
      to={{ name: 'recipe', id: recipe.id }}
      className={clsx(
        'press block-shadow flex flex-col rounded-block p-2 text-(--ink)',
        tone.surface === 'pop' ? 'bg-(--pop)' : 'bg-(--bright)',
        tone.edge && 'card-edge',
        className,
      )}
      style={{ ...(fruit ? toneVars(tonesOf(fruit.colour)) : {}), ...style }}
    >
      <span className="relative block">
        <img
          src={dishUrl(recipe.id, 720)}
          alt=""
          width={720}
          height={540}
          loading="lazy"
          decoding="async"
          draggable={false}
          className={clsx('block w-full rounded-[20px] bg-(--deep) object-cover object-[50%_60%]', stack ? 'aspect-[4/3]' : 'aspect-[16/10]')}
        />
        {fruit && (
          <span className="absolute right-1 -bottom-8">
            <FruitSticker fruit={fruit} size={stack ? 64 : 76} />
          </span>
        )}
      </span>
      <span className="flex min-w-0 flex-1 flex-col items-start gap-1 px-2 pt-2 pb-1.5">
        <span className={clsx('flex min-h-8 flex-wrap items-center gap-x-2 gap-y-1', stack ? 'pr-16' : 'pr-20')}>
          <span className="text-caption font-extrabold tracking-[0.06em] text-(--ink-soft) uppercase">{TYPE_LABEL[recipe.type]}</span>
          {peak && <StatusSticker status="peak" label="In season" size="sm" tilt={-3} />}
        </span>
        <span className="font-display text-name break-words">{recipe.name}</span>
        {/* Each fact keeps its icon on its first line; a long "Makes ..." wraps under its own words
            (hanging indent), never back under the icon. */}
        <span className="mt-auto flex flex-wrap items-start gap-x-3 gap-y-0.5 text-small font-bold text-(--ink-soft) tabular-nums">
          <Meta Icon={Clock}>{formatMinutes(totalMinutes(recipe))}</Meta>
          <Meta Icon={Users}>{recipe.makes ? `Makes ${recipe.makes}` : `Serves ${recipe.serves}`}</Meta>
          {saved && <Meta Icon={Heart} fill>Saved</Meta>}
        </span>
      </span>
    </Link>
  )
}

function Meta({ Icon, fill = false, children }: { Icon: typeof Clock; fill?: boolean; children: string }) {
  return (
    <span className="inline-flex min-w-0 items-start gap-1">
      <Icon aria-hidden="true" className="mt-[0.15em] size-4 shrink-0" strokeWidth={2.5} fill={fill ? 'currentColor' : 'none'} />
      <span className="min-w-0">{children}</span>
    </span>
  )
}
