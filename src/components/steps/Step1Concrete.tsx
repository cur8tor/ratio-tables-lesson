import { useEffect, useState } from 'react'
import DropZone from '../primitives/DropZone'
import NumberInput, { type InputStatus } from '../primitives/NumberInput'
import Trapezoid from '../primitives/Trapezoid'
import type { StepComponentProps } from './types'

type TrapPiece = {
  id: string
  direction: 'up' | 'down'
  zoneIndex: number | null
}

const Step1Concrete = ({ onReadyChange, onCorrect }: StepComponentProps) => {
  const [hexCount] = useState(() => Math.floor(Math.random() * 3) + 3)
  const [traps, setTraps] = useState<TrapPiece[]>(() => {
    const total = hexCount * 2 + 8
    return Array.from({ length: total }).map((_, index) => ({
      id: `step1-trap-${index}`,
      direction: index % 2 === 0 ? 'up' : 'down',
      zoneIndex: null,
    }))
  })
  const [value, setValue] = useState('')
  const [status, setStatus] = useState<InputStatus>('idle')
  const [solved, setSolved] = useState(false)

  useEffect(() => {
    onReadyChange(false)
  }, [onReadyChange])

  const required = hexCount * 2
  const placedCount = traps.filter((trap) => trap.zoneIndex !== null).length

  const directionsByZone = Array.from({ length: hexCount }, (_, zoneIndex) =>
    traps
      .filter((trap) => trap.zoneIndex === zoneIndex)
      .map((_, index) => (index === 0 ? 'up' : 'down')),
  )

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
    <div className="flex w-full max-w-xl flex-col items-center gap-6">
      <div className="flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-secondary/20 bg-surface p-4">
        {directionsByZone.map((directions, index) => (
          <DropZone
            key={index}
            label={`hexagon ${index + 1}`}
            placedDirections={directions}
            onDrop={(trapId) => {
              if (directions.length >= 2) return
              setTraps((current) =>
                current.map((trap) =>
                  trap.id === trapId ? { ...trap, zoneIndex: index } : trap,
                ),
              )
            }}
            size={24}
          />
        ))}
      </div>
      <div className="flex max-h-32 w-full flex-wrap items-center justify-center gap-2 overflow-y-auto rounded-xl border border-secondary/20 bg-surface p-3">
        {traps.filter((trap) => trap.zoneIndex === null).map((trap) => (
          <div
            key={trap.id}
            draggable
            onDragStart={(event) => event.dataTransfer.setData('text/plain', trap.id)}
            className="cursor-grab active:cursor-grabbing"
          >
            <Trapezoid
              size={16}
              direction={trap.direction}
              className="h-10 w-10"
              stroke="#1F2937"
              strokeWidth={1.2}
            />
          </div>
        ))}
      </div>
      <p className="text-sm text-secondary">Drag trapezoids onto every hexagon until all are fully covered.</p>
      <div className="flex flex-col items-center gap-3">
        <label className="text-sm text-secondary">How many trapezoids did it take to cover all hexagons?</label>
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
