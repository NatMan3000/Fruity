import { CakeSlice, Cookie, CupSoda, EggFried, Salad, Soup, type LucideIcon } from 'lucide-react'
import type { RecipeSuggestion } from '../types/fruit'

const TYPE: Record<RecipeSuggestion['type'], { Icon: LucideIcon; label: string }> = {
  smoothie: { Icon: CupSoda, label: 'Drink' },
  dessert: { Icon: CakeSlice, label: 'Dessert' },
  salad: { Icon: Salad, label: 'Salad' },
  preserve: { Icon: Soup, label: 'Preserve' },
  snack: { Icon: Cookie, label: 'Snack' },
  breakfast: { Icon: EggFried, label: 'Breakfast' },
}

// The one-line recipe ideas (Phase 3 brings full recipes), as cards in the fruit's `bright` tone. Put it
// inside an element carrying the fruit's toneVars.
export function RecipeIdeas({ recipes }: { recipes: RecipeSuggestion[] }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {recipes.map(r => {
        const { Icon, label } = TYPE[r.type]
        return (
          <li key={r.name} className="flex items-start gap-3 rounded-[22px] bg-(--bright) p-4 text-(--ink)">
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-(--deep) text-(--light)">
              <Icon aria-hidden="true" className="size-5" strokeWidth={2.25} />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-caption font-extrabold tracking-[0.06em] text-(--ink-soft) uppercase">{label}</span>
              <span className="text-body leading-snug font-extrabold">{r.name}</span>
              <span className="text-small font-medium text-(--ink-soft)">{r.description}</span>
            </span>
          </li>
        )
      })}
    </ul>
  )
}
