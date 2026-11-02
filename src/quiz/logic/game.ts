// The game itself as plain state and pure steps (start, answer, next), shared by the three modes:
//   quick  one player, three lives, questions made one at a time so the difficulty follows the streak
//   daily  one player, three lives, the day's questions dealt from the date (same on every phone)
//   pass   two players take turns on one phone, no lives, the same kind of question each round
import type { Fruit, Month } from '../../types/fruit'
import { dealGame, isRight, makeQuestion, planKinds, tierByStreak, type Kind, type Question } from './questions'
import { hashString, mulberry32, type Rng } from './rng'
import { LIVES, scoreAnswer, type Scored } from './scoring'

export type Mode = 'quick' | 'daily' | 'pass'

export const QUESTIONS: Record<Mode, number> = { quick: 10, daily: 8, pass: 12 }

export interface Player {
  name: string
  score: number
  streak: number
  bestStreak: number
  correct: number
  answered: number
  lives: number | null  // null: no lives (pass the phone)
  missed: string[]      // fruit ids, in order
}

export interface Answered extends Scored {
  choice: string | null // null: time ran out
  correct: boolean
}

export interface GameState {
  mode: Mode
  total: number
  plan: Kind[]
  questions: Question[] // asked so far plus the current one (quick play), or all of them (dealt)
  index: number
  players: Player[]
  phase: 'asking' | 'answered' | 'handoff' | 'done'
  last: Answered | null
  date?: string         // the daily's date
}

const newPlayer = (name: string, lives: number | null): Player => ({ name, score: 0, streak: 0, bestStreak: 0, correct: 0, answered: 0, lives, missed: [] })

export interface Setup {
  mode: Mode
  fruits: Fruit[]
  month: Month
  rng: Rng
  names?: [string, string]
  date?: string
}

// The daily's random source: the same for everyone on the same date.
export const dailyRng = (date: string) => mulberry32(hashString(`fruity-daily-${date}`))

export function startGame({ mode, fruits, month, rng, names, date }: Setup): GameState {
  const total = QUESTIONS[mode]
  const players = mode === 'pass'
    ? [newPlayer(names?.[0] || 'Player 1', null), newPlayer(names?.[1] || 'Player 2', null)]
    : [newPlayer('You', LIVES)]
  if (mode === 'quick') {
    const plan = planKinds(rng, total)
    const first = makeQuestion(plan[0], tierByStreak(0, 0, total), { fruits, month, rng, used: new Set() })
    return { mode, total, plan, questions: [first], index: 0, players, phase: 'asking', last: null }
  }
  const questions = dealGame(fruits, month, rng, total, mode === 'pass')
  return { mode, total, plan: questions.map(q => q.kind), questions, index: 0, players, phase: mode === 'pass' ? 'handoff' : 'asking', last: null, date }
}

export const current = (s: GameState) => s.questions[s.index]
export const turnOf = (s: GameState, index = s.index) => (s.mode === 'pass' ? index % 2 : 0)
export const activePlayer = (s: GameState) => s.players[turnOf(s)]

// Answer the current question (choice null = time ran out). elapsedMs is how long it took.
export function answer(s: GameState, choice: string | null, elapsedMs: number): GameState {
  if (s.phase !== 'asking') return s
  const q = current(s)
  const ok = isRight(q, choice)
  const p = activePlayer(s)
  const scored = scoreAnswer(ok, elapsedMs, p.streak)
  const next: Player = {
    ...p,
    score: p.score + scored.points,
    streak: scored.streak,
    bestStreak: Math.max(p.bestStreak, scored.streak),
    correct: p.correct + (ok ? 1 : 0),
    answered: p.answered + 1,
    lives: p.lives === null ? null : ok ? p.lives : p.lives - 1,
    missed: ok ? p.missed : [...p.missed, q.subject],
  }
  const players = s.players.map((pl, i) => (i === turnOf(s) ? next : pl))
  return { ...s, players, phase: 'answered', last: { ...scored, choice, correct: ok } }
}

export const isOver = (s: GameState) =>
  s.index + 1 >= s.total || s.players.some(p => p.lives !== null && p.lives <= 0)

// Move on: the next question (made now in quick play, at the tier the streak has earned), a hand-over
// screen in pass the phone, or the end.
export function advance(s: GameState, fruits: Fruit[], month: Month, rng: Rng): GameState {
  if (s.phase === 'handoff') return { ...s, phase: 'asking' }
  if (s.phase !== 'answered') return s
  if (isOver(s)) return { ...s, phase: 'done' }
  const index = s.index + 1
  let questions = s.questions
  if (s.mode === 'quick' && questions.length <= index) {
    const used = new Set(questions.map(q => q.subject))
    const q = makeQuestion(s.plan[index], tierByStreak(s.players[0].streak, index, s.total), { fruits, month, rng, used })
    questions = [...questions, q]
  }
  return { ...s, questions, index, phase: s.mode === 'pass' ? 'handoff' : 'asking', last: null }
}

// Pass the phone: who won (null on a draw).
export function winner(s: GameState): Player | null {
  const [a, b] = s.players
  if (!b || a.score === b.score) return null
  return a.score > b.score ? a : b
}
