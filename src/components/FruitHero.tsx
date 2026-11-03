// A fruit page's hero: the fruit in 3D dropping in spinning, bouncing and coasting to a stop
// (src/three/SpinFruit.tsx, comp-3d's drop), on a juicier blob in the fruit's colour. Drag to turn it;
// tap it or swipe quickly across it to cut it open, tap again to put it back. Lazy like the Now hero:
// the 3D chunk is asked for after first paint and the blob waits empty until the fruit drops onto it
// (never the sticker first: it flashed up and vanished, Nathan, 3 Nov 2026). The white-edged sticker is
// the hero only where there is no 3D: WebGL missing or failing, or a fruit without a model (it drops in
// itself, with a squash). Come back to the page by a back move and the fruit is there at once, at rest.
import { lazy, Suspense, useMemo, useState } from 'react'
import type { Fruit } from '../types/fruit'
import type { CutNews } from '../three/cutting'
import { BLOB } from '../three/framing'
import { MODELLED } from '../three/modelled'
import { tonesOf } from '../utils/tones'
import { FruitSticker } from './FruitSticker'
import { useAfterPaint, useSlash, webgl } from '../hooks/useLazy3D'
import { useArrivedBack } from '../hooks/useRoute'
import { Fallback, Slash } from './Lazy3D'
import { SliceButton } from './SliceButton'

const SpinFruit = lazy(() => import('../three/SpinFruit'))

// The blob sits a little below the top bar with the canvas centred on it; the Slice button hangs half
// off its lower edge, which sets the hero's height.
const BLOB_TOP = 10
const CANVAS_H = BLOB_TOP * 2 + BLOB.height

export function FruitHero({ fruit }: { fruit: Fruit }) {
  const three = webgl && MODELLED.has(fruit.id)
  const back = useArrivedBack()
  const ready = useAfterPaint(back)
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

  // The sticker, when it is the hero (dropping in by itself) or the 3D scene failed.
  const poster = (
    <div className="absolute inset-x-0 top-0 flex items-center justify-center" style={{ height: CANVAS_H }} aria-hidden="true">
      <div className={three ? undefined : 'drop-squash'}>
        <FruitSticker fruit={fruit} size={Math.round(BLOB.height * 0.72)} tilt={-3} eager />
      </div>
    </div>
  )

  return (
    // Every size is fixed up front (the blob, the canvas, the button), so nothing moves when the 3D
    // canvas or the fonts arrive. The canvas is centred on the blob; SpinFruit centres the fruit in it.
    <div
      className="relative overflow-x-clip"
      style={{ height: CANVAS_H + 30 }}
      role="group"
      aria-label={three ? `${fruit.name}. Drag to turn it, tap it to cut it open.` : fruit.name}
    >
      <span
        aria-hidden="true"
        className="blob-in absolute left-1/2 -translate-x-1/2 rounded-[58%_42%_49%_51%/46%_55%_45%_54%] bg-(--bright)"
        style={{ top: BLOB_TOP, width: BLOB.width, height: BLOB.height }}
      />
      {!three ? poster : ready && (
        <Fallback poster={poster}>
          <Suspense fallback={null}>
            <SpinFruit fruit={like} shade={tonesOf(fruit.colour).ink} slice={slice} onCut={onCut} settled={back} className="absolute inset-x-0 top-0" style={{ height: CANVAS_H }} />
          </Suspense>
        </Fallback>
      )}
      <Slash at={slash} />
      {/* The knife hangs from the middle of the blob's lower edge, half on it, in ink so it reads on both */}
      {three && (
        <div className="absolute inset-x-0 flex justify-center" style={{ top: BLOB_TOP + BLOB.height - 22 }}>
          <SliceButton onSlice={() => setSlice(s => s + 1)} label={open ? 'Put back' : 'Slice'} tone="ink" />
        </div>
      )}
      <p aria-live="polite" className="sr-only">{said}</p>
    </div>
  )
}
