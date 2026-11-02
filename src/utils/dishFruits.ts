import type { Fruit, Month } from '../types/fruit'
import { isInSeason, nowSections, sortBySeason } from './seasonality'

// The Now dish holds the month's peak fruit (in a month with none at peak, what is in season), up to
// five, showing off the fruit with the best insides first (a watermelon in summer, kiwi and citrus in
// winter), then the rest in Buy now order (the sort is stable). Shared by the Now page and the model
// sheet's dish check, so the check cuts the dishes the app shows.
const SHOWPIECES = ['watermelon', 'dragon-fruit', 'kiwifruit', 'passionfruit', 'avocado', 'pomegranate', 'papaya', 'rockmelon', 'grapefruit', 'orange', 'peach', 'fig', 'mango', 'strawberry', 'pineapple']
const showpiece = (f: Fruit) => {
  const i = SHOWPIECES.indexOf(f.id)
  return i < 0 ? SHOWPIECES.length : i
}

export function dishFruits(fruits: Fruit[], month: Month): Fruit[] {
  const { buyNow } = nowSections(fruits, month)
  const pool = buyNow.length ? buyNow : sortBySeason(fruits.filter(f => isInSeason(f, month)), month)
  return [...pool].sort((x, y) => showpiece(x) - showpiece(y)).slice(0, 5)
}
