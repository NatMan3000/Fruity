// Quiz-only tags for the fruit: how well known each one is (difficulty), the everyday family it belongs
// to (odd one out), which 3D models come apart (inside out), and ingredient pictures (pairs).
// Kept here rather than in fruits.ts because only the quiz reads them.
import type { Fruit } from '../../types/fruit'

export type Tier = 1 | 2 | 3

// 1: every kid knows it. 2: most grown-ups do. 3: a challenge. Anything missing counts as 2.
const TIERS: Record<string, Tier> = {
  apple: 1, banana: 1, orange: 1, strawberry: 1, watermelon: 1, lemon: 1, grape: 1, pineapple: 1,
  cherry: 1, kiwifruit: 1, mango: 1, pear: 1, blueberry: 1, coconut: 1, avocado: 1, peach: 1,
  lime: 2, mandarin: 2, nectarine: 2, plum: 2, apricot: 2, raspberry: 2, rockmelon: 2, honeydew: 2,
  grapefruit: 2, pomegranate: 2, passionfruit: 2, lychee: 2, papaya: 2, 'dragon-fruit': 2, starfruit: 2,
  tangelo: 3, persimmon: 3, quince: 3, feijoa: 3, fig: 3, 'custard-apple': 3, mulberry: 3, rhubarb: 3,
}
export const tierOf = (id: string): Tier => TIERS[id] ?? 2

// Everyday (shop-shelf) families. A fruit is in at most one, so an odd one out is never ambiguous.
// Grape, kiwifruit, avocado, fig, persimmon, pomegranate, feijoa and rhubarb belong to none here.
export type Family = 'citrus' | 'stone' | 'berry' | 'melon' | 'tropical' | 'pome'

const FAMILIES: Record<Family, string[]> = {
  citrus: ['orange', 'mandarin', 'grapefruit', 'lemon', 'lime', 'tangelo'],
  stone: ['peach', 'nectarine', 'apricot', 'plum', 'cherry'],
  berry: ['strawberry', 'blueberry', 'raspberry', 'mulberry'],
  melon: ['watermelon', 'rockmelon', 'honeydew'],
  tropical: ['mango', 'pineapple', 'papaya', 'banana', 'coconut', 'dragon-fruit', 'starfruit', 'lychee', 'passionfruit', 'custard-apple'],
  pome: ['apple', 'pear', 'quince'],
}

export const FAMILY_WORD: Record<Family, string> = {
  citrus: 'citrus fruit',
  stone: 'stone fruit',
  berry: 'berries',
  melon: 'melons',
  tropical: 'tropical fruit',
  pome: 'in the apple family',
}

// One of them: "Mango is a tropical fruit."
export const FAMILY_ONE: Record<Family, string> = {
  citrus: 'a citrus fruit',
  stone: 'a stone fruit',
  berry: 'a berry',
  melon: 'a melon',
  tropical: 'a tropical fruit',
  pome: 'in the apple family',
}

// Fruit that would make the odd one out arguable: a mango, lychee, avocado or coconut has a stone too.
export const ODD_AVOID: Partial<Record<Family, string[]>> = {
  stone: ['mango', 'lychee', 'avocado', 'coconut'],
}

export const FAMILY_LIST = Object.keys(FAMILIES) as Family[]
export const familyMembers = (f: Family) => FAMILIES[f]
export function familyOf(id: string): Family | undefined {
  return FAMILY_LIST.find(f => FAMILIES[f].includes(id))
}

// Bunches, berries and stalks that the 3D models do not cut open (src/three/models.ts builds them
// without `cutBody`); they never come up as an inside-out question.
export const UNCUT = new Set(['cherry', 'grape', 'blueberry', 'raspberry', 'mulberry', 'rhubarb'])

// Pairs: the wrong answers come from other fruits' pairings that are firmly savoury, and a fruit is
// only asked about when none of its own pairings are in this list, so the right answer stands out
// and every answer is from the data.
export const SAVOURY = ['garlic', 'eggs', 'soy', 'tomato', 'olive oil', 'fish', 'seafood', 'lamb', 'thyme', 'curry', 'pork', 'ham', 'chicken', 'duck']

export function pairsEligible(fruit: Fruit): boolean {
  const own = fruit.pairings ?? []
  return own.length >= 2 && !own.some(p => SAVOURY.includes(p))
}

const INGREDIENT_EMOJI: Record<string, string> = {
  mint: '🌿', lime: '🍋', vanilla: '🍦', coconut: '🥥', ginger: '🫚', honey: '🍯', almond: '🌰', chocolate: '🍫',
  cinnamon: '🍂', chilli: '🌶️', cream: '🥛', basil: '🌿', yoghurt: '🥣', mango: '🥭', seafood: '🦐', lemon: '🍋',
  walnuts: '🌰', walnut: '🌰', cheese: '🧀', chicken: '🍗', cucumber: '🥒', caramel: '🍮', lamb: '🍖', orange: '🍊',
  apple: '🍎', strawberry: '🍓', 'sticky rice': '🍚', 'feta cheese': '🧀', 'rose water': '🌹', 'white chocolate': '🍫',
  raspberry: '🍓', pistachios: '🥜', 'star anise': '⭐', 'goat cheese': '🧀', pork: '🥓', 'blue cheese': '🧀', nuts: '🥜',
  feta: '🧀', duck: '🦆', soy: '🥢', avocado: '🥑', garlic: '🧄', thyme: '🌱', 'olive oil': '🫒', fish: '🐟', banana: '🍌',
  tomato: '🍅', eggs: '🥚', 'peanut butter': '🥜', ham: '🍖', custard: '🍮', curry: '🍛', pineapple: '🍍', kiwi: '🥝',
  rum: '🍹', port: '🍷', kirsch: '🍒', cardamom: '🫛', balsamic: '🍶', prosciutto: '🥓', burrata: '🧀', cranberry: '🔴',
  'black pepper': '🧂', fennel: '🌿', rosemary: '🌿', coriander: '🌿',
}
export const ingredientEmoji = (name: string) => INGREDIENT_EMOJI[name] ?? '🍴'

// The data keeps its own spelling (it is the id); the quiz shows the Australian word.
const INGREDIENT_LABEL: Record<string, string> = { 'feta cheese': 'feta' }
export const ingredientLabel = (name: string) => INGREDIENT_LABEL[name] ?? name

// A fruit's fun fact for the reveal: the first sentence of its history when that is a short line,
// otherwise its note. Never more than one line's worth on a phone (a few lines at most).
export const FACT_MAX = 160
export function funFact(fruit: Fruit): string {
  const first = (fruit.history ?? '').match(/^.*?[.!?](?=\s|$)/)?.[0]?.trim() ?? ''
  if (first && first.length <= FACT_MAX) return first
  if (fruit.notes) return fruit.notes.endsWith('.') || fruit.notes.endsWith('!') ? fruit.notes : `${fruit.notes}.`
  return first.slice(0, FACT_MAX)
}
