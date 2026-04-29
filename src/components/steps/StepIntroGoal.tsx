import { useEffect } from 'react'
import type { StepComponentProps } from './types'

const StepIntroGoal = ({ onReadyChange }: StepComponentProps) => {
  useEffect(() => {
    onReadyChange(true)
  }, [onReadyChange])

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-secondary/20 bg-surface p-8">
      <h2 className="text-2xl font-semibold text-primary">Lesson goal</h2>
      <p className="mt-4 text-base leading-relaxed text-secondary">
        Build intuition for ratios by balancing hexagons and trapezoids, then represent that
        relationship in a ratio table and use it to solve a word problem.
      </p>
      <p className="mt-3 text-base leading-relaxed text-secondary">
        You will discover a constant unit rate and apply it in both directions.
      </p>
    </div>
  )
}

export default StepIntroGoal
