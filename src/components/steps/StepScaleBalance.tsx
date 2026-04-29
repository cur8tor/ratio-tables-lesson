import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Hexagon from '../primitives/Hexagon'
import NumberInput from '../primitives/NumberInput'
import Trapezoid from '../primitives/Trapezoid'
import type { StepComponentProps } from './types'

type StepScaleBalanceProps = StepComponentProps & {
  hexCount: number
}

const StepScaleBalance = ({ hexCount, onReadyChange }: StepScaleBalanceProps) => {
  const [trapCount, setTrapCount] = useState(0)
  const [hexValue, setHexValue] = useState('')
  const [trapValue, setTrapValue] = useState('')

  const requiredTraps = hexCount * 2
  const balanced = trapCount === requiredTraps
  const rowCorrect = Number(hexValue) === hexCount && Number(trapValue) === requiredTraps
  const solved = balanced && rowCorrect
  const imbalance = trapCount - requiredTraps
  const beamAngle = Math.max(-14, Math.min(14, imbalance * 4))
  const beamLength = 560
  const beamY = 52
  const angleRadians = (beamAngle * Math.PI) / 180
  const halfProjectionX = (beamLength / 2) * Math.cos(angleRadians)
  const halfProjectionY = (beamLength / 2) * Math.sin(angleRadians)

  const leftTipLeft = `calc(50% - ${halfProjectionX}px)`
  const rightTipLeft = `calc(50% + ${halfProjectionX}px)`
  const leftTipTop = beamY - halfProjectionY
  const rightTipTop = beamY + halfProjectionY

  useEffect(() => {
    onReadyChange(solved)
  }, [onReadyChange, solved])

  const balanceState = useMemo(() => {
    if (trapCount < requiredTraps) return 'Right side is lighter'
    if (trapCount > requiredTraps) return 'Right side is heavier'
    return 'Balanced'
  }, [requiredTraps, trapCount])

  return (
    <div className="flex w-full max-w-4xl flex-col items-center gap-6 pb-24">
      <div className="w-full rounded-2xl border border-secondary/20 bg-surface p-6">
        <div className="mb-2 text-center text-sm text-secondary">
          Drag shapes from the toolbar into the scale.
        </div>
        <div className="relative mx-auto h-64 w-full max-w-3xl">
          <div className="absolute left-1/2 top-10 z-10 h-24 w-1 -translate-x-1/2 bg-primary/70" />
          <div className="absolute left-1/2 top-[106px] h-16 w-10 -translate-x-1/2 rounded-t-full bg-primary/10" />

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
          >
            <div className="mx-auto h-16 w-px bg-primary/60" />
            <div className="flex flex-col items-center gap-1">
              {Array.from({ length: hexCount }).map((_, index) => (
                <Hexagon key={index} size={10} fill="#FFD63B" className="h-8 w-8" />
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
                setTrapCount((count) => count + 1)
              }
            }}
          >
            <div className="mx-auto h-16 w-px bg-primary/60" />
            <div className="flex flex-col items-center gap-0.5">
              {Array.from({ length: Math.min(trapCount, 8) }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setTrapCount((count) => Math.max(0, count - 1))}
                  className={`flex h-4 items-center justify-center rounded border px-1 ${
                    balanced
                      ? 'border-accent/30 hover:border-accent/60'
                      : 'border-transparent hover:border-secondary/30'
                  }`}
                >
                  <Trapezoid
                    size={8}
                    fit="tight"
                    direction={index % 2 === 0 ? 'up' : 'down'}
                    className="h-4 w-8"
                  />
                </button>
              ))}
              {trapCount > 8 ? <span className="text-xs text-secondary">+{trapCount - 8}</span> : null}
            </div>
          </motion.div>
        </div>
        <div className="mt-2 flex items-center justify-center gap-3 text-sm">
          <span className={balanced ? 'text-accent' : 'text-secondary'}>{balanceState}</span>
          <span className="text-xs text-secondary">Tip: click traps in right bucket to remove</span>
        </div>
      </div>

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
            <tr className="border-b border-secondary/15">
              <td className="border-r border-secondary/15 px-4 py-3">
                <div className="flex items-center justify-center gap-1">
                  {Array.from({ length: hexCount }).map((_, index) => (
                    <Hexagon key={index} size={10} fill="#FFD63B" className="h-5 w-5" />
                  ))}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-center gap-1">
                  {Array.from({ length: trapCount }).slice(0, 12).map((_, index) => (
                    <Trapezoid
                      key={index}
                      size={8}
                      fit="tight"
                      direction={index % 2 === 0 ? 'up' : 'down'}
                      className="h-3 w-5"
                    />
                  ))}
                  {trapCount > 12 ? <span className="text-xs text-secondary">+{trapCount - 12}</span> : null}
                </div>
              </td>
            </tr>
            <tr>
              <td className="border-r border-secondary/15 px-4 py-3">
                <NumberInput
                  value={hexValue}
                  onChange={setHexValue}
                  onSubmit={() => {}}
                  status="idle"
                  ariaLabel="hexagon count input"
                  className="h-10 w-20 text-lg"
                />
              </td>
              <td className="px-4 py-3">
                <NumberInput
                  value={trapValue}
                  onChange={setTrapValue}
                  onSubmit={() => {}}
                  status="idle"
                  ariaLabel="trapezoid count input"
                  className="h-10 w-20 text-lg"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="fixed bottom-24 left-1/2 z-10 w-full max-w-sm -translate-x-1/2 rounded-2xl border border-secondary/20 bg-white/95 p-3 shadow-sm backdrop-blur">
        <div className="mb-2 text-center text-xs text-secondary">Shape toolbar</div>
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            draggable
            onDragStart={(event) => event.dataTransfer.setData('shape', 'hex')}
            className="flex h-12 w-16 items-center justify-center rounded-lg border border-secondary/25 bg-surface"
          >
            <Hexagon size={10} fill="#FFD63B" className="h-7 w-7" />
          </button>
          <button
            type="button"
            draggable
            onClick={() => setTrapCount((count) => count + 1)}
            onDragStart={(event) => event.dataTransfer.setData('shape', 'trap')}
            className="flex h-12 w-16 items-center justify-center rounded-lg border border-secondary/25 bg-surface"
          >
            <Trapezoid size={10} fit="tight" direction="up" className="h-5 w-8" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default StepScaleBalance
