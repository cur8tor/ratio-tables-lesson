import { useEffect, useState } from 'react'
import DropZone from '../primitives/DropZone'
import NumberInput, { type InputStatus } from '../primitives/NumberInput'
import Trapezoid from '../primitives/Trapezoid'
import type { StepComponentProps } from './types'

const HEX_COUNT = 6
const BANK_COUNT = 14

const Step2ConcreteScaled = ({ onReadyChange, onCorrect }: StepComponentProps) => {
  const [zoneFills, setZoneFills] = useState<number[]>(
    Array.from({ length: HEX_COUNT }, () => 0),
  )
  const [value, setValue] = useState('')
  const [status, setStatus] = useState<InputStatus>('idle')
  const [solved, setSolved] = useState(false)

  useEffect(() => {
    onReadyChange(false)
  }, [onReadyChange])

  const required = HEX_COUNT * 2
  const placedCount = zoneFills.reduce((total, fills) => total + fills, 0)
  const directionsByZone = zoneFills.map((fills) =>
    Array.from({ length: fills }, (_, index) => (index === 0 ? 'up' : 'down')),
  )
  const placeInNextOpenSlot = () => {
    setZoneFills((current) => {
      const nextOpenIndex = current.findIndex((fills) => fills < 2)
      if (nextOpenIndex === -1) return current
      const next = [...current]
      next[nextOpenIndex] += 1
      return next
    })
  }

  const handleSubmit = () => {
    const parsed = Number(value)
    if (!solved && parsed === required && placedCount === required) {
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
      <div className="grid w-full gap-4 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-secondary/20 bg-surface p-4">
          <div className="grid grid-cols-3 gap-4">
            {directionsByZone.map((directions, index) => (
              <DropZone
                key={index}
                label={`hexagon ${index + 1} drop zone`}
                placedDirections={directions}
                onDrop={() =>
                  setZoneFills((current) =>
                    current.map((fills, i) => (i === index ? Math.min(2, fills + 1) : fills)),
                  )
                }
                size={22}
              />
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-secondary/20 bg-surface p-4">
          <p className="mb-3 text-xs text-secondary">Trapezoid bank (drag or click to auto-place)</p>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: BANK_COUNT }).map((_, index) => (
              <button
                key={index}
                type="button"
                draggable
                onClick={placeInNextOpenSlot}
                onDragStart={(event) => event.dataTransfer.setData('text/plain', 'trap')}
                className="flex h-12 items-center justify-center rounded-lg border border-secondary/20 bg-white cursor-grab active:cursor-grabbing"
              >
                <Trapezoid
                  size={12}
                  fit="tight"
                  direction={index % 2 === 0 ? 'up' : 'down'}
                  className="h-6 w-10"
                  stroke="#1F2937"
                  strokeWidth={1.2}
                />
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-secondary">
            Click places into the next open hexagon half. Drag still works too.
          </p>
        </div>
      </div>
      <p className="text-sm text-secondary">Keep placing until all six hexagons are covered.</p>
      <div className="flex flex-col items-center gap-3">
        <label className="text-sm text-secondary">How many trapezoids do 6 hexagons need?</label>
        <NumberInput
          value={value}
          onChange={(next) => {
            setValue(next)
            setStatus('idle')
          }}
          onSubmit={handleSubmit}
          status={status}
          ariaLabel="How many trapezoids for 6 hexagons"
        />
      </div>
      <p className="text-xs text-secondary">Placed trapezoids: {placedCount}</p>
    </div>
  )
}

export default Step2ConcreteScaled
