import { describe, expect, it } from 'vitest'
import { FRUITS } from '../../assets/fruits'
import { MONTHS, type Month } from '../../types/fruit'
import { getSeasonality, isInSeason, isPeakSeason } from '../../utils/seasonality'
import { advance, answer, current, dailyRng, startGame, winner, type GameState } from './game'
import { dealGame, makeQuestion, planKinds, KINDS, PICTURE_KINDS, type Kind, type Question } from './questions'
import { mulberry32 } from './rng'
import { FACT_MAX, UNCUT, familyOf, funFact, pairsEligible } from './traits'
import type { Tier } from './traits'

const byId = (id: string) => FRUITS.find(f => f.id === id)!
const DASHES = /[‐-―−]/

// Every rule a question must keep, whatever its kind.
function checkQuestion(q: Question, month: Month) {
  const ids = q.choices.map(c => c.id)
  expect(new Set(ids).size).toBe(ids.length)
  expect(q.correct.every(c => ids.includes(c))).toBe(true)
  expect(`${q.prompt} ${q.reveal}`).not.toMatch(DASHES)
  expect(`${q.prompt} ${q.reveal}`).not.toMatch(/\bAI\b/)
  const subject = byId(q.subject)
  expect(subject).toBeTruthy()

  if (q.kind === 'peakMonth') {
    expect(ids).toEqual(MONTHS)
    expect([...q.correct].sort()).toEqual([...getSeasonality(subject).peak].sort())
    expect(q.correct.length).toBeGreaterThan(0)
    return
  }
  expect(q.choices).toHaveLength(4)
  expect(q.correct).toHaveLength(1) // exactly one right answer
  const right = q.correct[0]
  const choiceFruit = q.choices.filter(c => c.fruitId).map(c => byId(c.fruitId!))

  switch (q.kind) {
    case 'inside':
    case 'silhouette':
    case 'closeup':
      expect(right).toBe(q.subject)
      expect(q.hero).toBe(q.subject)
      if (q.kind === 'inside') expect(UNCUT.has(q.subject)).toBe(false)
      break
    case 'season': {
      expect(right).toBe(q.subject)
      if (q.prompt.includes('NOT')) {
        expect(isInSeason(subject, month)).toBe(false)
        choiceFruit.filter(f => f.id !== right).forEach(f => expect(isInSeason(f, month)).toBe(true))
      } else {
        expect(isPeakSeason(subject, month)).toBe(true)
        choiceFruit.filter(f => f.id !== right).forEach(f => expect(isPeakSeason(f, month)).toBe(false))
      }
      break
    }
    case 'pairs': {
      expect(pairsEligible(subject)).toBe(true)
      expect(subject.pairings).toContain(right)
      const everyPairing = new Set(FRUITS.flatMap(f => f.pairings ?? []))
      ids.forEach(id => expect(everyPairing.has(id)).toBe(true)) // every answer comes from the data
      ids.filter(id => id !== right).forEach(id => expect(subject.pairings).not.toContain(id))
      break
    }
    case 'oddOne': {
      expect(right).toBe(q.subject)
      const rest = choiceFruit.filter(f => f.id !== right).map(f => familyOf(f.id))
      expect(new Set(rest).size).toBe(1)
      expect(rest[0]).toBeTruthy()
      expect(familyOf(right)).not.toBe(rest[0])
      break
    }
  }
}

