import type { Month } from '../../types/fruit'
import { FRUITS } from '../../assets/fruits'
import { useSalad } from '../../hooks/useSalad'
import { SaladBowl } from './SaladBowl'
import { FruitPicker } from './FruitPicker'
import { MixButton } from './MixButton'
import { SaladResult } from './SaladResult'

interface FruitSaladPageProps {
  currentMonth: Month
  onBack?: () => void
}

export function FruitSaladPage({ currentMonth, onBack }: FruitSaladPageProps) {
  const {
    selectedIds,
    selectedFruits,
    isMixing,
    hasBeenMixed,
    nutrition,
    pairingInfo,
    toggleFruit,
    startMixing,
    reset
  } = useSalad()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            <span className="mr-2">🥗</span>
            Fruit Salad Maker
          </h2>
          <p className="text-sm text-gray-600">Pick fruits and mix them up!</p>
        </div>
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-lg transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Bowl Section */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
        <SaladBowl
          fruits={selectedFruits}
          isMixing={isMixing}
          hasBeenMixed={hasBeenMixed}
        />
      </div>

      {/* Mix Button */}
      <MixButton
        fruitCount={selectedFruits.length}
        isMixing={isMixing}
        hasBeenMixed={hasBeenMixed}
        onMix={startMixing}
        onReset={reset}
      />

      {/* Results (after mixing) */}
      {hasBeenMixed && (
        <SaladResult
          fruits={selectedFruits}
          nutrition={nutrition}
          pairingInfo={pairingInfo}
        />
      )}

      {/* Fruit Picker (hide when showing results, or always show?) */}
      {!hasBeenMixed && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-sm">
          <FruitPicker
            fruits={FRUITS}
            selectedIds={selectedIds}
            currentMonth={currentMonth}
            onToggle={toggleFruit}
          />
        </div>
      )}

      {/* Quick stats when picking */}
      {!hasBeenMixed && selectedFruits.length > 0 && (
        <div className="flex justify-center gap-4 text-xs text-gray-600">
          <span>🔥 {Math.round(nutrition.totalCalories)} cal</span>
          <span>🍊 {Math.round(nutrition.totalVitaminC)}mg Vit C</span>
          <span>🌾 {nutrition.totalFiber.toFixed(1)}g fiber</span>
        </div>
      )}
    </div>
  )
}
