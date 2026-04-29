import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import RatioTable, { type Row } from '../lesson/RatioTable'
import COPFraction from '../primitives/COPFraction'
import type { InputStatus } from '../primitives/NumberInput'
import type { StepComponentProps } from './types'

const Step4TableWithCOP = ({ onReadyChange, onCorrect }: StepComponentProps) => {
  const [value, setValue] = useState('')
  const [status, setStatus] = useState<InputStatus>('idle')
  const [showCop, setShowCop] = useState(false)
  const [solved, setSolved] = useState(false)

  useEffect(() => {
    onReadyChange(false)
    const timer = window.setTimeout(() => setShowCop(true), 600)
    return () => window.clearTimeout(timer)
  }, [onReadyChange])

  const handleSubmit = () => {
    if (!solved && Number(value) === 10) {
      setStatus('correct')
      onReadyChange(true)
      setSolved(true)
      window.setTimeout(onCorrect, 350)
      return
    }
    setStatus('wrong')
  }

  const rows: Row[] = [
    {
      left: { kind: 'shape', shape: 'hex', count: 1 },
      right: { kind: 'shape', shape: 'trap', count: 2 },
    },
    {
      left: { kind: 'number', value: 3 },
      right: { kind: 'number', value: 6 },
    },
    {
      left: { kind: 'number', value: 5 },
      right: {
        kind: 'input',
        value,
        onChange: (next) => {
          setValue(next)
          setStatus('idle')
        },
        onSubmit: handleSubmit,
        status,
        correct: 10,
      },
    },
  ]

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <RatioTable rows={rows} />
      <AnimatePresence>
        {showCop ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <COPFraction numerator={2} denominator={1} label="trapezoids per hexagon" />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default Step4TableWithCOP
