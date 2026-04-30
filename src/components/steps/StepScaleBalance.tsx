import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Hexagon from '../primitives/Hexagon'
import Trapezoid from '../primitives/Trapezoid'
import type { StepComponentProps } from './types'

type StepScaleBalanceProps = StepComponentProps & {
  fixedHex?: number
  fixedTrap?: number
  initialHex?: number
  initialTrap?: number
}

const StepScaleBalance = ({
  fixedHex,
  fixedTrap,
  initialHex = 0,
  initialTrap = 0,
  registerScaleControls,
  onReadyChange,
  onCorrectChange,
  registerCheck,
}: StepScaleBalanceProps) => {
  const scaleContainerRef = useRef<HTMLDivElement | null>(null)
  const hexCountRef = useRef(initialHex)
  const trapCountRef = useRef(initialTrap)
  const [hexCount, setHexCount] = useState(initialHex)
  const [trapCount, setTrapCount] = useState(initialTrap)
  const [containerWidth, setContainerWidth] = useState(900)
  const configRef = useRef(`${fixedHex ?? 'x'}-${fixedTrap ?? 'x'}-${initialHex}-${initialTrap}`)

  useEffect(() => {
    const nextConfig = `${fixedHex ?? 'x'}-${fixedTrap ?? 'x'}-${initialHex}-${initialTrap}`
    if (configRef.current !== nextConfig) {
      setHexCount(initialHex)
      setTrapCount(initialTrap)
      hexCountRef.current = initialHex
      trapCountRef.current = initialTrap
      configRef.current = nextConfig
    }
  }, [fixedHex, fixedTrap, initialHex, initialTrap])

  useEffect(() => {
    const measure = () => {
      const nextWidth = scaleContainerRef.current?.clientWidth
      if (nextWidth) setContainerWidth(nextWidth)
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const effectiveHexCount = fixedHex ?? Math.max(0, hexCount)
  const effectiveTrapCount = fixedTrap ?? Math.max(0, trapCount)

  const requiredTraps = effectiveHexCount * 2
  const balanced = effectiveTrapCount === requiredTraps
  const imbalance = effectiveTrapCount - requiredTraps
  const beamAngle = Math.max(-14, Math.min(14, imbalance * 4))
  const beamLength = Math.max(160, Math.min(360, containerWidth * 0.58))
  const beamY = 78
  const spillDirection = imbalance === 0 ? 0 : imbalance > 0 ? 1 : -1
  const spillStrength = Math.min(1, Math.abs(imbalance) / 3)
  const angleRadians = (beamAngle * Math.PI) / 180
  const halfProjectionX = (beamLength / 2) * Math.cos(angleRadians)
  const halfProjectionY = (beamLength / 2) * Math.sin(angleRadians)

  const leftTipLeft = `calc(50% - ${halfProjectionX}px)`
  const rightTipLeft = `calc(50% + ${halfProjectionX}px)`
  const leftTipTop = beamY - halfProjectionY
  const rightTipTop = beamY + halfProjectionY

  const updateHexCount = (updater: (current: number) => number) => {
    if (fixedHex !== undefined) return
    const next = Math.max(0, updater(hexCountRef.current))
    hexCountRef.current = next
    setHexCount(next)
    onCorrectChange?.(false)
  }

  const updateTrapCount = (updater: (current: number) => number) => {
    if (fixedTrap !== undefined) return
    const next = Math.max(0, updater(trapCountRef.current))
    trapCountRef.current = next
    setTrapCount(next)
    onCorrectChange?.(false)
  }

  useEffect(() => {
    onReadyChange(true)
    onCorrectChange?.(false)
  }, [onCorrectChange, onReadyChange, fixedHex, fixedTrap, initialHex, initialTrap])

  useEffect(() => {
    registerCheck?.(() => {
      const liveHexCount = fixedHex ?? Math.max(0, hexCountRef.current)
      const liveTrapCount = fixedTrap ?? Math.max(0, trapCountRef.current)
      const ok = liveTrapCount === liveHexCount * 2
      onCorrectChange?.(ok)
      return ok
    })
  }, [fixedHex, fixedTrap, onCorrectChange, registerCheck])

  useEffect(() => {
    registerScaleControls?.({
      canAddHex: fixedHex === undefined,
      canAddTrap: fixedTrap === undefined,
      onAddHex: () => updateHexCount((count) => count + 1),
      onAddTrap: () => updateTrapCount((count) => count + 1),
    })
    return () => registerScaleControls?.(null)
  }, [fixedHex, fixedTrap, registerScaleControls])

  return (
    <div className="flex w-full max-w-4xl flex-col items-center gap-3 pb-6 sm:gap-6 sm:pb-24">
      <div className="w-full p-2">
        <div
          ref={scaleContainerRef}
          className="relative mx-auto h-56 w-full max-w-2xl overflow-hidden rounded-2xl border border-secondary/20 bg-surface/70 sm:h-80"
        >
          <div className="absolute left-1/2 top-0 z-10 h-[82px] w-1 -translate-x-1/2 bg-primary/70" />
          <div className="absolute left-1/2 top-[106px] h-14 w-12 -translate-x-1/2 rounded-t-full bg-primary/10" />

          <div className="absolute left-1/2 top-[102px] h-12 w-16 -translate-x-1/2 overflow-hidden rounded-b-[28px] border border-primary/20 bg-white/60">
            <motion.div
              className="absolute bottom-0 left-[-20%] h-6 w-[140%] bg-sky-300/70"
              animate={{ rotate: beamAngle * 0.85, y: -spillStrength * 2 }}
              transition={{ type: 'spring', stiffness: 180, damping: 18 }}
              style={{ transformOrigin: 'center bottom' }}
            />
          </div>
          {spillDirection !== 0 ? (
            <motion.div
              className={`absolute top-[116px] h-32 w-2 rounded-full bg-sky-300/70 ${
                spillDirection > 0 ? 'left-[52%]' : 'right-[52%]'
              }`}
              animate={{
                opacity: [0.35, 0.85, 0.45],
                scaleY: [0.6, 1.12, 0.8],
                x: [0, spillDirection * 5, spillDirection * 2],
              }}
              transition={{ duration: 1.05, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
            />
          ) : null}

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
                updateHexCount((count) => count + 1)
              }
            }}
          >
            <div className="mx-auto h-16 w-px bg-primary/60" />
            <div className="flex flex-col items-center gap-1">
              {Array.from({ length: effectiveHexCount }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    updateHexCount((count) => count - 1)
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
                updateTrapCount((count) => count + 1)
              }
            }}
          >
            <div className="mx-auto h-16 w-px bg-primary/60" />
            <div className="flex flex-col items-center gap-0.5">
              {Array.from({ length: effectiveTrapCount }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    updateTrapCount((count) => count - 1)
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
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default StepScaleBalance
