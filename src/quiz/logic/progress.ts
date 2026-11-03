// What the quiz remembers on this phone (localStorage 'fruity.quiz'): personal bests (sound is app-wide, src/audio/sound.ts; an older save's `sound` field is ignored),
// today's daily result (one go per day), the daily streak and the two pass-the-phone names.
import type { DayStreak } from './scoring'

export interface DailyResult { date: string; score: number; correct: number; total: number; stars: number; bestStreak: number }

export interface QuizProgress {
  best: { quick: number; daily: number }
  daily: DailyResult | null
  dayStreak: DayStreak
  names: [string, string]
}

export const PROGRESS_KEY = 'fruity.quiz'

export const NEW_PROGRESS: QuizProgress = {
  best: { quick: 0, daily: 0 },
  daily: null,
  dayStreak: { last: null, days: 0 },
  names: ['', ''],
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null
const num = (v: unknown) => typeof v === 'number' && Number.isFinite(v)

export function isProgress(v: unknown): v is QuizProgress {
  if (!isObj(v)) return false
  const { best, daily, dayStreak, names } = v
  if (!isObj(best) || !num(best.quick) || !num(best.daily)) return false
  if (daily !== null && (!isObj(daily) || typeof daily.date !== 'string' || !num(daily.score))) return false
  if (!isObj(dayStreak) || !num(dayStreak.days) || !(dayStreak.last === null || typeof dayStreak.last === 'string')) return false
  return Array.isArray(names) && names.length === 2 && names.every(n => typeof n === 'string')
}
