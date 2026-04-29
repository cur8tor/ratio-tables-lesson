type ProgressBarProps = {
  step: number
  total: number
  onBack: () => void
  onForward: () => void
  onClose: () => void
  canGoBack: boolean
  canGoForward: boolean
  cfuStatuses: Array<boolean | null>
}

const ProgressBar = ({
  step,
  total,
  onBack,
  onForward,
  onClose,
  canGoBack,
  canGoForward,
  cfuStatuses,
}: ProgressBarProps) => {
  const cfuCount = cfuStatuses.length
  const lessonCountBeforeCfu = Math.max(1, total - cfuCount)
  const currentIndex = Math.max(0, step - 1)
  const mainProgress = Math.min(lessonCountBeforeCfu, currentIndex)
  const percent = Math.min(100, Math.max(0, (mainProgress / lessonCountBeforeCfu) * 100))

  return (
    <div className="fixed left-0 right-0 top-0 z-20 border-b border-secondary/15 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-2 px-4">
        <button
          type="button"
          onClick={onBack}
          disabled={!canGoBack}
          aria-label="Go back"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-secondary/25 text-base font-medium text-primary transition hover:border-secondary/45 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ←
        </button>
        <button
          type="button"
          onClick={onForward}
          disabled={!canGoForward}
          aria-label="Go forward"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-secondary/25 text-base font-medium text-primary transition hover:border-secondary/45 disabled:cursor-not-allowed disabled:opacity-40"
        >
          →
        </button>
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-secondary/15">
          <div
            className="h-full rounded-full bg-accent transition-all duration-300 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex items-center gap-2">
          {cfuStatuses.map((status, index) => (
            <span
              key={index}
              className={`h-3 w-6 rounded-full border ${
                status === true
                  ? 'border-accent/60 bg-accent'
                  : status === false
                    ? 'border-secondary/40 bg-secondary/70'
                    : 'border-secondary/30 bg-secondary/20'
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close lesson and return home"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-secondary/25 text-base font-medium text-primary transition hover:border-secondary/45"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default ProgressBar
