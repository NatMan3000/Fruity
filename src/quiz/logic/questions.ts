// Question generators for "Guess the fruit". Pure: the fruit list, the month and an Rng go in, a
// question comes out. Every right answer comes straight from src/assets/fruits.ts (seasons, pairings)
// or ./traits.ts (families), and every choice question has exactly one right answer.
import type { Fruit, Month } from '../../types/fruit'
import { MONTHS } from '../../types/fruit'
import { describeMonths, getSeasonality, isInSeason, isPeakSeason, isYearRound, monthOffset } from '../../utils/seasonality'
import { MONTH_NAMES } from '../../utils/months'
import { pick, sample, shuffle, type Rng } from './rng'
import { FAMILY_LIST, FAMILY_ONE, FAMILY_WORD, ODD_AVOID, SAVOURY, UNCUT, familyMembers, familyOf, ingredientEmoji, ingredientLabel, pairsEligible, tierOf, type Family, type Tier } from './traits'

// The round types. inside / silhouette / closeup are the 3D picture rounds; peakMonth and season are
// "Season sense"; pairs and oddOne are the rest.
export type Kind = 'inside' | 'silhouette' | 'closeup' | 'peakMonth' | 'season' | 'pairs' | 'oddOne'
export const KINDS: Kind[] = ['inside', 'silhouette', 'closeup', 'peakMonth', 'season', 'pairs', 'oddOne']
export const PICTURE_KINDS: Kind[] = ['inside', 'silhouette', 'closeup']

// How the 3D stage shows the question's fruit: cut open, as a shadow, close up, or whole (a hero).
export type Look = 'inside' | 'silhouette' | 'closeup' | 'hero'

export interface Choice {
  id: string        // a fruit id, an ingredient, or a month
  label: string
  fruitId?: string  // draw this fruit's sticker
  emoji?: string    // or this picture (ingredients)
}

export interface Question {
  kind: Kind
  tier: Tier
  prompt: string
  subject: string       // the fruit the answer is about: revealed, and listed as missed when wrong
  hero?: string         // the fruit shown on the 3D stage, if any
  look?: Look
  choices: Choice[]
  correct: string[]     // choice ids; exactly one, except peakMonth where every peak month counts
  reveal: string        // one line saying what the answer was and why
}

export interface Ctx {
  fruits: Fruit[]
  month: Month          // "right now" for the season round (the daily's date for the daily)
  rng: Rng
  used: Set<string>     // subjects already asked this game
}

const byId = (fruits: Fruit[], id: string) => fruits.find(f => f.id === id)!
const fruitChoice = (f: Fruit): Choice => ({ id: f.id, label: f.name, fruitId: f.id })
const listAnd = (names: string[]) => names.length < 2 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`
const cap = (s: string) => s[0].toUpperCase() + s.slice(1)
const lower = (f: Fruit) => f.name.toLowerCase()
const aOrAn = (f: Fruit) => `${/^[aeiou]/i.test(f.name) ? 'an' : 'a'} ${lower(f)}`

// The pool for a tier: that tier's fruit first; if none are left, easier ones, then any.
function poolFor(ctx: Ctx, tier: Tier, ok: (f: Fruit) => boolean): Fruit[] {
  const free = ctx.fruits.filter(f => !ctx.used.has(f.id) && ok(f))
  for (const want of [(f: Fruit) => tierOf(f.id) === tier, (f: Fruit) => tierOf(f.id) <= tier, () => true]) {
    const p = free.filter(want)
    if (p.length) return p
  }
  return []
}

// Colour distance, for hard picture rounds: the wrong answers look like the right one.
function colourGap(a: string, b: string): number {
  const n = (h: string) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
  const [x, y] = [n(a), n(b)]
  return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2])
}

function distractors(ctx: Ctx, answer: Fruit, tier: Tier): Fruit[] {
  const others = ctx.fruits.filter(f => f.id !== answer.id)
  if (tier === 3) {
    const near = [...others].sort((a, b) => colourGap(a.colour, answer.colour) - colourGap(b.colour, answer.colour)).slice(0, 6)
    return sample(ctx.rng, near, 3)
  }
  const known = others.filter(f => tierOf(f.id) <= (tier === 1 ? 2 : 3))
  return sample(ctx.rng, known.length >= 3 ? known : others, 3)
}

const PICTURE_PROMPTS: Record<'inside' | 'silhouette' | 'closeup', string> = {
  inside: 'Whose insides are these?',
  silhouette: 'Name that shadow!',
  closeup: 'Up close: whose skin is this?',
}

function picture(kind: 'inside' | 'silhouette' | 'closeup', tier: Tier, ctx: Ctx): Question | null {
  const pool = poolFor(ctx, tier, f => kind !== 'inside' || !UNCUT.has(f.id))
  if (!pool.length) return null
  const answer = pick(ctx.rng, pool)
  return {
    kind,
    tier,
    prompt: PICTURE_PROMPTS[kind],
    subject: answer.id,
    hero: answer.id,
    look: kind,
    choices: shuffle(ctx.rng, [answer, ...distractors(ctx, answer, tier)]).map(fruitChoice),
    correct: [answer.id],
    reveal: `It's ${aOrAn(answer)}!`,
  }
}

