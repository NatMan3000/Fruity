// Scoring for "Guess the fruit". Pure functions, so the numbers can be tested.
//   A right answer: 100 points plus a speed bonus of up to 100 (all of it for an instant answer, none at
//   the buzzer), times the combo multiplier, rounded to 10.
//   Combo: x2 from a streak of 3, x3 from 6, x4 from 10. A wrong answer or running out of time ends
//   the streak and (in quick play and the daily) costs one of three lives.
export const QUESTION_MS = 15_000
export const LIVES = 3
export const STREAK_MILESTONES = [3, 5, 10] as const

export function multiplierFor(streak: number): number {
  return streak >= 10 ? 4 : streak >= 6 ? 3 : streak >= 3 ? 2 : 1
}

export interface Scored {
  points: number
  streak: number      // the streak after this answer
  multiplier: number  // what this answer was multiplied by
  speedBonus: number  // before the multiplier
  milestone?: number  // a streak milestone just reached
}

export function scoreAnswer(correct: boolean, elapsedMs: number, streakBefore: number): Scored {
  if (!correct) return { points: 0, streak: 0, multiplier: 1, speedBonus: 0 }
  const streak = streakBefore + 1
  const multiplier = multiplierFor(streak)
  const left = Math.max(0, Math.min(1, 1 - elapsedMs / QUESTION_MS))
  const speedBonus = Math.round(100 * left)
  const points = Math.round(((100 + speedBonus) * multiplier) / 10) * 10
  const milestone = (STREAK_MILESTONES as readonly number[]).includes(streak) ? streak : undefined
  return { points, streak, multiplier, speedBonus, milestone }
}

// 1 to 3 stars on the share of questions answered right (out of the whole game, so running out of
// lives early costs stars).
export function starsFor(correct: number, total: number): 1 | 2 | 3 {
  const share = total > 0 ? correct / total : 0
  return share >= 0.9 ? 3 : share >= 0.6 ? 2 : 1
}

// The local calendar date, YYYY-MM-DD (phones are in Melbourne; the daily changes at local midnight).
export function dateKey(d: Date = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

function dayBefore(key: string): string {
  const [y, m, d] = key.split('-').map(Number)
  return dateKey(new Date(y, m - 1, d - 1))
}

export interface DayStreak { last: string | null; days: number }

// Playing the daily on consecutive days builds a streak; missing a day starts again at 1.
export function bumpDayStreak(prev: DayStreak, today: string): DayStreak {
  if (prev.last === today) return prev
  if (prev.last && prev.last === dayBefore(today)) return { last: today, days: prev.days + 1 }
  return { last: today, days: 1 }
}

// The streak as it stands today: still alive if the last daily was today or yesterday.
export function liveDayStreak(s: DayStreak, today: string): number {
  return s.last === today || (s.last !== null && s.last === dayBefore(today)) ? s.days : 0
}
