import { useEffect, useState } from 'react'
import RatioTable, { type Row } from '../lesson/RatioTable'
import COPFraction from '../primitives/COPFraction'
import type { InputStatus } from '../primitives/NumberInput'
import type { StepComponentProps } from './types'

const Step6WordProblem = ({ onReadyChange, onCorrect }: StepComponentProps) => {
  const [value, setValue] = useState('')
  const [status, setStatus] = useState<InputStatus>('idle')
  const [solved, setSolved] = useState(false)

  useEffect(() => {
    onReadyChange(false)
  }, [onReadyChange])

  const handleSubmit = () => {
    if (!solved && Number(value) === 8) {
      setStatus('correct')
      onReadyChange(true)
      setSolved(true)
      window.setTimeout(onCorrect, 350)
      return
    }
    setStatus('wrong')
  }

  const rows: Row[] = [
    {
      hex: { kind: 'number', value: 1 },
      cop: { kind: 'fraction', top: 2, bottom: 1 },
      trap: { kind: 'number', value: 2 },
    },
    {
      hex: {
        kind: 'input',
        value,
        onChange: (next) => {
          setValue(next)
          setStatus('idle')
        },
        onSubmit: handleSubmit,
        status,
        correct: 8,
      },
      cop: { kind: 'fraction', top: 2, bottom: 1 },
      trap: { kind: 'number', value: 16 },
    },
  ]

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-5">
      <p className="max-w-xl text-center text-sm text-secondary">
        A student has 16 trapezoids in their kit. Use the same ratio to find how many hexagons
        those trapezoids can fill.
      </p>
      <RatioTable rows={rows} />
      <COPFraction numerator={2} denominator={1} label="trapezoids per hexagon" />
    </div>
  )
}

export default Step6WordProblem
