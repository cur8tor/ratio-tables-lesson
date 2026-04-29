type ProgressBarProps = {
  step: number
  total: number
}

const ProgressBar = ({ step, total }: ProgressBarProps) => {
  const percent = Math.min(100, Math.max(0, (step / total) * 100))

  return (
    <div className="fixed left-0 right-0 top-4 z-20 flex justify-center px-6">
      <div className="h-1.5 w-full max-w-xl overflow-hidden rounded-full bg-secondary/15">
        <div
          className="h-full rounded-full bg-accent transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
