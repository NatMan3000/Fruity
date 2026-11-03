import { Suspense, useCallback, useMemo, useState } from 'react'
import { FRUITS } from './assets/fruits'
import { useCurrentMonth } from './hooks/useCurrentMonth'
import { loadRecipes, useRecipes } from './hooks/useRecipes'
import { navigate, setRoutePreload, useRoute } from './hooks/useRoute'
import { useScreen } from './hooks/useScreen'
import { useStoredState } from './hooks/useStoredState'
import { UiContext } from './hooks/useUi'
import { isBrowseFilterOrNull, type BrowseFilter } from './utils/browse'
import type { Recipe } from './types/recipe'
import { tabFor, type Route } from './utils/route'
import { seasonOf } from './utils/seasonality'
import { seasonTones, tonesOf } from './utils/tones'
import { BagSheet } from './components/BagSheet'
import { Link } from './components/Link'
import { preloadable } from './components/preloadable'
import { TabBar } from './components/TabBar'
import { TopBar } from './components/TopBar'
import { CafeLoading } from './cafe/CafeLoading'
import { BrowsePage } from './pages/BrowsePage'
import { CookPage } from './pages/CookPage'
import { FruitDetailPage } from './pages/FruitDetailPage'
import { NowPage } from './pages/NowPage'
import { PlayPage } from './pages/PlayPage'
import { YearPage } from './pages/YearPage'

// The Fruit Salad Cafe game (three.js + physics) is its own chunk, fetched only when opened.
const CafeGame = preloadable(() => import('./cafe/CafeGame'))
// "Guess the fruit" is its own chunk too (its 3D stage is a further lazy chunk inside it).
const QuizPage = preloadable(() => import('./quiz/QuizPage'))
// A recipe's page and cook mode are chunks of their own, as is the recipe data (useRecipes).
const RecipePage = preloadable(() => import('./pages/RecipePage'))
const CookMode = preloadable(() => import('./pages/CookMode'))

// A move into one of them fetches it first, so the page slides in whole rather than its loading screen.
setRoutePreload(route => {
  switch (route.name) {
    case 'recipe': return Promise.all([loadRecipes(), RecipePage.preload()])
    case 'cookmode': return Promise.all([loadRecipes(), CookMode.preload()])
    case 'quiz': return QuizPage.preload()
    case 'salad': return CafeGame.preload()
  }
})

const isString = (v: unknown): v is string => typeof v === 'string'

function App() {
  const route = useRoute()
  const month = useCurrentMonth()
  const [query, setQuery] = useStoredState('fruity.search', '', isString)
  const [filter, setFilter] = useStoredState<BrowseFilter | null>('fruity.filter', null, isBrowseFilterOrNull)
  const [bagOpen, setBagOpen] = useState(false)

  // Season screens wear the season's sorbet; a fruit's page, and a recipe's, wear the (main) fruit
  // (DESIGN.md "Colour").
  const onRecipe = route.name === 'recipe' || route.name === 'cookmode'
  const recipes = useRecipes(onRecipe)
  const recipe = onRecipe ? recipes?.find(r => r.id === route.id) : undefined
  const fruitId = route.name === 'fruit' ? route.id : recipe?.fruitIds[0]
  const fruitHere = fruitId ? FRUITS.find(f => f.id === fruitId) : undefined
  const tones = useMemo(() => (fruitHere ? tonesOf(fruitHere.colour) : seasonTones(seasonOf(month))), [fruitHere, month])
  useScreen(tones, fruitHere ? 'fruit' : 'season')

  const ui = useMemo(() => ({ openBag: () => setBagOpen(true) }), [])
  const browseWith = useCallback((f: BrowseFilter) => {
    setQuery('')
    setFilter(f)
    navigate({ name: 'browse' })
  }, [setQuery, setFilter])

  return (
    <UiContext.Provider value={ui}>
      <div className="min-h-[100dvh] pb-[calc(env(safe-area-inset-bottom)+6.5rem)]">
        <main className="mx-auto w-full max-w-2xl">
          <Screen route={route} recipes={recipes} month={month} query={query} setQuery={setQuery} filter={filter} setFilter={setFilter} browseWith={browseWith} />
        </main>
        {/* The sign-off at the foot of every screen, like Bready's (Nathan, 3 Nov 2026) */}
        <footer className="px-5 pt-8 pb-2 text-center text-small font-semibold text-(--light)">
          <p>Made with <span aria-label="strawberries" role="img">🍓</span> by Josh &amp; Kai</p>
        </footer>
      </div>
      <TabBar active={tabFor(route)} />
      <BagSheet open={bagOpen} onClose={() => setBagOpen(false)} />
    </UiContext.Provider>
  )
}

