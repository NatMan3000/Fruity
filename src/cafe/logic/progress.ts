// The kid's progress: stars, stickers and level, saved on the phone (localStorage 'fruity.cafe'). Sound is app-wide (src/audio/sound.ts); an older save's `sound` field is ignored.

export interface CafeProgress {
  v: 1
  stars: number
  served: number
  stickers: string[] // 'fruit:<id>' and 'friend:<customerId>'
}

export const NEW_PROGRESS: CafeProgress = { v: 1, stars: 0, served: 0, stickers: [] }

export function isProgress(v: unknown): v is CafeProgress {
  if (typeof v !== 'object' || v === null) return false
  const p = v as CafeProgress
  return p.v === 1 &&
    Number.isFinite(p.stars) && p.stars >= 0 &&
    Number.isFinite(p.served) && p.served >= 0 &&
    Array.isArray(p.stickers) && p.stickers.every(s => typeof s === 'string')
}

// Stars needed to reach each level (index 0 is level 1).
export const LEVEL_STARS = [0, 5, 13, 24, 38, 55] as const
export const LEVEL_NAMES = ['Kitchen helper', 'Fruit chopper', 'Bowl builder', 'Salad star', 'Head chef', 'Fruit wizard'] as const

export function levelFor(stars: number): number {
  let level = 1
  LEVEL_STARS.forEach((need, i) => { if (stars >= need) level = i + 1 })
  return level
}

// Progress through the current level, 0 to 1 (1 at the top level).
export function levelProgress(stars: number): number {
  const level = levelFor(stars)
  if (level >= LEVEL_STARS.length) return 1
  const from = LEVEL_STARS[level - 1]
  const to = LEVEL_STARS[level]
  return (stars - from) / (to - from)
}

export interface ServeScore {
  stars: 1 | 2 | 3
  matched: true
  chopped: boolean
  stirred: boolean
}

// One star for the right order (serving needs it), one for chopping every fruit, one for a good stir.
export function scoreServe(chopped: boolean, stirred: boolean): ServeScore {
  return { stars: (1 + (chopped ? 1 : 0) + (stirred ? 1 : 0)) as 1 | 2 | 3, matched: true, chopped, stirred }
}

export const STIR_TARGET = Math.PI * 4 // two full circles round the bowl

export const fruitSticker = (id: string) => `fruit:${id}`
export const friendSticker = (id: string) => `friend:${id}`

// Stickers earned by this serve: each fruit the first time it is served, and the customer the
// first time they get three stars.
export function newStickers(progress: CafeProgress, fruitIds: string[], customerId: string, stars: number): string[] {
  const have = new Set(progress.stickers)
  const earned = fruitIds.map(fruitSticker).filter(s => !have.has(s))
  if (stars === 3 && !have.has(friendSticker(customerId))) earned.push(friendSticker(customerId))
  return [...new Set(earned)]
}

export function applyServe(progress: CafeProgress, stars: number, stickers: string[]): CafeProgress {
  return {
    ...progress,
    stars: progress.stars + stars,
    served: progress.served + 1,
    stickers: [...progress.stickers, ...stickers.filter(s => !progress.stickers.includes(s))],
  }
}
