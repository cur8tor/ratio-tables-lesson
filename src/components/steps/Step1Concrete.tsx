import { useEffect, useState } from 'react'
import DropZone from '../primitives/DropZone'
import NumberInput, { type InputStatus } from '../primitives/NumberInput'
import Trapezoid from '../primitives/Trapezoid'
import type { StepComponentProps } from './types'

const HEX_LAYOUT = [
  { left: '8%', top: '8%', rotate: '-6deg' },
  { left: '34%', top: '28%', rotate: '4deg' },
  { left: '18%', top: '56%', rotate: '-4deg' },
  { left: '52%', top: '14%', rotate: '8deg' },
] as const

const BANK_LAYOUT = [
  { left: '8%', top: '10%', rotate: '-8deg', direction: 'up' as const },
  { left: '30%', top: '8%', rotate: '5deg', direction: 'down' as const },
  { left: '52%', top: '12%', rotate: '-5deg', direction: 'up' as const },
  { left: '74%', top: '8%', rotate: '6deg', direction: 'down' as const },
  { left: '16%', top: '36%', rotate: '4deg', direction: 'down' as const },
  { left: '38%', top: '34%', rotate: '-6deg', direction: 'up' as const },
  { left: '62%', top: '38%', rotate: '8deg', direction: 'down' as const },
  { left: '10%', top: '62%', rotate: '-4deg', direction: 'up' as const },
  { left: '34%', top: '62%', rotate: '7deg', direction: 'down' as const },
  { left: '58%', top: '66%', rotate: '-7deg', direction: 'up' as const },
] as const

const Step1Concrete = ({ onReadyChange, onCorrect }: StepComponentProps) => {
  const [zoneFills, setZoneFills] = useState<number[]>(
    Array.from({ length: HEX_LAYOUT.length }, () => 0),
  )
  const [value, setValue] = useState('')
  const [status, setStatus] = useState<InputStatus>('idle')
  const [solved, setSolved] = useState(false)

  useEffect(() => {
    onReadyChange(false)
  }, [onReadyChange])

  const placedCount = zoneFills.reduce((total, fills) => total + fills, 0)
  const allCovered = zoneFills.every((fills) => fills === 2)
  const directionsByZone = zoneFills.map((fills) =>
    Array.from({ length: fills }, (_, index) => (index === 0 ? 'up' : 'down')),
  )

  const handleSubmit = () => {
    const parsed = Number(value)
    if (!solved && parsed === 2 && allCovered) {
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
      <p className="max-w-2xl text-sm text-secondary">
        You are packing pattern blocks for a class game. Cover all yellow hexagons with red
        trapezoids, then find the unit rate in trapezoids per hexagon.
      </p>
      <div className="grid w-full gap-4 md:grid-cols-2">
        <div className="relative h-72 rounded-2xl border border-secondary/20 bg-surface p-4">
          {HEX_LAYOUT.map((piece, index) => (
            <div
              key={index}
              className="absolute"
              style={{ left: piece.left, top: piece.top, transform: `rotate(${piece.rotate})` }}
            >
              <DropZone
                label={`hexagon ${index + 1}`}
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
      <div className="flex flex-col items-center gap-3">
        <label className="text-sm text-secondary">
          What is the unit rate (trapezoids per 1 hexagon)?
        </label>
        <NumberInput
          value={value}
          onChange={(next) => {
            setValue(next)
            setStatus('idle')
          }}
          onSubmit={handleSubmit}
          status={status}
          ariaLabel="Trapezoids per hexagon"
        />
      </div>
      <p className="text-xs text-secondary">Placed trapezoids: {placedCount}</p>
    </div>
  )
}

export default Step1Concrete
