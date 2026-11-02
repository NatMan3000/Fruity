import type { AusState, Fruit, Month } from '../types/fruit'
import { describeMonths, fruitStatus, getSeasonality, isEnding, isYearRound, type FruitStatus } from './seasonality'

const WORDS: Record<FruitStatus, string> = {
  peak: 'Peak',
  ending: 'Ending soon',
  available: 'In season',
  always: 'All year',
  off: 'Out of season',
}

export const statusWord = (s: FruitStatus) => WORDS[s]

// Screen-reader text for a season bar.
export function seasonLabel(fruit: Fruit, month: Month, state: AusState): string {
  if (isYearRound(fruit, state)) return 'In shops all year.'
  const { peak, available } = getSeasonality(fruit, state)
  const parts = []
  if (peak.length) parts.push(`Peak ${describeMonths(peak)}.`)
  if (available.length) parts.push(`In season ${describeMonths(available)}.`)
  parts.push(`Now, ${month}: ${statusWord(fruitStatus(fruit, month, state)).toLowerCase()}.`)
  return parts.join(' ')
}

// The one-line status on a fruit page, for the chosen state.
export function statusSentence(fruit: Fruit, month: Month, state: AusState): string {
  const { peak, available } = getSeasonality(fruit, state)
  const peakText = describeMonths(peak)
  switch (fruitStatus(fruit, month, state)) {
    case 'always':
      return fruit.yearRound === 'stored' ? 'In shops all year, from cool stores.'
        : fruit.yearRound === 'imported' ? 'In shops all year, mostly imported.'
          : 'In shops all year.'
    case 'peak':
      return isEnding(fruit, month, state)
        ? `At its peak now, and this is its last month. Peak ${peakText}.`
        : `At its peak now. Peak ${peakText}.`
    case 'ending':
      return peak.length ? `Last month in season. Peak was ${peakText}.` : 'Last month in season.'
    case 'available':
      return peak.length ? `In season now. Peak ${peakText}.` : 'In season now.'
    case 'off':
      return peak.length ? `Out of season. Peak ${peakText}.` : `Out of season. In season ${describeMonths(available)}.`
  }
}
