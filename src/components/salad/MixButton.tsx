interface MixButtonProps {
  fruitCount: number
  isMixing: boolean
  hasBeenMixed: boolean
  onMix: () => void
  onReset: () => void
}

export function MixButton({
  fruitCount,
  isMixing,
  hasBeenMixed,
  onMix,
  onReset
}: MixButtonProps) {
  const canMix = fruitCount >= 2 && !isMixing && !hasBeenMixed
  const showReset = hasBeenMixed

  if (showReset) {
    return (
      <button
        onClick={onReset}
        className="
          w-full py-4 px-6 rounded-2xl
          bg-gradient-to-r from-purple-500 to-pink-500
          text-white font-bold text-lg
          shadow-lg hover:shadow-xl
          transform hover:scale-[1.02] active:scale-[0.98]
          transition-all
        "
      >
        <span className="mr-2">🔄</span>
        Make Another Salad
      </button>
    )
  }

  return (
    <button
      onClick={onMix}
      disabled={!canMix}
      className={`
        w-full py-4 px-6 rounded-2xl
        font-bold text-lg
        shadow-lg
        transform transition-all
        ${canMix
          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] animate-pulse-subtle'
          : isMixing
            ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white animate-pulse'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }
      `}
    >
      {isMixing ? (
        <>
          <span className="inline-block animate-spin mr-2">🥣</span>
          Mixing...
        </>
      ) : fruitCount < 2 ? (
        <>
          <span className="mr-2">🥗</span>
          Add {2 - fruitCount} more fruit{fruitCount === 0 ? 's' : ''} to mix
        </>
      ) : (
        <>
          <span className="mr-2">🥣</span>
          Mix It Up!
        </>
      )}
    </button>
  )
}
