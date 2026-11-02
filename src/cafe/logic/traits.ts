// Game facts about each fruit, the way a kid would describe it: what colour it is, what shape,
// which family it belongs to, whether it has pips or a stone, and how it looks once chopped.
// Kept beside the game (not in fruits.ts) because only the cafe uses it. Every fruit in
// src/assets/fruits.ts must have an entry; traits.test.ts checks that.

export type ColourFamily = 'red' | 'orange' | 'yellow' | 'green' | 'purple' | 'pink' | 'blue' | 'brown'
export type Shape = 'round' | 'long' | 'small' | 'big'
export type Group = 'berry' | 'citrus' | 'tropical' | 'stonefruit' | 'melon'

// How the fruit looks in the bowl. 'small' fruit drop in as bite-size pieces and never need chopping.
export type Cut = 'cube' | 'disc' | 'star' | 'wedge' | 'half' | 'small' | 'seeds'
// The whole fruit's 3D outline before it is chopped.
export type Body = 'ball' | 'oval' | 'long' | 'pear' | 'cone' | 'star' | 'stalk' | 'pineapple'

export interface FruitTraits {
  colours: ColourFamily[]
  shapes: Shape[]
  groups: Group[]
  pips: boolean      // pips or seeds you pick out or spit out (apple, citrus, grape, watermelon)
  stone: boolean     // one big stone or seed in the middle (peach, cherry, mango, avocado)
  rawOk: boolean     // false: needs cooking before it goes in a fruit salad (quince, rhubarb)
  cut: Cut
  body: Body
  size: number       // whole fruit radius in bowl units
  skin?: string      // whole fruit colour when it differs from `fruit.colour`
  flesh?: string     // chopped piece colour when it differs from `fruit.colour`
  sour?: boolean     // the bowl puckers up
  amount: string     // for the recipe card, serves 4
  prep?: 'peel' | 'skin' | 'hull' | 'stone' | 'core' | 'scoop' | 'seeds'
  say?: string       // how a customer asks for it, when "a <name>" sounds wrong
}

