import { useEffect } from 'react'
import type { StepComponentProps } from './types'

const StepIntroGoal = ({ onReadyChange, onCorrectChange, registerCheck }: StepComponentProps) => {
  useEffect(() => {
    onReadyChange(true)
    onCorrectChange?.(true)
  }, [onCorrectChange, onReadyChange])

  useEffect(() => {
    registerCheck?.(() => {
      onCorrectChange?.(true)
      return true
    })
  }, [onCorrectChange, registerCheck])

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-secondary/20 bg-surface p-8">
      <p className="text-xs font-medium uppercase tracking-wide text-secondary">
        Standard: CCSS 6.RP.A.1
      </p>
      <h2 className="mt-2 text-xl font-semibold text-primary">Goal</h2>
      <p className="mt-3 text-sm leading-relaxed text-secondary">
        Balance hexagons and trapezoids, then represent the ratio in a table.
      </p>
    </div>
  )
}

export default StepIntroGoal
