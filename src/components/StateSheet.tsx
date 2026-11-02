import { Check } from 'lucide-react'
import clsx from 'clsx'
import { FRUITS } from '../assets/fruits'
import { AUS_STATES } from '../types/fruit'
import { STATE_NAMES, useAusState } from '../hooks/useAusState'
import { Sheet } from './Sheet'

// How many fruits carry a sourced season for each state (Victoria is the base).
const overrideCount = (s: string) => FRUITS.filter(f => f.stateOverrides && s in f.stateOverrides).length

export function StateSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, setState } = useAusState()
  return (
    <Sheet open={open} onClose={onClose} title="Seasons for">
      <ul className="flex flex-col gap-1">
        {AUS_STATES.map(s => {
          const n = overrideCount(s)
          const selected = s === state
          return (
            <li key={s}>
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => { setState(s); onClose() }}
                className={clsx(
                  'flex min-h-12 w-full items-center gap-3 rounded-control px-3 py-2 text-left',
                  selected ? 'bg-tile' : 'active:bg-tile',
                )}
              >
                <span className="w-10 shrink-0 text-small font-semibold text-ink-2 tabular-nums">{s}</span>
                <span className="flex flex-1 flex-col">
                  <span className={clsx('text-body', selected && 'font-semibold')}>{STATE_NAMES[s]}</span>
                  {s !== 'VIC' && n > 0 && (
                    <span className="text-caption text-ink-2">{n} {n === 1 ? 'fruit has' : 'fruits have'} a different season here</span>
                  )}
                </span>
                {selected && <Check aria-hidden="true" className="size-5 shrink-0" />}
              </button>
            </li>
          )
        })}
      </ul>
      <p className="mt-3 text-caption text-ink-2">
        Victorian seasons are the base. Another state changes a fruit only where a source shows its shop season differs.
      </p>
    </Sheet>
  )
}
