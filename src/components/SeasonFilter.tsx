import clsx from 'clsx'
import type { Season } from '../types/fruit'
import { SEASONS } from '../types/fruit'
import { getCurrentSeason } from '../utils/seasonality'

interface SeasonFilterProps {
  selected: Season | null
  onChange: (season: Season | null) => void
}

const seasonEmoji: Record<Season, string> = {
  Summer: '\u2600\ufe0f',
  Autumn: '\ud83c\udf42',
  Winter: '\u2744\ufe0f',
  Spring: '\ud83c\udf38'
}

export function SeasonFilter({ selected, onChange }: SeasonFilterProps) {
  const currentSeason = getCurrentSeason()
  const seasons = Object.keys(SEASONS) as Season[]

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={clsx(
          'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
          selected === null
            ? 'bg-gray-900 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        )}
      >
        All
      </button>
      {seasons.map((season) => (
        <button
          key={season}
          onClick={() => onChange(season === selected ? null : season)}
          className={clsx(
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5',
            selected === season
              ? 'bg-emerald-600 text-white'
              : season === currentSeason
              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 ring-1 ring-emerald-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          <span>{seasonEmoji[season]}</span>
          <span>{season}</span>
          {season === currentSeason && selected !== season && (
            <span className="text-xs opacity-75">(now)</span>
          )}
        </button>
      ))}
    </div>
  )
}
