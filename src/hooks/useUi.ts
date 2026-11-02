import { createContext, useContext } from 'react'

// Shell-level sheets any screen can open.
export const UiContext = createContext<{ openBag: () => void }>({
  openBag: () => {},
})

export const useUi = () => useContext(UiContext)
