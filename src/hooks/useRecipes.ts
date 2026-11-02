import { useEffect, useState } from 'react'
import type { Recipe } from '../types/recipe'

// The recipes are their own chunk (about 20 KB gzip), so the first paint of Now and the fruit pages
// does not wait for them. It is precached, so after the first visit it lands in a frame or two; Now
// asks for it as soon as the page is idle.
let recipes: Recipe[] | null = null
let loading: Promise<Recipe[]> | null = null

export function loadRecipes(): Promise<Recipe[]> {
  loading ??= import('../assets/recipes').then(
    m => (recipes = m.RECIPES),
    err => { loading = null; throw err }, // let the next screen try again
  )
  return loading
}

// `enabled: false` skips the load (App only needs the recipes on a recipe route).
export function useRecipes(enabled = true): Recipe[] | null {
  const [list, setList] = useState(recipes)
  useEffect(() => {
    if (list || !enabled) return
    let live = true
    loadRecipes().then(r => { if (live) setList(r) }, err => console.warn('fruity: could not load the recipes', err))
    return () => { live = false }
  }, [list, enabled])
  return list
}
