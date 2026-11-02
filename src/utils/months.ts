import type { Month } from '../types/fruit'

export const MONTH_NAMES: Record<Month, string> = {
  Jan: 'January', Feb: 'February', Mar: 'March', Apr: 'April', May: 'May', Jun: 'June',
  Jul: 'July', Aug: 'August', Sep: 'September', Oct: 'October', Nov: 'November', Dec: 'December',
}

// Week of the year, so "Cook this week" changes weekly and both phones show the same picks.
export function weekOfYear(d: Date = new Date()): number {
  const start = new Date(d.getFullYear(), 0, 1)
  return Math.floor((d.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000))
}
