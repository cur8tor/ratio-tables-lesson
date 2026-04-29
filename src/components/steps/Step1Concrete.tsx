import { useEffect, useMemo, useState } from 'react'
import DropZone from '../primitives/DropZone'
import NumberInput, { type InputStatus } from '../primitives/NumberInput'
import Trapezoid from '../primitives/Trapezoid'
import type { StepComponentProps } from './types'

const Step1Concrete = ({ onReadyChange, onCorrect }: StepComponentProps) => {
  const [placed, setPlaced] = useState(0)
  const [value, setValue] = useState('')
  const [status, setStatus] = useState<InputStatus>('idle')
  const [solved, setSolved] = useState(false)

  useEffect(() => {
    onReadyChange(false)
  }, [onReadyChange])

  const placedDirections = useMemo(() => {
    if (placed === 0) return []
    if (placed === 1) return ['up'] as Array<'up' | 'down'>
    return ['up', 'down'] as Array<'up' | 'down'>
  }, [placed])

  const handleSubmit = () => {
    const parsed = Number(value)
    if (!solved && parsed === 2 && placed === 2) {
      setStatus('correct')
      onReadyChange(true)
      setSolved(true)
      window.setTimeout(onCorrect, 350)
      return
    }
    setStatus('wrong')
  }

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-6">
      <DropZone
        label="hexagon drop zone"
        placedDirections={placedDirections}
        onDrop={() => setPlaced((count) => Math.min(2, count + 1))}
        size={30}
      />
      <div className="flex items-center gap-3 rounded-xl border border-secondary/20 bg-surface p-3">
        {Array.from({ length: 2 - placed }).map((_, index) => (
          <Trapezoid
            key={index}
            size={20}
            direction={index % 2 === 0 ? 'up' : 'down'}
            className="h-14 w-14"
          />
        ))}
      </div>
      <p className="text-sm text-secondary">Tap the hexagon to place trapezoids from the tray.</p>
      <div className="flex flex-col items-center gap-3">
        <label className="text-sm text-secondary">How many trapezoids did it take?</label>
        <NumberInput
          value={value}
          onChange={(next) => {
            setValue(next)
            setStatus('idle')
          }}
          onSubmit={handleSubmit}
          status={status}
          ariaLabel="How many trapezoids did it take"
        />
      </div>
    </div>
  )
}

export default Step1Concrete