interface ScreenProps {
  route: Route
  recipes: Recipe[] | null
  month: ReturnType<typeof useCurrentMonth>
  query: string
  setQuery: (q: string) => void
  filter: BrowseFilter | null
  setFilter: (f: BrowseFilter | null) => void
  browseWith: (f: BrowseFilter) => void
}

function Screen({ route, recipes, month, query, setQuery, filter, setFilter, browseWith }: ScreenProps) {
  switch (route.name) {
    case 'now':
      return <NowPage month={month} onSeeAllPeak={() => browseWith('peak')} onSeeInSeason={() => browseWith('inSeason')} />
    case 'browse':
      return <BrowsePage month={month} query={query} onQuery={setQuery} filter={filter} onFilter={setFilter} />
    case 'year':
      return <YearPage month={month} />
    case 'fruit': {
      const fruit = FRUITS.find(f => f.id === route.id)
      if (!fruit) return <NotFound what="fruit" />
      return <FruitDetailPage key={fruit.id} fruit={fruit} month={month} />
    }
    case 'cook':
      return <CookPage month={month} />
    case 'recipe':
    case 'cookmode': {
      if (!recipes) return <RecipeLoading />
      const recipe = recipes.find(r => r.id === route.id)
      if (!recipe) return <NotFound what="recipe" />
      return (
        <Suspense fallback={<RecipeLoading />}>
          {route.name === 'recipe'
            ? <RecipePage key={recipe.id} recipe={recipe} month={month} />
            : <CookMode key={recipe.id} recipe={recipe} />}
        </Suspense>
      )
    }
    case 'play':
      return <PlayPage />
    case 'quiz':
      return (
        <Suspense fallback={<QuizLoading />}>
          <QuizPage month={month} />
        </Suspense>
      )
    case 'salad':
      return (
        <Suspense fallback={<CafeLoading />}>
          <CafeGame month={month} />
        </Suspense>
      )
  }
}

function QuizLoading() {
  return (
    <div className="flex flex-col pb-6" role="status">
      <TopBar back={{ name: 'play' }} bag={false} />
      <h1 className="px-5 font-display text-[clamp(2.5rem,13vw,3.5rem)] leading-none">Guess the fruit</h1>
    </div>
  )
}

function RecipeLoading() {
  return (
    <div className="flex flex-col pb-6" role="status">
      <TopBar back={{ name: 'cook' }} />
      <span className="sr-only">Loading the recipe</span>
    </div>
  )
}

function NotFound({ what }: { what: 'fruit' | 'recipe' }) {
  const fruit = what === 'fruit'
  return (
    <div className="flex flex-col pb-6">
      <TopBar back={fruit ? { name: 'browse' } : { name: 'cook' }} />
      <div className="flex flex-col items-start gap-4 px-5 pt-4">
        <span aria-hidden="true" className="slap sticker-emoji text-[72px] leading-none" style={{ transform: 'rotate(-8deg)' }}>🤔</span>
        <h1 className="font-display text-[2.5rem] leading-tight">We don't know that {what}</h1>
        <p className="text-body font-semibold">The link may be old. {fruit ? 'Every fruit we cover is in the list.' : 'Every recipe we have is on the Cook tab.'}</p>
        <Link to={fruit ? { name: 'browse' } : { name: 'cook' }} className="press block-shadow inline-flex h-12 items-center rounded-full bg-(--bright) px-5 font-extrabold text-(--ink)">
          {fruit ? 'See all fruit' : 'See all recipes'}
        </Link>
      </div>
    </div>
  )
}

export default App
