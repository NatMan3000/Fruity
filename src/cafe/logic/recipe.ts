import type { AusState, Fruit, Month } from '../../types/fruit'
import { isInSeason } from '../../utils/seasonality'
import { traitsOf } from './traits'

// "Make it for real": the bowl becomes a fruit salad recipe a grown-up can make tonight. The
// dressing comes from what the chosen fruits pair with (fruits.ts `pairings`).

interface DressingPart {
  line: string   // ingredient line
  word: string   // name in the dressing title
  role: 'sour' | 'sweet' | 'fresh' | 'top'
}

// Pairings that work in a fruit salad dressing or topping. Keys are matched against `pairings`.
const DRESSING: Record<string, DressingPart> = {
  lime: { line: 'juice of 1 lime', word: 'lime', role: 'sour' },
  lemon: { line: 'juice of half a lemon', word: 'lemon', role: 'sour' },
  orange: { line: 'juice of 1 orange', word: 'orange', role: 'sour' },
  honey: { line: '1 tablespoon honey', word: 'honey', role: 'sweet' },
  vanilla: { line: 'a few drops of vanilla', word: 'vanilla', role: 'sweet' },
  'rose water': { line: 'a few drops of rose water', word: 'rose water', role: 'sweet' },
  mint: { line: 'a small handful of mint leaves, torn', word: 'mint', role: 'fresh' },
  basil: { line: 'a few small basil leaves', word: 'basil', role: 'fresh' },
  ginger: { line: '1 teaspoon finely grated ginger', word: 'ginger', role: 'fresh' },
  cinnamon: { line: 'a pinch of cinnamon', word: 'cinnamon', role: 'fresh' },
  cardamom: { line: 'a pinch of ground cardamom', word: 'cardamom', role: 'fresh' },
  coconut: { line: '2 tablespoons toasted coconut flakes, to serve', word: 'toasted coconut', role: 'top' },
  yogurt: { line: 'natural yoghurt, to serve', word: 'yoghurt', role: 'top' },
  cream: { line: 'whipped cream, to serve', word: 'cream', role: 'top' },
  almond: { line: 'a handful of toasted flaked almonds, to serve', word: 'almonds', role: 'top' },
  pistachios: { line: 'a handful of chopped pistachios, to serve', word: 'pistachios', role: 'top' },
}

const PREP_WORDS: Record<NonNullable<ReturnType<typeof traitsOf>['prep']>, string> = {
  peel: 'Peel',
  skin: 'Cut the skin off',
  hull: 'Hull',
  stone: 'Take the stones out of',
  core: 'Core',
  scoop: 'Scoop out',
  seeds: 'Pick the seeds from',
}

export interface Recipe {
  title: string
  serves: number
  ingredients: { fruitId?: string; line: string }[]
  dressing: string        // "Lime, mint and honey"
  steps: string[]         // always four
  outOfSeason: { fruit: Fruit; swap?: Fruit }[]
}

const listWords = (words: string[]) =>
  words.length <= 1 ? words.join('') : `${words.slice(0, -1).join(', ')} and ${words[words.length - 1]}`

// Up to one sour, one sweet, one fresh and one topping, in order of how many fruits share it.
export function pickDressing(fruits: Fruit[]): DressingPart[] {
  const counts = new Map<string, number>()
  const ids = new Set(fruits.map(f => f.id))
  for (const f of fruits) {
    for (const p of f.pairings ?? []) {
      const key = p.toLowerCase()
      if (!DRESSING[key] || ids.has(key)) continue // lime in the bowl already: no lime juice twice
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
  }
  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  const chosen: DressingPart[] = []
  for (const role of ['sour', 'sweet', 'fresh', 'top'] as const) {
    const hit = ranked.find(([k]) => DRESSING[k].role === role)
    if (hit) chosen.push(DRESSING[hit[0]])
  }
  // Every fruit salad wants something sour and something sweet to bring it together.
  if (!chosen.some(d => d.role === 'sour')) chosen.unshift(ids.has('orange') ? DRESSING.lime : DRESSING.orange)
  if (!chosen.some(d => d.role === 'sweet')) chosen.splice(1, 0, DRESSING.honey)
  return chosen
}

export function buildRecipe(fruits: Fruit[], month: Month, state: AusState, allFruits: Fruit[]): Recipe {
  const dressing = pickDressing(fruits)
  const liquid = dressing.filter(d => d.role !== 'top')
  const tops = dressing.filter(d => d.role === 'top')
  const name = listWords(liquid.map(d => d.word))
  const dressingName = name.charAt(0).toUpperCase() + name.slice(1)

  const preps = new Map<string, string[]>()
  for (const f of fruits) {
    const prep = traitsOf(f.id).prep
    if (!prep) continue
    const list = preps.get(prep) ?? []
    list.push(f.name.toLowerCase())
    preps.set(prep, list)
  }
  const prepLine = [...preps.entries()].map(([p, names]) => `${PREP_WORDS[p as keyof typeof PREP_WORDS]} the ${listWords(names)}.`).join(' ')
  const small = fruits.filter(f => traitsOf(f.id).cut === 'small').map(f => f.name.toLowerCase())

  const steps = [
    `Wash the fruit and pat it dry.${prepLine ? ` ${prepLine}` : ''}`,
    `Cut everything into bite-size pieces, about the size of a grape.${small.length ? ` Leave the ${listWords(small)} whole.` : ''}`,
    `Whisk the ${listWords(liquid.map(d => d.word))} in a small bowl.`,
    `Gently toss the fruit with the dressing and serve within an hour${tops.length ? `, topped with ${listWords(tops.map(d => d.word))}` : ''}.`,
  ]

  const outOfSeason = fruits
    .filter(f => !isInSeason(f, month, state))
    .map(f => {
      const colours = traitsOf(f.id).colours
      const swap = allFruits.find(g =>
        g.id !== f.id && !fruits.some(x => x.id === g.id) && traitsOf(g.id).rawOk &&
        isInSeason(g, month, state) && g.seasonality.peak.length > 0 &&
        traitsOf(g.id).colours.some(c => colours.includes(c)))
      return { fruit: f, swap }
    })

  return {
    title: fruits.length === 1 ? `${fruits[0].name} fruit salad` : 'Our fruit salad',
    serves: 4,
    ingredients: [
      ...fruits.map(f => ({ fruitId: f.id, line: traitsOf(f.id).amount })),
      ...dressing.map(d => ({ line: d.line })),
    ],
    dressing: `${dressingName} dressing`,
    steps,
    outOfSeason,
  }
}
