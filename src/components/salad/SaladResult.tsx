import type { Fruit } from '../../types/fruit'
import type { SaladNutrition } from '../../hooks/useSalad'

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
  const scoreEmoji =
    pairingInfo.score >= 80 ? '🌟' :
    pairingInfo.score >= 60 ? '👍' :
    pairingInfo.score >= 40 ? '🤔' : '😬'

  const scoreLabel =
    pairingInfo.score >= 80 ? 'Perfect Combo!' :
    pairingInfo.score >= 60 ? 'Great Mix!' :
    pairingInfo.score >= 40 ? 'Interesting Mix' : 'Bold Choice!'

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Your Salad Header */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900">Your Fruit Salad!</h3>
        <p className="text-sm text-gray-600">{fruits.length} fruits combined</p>
      </div>

      {/* Fruit Summary */}
      <div className="flex flex-wrap justify-center gap-2">
        {fruits.map(fruit => (
          <span
            key={fruit.id}
            className="inline-flex items-center gap-1 bg-white/80 px-3 py-1.5 rounded-full text-sm shadow-sm"
          >
            <span>{fruit.emoji}</span>
            <span className="text-gray-700">{fruit.name}</span>
          </span>
        ))}
      </div>

      {/* Pairing Score */}
      <div className="bg-white/90 rounded-xl p-4 text-center shadow-sm">
        <div className="text-4xl mb-1">{scoreEmoji}</div>
        <div className="text-lg font-semibold text-gray-900">{scoreLabel}</div>
        <div className="text-sm text-gray-500">Compatibility: {pairingInfo.score}%</div>
        {pairingInfo.goodPairings.length > 0 && (
          <div className="mt-2 text-xs text-emerald-700">
            {pairingInfo.goodPairings[0]}
          </div>
        )}
      </div>

      {/* Nutrition Card */}
      <div className="bg-white/90 rounded-xl p-4 shadow-sm">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span>📊</span> Nutrition (per serving)
        </h4>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-amber-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-amber-600">
              {Math.round(nutrition.totalCalories)}
            </div>
            <div className="text-xs text-gray-600">Calories</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-orange-600">
              {Math.round(nutrition.totalVitaminC)}mg
            </div>
            <div className="text-xs text-gray-600">Vitamin C</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-600">
              {nutrition.totalFiber.toFixed(1)}g
            </div>
            <div className="text-xs text-gray-600">Fiber</div>
          </div>
        </div>

        {/* Nutrition Highlights */}
        {nutrition.highlights.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {nutrition.highlights.slice(0, 4).map((highlight, i) => (
              <span
                key={i}
                className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full"
              >
                {highlight}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
