import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Hexagon from '../primitives/Hexagon'
import Trapezoid from '../primitives/Trapezoid'
import type { StepComponentProps } from './types'

type StepScaleBalanceProps = StepComponentProps & {
  targetHex: number
  requireDifferentFrom?: { hex: number; trap: number }
}

const StepScaleBalance = ({
  targetHex,
  requireDifferentFrom,
  onReadyChange,
  onCorrectChange,
  registerCheck,
}: StepScaleBalanceProps) => {
  const scaleContainerRef = useRef<HTMLDivElement | null>(null)
  const [hexCount, setHexCount] = useState(targetHex)
  const [trapCount, setTrapCount] = useState(0)
  const [containerWidth, setContainerWidth] = useState(900)
  const previousTarget = useRef(targetHex)

  useEffect(() => {
    if (previousTarget.current !== targetHex) {
      setHexCount(targetHex)
      setTrapCount(0)
      previousTarget.current = targetHex
    }
  }, [targetHex])

  const effectiveHexCount = Math.max(hexCount, targetHex)

  const requiredTraps = effectiveHexCount * 2
  const balanced = trapCount === requiredTraps
  const imbalance = trapCount - requiredTraps
  const beamAngle = Math.max(-14, Math.min(14, imbalance * 4))
  const beamLength = Math.max(220, Math.min(560, containerWidth * 0.82))
  const beamY = 52
  const angleRadians = (beamAngle * Math.PI) / 180
  const halfProjectionX = (beamLength / 2) * Math.cos(angleRadians)
  const halfProjectionY = (beamLength / 2) * Math.sin(angleRadians)

  const leftTipLeft = `calc(50% - ${halfProjectionX}px)`
  const rightTipLeft = `calc(50% + ${halfProjectionX}px)`
  const leftTipTop = beamY - halfProjectionY
  const rightTipTop = beamY + halfProjectionY

  useEffect(() => {
    const measure = () => {
      const nextWidth = scaleContainerRef.current?.clientWidth
      if (nextWidth) setContainerWidth(nextWidth)
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const solved =
    balanced &&
    effectiveHexCount >= targetHex &&
    (!requireDifferentFrom ||
      effectiveHexCount !== requireDifferentFrom.hex ||
      trapCount !== requireDifferentFrom.trap)

  useEffect(() => {
    onReadyChange(true)
    onCorrectChange?.(false)
  }, [onCorrectChange, onReadyChange, targetHex])

  useEffect(() => {
    registerCheck?.(() => {
      onCorrectChange?.(solved)
    })
  }, [onCorrectChange, registerCheck, solved])

  return (
    <div className="flex w-full max-w-4xl flex-col items-center gap-6 pb-24">
      <div className="w-full p-2">
        <div ref={scaleContainerRef} className="relative mx-auto h-72 w-full max-w-3xl">
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
              {Array.from({ length: effectiveHexCount }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setHexCount((count) => Math.max(0, count - 1))
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
                setTrapCount((count) => count + 1)
                onCorrectChange?.(false)
              }
            }}
          >
            <div className="mx-auto h-16 w-px bg-primary/60" />
            <div className="flex flex-col items-center gap-0.5">
              {Array.from({ length: Math.min(trapCount, 8) }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                    onClick={() => {
                      setTrapCount((count) => Math.max(0, count - 1))
                      onCorrectChange?.(false)
                    }}
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
                    className="h-3.5 w-7 sm:h-4 sm:w-8"
                  />
                </button>
              ))}
              {trapCount > 8 ? <span className="text-xs text-secondary">+{trapCount - 8}</span> : null}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="fixed bottom-24 left-1/2 z-10 w-[92%] max-w-sm -translate-x-1/2 rounded-2xl border border-secondary/20 bg-white/95 p-3 shadow-sm backdrop-blur">
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            draggable
            onClick={() => {
              setHexCount((count) => count + 1)
              onCorrectChange?.(false)
            }}
            onDragStart={(event) => event.dataTransfer.setData('shape', 'hex')}
            className="flex h-12 w-16 items-center justify-center rounded-lg border border-secondary/25 bg-surface"
          >
            <Hexagon size={10} fill="#FFD63B" className="h-7 w-7" />
          </button>
          <button
            type="button"
            draggable
            onClick={() => {
              setTrapCount((count) => count + 1)
              onCorrectChange?.(false)
            }}
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
