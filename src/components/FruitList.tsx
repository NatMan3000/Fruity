import type { Fruit, Month } from '../types/fruit'
import { FruitCard } from './FruitCard'

interface FruitListProps {
  fruits: Fruit[]
  currentMonth: Month
}

export function FruitList({ fruits, currentMonth }: FruitListProps) {
  if (fruits.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No fruits found</p>
        <p className="text-sm mt-1">Try adjusting your search or filter</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {fruits.map((fruit) => (
        <FruitCard
          key={fruit.id}
          fruit={fruit}
          currentMonth={currentMonth}
        />
      ))}
    </div>
  )
}
