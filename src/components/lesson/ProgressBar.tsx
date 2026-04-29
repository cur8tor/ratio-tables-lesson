type ProgressBarProps = {
  step: number
  total: number
  onBack: () => void
  canGoBack: boolean
}

const ProgressBar = ({ step, total, onBack, canGoBack }: ProgressBarProps) => {
  const percent = Math.min(100, Math.max(0, (step / total) * 100))

  return (
    <div className="fixed left-0 right-0 top-0 z-20 border-b border-secondary/15 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-4 px-4">
        <button
          type="button"
          onClick={onBack}
          disabled={!canGoBack}
          className="text-sm font-medium text-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          Back
        </button>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary/15">
          <div
            className="h-full rounded-full bg-accent transition-all duration-300 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="min-w-14 text-right text-xl font-semibold text-primary">
          {step} <span className="text-yellow-500">⚡</span>
        </div>
      </div>
    </div>
  )
}

export default ProgressBar
