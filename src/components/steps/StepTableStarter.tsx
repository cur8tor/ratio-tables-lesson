import { useEffect, useMemo, useState } from 'react'
import Hexagon from '../primitives/Hexagon'
import NumberInput, { type InputStatus } from '../primitives/NumberInput'
import Trapezoid from '../primitives/Trapezoid'
import type { StepComponentProps } from './types'

type StarterRow = { hex: number; trap: number }

type StepTableStarterProps = StepComponentProps & {
  given: { hex?: number; trap?: number }
  answer: number
  history?: StarterRow[]
  showScale?: boolean
}

const StepTableStarter = ({
  given,
  answer,
  history = [],
  showScale = false,
  onReadyChange,
  onCorrectChange,
  registerCheck,
}: StepTableStarterProps) => {
  const [value, setValue] = useState('')
  const [status, setStatus] = useState<InputStatus>('idle')
  const [scaleHex, setScaleHex] = useState(given.hex ?? 0)
  const [scaleTrap, setScaleTrap] = useState(given.trap ?? 0)

  const balanceState = useMemo(() => {
    if (scaleTrap < scaleHex * 2) return 'Right side is lighter'
    if (scaleTrap > scaleHex * 2) return 'Right side is heavier'
    return 'Balanced'
  }, [scaleHex, scaleTrap])

  useEffect(() => {
    onReadyChange(value.trim().length > 0)
    onCorrectChange?.(false)
  }, [onCorrectChange, onReadyChange, value])

  useEffect(() => {
    registerCheck?.(() => {
      const ok = Number(value) === answer
      setStatus(ok ? 'correct' : 'wrong')
      onCorrectChange?.(ok)
    })
  }, [answer, onCorrectChange, registerCheck, value])

  return (
    <div className="flex w-full max-w-4xl flex-col items-center gap-6">
      {showScale ? (
        <div className="w-full max-w-3xl">
          <div className="relative h-44">
            <div className="absolute left-1/2 top-8 h-2 w-[70%] -translate-x-1/2 rounded-full bg-primary/70" />
            <div className="absolute left-1/2 top-8 h-16 w-1 -translate-x-1/2 bg-primary/70" />
            <div className="absolute left-[20%] top-10 -translate-x-1/2">
              <div className="mx-auto h-12 w-px bg-primary/50" />
              <div className="flex flex-col items-center gap-1">
                {Array.from({ length: Math.max(1, scaleHex) }).map((_, index) => (
                  <Hexagon key={index} size={9} fill="#FFD63B" className="h-6 w-6" />
                ))}
              </div>
            </div>
            <div className="absolute left-[80%] top-10 -translate-x-1/2">
              <div className="mx-auto h-12 w-px bg-primary/50" />
              <div className="flex flex-col items-center gap-0.5">
                {Array.from({ length: Math.max(1, scaleTrap) }).slice(0, 12).map((_, index) => (
                  <Trapezoid
                    key={index}
                    size={8}
                    fit="tight"
                    direction={index % 2 === 0 ? 'up' : 'down'}
                    className="h-3 w-5"
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="text-center text-sm text-secondary">{balanceState}</div>
          <div className="mt-2 flex justify-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setScaleHex((count) => Math.max(0, count - 1))}
              className="rounded border border-secondary/30 px-2 py-1"
            >
              - hex
            </button>
            <button
              type="button"
              onClick={() => setScaleHex((count) => count + 1)}
              className="rounded border border-secondary/30 px-2 py-1"
            >
              + hex
            </button>
            <button
              type="button"
              onClick={() => setScaleTrap((count) => Math.max(0, count - 1))}
              className="rounded border border-secondary/30 px-2 py-1"
            >
              - trap
            </button>
            <button
              type="button"
              onClick={() => setScaleTrap((count) => count + 1)}
              className="rounded border border-secondary/30 px-2 py-1"
            >
              + trap
            </button>
          </div>
        </div>
      ) : null}

      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-secondary/20 bg-surface">
        <table className="w-full border-collapse text-center">
          <thead>
            <tr className="border-b border-secondary/20">
              <th className="border-r border-secondary/20 px-4 py-3 text-sm font-medium text-secondary">
                Hexagons
              </th>
              <th className="px-4 py-3 text-sm font-medium text-secondary">Trapezoids</th>
            </tr>
          </thead>
          <tbody>
            {history.map((row, index) => (
              <tr key={index} className="border-b border-secondary/15">
                <td className="border-r border-secondary/15 px-4 py-3">{row.hex}</td>
                <td className="px-4 py-3">{row.trap}</td>
              </tr>
            ))}
            <tr>
              <td className="border-r border-secondary/15 px-4 py-3">
                {given.hex !== undefined ? (
                  given.hex
                ) : (
                  <NumberInput
                    value={value}
                    onChange={(next) => {
                      setValue(next)
                      setStatus('idle')
                    }}
                    onSubmit={() => {}}
                    status={status}
                    ariaLabel="table input"
                    className="h-10 w-20 text-lg"
                  />
                )}
              </td>
              <td className="px-4 py-3">
                {given.trap === undefined ? (
                  <NumberInput
                    value={value}
                    onChange={(next) => {
                      setValue(next)
                      setStatus('idle')
                    }}
                    onSubmit={() => {}}
                    status={status}
                    ariaLabel="table input"
                    className="h-10 w-20 text-lg"
                  />
                ) : (
                  given.trap
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default StepTableStarter
