import { lazy, Suspense, useCallback, useMemo, useState } from 'react'
import type { AusState } from './types/fruit'
import { FRUITS } from './assets/fruits'
import { AusStateContext, isAusState } from './hooks/useAusState'
import { useCurrentMonth } from './hooks/useCurrentMonth'
import { navigate, useRoute } from './hooks/useRoute'
import { useStoredState } from './hooks/useStoredState'
import { UiContext } from './hooks/useUi'
import { isBrowseFilterOrNull, type BrowseFilter } from './utils/browse'
import { tabFor, type Route } from './utils/route'
import { BagSheet } from './components/BagSheet'
import { FruitQuiz } from './components/FruitQuiz'
import { Link } from './components/Link'
import { PageHeader } from './components/PageHeader'
import { StateSheet } from './components/StateSheet'
import { TabBar } from './components/TabBar'
import { CafeLoading } from './cafe/CafeLoading'
import { BrowsePage } from './pages/BrowsePage'
import { CookPage } from './pages/CookPage'
import { FruitDetailPage } from './pages/FruitDetailPage'
import { NowPage } from './pages/NowPage'
import { PlayPage } from './pages/PlayPage'
import { YearPage } from './pages/YearPage'

// The Fruit Salad Cafe game (three.js + physics) is its own chunk, fetched only when opened.
const CafeGame = lazy(() => import('./cafe/CafeGame'))

const isString = (v: unknown): v is string => typeof v === 'string'

function App() {
  const route = useRoute()
  const month = useCurrentMonth()
  const [state, setState] = useStoredState<AusState>('fruity.state', 'VIC', isAusState)
  const [query, setQuery] = useStoredState('fruity.search', '', isString)
  const [filter, setFilter] = useStoredState<BrowseFilter | null>('fruity.filter', null, isBrowseFilterOrNull)
  const [bagOpen, setBagOpen] = useState(false)
  const [statesOpen, setStatesOpen] = useState(false)

  const ausState = useMemo(() => ({ state, setState }), [state, setState])
  const ui = useMemo(() => ({ openBag: () => setBagOpen(true), openStates: () => setStatesOpen(true) }), [])
  const browseWith = useCallback((f: BrowseFilter) => {
    setQuery('')
    setFilter(f)
    navigate({ name: 'browse' })
  }, [setQuery, setFilter])

  return (
    <AusStateContext.Provider value={ausState}>
      <UiContext.Provider value={ui}>
        <div className="min-h-[100dvh] pb-[calc(env(safe-area-inset-bottom)+4.5rem)]">
          <main className="mx-auto w-full max-w-2xl">
            <Screen route={route} month={month} query={query} setQuery={setQuery} filter={filter} setFilter={setFilter} browseWith={browseWith} />
          </main>
        </div>
        <TabBar active={tabFor(route)} />
        <BagSheet open={bagOpen} onClose={() => setBagOpen(false)} />
        <StateSheet open={statesOpen} onClose={() => setStatesOpen(false)} />
      </UiContext.Provider>
    </AusStateContext.Provider>
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
        <div className="flex flex-col pb-6">
          <PageHeader title="Guess the fruit" back={{ name: 'play' }} bag={false} />
          <div className="px-4"><FruitQuiz fruits={FRUITS} /></div>
        </div>
      )
    case 'salad':
      return (
        <Suspense fallback={<CafeLoading />}>
          <CafeGame month={month} />
        </Suspense>
      )
  }
}

function NotFound() {
  return (
    <div className="flex flex-col pb-6">
      <PageHeader back={{ name: 'browse' }} />
      <div className="flex flex-col items-start gap-3 px-4">
        <h1 className="font-display text-display font-semibold">We don't know that fruit</h1>
        <p className="text-body text-ink-2">The link may be old. Every fruit we cover is in the list.</p>
        <Link to={{ name: 'browse' }} className="inline-flex h-11 items-center rounded-control bg-ink px-4 font-semibold text-paper">
          See all fruit
        </Link>
      </div>
    </div>
  )
}

export default App
