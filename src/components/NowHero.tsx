// The Now hero: this month's peak fruit drop into a sundae dish in real 3D, and you can cut them open
// (src/three/HeroDish.tsx). The 3D chunk (three.js) is lazy and only asked for once the Buy now list
// has painted, so the list never waits for it; until it lands, or where WebGL is missing or fails, a
// still of the same fruit in a flat dish shows instead. No hint text (Nathan, 2 Nov 2026): the Slice
// button is the cue, and the way in for keyboard and screen-reader users: it cuts every fruit in the
// dish open at once, then reads Put back.
import { lazy, Suspense, useMemo, useState } from 'react'
import type { Fruit } from '../types/fruit'
import type { Tones } from '../utils/tones'
import type { CutNews } from '../three/cutting'
import { FruitSticker } from './FruitSticker'
import { useAfterPaint, useSlash, webgl } from '../hooks/useLazy3D'
import { Fallback, Slash } from './Lazy3D'
import { SliceButton } from './SliceButton'

const HeroDish = lazy(() => import('../three/HeroDish'))

export function NowHero({ fruits, tones }: { fruits: Fruit[]; tones: Tones }) {
  const ready = useAfterPaint()
  const [slice, setSlice] = useState(0)
  const [slash, showSlash] = useSlash()
  const [said, setSaid] = useState('')
  const [open, setOpen] = useState(0) // how many fruit are cut open
  const likes = useMemo(() => fruits.map(f => ({ id: f.id, name: f.name, colour: f.colour })), [fruits])

  const onCut = (n: CutNews) => {
    setSaid(n.open ? `${n.name} cut open.` : `${n.name} back together.`)
    if (n.open) showSlash(n)
  }

  const poster = (
    <div className="absolute inset-0 flex items-end justify-center pb-16" aria-hidden="true">
      <span className="absolute bottom-12 left-1/2 h-16 w-64 -translate-x-1/2 rounded-[50%] bg-(--pop)" />
      <span className="relative flex items-end">
        {fruits.slice(0, 3).map((f, i) => (
          <FruitSticker key={f.id} fruit={f} size={i === 0 ? 120 : 92} className={i === 0 ? 'z-10 -mx-3 mb-3' : ''} eager />
        ))}
      </span>
    </div>
  )

  const names = fruits.slice(0, 5).map(f => f.name.toLowerCase())
  const label = `A sundae dish of ${names.join(', ')}. Tap a fruit to cut it open, drag to spin the dish.`

  return (
    <div className="relative h-[290px]" role="group" aria-label={label}>
      {webgl && ready ? (
        <Fallback poster={poster}>
          <Suspense fallback={poster}>
            <HeroDish fruits={likes} dish={tones.pop} rim={tones.light} shade={tones.ink} slice={slice} onCut={onCut} onOpen={setOpen} className="absolute inset-0" />
          </Suspense>
        </Fallback>
      ) : poster}
      <Slash at={slash} />
      {webgl && <SliceButton onSlice={() => setSlice(s => s + 1)} label={open ? 'Put back' : 'Slice'} className="absolute right-4 bottom-0" />}
      <p aria-live="polite" className="sr-only">{said}</p>
    </div>
  )
}
