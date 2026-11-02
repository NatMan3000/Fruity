import { useState } from 'react'
import clsx from 'clsx'
import { ArrowRight, Check, Lightbulb, RotateCcw, X } from 'lucide-react'
import type { Fruit } from '../types/fruit'
import { useAusState } from '../hooks/useAusState'
import { describeMonths, getSeasonality } from '../utils/seasonality'
import { FruitIcon } from './FruitIcon'

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
  const { state } = useAusState()
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

  const primary = 'inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-control bg-ink font-semibold text-paper active:opacity-90'

  if (isGameComplete) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-card bg-card p-6 text-center">
        <h2 className="font-display text-title font-semibold">Quiz complete</h2>
        <p className="font-display text-hero font-semibold tabular-nums">
          {score.correct} / {score.total}
        </p>
        <p className="text-body text-ink-2">
          {score.correct === score.total
            ? 'Perfect score. You really know your fruit.'
            : score.correct >= score.total * 0.6
            ? 'Nicely done. You know your fruit.'
            : 'Keep going, the seasons take a while to learn.'}
        </p>
        <button type="button" onClick={startNewGame} className={clsx(primary, 'w-full max-w-xs flex-none')}>
          <RotateCcw aria-hidden="true" className="size-5" />
          Play again
        </button>
      </div>
    )
  }

  const peak = getSeasonality(currentQuestion.correctFruit, state).peak

  return (
    <div className="flex flex-col gap-5 rounded-card bg-card p-5">
      <p className="text-small text-ink-2 tabular-nums">
        Question {currentQuestionIndex + 1} of {questions.length}, score {score.correct}/{score.total}
      </p>

      {/* The fruit, blurred until answered */}
      <div className="flex justify-center">
        <span className={clsx('transition-[filter,transform] duration-200 ease-out', showBlur && 'scale-110 blur-lg')}>
          <FruitIcon fruit={currentQuestion.correctFruit} size="2xl" />
        </span>
      </div>

      {/* Clues */}
      {currentQuestion.cluesRevealed >= 1 && (
        <ul className="flex flex-col gap-2">
          <li className="rounded-control bg-tile p-3 text-small text-ink">
            <span className="font-semibold">Peak season:</span>{' '}
            {peak.length ? describeMonths(peak) : 'all year, no peak'}
          </li>
          {currentQuestion.cluesRevealed >= 2 && currentQuestion.correctFruit.pairings && (
            <li className="rounded-control bg-tile p-3 text-small text-ink">
              <span className="font-semibold">Goes well with:</span>{' '}
              {currentQuestion.correctFruit.pairings.slice(0, 3).join(', ')}
            </li>
          )}
        </ul>
      )}

      {/* Options */}
      <div className="grid grid-cols-2 gap-2">
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
                'flex min-h-12 items-center justify-between gap-2 rounded-control px-4 py-3 text-left text-body font-medium',
                !selectedAnswer && 'bg-tile text-ink active:bg-tile-strong',
                right && 'bg-leaf-soft text-leaf-deep',
                wrong && 'bg-tomato-soft text-tomato-deep',
                selectedAnswer && !right && !wrong && 'bg-tile text-ink-2 opacity-60',
              )}
            >
              {fruit.name}
              {right && <Check aria-label="Correct" className="size-5 shrink-0" strokeWidth={2.5} />}
              {wrong && <X aria-label="Wrong" className="size-5 shrink-0" strokeWidth={2.5} />}
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
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-control bg-tile font-semibold text-ink active:bg-tile-strong"
          >
            <Lightbulb aria-hidden="true" className="size-5" />
            {currentQuestion.cluesRevealed === 0 ? 'Show a clue' : 'Another clue'}
          </button>
        )}
        {selectedAnswer && (
          <button type="button" onClick={nextQuestion} className={primary}>
            {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'}
            <ArrowRight aria-hidden="true" className="size-5" />
          </button>
        )}
      </div>
    </div>
  )
}
