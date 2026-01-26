import { useState, useMemo, useCallback } from 'react'
import type { Fruit } from '../types/fruit'
import { FRUITS } from '../assets/fruits'

export interface SaladState {
  selectedIds: string[]
  isMixing: boolean
  hasBeenMixed: boolean
}

export interface SaladNutrition {
  totalCalories: number
  totalVitaminC: number
  totalFiber: number
  highlights: string[]
}

export function useSalad() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isMixing, setIsMixing] = useState(false)
  const [hasBeenMixed, setHasBeenMixed] = useState(false)

  // Get selected fruits
  const selectedFruits = useMemo(() => {
    return selectedIds
      .map(id => FRUITS.find(f => f.id === id))
      .filter((f): f is Fruit => f !== undefined)
  }, [selectedIds])

  // Calculate total nutrition
  const nutrition = useMemo((): SaladNutrition => {
    const totals = selectedFruits.reduce(
      (acc, fruit) => {
        if (fruit.nutrition) {
          acc.totalCalories += fruit.nutrition.calories
          acc.totalVitaminC += fruit.nutrition.vitaminC || 0
          acc.totalFiber += fruit.nutrition.fiber || 0
          fruit.nutrition.highlights.forEach(h => {
            if (!acc.highlights.includes(h)) {
              acc.highlights.push(h)
            }
          })
        }
        return acc
      },
      { totalCalories: 0, totalVitaminC: 0, totalFiber: 0, highlights: [] as string[] }
    )
    return totals
  }, [selectedFruits])

  // Calculate pairing score (how well the fruits go together)
  const pairingInfo = useMemo(() => {
    if (selectedFruits.length < 2) {
      return { score: 100, goodPairings: [], warnings: [] }
    }

    const goodPairings: string[] = []
    const warnings: string[] = []

    // Check pairings between all selected fruits
    for (let i = 0; i < selectedFruits.length; i++) {
      for (let j = i + 1; j < selectedFruits.length; j++) {
        const fruit1 = selectedFruits[i]
        const fruit2 = selectedFruits[j]

        // Check if fruit1's pairings mention fruit2's flavor profile
        const fruit1Pairings = fruit1.pairings || []
        const fruit2Pairings = fruit2.pairings || []

        // Simple compatibility: if they share pairings, they go well together
        const sharedPairings = fruit1Pairings.filter(p => fruit2Pairings.includes(p))
        if (sharedPairings.length > 0) {
          goodPairings.push(`${fruit1.name} + ${fruit2.name} (both pair with ${sharedPairings[0]})`)
        }
      }
    }

    // Score based on how many good pairings vs total possible
    const totalPairs = (selectedFruits.length * (selectedFruits.length - 1)) / 2
    const score = totalPairs > 0 ? Math.min(100, Math.round((goodPairings.length / totalPairs) * 100 + 50)) : 100

    return { score, goodPairings, warnings }
  }, [selectedFruits])

  const addFruit = useCallback((id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev
      return [...prev, id]
    })
    // Reset mixed state when adding fruits
    setHasBeenMixed(false)
  }, [])

  const removeFruit = useCallback((id: string) => {
    setSelectedIds(prev => prev.filter(i => i !== id))
    setHasBeenMixed(false)
  }, [])

  const toggleFruit = useCallback((id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id)
      }
      return [...prev, id]
    })
    setHasBeenMixed(false)
  }, [])

  const startMixing = useCallback(() => {
    if (selectedFruits.length < 2) return

    setIsMixing(true)
    // Animation duration
    setTimeout(() => {
      setIsMixing(false)
      setHasBeenMixed(true)
    }, 2500)
  }, [selectedFruits.length])

  const reset = useCallback(() => {
    setSelectedIds([])
    setIsMixing(false)
    setHasBeenMixed(false)
  }, [])

  return {
    selectedIds,
    selectedFruits,
    isMixing,
    hasBeenMixed,
    nutrition,
    pairingInfo,
    addFruit,
    removeFruit,
    toggleFruit,
    startMixing,
    reset
  }
}
