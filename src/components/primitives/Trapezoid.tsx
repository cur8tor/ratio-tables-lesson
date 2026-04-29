import {
  pointsToString,
  trapezoidPoints,
  type TrapezoidDirection,
} from '../../lib/geometry'

type TrapezoidProps = {
  size?: number
  fill?: string
  stroke?: string
  strokeWidth?: number
  direction?: TrapezoidDirection
  className?: string
}

const Trapezoid = ({
  size = 24,
  fill = '#DC2626',
  stroke = '#1F2937',
  strokeWidth = 1.5,
  direction = 'up',
  className,
}: TrapezoidProps) => {
  const h = size * (Math.sqrt(3) / 2)

  return (
    <svg
      viewBox={`${-size - 1} ${-h - 1} ${size * 2 + 2} ${h * 2 + 2}`}
      className={className}
      aria-hidden="true"
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
