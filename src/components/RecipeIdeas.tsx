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

// The existing one-line recipe ideas (Phase 3 brings full recipes).
export function RecipeIdeas({ recipes }: { recipes: RecipeSuggestion[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {recipes.map(r => {
        const { Icon, label } = TYPE[r.type]
        return (
          <li key={r.name} className="flex items-start gap-3 rounded-card bg-card p-3">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-tile text-ink-2">
              <Icon aria-hidden="true" className="size-5" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                <span className="text-body font-semibold">{r.name}</span>
                <span className="text-caption text-ink-2">{label}</span>
              </span>
              <span className="text-small text-ink-2">{r.description}</span>
            </span>
          </li>
        )
      })}
    </ul>
  )
}
