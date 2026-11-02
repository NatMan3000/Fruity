import { useState } from 'react'
import clsx from 'clsx'
import { RotateCcw } from 'lucide-react'
import type { Fruit } from '../types/fruit'

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

  if (isGameComplete) {
    return (
      <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🎉 Quiz Complete!
        </h2>
        <p className="text-4xl font-bold text-emerald-600 mb-4">
          {score.correct} / {score.total}
        </p>
        <p className="text-gray-600 mb-6">
          {score.correct === score.total
            ? "Perfect score! You're a fruit expert! 🌟"
            : score.correct >= score.total * 0.6
            ? "Great job! You know your fruits! 👏"
            : "Keep learning about seasonal fruits! 📚"}
        </p>
        <button
          onClick={startNewGame}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          Play Again
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          🎮 Guess the Fruit
        </h2>
        <div className="text-sm text-gray-600">
          Question {currentQuestionIndex + 1} of {questions.length} •{' '}
          <span className="font-medium text-emerald-600">
            {score.correct}/{score.total}
          </span>
        </div>
      </div>

      {/* Fruit emoji (blurred initially) */}
      <div className="flex justify-center mb-6">
        <span
          className={clsx(
            'text-8xl transition-all duration-500',
            showBlur && 'blur-lg scale-110'
          )}
        >
          {currentQuestion.correctFruit.emoji}
        </span>
      </div>

      {/* Clues */}
      <div className="mb-6 space-y-2">
        {currentQuestion.cluesRevealed >= 1 && (
          <div className="p-3 rounded-lg bg-blue-50 text-sm text-blue-900">
            <span className="font-medium">Peak season:</span>{' '}
            {currentQuestion.correctFruit.seasonality.peak.join(', ')}
          </div>
        )}
        {currentQuestion.cluesRevealed >= 2 && currentQuestion.correctFruit.pairings && (
          <div className="p-3 rounded-lg bg-purple-50 text-sm text-purple-900">
            <span className="font-medium">Pairs well with:</span>{' '}
            {currentQuestion.correctFruit.pairings.slice(0, 3).join(', ')}
          </div>
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {currentQuestion.options.map((fruit) => (
          <button
            key={fruit.id}
            onClick={() => handleAnswer(fruit.id)}
            disabled={!!selectedAnswer}
            className={clsx(
              'p-4 rounded-xl border-2 transition-all text-left',
              {
                'border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/50':
                  !selectedAnswer,
                'border-emerald-500 bg-emerald-100':
                  selectedAnswer === fruit.id && isCorrect,
                'border-red-500 bg-red-100':
                  selectedAnswer === fruit.id && !isCorrect,
                'border-emerald-500 bg-emerald-50':
                  selectedAnswer && fruit.id === currentQuestion.correctFruit.id,
                'opacity-50': selectedAnswer && fruit.id !== currentQuestion.correctFruit.id && fruit.id !== selectedAnswer,
                'cursor-not-allowed': !!selectedAnswer,
                'cursor-pointer': !selectedAnswer
              }
            )}
          >
            <div className="font-medium text-gray-900">{fruit.name}</div>
          </button>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        {!selectedAnswer && currentQuestion.cluesRevealed < 2 && (
          <button
            onClick={revealClue}
            className="flex-1 px-4 py-2 rounded-lg bg-blue-100 text-blue-700 font-medium hover:bg-blue-200 transition-colors"
          >
            💡 Show Clue
          </button>
        )}
        {selectedAnswer && (
          <button
            onClick={nextQuestion}
            className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next →' : 'Finish'}
          </button>
        )}
      </div>
    </div>
  )
}
