import { hexagonPoints, pointsToString } from '../../lib/geometry'

type HexagonProps = {
  size?: number
  fill?: string
  stroke?: string
  strokeWidth?: number
  className?: string
}

const Hexagon = ({
  size = 24,
  fill = 'none',
  stroke = '#1F2937',
  strokeWidth = 1.5,
  className,
}: HexagonProps) => {
  const h = size * (Math.sqrt(3) / 2)

  return (
    <svg
      viewBox={`${-size - 1} ${-h - 1} ${size * 2 + 2} ${h * 2 + 2}`}
      className={className}
      aria-hidden="true"
    >
      <polygon
        points={pointsToString(hexagonPoints(size))}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    </svg>
  )
}

export default Hexagon
