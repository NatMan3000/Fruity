import type { Season } from './types/fruit'
import { SEASONS } from './types/fruit'
import { useRoute, navigate, goBack } from './hooks/useRoute'
import { useStoredState } from './hooks/useStoredState'
import type { Route } from './utils/route'
import { useCurrentMonth } from './hooks/useCurrentMonth'
import { useFruits } from './hooks/useFruits'
import { SearchBar } from './components/SearchBar'
import { SeasonFilter } from './components/SeasonFilter'
import { FruitList } from './components/FruitList'
import { FruitDetail } from './components/FruitDetail'
import { WhatsNew } from './components/WhatsNew'
import { SeasonCalendar } from './components/SeasonCalendar'
import { RecipeSuggestions } from './components/RecipeSuggestions'
import { FruitQuiz } from './components/FruitQuiz'
import { FruitSaladPage } from './components/salad/FruitSaladPage'
import { FRUITS } from './assets/fruits'
import './index.css'

const isString = (v: unknown): v is string => typeof v === 'string'
const isBool = (v: unknown): v is boolean => typeof v === 'boolean'
const isSeasonOrNull = (v: unknown): v is Season | null => v === null || (typeof v === 'string' && v in SEASONS)

function App() {
  const [searchQuery, setSearchQuery] = useStoredState('fruity.search', '', isString)
  const [selectedSeason, setSelectedSeason] = useStoredState<Season | null>('fruity.season', null, isSeasonOrNull)
  const [showOnlyInSeason, setShowOnlyInSeason] = useStoredState('fruity.inSeasonOnly', false, isBool)
  const route = useRoute()
  const viewMode = route.name === 'fruit' ? 'browse' : route.name
  const selectedFruit = route.name === 'fruit' ? FRUITS.find(f => f.id === route.id) ?? null : null

  const currentMonth = useCurrentMonth()

  const { fruits, inSeasonCount, peakSeasonCount } = useFruits({
    searchQuery,
    season: selectedSeason,
    currentMonth,
    showOnlyInSeason
  })

  const handleFruitSelect = (fruitId: string) => navigate({ name: 'fruit', id: fruitId })

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-400 to-green-400">
      {/* Header */}
      <header className="bg-green-400 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🍎</span>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Fruity</h1>
                <p className="text-xs text-gray-500">Australian Fruit Seasons</p>
              </div>
            </div>
            <div className="flex flex-col justify-center text-right">

              <div className="text-xs text-gray-700">{peakSeasonCount} fruits in peak season</div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs - hide when viewing fruit detail */}
      {!selectedFruit && (
        <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-[72px] z-10">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex gap-1">
              {[
                { id: 'browse' as const, label: '🍎 Fruits', title: 'Browse Fruits' },
                { id: 'calendar' as const, label: '📅 Calendar', title: 'Season Calendar' },
                { id: 'salad' as const, label: '🥗 Salad', title: 'Fruit Salad Maker' },
                { id: 'quiz' as const, label: '🎯 Quiz', title: 'Guess the Fruit' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => navigate({ name: tab.id } as Route)}
                  className={`px-4 py-3 text-sm font-medium transition-colors ${
                    viewMode === tab.id
                      ? 'text-emerald-700 border-b-2 border-emerald-500'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title={tab.title}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </nav>
      )}

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Fruit Detail View */}
        {selectedFruit && (
          <FruitDetail
            fruit={selectedFruit}
            currentMonth={currentMonth}
            onBack={goBack}
          />
        )}

        {/* Browse View */}
        {!selectedFruit && viewMode === 'browse' && (
          <div className="space-y-8">
            {/* Search Section - Clean and prominent */}
            <section>
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                inSeasonCount={inSeasonCount}
                totalCount={FRUITS.length}
              />
            </section>

            {/* Filters Section - Grouped nicely */}
            <section className="bg-white/60 backdrop-blur-sm rounded-xl p-4 space-y-3">
              <SeasonFilter
                selected={selectedSeason}
                onChange={setSelectedSeason}
              />
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlyInSeason}
                  onChange={(e) => setShowOnlyInSeason(e.target.checked)}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                Show only fruits available now
              </label>
            </section>

            {/* What's New - Only show when no search/filters active */}
            {!searchQuery && !selectedSeason && !showOnlyInSeason && (
              <section>
                <WhatsNew
                  fruits={FRUITS}
                  currentMonth={currentMonth}
                  onFruitClick={handleFruitSelect}
                />
              </section>
            )}

            {/* Recipe Suggestions - Clear visual separation */}
            {!searchQuery && !selectedSeason && (
              <section className="pt-4 border-t-2 border-white/30">
                <RecipeSuggestions
                  fruits={FRUITS}
                  currentMonth={currentMonth}
                  onFruitClick={handleFruitSelect}
                />
              </section>
            )}

            {/* Fruit Grid */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {searchQuery || selectedSeason || showOnlyInSeason
                  ? `${fruits.length} fruits found`
                  : 'All Fruits'}
              </h2>
              <FruitList
                fruits={fruits}
                currentMonth={currentMonth}
                onFruitClick={handleFruitSelect}
              />
            </section>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-emerald-100" />
                <span>Peak season</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-amber-100" />
                <span>Still available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gray-100" />
                <span>Out of season</span>
              </div>
            </div>
          </div>
        )}

        {/* Calendar View */}
        {!selectedFruit && viewMode === 'calendar' && (
          <SeasonCalendar
            fruits={FRUITS}
            currentMonth={currentMonth}
            onFruitClick={handleFruitSelect}
          />
        )}

        {/* Quiz View */}
        {!selectedFruit && viewMode === 'quiz' && (
          <FruitQuiz fruits={FRUITS} />
        )}

        {/* Salad View */}
        {!selectedFruit && viewMode === 'salad' && (
          <FruitSaladPage currentMonth={currentMonth} />
        )}

        {/* Footer */}
        <footer className="mt-12 py-6 border-t border-gray-100 text-xs text-gray-500">
          <p className="text-center text-gray-500">Seasonality data for Australian produce</p>
          <p className="mt-1 text-center text-gray-500">Actual availability may vary by region</p>
        </footer>
      </main>
    </div>
  )
}

export default App
