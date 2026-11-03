import { tabFor, type Route } from './route'

// Which way a screen change moves (DESIGN.md "Motion", Page moves). `push` slides the new screen in from
// the right over the old one and `pop` slides it back off to the right (the iPhone's own back gesture),
// `next` and `prev` are the shorter sideways moves between tabs, and `none` swaps without moving.
export type NavMotion = 'push' | 'pop' | 'next' | 'prev' | 'none'

// Tab roots sit at depth 0; a fruit, a recipe or a game is one level in; cook mode is inside a recipe.
function depthOf(route: Route): number {
  switch (route.name) {
    case 'now':
    case 'browse':
    case 'year':
    case 'cook':
    case 'play': return 0
    case 'cookmode': return 2
    default: return 1
  }
}

// Left to right along the tab bar; Year sits just right of the Fruit list (its List / Year toggle).
const LANE: Record<Route['name'], number> = {
  now: 0, browse: 1, year: 1.5, fruit: 1, cook: 2, recipe: 2, cookmode: 2, play: 3, quiz: 3, salad: 3,
}

const same = (a: Route, b: Route) => a.name === b.name && ('id' in a ? a.id : '') === ('id' in b ? b.id : '')

// `how`: 'forward' for a new screen (a tap), 'back' for a step back through history.
export function navMotion(from: Route, to: Route, how: 'forward' | 'back'): NavMotion {
  if (same(from, to)) return 'none'
  if (how === 'back') return 'pop'
  const d = depthOf(to) - depthOf(from)
  if (d > 0) return 'push'
  // Up to a tab root: back the way you came within a tab, sideways to another tab.
  if (d < 0 && tabFor(from) === tabFor(to)) return 'pop'
  if (depthOf(to) === 0) return LANE[to.name] >= LANE[from.name] ? 'next' : 'prev'
  return 'push' // across at the same depth (a recipe's fruit, a fruit's recipe)
}
