import type { ReactNode } from 'react'

// The band under a tab screen's title, shared by Fruit and Cook so switching tabs never makes it jump:
// one control (the search bar, or the In season / All / Saved switch) at the same y, height, inset and
// radius, then the chip row, then the screen's count line starts at the same y. Pinned while the list
// scrolls. Every number lives here (and in COUNT_AREA below), never in the pages.
export const TAB_CONTROL = 'h-12 rounded-full' // 48px: above the 44px tap minimum, fits both controls

export function TabControls({ control, chips }: { control: ReactNode; chips: ReactNode }) {
  return (
    <div className="sticky top-0 z-20 flex flex-col gap-2.5 bg-(--screen) pt-[calc(env(safe-area-inset-top)+10px)] pb-3">
      <div className="px-4">{control}</div>
      {chips}
    </div>
  )
}

// Wraps the count line and everything under it: same side inset and gap on every tab screen.
export const COUNT_AREA = 'flex flex-col gap-3 px-4'
