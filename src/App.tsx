import { lazy, Suspense, useCallback, useMemo, useState } from 'react'
import { FRUITS } from './assets/fruits'
import { useCurrentMonth } from './hooks/useCurrentMonth'
import { navigate, useRoute } from './hooks/useRoute'
import { useScreen } from './hooks/useScreen'
import { useStoredState } from './hooks/useStoredState'
import { UiContext } from './hooks/useUi'
import { isBrowseFilterOrNull, type BrowseFilter } from './utils/browse'
import { tabFor, type Route } from './utils/route'
import { seasonOf } from './utils/seasonality'
import { seasonTones, tonesOf } from './utils/tones'
import { BagSheet } from './components/BagSheet'
import { Link } from './components/Link'
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
const CafeGame = lazy(() => import('./cafe/CafeGame'))
// "Guess the fruit" is its own chunk too (its 3D stage is a further lazy chunk inside it).
const QuizPage = lazy(() => import('./quiz/QuizPage'))

const isString = (v: unknown): v is string => typeof v === 'string'

function App() {
  const route = useRoute()
  const month = useCurrentMonth()
  const [query, setQuery] = useStoredState('fruity.search', '', isString)
  const [filter, setFilter] = useStoredState<BrowseFilter | null>('fruity.filter', null, isBrowseFilterOrNull)
  const [bagOpen, setBagOpen] = useState(false)

  // Season screens wear the season's sorbet; a fruit's page wears the fruit (DESIGN.md "Colour").
  const fruitHere = route.name === 'fruit' ? FRUITS.find(f => f.id === route.id) : undefined
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
          <Screen route={route} month={month} query={query} setQuery={setQuery} filter={filter} setFilter={setFilter} browseWith={browseWith} />
        </main>
      </div>
      <TabBar active={tabFor(route)} />
      <BagSheet open={bagOpen} onClose={() => setBagOpen(false)} />
    </UiContext.Provider>
  )
}

interface ScreenProps {
  route: Route
  month: ReturnType<typeof useCurrentMonth>
  query: string
  setQuery: (q: string) => void
  filter: BrowseFilter | null
  setFilter: (f: BrowseFilter | null) => void
  browseWith: (f: BrowseFilter) => void
}

function Screen({ route, month, query, setQuery, filter, setFilter, browseWith }: ScreenProps) {
  switch (route.name) {
    case 'now':
      return <NowPage month={month} onSeeAllPeak={() => browseWith('peak')} onSeeInSeason={() => browseWith('inSeason')} />
    case 'browse':
      return <BrowsePage month={month} query={query} onQuery={setQuery} filter={filter} onFilter={setFilter} />
    case 'year':
      return <YearPage month={month} />
    case 'fruit': {
      const fruit = FRUITS.find(f => f.id === route.id)
      if (!fruit) return <NotFound />
      return <FruitDetailPage key={fruit.id} fruit={fruit} month={month} />
    }
    case 'cook':
      return <CookPage month={month} />
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

function NotFound() {
  return (
    <div className="flex flex-col pb-6">
      <TopBar back={{ name: 'browse' }} />
      <div className="flex flex-col items-start gap-4 px-5 pt-4">
        <span aria-hidden="true" className="slap sticker-emoji text-[72px] leading-none" style={{ transform: 'rotate(-8deg)' }}>🤔</span>
        <h1 className="font-display text-[2.5rem] leading-tight">We don't know that fruit</h1>
        <p className="text-body font-semibold">The link may be old. Every fruit we cover is in the list.</p>
        <Link to={{ name: 'browse' }} className="press block-shadow inline-flex h-12 items-center rounded-full bg-(--bright) px-5 font-extrabold text-(--ink)">
          See all fruit
        </Link>
      </div>
    </div>
  )
}

export default App
