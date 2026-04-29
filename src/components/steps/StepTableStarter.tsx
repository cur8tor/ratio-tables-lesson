import { useEffect, useState } from 'react'
import Hexagon from '../primitives/Hexagon'
import NumberInput, { type InputStatus } from '../primitives/NumberInput'
import Trapezoid from '../primitives/Trapezoid'
import type { StepComponentProps } from './types'

const StepTableStarter = ({ onReadyChange, onCorrect }: StepComponentProps) => {
  const [value, setValue] = useState('')
  const [status, setStatus] = useState<InputStatus>('idle')
  const [solved, setSolved] = useState(false)

  useEffect(() => {
    onReadyChange(false)
  }, [onReadyChange])

  const submit = () => {
    if (!solved && Number(value) === 2) {
      setStatus('correct')
      setSolved(true)
      onReadyChange(true)
      window.setTimeout(onCorrect, 350)
      return
    }
    setStatus('wrong')
  }

  return (
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
                <Hexagon size={10} fill="#FFD63B" className="h-6 w-6" />
              </div>
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center justify-center gap-0.5">
                <Trapezoid size={8} fit="tight" direction="up" className="h-3 w-5" />
                <Trapezoid size={8} fit="tight" direction="down" className="h-3 w-5" />
              </div>
            </td>
          </tr>
          <tr>
            <td className="border-r border-secondary/15 px-4 py-3">1</td>
            <td className="px-4 py-3">
              <NumberInput
                value={value}
                onChange={(next) => {
                  setValue(next)
                  setStatus('idle')
                }}
                onSubmit={submit}
                status={status}
                ariaLabel="table trapezoid number"
                className="h-10 w-20 text-lg"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default StepTableStarter
