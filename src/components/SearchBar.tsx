import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  inSeasonCount: number
  totalCount: number
}

export function SearchBar({ value, onChange, inSeasonCount, totalCount }: SearchBarProps) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search fruits..."
        className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl bg-white shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
        </button>
      )}
      <div className="absolute -bottom-6 left-0 text-xs text-gray-500">
        {inSeasonCount} of {totalCount} fruits in season now
      </div>
    </div>
  )
}
