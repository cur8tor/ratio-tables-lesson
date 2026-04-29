import { useEffect, useState } from 'react'
import DropZone from '../primitives/DropZone'
import NumberInput, { type InputStatus } from '../primitives/NumberInput'
import Trapezoid from '../primitives/Trapezoid'
import type { StepComponentProps } from './types'

const Step2ConcreteScaled = ({ onReadyChange, onCorrect }: StepComponentProps) => {
  const [zones, setZones] = useState<number[]>([0, 0, 0])
  const [value, setValue] = useState('')
  const [status, setStatus] = useState<InputStatus>('idle')
  const [solved, setSolved] = useState(false)

  useEffect(() => {
    onReadyChange(false)
  }, [onReadyChange])

  const totalPlaced = zones.reduce((sum, current) => sum + current, 0)

  const handleSubmit = () => {
    const parsed = Number(value)
    if (!solved && parsed === 6 && totalPlaced === 6) {
      setStatus('correct')
      onReadyChange(true)
      setSolved(true)
      window.setTimeout(onCorrect, 350)
      return
    }
    setStatus('wrong')
  }

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-6">
      <div className="flex flex-wrap items-center justify-center gap-4">
        {zones.map((count, index) => (
          <DropZone
            key={index}
            label={`hexagon ${index + 1} drop zone`}
            placedDirections={count === 2 ? ['up', 'down'] : count === 1 ? ['up'] : []}
            onDrop={() =>
              setZones((current) => {
                const next = [...current]
                next[index] = Math.min(2, next[index] + 1)
                return next
              })
            }
            size={24}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2 rounded-xl border border-secondary/20 bg-surface p-3">
        {Array.from({ length: 6 - totalPlaced }).map((_, index) => (
          <Trapezoid
            key={index}
            size={16}
            direction={index % 2 === 0 ? 'up' : 'down'}
            className="h-10 w-10"
          />
        ))}
      </div>
      <p className="text-sm text-secondary">Fill all three hexagons, then answer.</p>
      <div className="flex flex-col items-center gap-3">
        <label className="text-sm text-secondary">How many trapezoids do 3 hexagons need?</label>
        <NumberInput
          value={value}
          onChange={(next) => {
            setValue(next)
            setStatus('idle')
          }}
          onSubmit={handleSubmit}
          status={status}
          ariaLabel="How many trapezoids for 3 hexagons"
        />
      </div>
    </div>
  )
}

export default Step2ConcreteScaled
