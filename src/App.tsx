import { useState } from 'react'
import type { Season } from './types/fruit'
import { useCurrentMonth } from './hooks/useCurrentMonth'
import { useFruits } from './hooks/useFruits'
import { SearchBar } from './components/SearchBar'
import { SeasonFilter } from './components/SeasonFilter'
import { FruitList } from './components/FruitList'
import { FRUITS } from './assets/fruits'
import './index.css'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null)
  const [showOnlyInSeason, setShowOnlyInSeason] = useState(false)

  const currentMonth = useCurrentMonth()

  const { fruits, inSeasonCount, peakSeasonCount } = useFruits({
    searchQuery,
    season: selectedSeason,
    currentMonth,
    showOnlyInSeason
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-400 to-green-400">
      {/* Header */}
      <header className="bg-green-400 backdrop-blur-sm  sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🍎</span>
              <div>
                <h1 className="text-xl font-bold text-black-900">Fruity</h1>
                <p className="text-xs text-black-500">Australian Fruit Seasons</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-black-600">{currentMonth}</div>
              <div className="text-xs text-gray-700">{peakSeasonCount} at peak</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Search */}
        <div className="mb-8">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            inSeasonCount={inSeasonCount}
            totalCount={FRUITS.length}
          />
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          <SeasonFilter
            selected={selectedSeason}
            onChange={setSelectedSeason}
          />

          <label className="flex items-center gap-2 text-sm text-black-600">
            <input
              type="checkbox"
              checked={showOnlyInSeason}
              onChange={(e) => setShowOnlyInSeason(e.target.checked)}
              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            Show only fruits available now
          </label>
        </div>

        {/* Results */}
        <FruitList fruits={fruits} currentMonth={currentMonth} />

        {/* Footer */}
        <footer className="mt-12 py-6 border-t border-gray-100 text-center text-xs text-black-400">
          <p>Seasonality data for Australian produce</p>
          <p className="mt-1">Actual availability may vary by region</p>
        </footer>
      </main>
    </div>
  )
}

export default App
