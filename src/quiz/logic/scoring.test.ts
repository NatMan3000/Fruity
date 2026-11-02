import { describe, expect, it } from 'vitest'
import { bumpDayStreak, dateKey, liveDayStreak, multiplierFor, scoreAnswer, starsFor, QUESTION_MS } from './scoring'

describe('scoring', () => {
  it('a wrong answer scores nothing and ends the streak', () => {
    expect(scoreAnswer(false, 100, 7)).toMatchObject({ points: 0, streak: 0 })
  })

  it('faster answers score more: 200 instant, 100 at the buzzer', () => {
    expect(scoreAnswer(true, 0, 0).points).toBe(200)
    expect(scoreAnswer(true, QUESTION_MS, 0).points).toBe(100)
    expect(scoreAnswer(true, QUESTION_MS / 2, 0).points).toBe(150)
    expect(scoreAnswer(true, QUESTION_MS * 3, 0).points).toBe(100) // never below the base
  })

  it('the combo multiplies from a streak of 3, 6 and 10', () => {
    expect([0, 1, 2, 3, 5, 6, 9, 10, 20].map(multiplierFor)).toEqual([1, 1, 1, 2, 2, 3, 3, 4, 4])
    expect(scoreAnswer(true, 0, 2)).toMatchObject({ points: 400, streak: 3, multiplier: 2, milestone: 3 })
    expect(scoreAnswer(true, 0, 3).milestone).toBeUndefined()
    expect(scoreAnswer(true, 0, 9)).toMatchObject({ points: 800, milestone: 10 })
  })

  it('stars: 3 for 90 percent, 2 for 60, 1 otherwise', () => {
    expect(starsFor(10, 10)).toBe(3)
    expect(starsFor(9, 10)).toBe(3)
    expect(starsFor(6, 10)).toBe(2)
    expect(starsFor(5, 10)).toBe(1)
    expect(starsFor(0, 10)).toBe(1)
  })

  it('day streak: consecutive days add up, a missed day starts again, the same day counts once', () => {
    let s = bumpDayStreak({ last: null, days: 0 }, '2026-10-31')
    expect(s).toEqual({ last: '2026-10-31', days: 1 })
    s = bumpDayStreak(s, '2026-11-01') // across a month end
    s = bumpDayStreak(s, '2026-11-01')
    expect(s.days).toBe(2)
    expect(liveDayStreak(s, '2026-11-02')).toBe(2)
    expect(liveDayStreak(s, '2026-11-03')).toBe(0)
    expect(bumpDayStreak(s, '2026-11-03')).toEqual({ last: '2026-11-03', days: 1 })
    expect(bumpDayStreak({ last: '2026-12-31', days: 4 }, '2027-01-01').days).toBe(5)
  })

  it('date keys are the local calendar date', () => {
    expect(dateKey(new Date(2026, 10, 2, 23, 59))).toBe('2026-11-02')
    expect(dateKey(new Date(2026, 0, 5, 0, 1))).toBe('2026-01-05')
  })
})
