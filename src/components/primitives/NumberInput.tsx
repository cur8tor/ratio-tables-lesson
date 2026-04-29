import { useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'

export type InputStatus = 'idle' | 'correct' | 'wrong'

type NumberInputProps = {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  status: InputStatus
  placeholder?: string
  className?: string
  ariaLabel?: string
}

const NumberInput = ({
  value,
  onChange,
  onSubmit,
  status,
  placeholder,
  className,
  ariaLabel,
}: NumberInputProps) => {
  const controls = useAnimation()

  useEffect(() => {
    if (status === 'wrong') {
      controls.start({
        x: [0, -8, 8, -6, 6, -4, 4, 0],
        transition: { duration: 0.25, ease: 'easeInOut' },
      })
    }

    if (status === 'correct') {
      controls.start({
        boxShadow: [
          '0 0 0 0 rgba(22, 163, 74, 0)',
          '0 0 0 3px rgba(22, 163, 74, 0.35)',
          '0 0 0 0 rgba(22, 163, 74, 0)',
        ],
        transition: { duration: 0.35, ease: 'easeOut' },
      })
    }
  }, [controls, status])

  const borderClass =
    status === 'correct'
      ? 'border-accent'
      : status === 'wrong'
        ? 'border-trap'
        : 'border-secondary/30'

  return (
    <motion.input
      type="number"
      value={value}
      aria-label={ariaLabel}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          onSubmit()
        }
        if (event.key === 'Escape') {
          onChange('')
        }
      }}
      animate={controls}
      placeholder={placeholder}
      className={`h-12 w-24 rounded-xl border bg-white px-3 text-center text-xl text-primary outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30 ${borderClass} ${className ?? ''}`}
    />
  )
}

export default NumberInput
