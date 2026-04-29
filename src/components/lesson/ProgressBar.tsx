type ProgressBarProps = {
  step: number
  total: number
}

const ProgressBar = ({ step, total }: ProgressBarProps) => {
  const percent = Math.min(100, Math.max(0, (step / total) * 100))

  return (
    <div className="fixed left-0 top-0 z-20 h-1 w-full bg-secondary/25">
      <div
        className="h-full bg-accent transition-all duration-300 ease-out"
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}

export default ProgressBar