// Season sense 1: tap a month on the strip. Fruit with a short peak only, so a guess rarely lands.
function peakMonth(tier: Tier, ctx: Ctx): Question | null {
  const pool = poolFor(ctx, tier, f => !isYearRound(f) && getSeasonality(f).peak.length >= 1 && getSeasonality(f).peak.length <= 4)
  if (!pool.length) return null
  const f = pick(ctx.rng, pool)
  const peak = getSeasonality(f).peak
  return {
    kind: 'peakMonth',
    tier,
    prompt: `Tap a month when ${lower(f)} is at its peak`,
    subject: f.id,
    hero: f.id,
    look: 'hero',
    choices: MONTHS.map(m => ({ id: m, label: m })),
    correct: [...peak],
    reveal: `${f.name} peaks ${describeMonths(peak)}.`,
  }
}

// Season sense 2: four fruit stickers, one NOT in season this month (or one at its peak).
function season(tier: Tier, ctx: Ctx): Question | null {
  const m = ctx.month
  const seasonal = ctx.fruits.filter(f => !isYearRound(f))
  const monthName = MONTH_NAMES[m]
  const variant = ctx.rng() < 0.6 ? 'not' : 'peak'
  if (variant === 'not') {
    // Hard: the odd one is only just out (in season last month or next month).
    const near = (f: Fruit) => isInSeason(f, monthOffset(m, -1)) || isInSeason(f, monthOffset(m, 1))
    let outs = poolFor(ctx, tier, f => !isYearRound(f) && !isInSeason(f, m))
    if (tier === 3 && outs.some(near)) outs = outs.filter(near)
    const ins = seasonal.filter(f => isInSeason(f, m))
    if (!outs.length || ins.length < 3) return null
    const odd = pick(ctx.rng, outs)
    const three = sample(ctx.rng, tier === 1 ? (ins.filter(f => tierOf(f.id) === 1).length >= 3 ? ins.filter(f => tierOf(f.id) === 1) : ins) : ins, 3)
    const { peak, available } = getSeasonality(odd)
    return {
      kind: 'season',
      tier,
      prompt: `Which one is NOT in season in ${monthName}?`,
      subject: odd.id,
      choices: shuffle(ctx.rng, [odd, ...three]).map(fruitChoice),
      correct: [odd.id],
      reveal: `${odd.name} is in season ${describeMonths([...peak, ...available])}, not ${monthName}.`,
    }
  }
  const peaks = poolFor(ctx, tier, f => !isYearRound(f) && isPeakSeason(f, m))
  const notPeak = seasonal.filter(f => !isPeakSeason(f, m))
  if (!peaks.length || notPeak.length < 3) return null
  const star = pick(ctx.rng, peaks)
  // Hard: the others are in season too, just not at their peak.
  const close = notPeak.filter(f => isInSeason(f, m))
  const three = sample(ctx.rng, tier === 3 && close.length >= 3 ? close : notPeak, 3)
  return {
    kind: 'season',
    tier,
    prompt: `Which one is at its peak in ${monthName}?`,
    subject: star.id,
    choices: shuffle(ctx.rng, [star, ...three]).map(fruitChoice),
    correct: [star.id],
    reveal: `${star.name} peaks ${describeMonths(getSeasonality(star).peak)}.`,
  }
}

function pairs(tier: Tier, ctx: Ctx): Question | null {
  const pool = poolFor(ctx, tier, pairsEligible)
  if (!pool.length) return null
  const f = pick(ctx.rng, pool)
  const own = f.pairings!
  const inData = new Set(ctx.fruits.flatMap(x => x.pairings ?? []))
  const wrongPool = SAVOURY.filter(s => inData.has(s) && !own.includes(s))
  if (wrongPool.length < 3) return null
  const right = pick(ctx.rng, own)
  const ingredient = (name: string): Choice => ({ id: name, label: cap(ingredientLabel(name)), emoji: ingredientEmoji(name) })
  const also = own.filter(p => p !== right).slice(0, 2).map(ingredientLabel)
  return {
    kind: 'pairs',
    tier,
    prompt: `What goes best with ${lower(f)}?`,
    subject: f.id,
    hero: f.id,
    look: 'hero',
    choices: shuffle(ctx.rng, [right, ...sample(ctx.rng, wrongPool, 3)]).map(ingredient),
    correct: [right],
    reveal: `${cap(ingredientLabel(right))} goes with ${lower(f)}. So ${also.length > 1 ? 'do' : 'does'} ${listAnd(also)}.`,
  }
}

