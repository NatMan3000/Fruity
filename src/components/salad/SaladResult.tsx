import type { Fruit } from '../../types/fruit'
import type { SaladNutrition } from '../../hooks/useSalad'
import { FruitIcon } from '../FruitIcon'

interface SaladResultProps {
  fruits: Fruit[]
  nutrition: SaladNutrition
  pairingInfo: {
    score: number
    goodPairings: string[]
    warnings: string[]
  }
}

export function SaladResult({ fruits, nutrition, pairingInfo }: SaladResultProps) {
  const scoreLabel =
    pairingInfo.score >= 80 ? 'A perfect combo' :
    pairingInfo.score >= 60 ? 'A great mix' :
    pairingInfo.score >= 40 ? 'An interesting mix' : 'A bold choice'

  return (
    <div className="animate-fade-in flex flex-col gap-4">
      <div className="text-center">
        <h3 className="font-display text-title font-semibold">Your fruit salad</h3>
        <p className="text-small text-ink-2 tabular-nums">{fruits.length} fruit combined</p>
      </div>

      <ul className="flex flex-wrap justify-center gap-2">
        {fruits.map(fruit => (
          <li key={fruit.id} className="inline-flex items-center gap-2 rounded-full bg-card py-1 pr-3 pl-1 text-small text-ink">
            <FruitIcon fruit={fruit} size="sm" />
            {fruit.name}
          </li>
        ))}
      </ul>

      <div className="rounded-card bg-card p-4 text-center">
        <div className="font-display text-title font-semibold">{scoreLabel}</div>
        <div className="text-small text-ink-2 tabular-nums">Compatibility {pairingInfo.score}%</div>
        {pairingInfo.goodPairings.length > 0 && (
          <div className="mt-2 text-small text-season-ink">{pairingInfo.goodPairings[0]}</div>
        )}
      </div>

      <div className="rounded-card bg-card p-4">
        <h4 className="mb-3 text-small font-semibold text-ink">Nutrition, per serving</h4>
        <dl className="grid grid-cols-3 gap-2">
          <div className="flex flex-col gap-0.5 rounded-control bg-tile p-3">
            <dt className="text-caption text-ink-2">Energy</dt>
            <dd className="text-body font-semibold tabular-nums">{Math.round(nutrition.totalCalories)} cal</dd>
          </div>
          <div className="flex flex-col gap-0.5 rounded-control bg-tile p-3">
            <dt className="text-caption text-ink-2">Vitamin C</dt>
            <dd className="text-body font-semibold tabular-nums">{Math.round(nutrition.totalVitaminC)} mg</dd>
          </div>
          <div className="flex flex-col gap-0.5 rounded-control bg-tile p-3">
            <dt className="text-caption text-ink-2">Fibre</dt>
            <dd className="text-body font-semibold tabular-nums">{nutrition.totalFiber.toFixed(1)} g</dd>
          </div>
        </dl>

        {nutrition.highlights.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {nutrition.highlights.slice(0, 4).map((highlight, i) => (
              <li key={i} className="rounded-full bg-season-soft px-2.5 py-1 text-caption text-season-ink">
                {highlight}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
