import { createContext, useContext } from 'react'
import { AUS_STATES, type AusState } from '../types/fruit'

// The chosen state (stored as 'fruity.state', default VIC). Every season calculation reads it.
export const AusStateContext = createContext<{ state: AusState; setState: (s: AusState) => void }>({
  state: 'VIC',
  setState: () => {},
})

export const useAusState = () => useContext(AusStateContext)

export const isAusState = (v: unknown): v is AusState => AUS_STATES.includes(v as AusState)

export const STATE_NAMES: Record<AusState, string> = {
  VIC: 'Victoria',
  NSW: 'New South Wales',
  ACT: 'Australian Capital Territory',
  QLD: 'Queensland',
  SA: 'South Australia',
  WA: 'Western Australia',
  TAS: 'Tasmania',
  NT: 'Northern Territory',
}
