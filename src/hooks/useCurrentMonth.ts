import { useState, useEffect } from 'react'
import type { Month } from '../types/fruit'
import { MONTHS } from '../types/fruit'

export function useCurrentMonth(): Month {
  const [month, setMonth] = useState<Month>(() => {
    const monthIndex = new Date().getMonth()
    return MONTHS[monthIndex]
  })

  useEffect(() => {
    // Update month at midnight
    const now = new Date()
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    const msUntilMidnight = tomorrow.getTime() - now.getTime()

    const timeout = setTimeout(() => {
      const newMonthIndex = new Date().getMonth()
      setMonth(MONTHS[newMonthIndex])
    }, msUntilMidnight)

    return () => clearTimeout(timeout)
  }, [month])

  return month
}
