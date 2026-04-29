import { useEffect, useState } from 'react'
import RatioTable, { type Row } from '../lesson/RatioTable'
import type { InputStatus } from '../primitives/NumberInput'
import type { StepComponentProps } from './types'

const Step3Table = ({ onReadyChange, onCorrect }: StepComponentProps) => {
  const [value, setValue] = useState('')
  const [status, setStatus] = useState<InputStatus>('idle')
  const [solved, setSolved] = useState(false)

  useEffect(() => {
    onReadyChange(false)
  }, [onReadyChange])

  const handleSubmit = () => {
    if (!solved && Number(value) === 4) {
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
      hex: { kind: 'shape', shape: 'hex', count: 1 },
      cop: { kind: 'fraction', top: 2, bottom: 1 },
      trap: { kind: 'shape', shape: 'trap', count: 2 },
    },
    {
      hex: { kind: 'shape', shape: 'hex', count: 3 },
      cop: { kind: 'fraction', top: 2, bottom: 1 },
      trap: { kind: 'shape', shape: 'trap', count: 6 },
    },
    {
      hex: { kind: 'number', value: 2 },
      cop: { kind: 'fraction', top: 2, bottom: 1 },
      trap: {
        kind: 'input',
        value,
        onChange: (next) => {
          setValue(next)
          setStatus('idle')
        },
        onSubmit: handleSubmit,
        status,
        correct: 4,
      },
    },
  ]

  return (
    <div className="flex flex-col items-center gap-4">
      <RatioTable rows={rows} />
      <p className="text-sm text-secondary">Fill in the missing trapezoid count.</p>
    </div>
  )
}

export default Step3Table
