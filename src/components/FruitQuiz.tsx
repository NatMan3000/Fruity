import { useState, type CSSProperties } from 'react'
import clsx from 'clsx'
import { ArrowRight, Check, Lightbulb, RotateCcw, X } from 'lucide-react'
import type { Fruit } from '../types/fruit'
import { describeMonths, getSeasonality } from '../utils/seasonality'
import { FruitSticker } from './FruitSticker'

interface FruitQuizProps {
  fruits: Fruit[]
}

interface QuizQuestion {
  correctFruit: Fruit
  options: Fruit[]
  cluesRevealed: number // 0 = none, 1 = seasonality, 2 = pairings
}

function buildQuestions(fruits: Fruit[]): QuizQuestion[] {
  // Pick 5 random fruits for questions
  const shuffled = [...fruits].sort(() => Math.random() - 0.5)
  const selectedFruits = shuffled.slice(0, 5)

  return selectedFruits.map((correctFruit) => {
    // Generate 3 wrong answers
    const wrongAnswers = fruits
      .filter((f) => f.id !== correctFruit.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)

    // Shuffle correct + wrong options
    const options = [correctFruit, ...wrongAnswers].sort(() => Math.random() - 0.5)

    return {
      correctFruit,
      options,
      cluesRevealed: 0
    }
  })
}

export function FruitQuiz({ fruits }: FruitQuizProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => buildQuestions(fruits))
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [showBlur, setShowBlur] = useState(true)

  const startNewGame = () => {
    setQuestions(buildQuestions(fruits))
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setScore({ correct: 0, total: 0 })
    setShowBlur(true)
  }

  const currentQuestion = questions[currentQuestionIndex]
  const isGameComplete = currentQuestionIndex >= questions.length
  const isCorrect = selectedAnswer === currentQuestion?.correctFruit.id

  const revealClue = () => {
    if (!currentQuestion) return
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === currentQuestionIndex
          ? { ...q, cluesRevealed: Math.min(q.cluesRevealed + 1, 2) }
          : q
      )
    )
  }

  const handleAnswer = (fruitId: string) => {
    if (selectedAnswer) return // Already answered

    setSelectedAnswer(fruitId)
    setShowBlur(false)

    const correct = fruitId === currentQuestion.correctFruit.id
    setScore((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1
    }))
  }

  const nextQuestion = () => {
    setCurrentQuestionIndex((prev) => prev + 1)
    setSelectedAnswer(null)
    setShowBlur(true)
  }

  if (questions.length === 0) return null

  const primary = 'press block-shadow inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-(--ink) text-body font-extrabold text-(--light)'

  if (isGameComplete) {
    const perfect = score.correct === score.total
    return (
      <div className="block-shadow flex flex-col items-center gap-3 rounded-block bg-(--bright) p-6 text-center text-(--ink)">
        <h2 className="font-display text-title">Quiz complete</h2>
        <p className="slap font-display text-[4rem] leading-none tabular-nums" style={{ '--tilt': '-4deg', transform: 'rotate(var(--tilt))' } as CSSProperties}>
          {score.correct} / {score.total}
        </p>
        <p className="text-body font-semibold text-(--ink-soft)">
          {perfect
            ? 'Perfect score. You really know your fruit.'
            : score.correct >= score.total * 0.6
            ? 'Nicely done. You know your fruit.'
            : 'Keep going, the seasons take a while to learn.'}
        </p>
        <button type="button" onClick={startNewGame} className={clsx(primary, 'w-full flex-none')}>
          <RotateCcw aria-hidden="true" className="size-5" strokeWidth={2.5} />
          Play again
        </button>
      </div>
    )
  }

  const peak = getSeasonality(currentQuestion.correctFruit).peak

  return (
    <div className="block-shadow flex flex-col gap-5 rounded-block bg-(--bright) p-5 text-(--ink)">
      <p className="text-small font-bold text-(--ink-soft) tabular-nums">
        Question {currentQuestionIndex + 1} of {questions.length}, score {score.correct}/{score.total}
      </p>

      {/* The fruit, blurred until answered. One picture only: the sticker draws the art OR the emoji. */}
      <div className="flex justify-center">
        <span className="flex size-48 items-center justify-center rounded-full bg-(--pop)">
          <span className={clsx('transition-[filter,transform] duration-300 ease-out', showBlur ? 'scale-110 blur-lg' : 'scale-100')}>
            <FruitSticker key={currentQuestion.correctFruit.id} fruit={currentQuestion.correctFruit} size={150} eager slap={!showBlur} />
          </span>
        </span>
      </div>

      {/* Clues */}
      {currentQuestion.cluesRevealed >= 1 && (
        <ul className="flex flex-col gap-2">
          <li className="pop-in rounded-[20px] bg-(--pop) p-3 text-small font-semibold">
            <span className="font-extrabold">Peak season:</span>{' '}
            {peak.length ? describeMonths(peak) : 'all year, no peak'}
          </li>
          {currentQuestion.cluesRevealed >= 2 && currentQuestion.correctFruit.pairings && (
            <li className="pop-in rounded-[20px] bg-(--pop) p-3 text-small font-semibold">
              <span className="font-extrabold">Goes well with:</span>{' '}
              {currentQuestion.correctFruit.pairings.slice(0, 3).join(', ')}
            </li>
          )}
        </ul>
      )}

      {/* Options */}
      <div className="grid grid-cols-2 gap-2.5">
        {currentQuestion.options.map((fruit) => {
          const isAnswer = fruit.id === currentQuestion.correctFruit.id
          const isPicked = selectedAnswer === fruit.id
          const right = !!selectedAnswer && isAnswer
          const wrong = isPicked && !isCorrect
          return (
            <button
              key={fruit.id}
              type="button"
              onClick={() => handleAnswer(fruit.id)}
              disabled={!!selectedAnswer}
              className={clsx(
                'chip flex min-h-14 items-center justify-between gap-2 rounded-full px-5 py-3 text-left text-body font-extrabold',
                !selectedAnswer && 'bg-(--deep) text-(--light)',
                right && 'tick-in bg-peak text-peak-ink',
                wrong && 'bg-off text-off-ink',
                selectedAnswer && !right && !wrong && 'bg-(--deep) text-(--light) opacity-75',
              )}
            >
              {fruit.name}
              {right && <Check aria-label="Correct" className="size-5 shrink-0" strokeWidth={3} />}
              {wrong && <X aria-label="Wrong" className="size-5 shrink-0" strokeWidth={3} />}
            </button>
          )
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {!selectedAnswer && currentQuestion.cluesRevealed < 2 && (
          <button
            type="button"
            onClick={revealClue}
            className="press inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-(--pop) text-body font-extrabold text-(--ink)"
          >
            <Lightbulb aria-hidden="true" className="size-5" strokeWidth={2.5} />
            {currentQuestion.cluesRevealed === 0 ? 'Show a clue' : 'Another clue'}
          </button>
        )}
        {selectedAnswer && (
          <button type="button" onClick={nextQuestion} className={primary}>
            {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'}
            <ArrowRight aria-hidden="true" className="size-5" strokeWidth={2.75} />
          </button>
        )}
      </div>
    </div>
  )
}
