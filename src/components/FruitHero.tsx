// A fruit page's hero: the fruit in 3D dropping in spinning, bouncing and coasting to a stop
// (src/three/SpinFruit.tsx, comp-3d's drop), on a juicier blob in the fruit's colour. Drag to turn it;
// tap it or swipe quickly across it to cut it open, tap again to put it back. Lazy like the Now hero:
// the 3D chunk is asked for after first paint, and the white-edged sticker stands in until it lands,
// for good where WebGL is missing or fails, and for any fruit without a model (where it drops in
// itself, with a squash).
import { lazy, Suspense, useMemo, useState } from 'react'
import type { Fruit } from '../types/fruit'
import type { CutNews } from '../three/cutting'
import { MODELLED } from '../three/modelled'
import { tonesOf } from '../utils/tones'
import { FruitSticker } from './FruitSticker'
import { useAfterPaint, useSlash, webgl } from '../hooks/useLazy3D'
import { Fallback, Slash } from './Lazy3D'
import { SliceButton } from './SliceButton'

const SpinFruit = lazy(() => import('../three/SpinFruit'))

export function FruitHero({ fruit }: { fruit: Fruit }) {
  const three = webgl && MODELLED.has(fruit.id)
  const ready = useAfterPaint()
  const [slice, setSlice] = useState(0)
  const [open, setOpen] = useState(false)
  const [slash, showSlash] = useSlash()
  const [said, setSaid] = useState('')
  const like = useMemo(() => ({ id: fruit.id, name: fruit.name, colour: fruit.colour }), [fruit.id, fruit.name, fruit.colour])

  const onCut = (n: CutNews) => {
    setOpen(n.open)
    setSaid(n.open ? `${n.name} cut open.` : `${n.name} back together.`)
    if (n.open) showSlash(n)
  }

  // The sticker: still while the 3D fruit is on its way, dropping in by itself when it is the hero.
  const poster = (
    <div className="absolute inset-x-0 bottom-2 flex justify-center" aria-hidden="true">
      <div className={three ? undefined : 'drop-squash'}>
        <FruitSticker fruit={fruit} size={250} tilt={-3} eager />
      </div>
    </div>
  )

  return (
    <div
      className="relative h-[300px] overflow-x-clip"
      role="group"
      aria-label={three ? `${fruit.name}. Drag to turn it, tap it to cut it open.` : fruit.name}
    >
      <span aria-hidden="true" className="blob-in absolute top-4 left-1/2 h-[250px] w-[290px] -translate-x-1/2 rounded-[58%_42%_49%_51%/46%_55%_45%_54%] bg-(--bright)" />
      {three && ready ? (
        <Fallback poster={poster}>
          <Suspense fallback={poster}>
            <SpinFruit fruit={like} shade={tonesOf(fruit.colour).ink} slice={slice} onCut={onCut} className="absolute inset-0" />
          </Suspense>
        </Fallback>
      ) : poster}
      <Slash at={slash} />
      {three && <SliceButton onSlice={() => setSlice(s => s + 1)} label={open ? 'Put back' : 'Slice'} className="absolute right-4 bottom-1" />}
      <p aria-live="polite" className="sr-only">{said}</p>
    </div>
  )
}