function oddOne(tier: Tier, ctx: Ctx): Question | null {
  const easy: Family[] = ['citrus', 'berry', 'tropical', 'melon']
  const families = shuffle(ctx.rng, tier === 1 ? easy : FAMILY_LIST)
  for (const family of families) {
    const members = familyMembers(family).map(id => byId(ctx.fruits, id)).filter(Boolean)
    if (members.length < 3) continue
    const avoid = ODD_AVOID[family] ?? []
    const odds = poolFor(ctx, tier, f => {
      const fam = familyOf(f.id)
      return !!fam && fam !== family && !avoid.includes(f.id)
    })
    if (!odds.length) continue
    const odd = pick(ctx.rng, odds)
    const three = sample(ctx.rng, members, 3)
    const oddFamily = familyOf(odd.id)!
    return {
      kind: 'oddOne',
      tier,
      prompt: 'Odd one out! Which one doesn\'t belong?',
      subject: odd.id,
      choices: shuffle(ctx.rng, [odd, ...three]).map(fruitChoice),
      correct: [odd.id],
      reveal: `${cap(listAnd(three.map(lower)))} are ${FAMILY_WORD[family]}. ${odd.name} is ${FAMILY_ONE[oddFamily]}.`,
    }
  }
  return null
}

// One question of a kind at a tier. Falls back to a silhouette (every fruit has one) if the kind has
// nothing left to ask, so a game never comes up short.
export function makeQuestion(kind: Kind, tier: Tier, ctx: Ctx): Question {
  const q =
    kind === 'inside' || kind === 'silhouette' || kind === 'closeup' ? picture(kind, tier, ctx)
      : kind === 'peakMonth' ? peakMonth(tier, ctx)
        : kind === 'season' ? season(tier, ctx)
          : kind === 'pairs' ? pairs(tier, ctx)
            : oddOne(tier, ctx)
  const out = q ?? picture('silhouette', tier, ctx) ?? picture('silhouette', tier, { ...ctx, used: new Set() })!
  ctx.used.add(out.subject)
  return out
}

// The running order of round types: every type once (games of 7 or more), the rest picture rounds,
// never the same type twice in a row, a picture round first (easy and showy), and no month question
// in the first two.
export function planKinds(rng: Rng, count: number): Kind[] {
  const base = count >= KINDS.length ? [...KINDS] : shuffle(rng, KINDS).slice(0, count)
  while (base.length < count) base.push(PICTURE_KINDS[base.length % PICTURE_KINDS.length])
  const ok = (p: Kind[]) =>
    (p[0] === 'silhouette' || p[0] === 'inside') &&
    p.slice(0, 2).every(k => k !== 'peakMonth') &&
    p.every((k, i) => i === 0 || k !== p[i - 1])
  for (let tries = 0; tries < 500; tries++) {
    const p = shuffle(rng, base)
    if (ok(p)) return p
  }
  // Practically unreachable; a fixed, valid order.
  return base.map((_, i) => (['silhouette', 'pairs', 'inside', 'oddOne', 'closeup', 'season', 'silhouette', 'peakMonth', 'inside', 'closeup'] as Kind[])[i % 10])
}

// Difficulty by position (daily, pass the phone): easy first, hard at the end.
export function tierByIndex(index: number, count: number): Tier {
  const t = index / Math.max(1, count)
  return t < 0.3 ? 1 : t < 0.7 ? 2 : 3
}

// Difficulty in quick play: it climbs with the streak, and the last few questions are never the easiest.
export function tierByStreak(streak: number, index: number, count: number): Tier {
  const byStreak = (1 + (streak >= 2 ? 1 : 0) + (streak >= 5 ? 1 : 0)) as Tier
  return Math.max(byStreak, index >= count - 3 ? 2 : 1) as Tier
}

// A whole game dealt up front: the daily (seeded by date) and pass the phone. In pass the phone the
// two players get the same kind at the same tier in each round (`pairsOfTwo`), so it is fair.
export function dealGame(fruits: Fruit[], month: Month, rng: Rng, count: number, pairsOfTwo = false): Question[] {
  const ctx: Ctx = { fruits, month, rng, used: new Set() }
  if (!pairsOfTwo) {
    const plan = planKinds(rng, count)
    return plan.map((k, i) => makeQuestion(k, tierByIndex(i, count), ctx))
  }
  const rounds = Math.ceil(count / 2)
  const plan = planKinds(rng, rounds)
  return plan.flatMap((k, r) => [makeQuestion(k, tierByIndex(r, rounds), ctx), makeQuestion(k, tierByIndex(r, rounds), ctx)]).slice(0, count)
}

export const isRight = (q: Question, choiceId: string | null) => choiceId !== null && q.correct.includes(choiceId)
