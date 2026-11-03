import { ChevronLeft, Volume2, VolumeX, X } from 'lucide-react'
import clsx from 'clsx'
import type { ReactNode } from 'react'
import { DISC } from '../ui'

// The header discs (src/cafe/ui.ts has the classes).
export function Disc({ label, onClick, children, className }: { label: string; onClick: () => void; children: ReactNode; className?: string }) {
  return (
    <button type="button" className={clsx(DISC, className)} onClick={onClick} aria-label={label}>
      {children}
    </button>
  )
}

export function BackDisc({ label, onClick }: { label: string; onClick: () => void }) {
  return <Disc label={label} onClick={onClick}><ChevronLeft aria-hidden="true" className="size-7" strokeWidth={2.75} /></Disc>
}

export function CloseDisc({ label, onClick }: { label: string; onClick: () => void }) {
  return <Disc label={label} onClick={onClick}><X aria-hidden="true" className="size-6" strokeWidth={2.75} /></Disc>
}

export function SoundButton({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  const Icon = on ? Volume2 : VolumeX
  return (
    <button type="button" className={DISC} onClick={onToggle} aria-pressed={on} aria-label={on ? 'Sound on' : 'Sound off'}>
      <Icon aria-hidden="true" className="size-[22px]" strokeWidth={2.4} />
    </button>
  )
}
