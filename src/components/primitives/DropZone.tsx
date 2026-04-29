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
    <div
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault()
        const marker = event.dataTransfer.getData('text/plain')
        if (marker) {
          onDrop()
        }
      }}
      className="relative h-24 w-24 rounded-xl border border-secondary/20 bg-surface transition hover:border-accent/60"
      aria-label={label}
    >
      <Hexagon size={size} className="h-full w-full" stroke="#1F2937" fill="none" />
      {placedDirections.map((direction, index) => (
        <Trapezoid
          key={`${direction}-${index}`}
          size={size}
          direction={direction}
          fit="hex"
          stroke="#1F2937"
          strokeWidth={1.2}
          className="pointer-events-none absolute inset-0 h-full w-full"
        />
      ))}
    </div>
  )
}

export default DropZone