describe('question generators', () => {
  it('every kind at every tier, in every month, keeps the rules (500 deals)', () => {
    let n = 0
    for (let seed = 1; seed <= 500; seed++) {
      const rng = mulberry32(seed)
      const month = MONTHS[seed % 12]
      const kind = KINDS[seed % KINDS.length]
      const tier = ((seed % 3) + 1) as Tier
      const q = makeQuestion(kind, tier, { fruits: FRUITS, month, rng, used: new Set() })
      checkQuestion(q, month)
      if (q.kind === kind) n++
    }
    expect(n).toBeGreaterThan(450) // the silhouette fallback is rare
  })

  it('no fruit is the subject twice in a game, and every game is valid', () => {
    for (let seed = 1; seed <= 200; seed++) {
      const month = MONTHS[seed % 12]
      const qs = dealGame(FRUITS, month, mulberry32(seed), 12, seed % 2 === 0)
      expect(qs).toHaveLength(12)
      expect(new Set(qs.map(q => q.subject)).size).toBe(qs.length)
      qs.forEach(q => checkQuestion(q, month))
    }
  })

  it('plans mix the round types: all of them, a picture round first, no repeats in a row', () => {
    for (let seed = 1; seed <= 200; seed++) {
      const plan = planKinds(mulberry32(seed), 10)
      expect(new Set(plan)).toEqual(new Set(KINDS))
      expect(['silhouette', 'inside']).toContain(plan[0])
      plan.forEach((k, i) => i > 0 && expect(k).not.toBe(plan[i - 1]))
      expect(plan.slice(0, 2)).not.toContain('peakMonth')
      expect(plan.filter(k => PICTURE_KINDS.includes(k)).length).toBeGreaterThanOrEqual(5)
    }
  })

  it('the daily is the same for the same date and different on another day', () => {
    const deal = (date: string) => dealGame(FRUITS, 'Nov', dailyRng(date), 8)
    expect(deal('2026-11-02')).toEqual(deal('2026-11-02'))
    expect(JSON.stringify(deal('2026-11-03'))).not.toBe(JSON.stringify(deal('2026-11-02')))
    const a = startGame({ mode: 'daily', fruits: FRUITS, month: 'Nov', rng: dailyRng('2026-11-02'), date: '2026-11-02' })
    const b = startGame({ mode: 'daily', fruits: FRUITS, month: 'Nov', rng: dailyRng('2026-11-02'), date: '2026-11-02' })
    expect(a.questions).toEqual(b.questions)
  })

  it('pass the phone gives both players the same kind of question each round', () => {
    const qs = dealGame(FRUITS, 'Jul', mulberry32(7), 12, true)
    for (let r = 0; r < 6; r++) expect(qs[2 * r].kind).toBe(qs[2 * r + 1].kind)
  })

  it('every fruit has a short fun fact without long dashes', () => {
    FRUITS.forEach(f => {
      const fact = funFact(f)
      expect(fact.length).toBeGreaterThan(10)
      expect(fact.length).toBeLessThanOrEqual(FACT_MAX)
      expect(fact).not.toMatch(DASHES)
    })
  })
})

describe('game flow', () => {
  const play = (s: GameState, pickRight: boolean, rng = mulberry32(3)) => {
    const q = current(s)
    const wrong = q.choices.find(c => !q.correct.includes(c.id))!.id
    const next = answer(s, pickRight ? q.correct[0] : wrong, 1000)
    return advance(next, FRUITS, 'Nov', rng)
  }

  it('three wrong answers end a quick game early', () => {
    let s = startGame({ mode: 'quick', fruits: FRUITS, month: 'Nov', rng: mulberry32(1) })
    s = play(s, true)
    s = play(s, false)
    s = play(s, false)
    expect(s.phase).toBe('asking')
    s = play(s, false)
    expect(s.phase).toBe('done')
    expect(s.players[0].lives).toBe(0)
    expect(s.players[0].missed).toHaveLength(3)
  })

  it('quick play makes questions as it goes, without repeating a fruit, harder as the streak grows', () => {
    let s = startGame({ mode: 'quick', fruits: FRUITS, month: 'Nov', rng: mulberry32(9) })
    while (s.phase !== 'done') s = play(s, true)
    expect(s.questions).toHaveLength(10)
    expect(new Set(s.questions.map(q => q.subject)).size).toBe(10)
    expect(s.questions[0].tier).toBe(1)
    expect(s.questions[9].tier).toBe(3)
    expect(s.players[0].bestStreak).toBe(10)
  })

  it('pass the phone alternates players, hands over between turns and names a winner', () => {
    let s = startGame({ mode: 'pass', fruits: FRUITS, month: 'Nov', rng: mulberry32(5), names: ['Nathan', 'Sam'] })
    expect(s.phase).toBe('handoff')
    let turn = 0
    while (s.phase !== 'done') {
      if (s.phase === 'handoff') { s = advance(s, FRUITS, 'Nov', mulberry32(1)); continue }
      s = play(s, turn % 2 === 0) // Nathan always right, Sam always wrong
      turn++
    }
    expect(turn).toBe(12)
    expect(s.players[0].answered).toBe(6)
    expect(s.players[1].answered).toBe(6)
    expect(winner(s)?.name).toBe('Nathan')
  })

  it('a timeout counts as wrong', () => {
    const s = startGame({ mode: 'quick', fruits: FRUITS, month: 'Nov', rng: mulberry32(2) })
    const t = answer(s, null, 15000)
    expect(t.last?.correct).toBe(false)
    expect(t.players[0].lives).toBe(2)
  })
})

// Guard for the kinds list itself.
it('kinds are the seven round types', () => {
  expect(KINDS satisfies Kind[]).toHaveLength(7)
})
