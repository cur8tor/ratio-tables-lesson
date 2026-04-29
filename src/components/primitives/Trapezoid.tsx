import type { SVGProps } from 'react'
import {
  pointsToString,
  trapezoidPoints,
  type TrapezoidDirection,
} from '../../lib/geometry'

type TrapezoidProps = SVGProps<SVGSVGElement> & {
  size?: number
  fill?: string
  stroke?: string
  strokeWidth?: number
  direction?: TrapezoidDirection
  fit?: 'tight' | 'hex'
}

const Trapezoid = ({
  size = 24,
  fill = '#DC2626',
  stroke = '#1F2937',
  strokeWidth = 1.5,
  direction = 'up',
  fit = 'tight',
  className,
  ...rest
}: TrapezoidProps) => {
  const h = size * (Math.sqrt(3) / 2)
  const viewBox =
    fit === 'hex'
      ? `${-size - 1} ${-h - 1} ${size * 2 + 2} ${h * 2 + 2}`
      : direction === 'up'
        ? `${-size - 1} ${-h - 1} ${size * 2 + 2} ${h + 2}`
        : `${-size - 1} -1 ${size * 2 + 2} ${h + 2}`

  return (
    <svg
      viewBox={viewBox}
      className={className}
      aria-hidden="true"
      {...rest}
    >
      <polygon
        points={pointsToString(trapezoidPoints(size, direction))}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    </svg>
  )
}

export default Trapezoid
