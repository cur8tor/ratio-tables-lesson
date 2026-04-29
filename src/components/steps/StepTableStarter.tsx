import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
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
  const valueRef = useRef('')
  const answerRef = useRef(answer)
  const scaleContainerRef = useRef<HTMLDivElement | null>(null)
  const [containerWidth, setContainerWidth] = useState(900)
  const [scaleHex, setScaleHex] = useState(given.hex ?? (given.trap !== undefined ? 0 : 1))
  const [scaleTrap, setScaleTrap] = useState(given.trap ?? (given.hex ?? 1) * 2)
  const fixedHex = given.hex !== undefined
  const fixedTrap = given.trap !== undefined

  useEffect(() => {
    onReadyChange(value.trim().length > 0)
    onCorrectChange?.(false)
    valueRef.current = value
  }, [onCorrectChange, onReadyChange, value])

  useEffect(() => {
    answerRef.current = answer
  }, [answer])

  useEffect(() => {
    if (!showScale) return
    const nextHex = given.hex ?? (given.trap !== undefined ? 0 : 1)
    const nextTrap = given.trap ?? nextHex * 2
    setScaleHex(nextHex)
    setScaleTrap(nextTrap)
  }, [given.hex, given.trap, showScale])

  useEffect(() => {
    if (!showScale) return

    const measure = () => {
      const nextWidth = scaleContainerRef.current?.clientWidth
      if (nextWidth) setContainerWidth(nextWidth)
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [showScale])

  useEffect(() => {
    registerCheck?.(() => {
      const ok = Number(valueRef.current) === answerRef.current
      setStatus(ok ? 'correct' : 'wrong')
      onCorrectChange?.(ok)
      return ok
    })
  }, [onCorrectChange, registerCheck])

  const requiredTraps = scaleHex * 2
  const imbalance = scaleTrap - requiredTraps
  const beamAngle = Math.max(-14, Math.min(14, imbalance * 4))
  const beamLength = Math.max(220, Math.min(560, containerWidth * 0.82))
  const beamY = 64
  const angleRadians = (beamAngle * Math.PI) / 180
  const halfProjectionX = (beamLength / 2) * Math.cos(angleRadians)
  const halfProjectionY = (beamLength / 2) * Math.sin(angleRadians)

  const leftTipLeft = `calc(50% - ${halfProjectionX}px)`
  const rightTipLeft = `calc(50% + ${halfProjectionX}px)`
  const leftTipTop = beamY - halfProjectionY
  const rightTipTop = beamY + halfProjectionY

  return (
    <div className="flex w-full max-w-4xl flex-col items-center gap-6">
      {showScale ? (
        <div className="w-full p-2">
          <div ref={scaleContainerRef} className="relative mx-auto h-80 w-full max-w-3xl">
            <div className="absolute left-1/2 top-12 z-10 h-24 w-1 -translate-x-1/2 bg-primary/70" />
            <div className="absolute left-1/2 top-[108px] h-16 w-10 -translate-x-1/2 rounded-t-full bg-primary/10" />

            <div
              className="absolute left-1/2 h-2 -translate-x-1/2"
              style={{ width: `${beamLength}px`, top: `${beamY}px` }}
            >
              <motion.div
                className="h-full w-full rounded-full bg-primary/70"
                animate={{ rotate: beamAngle }}
                transition={{ type: 'spring', stiffness: 160, damping: 18 }}
                style={{ transformOrigin: 'center center' }}
              />
            </div>

            <motion.div
              className="absolute -translate-x-1/2"
              style={{ left: leftTipLeft, top: `${leftTipTop}px` }}
              animate={{ left: leftTipLeft, top: `${leftTipTop}px` }}
              transition={{ type: 'spring', stiffness: 190, damping: 22 }}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault()
                if (event.dataTransfer.getData('shape') === 'hex') {
                  if (fixedHex) return
                  setScaleHex((count) => count + 1)
                  onCorrectChange?.(false)
                }
              }}
            >
              <div className="mx-auto h-16 w-px bg-primary/60" />
              <div className="flex flex-col items-center gap-1">
                {Array.from({ length: Math.max(0, scaleHex) }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      if (fixedHex) return
                      setScaleHex((count) => Math.max(0, count - 1))
                      onCorrectChange?.(false)
                    }}
                    className="rounded border border-transparent hover:border-secondary/30"
                  >
                    <Hexagon size={10} fill="#FFD63B" className="h-7 w-7 sm:h-8 sm:w-8" />
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="absolute -translate-x-1/2"
              style={{ left: rightTipLeft, top: `${rightTipTop}px` }}
              animate={{ left: rightTipLeft, top: `${rightTipTop}px` }}
              transition={{ type: 'spring', stiffness: 190, damping: 22 }}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault()
                if (event.dataTransfer.getData('shape') === 'trap') {
                  if (fixedTrap) return
                  setScaleTrap((count) => count + 1)
                  onCorrectChange?.(false)
                }
              }}
            >
              <div className="mx-auto h-16 w-px bg-primary/60" />
              <div className="flex flex-col items-center gap-0.5">
                {Array.from({ length: Math.max(0, scaleTrap) }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      if (fixedTrap) return
                      setScaleTrap((count) => Math.max(0, count - 1))
                      onCorrectChange?.(false)
                    }}
                    className="rounded border border-transparent hover:border-secondary/30"
                  >
                    <Trapezoid
                      size={8}
                      fit="tight"
                      direction={index % 2 === 0 ? 'up' : 'down'}
                      className="h-3.5 w-7 sm:h-4 sm:w-8"
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      ) : null}

      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-secondary/20 bg-surface">
        <table className="w-full border-collapse text-center">
          <colgroup>
            <col style={{ width: '50%' }} />
            <col style={{ width: '50%' }} />
          </colgroup>
          <thead>
            <tr className="border-b border-secondary/20">
              <th className="border-r border-secondary/20 px-4 py-3 text-sm font-medium text-secondary">
                <div className="flex justify-center">
                  <Hexagon size={9} fill="#FFD63B" className="h-5 w-5" />
                </div>
              </th>
              <th className="px-4 py-3 text-sm font-medium text-secondary">
                <div className="flex justify-center">
                  <Trapezoid size={8} fit="tight" direction="up" className="h-3 w-5" />
                </div>
              </th>
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

      {showScale ? (
        <div className="fixed bottom-24 left-1/2 z-10 w-[92%] max-w-sm -translate-x-1/2 rounded-2xl border border-secondary/20 bg-white/95 p-3 shadow-sm backdrop-blur">
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              draggable
              onClick={() => {
                if (fixedHex) return
                setScaleHex((count) => count + 1)
                onCorrectChange?.(false)
              }}
              onDragStart={(event) => event.dataTransfer.setData('shape', 'hex')}
              className={`flex h-12 w-16 items-center justify-center rounded-lg border bg-surface ${
                fixedHex ? 'cursor-not-allowed border-secondary/10 opacity-40' : 'border-secondary/25'
              }`}
            >
              <Hexagon size={10} fill="#FFD63B" className="h-7 w-7" />
            </button>
            <button
              type="button"
              draggable
              onClick={() => {
                if (fixedTrap) return
                setScaleTrap((count) => count + 1)
                onCorrectChange?.(false)
              }}
              onDragStart={(event) => event.dataTransfer.setData('shape', 'trap')}
              className={`flex h-12 w-16 items-center justify-center rounded-lg border bg-surface ${
                fixedTrap ? 'cursor-not-allowed border-secondary/10 opacity-40' : 'border-secondary/25'
              }`}
            >
              <Trapezoid size={10} fit="tight" direction="up" className="h-5 w-8" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default StepTableStarter
