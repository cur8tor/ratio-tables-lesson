import { useEffect, useState } from 'react'
import DropZone from '../primitives/DropZone'
import NumberInput, { type InputStatus } from '../primitives/NumberInput'
import Trapezoid from '../primitives/Trapezoid'
import type { StepComponentProps } from './types'

const HEX_LAYOUT = [
  { left: '6%', top: '6%', rotate: '-7deg' },
  { left: '30%', top: '10%', rotate: '5deg' },
  { left: '56%', top: '6%', rotate: '-5deg' },
  { left: '12%', top: '44%', rotate: '6deg' },
  { left: '38%', top: '50%', rotate: '-8deg' },
  { left: '62%', top: '44%', rotate: '4deg' },
] as const

const BANK_LAYOUT = [
  { left: '6%', top: '8%', rotate: '-7deg', direction: 'up' as const },
  { left: '24%', top: '8%', rotate: '6deg', direction: 'down' as const },
  { left: '42%', top: '8%', rotate: '-5deg', direction: 'up' as const },
  { left: '60%', top: '8%', rotate: '8deg', direction: 'down' as const },
  { left: '78%', top: '8%', rotate: '-4deg', direction: 'up' as const },
  { left: '10%', top: '34%', rotate: '7deg', direction: 'down' as const },
  { left: '28%', top: '34%', rotate: '-6deg', direction: 'up' as const },
  { left: '46%', top: '34%', rotate: '5deg', direction: 'down' as const },
  { left: '64%', top: '34%', rotate: '-8deg', direction: 'up' as const },
  { left: '82%', top: '34%', rotate: '4deg', direction: 'down' as const },
  { left: '12%', top: '60%', rotate: '-6deg', direction: 'up' as const },
  { left: '30%', top: '60%', rotate: '8deg', direction: 'down' as const },
  { left: '48%', top: '60%', rotate: '-5deg', direction: 'up' as const },
  { left: '66%', top: '60%', rotate: '6deg', direction: 'down' as const },
] as const

const Step2ConcreteScaled = ({ onReadyChange, onCorrect }: StepComponentProps) => {
  const [zoneFills, setZoneFills] = useState<number[]>(
    Array.from({ length: HEX_LAYOUT.length }, () => 0),
  )
  const [value, setValue] = useState('')
  const [status, setStatus] = useState<InputStatus>('idle')
  const [solved, setSolved] = useState(false)

  useEffect(() => {
    onReadyChange(false)
  }, [onReadyChange])

  const required = HEX_LAYOUT.length * 2
  const placedCount = zoneFills.reduce((total, fills) => total + fills, 0)
  const directionsByZone = zoneFills.map((fills) =>
    Array.from({ length: fills }, (_, index) => (index === 0 ? 'up' : 'down')),
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
    <div className="flex w-full max-w-2xl flex-col items-center gap-6">
      <div className="grid w-full gap-4 md:grid-cols-2">
        <div className="relative h-72 rounded-2xl border border-secondary/20 bg-surface p-4">
          {HEX_LAYOUT.map((piece, index) => (
            <div
              key={index}
              className="absolute"
              style={{ left: piece.left, top: piece.top, transform: `rotate(${piece.rotate})` }}
            >
              <DropZone
                label={`hexagon ${index + 1} drop zone`}
                placedDirections={directionsByZone[index]}
                onDrop={() =>
                  setZoneFills((current) =>
                    current.map((fills, i) => (i === index ? Math.min(2, fills + 1) : fills)),
                  )
                }
                size={22}
              />
            </div>
          ))}
        </div>
        <div className="relative h-72 rounded-2xl border border-secondary/20 bg-surface p-4">
          {BANK_LAYOUT.map((piece, index) => (
            <div
              key={index}
              draggable
              onDragStart={(event) => event.dataTransfer.setData('text/plain', 'trap')}
              className="absolute cursor-grab active:cursor-grabbing"
              style={{ left: piece.left, top: piece.top, transform: `rotate(${piece.rotate})` }}
            >
              <Trapezoid
                size={16}
                direction={piece.direction}
                className="h-10 w-10"
                stroke="#1F2937"
                strokeWidth={1.2}
              />
            </div>
          ))}
        </div>
      </div>
      <p className="text-sm text-secondary">Keep dragging from the bank until all six hexagons are covered.</p>
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
