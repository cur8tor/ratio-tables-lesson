import Hexagon from './Hexagon'
import Trapezoid from './Trapezoid'

type DropZoneProps = {
  size?: number
  placedDirections: Array<'up' | 'down'>
  onDrop: () => void
  label: string
}

const DropZone = ({ size = 28, placedDirections, onDrop, label }: DropZoneProps) => {
  return (
    <button
      type="button"
      onClick={onDrop}
      className="relative h-24 w-24 rounded-xl border border-secondary/20 bg-surface/60 transition hover:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/40"
      aria-label={label}
    >
      <Hexagon size={size} className="h-full w-full" stroke="#1F2937" />
      {placedDirections.map((direction, index) => (
        <Trapezoid
          key={`${direction}-${index}`}
          size={size}
          direction={direction}
          stroke="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
        />
      ))}
    </button>
  )
}

export default DropZone
