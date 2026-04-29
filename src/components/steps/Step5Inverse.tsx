import { useEffect, useState } from 'react'
import RatioTable, { type Row } from '../lesson/RatioTable'
import COPFraction from '../primitives/COPFraction'
import type { InputStatus } from '../primitives/NumberInput'
import type { StepComponentProps } from './types'

const Step5Inverse = ({ onReadyChange, onCorrect }: StepComponentProps) => {
  const [value, setValue] = useState('')
  const [status, setStatus] = useState<InputStatus>('idle')
  const [solved, setSolved] = useState(false)

  useEffect(() => {
    onReadyChange(false)
  }, [onReadyChange])

  const handleSubmit = () => {
    if (!solved && Number(value) === 7) {
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
      hex: { kind: 'number', value: 5 },
      cop: { kind: 'fraction', top: 2, bottom: 1 },
      trap: { kind: 'number', value: 10 },
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
        correct: 7,
      },
      cop: { kind: 'fraction', top: 2, bottom: 1 },
      trap: { kind: 'number', value: 14 },
    },
  ]

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <RatioTable rows={rows} />
      <COPFraction numerator={2} denominator={1} label="trapezoids per hexagon" />
    </div>
  )
}

export default Step5Inverse
