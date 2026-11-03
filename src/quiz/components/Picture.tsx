// The question's picture: the 3D stage (src/three/QuizStage.tsx, lazy, one canvas for the whole game)
// or, where WebGL is missing, fails, or while the 3D chunk is still on its way, the fruit's sticker
// doing the same trick in 2D: a dark silhouette that takes on colour, a blur that clears (inside out),
// or a zoom that pulls back. Rounds with no picture keep the canvas mounted but hidden, so the next
// picture round does not pay for a new WebGL context.
import { lazy, Suspense, useEffect, useMemo, useState, type CSSProperties } from 'react'
import clsx from 'clsx'
import type { Fruit } from '../../types/fruit'
import { FruitSticker } from '../../components/FruitSticker'
import { Fallback } from '../../components/Lazy3D'
import { webgl } from '../../hooks/useLazy3D'
import { MODELLED } from '../../three/modelled'
import type { StageLook, StageOutcome } from '../../three/QuizStage'

const QuizStage = lazy(() => import('../../three/QuizStage'))

interface PictureProps {
  fruit: Fruit | null
  look: StageLook
  outcome: StageOutcome
  progress: () => number
  shade: string
  qKey: number
}

export function Picture({ fruit, look, outcome, progress, shade, qKey }: PictureProps) {
  const three = webgl && (!fruit || MODELLED.has(fruit.id))
  const like = useMemo(() => (fruit ? { id: fruit.id, name: fruit.name, colour: fruit.colour } : null), [fruit])
  const poster = fruit ? <Sticker2D key={qKey} fruit={fruit} look={look} outcome={outcome} progress={progress} /> : null
  return (
    <div className={fruit ? 'relative h-[min(232px,30dvh)] overflow-hidden rounded-[24px]' : 'pointer-events-none invisible absolute inset-x-0 top-0 h-[232px]'} aria-hidden="true">
      {fruit && <span className="absolute inset-x-6 top-2 bottom-1 rounded-[58%_42%_49%_51%/46%_55%_45%_54%] bg-(--pop) opacity-70" />}
      {three ? (
        <Fallback poster={poster}>
          {/* 3d-fallback-ok: the 2D picture IS the question in a timed round (an empty box would break it); QuizStage preloads from the menu */}
          <Suspense fallback={poster}>
            <QuizStage fruit={like} look={look} outcome={outcome} progress={progress} shade={shade} qKey={qKey} className="absolute inset-0" />
          </Suspense>
        </Fallback>
      ) : poster}
    </div>
  )
}

// 2D stand-in. The reveal follows the question's clock, sampled twice a second (so it also steps
// forward under reduced motion, where transitions are off).
function Sticker2D({ fruit, look, outcome, progress }: { fruit: Fruit; look: StageLook; outcome: StageOutcome; progress: () => number }) {
  const [p, setP] = useState(0)
  useEffect(() => {
    if (outcome !== 'asking') return
    const id = setInterval(() => setP(progress()), 500)
    return () => clearInterval(id)
  }, [outcome, progress])
  const done = outcome !== 'asking'
  const r = done ? 1 : Math.min(1, p / 0.8)
  const style: CSSProperties =
    look === 'silhouette' ? { filter: `brightness(${Math.min(1, Math.max(0, (r - 0.35) / 0.4))}) saturate(${r})` }
      : look === 'inside' ? { filter: `blur(${(1 - r) * 16}px)` }
        : look === 'closeup' ? { transform: `scale(${1 + (1 - r) * 3.2})` }
          : {}
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-block">
      <div
        className={clsx('quiz-reveal', done && 'quiz-reveal-done', outcome === 'right' && 'quiz-swell', outcome === 'wrong' && 'quiz-squish')}
        style={{ ...style, transitionDuration: '500ms' }}
      >
        {/* 3d-fallback-ok: Sticker2D, the quiz's 2D question (see the Suspense above) */}
        <FruitSticker fruit={fruit} size={180} eager slap={look === 'hero'} />
      </div>
    </div>
  )
}
