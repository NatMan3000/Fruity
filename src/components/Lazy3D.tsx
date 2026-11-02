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

export function Slash({ at }: { at: SlashAt | null }) {
  if (!at) return null
  return (
    <span
      key={at.key}
      aria-hidden="true"
      className="pointer-events-none absolute"
      style={{ left: at.x, top: at.y, transform: `translate(-50%, -50%) rotate(${at.angle}deg)` }}
    >
      <span className="slash block h-[5px] w-36 rounded-full bg-(--light) shadow-[0_0_12px_2px_rgb(255_255_255/0.6)]" style={{ '--angle': '0deg' } as CSSProperties} />
    </span>
  )
}
