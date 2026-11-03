// Shared by the two 3D heroes (NowHero, FruitHero): a fallback that shows the still if the scene
// throws, and the knife stroke that flashes across a fruit as it is cut. Hooks: src/hooks/useLazy3D.ts.
import { Component, type CSSProperties, type ReactNode } from 'react'
import type { SlashAt } from '../hooks/useLazy3D'

export class Fallback extends Component<{ poster: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error: unknown) {
    console.warn('[Fruity] 3D hero failed, showing the still instead', error)
  }
  render() {
    return this.state.failed ? this.props.poster : this.props.children
  }
}

// `length` in px (the welcome's stroke crosses the whole screen); the heroes' is 144.
export function Slash({ at, length = 144 }: { at: SlashAt | null; length?: number }) {
  if (!at) return null
  return (
    <span
      key={at.key}
      aria-hidden="true"
      className="pointer-events-none absolute"
      style={{ left: at.x, top: at.y, transform: `translate(-50%, -50%) rotate(${at.angle}deg)` }}
    >
      <span className="slash block h-[5px] rounded-full bg-(--light) shadow-[0_0_12px_2px_rgb(255_255_255/0.6)]" style={{ width: length, '--angle': '0deg' } as CSSProperties} />
    </span>
  )
}
