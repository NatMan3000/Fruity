import { TopBar } from '../components/TopBar'

// Shown while the game's chunk downloads (App.tsx Suspense fallback): the cafe door's own top bar and
// title on the season's page, so the menu fills in under it without a jump (as QuizLoading does).
export function CafeLoading() {
  return (
    <div className="flex flex-col pb-6" role="status">
      <TopBar back={{ name: 'play' }} bag={false} />
      <h1 className="px-5 pb-1 font-display text-[clamp(2.5rem,13vw,3.5rem)] leading-none">Fruit Salad Cafe</h1>
      <span className="sr-only">Opening the cafe</span>
    </div>
  )
}
