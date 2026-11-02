import type { Month } from '../../types/fruit'
import { FRUITS } from '../../assets/fruits'
import { useSalad } from '../../hooks/useSalad'
import { SaladBowl } from './SaladBowl'
import { FruitPicker } from './FruitPicker'
import { MixButton } from './MixButton'
import { SaladResult } from './SaladResult'

// Restyled to the design tokens in Phase 2; Phase 4 reworks the salad maker itself.
export function FruitSaladPage({ currentMonth }: { currentMonth: Month }) {
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
    <div className="flex flex-col gap-4">
      <p className="text-body text-ink-2">Pick fruit and mix them up.</p>

      {/* Bowl: side padding leaves room for the spoon and fork drawn outside it */}
      <div className="rounded-card bg-card px-10 py-6">
        <SaladBowl
          fruits={selectedFruits}
          isMixing={isMixing}
          hasBeenMixed={hasBeenMixed}
        />
      </div>

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

      {/* Fruit picker */}
      {!hasBeenMixed && (
        <div className="rounded-card bg-card p-4">
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
        <p className="text-center text-caption text-ink-2 tabular-nums">
          {Math.round(nutrition.totalCalories)} cal, {Math.round(nutrition.totalVitaminC)} mg vitamin C, {nutrition.totalFiber.toFixed(1)} g fibre
        </p>
      )}
    </div>
  )
}