export const TRAITS: Record<string, FruitTraits> = {
  mango: { colours: ['orange', 'yellow'], shapes: [], groups: ['tropical'], pips: false, stone: true, rawOk: true, cut: 'cube', body: 'oval', size: 0.34, flesh: '#FFB627', amount: '2 mangoes', prep: 'peel' },
  watermelon: { colours: ['red', 'green'], shapes: ['big', 'round'], groups: ['melon'], pips: true, stone: false, rawOk: true, cut: 'cube', body: 'oval', size: 0.5, skin: '#3E8E41', amount: 'a quarter of a small watermelon', prep: 'skin', say: 'some watermelon' },
  rockmelon: { colours: ['orange'], shapes: ['big', 'round'], groups: ['melon'], pips: false, stone: false, rawOk: true, cut: 'cube', body: 'ball', size: 0.46, skin: '#D8C08A', amount: 'half a rockmelon', prep: 'skin', say: 'some rockmelon' },
  honeydew: { colours: ['green'], shapes: ['big', 'round'], groups: ['melon'], pips: false, stone: false, rawOk: true, cut: 'cube', body: 'ball', size: 0.46, skin: '#E3E8A8', amount: 'half a honeydew', prep: 'skin', say: 'some honeydew' },
  lychee: { colours: ['red', 'pink'], shapes: ['small', 'round'], groups: ['tropical'], pips: false, stone: true, rawOk: true, cut: 'small', body: 'ball', size: 0.13, flesh: '#F6EFE3', amount: '12 lychees', prep: 'peel', say: 'some lychees' },
  passionfruit: { colours: ['purple'], shapes: ['round'], groups: ['tropical'], pips: false, stone: false, rawOk: true, cut: 'half', body: 'ball', size: 0.22, flesh: '#F2C230', amount: '3 passionfruit', prep: 'scoop' },
  cherry: { colours: ['red'], shapes: ['small', 'round'], groups: ['stonefruit'], pips: false, stone: true, rawOk: true, cut: 'small', body: 'ball', size: 0.12, amount: '1 cup cherries', prep: 'stone', say: 'some cherries' },
  blueberry: { colours: ['blue', 'purple'], shapes: ['small', 'round'], groups: ['berry'], pips: false, stone: false, rawOk: true, cut: 'small', body: 'ball', size: 0.09, amount: '1 punnet (125 g) blueberries', say: 'some blueberries' },
  nectarine: { colours: ['orange', 'red'], shapes: ['round'], groups: ['stonefruit'], pips: false, stone: true, rawOk: true, cut: 'wedge', body: 'ball', size: 0.28, flesh: '#FFB15C', amount: '2 nectarines', prep: 'stone' },
  peach: { colours: ['orange', 'pink'], shapes: ['round'], groups: ['stonefruit'], pips: false, stone: true, rawOk: true, cut: 'wedge', body: 'ball', size: 0.29, flesh: '#FFC38A', amount: '2 peaches', prep: 'stone' },
  apricot: { colours: ['orange'], shapes: ['round'], groups: ['stonefruit'], pips: false, stone: true, rawOk: true, cut: 'half', body: 'ball', size: 0.2, amount: '4 apricots', prep: 'stone', say: 'an apricot' },
  plum: { colours: ['purple', 'red'], shapes: ['round'], groups: ['stonefruit'], pips: false, stone: true, rawOk: true, cut: 'wedge', body: 'ball', size: 0.24, flesh: '#E8A23A', amount: '3 plums', prep: 'stone' },
  fig: { colours: ['purple'], shapes: [], groups: [], pips: false, stone: false, rawOk: true, cut: 'wedge', body: 'pear', size: 0.24, flesh: '#E0607A', amount: '4 figs' },
  apple: { colours: ['red', 'green'], shapes: ['round'], groups: [], pips: true, stone: false, rawOk: true, cut: 'wedge', body: 'ball', size: 0.3, flesh: '#FFF1C9', amount: '1 crisp apple', prep: 'core', say: 'an apple' },
  pear: { colours: ['green', 'yellow'], shapes: [], groups: [], pips: true, stone: false, rawOk: true, cut: 'wedge', body: 'pear', size: 0.3, flesh: '#F4F0C8', amount: '1 ripe pear', prep: 'core' },
  grape: { colours: ['purple', 'green'], shapes: ['small', 'round'], groups: [], pips: true, stone: false, rawOk: true, cut: 'small', body: 'ball', size: 0.1, amount: '1 cup grapes', say: 'some grapes' },
  persimmon: { colours: ['orange'], shapes: ['round'], groups: [], pips: false, stone: false, rawOk: true, cut: 'wedge', body: 'ball', size: 0.3, amount: '2 crisp persimmons' },
  quince: { colours: ['yellow'], shapes: [], groups: [], pips: true, stone: false, rawOk: false, cut: 'wedge', body: 'pear', size: 0.32, amount: '1 quince, poached', prep: 'core' },
  pomegranate: { colours: ['red'], shapes: ['round'], groups: [], pips: false, stone: false, rawOk: true, cut: 'seeds', body: 'ball', size: 0.32, flesh: '#D81E4A', amount: 'seeds of half a pomegranate', prep: 'seeds' },
  feijoa: { colours: ['green'], shapes: [], groups: [], pips: false, stone: false, rawOk: true, cut: 'disc', body: 'oval', size: 0.22, flesh: '#EDEBC4', amount: '4 feijoas', prep: 'scoop' },
  orange: { colours: ['orange'], shapes: ['round'], groups: ['citrus'], pips: true, stone: false, rawOk: true, cut: 'disc', body: 'ball', size: 0.32, amount: '2 oranges', prep: 'peel', say: 'an orange' },
  mandarin: { colours: ['orange'], shapes: ['round'], groups: ['citrus'], pips: true, stone: false, rawOk: true, cut: 'wedge', body: 'ball', size: 0.25, amount: '2 mandarins', prep: 'peel' },
  grapefruit: { colours: ['pink', 'orange'], shapes: ['round'], groups: ['citrus'], pips: true, stone: false, rawOk: true, cut: 'wedge', body: 'ball', size: 0.38, flesh: '#FF8A7A', amount: '1 grapefruit', prep: 'peel', sour: true },
  lemon: { colours: ['yellow'], shapes: [], groups: ['citrus'], pips: true, stone: false, rawOk: true, cut: 'disc', body: 'oval', size: 0.26, amount: 'juice of half a lemon', sour: true },
  lime: { colours: ['green'], shapes: ['round'], groups: ['citrus'], pips: true, stone: false, rawOk: true, cut: 'disc', body: 'ball', size: 0.22, amount: 'juice of 1 lime', sour: true },
  kiwifruit: { colours: ['green', 'brown'], shapes: [], groups: [], pips: false, stone: false, rawOk: true, cut: 'disc', body: 'oval', size: 0.24, skin: '#8B6A3E', flesh: '#8DC63F', amount: '3 kiwifruit', prep: 'peel', say: 'a kiwifruit' },
  avocado: { colours: ['green'], shapes: [], groups: [], pips: false, stone: true, rawOk: true, cut: 'cube', body: 'pear', size: 0.3, skin: '#3B5323', flesh: '#C9DE7A', amount: '1 avocado', prep: 'stone', say: 'an avocado' },
  'custard-apple': { colours: ['green'], shapes: ['round'], groups: ['tropical'], pips: true, stone: false, rawOk: true, cut: 'cube', body: 'ball', size: 0.34, flesh: '#F4F0E2', amount: 'half a custard apple', prep: 'seeds', say: 'a custard apple' },
  tangelo: { colours: ['orange'], shapes: ['round'], groups: ['citrus'], pips: true, stone: false, rawOk: true, cut: 'wedge', body: 'ball', size: 0.3, amount: '2 tangelos', prep: 'peel' },
  strawberry: { colours: ['red'], shapes: ['small'], groups: ['berry'], pips: false, stone: false, rawOk: true, cut: 'half', body: 'cone', size: 0.2, amount: '1 punnet (250 g) strawberries', prep: 'hull', say: 'some strawberries' },
  raspberry: { colours: ['red', 'pink'], shapes: ['small'], groups: ['berry'], pips: false, stone: false, rawOk: true, cut: 'small', body: 'ball', size: 0.1, amount: '1 punnet (125 g) raspberries', say: 'some raspberries' },
  banana: { colours: ['yellow'], shapes: ['long'], groups: ['tropical'], pips: false, stone: false, rawOk: true, cut: 'disc', body: 'long', size: 0.3, flesh: '#FFF1A8', amount: '2 bananas', prep: 'peel' },
  pineapple: { colours: ['yellow'], shapes: ['big'], groups: ['tropical'], pips: false, stone: false, rawOk: true, cut: 'cube', body: 'pineapple', size: 0.42, skin: '#D9A21B', flesh: '#FFE066', amount: 'a quarter of a pineapple', prep: 'skin', say: 'some pineapple' },
  papaya: { colours: ['orange'], shapes: ['long'], groups: ['tropical'], pips: false, stone: false, rawOk: true, cut: 'cube', body: 'oval', size: 0.36, amount: 'half a small papaya', prep: 'scoop', say: 'some papaya' },
  rhubarb: { colours: ['pink', 'red'], shapes: ['long'], groups: [], pips: false, stone: false, rawOk: false, cut: 'disc', body: 'stalk', size: 0.3, amount: '2 stalks rhubarb, stewed', sour: true, say: 'some rhubarb' },
  mulberry: { colours: ['purple'], shapes: ['small'], groups: ['berry'], pips: false, stone: false, rawOk: true, cut: 'small', body: 'oval', size: 0.1, amount: '1 cup mulberries', say: 'some mulberries' },
  coconut: { colours: ['brown'], shapes: ['big', 'round'], groups: ['tropical'], pips: false, stone: false, rawOk: true, cut: 'cube', body: 'ball', size: 0.38, flesh: '#F7F3EA', amount: '2 tbsp shaved coconut', say: 'some coconut' },
  'dragon-fruit': { colours: ['pink'], shapes: [], groups: ['tropical'], pips: false, stone: false, rawOk: true, cut: 'cube', body: 'oval', size: 0.32, flesh: '#F4EEF2', amount: '1 dragon fruit', prep: 'peel', say: 'a dragon fruit' },
  starfruit: { colours: ['yellow'], shapes: ['long'], groups: ['tropical'], pips: false, stone: false, rawOk: true, cut: 'star', body: 'star', size: 0.3, amount: '1 starfruit' },
}

export function traitsOf(id: string): FruitTraits {
  const t = TRAITS[id]
  if (!t) throw new Error(`No cafe traits for fruit "${id}"`)
  return t
}

export const COLOUR_SWATCH: Record<ColourFamily, string> = {
  red: '#E53945',
  orange: '#FF8A1E',
  yellow: '#FFD23F',
  green: '#5DBB46',
  purple: '#8E4FC9',
  pink: '#FF7EB6',
  blue: '#3F7FE0',
  brown: '#9A6B43',
}
